import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CalendarDays, FileText, MessageSquare, BarChart3, Users, Briefcase, Scale } from "lucide-react"

export function Dashboard() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card className="shadow-lg hover:shadow-xl transition-all border-t border-t-primary/10">
        <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gradient-to-r from-background to-muted/30">
          <CardTitle className="text-sm font-medium">Active Matters</CardTitle>
          <Briefcase className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">12</div>
          <p className="text-xs text-muted-foreground">3 require immediate attention</p>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Contract</span>
              <span>5 matters</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Litigation</span>
              <span>7 matters</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg hover:shadow-xl transition-all border-t border-t-primary/10">
        <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gradient-to-r from-background to-muted/30">
          <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">8</div>
          <p className="text-xs text-muted-foreground">+2 new this month</p>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Corporate</span>
              <span>3 clients</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Individual</span>
              <span>5 clients</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg hover:shadow-xl transition-all border-t border-t-primary/10">
        <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gradient-to-r from-background to-muted/30">
          <CardTitle className="text-sm font-medium">Recent Documents</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">24</div>
          <p className="text-xs text-muted-foreground">8 uploaded this week</p>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Contracts</span>
              <span>10 documents</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Legal Briefs</span>
              <span>6 documents</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg hover:shadow-xl transition-all border-t border-t-primary/10">
        <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gradient-to-r from-background to-muted/30">
          <CardTitle className="text-sm font-medium">AI Conversations</CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">15</div>
          <p className="text-xs text-muted-foreground">3 new conversations today</p>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Document Drafting</span>
              <span>7 conversations</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Legal Research</span>
              <span>8 conversations</span>
            </div>
          </div>
        </CardContent>
      </Card>

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
          <CardTitle className="text-sm font-medium">Document Templates</CardTitle>
          <Scale className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">10</div>
          <p className="text-xs text-muted-foreground">2 custom templates</p>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Contracts</span>
              <span>4 templates</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Litigation</span>
              <span>6 templates</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 shadow-lg hover:shadow-xl transition-all border-t border-t-primary/10">
        <CardHeader className="bg-gradient-to-r from-background to-muted/30">
          <CardTitle>Hours Logged</CardTitle>
          <CardDescription>Your billable hours this month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">Total Hours</p>
                <div className="text-2xl font-bold">124.5</div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Target</p>
                <div className="text-2xl font-bold">160</div>
              </div>
            </div>
            <Progress value={78} className="h-2" />
            <div className="text-xs text-muted-foreground">78% of monthly target</div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div>
                <p className="text-sm font-medium mb-1">Hours by Matter Type</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Contract</span>
                    <span>45.5 hours</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Litigation</span>
                    <span>62.0 hours</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Corporate</span>
                    <span>17.0 hours</span>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Hours by Client</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Smith Enterprises</span>
                    <span>32.5 hours</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Johnson LLC</span>
                    <span>28.0 hours</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Other Clients</span>
                    <span>64.0 hours</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-3 shadow-lg hover:shadow-xl transition-all border-t border-t-primary/10">
        <CardHeader className="bg-gradient-to-r from-background to-muted/30">
          <CardTitle>Matter Distribution</CardTitle>
          <CardDescription>By practice area and status</CardDescription>
        </CardHeader>
        <CardContent className="h-[200px] flex items-center justify-center">
          <BarChart3 className="h-32 w-32 text-muted-foreground" />
        </CardContent>
      </Card>
    </div>
  )
}

