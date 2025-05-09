import useAxios from './index.jsx';

export const getScrapeLog = async ({
  page = 1,
  limit = 15,
  ota,
  status,
  startDate,
  endDate,
} = {}) => {
  try {
    const params = { page, limit };

    if (ota) {
      params.ota = ota;
    }
    if (status) {
      params.status = status;
    }
    if (startDate) {
      params.start_date = startDate; 
    }
    if (endDate) {
      params.end_date = endDate; 
    }

    const token = localStorage.getItem("token");

    const response = await useAxios.get('/scrape_logs', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      params,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching scrape logs data:', error);
    throw error;
  }
};
