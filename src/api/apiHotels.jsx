import useAxios from './index.jsx';

export const getHotels = async (page = 1, limit = 15) => {
  try {
    const response = await useAxios.get('/hotels', {
      params: { page, limit },
      headers: { 'Content-Type': 'application/json' },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching hotels data:', error);
    throw error;
  }
};

export const getHotelsDropdown = async () => {
  try {
    const response = await useAxios.get('/hotels/dropdown', {
      headers: { 'Content-Type': 'application/json' },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching hotels data:', error);
    throw error;
  }
};

export const searchHotels = async (searchTerm, page = 1, limit = 15) => {
  try {
    const response = await useAxios.get('/hotels/search', {
      params: { q: searchTerm, page, limit },
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error) {
    console.error('Error searching hotels:', error);
    throw error;
  }
};

export const inputHotels = async (data) => {
  try {
    const response = await useAxios.post('/hotels', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error uploading hotel data:', error);
    throw error;
  }
};

export const updateHotel = async (id, data) => {
  try {
    const response = await useAxios.put(`/hotels/${id}`, data, {
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

export const deleteHotel = async (id) => {
  try {
    const response = await useAxios.delete(`/hotels/${id}`, {
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

export const getHotelById = async (id) => {
  try {
    const response = await useAxios.get(`/hotels/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching hotel data by ID:', error);
    throw error;
  }
}



