import { AxiosResponse } from 'axios';
import client from './client';

export default async function fetchPlayer({ playerId }: { playerId: string }): Promise<AxiosResponse> {
  return client.get(`/people/${playerId}`);
}
