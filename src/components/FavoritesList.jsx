import React, { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import Card from './UI/Card';
import IconButton from './UI/IconButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import Button from './UI/Button';

const FavoritesList = () => {
  const { favorites, removeFromFavorites } = useContext(AppContext);
  const navigate = useNavigate();
  
  const handleShare = async (fact) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Interesting Fact',
          text: fact.text,
          url: window.location.href
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(fact.text)
        .then(() => alert('Fact copied to clipboard!'))
        .catch(err => console.error('Failed to copy: ', err));
    }
  };
  
  if (favorites.length === 0) {
    return (
      <div className="container mx-auto p-8 text-center">
        <div className="max-w-md mx-auto">
          <FontAwesomeIcon 
            icon={['far', 'heart']} 
            className="text-primary-300 text-6xl mb-4" 
          />
          <h2 className="text-xl font-medium text-secondary-700 mb-4">
            No favorite facts yet
          </h2>
          <p className="text-secondary-500 mb-6">
            Start exploring facts and save your favorites to see them here.
          </p>
          <Button 
            onClick={() => navigate('/')}
            icon="book"
          >
            Explore Facts
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4">
      <div className="space-y-4">
        {favorites.map((fact) => (
          <Card key={fact.id}>
            <p className="text-secondary-800 mb-4">{fact.text}</p>
            <div className="flex justify-end space-x-2">
              <IconButton
                icon="share"
                onClick={() => handleShare(fact)}
                aria-label="Share fact"
              />
              <IconButton
                icon="trash"
                onClick={() => removeFromFavorites(fact.id)}
                variant="danger"
                aria-label="Remove from favorites"
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FavoritesList;