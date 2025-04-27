  import useAxios from './index.jsx';

  export const getReviews = async (page = 1, search = '', sentiment) => {
    try {
      const params = { page, search: encodeURIComponent(search) };
      if (sentiment) {
        params.sentiment = sentiment;  
      }
  
      const response = await useAxios.get('/reviews', {
        headers: {
          'Content-Type': 'application/json',
        },
        params, 
      });
  
      return response.data;
    } catch (error) {
      console.error('Error fetching reviews data:', error);
      throw error;
    }
  };
