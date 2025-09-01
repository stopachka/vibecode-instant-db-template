Instant is the Modern Firebase. With Instant you can easily build realtime and collaborative apps. You can get started for free at https://instantdb.com

# How to use Instant

Instant offers client side javascript packages for vanilla JS, react, and react native. Instant also offers a javascript admin SDK that can be used on the backend.

If you want to use Instant with react-native you should _only_ use `@instantdb/react-native`. For scripts or server environments you should only use the admin SDK `@instantdb/admin`.

CRITICAL: We have already filled in an `EXPO_PUBLIC_INSTANT_APP_ID` and a `INSTANT_ADMIN_TOKEN` in .env. Use them.

CRITICAL: If you want to create seed data YOU MUST write a script that uses the admin SDK. DO NOT try to seed data on the client.

# Your repository

We have created a full template app built with InstantDB and Expo, with the following features:

- Initiailizes a connection to InstantDB
- Defines schema for the app
- Authentication with magic codes
- Reads and writes data via `db.useQuery` and `db.transact`
- Ephemeral features like who's online and shout
- File uploads for avatars

Logic is split across a few files:

- `src/instant.schema.ts` - InstantDB schema, gives you type safety for your data!
- `src/lib/db.ts` -- InstantDB client setup
- `src/auth/SignIn.tsx` - login page
- `src/auth/AuthorizedContainer.tsx` - Responsible for creating a profile after registration, and has hooks for profiles
- `src/_layout.tsx` - Ensures you are logged in, creates a profile, and sets up tabs
- `src/app/index.tsx` - The home page: shows logic for Instant queries and transactions.
- `src/app/profile.tsx` - The profile page, to manage the user and log them out.

CRITICAL: Most apps are going to require auth, which is great. If you don't need auth though, you can remove SignIn.tsx and AuthorizedContainer.tsx. If you change up the file structure related to Instant, you should update this rules file too to reflect that.

# Important Concepts

## instant.schema.ts

To get a sense of how to use Instant you need to understand three important concepts. First is the instant.schema.ts file. Here's how a moderately complex one looks:

```typescript
import { i } from "@instantdb/react-native";

const _schema = i.schema({
  entities: {
    $files: i.entity({
      path: i.string().unique().indexed(),
      url: i.string(),
    }),
    $users: i.entity({
      email: i.string().unique().indexed().optional(),
    }),
    profiles: i.entity({
      handle: i.string(),
    }),
    posts: i.entity({
      text: i.string(),
      createdAt: i.number().indexed(),
    }),
  },
  links: {
    userProfiles: {
      forward: { on: "profiles", has: "one", label: "user" },
      reverse: { on: "$users", has: "one", label: "profile" },
    },
    postAuthors: {
      forward: { on: "posts", has: "one", label: "author" },
      reverse: { on: "profiles", has: "many", label: "posts" },
    },
    profileAvatars: {
      forward: { on: "profiles", has: "one", label: "avatar" },
      reverse: { on: "$files", has: "one", label: "profile" },
    },
  },
  rooms: {
    todos: {
      presence: i.entity({}),
      topics: {
        shout: i.entity({
          text: i.string(),
          x: i.number(),
          y: i.number(),
          angle: i.number(),
          size: i.number(),
        }),
      },
    },
  },
});

// This helps Typescript display nicer intellisense
type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;
```

This lets you define relationships and their links.

CRITICAL: If you are about to make a complicated schema change, make sure to read `modeling-data`

## queries

Once you have relations, you can use `db.useQuery` to make queries. Here's how a reasonably complex query looks:

```typescript
function App()
  const { isLoading, error, data } = db.useQuery({
    posts: {
      $: {
        order: { createdAt: "desc" },
        limit: pageSize,
        offset: (pageNumber - 1) * pageSize,
      },
      author: { avatar: {} },
    },
  });
}
```

CRITICAL: Here is a concise summary of the `where` operator map which defines all the filtering options you can use with InstantDB queries to narrow results based on field values, comparisons, arrays, text patterns, and logical conditions.

```
Equality:        { field: value }

Inequality:      { field: { $ne: value } }

Null checks:     { field: { $isNull: true | false } }

Comparison:      $gt, $lt, $gte, $lte   (indexed + typed fields only)

Sets:            { field: { $in: [v1, v2] } }

Substring:       { field: { $like: 'Get%' } }      // case-sensitive
                  { field: { $ilike: '%get%' } }   // case-insensitive

Logic:           and: [ {...}, {...} ]
                  or:  [ {...}, {...} ]

Nested fields:   'relation.field': value
```

CRITICAL: The operator map above is the full set of `where` filters Instant
supports right now. There is no `$exists`, `$nin`, or `$regex`. And `$like` and
`$ilike` are what you use for `startsWith` / `endsWith` / `includes`.

CRITICAL: Pagination keys (`limit`, `offset`, `first`, `after`, `last`, `before`) only work on top-level namespaces. DO NOT use them on nested relations or else you will get an error.

CRITICAL: If you are unsure how something works in InstantDB you fetch the relevant urls in the documentation to learn more.

CRITICAL: Make sure to follow the rules of hooks.

CRITICAL: If you are about to make a more complicated query, make sure to read `instaql`

## transactions

You can also make transactions:

```typescript
function addPost(text: string, authorId: string): void {
  db.transact(
    db.tx.posts[id()]
      .update({ text, createdAt: Date.now() })
      .link({ author: authorId })
  );
}

function deletePost(postId: string): void {
  db.transact(db.tx.posts[postId].delete());
}
```

CRITICAL: If you are about to make a more complicated transaction, read `instaml`

# Documentation

The bullets below are links to the InstantDB documentation. They provide detailed information on how to use different features of InstantDB. Each line follows the pattern of

- [TOPIC](URL): Description of the topic.

Fetch the URL for a topic to learn more about it.

- [Common mistakes](https://instantdb.com/docs/common-mistakes.md): Common mistakes when working with Instant
- [Initializing Instant](https://instantdb.com/docs/init.md): How to integrate Instant with your app.
- [Modeling data](https://instantdb.com/docs/modeling-data.md): How to model data with Instant's schema.
- [Writing data](https://instantdb.com/docs/instaml.md): How to write data with Instant using InstaML.
- [Reading data](https://instantdb.com/docs/instaql.md): How to read data with Instant using InstaQL.
- [Instant on the Backend](https://instantdb.com/docs/backend.md): How to use Instant on the server with the Admin SDK.
- [Patterns](https://instantdb.com/docs/patterns.md): Common patterns for working with InstantDB.
- [Auth](https://instantdb.com/docs/auth.md): Instant supports magic code, OAuth, Clerk, and custom auth.
- [Auth](https://instantdb.com/docs/auth/magic-codes.md): How to add magic code auth to your Instant app.
- [Managing users](https://instantdb.com/docs/users.md): How to manage users in your Instant app.
- [Presence, Cursors, and Activity](https://instantdb.com/docs/presence-and-topics.md): How to add ephemeral features like presence and cursors to your Instant app.
- [Instant CLI](https://instantdb.com/docs/cli.md): How to use the Instant CLI to manage schema.
- [Storage](https://instantdb.com/docs/storage.md): How to upload and serve files with Instant.

# Expo Notes

Be mindful of TextInput. It can be easy to write a TextInput that is hard to dismiss. If you add a TextInput, make sure it is easy to dismiss.
