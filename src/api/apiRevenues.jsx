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
    const token = localStorage.getItem("token"); 

    const response = await useAxios.get('/revenues/hotels-with-revenues', {
      params,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, 
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching revenues data:', error);
    throw error;
  }
};

export const getRevenues2 = async ({
  page = 1,
  perPage = 10,
  hotelIds = [], 
  minDate,
  maxDate,
  sortBy,
  sortOrder = 1,
  minRevenue,
  maxRevenue,
  minOccupancy,
  maxOccupancy,
} = {}) => {
  try {
    const params = {
      page,
      per_page: perPage,
    };

    if (hotelIds.length > 0) {
      params.hotel_ids = hotelIds.join(',');
    }
    if (minDate) {
      params.min_date = minDate;
    }
    if (maxDate) {
      params.max_date = maxDate;
    }
    if (sortBy) {
      params.sort_by = sortBy;
    }
    if (sortOrder !== undefined) {
      params.sort_order = sortOrder;
    }
    if (minRevenue !== undefined) {
      params.minRevenue = minRevenue;
    }
    if (maxRevenue !== undefined) {
      params.maxRevenue = maxRevenue;
    }
    if (minOccupancy !== undefined) {
      params.minOccupancy = minOccupancy;
    }
    if (maxOccupancy !== undefined) {
      params.maxOccupancy = maxOccupancy;
    }

    const token = localStorage.getItem("token");

    const response = await useAxios.get('/revenues', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      params,
    });
    console.log('Response data:', response);
    return response;
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

