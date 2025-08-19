// @ts-ignore
import { init, id } from '@instantdb/react-native';
import schema from '../../instant.schema';

const APP_ID = 'e7b0f553-e8ea-43e0-b602-aca8b34c9826';

export type Note = any;
export type Comment = any;
export type Reaction = any;

export const db = init({ appId: APP_ID, schema });
export { id };