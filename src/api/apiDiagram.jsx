import useAxios from './index.jsx';

export const getDiagram = async (hotelId, year) => {
  try {
    const token = localStorage.getItem("token"); 

    const response = await useAxios.get(`/diagram/revenue-sentiment`, {
      params: { hotel_id: hotelId, year },
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, 
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching diagram data:', error);
    throw error;
  }
};
