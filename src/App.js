
import React from "react";
import { useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css';
import "./App.css";
import { Container, Nav, NavDropdown, Navbar } from "react-bootstrap";
import Login from "./pages/login";

// Put any other imports below so that CSS from your
// components takes precedence over default styles.
function App() {
  const [isCollapsed, setIsCollapsed] = useState(true);

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
        <Container>
          <Navbar.Brand href="#home">X</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#home">Home</Nav.Link>
              <Nav.Link href="#link">Profile</Nav.Link>
              <Nav.Link href="/login">Login</Nav.Link>

              <NavDropdown title="User" id="basic-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">Log Out</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<App />} />

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
