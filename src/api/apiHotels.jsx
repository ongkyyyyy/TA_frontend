import useAxios from './index.jsx';

export const getHotels = async (page = 1, limit = 15, searchTerm = "") => {
  try {
    const token = localStorage.getItem("token");

    const response = await useAxios.get('/hotels', {
      params: { page, limit, q: searchTerm || undefined },
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching hotels data:', error);
    throw error;
  }
};

export const getHotelsDropdown = async () => {
  try {
    const token = localStorage.getItem("token"); 

    const response = await useAxios.get('/hotels/dropdown', {
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, 
       },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching hotels data:', error);
    throw error;
  }
};

export const inputHotels = async (data) => {
  try {
    const token = localStorage.getItem("token"); 

    const response = await useAxios.post('/hotels', data, {
      headers: {
        
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
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
    const token = localStorage.getItem("token"); 

    const response = await useAxios.put(`/hotels/${id}`, data, {
      headers: {
        
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
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
    const token = localStorage.getItem("token"); 

    const response = await useAxios.delete(`/hotels/${id}`, {
      headers: {
        
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
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
    const token = localStorage.getItem("token"); 

    const response = await useAxios.get(`/hotels/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching hotel data by ID:', error);
    throw error;
  }
}



