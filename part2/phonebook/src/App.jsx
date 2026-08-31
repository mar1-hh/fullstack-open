import { useState, useEffect } from 'react'
import serv from './services'



const Filter = (props) => {
  return (
    <div>
        filter shown with <input value={props.newSearch} onChange={props.addInputSearch}/>
    </div>
  )
}

const AddNotif = ({notif}) => {
  if (notif === null)
    return (null)
  const greenRed = notif.includes('removed') ? 'red' : 'green'
  const notifStyle = {
    color: greenRed,
    border: `2px solid ${greenRed}`,
    padding: '10px',
    background: "ligthgrey"
  }

  return (
    <div style={notifStyle}>
      {notif}
    </div>
  )
}

const PersonForm = (props) => {

  const addPerson = (event) => {
    event.preventDefault()
    if (props.persons.some(person => (person.name === props.newName && person.number !== props.newNumber)))
    {
      if (window.confirm(`${props.newName} is already added to phonebook, replace the old number with new one ?`))
      {
        serv.update(props.persons, props.newName, props.newNumber).then(
          returned => props.setPersons(props.persons.map(person => 
          (person.name === props.newName ? returned : person)
          ))
        ).catch(err => {
          props.setNotf(`Information of ${props.newName} has already been removed from server`)
          setTimeout(() => {
            props.setNotf(null)
          }, 5000)
          props.setPersons(props.persons.filter(person => person.name !== props.newName))
        })
      }
      return ;
    }
    if (props.persons.some(person => (person.name === props.newName && person.number === props.newNumber)))
    {
      alert(`${props.newName} is already added to phonebook`);
      return ;
    }
    const newObj = {
      name: props.newName,
      number: props.newNumber
    }
    serv.create(newObj).then(returned => props.setPersons(props.persons.concat(returned)))
    props.setNotf(`Added ${props.newName}`)
    setTimeout(() => props.setNotf(null), 5000)
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

  const deletePhone = (phone) => {
    if (window.confirm(`Delete ${phone.name} ?`))
    {
      serv.remove(phone.id).then(() => props.setPersons(props.persons.filter(person => person.id !== phone.id)))
    }
  }

  if (props.newSearch === '')
  {
    return (
      <div>
        {props.persons.map(person => <div key={person.id}>
          <p>{person.name} {person.number}</p>
          <button onClick={() => {deletePhone(person)}}>delete</button>
        </div>)}
      </div>
    )
  }
  const arr = props.persons.filter(person => person.name.toLowerCase().startsWith(props.newSearch.toLowerCase()));
  return (
    <div>
      {arr.map(person => (<div key={person.id}>
        <p >{person.name} {person.number}</p> <button onClick={() => {deletePhone(person)}}>delete</button>
        </div>))}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newSearch, setSearch] = useState('')
  const [notif, setNotf] = useState(null)

  const addInputSearch = (event) => {
    setSearch(event.target.value)
  }

  useEffect(() => {
    serv.showAll().then(returned => {
      console.log(returned);
      setPersons(returned);
    })
  }, [])

  return (
    <div>
      <h2>Phonebook</h2>
      <AddNotif notif={notif} />
      <Filter newSearch={newSearch} addInputSearch={addInputSearch}/>
      <h3>add a new</h3>
      <PersonForm newName={newName} newNumber={newNumber} setNewName={setNewName} setNewNumber={setNewNumber}
        persons={persons} setPersons={setPersons} setNotf={setNotf}/>
      <h2>Numbers</h2>
      <Persons persons={persons} newSearch={newSearch} setPersons={setPersons}/>
    </div>
  )
}

export default App