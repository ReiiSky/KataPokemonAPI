import { REST } from './REST';
const app = new REST();

export const handler = app.serverless();
