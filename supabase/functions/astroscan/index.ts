import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64 } = await req.json();
    if (!imageBase64 || typeof imageBase64 !== "string") {
      return new Response(JSON.stringify({ error: "imageBase64 is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content:
              "You are an expert astronomer and astrophysicist. Analyze images to identify celestial objects. If the image is not astronomical, indicate that clearly.",
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze this image and identify any astronomical or celestial objects (planet, star, nebula, galaxy, moon, satellite, constellation, etc.).",
              },
              {
                type: "image_url",
                image_url: { url: imageBase64 },
              },
            ],
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "identify_celestial_object",
              description: "Return identification results for the astronomical image.",
              parameters: {
                type: "object",
                properties: {
                  is_astronomical: {
                    type: "boolean",
                    description: "Whether the image contains astronomical/celestial content",
                  },
                  object_name: {
                    type: "string",
                    description: "Name of the primary identified object (e.g. 'Orion Nebula', 'Mars', 'Andromeda Galaxy')",
                  },
                  object_type: {
                    type: "string",
                    enum: ["planet", "star", "nebula", "galaxy", "moon", "satellite", "constellation", "asteroid", "comet", "other"],
                    description: "Type of celestial object",
                  },
                  confidence: {
                    type: "number",
                    description: "Confidence score from 0 to 100",
                  },
                  simple_explanation: {
                    type: "string",
                    description: "A short, friendly explanation suitable for anyone (2-3 sentences)",
                  },
                  scientific_explanation: {
                    type: "string",
                    description: "A detailed scientific explanation with technical details (3-5 sentences)",
                  },
                  alternative_guesses: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string" },
                        type: { type: "string" },
                        confidence: { type: "number" },
                      },
                      required: ["name", "type", "confidence"],
                    },
                    description: "2-3 alternative identifications if unsure",
                  },
                },
                required: ["is_astronomical", "object_name", "object_type", "confidence", "simple_explanation", "scientific_explanation", "alternative_guesses"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "identify_celestial_object" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      return new Response(JSON.stringify({ error: "AI analysis failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall) {
      return new Response(JSON.stringify({ error: "AI did not return structured results" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const result = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("astroscan error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
