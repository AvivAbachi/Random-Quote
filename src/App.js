import React, { useRef, useState, useEffect } from "react";
import "./styles.scss";
import { Card, Container, Button, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faQuoteLeft, faQuoteRight } from "@fortawesome/free-solid-svg-icons";

const COLOR_LIST = [
  "primary",
  "secondary",
  "success",
  "danger",
  "warning",
  "info"
];

const App = () => {
  const [color, SetColor] = useState("");

  const randomColor = () => {
    const newColor = COLOR_LIST[Math.floor(Math.random() * 6)];
    color === newColor ? randomColor() : SetColor(newColor);
  };

  useEffect(() => {
    randomColor();
  }, []);

  return (
    <>
      <Container id="App" className={"App bg-" + color} fluid>
        <QuoteBox color={color} setColor={() => randomColor()} />
        <Creadit color={color} />
      </Container>
    </>
  );
};

const QuoteBox = React.memo(props => {
  const quoteBoxRef = useRef();
  const [text, setText] = useState("dsa");
  const [author, setAuthor] = useState("dsa");

  useEffect(() => {
    quoteIN();
  }, []);

  const quoteIN = () => {
    fetch("https://api.quotable.io/random")
      .then(response => response.json())
      .then(data => {
        setText(data.content);
        setAuthor(data.author);
      })
      .then(() => (quoteBoxRef.current.style.animationName = "quoteboxIn"));
  };

  const quoteOUT = () => {
    props.setColor();
    setTimeout(() => {
      quoteIN();
    }, 500);
    quoteBoxRef.current.style.animationName = "quoteboxOut";
  };

  return (
    <Card
      ref={quoteBoxRef}
      id="quote-box"
      className="quotebox"
      text={props.color}
    >
      <Card.Body>
        <Card.Title id="text" className="quotebox__text">
          <FontAwesomeIcon icon={faQuoteLeft} size="xs" />
          {text}
          <FontAwesomeIcon icon={faQuoteRight} size="xs" />
        </Card.Title>
        <Card.Text
          id="author"
          className="quotebox__author"
          variant={props.color}
        >
          {"- " + author}
        </Card.Text>
        <Row className="quotebox__buttons">
          <Button
            size={"lg"}
            variant={"outline-" + props.color}
            href="twitter.com/intent/tweet"
            id="tweet-quote"
            title="Tweet this quote!"
            target="_blank"
          >
            <FontAwesomeIcon icon={faTwitter} />
          </Button>
          <Button
            size={"lg"}
            variant={props.color}
            id="new-quote"
            onClick={() => quoteOUT()}
          >
            New quote
          </Button>
        </Row>
      </Card.Body>
    </Card>
  );
});

const Creadit = props => {
  return (
    <Button
      variant="light"
      className="credite"
      href="https://github.com/AvivAbachi"
    >
      <span className={"text-" + props.color}>
        Create by AvivAbachi@Gmail.com
      </span>
    </Button>
  );
};

export default App;
