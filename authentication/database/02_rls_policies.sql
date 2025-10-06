-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================
-- These policies ensure users can only access their own data
-- and admins can manage all users
-- =====================================================

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PROFILES TABLE POLICIES
-- =====================================================

-- Policy: Users can view their own profile
CREATE POLICY "Users can view own profile"
    ON public.profiles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
    ON public.profiles
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Policy: Users can insert their own profile (for manual creation)
CREATE POLICY "Users can insert own profile"
    ON public.profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);

-- Policy: Service role can do everything (for admin operations)
CREATE POLICY "Service role has full access"
    ON public.profiles
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- =====================================================
-- ADMIN POLICIES (Optional - requires roles table)
-- =====================================================
-- Uncomment these if you're using the roles system

-- Policy: Admins can view all profiles
-- CREATE POLICY "Admins can view all profiles"
--     ON public.profiles
--     FOR SELECT
--     TO authenticated
--     USING (
--         EXISTS (
--             SELECT 1 FROM public.user_roles ur
--             JOIN public.roles r ON ur.role_id = r.id
--             WHERE ur.user_id = auth.uid()
--             AND r.name = 'admin'
--         )
--     );

-- Policy: Admins can update all profiles
-- CREATE POLICY "Admins can update all profiles"
--     ON public.profiles
--     FOR UPDATE
--     TO authenticated
--     USING (
--         EXISTS (
--             SELECT 1 FROM public.user_roles ur
--             JOIN public.roles r ON ur.role_id = r.id
--             WHERE ur.user_id = auth.uid()
--             AND r.name = 'admin'
--         )
--     )
--     WITH CHECK (
--         EXISTS (
--             SELECT 1 FROM public.user_roles ur
--             JOIN public.roles r ON ur.role_id = r.id
--             WHERE ur.user_id = auth.uid()
--             AND r.name = 'admin'
--         )
--     );

-- Policy: Admins can delete profiles
-- CREATE POLICY "Admins can delete profiles"
--     ON public.profiles
--     FOR DELETE
--     TO authenticated
--     USING (
--         EXISTS (
--             SELECT 1 FROM public.user_roles ur
--             JOIN public.roles r ON ur.role_id = r.id
--             WHERE ur.user_id = auth.uid()
--             AND r.name = 'admin'
--         )
--     );

-- =====================================================
-- PUBLIC PROFILE VIEWING (Optional)
-- =====================================================
-- Uncomment if you want profiles to be publicly viewable

-- Policy: Anyone can view active, approved profiles
-- CREATE POLICY "Public can view approved profiles"
--     ON public.profiles
--     FOR SELECT
--     TO anon, authenticated
--     USING (is_active = true AND is_approved = true);

-- =====================================================
-- HELPER FUNCTIONS FOR RLS
-- =====================================================

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM public.user_roles ur
        JOIN public.roles r ON ur.role_id = r.id
        WHERE ur.user_id = user_id
        AND r.name = 'admin'
    );
EXCEPTION
    WHEN OTHERS THEN
        RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has specific role
CREATE OR REPLACE FUNCTION public.has_role(
    role_name TEXT,
    user_id UUID DEFAULT auth.uid()
)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM public.user_roles ur
        JOIN public.roles r ON ur.role_id = r.id
        WHERE ur.user_id = user_id
        AND r.name = role_name
    );
EXCEPTION
    WHEN OTHERS THEN
        RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has any of the specified roles
CREATE OR REPLACE FUNCTION public.has_any_role(
    role_names TEXT[],
    user_id UUID DEFAULT auth.uid()
)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM public.user_roles ur
        JOIN public.roles r ON ur.role_id = r.id
        WHERE ur.user_id = user_id
        AND r.name = ANY(role_names)
    );
EXCEPTION
    WHEN OTHERS THEN
        RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has permission
CREATE OR REPLACE FUNCTION public.has_permission(
    permission_name TEXT,
    user_id UUID DEFAULT auth.uid()
)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM public.user_roles ur
        JOIN public.role_permissions rp ON ur.role_id = rp.role_id
        JOIN public.permissions p ON rp.permission_id = p.id
        WHERE ur.user_id = user_id
        AND p.name = permission_name
    );
EXCEPTION
    WHEN OTHERS THEN
        RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- GRANT PERMISSIONS ON HELPER FUNCTIONS
-- =====================================================

GRANT EXECUTE ON FUNCTION public.is_admin TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_any_role TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_permission TO authenticated;

-- =====================================================
-- TESTING RLS POLICIES
-- =====================================================
-- Use these queries to test your RLS policies

-- Test 1: User can view own profile
-- SET LOCAL ROLE authenticated;
-- SET LOCAL request.jwt.claims.sub TO 'user-uuid-here';
-- SELECT * FROM public.profiles WHERE id = 'user-uuid-here';

-- Test 2: User cannot view other profiles
-- SET LOCAL ROLE authenticated;
-- SET LOCAL request.jwt.claims.sub TO 'user-uuid-here';
-- SELECT * FROM public.profiles WHERE id != 'user-uuid-here';
-- Should return no rows

-- Test 3: User can update own profile
-- SET LOCAL ROLE authenticated;
-- SET LOCAL request.jwt.claims.sub TO 'user-uuid-here';
-- UPDATE public.profiles SET full_name = 'New Name' WHERE id = 'user-uuid-here';

-- Test 4: User cannot update other profiles
-- SET LOCAL ROLE authenticated;
-- SET LOCAL request.jwt.claims.sub TO 'user-uuid-here';
-- UPDATE public.profiles SET full_name = 'Hacked' WHERE id != 'user-uuid-here';
-- Should fail

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON FUNCTION public.is_admin IS 'Check if user has admin role';
COMMENT ON FUNCTION public.has_role IS 'Check if user has specific role';
COMMENT ON FUNCTION public.has_any_role IS 'Check if user has any of the specified roles';
COMMENT ON FUNCTION public.has_permission IS 'Check if user has specific permission';

-- =====================================================
-- SECURITY NOTES
-- =====================================================
-- 
-- 1. Always test RLS policies before deploying to production
-- 2. Use service_role key only in server-side code
-- 3. Never expose service_role key to client
-- 4. Regularly audit RLS policies for security issues
-- 5. Use SECURITY DEFINER carefully - it bypasses RLS
-- 6. Test with different user roles and permissions
-- 7. Monitor failed policy checks in logs
-- 8. Keep policies simple and maintainable
-- 9. Document any complex policy logic
-- 10. Review policies when adding new features

