import React, { useEffect, useState } from "react";
import {
  getDocs,
  collection,
  deleteDoc,
  doc,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-bootstrap";
import CreatePost from "./CreatePost";

function LandingPage({ isAuth, userEmail }) {
  const navigate = useNavigate();
  const [postLists, setPostLists] = useState([]);
  const [loading, isLoading] = useState(true);
  const [selectedTopics, setSelectedTopics] = useState([]);
  console.log("🚀 ~ LandingPage ~ selectedTopics:", selectedTopics);
  const email = userEmail;

  const postsCollectionRef = collection(
    db,
    process.env.REACT_APP_ADMIN_DATABSE
  );
  const usersCollectionRef = collection(db, "Users");

  const getUserSelectedTopics = async () => {
    const querySnapshot = await getDocs(
      query(usersCollectionRef, where("email", "==", email))
    );
    if (querySnapshot.size > 0) {
      setSelectedTopics(querySnapshot.docs[0].data().selectedTopics || []);
    }
  };
  async function deletePost(id) {
    const postDoc = doc(db, process.env.REACT_APP_ADMIN_DATABSE, id);
    await deleteDoc(postDoc);
    getPosts();
  }

  const getPosts = async () => {
    const q = query(postsCollectionRef, orderBy("date", "desc"));
    const data = await getDocs(q);
    setPostLists(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    isLoading(false);
  };

  const filteredPosts = postLists.filter((post) =>
    selectedTopics.includes(post.topic)
  );

  // useEffect hook for fetching posts
  useEffect(() => {
    getPosts();
  }, [email]); // depends on email

  // useEffect hook for user authentication and getting user-selected topics
  useEffect(() => {
    if (!isAuth) {
      navigate("/login");
    } else {
      getUserSelectedTopics();
    }
  }, [isAuth, email]); // depends on isAuth and email

  if (loading) {
    return <div> </div>;
  }

  return (
    <div className="homePage">
      <ToastContainer />
      <CreatePost isAuth={isAuth} />

      {filteredPosts.map((post, key) => {
        return (
          <div className="post" key={key}>
            <div className="postWrapper">
              <div className="postTop">
                <div className="postTopLeft">{post.topic}</div>
              </div>
              <div className="postHeader">
                <div className="title">
                  <h3>
                    <strong> {post.title}</strong>
                  </h3>
                </div>
              </div>
            </div>
            <div className="postTextContainer">{post.postText}</div>
          </div>
        );
      })}
    </div>
  );
}

export default LandingPage;
