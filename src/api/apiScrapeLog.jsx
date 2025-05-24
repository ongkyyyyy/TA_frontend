import useAxios from './index.jsx';

export const getScrapeLog = async ({ page = 1, limit = 15 } = {}) => {
  try {
    const params = { page, limit };

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
