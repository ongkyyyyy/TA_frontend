import useAxios from './index.jsx';

export const getReviews = async (page = 1) => {
  try {
    const response = await useAxios.get(`/reviews?page=${page}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching reviews data:', error);
    throw error;
  }
};
