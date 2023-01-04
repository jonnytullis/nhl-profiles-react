import axios from 'axios';

const axiosClient = axios.create({ baseURL: 'https://statsapi.web.nhl.com/api/v1' });

export default axiosClient;
