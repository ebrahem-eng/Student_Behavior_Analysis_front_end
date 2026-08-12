import { Download, FileText, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ExportButtonProps {
  onExportPdf?: () => void;
  onExportExcel?: () => void;
  className?: string;
  variant?: "default" | "outline" | "secondary" | "ghost";
}

export function ExportButton({ 
  onExportPdf, 
  onExportExcel, 
  className = "",
  variant = "outline" 
}: ExportButtonProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} className={className}>
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40 bg-slate-900 border-white/10 text-white">
        <DropdownMenuItem 
          onClick={onExportPdf} 
          disabled={!onExportPdf}
          className="focus:bg-white/10 cursor-pointer"
        >
          <FileText className="w-4 h-4 mr-2 text-rose-400" />
          PDF Document
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={onExportExcel} 
          disabled={!onExportExcel}
          className="focus:bg-white/10 cursor-pointer"
        >
          <FileSpreadsheet className="w-4 h-4 mr-2 text-emerald-400" />
          Excel Spreadsheet
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
