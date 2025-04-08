import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Card from './UI/Card';
import Button from './UI/Button';

const CategoryList = () => {
  const { setSelectedCategory } = useContext(AppContext);
  const navigate = useNavigate();
  
  // Category definitions with icons
  const categories = [
    { 
      id: 'science', 
      name: 'Science & Technology', 
      icon: ['fas', 'flask'],
      color: 'bg-blue-100 text-blue-600',
      description: 'Discover fascinating scientific facts and technological advancements'
    },
    { 
      id: 'history', 
      name: 'History', 
      icon: ['fas', 'landmark'],
      color: 'bg-amber-100 text-amber-600',
      description: 'Explore interesting historical events and figures'
    },
    { 
      id: 'animals', 
      name: 'Animals & Nature', 
      icon: ['fas', 'paw'],
      color: 'bg-green-100 text-green-600',
      description: 'Learn amazing facts about animals and the natural world'
    },
    { 
      id: 'geography', 
      name: 'Geography & Travel', 
      icon: ['fas', 'map-marker-alt'],
      color: 'bg-purple-100 text-purple-600',
      description: 'Interesting places, landmarks, and geographical wonders'
    },
    { 
      id: 'food', 
      name: 'Food & Cuisine', 
      icon: ['fas', 'utensils'],
      color: 'bg-red-100 text-red-600',
      description: 'Delicious facts about food, cooking, and culinary traditions'
    },
    { 
      id: 'entertainment', 
      name: 'Entertainment', 
      icon: ['fas', 'film'],
      color: 'bg-pink-100 text-pink-600',
      description: 'Fun facts about movies, music, and pop culture'
    },
    { 
      id: 'sports', 
      name: 'Sports', 
      icon: ['fas', 'futbol'],
      color: 'bg-orange-100 text-orange-600',
      description: 'Exciting facts about sports and athletic achievements'
    },
    { 
      id: 'space', 
      name: 'Space & Astronomy', 
      icon: ['fas', 'meteor'],
      color: 'bg-indigo-100 text-indigo-600',
      description: 'Fascinating facts about space, stars, and the universe'
    },
    { 
      id: 'weird', 
      name: 'Weird & Unusual', 
      icon: ['fas', 'question-circle'],
      color: 'bg-cyan-100 text-cyan-600',
      description: 'Strange, bizarre, and surprising facts from around the world'
    },
    { 
      id: 'random', 
      name: 'Random Facts', 
      icon: ['fas', 'random'],
      color: 'bg-rose-100 text-rose-600',
      description: 'A mix of interesting facts from various categories'
    }
  ];
  
  const handleCategorySelect = (category) => {
    setSelectedCategory(category.id);
    navigate('/facts');
  };
  
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((category) => (
          <Card 
            key={category.id}
            className="cursor-pointer hover:shadow-lg bg-white/80 backdrop-blur-sm transition-all p-0 overflow-hidden"
            onClick={() => handleCategorySelect(category)}
          >
            <div className="flex items-center p-5">
              <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center mr-4 ${category.color}`}>
                <FontAwesomeIcon 
                  icon={category.icon} 
                  className="text-xl" 
                />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {category.description}
                </p>
              </div>
              <div className="btn-bounce">
                <FontAwesomeIcon 
                  icon={['fas', 'chevron-right']} 
                  className="text-gray-400 ml-2" 
                />
              </div>
            </div>
            {/* Fun color stripe at the bottom */}
            <div className={`h-1 w-full ${category.color.split(' ')[0].replace('100', '500')}`}></div>
          </Card>
        ))}
      </div>
      
      {/* Fun "Did you know" banner */}
      <div className="mt-8 bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-md">
        <div className="flex items-center">
          <span className="text-2xl mr-3">💡</span>
          <p className="text-gray-700 italic">
            Did you know? The average person will spend six months of their life waiting at traffic lights!
          </p>
        </div>
      </div>
    </div>
  );
};

export default CategoryList;