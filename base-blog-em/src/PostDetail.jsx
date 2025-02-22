import { useMutation, useQuery } from "react-query";

async function fetchComments(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/comments?postId=${postId}`
  );
  return response.json();
}

async function deletePost(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/postId/${postId}`,
    { method: "DELETE" }
  );
  return response.json();
}

async function updatePost(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/postId/${postId}`,
    { method: "PATCH", data: { title: "REACT QUERY FOREVER!!!!" } }
  );
  return response.json();
}

export function PostDetail({ post }) {
  const { data, isError, error, isLoading } = useQuery(
    ['comments', post.id],
    () => fetchComments(post.id)
  );

  const { 
    mutate: deleteMutation, 
    isError: deleteMutationError, 
    isLoading: deleteMutationLoading,
    isSuccess: deleteMutationSuccess,
  } = useMutation(
    (postId) => deletePost(postId),
    {
      onSuccess: () => {
        return null;
      }
    }
  );

  const {
    mutate: updateMutation,
    isError: updateMutationError,
    isLoading: updateMutationLoading,
    isSuccess: updateMutationSuccess,
  } = useMutation((postId) => updatePost(postId));

  if (isLoading) {
    return <h3>Loading...</h3>;
  }

  if (isError) {
    return (
     <>
      <h3>Oops, sth went wrong</h3>
      <p>{error.toString()}</p>
     </>
    );
  }

  return (
    <>
      <h3 style={{ color: "blue" }}>{post.title}</h3>
      <button onClick={() => deleteMutation(post.id)}>Delete</button> 
      { deleteMutationError && 
        <p style={{ color: "red" }}>Error deleting the post</p>
      }
      { deleteMutationLoading && 
        <p style={{ color: "purple" }}>Deleting the post</p>
      }
      { deleteMutationSuccess && 
        <p style={{ color: "green" }}>Post has (not) been deleted</p>
      }
      <button onClick={() => updateMutation(post.id)}>Update title</button>
      { updateMutationError && 
        <p style={{ color: "red" }}>Error updating the post</p>
      }
      { updateMutationLoading && 
        <p style={{ color: "purple" }}>Updating the post</p>
      }
      { updateMutationSuccess && 
        <p style={{ color: "green" }}>Post has (not) been updated</p>
      }
      <p>{post.body}</p>
      <h4>Comments</h4>
      {data.map((comment) => (
        <li key={comment.id}>
          {comment.email}: {comment.body}
        </li>
      ))}
    </>
  );
}
