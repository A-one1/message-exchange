import React, { useEffect, useState } from "react";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import "firebase/firestore";
import "firebase/storage"; // <----
import "../App.css";

function CreatePost({ isAuth, email }) {
  let postid = "";
  let utcDateTime = "";
  const navigate = useNavigate();

  const [topicZ, setTopicZ] = useState("");
  const [title, setTitle] = useState("");
  const [postText, setPostText] = useState("");

  const [error, setError] = useState({});
  const postCollectionRef = collection(db, process.env.REACT_APP_ADMIN_DATABSE);
  const usersCollectionRef = collection(db, "Users");

  const createPost = async () => {
    const topic = topicZ.toUpperCase();
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

    const querySnapshot = await getDocs(
      query(usersCollectionRef, where("email", "==", email))
    );
    if (querySnapshot.size > 0) {
      const docRef = doc(usersCollectionRef, querySnapshot.docs[0].id);
      await updateDoc(docRef, {
        selectedTopics: arrayUnion(topic),
      });
    }

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
              value={topicZ}
              onChange={(e) => setTopicZ(e.target.value)}
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
