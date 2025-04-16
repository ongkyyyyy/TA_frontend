import useAxios from './index.jsx';

export const getRevenue = async () => {
    try {
      const response = await useAxios.get('/revenue', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      return response.data;
    } catch (error) {
      console.error('Error fetching revenue data:', error);
      throw error;
    }
}