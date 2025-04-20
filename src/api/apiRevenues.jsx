import useAxios from './index.jsx';

export const getRevenues = async () => {
    try {
      const response = await useAxios.get('/revenues', {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.data; 
    } catch (error) {
      console.error('Error fetching revenues data:', error);
      throw error;
    }
}

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

