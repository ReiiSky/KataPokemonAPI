export type KoaResponseMeta = {
  pagging: {
    offset: number;
    limit: number;
    count: number;
  };
};
