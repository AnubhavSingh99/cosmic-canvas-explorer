import { useState } from "react";
import { Share2, Download, Copy, Check, Twitter, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ShareDownloadProps {
  title: string;
  imageUrl?: string;
  nasaId: string;
}

const ShareDownload = ({ title, imageUrl, nasaId }: ShareDownloadProps) => {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const pageUrl = `${window.location.origin}/image/${nasaId}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleShare = (platform: "twitter" | "facebook") => {
    const text = `Check out "${title}" on NASA Explorer!`;
    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(pageUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`,
    };
    window.open(urls[platform], "_blank", "noopener,noreferrer,width=600,height=400");
  };

  const handleDownload = async () => {
    if (!imageUrl) return;
    setDownloading(true);
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${nasaId}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Download started!");
    } catch {
      toast.error("Failed to download image");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="outline" size="sm" className="gap-1.5" onClick={handleCopyLink}>
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        {copied ? "Copied!" : "Copy Link"}
      </Button>
      <Button variant="outline" size="sm" className="gap-1.5" onClick={() => handleShare("twitter")}>
        <Twitter className="h-3.5 w-3.5" />
        Tweet
      </Button>
      <Button variant="outline" size="sm" className="gap-1.5" onClick={() => handleShare("facebook")}>
        <Facebook className="h-3.5 w-3.5" />
        Share
      </Button>
      {imageUrl && (
        <Button variant="outline" size="sm" className="gap-1.5" onClick={handleDownload} disabled={downloading}>
          <Download className="h-3.5 w-3.5" />
          {downloading ? "Downloading..." : "Download"}
        </Button>
      )}
    </div>
  );
};

export default ShareDownload;
