import useAxios from './index.jsx';

export const scrapeData = async (source, hotelId) => {
  try {
    const token = localStorage.getItem("token"); 
    const response = await useAxios.post(`/scrape/${source}`, {
      hotel_id: hotelId,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, 
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error scraping data:', error.response?.data || error);
    throw error;
  }
};
