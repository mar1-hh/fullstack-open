import { useState } from "react";

const Header = () => {
  return (
    <h1>give feedback</h1>
  )
}

const Buttons = ({good, setGood, bad, setBad, neutral, setNeutral}) => {
  return (
    <div>
      <button onClick={() => {setGood(good + 1)}}>good</button>
      <button onClick={() => {setNeutral(neutral + 1)}}>neutral</button>
      <button onClick={() => {setBad(bad + 1)}}>bad</button>
    </div>
  )
}

const StatisticLine = ({text, value}) => {
  return (
    <p>{text} {value}</p>
  )
}

const Statistics = (props) => {
  const all = (props.good + props.bad + props.neutral);
  if (!all)
  {
    return (
      <h3>
        No feedback given
      </h3>
    )
  }
  return (
    <div>
      <StatisticLine text="good" value={props.good} />
      <StatisticLine text="neutral" value={props.neutral} />
      <StatisticLine text="bad" value={props.bad} />
      <StatisticLine text="all" value={all} />
      <StatisticLine text="average" value={(props.good - props.bad) / all} />
      <StatisticLine text="positive" value={props.good * 100 / all} />
    </div>
  )
}

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  return (
    <div>
      <Header />
      <Buttons good={good} setGood={setGood} neutral={neutral} setNeutral={setNeutral} bad={bad} setBad={setBad}/>
      <Statistics good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}

export default App