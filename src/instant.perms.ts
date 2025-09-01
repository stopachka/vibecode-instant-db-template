// Docs: https://www.instantdb.com/docs/permissions

import type { InstantRules } from "@instantdb/react-native";

const rules = {
  $default: {
    allow: {
      $default: "true",
    },
  },
  $users: {
    allow: {
      view: "true",
    },
  },
  $files: {
    allow: {
      view: "true",
      create: "true",
      delete: "true",
    },
  },
} satisfies InstantRules;

export default rules;
