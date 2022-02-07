import React, { useState, useEffect } from 'react';
import Persons from "./components/Persons";
import PersonForm from "./components/PersonForm";
import Filter from "./components/Filter";
import personServices from "./services/persons";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState("");
  const [filterName, setFilterName] = useState("");
  const [message, setMessage] = useState(null)

  const getPersons = () => {
    personServices
      .getAll()
      .then(initialPersons => {
        console.log(initialPersons);
        setPersons(initialPersons);
      })
  }

  useEffect(() => {
    getPersons()
  }, [])

  const handleNameChange = (e) => {
    console.log(e.target.value)
    setNewName(e.target.value);
  }
  
  const handleNumberChange = (e) => {
    console.log(e.target.value)
    setNewNumber(e.target.value);
  }

  const handleInputChange = (e) => {
    console.log(e.target.value);
    setFilterName(e.target.value)
  }

  const addName = (e) => {
    e.preventDefault();
    const personObject = {
      name: newName,
      number: newNumber
    };
    const personName = persons.find(person => person.name === newName)
    const personNumber = persons.find(person => person.number === newNumber)
    const changeNumber = {...personName, number: newNumber}
    
    if(personName && !personNumber) {
      if(window.confirm(`${newName} is already added in the phonebook, replace the old number with a new one?`)) {
        personServices
        .update(changeNumber.id, changeNumber)
        .then(updatedPerson => {
          setPersons(persons.map(person => person.id === changeNumber.id ? updatedPerson : person));
          setNewName("");
          setNewNumber("");
          setMessage(`${updatedPerson.name}'s phone number was updated`);
          setTimeout(() => {
            setMessage(null)
          }, 3000)
        })
        .catch(error => {
          setMessage(`Information of ${personName.name} has already been removed from server.`);
          setTimeout(() => {
            setMessage(null);
          }, 4000)
        })
      }
      
    } else {
      
      personServices
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName("")
          setNewNumber("")
          setMessage(`Added ${returnedPerson.name}`);
          setTimeout(() => {
            setMessage(null)
          }, 3000)
        })
        .catch(error => {
          console.log("ERROR", error.response.data);
          setMessage(error.response.data.error);
          
        })
    }
  }

  const removeName = (id, name) => {
    if(window.confirm(`Are you sure you want to remove ${name}?`)) {
      personServices
        .remove(id)
        .then(data => {
          console.log(`Deleted successfully`)
          getPersons()
        })
    }
  }

  const filteredNames = persons.filter(person => person.name.toLowerCase().includes(filterName.toLowerCase()))
  
  return (
    <div>
      <h2>Phonebook</h2>
      <Filter handleInputChange={handleInputChange}/>
      <PersonForm newName={newName} newNumber={newNumber} addName={addName} handleNumberChange={handleNumberChange} handleNameChange={handleNameChange}/>
      <Notification message={message}/>
      <h2>Numbers</h2>
      <Persons filteredNames={filteredNames} removeName={removeName}/>
    </div>
  )

}

export default App
