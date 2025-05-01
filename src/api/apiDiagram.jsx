import useAxios from './index.jsx';

export const getDiagram = async (hotelId, year) => {
  try {
    const response = await useAxios.get(`/diagram/revenue-sentiment/${hotelId}`, {
      params: { year },
      headers: { 'Content-Type': 'application/json' },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching diagram data:', error);
    throw error;
  }
};