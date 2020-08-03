import React, { useRef, useState, useEffect, useCallback } from "react";
import "./styles.scss";
import { Card, Container, Button, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faQuoteLeft, faQuoteRight } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const COLOR_LIST = [
  "primary",
  "secondary",
  "success",
  "danger",
  "warning",
  "info"
];

const App = () => {
  const [color, SetColor] = useState();

  const randomColor = useCallback(() => {
    const newColor = COLOR_LIST[Math.floor(Math.random() * 6)];
    newColor === color ? randomColor() : SetColor(newColor);
    // eslint-disable-next-line
  }, []);

  useEffect(() => randomColor(), [randomColor]);

  return (
    <Container id="App" className={"App bg-" + color} fluid>
      <QuoteBox color={color} setColor={() => randomColor()} />
      <Creadit color={color} />
    </Container>
  );
};

const QuoteBox = React.memo(props => {
  const quoteBoxRef = useRef();
  const [text, setText] = useState();
  const [author, setAuthor] = useState();

  // eslint-disable-next-line
  useEffect(() => quoteIN(), []);

  const quoteIN = useCallback(() => {
    axios
      .get("https://api.quotable.io/random")
      .then(response => response.data)
      .then(data => {
        setText(data.content);
        setAuthor(data.author);
        changeAnimation();
      })
      .catch(error => {
        setText(String(error));
        setAuthor(null);
        changeAnimation();
      });
  }, []);

  const quoteOUT = () => {
    changeAnimation(true);
    props.setColor();
    setTimeout(() => quoteIN(), 500);
  };

  const changeAnimation = out => {
    const creaditStyle = quoteBoxRef.current.style;
    let randomDirection = () => (Math.random() > 0.5 ? 450 : -450);
    let x = randomDirection();
    let y = randomDirection();
    let r = x === 450 ? 45 : -45;
    out
      ? (() => {
          creaditStyle.transform = `scale(0.625) translateX(${x}px) translateY(${y}px) rotate(${r}deg)`;
          creaditStyle.animationName = "quoteboxOut";
        })()
      : (creaditStyle.animationName = "quoteboxIn");
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
          {author && <FontAwesomeIcon icon={faQuoteLeft} size="xs" />}
          {text}
          {author && <FontAwesomeIcon icon={faQuoteRight} size="xs" />}
        </Card.Title>
        <Card.Text
          id="author"
          className="quotebox__author"
          variant={props.color}
        >
          {author && "- " + author}
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
            {author ? "New Quote" : "Try Again"}
          </Button>
        </Row>
      </Card.Body>
    </Card>
  );
});

const Creadit = props => {
  let creaditRef = useRef();
  useEffect(() => {
    const creaditStyle = creaditRef.current.style;
    creaditStyle.opacity = 1;
    creaditStyle.transform = "scale(1)";
    setTimeout(() => (creaditStyle.animationName = "hover"), 900);
  });
  return (
    <Button
      ref={creaditRef}
      variant="light"
      className={"credite text-" + props.color}
      href="https://github.com/AvivAbachi"
    >
      Create by AvivAbachi@Gmail.com
    </Button>
  );
};

export default App;
