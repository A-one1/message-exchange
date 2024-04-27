import React, { useEffect } from "react";
import { useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import {
  Container,
  Nav,
  NavDropdown,
  Navbar,
  ToastContainer,
} from "react-bootstrap";
import Login from "./pages/login";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/home";
import { toast } from "react-toastify";
import LandingPage from "./pages/LandingPage";
import TopicSelector from "./component/topicSelector";

function App() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const navigate = useNavigate();
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [isAuth, setIsAuth] = useState(() => {
    const storedAuth = localStorage.getItem("isAuth");
    return storedAuth ? JSON.parse(storedAuth) : false;
  });
  const [userEmail, setUserEmail] = useState(
    auth.currentUser ? auth.currentUser.email : null
  );
  console.log("🚀 ~ const[isAuth,setIsAuth]=useState ~ isAuth:", isAuth);
  const notify = () => toast("Wow so easy!");

  

  const signUserOut = () => {
    signOut(auth).then(() => {
      localStorage.clear();
      setIsAuth(false);
      // window.location.pathname = "/";
      navigate("/");
      console.log("signed out");

      toast.info("Successfully Logged Out!!!", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: false,
        theme: "colored",
      });
    });
  };

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
      } else {
        setUserEmail(null);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        theme="colored"
        closeOnClick={true}
      />
      <Navbar
        bg="dark"
        data-bs-theme="dark"
        expand="sm"
        className="bg-body-tertiary"
      >
        <Container>
          <Navbar.Brand href="home">X</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="home">Home</Nav.Link>
              {isAuth && <Nav.Link href="/availableTopics"> Topics</Nav.Link>}

              {!isAuth && <Nav.Link href="/login">Login</Nav.Link>}

              {isAuth && (
                <NavDropdown title="User" id="basic-nav-dropdown">
                  <NavDropdown.Item onClick={signUserOut}>
                    Log Out
                  </NavDropdown.Item>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Routes>
        <Route path="/login" element={<Login setIsAuth={setIsAuth} />} />
        <Route path="/home" element={<Home />} />
        <Route
          path="/landingPage"
          element={
            <LandingPage
              isAuth={isAuth}
              setIsAuth={setIsAuth}
              selectedTopics={selectedTopics}
              userEmail={userEmail}

            />
          }
        />
        <Route
          path="/availableTopics"
          element={
            <TopicSelector
              userEmail={userEmail}
              selectedTopics={selectedTopics}
              setSelectedTopics={setSelectedTopics}
            />
          }
        />

        {/* <Route path="/login" element={<Login setIsAuth={setIsAuth} />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/" element={<Landing isAuth={isAuth} />} />
      <Route path="/posts" element={<Posts isAuth={isAuth} isAdmin={isAdmin} />}/>
      <Route path="/view" element={<ViewPost />} /> */}
      </Routes>
    </>
  );
}

export default App;
