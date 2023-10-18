import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import OverviewTab from "./overviewTab"

export default function AdminTabs() {
  return (
    <Tabs defaultValue="account" className="w-full mt-5">
      <TabsList className="grid w-[250px] grid-cols-2">
        <TabsTrigger value="account">Overview</TabsTrigger>
        <TabsTrigger value="password">Analytics</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <OverviewTab />
      </TabsContent>
      <TabsContent value="password">
        
      </TabsContent>
    </Tabs>
  )
}
