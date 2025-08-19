// @ts-ignore
import { init, i, InstaQLEntity, id } from '@instantdb/react-native';

const APP_ID = 'e7b0f553-e8ea-43e0-b602-aca8b34c9826';

// Database schema
const schema = i.schema({
  entities: {
    notes: i.entity({
      content: i.string(),
      createdAt: i.number(),
      unlockAt: i.number(),
      authorId: i.string(),
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

export type Note = InstaQLEntity<typeof schema, 'notes'>;
export type Comment = InstaQLEntity<typeof schema, 'comments'>;

export const db = init({ appId: APP_ID, schema });
export { id };