// src/App.js - Updated with playful background
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppProvider } from "./contexts/AppContext";
import Header from "./components/Header";
import Navigation from "./components/Navigation";
import CategoryList from "./components/CategoryList";
import FactView from "./components/FactView";
import FavoritesList from "./components/FavoritesList";
import SurpriseButton from "./components/SurpriseButton";
import { ThemeProvider } from "./contexts/ThemeContext";
import ThemeSwitcher from "./components/ThemeSwitcher";
import CollectionsView from "./components/CollectionsView";
import { CollectionProvider } from "./contexts/CollectionContext";
import { ReactionsProvider } from "./contexts/ReactionsContext";
import FlashcardsView from "./components/FlashcardsView";

import { StreakProvider } from "./contexts/StreakContext";
import StreakView from "./components/StreakView";

import { ProgressProvider } from "./contexts/ProgressContext";
import ProgressView from "./components/ProgressView";

import "./fontawesome"; // Import FontAwesome setup

function App() {
  // Array of fun emojis for background decoration
  const funEmojis = [
    "😀", "😎", "🍕", "🐱", "🚀", "🌈", "🎉", "🌻", "💖", "🥳", 
    "🎨", "🐶", "🍉", "💃", "🎮", "🦄", "🌍", "🥺", "🏖️", "⚡", 
    "🧩", "🏀", "🥑", "⚽", "🎸", "🌙", "🍩", "😜", "🌟", "🦋",
    "🎬", "🍔", "💀", "🌵", "🏞️", "🌚", "🧸", "🎁", "👾", "🥇",
    "🍓", "🚲", "🦓", "🥒", "⚓", "🎤", "🎻", "🍦", "🌺", "💫",
    "🌞", "🍉", "🦋", "🧁", "🍪", "🥤", "🦁", "💎", "💼", "👑",
    "🎠", "🎨", "🍍", "🍒", "🍇", "🦄", "🏆", "🛹", "🎮", "🐙",
    "🌴", "🎡", "🍓", "💥", "🎶", "💃", "🌍", "🕶️", "🍎", "🍒",
    "🌷", "🎧", "🛶", "🍀", "⛱️", "⚽", "🚶‍♂️", "🏋️‍♂️", "🎣", "🛸",
    "🚕", "🥇", "📚", "🎤", "🏆", "🧑‍🎤", "🦉", "🐒", "🧶", "🌜", 
    "🏰", "🍓", "🍋", "🏖️", "🌷", "🦀", "🐸", "🦊", "🍍", "🍊"
  ];

  return (
    <ThemeProvider>
      <ProgressProvider>
        <StreakProvider>
          <ReactionsProvider>
            <CollectionProvider>
              <AppProvider>
                <Router>
                  <div className="min-h-screen bg-playful flex flex-col">
                    {/* Fun emoji decorations */}
                    {funEmojis.map((emoji, index) => (
                      <span
                        key={index}
                        className="fun-emoji"
                        style={{
                          top: `${Math.random() * 80}%`,
                          left: `${Math.random() * 90}%`,
                          animationDelay: `${Math.random() * -15}s`,
                        }}
                      >
                        {emoji}
                      </span>
                    ))}

                    <Header />
                    <main className="flex-1 pb-20 content-layer">
                      <Routes>
                        <Route path="/" element={<CategoryList />} />
                        <Route path="/facts" element={<FactView />} />
                        <Route
                          path="/flashcards"
                          element={<FlashcardsView />}
                        />
                        <Route path="/favorites" element={<FavoritesList />} />

                        <Route
                          path="/collections"
                          element={<CollectionsView />}
                        />
                        <Route path="/streak" element={<StreakView />} />
                        <Route path="/progress" element={<ProgressView />} />
                      </Routes>
                    </main>
                    <Navigation />
                    <SurpriseButton />
                  </div>
                </Router>
              </AppProvider>
            </CollectionProvider>
          </ReactionsProvider>
        </StreakProvider>
      </ProgressProvider>
    </ThemeProvider>
  );
}

export default App;
