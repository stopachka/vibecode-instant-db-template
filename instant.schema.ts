// instant.schema.ts
import { i } from '@instantdb/react-native';

const _schema = i.schema({
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
      noteId: i.string().indexed(),
      createdAt: i.number().indexed(),
      authorName: i.string().optional(),
    }),
    reactions: i.entity({
      noteId: i.string().indexed(),
      emoji: i.string().indexed(),
      userId: i.string().indexed(),
      createdAt: i.number().indexed(),
    }),
  },
});

// This helps TypeScript display better intellisense
type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;