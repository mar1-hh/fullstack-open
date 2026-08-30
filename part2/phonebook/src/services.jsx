import axios from 'axios'

const baseUrl = "http://localhost:3001/persons"

const showAll = () => {
    const req = axios.get(baseUrl);
    return (req.then(res => res.data))
}

const create = (newObj) => {
    const req = axios.post(baseUrl, newObj);
    return (req.then(res => res.data));
}

const remove = (id) => {
    const req = axios.delete(`${baseUrl}/${id}`)
    return (req.then(res => res.data));
}

const update = (persons, name, newNumber) => {
    const obj = persons.find(person => person.name === name);
    const newObj = {...obj, number: newNumber};

    const req = axios.put(`${baseUrl}/${obj.id}`, newObj)
    return (req.then(res => res.data));
}

export default {create, showAll, remove, update}