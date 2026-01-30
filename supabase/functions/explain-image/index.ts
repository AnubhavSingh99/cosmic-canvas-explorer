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
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const { imageUrl, title, description } = await req.json();

    if (!imageUrl) {
      throw new Error("Image URL is required");
    }

    const systemPrompt = `You are an expert astronomer and science communicator. When given a NASA image, provide two explanations:

1. **Detailed Explanation**: A clear, informative explanation suitable for curious adults. Include scientific context, what we're seeing, and why it's significant.

2. **Explain Like I'm 10**: A fun, simple explanation that a 10-year-old would understand. Use analogies, avoid jargon, and make it exciting!

Format your response as JSON:
{
  "detailed": "Your detailed explanation here...",
  "simple": "Your kid-friendly explanation here..."
}

Be accurate, engaging, and capture the wonder of space exploration.`;

    const userContent = [
      {
        type: "text",
        text: `Please analyze this NASA image and provide both explanations.

Title: ${title || "NASA Image"}
${description ? `Original Description: ${description}` : ""}

Provide your analysis in the JSON format specified.`
      },
      {
        type: "image_url",
        image_url: {
          url: imageUrl
        }
      }
    ];

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userContent }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI service error: ${response.status}`);
    }

    const aiData = await response.json();
    const content = aiData.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No response from AI");
    }

    // Parse the JSON response from the AI
    let explanations;
    try {
      // Try to extract JSON from the response (it might be wrapped in markdown)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        explanations = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      // Fallback: use the raw content
      explanations = {
        detailed: content,
        simple: "This is an amazing image from NASA showing the wonders of our universe!"
      };
    }

    return new Response(JSON.stringify(explanations), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: unknown) {
    console.error("Error explaining image:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to generate explanation";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
