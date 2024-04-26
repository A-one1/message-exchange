import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Button, Col, InputGroup, Row } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { db } from "../firebase";
import { auth } from "../firebase";

function TopicSelector() {
  const [allTopic, setAllTopic] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const postsCollectionRef = collection(
    db,
    process.env.REACT_APP_ADMIN_DATABSE
  );
  const usersCollectionRef = collection(db, "Users");

  const email = auth.currentUser.email;

  const getTopics = async () => {
    const q = query(postsCollectionRef, orderBy("date", "desc"));
    const data = await getDocs(q);
    const topics = data.docs.map((doc) => doc.data().topic);
    const uniqueTopics = Array.from(new Set(topics));
    setAllTopic(uniqueTopics);
  };

  const getUserSelectedTopics = async () => {
    const querySnapshot = await getDocs(
      query(usersCollectionRef, where("email", "==", email))
    );
    if (querySnapshot.size > 0) {
      setSelectedTopics(querySnapshot.docs[0].data().selectedTopics || []);
    }
  };

  const updateProfile = async (event) => {
    event.preventDefault();
    if (auth) {
      const querySnapshot = await getDocs(
        query(usersCollectionRef, where("email", "==", email))
      );
      if (querySnapshot.size > 0) {
        const docRef = doc(usersCollectionRef, querySnapshot.docs[0].id);
        await updateDoc(docRef, {
          selectedTopics,
        });
      }
    }
  };

  const handleCheckboxChange = (topic) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter((t) => t !== topic));
    } else {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  useEffect(() => {
    getTopics();
    getUserSelectedTopics();
  }, []);

  return (
    <Form style={{ width: "80%" }} onSubmit={updateProfile}>
      <center>
        <b>Suscribe to these topic or Create a new one.</b>
      </center>
      <Row>
        {allTopic.map((topic, key) => (
          <Col key={key} md={4}>
            <InputGroup className="mb-3">
              <InputGroup.Checkbox
                onChange={() => handleCheckboxChange(topic)}
                checked={selectedTopics.includes(topic)}
              />
              <Form.Control value={topic} readOnly />
              {selectedTopics.includes(topic) ? (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleCheckboxChange(topic)}
                  style={{ marginLeft: "10px" }}
                >
                  Unsubscribe
                </Button>
              ) : (
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => handleCheckboxChange(topic)}
                  style={{ marginLeft: "10px" }}
                >
                  Subscribe
                </Button>
              )}
            </InputGroup>
          </Col>
        ))}
      </Row>

      <Button type="submit">Submit</Button>
    </Form>
  );
}

export default TopicSelector;
