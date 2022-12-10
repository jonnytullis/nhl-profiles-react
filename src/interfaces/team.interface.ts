import Conference from './conference.interface';
import Division from './division.interface';

export default interface Team {
  abbreviation: string;
  conference: Conference;
  division: Division;
  id: number;
  name: string;
}
