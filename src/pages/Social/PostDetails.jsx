import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import { useParams } from "react-router-dom";
import Avatar from "@mui/joy/Avatar";
import { Link } from "react-router-dom";
import ProfileBox from "../../components/ProfileBox";
import { handleToggleLikeForSinglePost } from "../../utils/handleToggleLikeFor1Post";

export default function PostDetails() {
  const { postId } = useParams();
  const [userData, setUserData] = useState(null);
  const [post, setPost] = useState(null);
  const [notificationCount, setNotificationCount] = useState(0);

  async function fetchLoggedInData() {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/getloggedinuser",
        {
          withCredentials: true,
        }
      );
      setUserData(response.data.UserData);
      setNotificationCount(response.data.UserData.receivedNotifications.length);
    } catch (error) {
      console.error("Error fetching logged in user data:", error);
    }
  }

  async function fetchSinglePostData() {
    const res = await axios.post("http://localhost:5000/api/getsinglepost", {
      postId: postId,
    });
    setPost(res.data.post); // Assuming the API returns an object under "post"
  }

  useEffect(() => {
    fetchLoggedInData();
    fetchSinglePostData();
  }, [postId]); // Add postId as a dependency to refetch if it changes

  console.log(postId);
  return (
    <div className="flex bg-backgroundcolor w-full">
      <Navbar
        currentSite="dashboard"
        username={userData?.username}
        notificationCount={notificationCount}
      />
      <main className="grow bg-backgroundcolor">
        <nav className="w-full h-20 flex justify-between items-center bg-backgroundcolor border-b border-gray-700">
          <h1 className="text-3xl text-text font-bold ml-5">Post</h1>
          <ProfileBox
            nickname={userData?.nickname}
            username={userData?.username}
            profilepic={userData?.profilepicture}
          />
        </nav>
        {post && (
          <div className="w-full flex items-center justify-center gap-10 mt-10">
            <div className="w-l p-3">
              <div className="flex flex-row text-white text-xl">
                <Avatar
                  src={post.createdBy.profilepicture}
                  style={{ width: "50px", height: "48px", marginTop: "2px" }}
                />
                <div className="ml-2">
                  <Link
                    to={`/${post.createdBy?.username}`}
                    className="font-bold hover:border-b"
                  >
                    {post.createdBy.nickname}
                  </Link>
                  <span className="opacity-30">
                    @{post.createdBy?.username}
                  </span>
                </div>
              </div>
              <div className="text-xl text-white p-3">
                <p>{post.content}</p>
                {post.image && (
                  <img
                    src={`https://ik.imagekit.io/bubenik/PostImages/${post.image}`}
                    alt="Post"
                    className="object-fill rounded-2xl border border-gray-900 shadow-xl"
                    style={{ height: "500px", width: "550px" }}
                  />
                )}
                {post.likes > 0 ? (
                  userData?.likedPosts?.some(
                    (likedPost) => likedPost.postId == post.id
                  ) ? (
                    <div className="flex flex-row justify-center items-center hover:text-pink-500 group no-redirect">
                      <div className="flex justify-center items-center rounded-full p-2 hover:shadow-2xl text-pink-500 group-hover:bg-pink-500 group-hover:bg-opacity-25 no-redirect">
                        <span
                          className="material-icons cursor-pointer no-redirect"
                          onClick={() =>
                            handleToggleLikeForSinglePost(
                              post.id,
                              post,
                              setPost,
                              userData,
                              setUserData
                            )
                          }
                        >
                          favorite
                        </span>
                      </div>
                      <p className="mb-0.5 cursor-pointer text-pink-500 group-hover:text-pink-500 no-redirect">
                        {post.likes}
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-row justify-center items-center hover:text-pink-500 group no-redirect">
                      <div className="flex justify-center items-center rounded-full p-2 hover:shadow-2xl group-hover:bg-pink-500 group-hover:bg-opacity-25 no-redirect">
                        <span
                          className="material-symbols-outlined cursor-pointer no-redirect"
                          onClick={() =>
                            handleToggleLikeForSinglePost(
                              post.id,
                              post,
                              setPost,
                              userData,
                              setUserData
                            )
                          }
                        >
                          favorite_border
                        </span>
                      </div>
                      <p className="mb-0.5 cursor-pointer group-hover:text-pink-500 no-redirect">
                        {post.likes}
                      </p>
                    </div>
                  )
                ) : (
                  <div className="flex justify-center items-center rounded-full p-2 hover:shadow-2xl group-hover:bg-pink-500 group-hover:bg-opacity-25 no-redirect">
                    <span
                      className="material-symbols-outlined cursor-pointer no-redirect"
                      onClick={() =>
                        handleToggleLikeForSinglePost(
                          post.id,
                          post,
                          setPost,
                          userData,
                          setUserData
                        )
                      }
                    >
                      favorite_border
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
