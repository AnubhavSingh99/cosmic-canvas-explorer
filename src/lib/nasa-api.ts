// NASA API utilities

const NASA_IMAGE_API_BASE = "https://images-api.nasa.gov";
const NASA_API_KEY = "DEMO_KEY"; // Using DEMO_KEY for APOD

export interface NASAImageItem {
  nasa_id: string;
  title: string;
  description: string;
  date_created: string;
  media_type: string;
  href: string;
  thumb?: string;
}

export interface NASASearchResult {
  collection: {
    items: Array<{
      data: Array<{
        nasa_id: string;
        title: string;
        description: string;
        date_created: string;
        media_type: string;
      }>;
      links?: Array<{
        href: string;
        rel: string;
      }>;
    }>;
    metadata: {
      total_hits: number;
    };
  };
}

export interface APODData {
  title: string;
  explanation: string;
  url: string;
  hdurl?: string;
  date: string;
  media_type: string;
  copyright?: string;
}

export interface NASAAssetResult {
  collection: {
    items: Array<{
      href: string;
    }>;
  };
}

export async function searchNASAImages(query: string): Promise<NASAImageItem[]> {
  const response = await fetch(
    `${NASA_IMAGE_API_BASE}/search?q=${encodeURIComponent(query)}&media_type=image`
  );

  if (!response.ok) {
    throw new Error("Failed to search NASA images");
  }

  const data: NASASearchResult = await response.json();

  return data.collection.items.map((item) => ({
    nasa_id: item.data[0].nasa_id,
    title: item.data[0].title,
    description: item.data[0].description || "",
    date_created: item.data[0].date_created,
    media_type: item.data[0].media_type,
    href: item.links?.[0]?.href || "",
    thumb: item.links?.find((l) => l.rel === "preview")?.href || item.links?.[0]?.href,
  }));
}

export async function getNASAImageAsset(nasaId: string): Promise<string[]> {
  const response = await fetch(`${NASA_IMAGE_API_BASE}/asset/${nasaId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch NASA image asset");
  }

  const data: NASAAssetResult = await response.json();

  return data.collection.items.map((item) => item.href);
}

export async function getNASAImageMetadata(nasaId: string): Promise<NASAImageItem | null> {
  const response = await fetch(
    `${NASA_IMAGE_API_BASE}/search?nasa_id=${encodeURIComponent(nasaId)}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch NASA image metadata");
  }

  const data: NASASearchResult = await response.json();

  if (data.collection.items.length === 0) {
    return null;
  }

  const item = data.collection.items[0];
  return {
    nasa_id: item.data[0].nasa_id,
    title: item.data[0].title,
    description: item.data[0].description || "",
    date_created: item.data[0].date_created,
    media_type: item.data[0].media_type,
    href: item.links?.[0]?.href || "",
  };
}

export async function getAPOD(): Promise<APODData> {
  const response = await fetch(
    `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch APOD");
  }

  return response.json();
}
