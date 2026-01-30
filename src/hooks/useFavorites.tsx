import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { NASAImageItem } from "@/lib/nasa-api";

interface FavoritesContextType {
  favorites: NASAImageItem[];
  addFavorite: (image: NASAImageItem) => void;
  removeFavorite: (nasaId: string) => void;
  isFavorite: (nasaId: string) => boolean;
  toggleFavorite: (image: NASAImageItem) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const STORAGE_KEY = "nasa-explorer-favorites";

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<NASAImageItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to load favorites:", error);
    }
    setIsLoaded(true);
  }, []);

  // Save favorites to localStorage when they change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
      } catch (error) {
        console.error("Failed to save favorites:", error);
      }
    }
  }, [favorites, isLoaded]);

  const addFavorite = (image: NASAImageItem) => {
    setFavorites((prev) => {
      if (prev.some((fav) => fav.nasa_id === image.nasa_id)) {
        return prev;
      }
      return [...prev, image];
    });
  };

  const removeFavorite = (nasaId: string) => {
    setFavorites((prev) => prev.filter((fav) => fav.nasa_id !== nasaId));
  };

  const isFavorite = (nasaId: string) => {
    return favorites.some((fav) => fav.nasa_id === nasaId);
  };

  const toggleFavorite = (image: NASAImageItem) => {
    if (isFavorite(image.nasa_id)) {
      removeFavorite(image.nasa_id);
    } else {
      addFavorite(image);
    }
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, addFavorite, removeFavorite, isFavorite, toggleFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
