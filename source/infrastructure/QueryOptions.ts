import { ISpecification } from 'domain/context/ISpecification';

// TODO: add generic type for exclude fields
export type QueryOptions = {
  /**
   * An array of specifications to use if main specification return none;
   * @default []
   */
  alternativeIfNone: ISpecification[];

  /**
   * if true, only returns non-deleted rows
   * @default true
   */
  paranoid: boolean;

  /**
   * can be custom attributes, flags, or exclude fields.
   *
   * TODO: use generic to restrict what field be able to put here.
   * Eg: EncounterManagerColumns | EncounterManagerLimit | []EncounterManagerExcludes
   */
  attributes: string[];

  /**
   * limit of retrieved data, no applied for getOne.
   * @default 1
   */
  limit: number;

  /**
   * offset of how much data will be skiped
   * @default 0
   */
  offset: number;

  // Prioritize cache if exist
  useCache: boolean;
};
