const BASE_URL = "https://uselessfacts.jsph.pl/api/v2";

export const fetchRandomFact = async (language = 'en') => {
    try {
      const response = await fetch(`${BASE_URL}/facts/random?language=${language}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const factData = await response.json();
      return factData;
    } catch (error) {
      console.error('Error fetching fact:', error);
      throw error;
    }
  };
  
  export const fetchFactByCategory = async (category, language = 'en') => {
    try {
      // The uselessfacts API doesn't support category filtering directly
      // So we fetch a random fact and assign the requested category
      const factData = await fetchRandomFact(language);
      
      // Explicitly add the category to the fact
      return {
        ...factData,
        category: category || 'random'
      };
    } catch (error) {
      console.error('Error fetching fact by category:', error);
      throw error;
    }
  };
  

export const fetchMultipleRandomFacts = async (count = 3, language = "en") => {
  try {
    // Since the API doesn't have a bulk endpoint, we'll make multiple calls
    const promises = Array(count)
      .fill()
      .map(() => fetchRandomFact(language));
    const facts = await Promise.all(promises);

    return facts;
  } catch (error) {
    console.error("Error fetching multiple facts:", error);
    throw error;
  }
};
