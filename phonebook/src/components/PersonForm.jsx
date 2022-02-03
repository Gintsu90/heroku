import React from 'react';

const PersonForm = ({addName, newName, newNumber, handleNumberChange, handleNameChange}) => {
  return (
      <>
        <form onSubmit={addName}>
        <h1>add new</h1>
        <div>
          name: <input value={newName} onChange={handleNameChange}/>
          <br/>
          number: <input value={newNumber} onChange={handleNumberChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      </>
  );
};

export default PersonForm