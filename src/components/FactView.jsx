import React, { useState, useEffect, useContext, useRef } from "react";
import { AppContext } from "../contexts/AppContext";
import FactCard from "./FactCard";
import Loader from "./UI/Loader";
import Button from "./UI/Button";
import { fetchFactByCategory } from "../services/api";
import RelatedFacts from "./RelatedFacts";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../contexts/ThemeContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRandom } from "@fortawesome/free-solid-svg-icons";

import { StreakContext } from "../contexts/StreakContext";
import { ProgressContext } from "../contexts/ProgressContext";

const FactView = () => {
  const { selectedCategory, language, selectedFact, setSelectedFact } =
    useContext(AppContext);
  const [currentFact, setCurrentFact] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const lastRecordedFactId = useRef(null);

  const { currentTheme } = useContext(ThemeContext);
  const { recordFactView } = useContext(ProgressContext);
  const { recordStreakFactView } = useContext(StreakContext);

  const lastProcessedFactId = useRef(null);

  const navigate = useNavigate();

  // Handler for when a related fact is selected
  const handleSelectRelatedFact = (fact) => {
    if (fact) {
      // Ensure category is set on the related fact
      const factWithCategory = {
        ...fact,
        category: fact.category || selectedCategory || "random",
      };
      setCurrentFact(factWithCategory);

      // Only record if it's a different fact
      if (lastRecordedFactId.current !== factWithCategory.id) {
        lastRecordedFactId.current = factWithCategory.id;
        recordFactView(factWithCategory);
        recordStreakFactView(factWithCategory);
      }

      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Load fact, now with support for a pre-selected fact
  const loadFact = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // If we have a selected fact from elsewhere in the app, use it
      if (selectedFact) {
        // Ensure category is set before recording
        const factWithCategory = {
          ...selectedFact,
          category: selectedFact.category || selectedCategory || "random",
        };

        console.log(
          "Using selected fact with category:",
          factWithCategory.category
        );
        setCurrentFact(factWithCategory);
        setSelectedFact(null); // Clear it after use

        // Only record if it's a different fact
        if (lastRecordedFactId.current !== factWithCategory.id) {
          lastRecordedFactId.current = factWithCategory.id;
          recordFactView(factWithCategory);
          recordStreakFactView(factWithCategory);
        }
      } else {
        // Otherwise fetch a new fact
        const factData = await fetchFactByCategory(selectedCategory, language);
        console.log("API returned fact:", factData);

        // The category should already be set by fetchFactByCategory,
        // but we'll ensure it as a safety measure
        const factWithCategory = {
          ...factData,
          category: factData.category || selectedCategory || "random",
        };

        console.log("Using new fact with category:", factWithCategory.category);
        setCurrentFact(factWithCategory);

        // Only record if it's a different fact
        if (lastRecordedFactId.current !== factWithCategory.id) {
          lastRecordedFactId.current = factWithCategory.id;
          recordFactView(factWithCategory);
          recordStreakFactView(factWithCategory);
        }
      }
    } catch (err) {
      setError("Failed to load fact. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load initial fact when dependencies change
  useEffect(() => {
    loadFact();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, language, selectedFact]);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
        <p className="text-blue-600 font-medium">Loading amazing facts...</p>

        {/* Fun loading messages */}
        <div className="mt-6 text-gray-500 text-sm text-center max-w-xs">
          <p className="animate-pulse">
            Did you know? The human brain processes about 70,000 thoughts each
            day!
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-lg shadow-md max-w-md mx-auto">
        <span className="text-4xl mb-4 block">😕</span>
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={loadFact} icon="sync" className="btn-bounce">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4">
      {currentFact && (
        <>
          <FactCard fact={currentFact} onNext={loadFact} />

          {/* Add RelatedFacts component */}
          <RelatedFacts
            currentFact={currentFact}
            onSelectFact={handleSelectRelatedFact}
          />
        </>
      )}

      <div className="text-center mt-6">
        <button
          onClick={() => navigate("/flashcards")}
          className={`px-4 py-2 rounded-full ${currentTheme.primaryColor} text-white flex items-center justify-center mx-auto`}
        >
          <FontAwesomeIcon icon={faRandom} className="mr-2" />
          Try Flashcards Mode
        </button>
      </div>
    </div>
  );
};

export default FactView;
