import useAxios from './index.jsx';

export const getRevenues = async ({
  page,
  per_page,
  hotelId,
  minDate,
  maxDate,
  sort_by,
  sort_order,
  minRevenue,
  maxRevenue,
  minOccupancy,
  maxOccupancy,
} = {}) => {
  try {
    const params = {
      page,
      per_page,
      sort_by,
      sort_order,
    };

    if (hotelId) {
      if (Array.isArray(hotelId)) {
        params.hotel_id = hotelId.join(','); 
      } else {
        params.hotel_id = hotelId;
      }
    }
    if (minDate) params.min_date = minDate;
    if (maxDate) params.max_date = maxDate; 
    if (minRevenue !== undefined) params.minRevenue = minRevenue;
    if (maxRevenue !== undefined) params.maxRevenue = maxRevenue;
    if (minOccupancy !== undefined) params.minOccupancy = minOccupancy;
    if (maxOccupancy !== undefined) params.maxOccupancy = maxOccupancy;

    const token = localStorage.getItem("token");

    const response = await useAxios.get('/revenues', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      params,
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching revenues data:', error);
    throw error;
  }
};

export const inputRevenue = async (data) => {
  try {
    const token = localStorage.getItem("token"); 
    const response = await useAxios.post('/revenues', data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, 
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
    const token = localStorage.getItem("token"); 
    const response = await useAxios.put(`/revenues/${id}`, data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, 
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
    const token = localStorage.getItem("token"); 
    const response = await useAxios.delete(`/revenues/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, 
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error deleting hotel data:', error);
    throw error;
  }
}

