import React from "react";
import { useState } from "react";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import { Container, Nav, NavDropdown, Navbar, ToastContainer } from "react-bootstrap";
import Login from "./pages/login";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/home";
import { toast } from "react-toastify";

// Put any other imports below so that CSS from your
// components takes precedence over default styles.
function App() {
  const [isCollapsed, setIsCollapsed] = useState(true);
const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState(() => {
    const storedAuth = localStorage.getItem("isAuth");
    return storedAuth ? JSON.parse(storedAuth) : false;
  });
  const notify = () => toast("Wow so easy!");


  const signUserOut = () => {
    signOut(auth).then(() => {
      localStorage.clear();
      setIsAuth(false);
      // window.location.pathname = "/";
      navigate("/")
      console.log("signoed out");
      
      toast.info(
        "Successfully Logged Out!!!",
        {
          position: toast.POSITION.TOP_CENTER,
          autoClose: false,
          theme: "colored",
        }
      );
      
    });
  };

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      <Navbar
        bg="dark"
        data-bs-theme="dark"
        expand="sm"
        className="bg-body-tertiary"
      >
        <ToastContainer
          position="top-center"
          autoClose={3000}
          theme="colored"
          hideProgressBar={true}
          closeOnClick={true}
        />
        <Container>
          <Navbar.Brand href="home">X</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="home">Home</Nav.Link>
              <Nav.Link href="#link">Profile</Nav.Link>
              <Nav.Link href="/login">Login</Nav.Link>

              <NavDropdown title="User" id="basic-nav-dropdown">
                <NavDropdown.Item onClick={signUserOut}>
                  Log Out
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Routes>
        <Route path="/login" element={<Login setIsAuth={setIsAuth} />} />
        <Route path="/home" element={<Home />} />

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
