import axios from 'axios';
import axiosRetry from 'axios-retry';

const client = axios.create({ baseURL: 'https://statsapi.web.nhl.com/api/v1' });
axiosRetry(client, { retries: 3 });

export default client;
