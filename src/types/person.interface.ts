import Position from './position.interface';

enum Handedness {
  right = 'R',
  left = 'L',
}
export default interface Person {
  captain?: boolean;
  currentAge?: number;
  currentTeam?: {
    id: number;
  };
  fullName: string;
  height?: string;
  id: number;
  nationality?: string;
  primaryNumber?: string;
  primaryPosition?: Position;
  rookie?: boolean;
  shootsCatches?: Handedness;
  weight?: number;
}
