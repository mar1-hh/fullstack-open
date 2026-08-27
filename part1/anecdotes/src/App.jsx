import { useState } from 'react'

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

const Generater = (props) => {
    return (
        <button onClick={() => {props.setSelected(getRandomInt(props.anecdotes.length))}}>
            next anecdote
        </button>
    )
}

const Vote = (props) => {
    return (
        <button onClick={() => props.setvote(prev => {
            const newVotes = [...prev]
            newVotes[props.selected] += 1
            return (newVotes)
        })}>
            vote
        </button>
    )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [votes, setvote] = useState(Array(anecdotes.length).fill(0));
  const max = Math.max(...votes)

  return (
    <div>
     <h1>Anecdote of the day</h1>
      {anecdotes[selected]}
      <br />
      <Generater anecdotes={anecdotes} selected={selected} setSelected={setSelected}/>
      <Vote selected={selected} votes={votes} setvote={setvote} />
      <h1>Anecdote with most votes</h1>
      {anecdotes[votes.findIndex(vote => vote === max)]}
    </div>
  )
}

export default App