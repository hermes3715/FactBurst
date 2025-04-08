import React, { createContext, useState, useEffect } from 'react';

export const CollectionContext = createContext();

export const CollectionProvider = ({ children }) => {
  // Initialize collections from localStorage
  const [collections, setCollections] = useState(() => {
    const savedCollections = localStorage.getItem('factCollections');
    return savedCollections 
      ? JSON.parse(savedCollections) 
      : [
          { id: 'default', name: 'My Collection', facts: [] }
        ];
  });
  
  // Save collections to localStorage when they change
  useEffect(() => {
    localStorage.setItem('factCollections', JSON.stringify(collections));
  }, [collections]);
  
  // Create a new collection
  const createCollection = (name) => {
    const newCollection = {
      id: `collection-${Date.now()}`,
      name,
      facts: []
    };
    
    setCollections([...collections, newCollection]);
    return newCollection.id;
  };
  
  // Rename a collection
  const renameCollection = (collectionId, newName) => {
    setCollections(collections.map(collection => 
      collection.id === collectionId 
        ? { ...collection, name: newName } 
        : collection
    ));
  };
  
  // Delete a collection
  const deleteCollection = (collectionId) => {
    setCollections(collections.filter(collection => 
      collection.id !== collectionId
    ));
  };
  
  // Add a fact to a collection
  const addFactToCollection = (collectionId, fact) => {
    setCollections(collections.map(collection => {
      if (collection.id === collectionId) {
        // Check if fact already exists in the collection
        const factExists = collection.facts.some(f => f.id === fact.id);
        
        if (!factExists) {
          return {
            ...collection,
            facts: [...collection.facts, fact]
          };
        }
      }
      return collection;
    }));
  };
  
  // Remove a fact from a collection
  const removeFactFromCollection = (collectionId, factId) => {
    setCollections(collections.map(collection => 
      collection.id === collectionId
        ? { 
            ...collection, 
            facts: collection.facts.filter(fact => fact.id !== factId) 
          }
        : collection
    ));
  };
  
  // Check if a fact is in a collection
  const isFactInCollection = (collectionId, factId) => {
    const collection = collections.find(c => c.id === collectionId);
    return collection ? collection.facts.some(f => f.id === factId) : false;
  };
  
  // Get collections containing a fact
  const getCollectionsWithFact = (factId) => {
    return collections.filter(collection => 
      collection.facts.some(fact => fact.id === factId)
    ).map(collection => collection.id);
  };
  
  return (
    <CollectionContext.Provider
      value={{
        collections,
        createCollection,
        renameCollection,
        deleteCollection,
        addFactToCollection,
        removeFactFromCollection,
        isFactInCollection,
        getCollectionsWithFact
      }}
    >
      {children}
    </CollectionContext.Provider>
  );
};