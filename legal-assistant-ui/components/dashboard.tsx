import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays, FileText, MessageSquare, Clock, BarChart3 } from "lucide-react"

export function Dashboard() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card className="shadow-lg hover:shadow-xl transition-all border-t border-t-primary/10">
        <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gradient-to-r from-background to-muted/30">
          <CardTitle className="text-sm font-medium">Upcoming Deadlines</CardTitle>
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">5</div>
          <p className="text-xs text-muted-foreground">+2 deadlines this week</p>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Smith v. Johnson</span>
              <span className="text-red-500">Tomorrow</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Davis Contract Review</span>
              <span>In 3 days</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg hover:shadow-xl transition-all border-t border-t-primary/10">
        <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gradient-to-r from-background to-muted/30">
          <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">12</div>
          <p className="text-xs text-muted-foreground">3 require immediate attention</p>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Corporate</span>
              <span>5 cases</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Litigation</span>
              <span>7 cases</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg hover:shadow-xl transition-all border-t border-t-primary/10">
        <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gradient-to-r from-background to-muted/30">
          <CardTitle className="text-sm font-medium">Recent Messages</CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">8</div>
          <p className="text-xs text-muted-foreground">3 unread messages</p>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>John Smith</span>
              <span>2 hours ago</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Sarah Johnson</span>
              <span>Yesterday</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 shadow-lg hover:shadow-xl transition-all border-t border-t-primary/10">
        <CardHeader className="bg-gradient-to-r from-background to-muted/30">
          <CardTitle>Hours Logged</CardTitle>
          <CardDescription>Your billable hours this month</CardDescription>
        </CardHeader>
        <CardContent className="h-[200px] flex items-center justify-center">
          <div className="flex items-center space-x-4">
            <Clock className="h-10 w-10 text-primary" />
            <div>
              <div className="text-3xl font-bold">124.5</div>
              <div className="text-sm text-muted-foreground">Billable hours</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg hover:shadow-xl transition-all border-t border-t-primary/10">
        <CardHeader className="bg-gradient-to-r from-background to-muted/30">
          <CardTitle>Case Distribution</CardTitle>
          <CardDescription>By practice area</CardDescription>
        </CardHeader>
        <CardContent className="h-[200px] flex items-center justify-center">
          <BarChart3 className="h-32 w-32 text-muted-foreground" />
        </CardContent>
      </Card>
    </div>
  )
}

