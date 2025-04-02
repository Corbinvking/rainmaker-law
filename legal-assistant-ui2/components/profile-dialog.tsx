"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  CalendarIcon,
  BarChart3,
  FileText,
  Users,
  Award,
  Edit,
  Download,
  LogOut,
} from "lucide-react"

interface ProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProfileDialog({ open, onOpenChange }: ProfileDialogProps) {
  const [date, setDate] = useState<Date | undefined>(new Date())

  // Mock data for the lawyer profile
  const lawyer = {
    name: "Alex Johnson",
    title: "Senior Partner",
    email: "alex.johnson@legalfirm.com",
    phone: "(555) 123-4567",
    address: "123 Legal Street, New York, NY 10001",
    avatar: "/placeholder.svg?height=128&width=128",
    specializations: ["Corporate Law", "Intellectual Property", "Mergers & Acquisitions"],
    bio: "Alex Johnson is a senior partner with over 15 years of experience in corporate law and intellectual property. Specializing in complex business transactions and litigation, Alex has successfully represented Fortune 500 companies and startups alike.",
    stats: {
      billableHours: {
        current: 124.5,
        target: 160,
        lastMonth: 168.2,
        ytd: 1240,
      },
      activeClients: 12,
      activeCases: 18,
      completedCases: 245,
      winRate: 92,
    },
  }

  // Mock data for appointments
  const appointments = [
    {
      id: "1",
      client: "John Smith",
      title: "Contract Review",
      date: "2025-03-31",
      time: "10:00 AM",
      duration: "1 hour",
    },
    {
      id: "2",
      client: "Sarah Johnson",
      title: "Case Strategy Meeting",
      date: "2025-03-31",
      time: "2:00 PM",
      duration: "1.5 hours",
    },
    {
      id: "3",
      client: "Michael Brown",
      title: "Deposition Preparation",
      date: "2025-04-01",
      time: "11:00 AM",
      duration: "2 hours",
    },
    {
      id: "4",
      client: "Emily Davis",
      title: "Settlement Discussion",
      date: "2025-04-02",
      time: "3:30 PM",
      duration: "1 hour",
    },
  ]

  // Filter appointments for the selected date
  const selectedDateStr = date?.toISOString().split("T")[0]
  const todaysAppointments = appointments.filter((app) => app.date === selectedDateStr)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="bg-gradient-to-r from-background to-muted/30 pb-4">
          <DialogTitle className="text-2xl">Lawyer Profile</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="flex flex-col md:flex-row gap-6 mt-4">
              {/* Profile Card */}
              <Card className="shadow-lg hover:shadow-xl transition-all border-t border-t-primary/10 md:w-1/3">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="h-24 w-24 mb-4 ring-2 ring-primary/20 ring-offset-2 shadow-md">
                      <AvatarImage src={lawyer.avatar} alt={lawyer.name} />
                      <AvatarFallback>
                        {lawyer.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-bold">{lawyer.name}</h3>
                    <p className="text-muted-foreground">{lawyer.title}</p>

                    <div className="flex flex-wrap justify-center gap-1 mt-3">
                      {lawyer.specializations.map((spec, i) => (
                        <Badge key={i} variant="secondary">
                          {spec}
                        </Badge>
                      ))}
                    </div>

                    <div className="w-full mt-6 space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{lawyer.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{lawyer.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{lawyer.address}</span>
                      </div>
                    </div>

                    <div className="w-full mt-6 space-y-2">
                      <Button variant="outline" className="w-full">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => {
                          if (typeof window !== "undefined") {
                            localStorage.removeItem("isAuthenticated")
                            localStorage.removeItem("userEmail")
                            localStorage.removeItem("rememberMe")
                            window.location.href = "/login"
                          }
                        }}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stats Cards */}
              <div className="md:w-2/3 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="shadow-lg hover:shadow-xl transition-all border-t border-t-primary/10">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Billable Hours (Month)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {lawyer.stats.billableHours.current} / {lawyer.stats.billableHours.target}
                      </div>
                      <Progress
                        value={(lawyer.stats.billableHours.current / lawyer.stats.billableHours.target) * 100}
                        className="h-2 mt-2"
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        {((lawyer.stats.billableHours.current / lawyer.stats.billableHours.target) * 100).toFixed(1)}%
                        of monthly target
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="shadow-lg hover:shadow-xl transition-all border-t border-t-primary/10">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Year-to-Date Hours</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{lawyer.stats.billableHours.ytd}</div>
                      <div className="flex items-center mt-2">
                        <Clock className="h-4 w-4 text-muted-foreground mr-1" />
                        <p className="text-xs text-muted-foreground">
                          {lawyer.stats.billableHours.lastMonth} hours last month
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="shadow-lg hover:shadow-xl transition-all border-t border-t-primary/10">
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center">
                        <Users className="h-8 w-8 text-primary mb-2" />
                        <div className="text-xl font-bold">{lawyer.stats.activeClients}</div>
                        <p className="text-xs text-muted-foreground">Active Clients</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-lg hover:shadow-xl transition-all border-t border-t-primary/10">
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center">
                        <FileText className="h-8 w-8 text-primary mb-2" />
                        <div className="text-xl font-bold">{lawyer.stats.activeCases}</div>
                        <p className="text-xs text-muted-foreground">Active Cases</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-lg hover:shadow-xl transition-all border-t border-t-primary/10">
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center">
                        <Award className="h-8 w-8 text-primary mb-2" />
                        <div className="text-xl font-bold">{lawyer.stats.winRate}%</div>
                        <p className="text-xs text-muted-foreground">Win Rate</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-lg hover:shadow-xl transition-all border-t border-t-primary/10">
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center">
                        <BarChart3 className="h-8 w-8 text-primary mb-2" />
                        <div className="text-xl font-bold">{lawyer.stats.completedCases}</div>
                        <p className="text-xs text-muted-foreground">Completed Cases</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="shadow-lg hover:shadow-xl transition-all border-t border-t-primary/10">
                  <CardHeader>
                    <CardTitle>About</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{lawyer.bio}</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Calendar Tab */}
          <TabsContent value="calendar" className="space-y-4">
            <div className="flex flex-col md:flex-row gap-6">
              <Card className="shadow-lg hover:shadow-xl transition-all border-t border-t-primary/10 md:w-1/2">
                <CardHeader>
                  <CardTitle>Calendar</CardTitle>
                  <CardDescription>View and manage your appointments</CardDescription>
                </CardHeader>
                <CardContent>
                  <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
                </CardContent>
              </Card>

              <Card className="shadow-lg hover:shadow-xl transition-all border-t border-t-primary/10 md:w-1/2">
                <CardHeader>
                  <CardTitle>
                    {date ? (
                      <>
                        Appointments for{" "}
                        {date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                      </>
                    ) : (
                      <>Select a date</>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {todaysAppointments.length > 0 ? (
                    <div className="space-y-4">
                      {todaysAppointments.map((appointment) => (
                        <div key={appointment.id} className="flex items-start space-x-4 rounded-md border p-4">
                          <CalendarIcon className="h-5 w-5 text-primary mt-0.5" />
                          <div className="space-y-1">
                            <p className="font-medium">{appointment.title}</p>
                            <p className="text-sm text-muted-foreground">Client: {appointment.client}</p>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock className="h-3.5 w-3.5 mr-1" />
                              <span>
                                {appointment.time} ({appointment.duration})
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-40 text-center">
                      <CalendarIcon className="h-10 w-10 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">No appointments scheduled for this day</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="shadow-lg hover:shadow-xl transition-all border-t border-t-primary/10">
                <CardHeader>
                  <CardTitle>Billable Hours</CardTitle>
                  <CardDescription>Monthly breakdown</CardDescription>
                </CardHeader>
                <CardContent className="h-80 flex items-center justify-center">
                  <BarChart3 className="h-40 w-40 text-muted-foreground" />
                </CardContent>
              </Card>

              <Card className="shadow-lg hover:shadow-xl transition-all border-t border-t-primary/10">
                <CardHeader>
                  <CardTitle>Case Distribution</CardTitle>
                  <CardDescription>By practice area</CardDescription>
                </CardHeader>
                <CardContent className="h-80 flex items-center justify-center">
                  <BarChart3 className="h-40 w-40 text-muted-foreground" />
                </CardContent>
              </Card>

              <Card className="shadow-lg hover:shadow-xl transition-all border-t border-t-primary/10 md:col-span-2">
                <CardHeader>
                  <CardTitle>Performance Report</CardTitle>
                  <CardDescription>Download detailed reports</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 border rounded-md">
                      <div>
                        <h4 className="font-medium">Monthly Performance Report</h4>
                        <p className="text-sm text-muted-foreground">March 2025</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>

                    <div className="flex justify-between items-center p-4 border rounded-md">
                      <div>
                        <h4 className="font-medium">Quarterly Performance Report</h4>
                        <p className="text-sm text-muted-foreground">Q1 2025</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>

                    <div className="flex justify-between items-center p-4 border rounded-md">
                      <div>
                        <h4 className="font-medium">Annual Performance Report</h4>
                        <p className="text-sm text-muted-foreground">2024</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card className="shadow-lg hover:shadow-xl transition-all border-t border-t-primary/10">
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>Manage your account settings and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Settings panel would go here with options for:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-muted-foreground">
                  <li>Personal information</li>
                  <li>Notification preferences</li>
                  <li>Calendar integration</li>
                  <li>Security settings</li>
                  <li>Billing preferences</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

