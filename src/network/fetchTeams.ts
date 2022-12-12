import { AxiosResponse } from 'axios';
import client from './client';

export default async function fetchTeams({
  withRosters = false,
}: { withRosters?: boolean } = {}): Promise<AxiosResponse> {
  const params = { expand: withRosters ? 'team.roster' : undefined };
  return client.get('/teams', { params });
}
