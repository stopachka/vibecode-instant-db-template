import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Dimensions,
} from "react-native";
import ScaleButton from "../components/ScaleButton";
import Button from "../components/Button";
import TextInput from "../components/TextInput";
import Avatar from "../components/Avatar";
import Card from "../components/Card";
import Title from "../components/Title";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { id, InstaQLEntity } from "@instantdb/react-native";
import db from "../lib/db";
import schema from "../instant.schema";

// Instant utility types for query results
type PostsWithProfile = InstaQLEntity<
  typeof schema,
  "posts",
  { author: { avatar: {} } }
>;

// Database operations

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

// Ephemeral helpers
// ---------
function makeShout(text: string) {
  const { width, height } = Dimensions.get("window");
  return {
    id: Date.now().toString(),
    text,
    x: Math.random() * (width - 150), // Account for safe area
    y: Math.random() * (height - 300),
    angle: (Math.random() - 0.5) * 30,
    size: Math.random() * 20 + 18,
    opacity: new Animated.Value(1),
  };
}

// Instant query Hooks
// ---------

function usePosts(pageNumber: number, pageSize: number) {
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
  return { isLoading, error, posts: (data?.posts || []) as PostsWithProfile[] };
}

// Use the room for presence and topics
const room = db.room("todos", "main");

// App Components
// ---------
function Main() {
  const insets = useSafeAreaInsets();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const pageSize = 5;
  const { isLoading, error, posts } = usePosts(pageNumber, pageSize);
  const { peers } = db.rooms.usePresence(room);
  const numUsers = 1 + Object.keys(peers).length;

  if (isLoading)
    return <ActivityIndicator size="large" style={styles.loader} />;
  if (error) return <Text style={styles.error}>Error: {error.message}</Text>;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      <ScrollView style={styles.mainContainer}>
        <View style={styles.contentContainer}>
          <Title>Wall</Title>
          <PostForm />
          <PostList posts={posts} />

          <View style={styles.pagination}>
            <Button
              onPress={() => setPageNumber(pageNumber - 1)}
              disabled={pageNumber <= 1}
              variant="secondary"
              fullWidth
            >
              Previous
            </Button>
            <Button
              onPress={() => setPageNumber(pageNumber + 1)}
              disabled={posts.length < pageSize}
              variant="secondary"
              fullWidth
            >
              Next
            </Button>
          </View>

          <Text style={styles.onlineCount}>
            {numUsers} user{numUsers > 1 ? "s" : ""} online
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

function PostForm() {
  const user = db.useUser();
  const [shouts, setShouts] = useState<
    Array<{
      id: string;
      text: string;
      x: number;
      y: number;
      angle: number;
      size: number;
      opacity: Animated.Value;
    }>
  >([]);
  const [value, setValue] = useState("");
  const publishShout = db.rooms.usePublishTopic(room, "shout");

  const handleSubmit = (action: string) => {
    if (!value.trim()) return;
    if (action === "post") {
      addPost(value, user?.id);
    } else {
      const params = makeShout(value);
      addShout(params);
      publishShout(params);
    }
    setValue("");
  };

  const addShout = (shout: ReturnType<typeof makeShout>) => {
    setShouts((prev) => [...prev, shout]);

    Animated.timing(shout.opacity, {
      toValue: 0,
      duration: 2000,
      delay: 100,
      useNativeDriver: true,
    }).start(() => {
      setShouts((prev) => prev.filter((s) => s.id !== shout.id));
    });
  };

  return (
    <View style={styles.postFormContainer}>
      <TextInput
        placeholder="What's on your mind?"
        value={value}
        onChangeText={setValue}
        multiline
      />
      <View style={styles.buttonRow}>
        <Button
          onPress={() => handleSubmit("post")}
          variant="primary"
          fullWidth
        >
          Add to wall
        </Button>
        <Button
          onPress={() => handleSubmit("shout")}
          variant="secondary"
          fullWidth
        >
          Shout to void
        </Button>
      </View>
      <>
        {shouts.map((shout) => (
          <Animated.Text
            key={shout.id}
            style={{
              position: "absolute",
              left: shout.x,
              top: shout.y,
              fontSize: shout.size,
              fontWeight: "bold",
              opacity: shout.opacity,
              transform: [{ rotate: `${shout.angle}deg` }],
            }}
          >
            {shout.text}
          </Animated.Text>
        ))}
      </>
    </View>
  );
}

function PostList({ posts }: { posts: PostsWithProfile[] }) {
  const user = db.useUser();

  return (
    <View style={styles.postList}>
      {posts.map((post) => (
        <Card key={post.id}>
          <View style={styles.postHeader}>
            <Avatar
              url={post.author?.avatar?.url}
              name={post.author?.handle}
              size="small"
            />
            <View style={styles.postContent}>
              <View style={styles.postMeta}>
                <View>
                  <Text style={styles.postAuthor}>{post.author?.handle}</Text>
                  <Text style={styles.postDate}>
                    {new Date(post.createdAt).toLocaleString()}
                  </Text>
                </View>
                {post.author?.id === user?.id && (
                  <ScaleButton onPress={() => deletePost(post.id)}>
                    <Text style={styles.deletePost}>×</Text>
                  </ScaleButton>
                )}
              </View>
              <Text style={styles.postText}>{post.text}</Text>
            </View>
          </View>
        </Card>
      ))}
    </View>
  );
}

function App() {
  return <Main />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  error: {
    color: "red",
    padding: 16,
    textAlign: "center",
  },
  loginContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loginBox: {
    width: "100%",
    maxWidth: 400,
  },
  formContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  description: {
    color: "#666",
    marginBottom: 16,
  },
  bold: {
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 4,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#2563eb",
    padding: 12,
    borderRadius: 4,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  mainContainer: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  postFormContainer: {
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },
  postList: {
    gap: 12,
  },
  postHeader: {
    flexDirection: "row",
  },
  postContent: {
    flex: 1,
    marginLeft: 12,
  },
  postMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  postAuthor: {
    fontWeight: "500",
  },
  postDate: {
    fontSize: 12,
    color: "#666",
  },
  deletePost: {
    fontSize: 24,
    color: "#9ca3af",
    fontWeight: "bold",
  },
  postText: {
    marginTop: 8,
    color: "#374151",
    fontSize: 16,
    lineHeight: 22,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 12,
  },
  onlineCount: {
    textAlign: "center",
    fontSize: 12,
    color: "#666",
    marginTop: 16,
  },
});

export default App;
