import { Techies } from 'infrastructure/connection/Techies';
import { Connection } from 'infrastructure/connection/Connection';

export interface IConnectionManager {
  get(techies: Techies): Promise<Connection>;
}
