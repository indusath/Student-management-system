import { useState, useEffect } from "react";
import { Users, BookOpen, ClipboardList, FileText, TrendingUp, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { apiGet } from "@/lib/api";

// ─── Types ────────────────────────────────────────────────────────────────────
interface DashboardStats {
  totalStudents: number;
  activeCourses: number;
  totalEnrollments: number;
  auditActions: number;
}

interface RecentAction {
  action: string;
  details: string;
  timestamp: string;
  administrator: string;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate();
  const [activeAction, setActiveAction] = useState<string | null>(null);

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActions, setRecentActions] = useState<RecentAction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // GET YOUR_API_BASE_URL/dashboard/stats
        const statsData = await apiGet<DashboardStats>("/dashboard/stats");
        setStats(statsData);

        // GET YOUR_API_BASE_URL/audit-logs?limit=5
        const logsData = await apiGet<RecentAction[]>("/audit-logs?limit=5");
        setRecentActions(logsData);
      } catch {
        // API not connected yet – silently show empty state
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards = stats
    ? [
      { name: "Total Students", value: stats.totalStudents.toLocaleString(), icon: Users },
      { name: "Active Courses", value: stats.activeCourses.toLocaleString(), icon: BookOpen },
      { name: "Enrollments", value: stats.totalEnrollments.toLocaleString(), icon: ClipboardList },
      { name: "Audit Actions", value: stats.auditActions.toLocaleString(), icon: FileText },
    ]
    : [];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-description">
          Welcome back, Administrator. Here's an overview of the system.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-16 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))
          : statCards.map((stat) => (
            <Card key={stat.name}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
                    <p className="stat-value mt-1">{stat.value}</p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Button
          onClick={() => { setActiveAction("register"); navigate("/students/register"); }}
          variant={activeAction === "register" ? "default" : "outline"}
          className="h-auto py-4 flex flex-col gap-2"
        >
          <Users className="h-5 w-5" />
          <span>Register Student</span>
        </Button>
        <Button
          onClick={() => { setActiveAction("courses"); navigate("/courses"); }}
          variant={activeAction === "courses" ? "default" : "outline"}
          className="h-auto py-4 flex flex-col gap-2"
        >
          <BookOpen className="h-5 w-5" />
          <span>Manage Courses</span>
        </Button>
        <Button
          onClick={() => { setActiveAction("enrollment"); navigate("/enrollment"); }}
          variant={activeAction === "enrollment" ? "default" : "outline"}
          className="h-auto py-4 flex flex-col gap-2"
        >
          <ClipboardList className="h-5 w-5" />
          <span>Course Enrollment</span>
        </Button>
        <Button
          onClick={() => { setActiveAction("audit"); navigate("/audit-logs"); }}
          variant={activeAction === "audit" ? "default" : "outline"}
          className="h-auto py-4 flex flex-col gap-2"
        >
          <FileText className="h-5 w-5" />
          <span>View Audit Logs</span>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-10 bg-muted animate-pulse rounded" />
                ))}
              </div>
            ) : recentActions.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No recent activity</p>
            ) : (
              <div className="space-y-4">
                {recentActions.map((item, index) => (
                  <div key={index} className="flex items-start gap-3 pb-3 border-b border-border last:border-0 last:pb-0">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{item.action}</p>
                      <p className="text-sm text-muted-foreground truncate">{item.details}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(item.timestamp).toLocaleString()} by {item.administrator}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Admin Management */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Admin Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Create a new administrator account for the system.
            </p>
            <Button onClick={() => navigate("/admin/create")} className="w-full">
              <Users className="h-4 w-4 mr-2" />
              Create New Admin
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}