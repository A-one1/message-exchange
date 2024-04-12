import { useState } from "react";
import React from "react";
import { Link, Route, Routes } from "react-router-dom";
import { Container, Nav, NavDropdown, Navbar } from "react-bootstrap";

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
              <Nav.Link href="#link">Login</Nav.Link>

              <NavDropdown title="User" id="basic-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">Log Out</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Routes>
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
