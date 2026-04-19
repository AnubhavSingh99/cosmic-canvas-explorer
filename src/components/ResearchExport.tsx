import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ResearchExportProps {
  title: string;
  sourceUrl?: string;
  sections: { heading: string; body: string }[];
  filename?: string;
}

const stripHtml = (s: string) => s.replace(/<[^>]*>/g, "").trim();

const ResearchExport = ({ title, sourceUrl, sections, filename }: ResearchExportProps) => {
  const { toast } = useToast();

  const handleExport = () => {
    const date = new Date().toISOString().split("T")[0];
    const lines: string[] = [
      `# ${title}`,
      ``,
      `_Exported from NASA Explorer on ${date}_`,
      ``,
    ];
    if (sourceUrl) {
      lines.push(`Source: ${sourceUrl}`, ``);
    }
    for (const { heading, body } of sections) {
      const cleaned = stripHtml(body);
      if (!cleaned) continue;
      lines.push(`## ${heading}`, ``, cleaned, ``);
    }

    const blob = new Blob([lines.join("\n")], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(filename || title).replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-notes.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({ title: "Notes exported", description: "Markdown file downloaded." });
  };

  return (
    <Button variant="outline" size="sm" onClick={handleExport} className="gap-1.5">
      <Download className="h-4 w-4" />
      Export Notes
    </Button>
  );
};

export default ResearchExport;
