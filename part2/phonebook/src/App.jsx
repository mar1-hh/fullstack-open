import { useState } from 'react'

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
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newSearch, setSearch] = useState('')

  const addInputSearch = (event) => {
    setSearch(event.target.value)
  }


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