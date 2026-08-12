import { useState } from "react";
import { Plus, Search, ShieldAlert, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const ROLES = ["Admin", "Teacher", "Student", "Advisor", "Parent"];

// Mock data
const MOCK_USERS = [
  { id: 1, name: "Alice Smith", email: "alice@example.com", role: "Admin", status: "Active" },
  { id: 2, name: "Bob Johnson", email: "bob@example.com", role: "Teacher", status: "Active" },
  { id: 3, name: "Charlie Brown", email: "charlie@example.com", role: "Student", status: "Inactive" },
  { id: 4, name: "Diana Prince", email: "diana@example.com", role: "Advisor", status: "Active" },
];

const PERMISSIONS = [
  { id: "view_users", label: "View Users" },
  { id: "edit_users", label: "Edit Users" },
  { id: "manage_roles", label: "Manage Roles" },
  { id: "view_reports", label: "View Reports" },
  { id: "edit_reports", label: "Edit Reports" },
];

export default function AccountsPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = MOCK_USERS.filter(user => 
    (activeTab === "All" || user.role === activeTab) &&
    (user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     user.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <UserCog className="h-8 w-8 text-primary" />
            Accounts & Permissions
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage user accounts, assign roles, and configure specific permissions.
          </p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-foreground shadow-lg shadow-primary/20 transition-all hover:scale-105">
              <Plus className="mr-2 h-4 w-4" /> Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] bg-card border-border text-foreground">
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Add a new user to the system and assign their permissions.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input id="name" placeholder="John Doe" className="col-span-3 bg-secondary/50 border-border" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">Email</Label>
                <Input id="email" placeholder="john@example.com" className="col-span-3 bg-secondary/50 border-border" />
              </div>
              
              <div className="mt-4">
                <h4 className="mb-4 text-sm font-medium leading-none flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-500"/> Specific Permissions
                </h4>
                <div className="grid grid-cols-2 gap-4 bg-secondary/50 p-4 rounded-lg border border-border">
                  {PERMISSIONS.map((perm) => (
                    <div key={perm.id} className="flex items-center space-x-2">
                      <Checkbox id={perm.id} className="border-border data-[state=checked]:bg-primary" />
                      <label htmlFor={perm.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {perm.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <Button variant="outline" className="border-border text-muted-foreground hover:bg-secondary hover:text-foreground">Cancel</Button>
              <Button className="bg-primary text-foreground hover:bg-primary/90">Create Account</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="glass rounded-xl p-4 sm:p-6 border border-border">
        <Tabs defaultValue="All" onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <TabsList className="bg-card/50 border border-white/5">
              <TabsTrigger value="All" className="data-[state=active]:bg-primary data-[state=active]:text-foreground">All Users</TabsTrigger>
              {ROLES.map(role => (
                <TabsTrigger key={role} value={role} className="data-[state=active]:bg-primary data-[state=active]:text-foreground">
                  {role}s
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="pl-9 bg-card/50 border-border text-foreground placeholder:text-slate-500 focus-visible:ring-primary/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-md border border-border overflow-hidden bg-card/30">
            <Table>
              <TableHeader className="bg-card/50">
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground font-semibold">Name</TableHead>
                  <TableHead className="text-muted-foreground font-semibold">Email</TableHead>
                  <TableHead className="text-muted-foreground font-semibold">Role</TableHead>
                  <TableHead className="text-muted-foreground font-semibold">Status</TableHead>
                  <TableHead className="text-right text-muted-foreground font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow className="border-border">
                    <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id} className="border-border hover:bg-secondary/50 transition-colors">
                      <TableCell className="font-medium text-foreground">{user.name}</TableCell>
                      <TableCell className="text-muted-foreground">{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="secondary" 
                          className={user.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-500/10 text-muted-foreground border-slate-500/20'}
                        >
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground hover:bg-secondary">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
