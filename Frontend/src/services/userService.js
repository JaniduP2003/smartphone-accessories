import axios from 'axios';

const API_URL = 'http://localhost:8080/api/users';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No authentication token found');
    }
    return {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };
};

export const userService = {
    getUserProfile: async (email) => {
        try {
            const response = await axios.get(`${API_URL}/profile/${email}`, getAuthHeader());
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    updateUserDetails: async (userData) => {
        try {
            // Make sure we have all required fields
            if (!userData.email) {
                throw new Error('Email is required for update');
            }

            const config = getAuthHeader();
            const response = await axios.put(`${API_URL}/update`, userData, config);
            
            if (response.status === 200) {
                // For email updates, we need to handle token refresh
                if (userData.newEmail) {
                    // The backend should return a new token in the response
                    if (response.data.token) {
                        localStorage.setItem('token', response.data.token);
                        // Return the response directly for email updates
                        // The calling component will handle fetching updated details
                        return response;
                    } else {
                        throw new Error('No token received for email update');
                    }
                } else {
                    // For non-email updates, immediately fetch and return updated user details
                    const updatedUser = await axios.get(
                        `${API_URL}/profile/${userData.email}`,
                        getAuthHeader()
                    );
                    return updatedUser;
                }
            }
            return response;
        } catch (error) {
            if (error.response?.status === 403) {
                // If unauthorized, clear token and redirect to login
                localStorage.removeItem('token');
                window.location.href = '/login';
                throw new Error('Session expired. Please login again.');
            }
            throw error.response?.data || error.message;
        }
    },

    deleteUser: async (email) => {
        try {
            const response = await axios.delete(`${API_URL}/delete/${email}`, getAuthHeader());
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};
