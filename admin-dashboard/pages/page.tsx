import { requireAdmin } from '@/lib/auth/server'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { LoadingLink } from '@/components/ui/LoadingLink'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Users,
  BookOpen,
  GraduationCap,
  TrendingUp,
  UserCheck,
  AlertCircle,
  Clock,
  BarChart3,
} from 'lucide-react'

export default async function AdminDashboard() {
  // Ensure user is admin
  const user = await requireAdmin()
  const supabase = await createClient()

  // Get comprehensive statistics
  const [
    usersCount,
    coursesCount,
    enrollmentsCount,
    pendingApprovalsCount,
    publishedCoursesCount,
    activeEnrollmentsCount,
  ] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase.from('courses').select('id', { count: 'exact', head: true }),
    supabase.from('enrollments').select('id', { count: 'exact', head: true }),
    supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('approval_status', 'pending'),
    supabase.from('courses').select('id', { count: 'exact', head: true }).eq('status', 'published'),
    supabase
      .from('enrollments')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'active'),
  ])

  // Get recent activity and pending items
  const [recentEnrollmentsData, pendingApprovalsData, recentProgressData] = await Promise.all([
    supabase
      .from('enrollments')
      .select(
        `
        id,
        enrolled_at,
        profiles(full_name, id),
        courses(title, slug)
      `
      )
      .order('enrolled_at', { ascending: false })
      .limit(5),

    supabase
      .from('profiles')
      .select('id, full_name, email, created_at')
      .eq('approval_status', 'pending')
      .order('created_at', { ascending: false })
      .limit(5),

    supabase
      .from('progress')
      .select(
        `
        id,
        updated_at,
        status,
        profiles(full_name),
        courses(title),
        chapters(title)
      `
      )
      .order('updated_at', { ascending: false })
      .limit(5),
  ])

  const recentEnrollments = recentEnrollmentsData.data
  const pendingApprovals = pendingApprovalsData.data
  const recentProgress = recentProgressData.data

  const stats = [
    {
      title: 'Total Users',
      value: usersCount.count || 0,
      change: '+12%',
      changeType: 'positive' as const,
      icon: Users,
      href: '/admin/users',
    },
    {
      title: 'Published Courses',
      value: publishedCoursesCount.count || 0,
      change: '+2',
      changeType: 'positive' as const,
      icon: BookOpen,
      href: '/admin/courses',
    },
    {
      title: 'Active Enrollments',
      value: activeEnrollmentsCount.count || 0,
      change: '+8%',
      changeType: 'positive' as const,
      icon: GraduationCap,
      href: '/admin/analytics',
    },
    {
      title: 'Pending Approvals',
      value: pendingApprovalsCount.count || 0,
      change: (pendingApprovalsCount.count || 0) > 0 ? 'Action needed' : 'All clear',
      changeType:
        (pendingApprovalsCount.count || 0) > 0 ? ('warning' as const) : ('positive' as const),
      icon: UserCheck,
      href: '/admin/users?filter=pending',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-card rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-card-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Overview and management of your learning management system
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" asChild className="shadow-sm">
              <LoadingLink href="/admin/users?filter=pending">
                <UserCheck className="h-4 w-4 mr-2" />
                Pending Approvals
              </LoadingLink>
            </Button>
            <Button variant="learning" asChild className="shadow-sm">
              <LoadingLink href="/teaching/courses/new">
                <BookOpen className="h-4 w-4 mr-2" />
                Create Course
              </LoadingLink>
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(stat => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p
                  className={`text-xs ${
                    stat.changeType === 'positive'
                      ? 'text-accent'
                      : stat.changeType === 'warning'
                        ? 'text-secondary'
                        : 'text-destructive'
                  }`}
                >
                  {stat.change}
                </p>
                <Link href={stat.href}>
                  <Button variant="ghost" size="sm" className="mt-2 h-8 px-2">
                    View Details
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Alerts and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              <span>Attention Required</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingApprovals && pendingApprovals.length > 0 ? (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-orange-900">Pending User Approvals</h4>
                    <p className="text-sm text-orange-700">
                      {pendingApprovals.length} users waiting for approval
                    </p>
                  </div>
                  <Button size="sm" asChild>
                    <Link href="/admin/users?filter=pending">Review</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span className="text-accent font-medium">All approvals up to date</span>
                </div>
              </div>
            )}

            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-primary">System Health</h4>
                  <p className="text-sm text-primary/80">All systems operational</p>
                </div>
                <Badge variant="secondary" className="bg-accent/10 text-accent">
                  Healthy
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-20 flex-col" asChild>
                <Link href="/admin/users">
                  <Users className="h-6 w-6 mb-2" />
                  <span>Manage Users</span>
                </Link>
              </Button>

              <Button variant="learning" className="h-20 flex-col" asChild>
                <Link href="/teaching/courses/new">
                  <BookOpen className="h-6 w-6 mb-2" />
                  <span>Create Course</span>
                </Link>
              </Button>

              <Button variant="outline" className="h-20 flex-col" asChild>
                <Link href="/admin/analytics">
                  <BarChart3 className="h-6 w-6 mb-2" />
                  <span>View Analytics</span>
                </Link>
              </Button>

              <Button variant="outline" className="h-20 flex-col" asChild>
                <Link href="/admin/settings">
                  <TrendingUp className="h-6 w-6 mb-2" />
                  <span>Settings</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Enrollments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <GraduationCap className="h-5 w-5" />
              <span>Recent Enrollments</span>
            </CardTitle>
            <CardDescription>Latest course enrollments</CardDescription>
          </CardHeader>
          <CardContent>
            {recentEnrollments && recentEnrollments.length > 0 ? (
              <div className="space-y-4">
                {recentEnrollments.map(enrollment => (
                  <div
                    key={enrollment.id}
                    className="flex items-center space-x-4 p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <GraduationCap className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">
                        {enrollment.profiles?.full_name || 'Unknown User'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {enrollment.courses?.title || 'Unknown Course'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        {new Date(enrollment.enrolled_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <GraduationCap className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-muted-foreground">No recent enrollments</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Recent Progress</span>
            </CardTitle>
            <CardDescription>Latest learning activity</CardDescription>
          </CardHeader>
          <CardContent>
            {recentProgress && recentProgress.length > 0 ? (
              <div className="space-y-4">
                {recentProgress.map(progress => (
                  <div
                    key={progress.id}
                    className="flex items-center space-x-4 p-3 bg-muted/50 rounded-lg"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        progress.status === 'completed'
                          ? 'bg-accent/10'
                          : progress.status === 'in_progress'
                            ? 'bg-primary/10'
                            : 'bg-muted'
                      }`}
                    >
                      <Clock
                        className={`h-5 w-5 ${
                          progress.status === 'completed'
                            ? 'text-accent'
                            : progress.status === 'in_progress'
                              ? 'text-primary'
                              : 'text-muted-foreground'
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">
                        {progress.profiles?.full_name || 'Unknown User'}
                      </p>
                      <p className="text-sm text-muted-foreground">{progress.chapters?.title}</p>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={
                          progress.status === 'completed'
                            ? 'default'
                            : progress.status === 'in_progress'
                              ? 'secondary'
                              : 'outline'
                        }
                        className="text-xs"
                      >
                        {progress.status.replace('_', ' ')}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(progress.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <TrendingUp className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-muted-foreground">No recent progress</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
