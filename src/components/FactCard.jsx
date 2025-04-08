import React, { useContext, useState } from "react";
import { AppContext } from "../contexts/AppContext";
import Card from "./UI/Card";
import Button from "./UI/Button";
import IconButton from "./UI/IconButton";
import CollectionButton from "./CollectionButton";
import { ThemeContext } from "../contexts/ThemeContext";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";

import FactReactions from "./FactReactions";

const FactCard = ({ fact, onNext }) => {
  const { addToFavorites, removeFromFavorites, isFavorite } =
    useContext(AppContext);

  const { currentTheme } = useContext(ThemeContext);

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);


  const toggleFavorite = () => {
    if (isFavorite(fact.id)) {
      removeFromFavorites(fact.id);
    } else {
      addToFavorites(fact);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Interesting Fact",
          text: fact.text,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard
        .writeText(fact.text)
        .then(() => alert("Fact copied to clipboard!"))
        .catch((err) => console.error("Failed to copy: ", err));
    }
  };

  const handleNextFact = () => {
    // Prevent rapid clicking
    if (isButtonDisabled) return;
    
    setIsButtonDisabled(true);
    onNext();
    
    // Re-enable after a delay
    setTimeout(() => {
      setIsButtonDisabled(false);
    }, 1000);
  };

  const favorited = isFavorite(fact.id);

  return (
    <Card className="max-w-xl mx-auto bg-white/80 backdrop-blur-sm fact-card">
      <p className="text-gray-800 text-lg leading-relaxed mb-8 relative z-10">
        {fact.text}
      </p>

      <div className="flex items-center justify-between relative z-10">
        <div className="flex space-x-2">
          <IconButton
            icon={favorited ? solidHeart : regularHeart}
            onClick={toggleFavorite}
            variant={favorited ? "primary" : "default"}
            className="btn-bounce"
            aria-label={
              favorited ? "Remove from favorites" : "Add to favorites"
            }
          />
          
          <IconButton
            icon="share"
            onClick={handleShare}
            className="btn-bounce"
            aria-label="Share this fact"
          />
        </div>
        <Button
          onClick={handleNextFact}
          disabled={isButtonDisabled}
          className={`... ${isButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          icon="chevron-right"
          iconPosition="right"
        >
          Next Fact
        </Button>

        {/* Add the reactions component */}
        <FactReactions factId={fact.id} />
      </div>

      {/* Random rotation to make it look playful */}
      <style jsx>{`
        .fact-card {
          transform: rotate(${Math.random() * 2 - 1}deg);
        }
      `}</style>
    </Card>
  );
};

export default FactCard;
