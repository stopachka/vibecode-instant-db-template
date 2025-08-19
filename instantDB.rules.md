# What is InstantDB

Backend-as-a-Service (BaaS) with optimistic updates, multiplayer, offline support, and relational data. Firebase alternative with relations.

## Core Features

- Optimistic updates
- Real-time multiplayer sync
- Offline-first architecture
- Relational data support
- Web and mobile compatible

## API

CRITICAL: These are the only APIs from the react native package you need to know. do not hallucinate other APIs.

```
// Initialization
init<Schema>(config: InstantConfig<Schema>): InstantReactNativeDatabase<Schema>

// Transaction builder
tx: TxChunk<Schema>
id(): string
lookup(attribute: string, value: any): Lookup

// Schema builder
i.schema({ entities, links?, rooms? })
i.entity(attrs)
i.string(), i.number(), i.boolean(), i.date(), i.json(), i.any()

// Core Database Methods (on db instance)
db.transact(chunks)

// React Hooks (on db instance)
db.useQuery(query, opts?)
db.useAuth()
db.room(type?, id?)

// Auth Methods (on db.auth)
db.auth.sendMagicCode({ email })
db.auth.signInWithMagicCode({ email, code })
db.auth.signOut(opts?)

// Room Hooks (on db.rooms) - IMPORTANT: These are called on db.rooms, not on room instances
db.rooms.useTopicEffect(room, topic, onEvent)
db.rooms.usePublishTopic(room, topic) // returns: (data) => void
db.rooms.usePresence(room, opts?) // returns: { peers, user, publishPresence, isLoading }
db.rooms.useSyncPresence(room, data, deps?)
db.rooms.useTypingIndicator(room, inputName, opts?) // returns: { active, setActive, inputProps }

// Components
<Cursors room={room} {...props} />
```

# How to initialize DB

Create a central DB instance (single connection maintained per app ID):

```typescript
// lib/db.ts
import { init } from "@instantdb/react-native";
import schema from "../instant.schema";

export const db = init({
  // Get your app ID from https://instantdb.com
  appId: "your-app-id",
  schema,
});
```

`init` accepts the following parameters:

```typescript
export type InstantConfig<S extends InstantSchemaDef<any, any, any>> = {
  appId: string;
  schema?: S;
};
```

# How to do queries

## Core Concepts

- **Namespaces**: Entity collections (tables)
- **Queries**: JS objects describing data needs
- **Associations**: Entity relationships

## Query Structure

```typescript
{
  namespace1: {
    $: { /* operators */ },
    linkedNamespace: { $: { /* operators */ } }
  },
  namespace2: { /* ... */ }
}
```

## Basic Usage

**Required**: Handle `isLoading` and `error` states:

```typescript
const { isLoading, data, error } = db.useQuery({ todos: {} });
if (isLoading) return;
if (error) return <div>Error: {error.message}</div>;
return <pre>{JSON.stringify(data, null, 2)}</pre>;
```

### Fetch Operations

```typescript
// Single namespace
const query = { goals: {} };

// Multiple namespaces
const query = { goals: {}, todos: {} };
```

## Filtering

### By ID

```typescript
const query = {
  goals: {
    $: { where: { id: "goal-1" } },
  },
};
```

### Multiple Conditions (AND)

```typescript
const query = {
  todos: {
    $: { where: { completed: true, priority: "high" } },
  },
};
```

## Associations (JOINs)

### Fetch Related

```typescript
// Goals with todos
const query = { goals: { todos: {} } };

// Inverse: Todos with goals
const query = { todos: { goals: {} } };
```

### Filter by Association

```typescript
// Dot notation for associated values
const query = {
  goals: {
    $: { where: { "todos.title": "Go running" } },
    todos: {},
  },
};
```

### Filter Associated Entities

```typescript
const query = {
  goals: {
    todos: {
      $: { where: { completed: true } },
    },
  },
};
```

## Operators

### Logical

```typescript
// AND
where: {
  and: [{ "todos.priority": "high" }, { "todos.dueDate": { $lt: tomorrow } }];
}

// OR
where: {
  or: [{ priority: "high" }, { dueDate: { $lt: tomorrow } }];
}
```

### Comparison (indexed fields only)

- `$gt`, `$lt`, `$gte`, `$lte`

```typescript
where: {
  timeEstimate: {
    $gt: 2;
  }
}
```

### Other Operators

```typescript
// IN
where: {
  priority: {
    $in: ["high", "critical"];
  }
}

// NOT
where: {
  location: {
    $not: "work";
  }
}

// NULL check
where: {
  location: {
    $isNull: true;
  }
}

// Pattern matching (indexed strings)
where: {
  title: {
    $like: "Get%";
  }
} // Case-sensitive
where: {
  title: {
    $ilike: "get%";
  }
} // Case-insensitive
```

Pattern syntax:

- `'prefix%'` - Starts with
- `'%suffix'` - Ends with
- `'%substring%'` - Contains

## Pagination & Ordering

### Pagination (top-level only)

```typescript
$: { limit: 10, offset: 10 }
```

### Ordering (indexed fields)

```typescript
$: {
  order: {
    dueDate: "asc";
  }
} // or 'desc'
```

## Field Selection

```typescript
// Select specific fields
$: { fields: ['title', 'status'] }

// With nested associations
goals: {
  $: { fields: ['title'] },
  todos: { $: { fields: ['status'] } }
}
```

## Deferred Queries

```typescript
const query = user ? { todos: { $: { where: { userId: user.id } } } } : null;
```

## Complex Example

```typescript
const query = {
  goals: {
    $: {
      where: { or: [{ status: "active" }, { "todos.priority": "high" }] },
      limit: 5,
      order: { serverCreatedAt: "desc" },
      fields: ["title", "description"],
    },
    todos: {
      $: {
        where: { completed: false, dueDate: { $lt: nextWeek } },
        fields: ["title", "dueDate"],
      },
    },
  },
};
```

## Best Practices

1. Index fields for filtering/sorting/comparison
2. Use field selection to minimize data transfer
3. Defer queries when dependencies aren't ready
4. Limit deep association nesting
5. Use where/limit/pagination for large datasets

## Common Errors

- **"Field must be indexed"**: Add index in Explorer/schema
- **"Invalid operator"**: Check syntax/spelling
- **"Invalid query structure"**: Verify $ placement

# How to do transactions

## Core Concepts

- **Transactions**: Atomic operation groups
- **Transaction Chunks**: Individual operations
- **Proxy Syntax**: `db.tx` object for creating chunks

## Basic Structure

```typescript
db.transact(db.tx.NAMESPACE[ENTITY_ID].ACTION(DATA));
```

## Entity IDs

### Generate with `id()`

```typescript
import { id } from "@instantdb/react-native";

// New ID
const newTodoId = id();
db.transact(db.tx.todos[newTodoId].update({ text: "New todo" }));

// Inline
db.transact(db.tx.todos[id()].update({ text: "Another todo" }));
```

### Lookup by Unique Attributes

```typescript
import { lookup } from "@instantdb/react-native";

// Schema must define unique attributes
db.transact(
  db.tx.profiles[lookup("handle", "nezaj")].update({
    bio: "I like turtles",
  })
);
```

## Creating Entities

Use `update` (not `create`):

```typescript
db.transact(
  db.tx.todos[id()].update({
    text: "Complex todo", // String
    priority: 1, // Number
    completed: false, // Boolean
    tags: ["work", "important"], // Array
    metadata: {
      // Object
      assignee: "user-123",
      dueDate: "2025-01-15",
    },
  })
);
```

## Updating Entities

### Basic Update

```typescript
db.transact(db.tx.todos[todoId].update({ done: true }));
```

### Deep Merge (nested objects)

```typescript
// Preserves unspecified nested fields
db.transact(
  db.tx.profiles[userId].merge({
    preferences: { theme: "dark" },
  })
);
```

### Remove Keys

```typescript
db.transact(
  db.tx.profiles[userId].merge({
    preferences: { notifications: null },
  })
);
```

## Deleting Entities

```typescript
// Single
db.transact(db.tx.todos[todoId].delete());

// Multiple
db.transact([db.tx.todos[todoId1].delete(), db.tx.todos[todoId2].delete()]);

// Conditional
const completedTodos = data.todos.filter((todo) => todo.done);
db.transact(completedTodos.map((todo) => db.tx.todos[todo.id].delete()));
```

## Relationships

### Link Entities

```typescript
// Single link
db.transact(db.tx.projects[projectId].link({ todos: todoId }));

// Multiple links
db.transact(
  db.tx.projects[projectId].link({
    todos: [todoId1, todoId2, todoId3],
  })
);

// Bidirectional (equivalent)
db.transact(db.tx.projects[projectId].link({ todos: todoId }));
db.transact(db.tx.todos[todoId].link({ projects: projectId }));
```

### Unlink

```typescript
db.transact(db.tx.projects[projectId].unlink({ todos: todoId }));
```

### Link with Lookup

```typescript
db.transact(
  db.tx.profiles[lookup("email", "user@example.com")].link({
    projects: lookup("name", "Project Alpha"),
  })
);
```

## Advanced Operations

### Combined Operations

```typescript
// Update + link
db.transact(db.tx.todos[id()].update({ text: "New todo", done: false }).link({ projects: projectId }));

// Multiple in transaction
db.transact([db.tx.todos[todoId].update({ done: true }), db.tx.projects[projectId].update({ completedCount: 10 })]);
```

### Special Namespaces

```typescript
// Link to authenticated user ($users is system namespace)
db.transact(db.tx.todos[todoId].link({ $users: auth.userId }));
```

## Performance

### Batch Large Operations

```typescript
const batchSize = 100;
const createManyTodos = async (count) => {
  for (let i = 0; i < count; i += batchSize) {
    const batch = [];
    for (let j = 0; j < batchSize && i + j < count; j++) {
      batch.push(
        db.tx.todos[id()].update({
          text: `Todo ${i + j}`,
          done: false,
        })
      );
    }
    await db.transact(batch);
  }
};
```

## Common Patterns

### Create-or-Update

```typescript
db.transact(
  db.tx.profiles[lookup("email", "user@example.com")].update({
    lastLoginAt: Date.now(),
  })
);
```

### Toggle Boolean

```typescript
const toggleTodo = (todo) => {
  db.transact(db.tx.todos[todo.id].update({ done: !todo.done }));
};
```

### Sequential Transactions

```typescript
const createProjectAndTasks = async (projectData) => {
  const result = await db.transact(db.tx.projects[id()].update(projectData));
  const projectId = result.ids.projects[0];
  await db.transact(
    db.tx.tasks[id()]
      .update({
        title: "Initial planning",
      })
      .link({ project: projectId })
  );
};
```

## Error Handling

```typescript
try {
  await db.transact(/* ... */);
} catch (error) {
  console.error("Transaction failed:", error);
}
```

## Important: Make sure to use `transact` inside a `useEffect` or event handler

Do not use `transact` inside a component render. This will cause an error.

```typescript
// ❌ Wrong
function MyComponent() {
  // This will cause an error
  db.transact(db.tx.todos[id()].update({ text: "New todo" }));
  return <div>My component</div>;
}

// ✅ Correct
function MyComponent() {
  const handleClick = () => {
    db.transact(db.tx.todos[id()].update({ text: "New todo" }));
  };
  return <button onClick={handleClick}>Create todo</button>;
}
```

## Common Mistakes

- Using non-UUID IDs (must use `id()` or `lookup()`)
- Using `create` method (doesn't exist, use `update`)
- Direct `$users` updates (link only)
- Using `update` for nested objects (use `merge`)
- Not batching large transactions
- Using `lookup` on non-unique fields
- Using `transact` in render (use `useEffect` or event handlers)

# How to model data

Schema is declared as code. System namespaces start with `$` (e.g., `$users`).

## Core Concepts

- **Namespaces**: Entity collections (tables)
- **Attributes**: Entity properties with types
- **Links**: Entity relationships
- **Rooms**: Ephemeral namespaces (cursors, etc.)

## Schema Setup

```typescript
// instant.schema.ts
import { i } from "@instantdb/react-native";

const _schema = i.schema({
  entities: {
    /* namespaces */
  },
  links: {
    /* relationships */
  },
  rooms: {
    /* ephemeral data */
  },
});

type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;
```

## Namespaces

```typescript
entities: {
  profiles: i.entity({ /* attributes */ }),
  posts: i.entity({ /* attributes */ }),
  comments: i.entity({ /* attributes */ })
}
```

Rules:

- Alphanumeric + underscores
- No spaces
- Unique names
- No `$` prefix (reserved)

## Attributes

### Types

| Type          | Description    | Example                    |
| ------------- | -------------- | -------------------------- |
| `i.string()`  | Text           | `title: i.string()`        |
| `i.number()`  | Numeric        | `viewCount: i.number()`    |
| `i.boolean()` | True/false     | `isPublished: i.boolean()` |
| `i.date()`    | Date/time      | `publishedAt: i.date()`    |
| `i.json()`    | Nested objects | `metadata: i.json()`       |
| `i.any()`     | Untyped        | `miscData: i.any()`        |

### Constraints & Performance

```typescript
posts: i.entity({
  slug: i.string().unique(), // Unique + auto-indexed
  title: i.string(),
  category: i.string().indexed(), // Indexed for queries
  publishedAt: i.date().indexed(),
});
```

## Links (Relationships)

### Basic Structure

```typescript
links: {
  postAuthor: {
    forward: { on: 'posts', has: 'one', label: 'author' },
    reverse: { on: 'profiles', has: 'many', label: 'authoredPosts' }
  }
}
```

### Relationship Types

**One-to-One**

```typescript
profileUser: {
  forward: { on: 'profiles', has: 'one', label: '$user' },
  reverse: { on: '$users', has: 'one', label: 'profile' }
}
```

**One-to-Many**

```typescript
postAuthor: {
  forward: { on: 'posts', has: 'one', label: 'author' },
  reverse: { on: 'profiles', has: 'many', label: 'authoredPosts' }
}
```

**Many-to-Many**

```typescript
postsTags: {
  forward: { on: 'posts', has: 'many', label: 'tags' },
  reverse: { on: 'tags', has: 'many', label: 'posts' }
}
```

### System Namespace Links

Always link TO system namespaces in reverse:

```typescript
// ✅ Correct
forward: { on: 'profiles', has: 'one', label: '$user' },
reverse: { on: '$users', has: 'one', label: 'profile' }
```

### Cascade Delete

```typescript
postAuthor: {
  forward: { on: 'posts', has: 'one', label: 'author', onDelete: 'cascade' },
  reverse: { on: 'profiles', has: 'many', label: 'authoredPosts' }
}
```

## Complete Example

```typescript
import { i } from "@instantdb/react-native";

const _schema = i.schema({
  entities: {
    $users: i.entity({
      email: i.string().unique().indexed(),
    }),
    profiles: i.entity({
      nickname: i.string().unique(),
      bio: i.string(),
      createdAt: i.date().indexed(),
    }),
    posts: i.entity({
      title: i.string(),
      slug: i.string().unique().indexed(),
      body: i.string(),
      isPublished: i.boolean().indexed(),
      publishedAt: i.date().indexed(),
    }),
    comments: i.entity({
      body: i.string(),
      createdAt: i.date().indexed(),
    }),
    tags: i.entity({
      name: i.string().unique().indexed(),
    }),
  },
  links: {
    profileUser: {
      forward: { on: "profiles", has: "one", label: "$user", onDelete: "cascade" },
      reverse: { on: "$users", has: "one", label: "profile", onDelete: "cascade" },
    },
    postAuthor: {
      forward: { on: "posts", has: "one", label: "author", onDelete: "cascade" },
      reverse: { on: "profiles", has: "many", label: "authoredPosts" },
    },
    commentPost: {
      forward: { on: "comments", has: "one", label: "post", onDelete: "cascade" },
      reverse: { on: "posts", has: "many", label: "comments" },
    },
    commentAuthor: {
      forward: { on: "comments", has: "one", label: "author", onDelete: "cascade" },
      reverse: { on: "profiles", has: "many", label: "authoredComments" },
    },
    postsTags: {
      forward: { on: "posts", has: "many", label: "tags" },
      reverse: { on: "tags", has: "many", label: "posts" },
    },
  },
});

type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;
```

## TypeScript Integration

```typescript
import { InstaQLEntity } from "@instantdb/react-native";
import { AppSchema } from "../instant.schema";

// Type-safe entities
type Post = InstaQLEntity<AppSchema, "posts">;
type PostWithAuthor = InstaQLEntity<AppSchema, "posts", { author: {} }>;

function PostEditor({ post }: { post: Post }) {
  return <h1>{post.title}</h1>;
}
```

## Important: Do not use the same label for an attribute and a reference

If you do this this will cause errors when you try to query the data. Make sure
to use different labels for attributes and references.

```typescript
const _schema = i.schema({
  entities: {
    notes: i.entity({
      title: i.string().indexed(),
      content: i.string(),
      // ❌ Wrong: `tags` is both an attribute and a reference
      tags: i.json(),
      isPinned: i.boolean().indexed(),
      createdAt: i.date().indexed(),
      updatedAt: i.date().indexed(),
    }),
    tags: i.entity({
      name: i.string().unique().indexed(),
      color: i.string(),
    }),
  },
  links: {
    notesTags: {
      forward: { on: "notes", has: "many", label: "tags" },
      reverse: { on: "tags", has: "many", label: "notes" },
    },
  },
});
```

## Best Practices

1. Index frequently queried attributes
2. Use unique constraints for usernames, slugs
3. Clear, descriptive link labels
4. Set cascade delete for dependent relationships
5. Use TypeScript utility types

## Common Mistakes

- Creating `$` prefixed namespaces
- Not indexing query fields
- Ambigious attribute and reference labels
- Wrong system namespace link direction
- Using non-indexed fields in queries/sorting

# How to write permissions

Define access controls using Google's CEL expression language.

## Core Operations

- **view**: Read access (queries)
- **create**: Create new entities
- **update**: Modify existing entities
- **delete**: Remove entities

## Default Behavior

All permissions default to `true` (unrestricted).

```typescript
// These are equivalent:
{} // Empty rules
{ todos: { allow: {} } } // No rules specified
{ todos: { allow: { view: "true", create: "true", update: "true", delete: "true" } } }
```

## Key Features

### `$default` for Namespace Defaults

```typescript
{
  todos: {
    allow: {
      $default: "false",      // Deny all by default
      view: "auth.id != null" // Explicitly allow viewing
    }
  }
}
```

### `auth` and `data` Objects

- `auth`: Current authenticated user
- `data`: Current entity being accessed

```typescript
{
  todos: {
    allow: {
      view: "auth.id != null",
      update: "auth.id == data.ownerId"
    }
  }
}
```

### `bind` for Reusable Logic

```typescript
{
  todos: {
    allow: {
      view: "isLoggedIn",
      $default: "isOwner || isAdmin"
    },
    bind: [
      "isLoggedIn", "auth.id != null",
      "isOwner", "isLoggedIn && auth.id == data.ownerId",
      "isAdmin", "isLoggedIn && auth.email in ['admin@example.com']"
    ]
  }
}
```

### `data.ref` for Linked Data

Returns CEL list - use `in` operator or index `[0]` for single values.

```typescript
// ✅ Correct
"update": "auth.id in data.ref('post.author.id')"
"view": "auth.id == data.ref('owner.id')[0]"
"view": "size(data.ref('owner.id')) > 0"

// ❌ Wrong
"update": "auth.id == data.ref('post.author.id')"  // Always returns list
"view": "data.ref('owner')"                        // Must specify attribute
"view": "data.ref('owner.id') != null"            // Check against [] not null
```

### `auth.ref` for User's Linked Data

Must use `$user` prefix.

```typescript
// ✅ Correct
"create": "'admin' in auth.ref('$user.role.type')"
"create": "auth.ref('$user.role.type')[0] == 'admin'"

// ❌ Wrong
"create": "'admin' in auth.ref('role.type')"  // Missing $user prefix
```

### `newData` for Update Comparisons

```typescript
{
  posts: {
    allow: {
      // Authors can update but not change published status
      update: "auth.id == data.authorId && newData.isPublished == data.isPublished";
    }
  }
}
```

### `ruleParams` for Non-Auth Permissions

```typescript
// app/page.tsx
const docId = new URLSearchParams(window.location.search).get("docId");
const { data } = db.useQuery({ docs: {} }, { ruleParams: { docId } });

db.transact(
  db.tx.docs[docId].ruleParams({ docId }).update({ title: 'eat' })
);

// instant.perms.ts
{
  documents: {
    allow: {
      view: "data.id == ruleParams.docId",
      update: "data.id == ruleParams.docId"
    }
  }
}
```

## Complete Examples

### Blog Platform

```typescript
// instant.perms.ts
{
  posts: {
    allow: {
      view: "data.isPublished || isAuthor",
      create: "auth.id != null && isAuthor",
      update: "isAuthor || isAdmin",
      delete: "isAuthor || isAdmin"
    },
    bind: [
      "isAuthor", "auth.id == data.authorId",
      "isAdmin", "auth.ref('$user.role')[0] == 'admin'"
    ]
  },
  comments: {
    allow: {
      view: "true",
      create: "isCommentAuthor",
      update: "isCommentAuthor",
      delete: "isCommentAuthor || isPostAuthor || isAdmin"
    },
    bind: [
      "isLoggedIn", "auth.id != null",
      "isPostAuthor", "isLoggedIn && auth.id == data.ref('post.authorId')[0]",
      "isCommentAuthor", "isLoggedIn && auth.id == data.authorId",
      "isAdmin", "auth.ref('$user.role')[0] == 'admin'"
    ]
  }
}
```

### Todo App

```typescript
// instant.perms.ts
{
  todos: {
    allow: {
      view: "isOwner || isShared",
      create: "isOwner",
      update: "isOwner || (isShared && data.ownerId == newData.ownerId)",
      delete: "isOwner"
    },
    bind: [
      "isLoggedIn", "auth.id != null",
      "isOwner", "isLoggedIn && auth.id == data.ownerId",
      "isShared", "isLoggedIn && auth.id in data.ref('sharedWith.id')"
    ]
  },
  lists: {
    allow: {
      $default: "isOwner",
      view: "isOwner || isCollaborator"
    },
    bind: [
      "isLoggedIn", "auth.id != null",
      "isOwner", "isLoggedIn && auth.id == data.ownerId",
      "isCollaborator", "isLoggedIn && auth.id in data.ref('collaborators.id')"
    ]
  }
}
```

## Common Mistakes

- Not using `data.ref` for linked data
- Missing attribute in `data.ref('owner')` → `data.ref('owner.id')`
- Using `==` with lists instead of `in` operator
- Missing `$user` prefix with `auth.ref`
- Checking `data.ref` against `null` instead of `[]`
- Using `newData.ref` (doesn't exist)
- Non-literal strings in ref: `data.ref(var + '.id')` → `data.ref('team.id')`

# How to get the current user

You can get the current user by using the `useAuth` hook.

```typescript
const { isLoading, user, error } = db.useAuth();

if (isLoading) return <div>Loading...</div>;
if (error) return <div>Error: {error.message}</div>;
if (user) return <AuthenticatedApp user={user} />;
return <UnauthenticatedApp />;
```

# How to implenent authentication

Instant supports magic code authentication. There is no built-in username/password authentication.

## Core concepts

1. User enters email
2. InstantDB sends verification code
3. User enters code
4. Authentication complete

## Complete Example

This uses Nativewind. If your project doesn't use Nativewind, you'll have to write the classes manually.

```typescript
// instant.schema.ts
import { i } from "@instantdb/react-native";

const _schema = i.schema({
  entities: {
    $users: i.entity({
      email: i.string().unique().indexed(),
    }),
  },
});

type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;

// lib/db.ts
import { init } from "@instantdb/react-native";
import schema from "./instant.schema";

export const db = init({
  appId: "your-app-id",
  schema,
});

// src/app/_layout.tsx
import { View, Text } from "react-native";
import { db } from "../lib/db";

export default function Layout() {
  const { isLoading, error, user } = db.useAuth();

  if (isLoading) return null;
  if (error) return <Text>{error.message}</Text>;
  if (!user) return <SignIn />;

  return (
    <View>
      <Text>Your logged in app</Text>
    </View>
  );
}

// src/components/SignIn.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../lib/db";

export default function SignIn() {
  const [sentEmail, setSentEmail] = useState("");

  return (
    <SafeAreaView className="flex-1">
      <TouchableWithoutFeedback accessible={false} onPress={Keyboard.dismiss}>
        <View className="flex-1">
          <KeyboardAvoidingView className="p-4" behavior={Platform.OS === "ios" ? "padding" : undefined}>
            {!sentEmail ? <EmailStep onSendEmail={setSentEmail} /> : <CodeStep sentEmail={sentEmail} />}
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

function EmailStep({ onSendEmail }: { onSendEmail: (email: string) => void }) {
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    if (!email.trim()) return;

    onSendEmail(email.trim());

    db.auth.sendMagicCode({ email: email.trim() }).catch((err) => {
      Alert.alert("Uh oh: " + err.body?.message);
      onSendEmail("");
    });
  };

  return (
    <View>
      <Text className="text-4xl font-bold mb-4">👋</Text>
      <Text className="text-2xl font-bold mb-4">Let’s log you in</Text>
      <Text className="text-gray-700 mb-4">
        Enter your email and we’ll send you a verification code (we’ll create an account if you don’t have one).
      </Text>
      <TextInput
        autoFocus
        value={email}
        onChangeText={setEmail}
        textContentType="emailAddress"
        keyboardType="email-address"
        autoComplete="email"
        autoCapitalize="none"
        placeholder="you@example.com"
        className="border border-gray-300 rounded-md px-3 py-2 mb-4"
      />
      <TouchableOpacity onPress={handleSubmit} className="px-4 py-2 rounded-md bg-blue-600 flex-row justify-center">
        <Text className="text-white font-bold">Send code</Text>
      </TouchableOpacity>
    </View>
  );
}

/* --- Step 2: verify code --- */
function CodeStep({ sentEmail }: { sentEmail: string }) {
  const [code, setCode] = useState("");

  const handleVerify = () => {
    if (!code.trim()) return;

    db.auth.signInWithMagicCode({ email: sentEmail, code: code.trim() }).catch((err) => {
      alert("Uh oh: " + err.body?.message);
      setCode("");
    });
  };

  return (
    <View className="space-y-4">
      <Text className="text-4xl font-bold mb-4">✉️</Text>
      <Text className="text-2xl font-bold mb-4">Enter your code</Text>
      <Text className="text-gray-700 mb-4">
        We emailed&nbsp;
        <Text className="font-semibold">{sentEmail}</Text>. Paste the six-digit code here.
      </Text>
      <TextInput
        autoFocus
        value={code}
        onChangeText={setCode}
        placeholder="123456"
        keyboardType="number-pad"
        maxLength={6}
        className="border border-gray-300 rounded-md px-3 py-2 mb-4"
      />

      <TouchableOpacity onPress={handleVerify} className="px-4 py-2 rounded-md bg-blue-600 flex-row justify-center">
        <Text className="text-white font-bold">Verify code</Text>
      </TouchableOpacity>
    </View>
  );
}
```

### Best Practices

1. **Clear Error Handling** - Helpful error messages
2. **Loading States** - Show indicators during async ops
3. **Resend Functionality** - Allow new code requests
