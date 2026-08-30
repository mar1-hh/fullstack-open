import { useState, useEffect } from 'react'
import axios from 'axios'

const Filter = (props) => {
  return (
    <div>
        filter shown with <input value={props.newSearch} onChange={props.addInputSearch}/>
    </div>
  )
}

const PersonForm = (props) => {

  const addPerson = (event) => {
    event.preventDefault()
    if (props.persons.some(person => person.name === props.newName))
    {
      alert(`${props.newName} is already added to phonebook`);
      return ;
    }
    const newObj = {
      name: props.newName,
      number: props.newNumber
    }
    props.setPersons(props.persons.concat(newObj));
    props.setNewNumber('');
    props.setNewName('');
  }
  const addInputName = (event) => {
    props.setNewName(event.target.value)
  }
  const addInputphone = (event) => {
    props.setNewNumber(event.target.value)
  }

  return (
    <form onSubmit={addPerson}>
      <div>
        name: <input value={props.newName} onChange={addInputName}/>
      </div>
      <div>
        number: <input value={props.newNumber} onChange={addInputphone}/>
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}


const Persons = (props) => {
  if (props.newSearch === '')
  {
    return (
      <div>
        {props.persons.map(person => <p key={person.name}>{person.name} {person.number}</p>)}
      </div>
    )
  }
  const arr = props.persons.filter(person => person.name.toLowerCase().startsWith(props.newSearch.toLowerCase()));
  return (
    <div>
      {arr.map(person => (<p key={person.name}>{person.name} {person.number}</p>))}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newSearch, setSearch] = useState('')

  const addInputSearch = (event) => {
    setSearch(event.target.value)
  }

  useEffect(() => {
    console.log("effect");
    axios
    .get("http://localhost:3001/persons").then(response => {
      console.log(response.data);
      setPersons(response.data);
    })
  }, [])

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter newSearch={newSearch} addInputSearch={addInputSearch}/>
      <h3>add a new</h3>
      <PersonForm newName={newName} newNumber={newNumber} setNewName={setNewName} setNewNumber={setNewNumber}
        persons={persons} setPersons={setPersons}/>
      <h2>Numbers</h2>
      <Persons persons={persons} newSearch={newSearch}/>
    </div>
  )
}

export default App