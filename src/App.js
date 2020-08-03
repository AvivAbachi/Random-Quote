import React, {useRef, useState, useEffect, useCallback} from 'react';
import './styles.scss';
import {Card, Container, Button, Row} from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTwitter} from '@fortawesome/free-brands-svg-icons';
import {faQuoteLeft, faQuoteRight} from '@fortawesome/free-solid-svg-icons';

const COLOR_LIST = ['primary', 'secondary', 'success', 'danger', 'warning', 'info'];

const App = () => {
  const [color, SetColor] = useState('');

  const randomColor = useCallback(() => {
    const newColor = COLOR_LIST[Math.floor(Math.random() * 6)];
    color === newColor ? randomColor() : SetColor(newColor);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    randomColor();
  }, [randomColor]);

  return (
    <>
      <Container id='App' className={'App bg-' + color} fluid>
        <QuoteBox color={color} setColor={() => randomColor()} />
        <Creadit color={color} />
      </Container>
    </>
  );
};

const QuoteBox = React.memo((props) => {
  const quoteBoxRef = useRef();
  const [text, setText] = useState();
  const [author, setAuthor] = useState();
  const axios = require('axios');

  useEffect(() => {
    quoteIN();
    // eslint-disable-next-line
  }, []);

  const quoteIN = useCallback(() => {
    axios
      .get('https://api.quotable.io/random')
      .then((response) => response.data)
      .then((data) => {
        setText(data.content);
        setAuthor(data.author);
        quoteBoxRef.current.style.animationName = 'quoteboxIn';
      })
      .catch((error) => {
        setText(String(error));
        setAuthor(null);
        quoteBoxRef.current.style.animationName = 'quoteboxIn';
      });
  }, [axios]);

  const quoteOUT = () => {
    quoteBoxRef.current.style.animationName = 'quoteboxOut';
    props.setColor();
    setTimeout(() => {
      quoteIN();
    }, 500);
  };

  return (
    <Card ref={quoteBoxRef} id='quote-box' className='quotebox' text={props.color}>
      <Card.Body>
        <Card.Title id='text' className='quotebox__text'>
          <FontAwesomeIcon icon={faQuoteLeft} size='xs' />
          {text}
          <FontAwesomeIcon icon={faQuoteRight} size='xs' />
        </Card.Title>
        <Card.Text id='author' className='quotebox__author' variant={props.color}>
          {author && '- ' + author}
        </Card.Text>
        <Row className='quotebox__buttons'>
          <Button size={'lg'} variant={'outline-' + props.color} href='twitter.com/intent/tweet' id='tweet-quote' title='Tweet this quote!' target='_blank'>
            <FontAwesomeIcon icon={faTwitter} />
          </Button>
          <Button size={'lg'} variant={props.color} id='new-quote' onClick={() => quoteOUT()}>
            {author ? 'New Quote' : 'Try Again'}
          </Button>
        </Row>
      </Card.Body>
    </Card>
  );
});

const Creadit = (props) => {
  return (
    <Button variant='light' className='credite' href='https://github.com/AvivAbachi'>
      <span className={'text-' + props.color}>Create by AvivAbachi@Gmail.com</span>
    </Button>
  );
};

export default App;
