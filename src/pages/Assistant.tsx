import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Send, Sparkles, Loader2, Bot, User as UserIcon, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { searchNASAImages, type NASAImageItem } from "@/lib/nasa-api";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  images?: NASAImageItem[];
}

const SUGGESTED_PROMPTS = [
  "Show me Mars missions",
  "What did Hubble discover?",
  "Tell me about the James Webb Space Telescope",
  "How did Apollo 11 land on the Moon?",
];

const Assistant = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isLoading]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: trimmed },
    ];
    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("nasa-assistant", {
        body: {
          messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
        },
      });

      if (error) throw new Error(error.message);
      if (data?.error) throw new Error(data.error);

      const reply: string = data?.reply ?? "I don't have an answer for that.";
      const queries: string[] = Array.isArray(data?.queries) ? data.queries : [];

      // Best-effort: fetch a small set of related NASA images using the first query.
      let images: NASAImageItem[] = [];
      if (queries[0]) {
        try {
          const results = await searchNASAImages(queries[0]);
          images = results.filter((i) => i.thumb).slice(0, 6);
        } catch (e) {
          console.warn("Related image fetch failed", e);
        }
      }

      setMessages((prev) => [...prev, { role: "assistant", content: reply, images }]);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      toast({ title: "Assistant error", description: message, variant: "destructive" });
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I couldn't complete that request. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void send(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send(input);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto flex max-w-3xl flex-col px-4 pb-6 pt-24">
        <div className="mb-6 space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Space Assistant
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Ask anything about NASA missions, telescopes, planets and discoveries.
          </p>
        </div>

        <div
          ref={scrollRef}
          className="flex-1 space-y-4 overflow-y-auto rounded-lg border border-border/50 bg-card/30 p-4"
          style={{ minHeight: "50vh", maxHeight: "65vh" }}
        >
          {messages.length === 0 && !isLoading && (
            <div className="flex h-full flex-col items-center justify-center gap-4 py-12 text-center">
              <div className="rounded-full bg-primary/10 p-4">
                <Bot className="h-8 w-8 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">
                Try one of these to get started:
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {SUGGESTED_PROMPTS.map((p) => (
                  <button
                    key={p}
                    onClick={() => void send(p)}
                    className="rounded-full border border-border/50 bg-background/50 px-3 py-1.5 text-xs font-medium transition-colors hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <MessageBubble key={i} message={m} />
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              Thinking…
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about a mission, planet, telescope…"
            className="min-h-[52px] resize-none"
            disabled={isLoading}
          />
          <Button type="submit" size="icon" className="h-[52px] w-[52px]" disabled={isLoading || !input.trim()}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>

        <p className="mt-2 text-center text-xs text-muted-foreground">
          Conversations are session-only and not stored.
        </p>
      </main>
    </div>
  );
};

const MessageBubble = ({ message }: { message: ChatMessage }) => {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
          isUser ? "bg-primary/20 text-primary" : "bg-secondary/30 text-secondary-foreground"
        }`}
      >
        {isUser ? <UserIcon className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>
      <div className={`flex max-w-[85%] flex-col gap-3 ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`rounded-lg px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
            isUser
              ? "bg-primary/15 text-foreground"
              : "border border-border/50 bg-background/40"
          }`}
        >
          {message.content}
        </div>

        {message.images && message.images.length > 0 && (
          <div className="grid w-full grid-cols-2 gap-2 sm:grid-cols-3">
            {message.images.map((img) => (
              <Link
                key={img.nasa_id}
                to={`/image/${img.nasa_id}`}
                className="group relative aspect-square overflow-hidden rounded-md border border-border/50 bg-muted"
              >
                {img.thumb ? (
                  <img
                    src={img.thumb}
                    alt={img.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <ImageIcon className="h-6 w-6 text-muted-foreground/30" />
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/95 to-transparent p-1.5">
                  <p className="line-clamp-1 text-[10px] font-medium">{img.title}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Assistant;
