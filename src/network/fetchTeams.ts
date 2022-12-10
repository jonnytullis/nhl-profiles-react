import { AxiosResponse } from 'axios';
import client from './client';

export default async function fetchTeams(): Promise<AxiosResponse> {
  return client.get('/teams');
}
