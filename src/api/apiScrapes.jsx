import useAxios from './index.jsx';

export const scrapeData = async (source, hotelId) => {
  try {
    const response = await useAxios.post(`/scrape/${source}`, {
      hotel_id: hotelId,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error scraping data:', error.response?.data || error);
    throw error;
  }
};
