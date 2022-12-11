import { AxiosResponse } from 'axios';
import client from './client';

export default async function fetchCurrentSeason(): Promise<AxiosResponse> {
  return client.get(`/seasons/current`);
}
