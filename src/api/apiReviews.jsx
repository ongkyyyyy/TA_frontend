import useAxios from './index.jsx';

export const getReviews = async () => {
    try {
      const response = await useAxios.get('/reviews', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      return response.data;
    } catch (error) {
      console.error('Error fetching reviews data:', error);
      throw error;
    }
}