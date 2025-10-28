import { Output } from 'application/usecase/io/Output';

export interface Response {
  successCode: number;
  // biome-ignore lint/suspicious/noExplicitAny: varies output data for every controller
  output: Output<any>;
}
