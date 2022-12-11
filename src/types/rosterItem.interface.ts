import Person from './person.interface';
import Position from './position.interface';

export default interface RosterItem {
  jerseyNumber: string;
  person: Person;
  position: Position;
}
