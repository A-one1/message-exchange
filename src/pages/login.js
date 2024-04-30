import React, { useState } from "react";
import { auth, db, provider } from "../firebase";
import { useNavigate } from "react-router-dom";
import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { toast } from "react-toastify";
import "../App.css";

function Login({ setIsAuth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedTopics, setSelectedTopics] = useState([]);

  const navigate = useNavigate();
  const usersCollectionRef = collection(db, "Users");

  const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then(async (userCredential) => {
        setIsAuth(true);
        localStorage.setItem("isAuth", true);

        const name = auth.currentUser.displayName;
        const email = auth.currentUser.email;
        const id = auth.currentUser.uid;
        const date = serverTimestamp();
        const uid = auth.currentUser.uid;
        localStorage.setItem("uid", uid);

        const querySnapshot = await getDocs(
          query(usersCollectionRef, where("email", "==", email))
        );
        if (querySnapshot.size > 0) {
          const docRef = doc(usersCollectionRef, querySnapshot.docs[0].id);
          await updateDoc(docRef, {
            id,
            date,
            name,
            email,
          });
        } else {
          await addDoc(usersCollectionRef, {
            id,
            date,
            name,
            email,
            isAdmin: false,
            isApproved: false,
            selectedTopics,
          });
        }

        navigate("/landingPage");
        console.log("LLOGGED IN");
        toast.info("Successfully Logged In!!!", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: false,
          theme: "colored",
        });
      })
      .catch((error) => {
        toast.error(error.code);
        console.log("asdasdsa", error);
      });
  };

  const signIn = (e) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        console.log(userCredential);
        setIsAuth(true);
        localStorage.setItem("isAuth", true);
        localStorage.setItem("uid", userCredential.user.uid);
        navigate("/landingPage");

        const date = serverTimestamp();

        const querySnapshot = await getDocs(
          query(usersCollectionRef, where("email", "==", email))
        );
        if (querySnapshot.size > 0) {
          const docRef = doc(usersCollectionRef, querySnapshot.docs[0].id);
          await updateDoc(docRef, {
            date,
          });
        }
      })
      .catch((error) => {
        toast.error(error.code.replace("auth/", ""));
      });
  };

  const resetPass = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        toast.info("Password reset email sent.", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 3000,
          theme: "colored",
        });
      })
      .catch((error) => {
        console.log(error);
        if (error.code === "auth/missing-email") {
          const emailInput = document.getElementById("email");
          if (emailInput) {
            emailInput.focus();
            toast.error("Please input your email.", {
              position: toast.POSITION.TOP_CENTER,
              theme: "colored",
            });
            return;
          }
        }
      });
  };

  return (
    <div className="loginPage">
      <section className="signup">
        <div className="container">
          <div className="signin-content">
            <div className="signin-form">
              <h2 className="form-title">Login</h2>
              <form className="register-form" id="login-form">
                <div className="form-group">
                  <label htmlFor="your_name">
                    <i className="zmdi zmdi-account material-icons-name"></i>
                  </label>
                  <input
                    type="text"
                    name="email"
                    id="email"
                    placeholder="Your Email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="your_pass">
                    <i className="zmdi zmdi-lock"></i>
                  </label>
                  <input
                    type="password"
                    name="your_pass"
                    id="your_pass"
                    placeholder="Password"
                    autoComplete="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <label
                  htmlFor="remember-me"
                  className="forget-pass"
                  onClick={resetPass}
                >
                  Forget Password?
                </label>
                <div className="social-login">
                  <input
                    style={{
                      height: "50px",
                      fontWeight: "bold",
                      fontSize: "15px",
                      marginLeft: "65px",
                    }}
                    type="submit"
                    name="signin"
                    id="signin"
                    className="form-submit"
                    value="Log in"
                    onClick={signIn}
                  />
                </div>
              </form>

              <button
                className="login-with-google-btn"
                type="submit"
                onClick={signInWithGoogle}
              >
                Login with Google
              </button>
              <br />
              <br />
              <hr />

              <div className="social-login">
                <a
                  href="/signup"
                  style={{ textDecoration: "none", marginTop: "-5px" }}
                >
                  <input
                    style={{
                      color: "white",
                      fontSize: "15px",
                      backgroundColor: "#42b72a",
                      border: "1px solid transparent",
                      padding: "10px 15px",
                      fontWeight: "bold",
                      width: "90%",
                    }}
                    type="submit"
                    readOnly
                    className="form-submit"
                    value="Create a new account"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <hr />
      <hr />
    </div>
  );
}

export default Login;
