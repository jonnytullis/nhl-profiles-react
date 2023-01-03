import axiosClient from './axiosClient';
import { Team } from '../types';

export default async function fetchTeams({ withRosters = false }: { withRosters?: boolean } = {}): Promise<Team[]> {
  const params = { expand: withRosters ? 'team.roster' : undefined };
  const result = await axiosClient.get('/teams', { params });
  return result.data.teams;
}
