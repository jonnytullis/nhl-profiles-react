import PositionType from './positionType.enum';

export default interface Position {
  abbreviation: string;
  code: string;
  name: string;
  type: PositionType;
}
