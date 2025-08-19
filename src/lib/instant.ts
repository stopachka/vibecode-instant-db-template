// @ts-ignore
import { init, i, id } from '@instantdb/react-native';

const APP_ID = 'e7b0f553-e8ea-43e0-b602-aca8b34c9826';

// Database schema
const schema = i.schema({
  entities: {
    notes: i.entity({
      content: i.string(),
      createdAt: i.number().indexed(),
      unlockAt: i.number().indexed(),
      authorId: i.string().indexed(),
      isAnonymous: i.boolean().optional(),
    }),
    comments: i.entity({
      content: i.string(),
      noteId: i.string(),
      createdAt: i.number(),
      authorName: i.string().optional(), // Anonymous display name
    }),
  },
});

export type Note = any; // InstaQLEntity<typeof schema, 'notes'>;
export type Comment = any; // InstaQLEntity<typeof schema, 'comments'>;

export const db = init({ appId: APP_ID, schema });
export { id };