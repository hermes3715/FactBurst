import React, { useState, useContext, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFolderPlus, 
  faCheck, 
  faPlus, 
  faPencilAlt,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import { CollectionContext } from '../contexts/CollectionContext';
import { ThemeContext } from '../contexts/ThemeContext';

const CollectionSelector = ({ fact, onClose }) => {
  const { 
    collections, 
    addFactToCollection, 
    removeFactFromCollection,
    isFactInCollection,
    createCollection,
    renameCollection
  } = useContext(CollectionContext);
  
  const { currentTheme } = useContext(ThemeContext);
  
  const [showNewCollection, setShowNewCollection] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [editingCollection, setEditingCollection] = useState(null);
  const [editName, setEditName] = useState('');
  
  const inputRef = useRef(null);
  const editInputRef = useRef(null);
  
  useEffect(() => {
    if (showNewCollection && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showNewCollection]);
  
  useEffect(() => {
    if (editingCollection && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingCollection]);
  
  const handleToggleCollectionMembership = (collectionId) => {
    const isInCollection = isFactInCollection(collectionId, fact.id);
    
    if (isInCollection) {
      removeFactFromCollection(collectionId, fact.id);
    } else {
      addFactToCollection(collectionId, fact);
    }
  };
  
  const handleCreateCollection = () => {
    if (newCollectionName.trim()) {
      const collectionId = createCollection(newCollectionName.trim());
      addFactToCollection(collectionId, fact);
      setNewCollectionName('');
      setShowNewCollection(false);
    }
  };
  
  const handleStartEdit = (collection) => {
    setEditingCollection(collection.id);
    setEditName(collection.name);
  };
  
  const handleSaveEdit = () => {
    if (editName.trim()) {
      renameCollection(editingCollection, editName.trim());
    }
    setEditingCollection(null);
  };
  
  return (
    <div className={`p-4 ${currentTheme.cardBg} rounded-lg shadow-lg max-w-xs w-full`}>
      <div className="flex justify-between items-center mb-3">
        <h3 className={`font-medium ${currentTheme.textColor}`}>Add to Collection</h3>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 p-1"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
      
      <div className="mb-4 max-h-60 overflow-y-auto">
        {collections.map(collection => (
          <div key={collection.id} className="mb-2">
            {editingCollection === collection.id ? (
              <div className="flex items-center">
                <input
                  ref={editInputRef}
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className={`flex-1 p-2 border rounded ${currentTheme.cardBg} ${currentTheme.textColor} text-sm`}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
                />
                <button
                  onClick={handleSaveEdit}
                  className={`ml-2 p-1 ${currentTheme.primaryColor} text-white rounded-full`}
                >
                  <FontAwesomeIcon icon={faCheck} className="text-xs" />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between p-2 rounded hover:bg-gray-100 hover:bg-opacity-20">
                <div className="flex items-center">
                  <button
                    onClick={() => handleToggleCollectionMembership(collection.id)}
                    className={`w-5 h-5 rounded flex items-center justify-center mr-2 ${
                      isFactInCollection(collection.id, fact.id) 
                        ? currentTheme.primaryColor 
                        : 'bg-gray-200 bg-opacity-50'
                    }`}
                  >
                    {isFactInCollection(collection.id, fact.id) && (
                      <FontAwesomeIcon icon={faCheck} className="text-white text-xs" />
                    )}
                  </button>
                  <span className={currentTheme.textColor}>
                    {collection.name}
                  </span>
                </div>
                
                <button
                  onClick={() => handleStartEdit(collection)}
                  className="text-gray-500 hover:text-gray-700 p-1"
                >
                  <FontAwesomeIcon icon={faPencilAlt} className="text-xs" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {showNewCollection ? (
        <div className="flex items-center">
          <input
            ref={inputRef}
            type="text"
            placeholder="Collection name"
            value={newCollectionName}
            onChange={(e) => setNewCollectionName(e.target.value)}
            className={`flex-1 p-2 border rounded ${currentTheme.cardBg} ${currentTheme.textColor} text-sm`}
            onKeyDown={(e) => e.key === 'Enter' && handleCreateCollection()}
          />
          <button
            onClick={handleCreateCollection}
            className={`ml-2 p-2 ${currentTheme.primaryColor} text-white rounded-full`}
            disabled={!newCollectionName.trim()}
          >
            <FontAwesomeIcon icon={faCheck} />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowNewCollection(true)}
          className={`flex items-center text-sm ${currentTheme.primaryText} hover:underline mt-2`}
        >
          <FontAwesomeIcon icon={faPlus} className="mr-1" />
          Create New Collection
        </button>
      )}
    </div>
  );
};

export default CollectionSelector;