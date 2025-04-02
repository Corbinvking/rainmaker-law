"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useTheme } from "next-themes"
import { Moon, Sun, Database, BellRing, Globe, Lock, FileText, Trash2, RefreshCw, Plus } from "lucide-react"

interface SettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const { theme, setTheme } = useTheme()

  // Mock integrations data
  const integrations = [
    {
      id: "1",
      name: "Google Calendar",
      description: "Sync your appointments with Google Calendar",
      connected: true,
      icon: <Globe className="h-8 w-8 text-primary" />,
    },
    {
      id: "2",
      name: "Dropbox",
      description: "Connect to Dropbox for document storage",
      connected: true,
      icon: <Database className="h-8 w-8 text-primary" />,
    },
    {
      id: "3",
      name: "Microsoft 365",
      description: "Integrate with Microsoft 365 suite",
      connected: false,
      icon: <FileText className="h-8 w-8 text-primary" />,
    },
    {
      id: "4",
      name: "Slack",
      description: "Receive notifications in Slack",
      connected: false,
      icon: <BellRing className="h-8 w-8 text-primary" />,
    },
  ]

  // Mock notification settings
  const notificationSettings = [
    { id: "email", label: "Email Notifications", enabled: true },
    { id: "app", label: "In-App Notifications", enabled: true },
    { id: "calendar", label: "Calendar Reminders", enabled: true },
    { id: "updates", label: "Product Updates", enabled: false },
    { id: "marketing", label: "Marketing Communications", enabled: false },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="bg-gradient-to-r from-background to-muted/30 pb-4">
          <DialogTitle className="text-2xl">Settings</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="appearance" className="mt-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          {/* Appearance Tab */}
          <TabsContent value="appearance" className="space-y-4">
            <Card className="shadow-lg hover:shadow-xl transition-all border-t border-t-primary/10">
              <CardHeader>
                <CardTitle>Theme</CardTitle>
                <CardDescription>Toggle between light and dark mode</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 rounded-lg border shadow-md bg-gradient-to-r from-background to-muted/30">
                  <div className="flex items-center space-x-2">
                    <Sun className="h-5 w-5 text-yellow-500" />
                    <Label htmlFor="theme-toggle" className="font-medium">
                      Light Mode
                    </Label>
                  </div>
                  <Switch
                    id="theme-toggle"
                    checked={theme === "dark"}
                    onCheckedChange={(checked) => {
                      setTheme(checked ? "dark" : "light")
                    }}
                  />
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="theme-toggle" className="font-medium">
                      Dark Mode
                    </Label>
                    <Moon className="h-5 w-5 text-blue-500" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Changes to the theme will be applied immediately across the entire application.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-all border-t border-t-primary/10">
              <CardHeader>
                <CardTitle>Interface Settings</CardTitle>
                <CardDescription>Customize your interface preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="compact-mode">Compact Mode</Label>
                  <Switch id="compact-mode" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="animations">Interface Animations</Label>
                  <Switch id="animations" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="sidebar-collapsed">Start with Sidebar Collapsed</Label>
                  <Switch id="sidebar-collapsed" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integrations Tab */}
          <TabsContent value="integrations" className="space-y-4">
            <Card className="shadow-lg hover:shadow-xl transition-all border-t border-t-primary/10">
              <CardHeader>
                <CardTitle>Connected Services</CardTitle>
                <CardDescription>Manage your external service integrations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  {integrations.map((integration) => (
                    <div key={integration.id} className="flex flex-col rounded-lg border p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-4">
                          {integration.icon}
                          <div>
                            <h4 className="font-medium">{integration.name}</h4>
                            <p className="text-sm text-muted-foreground">{integration.description}</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center">
                        {integration.connected ? (
                          <>
                            <div className="flex h-6 items-center">
                              <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                              <span className="text-xs text-muted-foreground">Connected</span>
                            </div>
                            <div className="ml-auto space-x-2">
                              <Button variant="outline" size="sm">
                                <RefreshCw className="h-3.5 w-3.5 mr-1" />
                                Sync
                              </Button>
                              <Button variant="outline" size="sm">
                                <Trash2 className="h-3.5 w-3.5 mr-1" />
                                Disconnect
                              </Button>
                            </div>
                          </>
                        ) : (
                          <Button className="ml-auto" size="sm">
                            <Plus className="h-3.5 w-3.5 mr-1" />
                            Connect
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button className="ml-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Integration
                </Button>
              </CardFooter>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-all border-t border-t-primary/10">
              <CardHeader>
                <CardTitle>API Access</CardTitle>
                <CardDescription>Manage API keys and access</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-md border p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Primary API Key</h4>
                        <p className="text-sm text-muted-foreground">Created on March 15, 2025</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Regenerate
                      </Button>
                    </div>
                    <div className="mt-2 flex items-center rounded-md bg-muted p-2">
                      <code className="text-sm">••••••••••••••••••••••••••••••</code>
                      <Button variant="ghost" size="sm" className="ml-auto h-8 w-8 p-0">
                        <span className="sr-only">Copy</span>
                        <FileText className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-4">
            <Card className="shadow-lg hover:shadow-xl transition-all border-t border-t-primary/10">
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Control how and when you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {notificationSettings.map((setting) => (
                  <div key={setting.id} className="flex items-center justify-between">
                    <Label htmlFor={setting.id}>{setting.label}</Label>
                    <Switch id={setting.id} defaultChecked={setting.enabled} />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-all border-t border-t-primary/10">
              <CardHeader>
                <CardTitle>Notification Schedule</CardTitle>
                <CardDescription>Set your working hours for notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label>Working Hours</Label>
                    <div className="flex items-center space-x-2">
                      <div className="grid flex-1 gap-2">
                        <Label htmlFor="from" className="sr-only">
                          From
                        </Label>
                        <select
                          id="from"
                          className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                        >
                          <option>9:00 AM</option>
                          <option>10:00 AM</option>
                          <option>11:00 AM</option>
                        </select>
                      </div>
                      <span>to</span>
                      <div className="grid flex-1 gap-2">
                        <Label htmlFor="to" className="sr-only">
                          To
                        </Label>
                        <select
                          id="to"
                          className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                        >
                          <option>5:00 PM</option>
                          <option>6:00 PM</option>
                          <option>7:00 PM</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Label htmlFor="do-not-disturb">Do Not Disturb Outside Working Hours</Label>
                    <Switch id="do-not-disturb" defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-4">
            <Card className="shadow-lg hover:shadow-xl transition-all border-t border-t-primary/10">
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                  </div>
                  <Switch id="two-factor" />
                </div>

                <Separator />

                <div>
                  <Label>Session Management</Label>
                  <div className="mt-2 rounded-md border">
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center space-x-4">
                        <Lock className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Current Session</p>
                          <p className="text-xs text-muted-foreground">New York, USA • Chrome on Windows</p>
                        </div>
                      </div>
                      <div className="flex h-5 items-center">
                        <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                        <span className="text-xs text-muted-foreground">Active Now</span>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center space-x-4">
                        <Lock className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Mobile App</p>
                          <p className="text-xs text-muted-foreground">iPhone 14 Pro • iOS 17</p>
                        </div>
                      </div>
                      <div className="flex h-5 items-center">
                        <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                        <span className="text-xs text-muted-foreground">Active Now</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="mt-2">
                    Sign Out All Other Devices
                  </Button>
                </div>

                <Separator />

                <div>
                  <Label>Password</Label>
                  <div className="mt-2">
                    <Button variant="outline">Change Password</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-all border-t border-t-primary/10">
              <CardHeader>
                <CardTitle>Data Privacy</CardTitle>
                <CardDescription>Manage your data and privacy settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="data-collection">Allow Data Collection for Improvements</Label>
                  <Switch id="data-collection" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="third-party">Share Data with Third-Party Services</Label>
                  <Switch id="third-party" />
                </div>
                <Button variant="outline" className="w-full">
                  Download My Data
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

