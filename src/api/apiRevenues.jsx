import useAxios from './index.jsx';

export const getRevenues = async ({
  page = 1,
  per_page_hotels = 5,
  revenues_per_hotel = 10,
  hotel_id = null,
  min_date = null,
  max_date = null,
  sort_by = 'date',
  sort_order = 1,
  minRevenue = null,
  maxRevenue = null,
  minOccupancy = null,
  maxOccupancy = null
} = {}) => {
  try {
    const params = {
      page,
      per_page_hotels,
      revenues_per_hotel,
      sort_by,
      sort_order,
    };

    if (hotel_id) params.hotel_id = hotel_id;
    if (min_date) params.min_date = min_date;
    if (max_date) params.max_date = max_date;
    if (minRevenue) params.min_revenue = minRevenue;
    if (maxRevenue) params.max_revenue = maxRevenue;
    if (minOccupancy) params.min_occupancy = minOccupancy;
    if (maxOccupancy) params.max_occupancy = maxOccupancy;
    console.log("Sending params:", params);

    const response = await useAxios.get('/revenues/hotels-with-revenues', {
      params,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching revenues data:', error);
    throw error;
  }
};

export const inputRevenue = async (data) => {
  try {
    const response = await useAxios.post('/revenues', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error uploading data:', error);
    throw error;
  }
};

export const updateRevenue = async (id, data) => {
  try {
    const response = await useAxios.put(`/revenues/${id}`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating hotel data:', error);
    throw error;
  }
}

export const deleteRevenue = async (id) => {
  try {
    const response = await useAxios.delete(`/revenues/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error deleting hotel data:', error);
    throw error;
  }
}

