import React, { createContext, useState, useEffect, useCallback } from "react";
import { getStoredItem, setStoredItem } from "../utils/storage";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return getStoredItem("language") || "en";
  });

  const [selectedCategory, setSelectedCategory] = useState("");
  const [favorites, setFavorites] = useState(() => {
    return getStoredItem("factFavorites") || [];
  });

  // Save language preference to localStorage
  useEffect(() => {
    setStoredItem("language", language);
  }, [language]);

  // Save favorites to localStorage
  useEffect(() => {
    setStoredItem("factFavorites", favorites);
  }, [favorites]);

  const addToFavorites = useCallback(
    (fact) => {
      if (!favorites.some((f) => f.id === fact.id)) {
        setFavorites((prev) => [...prev, fact]);
      }
    },
    [favorites]
  );

  const removeFromFavorites = useCallback((factId) => {
    setFavorites((prev) => prev.filter((f) => f.id !== factId));
  }, []);

  const isFavorite = useCallback(
    (factId) => {
      return favorites.some((f) => f.id === factId);
    },
    [favorites]
  );

  const [surpriseFact, setSurpriseFact] = useState(null);

  const [selectedFact, setSelectedFact] = useState(null);

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        selectedCategory,
        setSelectedCategory,
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        surpriseFact,
        setSurpriseFact,
        selectedFact,
        setSelectedFact,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
