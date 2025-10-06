-- Email Configuration Table
-- Stores email service configuration (Brevo, SMTP, etc.)

CREATE TABLE IF NOT EXISTS public.email_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider TEXT NOT NULL DEFAULT 'brevo',
    smtp_host TEXT,
    smtp_port INTEGER DEFAULT 587,
    smtp_username TEXT,
    smtp_password TEXT,
    brevo_api_key TEXT,
    from_email TEXT NOT NULL,
    from_name TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on is_active for faster queries
CREATE INDEX IF NOT EXISTS idx_email_config_active ON public.email_config(is_active);

-- Enable RLS
ALTER TABLE public.email_config ENABLE ROW LEVEL SECURITY;

-- Only service role can access email configuration
CREATE POLICY "Service role can manage email config"
    ON public.email_config
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Admins can view email configuration (but not sensitive fields)
CREATE POLICY "Admins can view email config"
    ON public.email_config
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid()
            AND role_name IN ('super_admin', 'admin')
        )
    );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_email_config_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_email_config_updated_at
    BEFORE UPDATE ON public.email_config
    FOR EACH ROW
    EXECUTE FUNCTION public.update_email_config_updated_at();

-- Insert default configuration (optional)
INSERT INTO public.email_config (
    provider,
    smtp_host,
    smtp_port,
    from_email,
    from_name,
    is_active
) VALUES (
    'brevo',
    'smtp-relay.brevo.com',
    587,
    'your@email.com',
    'Your App Name',
    true
) ON CONFLICT DO NOTHING;

COMMENT ON TABLE public.email_config IS 'Email service configuration for transactional emails';
COMMENT ON COLUMN public.email_config.provider IS 'Email provider (brevo, smtp, sendgrid, etc.)';
COMMENT ON COLUMN public.email_config.is_active IS 'Whether this configuration is currently active';

