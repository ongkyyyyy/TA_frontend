import useAxios from './index.jsx';

export const registerUser = async (username, password) => {
    try {
      const response = await useAxios.post('/register', {
        username,
        password
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      return response.data;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  };
  
  export const loginUser = async (username, password) => {
    try {
      const response = await useAxios.post('/login', {
        username,
        password
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const { token } = response.data;
      localStorage.setItem('token', token);
  
      return response.data;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  };  
  
  export const logoutUser = () => {
    localStorage.removeItem('token');
    return { message: 'Logged out successfully' };
  };  