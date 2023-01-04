import axiosClient from './axiosClient';
import { Team } from '../types';

export default async function fetchTeam({ teamId }: { teamId: string }): Promise<Team> {
  const result = await axiosClient.get(`/teams/${teamId}?expand=team.roster`);
  return result.data?.teams?.[0];
}
