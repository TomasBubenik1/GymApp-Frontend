import axios from "axios";

export async function handleToggleLikeForSinglePost(
  postId,
  post,
  setPost,
  userData,
  setUserData
) {
  try {
    const isCurrentlyLiked = userData.likedPosts.some(
      (likedPost) => likedPost.postId === postId
    );
    const noveLikes = isCurrentlyLiked ? post.likes - 1 : post.likes + 1;
    const updatedLikedPosts = isCurrentlyLiked
      ? userData.likedPosts.filter((likedPost) => likedPost.postId !== postId)
      : [...userData.likedPosts, { postId: postId }];

    setUserData({ ...userData, likedPosts: updatedLikedPosts });
    setPost({ ...post, likes: noveLikes });

    await axios.post(
      "http://localhost:5000/api/togglelike",
      { postId: postId },
      { withCredentials: true }
    );
  } catch (error) {
    console.error("There was error togling like", error);
  }
}
