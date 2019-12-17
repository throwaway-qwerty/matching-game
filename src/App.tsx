import './App.css';
import { shuffle } from './utils';
import React, { useState } from 'react';
import styled from 'styled-components';

const NUMBER_OF_CARDS = 12;
const options = [
  'chartreuse',
  'crimson',
  'darkblue',
  'tomato',
  'darkorange',
  'firebrick',
  'mediumaquamarine'
];

const Container = styled.div`
  display: flex;
  max-width: 60rem;
  margin: 0 auto;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
`;
const Card = styled.div<{ bgColor: string }>`
  width: 20%;
  height: 160px;
  border-radius: 6px;
  margin: 2px 2px;
  background-color: black;
  cursor: pointer;

  &.REVEALED,
  &.SOLVED {
    background-color: ${props => props.bgColor};
  }
`;

const pairs = new Array(NUMBER_OF_CARDS / 2)
  .fill('')
  .map(() => {
    const randomNumber = Math.floor(Math.random() * options.length);
    const randomOption = options[randomNumber];
    return [randomOption, randomOption];
  })
  .flatMap(x => x);

const shuffledPairs = shuffle(pairs);

const App: React.FC = () => {
  const [solved, setSolved] = useState<Array<number>>([]);
  const [revealed, setRevealed] = useState<Array<number>>([]);
  const [disabled, setDisabled] = useState<boolean>(false);

  const handleClick = (i: number) => {
    if (disabled) return;
    if (solved.indexOf(i) > -1) return;
    const newRevealed = [...revealed, i];
    setRevealed(newRevealed);

    if (newRevealed.length === 2) {
      // Disable revealing pairs
      setDisabled(true);

      // Found a pair
      if (
        newRevealed[0] !== newRevealed[1] &&
        shuffledPairs[newRevealed[0]] === shuffledPairs[newRevealed[1]]
      ) {
        setSolved([...solved, ...newRevealed]);
      }

      // Pair not found, reset
      setTimeout(() => {
        setRevealed([]);
        setDisabled(false);
      }, 1000);
    }
  };

  const isSolved = (i: number) => solved.indexOf(i) > -1;
  const isRevealed = (i: number) => revealed.indexOf(i) > -1;

  return (
    <>
      {solved.length === NUMBER_OF_CARDS && (
        <h1 style={{ textAlign: 'center' }}>You Win! Refresh to Restart</h1>
      )}
      <Container>
        {shuffledPairs.map((color, i) => {
          return (
            <Card
              key={i}
              bgColor={color}
              onClick={() => handleClick(i)}
              className={
                isRevealed(i) ? 'REVEALED' : isSolved(i) ? 'SOLVED' : ''
              }
            />
          );
        })}
      </Container>
    </>
  );
};

export default App;
