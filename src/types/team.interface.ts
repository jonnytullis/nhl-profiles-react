import Conference from './conference.interface';
import Division from './division.interface';
import RosterItem from './rosterItem.interface';

export default interface Team {
  abbreviation: string;
  conference: Conference;
  division: Division;
  id: number;
  name: string;
  roster?: { roster: RosterItem[] };
}
