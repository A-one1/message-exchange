import React, { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { useLocation, useNavigate } from "react-router-dom";
import "firebase/firestore";
import "firebase/storage"; // <----
import "../App.css";
import { toast } from "react-toastify";
import { DateTime } from "luxon";

function CreatePost(props) {
  let isEditing = false;
  let postid = "";
  let utcDateTime = "";
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuth } = props;
  const [title, setTitle] = useState("");
  const [postText, setPostText] = useState("");

  const [error, setError] = useState({});
  const [edate, setDate] = useState("");
  const [time, setTime] = useState("");
  const postCollectionRef = collection(db, process.env.REACT_APP_ADMIN_DATABSE);
  const combinedDateTime = `${edate}T${time}`;

  if (location && location.state && location.state.currentState) {
    isEditing = true;
    postid = location.state.id;
  }

  useEffect(() => {
    if (isEditing) {
      const getPosts = async () => {
        const postDoc = doc(db, process.env.REACT_APP_ADMIN_DATABSE, postid);
        const postData = await getDoc(postDoc);
        setTitle(postData.data().title);
        setPostText(postData.data().postText);
        if (postData.data().expiryDate) {
          setDate(
            DateTime.fromJSDate(new Date(postData.data().expiryDate)).toFormat(
              "yyyy-MM-dd"
            )
          );
          setTime(
            DateTime.fromJSDate(new Date(postData.data().expiryDate)).toFormat(
              "T"
            )
          );
        }
      };

      getPosts();
    }
  }, [isEditing, postid]);

  const createPost = async () => {
    if ((edate && !time) || (!edate && time)) {
      setError({ date: "Please fill both Date and Time or leave them empty." });
      return;
    }

    if (Object.keys(error).length === 0) {
      await addDoc(postCollectionRef, {
        title,
        postText,
        author: {
          name: auth.currentUser.displayName,
          id: auth.currentUser.uid,
        },
        date: serverTimestamp(),
        expiryDate: utcDateTime,
      });
      toast.success("Successfully Posted!", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      navigate("/posts");
    }
  };
  const savePost = async () => {
    const postRef = doc(postCollectionRef, postid);

    if ((edate && !time) || (!edate && time)) {
      setError({ date: "Please fill both Date and Time or leave them empty." });
      return;
    }
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
      toast.success("Successfully Edited!", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      navigate("/posts");
    }
  };

  const changeDate = (e) => {
    let error = {};
    setDate(e.target.value);
    if (time === "") {
      error.date = "Please fill both Date and Time or leave them empty.";
    }
    setError(error);
  };

  const changeTime = (e) => {
    let error = {};
    setTime(e.target.value);
    if (edate === "") {
      error.date = "Please fill both Date and Time or leave them empty.";
    }
    setError(error);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (combinedDateTime.length > 5) {
      utcDateTime = new Date(combinedDateTime).toUTCString();
    } else {
      utcDateTime = "";
    }
    if (isEditing) {
      savePost();
    } else {
      createPost();
    }
  };

  useEffect(() => {
    if (!isAuth) {
      navigate("/login");
    }
  }, [isAuth, navigate]);

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="post-container">
          <div className="post-box">
            <h1 className="post-title">
              {isEditing ? "Edit Post" : "Create A Post"}
            </h1>
            <div className="form-group">
              {/* <label className="form-label">Title:</label> */}
              <input
                className="form-input"
                placeholder="Title..."
                value={title}
                autoComplete="title"
                required
                onChange={(event) => {
                  setTitle(event.target.value);
                }}
              />
            </div>
            <div className="form-group">
              {/* <label className="form-label">Post:</label> */}
              <textarea
                className="form-textarea"
                required
                style={{ width: "", height: "124px" }}
                placeholder="Description... "
                value={postText}
                onChange={(event) => {
                  setPostText(event.target.value);
                }}
              />
            </div>

            <div className="form-group">
              <span className="date-label">Expiry Date:</span>
              &nbsp;&nbsp;
              <input
                type="date"
                className="input-date"
                name="date"
                id="date"
                placeholder=""
                value={edate}
                onChange={changeDate}
              ></input>
              <span className="time-label">Expiry Time:</span>
              &nbsp;&nbsp;
              <input
                type="time"
                className="input-time"
                name="time"
                id="time"
                placeholder=""
                value={time}
                onChange={changeTime}
              ></input>
            </div>

            {error && <p style={{ color: "red" }}>{error.date}</p>}

            <br />
            <br />
            <button className="btn btn-primary" type="submit">
              {isEditing ? "Save" : "Post"}
            </button>
          </div>
        </div>
      </form>
    </>
  );
}

export default CreatePost;
