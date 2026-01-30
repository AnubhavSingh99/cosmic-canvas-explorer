import { useState } from "react";
import { Sparkles, Loader2, Brain, Baby, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

interface AIExplanationProps {
  imageUrl: string;
  title: string;
  description?: string;
}

interface Explanations {
  detailed: string;
  simple: string;
}

const AIExplanation = ({ imageUrl, title, description }: AIExplanationProps) => {
  const [explanations, setExplanations] = useState<Explanations | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateExplanation = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("explain-image", {
        body: { imageUrl, title, description },
      });

      if (fnError) {
        throw new Error(fnError.message || "Failed to generate explanation");
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setExplanations(data);
    } catch (err) {
      console.error("Error generating explanation:", err);
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  if (!explanations && !isLoading && !error) {
    return (
      <Button
        onClick={generateExplanation}
        className="gap-2"
        variant="outline"
        size="lg"
      >
        <Sparkles className="h-4 w-4" />
        Generate AI Explanation
      </Button>
    );
  }

  if (isLoading) {
    return (
      <Card className="border-primary/30 bg-card/50">
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-4 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <div>
              <p className="font-medium">Analyzing image with AI...</p>
              <p className="text-sm text-muted-foreground">
                This may take a few seconds
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive/30 bg-destructive/5">
        <CardContent className="py-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 shrink-0 text-destructive" />
            <div className="space-y-2">
              <p className="font-medium text-destructive">{error}</p>
              <Button onClick={generateExplanation} variant="outline" size="sm">
                Try Again
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Detailed Explanation */}
      <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Brain className="h-5 w-5 text-primary" />
            Detailed Explanation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="leading-relaxed text-muted-foreground">
            {explanations?.detailed}
          </p>
        </CardContent>
      </Card>

      {/* Simple Explanation */}
      <Card className="border-secondary/30 bg-gradient-to-br from-secondary/5 to-transparent">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Baby className="h-5 w-5 text-secondary" />
            Explain Like I'm 10
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="leading-relaxed text-muted-foreground">
            {explanations?.simple}
          </p>
        </CardContent>
      </Card>

      {/* Regenerate Button */}
      <Button
        onClick={generateExplanation}
        variant="ghost"
        size="sm"
        className="gap-2"
      >
        <Sparkles className="h-3 w-3" />
        Regenerate Explanation
      </Button>
    </div>
  );
};

export default AIExplanation;
