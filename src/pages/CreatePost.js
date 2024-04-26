import React, { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import "firebase/firestore";
import "firebase/storage"; // <----
import "../App.css";

function CreatePost(props) {
  let postid = "";
  let utcDateTime = "";
  const navigate = useNavigate();
  const { isAuth } = props;

  const [topic, setTopic] = useState("");
  const [title, setTitle] = useState("");
  const [postText, setPostText] = useState("");

  const [error, setError] = useState({});
  const postCollectionRef = collection(db, process.env.REACT_APP_ADMIN_DATABSE);

  const createPost = async () => {
    await addDoc(postCollectionRef, {
      topic,
      title,
      postText,
      author: {
        name: auth.currentUser.displayName,
        id: auth.currentUser.uid,
      },
      date: serverTimestamp(),
    });

    navigate("/landingPage");
  };
  const savePost = async () => {
    const postRef = doc(postCollectionRef, postid);
    if (Object.keys(error).length === 0) {
      await updateDoc(postRef, {
        title,
        postText,
        author: {
          name: auth.currentUser.displayName,
          id: auth.currentUser.uid,
        },
        date: serverTimestamp(),
        expiryDate: utcDateTime,
      });

      navigate("/landingPage");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    createPost();
  };

  useEffect(() => {
    if (!isAuth) {
      navigate("/login");
    }
  }, [isAuth, navigate]);

  return (
    <>
      <div className="post-form">
        <form onSubmit={handleSubmit}>
          <label>
            Topic:
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              required
              className="form-input"
            />
          </label>
          <label>
            Title:
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="form-input"
            />
          </label>
          <label>
            Description:
            <textarea
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              rows={4}
              required
              className="form-textarea"
            />
          </label>
          <button type="submit" className="form-button">
            Post
          </button>
        </form>
      </div>
    </>
  );
}

export default CreatePost;
