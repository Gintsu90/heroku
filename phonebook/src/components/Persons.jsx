import React from 'react';

const Persons = ({filteredNames, removeName}) => {
  return (
      <>
      {filteredNames.map((person, i) => 
          <li key={i}>{person.name} {person.number} <button onClick={() => removeName(person.id, person.name)}>delete</button></li>)}
      </>
  );
};

export default Persons;