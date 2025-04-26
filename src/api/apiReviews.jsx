import useAxios from './index.jsx';

export const getReviews = async (page = 1, search = '') => {
  try {
    const response = await useAxios.get(`/reviews?page=${page}&search=${encodeURIComponent(search)}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('response', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching reviews data:', error);
    throw error;
  }
};