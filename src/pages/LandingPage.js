import React, { useEffect, useState } from "react";
import { getDocs, collection, orderBy, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-bootstrap";
import CreatePost from "./CreatePost";

function LandingPage({ isAuth, userEmail }) {
  const navigate = useNavigate();
  const [postLists, setPostLists] = useState([]);
  const [loading, isLoading] = useState(true);
  const [selectedTopics, setSelectedTopics] = useState([]);
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

  const getPosts = async () => {
    const q = query(postsCollectionRef, orderBy("date", "desc"));
    const data = await getDocs(q);
    setPostLists(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    isLoading(false);
  };

  useEffect(() => {
    getPosts();
  }, [email, selectedTopics]);

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
  const postsByTopic = postLists
    .filter((post) => selectedTopics.includes(post.topic)) // Filter posts by selectedTopics
    .reduce((groups, post) => {
      const topic = post.topic;
      if (!groups[topic]) {
        groups[topic] = [];
      }
      groups[topic].push(post);
      return groups;
    }, {});

  const filteredPosts = Object.values(postsByTopic).flatMap((posts) =>
    posts.slice(0, 2)
  );

  return (
    <div className="homePage">
      <ToastContainer />
      <CreatePost isAuth={isAuth} email={email} />

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
