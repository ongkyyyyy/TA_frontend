import useAxios from './index.jsx';

export const getHotels = async () => {
    try {
      const response = await useAxios.get('/hotels', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      return response.data;
    } catch (error) {
      console.error('Error fetching hotels data:', error);
      throw error;
    }
}