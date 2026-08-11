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
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <Building className="h-8 w-8 text-primary" />
            Institution Management
          </h1>
          <p className="text-slate-400 mt-1">
            Create and configure schools and universities in the system.
          </p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all hover:scale-105">
              <Plus className="mr-2 h-4 w-4" /> Add Institution
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] bg-slate-900 border-white/10 text-white">
            <DialogHeader>
              <DialogTitle>Create New Institution</DialogTitle>
              <DialogDescription className="text-slate-400">
                Set up a new educational institution and its foundational structure.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="inst-name" className="text-right">Name</Label>
                <Input id="inst-name" placeholder="E.g. Oxford High School" className="col-span-3 bg-white/5 border-white/10" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="inst-type" className="text-right">Type</Label>
                <Select>
                  <SelectTrigger className="col-span-3 bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Select institution type" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-white/10 text-white">
                    <SelectItem value="school">K-12 School</SelectItem>
                    <SelectItem value="university">University / College</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="location" className="text-right">Location</Label>
                <Input id="location" placeholder="City, Country" className="col-span-3 bg-white/5 border-white/10" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <Button variant="outline" className="border-white/10 text-slate-300 hover:bg-white/10 hover:text-white">Cancel</Button>
              <Button className="bg-primary text-white hover:bg-primary/90">Create</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="glass rounded-xl p-4 sm:p-6 border border-white/10">
        <div className="relative w-full sm:w-96 mb-6">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by name or location..."
            className="pl-9 bg-slate-900/50 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-primary/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInstitutions.length === 0 ? (
            <div className="col-span-full text-center py-12 text-slate-400">
              No institutions found.
            </div>
          ) : (
            filteredInstitutions.map((inst) => (
              <Card key={inst.id} className="bg-slate-900/50 border-white/10 hover:border-primary/50 transition-all duration-300 group">
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
                  <CardTitle className="text-xl text-white group-hover:text-primary transition-colors">{inst.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1 text-slate-400 mt-2">
                    <MapPin className="w-3 h-3" /> {inst.location}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center text-sm mb-6">
                    <span className="text-slate-500">Total Students</span>
                    <span className="text-white font-medium">{inst.students.toLocaleString()}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" className="w-full bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white">
                      <Settings2 className="w-4 h-4 mr-2" /> Configure
                    </Button>
                    <Button variant="outline" className="w-full bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white">
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
