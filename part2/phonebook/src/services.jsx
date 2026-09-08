import axios from 'axios'

const baseUrl = "/api"

const showAll = () => {
    const req = axios.get(`${baseUrl}/persons`);
    return (req.then(res => res.data))
}

const create = (newObj) => {
    const req = axios.post(`${baseUrl}/persons`, newObj);
    return (req.then(res => res.data));
}

const remove = (id) => {
    const req = axios.delete(`${baseUrl}/persons/${id}`)
    return (req.then(res => res.data));
}

const update = (persons, name, newNumber) => {
    const obj = persons.find(person => person.name === name);
    const newObj = {...obj, number: newNumber};
    console.log("im here")
    const req = axios.put(`${baseUrl}/persons/${obj.id}`, newObj)
    return (req.then(res => res.data));
}

export default {create, showAll, remove, update}