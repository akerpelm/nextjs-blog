import React, { useCallback, useState } from 'react';

const PostsContext = React.createContext({});

export default PostsContext;

export const PostsProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [lastPost, setLastPost] = useState(false);

  const setPostsFromSSR = useCallback((postsFromSSR = []) => {
    setPosts((value) => {
      const newPosts = [...value];
      postsFromSSR.forEach((post) => {
        const exists = newPosts.find((p) => p._id === post._id);
        if (!exists) {
          newPosts.push(post);
        }
      });
      return newPosts;
    });
  }, []);

  const getPosts = useCallback(async ({ lastPostDate }) => {
    const response = await fetch(`/api/getPosts`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(lastPostDate)
    });

    const json = await response.json();
    const postsResult = json.posts || [];
    if (postsResult.length < 5) {
      setLastPost(true);
    }
    setPosts((value) => {
      const newPosts = [...value];
      postsResult.forEach((post) => {
        const exists = newPosts.find((p) => p._id === post._id);
        if (!exists) {
          newPosts.push(post);
        }
      });
      return newPosts;
    });
  }, []);

  return (
    <PostsContext.Provider
      value={{ posts, setPostsFromSSR, getPosts, lastPost }}
    >
      {children}
    </PostsContext.Provider>
  );
};
