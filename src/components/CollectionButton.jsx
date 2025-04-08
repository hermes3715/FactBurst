import React, { useState, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderPlus } from '@fortawesome/free-solid-svg-icons';
import { CollectionContext } from '../contexts/CollectionContext';
import { ThemeContext } from '../contexts/ThemeContext';
import CollectionSelector from './CollectionSelector';

const CollectionButton = ({ fact }) => {
  const [showSelector, setShowSelector] = useState(false);
  const { getCollectionsWithFact } = useContext(CollectionContext);
  const { currentTheme } = useContext(ThemeContext);
  
  const collectionsCount = getCollectionsWithFact(fact.id).length;
  
  return (
    <div className="relative">
      <button
        onClick={() => setShowSelector(!showSelector)}
        className={`icon-button ${
          collectionsCount > 0 
            ? 'bg-green-100 text-green-700 hover:bg-green-200' 
            : `${currentTheme.cardBg} text-gray-600 hover:bg-gray-100`
        }`}
        aria-label="Add to collection"
      >
        <FontAwesomeIcon icon={faFolderPlus} />
        {collectionsCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-green-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
            {collectionsCount}
          </span>
        )}
      </button>
      
      {showSelector && (
        <div className="absolute bottom-full right-0 mb-2 z-30">
          <CollectionSelector fact={fact} onClose={() => setShowSelector(false)} />
        </div>
      )}
    </div>
  );
};

export default CollectionButton;
