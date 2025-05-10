import useAxios from './index.jsx';

export const getReviews = async ({
  page = 1,
  search = '',
  sentiment,
  minRating,
  maxRating,
  ota,
  minDate,
  maxDate,
  hotelId, 
} = {}) => {
  try {
    const params = { page };

    if (search) {
      params.search = encodeURIComponent(search);
    }
    if (sentiment) {
      params.sentiment = sentiment;
    }
    if (minRating !== undefined) {
      params.min_rating = minRating;
    }
    if (maxRating !== undefined) {
      params.max_rating = maxRating;
    }
    if (ota) {
      params.ota = ota;
    }
    if (minDate) {
      params.min_date = minDate;
    }
    if (maxDate) {
      params.max_date = maxDate;
    }
    if (hotelId) {
      if (Array.isArray(hotelId)) {
        params.hotel_id = hotelId.join(','); 
      } else {
        params.hotel_id = hotelId;
      }
    }

    const token = localStorage.getItem("token");

    const response = await useAxios.get('/reviews', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      params,
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching reviews data:', error);
    throw error;
  }
};
