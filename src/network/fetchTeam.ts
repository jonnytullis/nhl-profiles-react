import { AxiosResponse } from 'axios';
import client from './client';

export default async function fetchTeam({ teamId }: { teamId: string }): Promise<AxiosResponse> {
  return client.get(`/teams/${teamId}?expand=team.roster`);
}
