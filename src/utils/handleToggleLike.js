import axios from "axios";

export async function handleToggleLike(
  postId,
  posts,
  setAllPosts,
  userData,
  setUserData
) {
  try {
    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        const isCurrentlyLiked = userData.likedPosts.some(
          (likedPost) => likedPost.postId == postId
        );
        const noveLikes = isCurrentlyLiked ? post.likes - 1 : post.likes + 1;
        var updatedLikedPosts;
        if (isCurrentlyLiked) {
          var updatedLikedPosts = userData.likedPosts.filter(
            (likedPost) => likedPost.postId != postId
          );
        } else {
          updatedLikedPosts = [...userData.likedPosts, { postId: postId }];
        }
        setUserData({ ...userData, likedPosts: updatedLikedPosts });
        return { ...post, likes: noveLikes };
      }
      return post;
    });
    setAllPosts(updatedPosts);

    const res = await axios.post(
      "http://localhost:5000/api/togglelike",
      { postId: postId },
      { withCredentials: true }
    );
    console.log("like toggled:", res.data);
  } catch (error) {
    console.error("there was eror togling like", error);
  }
}
