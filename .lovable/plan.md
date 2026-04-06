

## AstroScan — AI-Powered Celestial Object Identification

### Overview
Add a `/scan` page where users upload a night sky image, AI identifies celestial objects, and related NASA images are displayed.

### Architecture

```text
User uploads image
       ↓
Convert to base64 on client
       ↓
supabase.functions.invoke("astroscan")
       ↓
Edge function sends to Lovable AI (gemini-2.5-flash, vision)
       ↓
Returns structured identification data
       ↓
Client uses object name to search NASA Image API
       ↓
Display results
```

### Implementation Steps

**1. Create edge function `supabase/functions/astroscan/index.ts`**
- Accept base64 image data via POST
- Use Lovable AI gateway with `google/gemini-2.5-flash` (vision-capable)
- Prompt asks for: object name, type, confidence, simple explanation, scientific explanation, alternative guesses
- Use tool calling to extract structured JSON output
- Handle 429/402 rate limit errors

**2. Create `src/pages/Scan.tsx`**
- Upload UI with drag-and-drop zone and file input (images only)
- Image preview before submission
- "Scan Image" button triggers analysis
- Loading state: "Scanning the universe..." with animation
- Results display:
  - Detected object card (name, type, confidence badge)
  - Toggle between simple/scientific explanation
  - Alternative guesses if confidence is low
  - "Not an astronomical image" message for non-space photos
- Related NASA images grid (fetched via `searchNASAImages` from existing `nasa-api.ts`)
- Each NASA image links to `/image/:id` detail page

**3. Update `src/App.tsx`**
- Add route: `/scan` → `Scan` page

**4. Update `src/components/Header.tsx`**
- Add "AstroScan" nav link with a scan/telescope icon

### Technical Notes
- No new API keys needed — uses existing `LOVABLE_API_KEY` for Lovable AI
- Image converted to base64 on client, sent as data URL to edge function
- Reuses existing `searchNASAImages()` and `ImageCard` component for related images
- File size validation on client (max ~10MB)
- Dark space-themed UI consistent with existing design

