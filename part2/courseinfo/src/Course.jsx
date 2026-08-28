const Header = (props) => <h1>{props.course}</h1>

const Total = (props) => <p>total of {props.total} exercises</p>

const Part = (props) => (
  <p>
    {props.part.name} {props.part.exercises}
  </p>
)

const Content = (props) => (
  <div>
    {props.parts.map(part => <Part key={part.id} part={part}/>)}
  </div>
)


const Course = (props) => {
  return (
    <div>
      <Header course={props.course.name} />
      <Content parts={props.course.parts} />
      <Total total={props.course.parts.reduce((total, part) => total + part.exercises, 0)} />
    </div>
  )
}

export default Course