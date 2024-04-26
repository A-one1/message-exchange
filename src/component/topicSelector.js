import React, { useEffect, useState } from "react";
import { Button, Col, InputGroup, Row } from "react-bootstrap";
import Form from "react-bootstrap/Form";

function TopicSelector() {
  const [selectedTopics, setSelectedTopics] = useState({});
  console.log("🚀 ~ TopicSelector ~ selectedTopics:", selectedTopics);

  const topics = [
    "AI",
    "Sports",
    "Politics",
    "Space Exploration",
    "Culinary Creations",
    "Digital Art",
    "Environmental Conservation",
    "Health and Wellness",
  ];

  const handleCheckboxChange = (event) => {
    setSelectedTopics({
      ...selectedTopics,
      [event]: event,
    });
  };
  useEffect(() => {}, [selectedTopics]);

  return (
    <Form style={{ width: "80%" }}>
      <center>
        <b>Suscribe to these topic or Create a new one.</b>
      </center>
      <Row>
        {topics.map((topic) => (
          <Col md={3}>
            <InputGroup className="mb-3">
            <InputGroup.Checkbox onChange={() => handleCheckboxChange(topic)} checked={selectedTopics[topic] || false} />
              <Form.Control value={topic} readOnly />
            </InputGroup>
            {/* <Form.Check
              type="checkbox"
              id={topic}
              label={topic}
              name={topic}
              checked={selectedTopics[topic] || false}
              onChange={handleCheckboxChange}
              custom
            /> */}
          </Col>
        ))}
      </Row>
    </Form>
  );
}

export default TopicSelector;
