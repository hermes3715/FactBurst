import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFolder, 
  faFolderOpen, 
  faPlus,
  faEdit,
  faTrash,
  faArrowLeft
} from '@fortawesome/free-solid-svg-icons';
import { CollectionContext } from '../contexts/CollectionContext';
import { ThemeContext } from '../contexts/ThemeContext';
import { AppContext } from '../contexts/AppContext';
import Card from './UI/Card';

const CollectionsView = () => {
  const { 
    collections, 
    createCollection, 
    renameCollection, 
    deleteCollection,
    removeFactFromCollection 
  } = useContext(CollectionContext);
  
  const { currentTheme } = useContext(ThemeContext);
  const { setSelectedFact } = useContext(AppContext);
  
  const navigate = useNavigate();
  
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [editingCollection, setEditingCollection] = useState(null);
  const [editName, setEditName] = useState('');
  
  const handleCreateCollection = () => {
    if (newCollectionName.trim()) {
      createCollection(newCollectionName.trim());
      setNewCollectionName('');
      setShowNewForm(false);
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
  
  const handleDeleteCollection = (collectionId) => {
    if (window.confirm('Are you sure you want to delete this collection?')) {
      deleteCollection(collectionId);
      if (selectedCollection === collectionId) {
        setSelectedCollection(null);
      }
    }
  };
  
  const handleViewFact = (fact) => {
    setSelectedFact(fact);
    navigate('/facts');
  };
  
  const handleRemoveFact = (collectionId, factId) => {
    removeFactFromCollection(collectionId, factId);
  };
  
  // Get the selected collection object
  const activeCollection = collections.find(c => c.id === selectedCollection);
  
  return (
    <div className="container mx-auto p-4">
      {selectedCollection ? (
        // Collection details view
        <div>
          <button 
            onClick={() => setSelectedCollection(null)}
            className={`flex items-center ${currentTheme.primaryText} mb-4`}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Back to Collections
          </button>
          
          <div className="flex justify-between items-center mb-4">
            <h2 className={`text-xl font-bold ${currentTheme.textColor}`}>
              {activeCollection.name}
            </h2>
            <div className="flex space-x-2">
              <button 
                onClick={() => handleStartEdit(activeCollection)}
                className={`p-2 rounded-full ${currentTheme.cardBg} text-gray-600`}
              >
                <FontAwesomeIcon icon={faEdit} />
              </button>
              <button 
                onClick={() => handleDeleteCollection(activeCollection.id)}
                className="p-2 rounded-full bg-red-100 text-red-600"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          </div>
          
          {editingCollection === activeCollection.id && (
            <div className="flex items-center mb-4">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className={`flex-1 p-2 border rounded ${currentTheme.cardBg} ${currentTheme.textColor}`}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
              />
              <button
                onClick={handleSaveEdit}
                className={`ml-2 p-2 ${currentTheme.primaryColor} text-white rounded`}
              >
                Save
              </button>
            </div>
          )}
          
          {activeCollection.facts.length === 0 ? (
            <div className={`text-center p-8 ${currentTheme.cardBg} rounded-lg shadow-md`}>
              <div className="text-4xl mb-4">📚</div>
              <p className={`${currentTheme.textColor} mb-2`}>
                This collection is empty
              </p>
              <p className="text-gray-500 text-sm">
                Add facts to this collection while browsing
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {activeCollection.facts.map(fact => (
                <Card key={fact.id} className={`${currentTheme.cardBg} relative`}>
                  <p className={`${currentTheme.textColor} mb-4`}>{fact.text}</p>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleViewFact(fact)}
                      className={`px-3 py-1 rounded ${currentTheme.primaryColor} text-white text-sm`}
                    >
                      View Fact
                    </button>
                    <button
                      onClick={() => handleRemoveFact(activeCollection.id, fact.id)}
                      className="px-3 py-1 rounded bg-red-100 text-red-600 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      ) : (
        // Collections list view
        <div>
          <h2 className={`text-xl font-bold ${currentTheme.textColor} mb-4`}>
            My Collections
          </h2>
          
          {showNewForm ? (
            <div className={`${currentTheme.cardBg} p-4 rounded-lg shadow-md mb-4`}>
              <h3 className={`font-medium ${currentTheme.textColor} mb-2`}>
                Create New Collection
              </h3>
              <div className="flex">
                <input
                  type="text"
                  placeholder="Collection name"
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  className={`flex-1 p-2 border rounded ${currentTheme.cardBg} ${currentTheme.textColor}`}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateCollection()}
                />
                <button
                  onClick={handleCreateCollection}
                  className={`ml-2 p-2 ${currentTheme.primaryColor} text-white rounded`}
                  disabled={!newCollectionName.trim()}
                >
                  Create
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowNewForm(true)}
              className={`flex items-center mb-4 ${currentTheme.primaryText} hover:underline`}
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Create New Collection
            </button>
          )}
          
          {collections.length === 0 ? (
            <div className={`text-center p-8 ${currentTheme.cardBg} rounded-lg shadow-md`}>
              <div className="text-4xl mb-4">📁</div>
              <p className={`${currentTheme.textColor} mb-2`}>
                You don't have any collections yet
              </p>
              <p className="text-gray-500 text-sm mb-4">
                Create a collection to organize your favorite facts
              </p>
              <button
                onClick={() => setShowNewForm(true)}
                className={`px-4 py-2 ${currentTheme.primaryColor} text-white rounded-md`}
              >
                Create Your First Collection
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {collections.map(collection => (
                <div
                  key={collection.id}
                  className={`${currentTheme.cardBg} rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow`}
                  onClick={() => setSelectedCollection(collection.id)}
                >
                  <div className="flex items-center">
                    <div className={`text-2xl mr-3 ${currentTheme.primaryText}`}>
                      <FontAwesomeIcon icon={collection.facts.length > 0 ? faFolderOpen : faFolder} />
                    </div>
                    <div>
                      <h3 className={`font-medium ${currentTheme.textColor}`}>
                        {collection.name}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        {collection.facts.length} fact{collection.facts.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CollectionsView;