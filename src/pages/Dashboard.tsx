import { useState } from "react";
import { Users, BookOpen, ClipboardList, FileText, TrendingUp, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const stats = [
  { name: "Total Students", value: "1,247", icon: Users, change: "+12 this month" },
  { name: "Active Courses", value: "48", icon: BookOpen, change: "3 new this semester" },
  { name: "Enrollments", value: "3,892", icon: ClipboardList, change: "+156 this week" },
  { name: "Audit Actions", value: "847", icon: FileText, change: "Today: 23" },
];

const recentActions = [
  { action: "Student registered", details: "John Perera (SE/2024/001)", time: "2 minutes ago", admin: "Admin" },
  { action: "Course enrollment", details: "Database Systems - 5 students", time: "15 minutes ago", admin: "Admin" },
  { action: "Course updated", details: "Software Engineering II", time: "1 hour ago", admin: "Admin" },
  { action: "Student updated", details: "Mary Silva (SE/2023/045)", time: "2 hours ago", admin: "Admin" },
  { action: "New course added", details: "Cloud Computing", time: "Yesterday", admin: "Admin" },
];

const upcomingTasks = [
  { task: "Review pending enrollments", count: 12, priority: "high" },
  { task: "Update course catalog", count: 3, priority: "medium" },
  { task: "Student data verification", count: 28, priority: "low" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeAction, setActiveAction] = useState<string | null>(null);

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
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
                  <p className="stat-value mt-1">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
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
            <div className="space-y-4">
              {recentActions.map((item, index) => (
                <div key={index} className="flex items-start gap-3 pb-3 border-b border-border last:border-0 last:pb-0">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{item.action}</p>
                    <p className="text-sm text-muted-foreground truncate">{item.details}</p>
                    <p className="text-xs text-muted-foreground mt-1">{item.time} by {item.admin}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Pending Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingTasks.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="text-sm font-medium">{item.task}</p>
                    <p className="text-xs text-muted-foreground">{item.count} items pending</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    item.priority === 'high' ? 'bg-destructive/10 text-destructive' :
                    item.priority === 'medium' ? 'bg-warning/10 text-warning' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {item.priority}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}