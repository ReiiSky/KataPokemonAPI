import { Option } from 'package/Option';

export type OptionObject<T> = {
  [P in keyof T]: Option<T[P]>;
};
