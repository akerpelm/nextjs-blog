import React, { useCallback, useReducer, useState } from 'react';

const PostsContext = React.createContext({});

export default PostsContext;

function postsReducer(state, action) {
  switch (action.type) {
    case 'ADD_POSTS': {
      const newPosts = [...state];
      action.posts.forEach((post) => {
        const exists = newPosts.find((p) => p._id === post._id);
        if (!exists) {
          newPosts.push(post);
        }
      });
      return newPosts;
    }
    case 'DELETE_POST': {
      const newPosts = [];
      state.forEach((post) => {
        if (post._id !== action.postId) {
          newPosts.push(post);
        }
      });
      return newPosts;
    }
    default:
      return state;
  }
}

export const PostsProvider = ({ children }) => {
  const [posts, dispatch] = useReducer(postsReducer, []);
  const [lastPost, setLastPost] = useState(false);

  const deletePost = useCallback((postId) => {
    dispatch({
      type: 'DELETE_POST',
      postId
    });
  }, []);

  const setPostsFromSSR = useCallback((postsFromSSR = []) => {
    dispatch({
      type: 'ADD_POSTS',
      posts: postsFromSSR
    });
  }, []);

  const getPosts = useCallback(
    async ({ lastPostDate, getNewerPosts = false }) => {
      const response = await fetch(`/api/getPosts`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({ lastPostDate, getNewerPosts })
      });

      const json = await response.json();
      const postsResult = json.posts || [];

      if (postsResult.length < 5) {
        setLastPost(true);
      }
      dispatch({
        type: 'ADD_POSTS',
        posts: postsResult
      });
    },
    []
  );

  return (
    <PostsContext.Provider
      value={{ posts, setPostsFromSSR, getPosts, lastPost, deletePost }}
    >
      {children}
    </PostsContext.Provider>
  );
};
