import React from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";

function SignUp() {
  const navigate = useNavigate();
  const [name, setName] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const usersCollectionRef = collection(db, "Users");

  const signUp = (e) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const email = auth.currentUser.email;
        const id = auth.currentUser.uid;
        const date = serverTimestamp();
        await addDoc(usersCollectionRef, {
          id,
          date,
          name,
          email,
        });
       
      })
      
      .catch((error) => {
        console.log(error);
        toast.error(error.code, {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 3000,
          theme: "colored",
          hideProgressBar: true,
          closeOnClick: true,
        });
      });
      navigate("/login");
  };
  const onSubmit = (e) => {
    e.preventDefault();
    console.log("SUBMITTED");
    signUp();
  };

  return (
    <div>
      <section className="signup">
        <ToastContainer />
        <div className="container">
          <div className="signup-content">
            <div className="signup-form">
              <h2 className="form-title">Sign up</h2>
              <form
                onSubmit={onSubmit}
                className="register-form"
                id="register-form"
              >
                <div className="form-group">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">
                    <i className="zmdi zmdi-email"></i>
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="pass">
                    <i className="zmdi zmdi-lock"></i>
                  </label>
                  <input
                    type="password"
                    name="pass"
                    id="pass"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="re-pass">
                    <i className="zmdi zmdi-lock-outline"></i>
                  </label>
                  <input
                    type="password"
                    name="re_pass"
                    id="re_pass"
                    placeholder="Repeat your password"
                    autoComplete="new-password"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="checkbox"
                    name="agree-term"
                    id="agree-term"
                    className="agree-term"
                  />
                </div>
                <div className="form-group form-button">
                  <input
                    style={{
                      position: "fixed",
                    }}
                    type="submit"
                    name="signup"
                    id="signup"
                    className="form-submit"
                    value="Register"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default SignUp;
