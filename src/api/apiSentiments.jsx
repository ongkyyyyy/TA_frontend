import useAxios from './index.jsx';

export const getSentiments = async () => {
    try {
      const token = localStorage.getItem("token"); 
      const response = await useAxios.get('/sentiments', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, 
        },
      });
  
      return response.data;
    } catch (error) {
      console.error('Error fetching sentiments data:', error);
      throw error;
    }
}