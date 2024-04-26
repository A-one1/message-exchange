import React, { useEffect, useState } from "react";
import {
  getDocs,
  collection,
  deleteDoc,
  doc,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-bootstrap";
import CreatePost from "./CreatePost";
import TopicSelector from "../component/topicSelector";

function LandingPage({ isAuth }) {
  const navigate = useNavigate();
  const [postLists, setPostLists] = useState([]);
  const [loading, isLoading] = useState(true);
  const postsCollectionRef = collection(
    db,
    process.env.REACT_APP_ADMIN_DATABSE
  );

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

  useEffect(() => {
    getPosts();
    if (!isAuth) {
      console.log("🚀 ~ useEffect ~ isAuth:", isAuth);
      navigate("/login");
    } else {
      getPosts();
    }
  }, [setPostLists]);
  if (loading) {
    return <div> </div>;
  }

  return (
    <div className="homePage">
      <ToastContainer />
      <CreatePost isAuth={isAuth} />
      <TopicSelector />

      {postLists.map((post, key) => {
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
