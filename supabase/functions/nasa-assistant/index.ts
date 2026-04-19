// NASA Conversational Assistant — server-side Gemini call via Lovable AI Gateway.
// Receives chat history, returns assistant reply + suggested NASA search keywords
// the client can use to render related image cards.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

const SYSTEM_PROMPT = `You are NASA Explorer's friendly space assistant. You help users discover NASA missions, images, planets, telescopes and astronomical discoveries.

Guidelines:
- Be concise (2-5 short paragraphs max). Use plain language.
- When relevant, mention specific missions (Apollo, Voyager, Hubble, James Webb, Perseverance, Cassini, etc.) or celestial objects so the user can explore further.
- After your answer, ALWAYS call the suggest_related_searches tool with 1-3 short NASA image search queries (e.g. "Mars Perseverance", "Hubble nebula") that match what you discussed. Keep each query 1-4 words. If the user's message is off-topic, return an empty array.`;

const tools = [
  {
    type: "function",
    function: {
      name: "suggest_related_searches",
      description:
        "Return 1-3 short NASA image search queries (1-4 words each) related to the conversation, so the UI can render related image cards.",
      parameters: {
        type: "object",
        properties: {
          queries: {
            type: "array",
            items: { type: "string" },
            description: "Short NASA image search queries.",
          },
        },
        required: ["queries"],
        additionalProperties: false,
      },
    },
  },
];

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const messages: ChatMessage[] = Array.isArray(body?.messages) ? body.messages : [];

    if (messages.length === 0) {
      return new Response(JSON.stringify({ error: "messages required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "AI gateway not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiResponse = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages.slice(-10), // keep payload bounded
          ],
          tools,
          tool_choice: "auto",
        }),
      }
    );

    if (aiResponse.status === 429) {
      return new Response(
        JSON.stringify({ error: "Rate limit reached. Please wait a moment and try again." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (aiResponse.status === 402) {
      return new Response(
        JSON.stringify({ error: "AI credits exhausted. Add credits in workspace settings." }),
        { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (!aiResponse.ok) {
      const t = await aiResponse.text();
      console.error("AI gateway error", aiResponse.status, t);
      return new Response(JSON.stringify({ error: "AI request failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await aiResponse.json();
    const choice = data.choices?.[0]?.message;
    const reply: string = choice?.content ?? "";

    let queries: string[] = [];
    const toolCall = choice?.tool_calls?.[0];
    if (toolCall?.function?.arguments) {
      try {
        const parsed = JSON.parse(toolCall.function.arguments);
        if (Array.isArray(parsed.queries)) {
          queries = parsed.queries
            .filter((q: unknown): q is string => typeof q === "string")
            .map((q: string) => q.trim())
            .filter(Boolean)
            .slice(0, 3);
        }
      } catch (e) {
        console.error("Failed to parse tool args", e);
      }
    }

    return new Response(JSON.stringify({ reply, queries }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("nasa-assistant error", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
