import axiosClient from './axiosClient';
import { Person } from '../types';

export default async function fetchPlayer({ playerId }: { playerId: string }): Promise<Person> {
  const result = await axiosClient.get(`/people/${playerId}`);
  return result.data?.people?.[0];
}
