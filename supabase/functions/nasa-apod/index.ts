import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const NASA_API_KEY = Deno.env.get("NASA_API_KEY");
    
    if (!NASA_API_KEY) {
      throw new Error("NASA_API_KEY is not configured");
    }

    // Parse request body for optional date parameter
    let date: string | null = null;
    if (req.method === "POST") {
      try {
        const body = await req.json();
        date = body.date || null;
      } catch {
        // No body or invalid JSON, use today's date
      }
    }

    // Build API URL with optional date
    let apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`;
    if (date) {
      apiUrl += `&date=${date}`;
    }

    const response = await fetch(apiUrl);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`NASA API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: unknown) {
    console.error("Error fetching APOD:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch APOD";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
