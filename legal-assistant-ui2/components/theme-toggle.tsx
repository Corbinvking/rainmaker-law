"use client"

import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <Sun className="h-5 w-5" />
        <Label htmlFor="theme-toggle">Light</Label>
      </div>
      <Switch
        id="theme-toggle"
        checked={theme === "dark"}
        onCheckedChange={(checked) => {
          setTheme(checked ? "dark" : "light")
        }}
      />
      <div className="flex items-center space-x-2">
        <Label htmlFor="theme-toggle">Dark</Label>
        <Moon className="h-5 w-5" />
      </div>
    </div>
  )
}

