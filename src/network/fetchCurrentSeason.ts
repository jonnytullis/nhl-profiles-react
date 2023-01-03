import axiosClient from './axiosClient';
import { Season } from '../types';

export default async function fetchCurrentSeason(): Promise<Season> {
  const result = await axiosClient.get(`/seasons/current`);
  return result.data?.seasons?.[0];
}
