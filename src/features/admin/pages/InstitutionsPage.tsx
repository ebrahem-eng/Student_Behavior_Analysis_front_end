import { useState } from "react";
import { Building, Plus, Search, MapPin, Edit, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock data
const MOCK_INSTITUTIONS = [
  { id: 1, name: "Global Tech University", type: "University", location: "New York, USA", students: 12500, status: "Active" },
  { id: 2, name: "Lincoln High School", type: "School", location: "London, UK", students: 850, status: "Active" },
  { id: 3, name: "Westside Academy", type: "School", location: "California, USA", students: 1200, status: "Maintenance" },
];

export default function InstitutionsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredInstitutions = MOCK_INSTITUTIONS.filter(inst => 
    inst.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    inst.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Building className="h-8 w-8 text-primary" />
            Institution Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Create and configure schools and universities in the system.
          </p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-foreground shadow-lg shadow-primary/20 transition-all hover:scale-105">
              <Plus className="mr-2 h-4 w-4" /> Add Institution
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] bg-card border-border text-foreground">
            <DialogHeader>
              <DialogTitle>Create New Institution</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Set up a new educational institution and its foundational structure.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="inst-name" className="text-right">Name</Label>
                <Input id="inst-name" placeholder="E.g. Oxford High School" className="col-span-3 bg-secondary/50 border-border" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="inst-type" className="text-right">Type</Label>
                <Select>
                  <SelectTrigger className="col-span-3 bg-secondary/50 border-border text-foreground">
                    <SelectValue placeholder="Select institution type" />
                  </SelectTrigger>
                  <SelectContent className="bg-muted border-border text-foreground">
                    <SelectItem value="school">K-12 School</SelectItem>
                    <SelectItem value="university">University / College</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="location" className="text-right">Location</Label>
                <Input id="location" placeholder="City, Country" className="col-span-3 bg-secondary/50 border-border" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <Button variant="outline" className="border-border text-muted-foreground hover:bg-secondary hover:text-foreground">Cancel</Button>
              <Button className="bg-primary text-foreground hover:bg-primary/90">Create</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="glass rounded-xl p-4 sm:p-6 border border-border">
        <div className="relative w-full sm:w-96 mb-6">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or location..."
            className="pl-9 bg-card/50 border-border text-foreground placeholder:text-slate-500 focus-visible:ring-primary/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInstitutions.length === 0 ? (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              No institutions found.
            </div>
          ) : (
            filteredInstitutions.map((inst) => (
              <Card key={inst.id} className="bg-card/50 border-border hover:border-primary/50 transition-all duration-300 group">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <Badge variant="outline" className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 mb-2">
                      {inst.type}
                    </Badge>
                    <Badge 
                      variant="secondary" 
                      className={inst.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-transparent' : 'bg-amber-500/10 text-amber-400 border-transparent'}
                    >
                      {inst.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl text-foreground group-hover:text-primary transition-colors">{inst.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1 text-muted-foreground mt-2">
                    <MapPin className="w-3 h-3" /> {inst.location}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center text-sm mb-6">
                    <span className="text-slate-500">Total Students</span>
                    <span className="text-foreground font-medium">{inst.students.toLocaleString()}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" className="w-full bg-secondary/50 border-border text-muted-foreground hover:bg-secondary hover:text-foreground">
                      <Settings2 className="w-4 h-4 mr-2" /> Configure
                    </Button>
                    <Button variant="outline" className="w-full bg-secondary/50 border-border text-muted-foreground hover:bg-secondary hover:text-foreground">
                      <Edit className="w-4 h-4 mr-2" /> Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
