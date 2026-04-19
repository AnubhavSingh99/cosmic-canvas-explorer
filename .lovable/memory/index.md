# Memory: index.md

# Project Memory

## Core
NASA Explorer: React, Vite, React Router, Tailwind CSS, TanStack Query.
Dark space-themed UI: responsive grid, clean cards, cosmic hero section.
Security: Never expose NASA/Gemini API keys client-side; always proxy via Supabase Edge Functions.
Favorites saved to local storage.
Edge functions returning upstream errors should reply 200 with `{ error, fallback: true }` so the frontend never blank-screens.

## Memories
- [API Security Proxies](mem://tech/security) — API keys must be secured and proxied via Supabase Edge Functions
- [NASA API Integration](mem://features/nasa-integration) — Integrates with NASA Image Library and APOD APIs
- [AstroScan](mem://features/astroscan) — AI celestial object identification from uploaded images
- [AI Image Explanations](mem://features/ai-explanations) — Dual-level summaries using Gemini via Supabase Edge Function
- [Mission Explorer](mem://features/missions) — Interactive timelines and curated overviews for space missions
- [History Explorer](mem://features/history-explorer) — Browse historical space milestones and APODs by date
- [Share and Download](mem://features/share-and-download) — Social sharing and blob-based full-resolution downloads
- [Learning Paths](mem://features/learn) — /learn structured paths linking to missions, search, AstroScan, Assistant
- [Research Export](mem://features/research-export) — Markdown notes export from image/mission detail pages
