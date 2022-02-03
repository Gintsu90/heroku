import React from 'react';

const Filter = ({handleInputChange}) => {
  return (
      <>
        filter shown with <input onChange={handleInputChange}/>
      </>
  );
};

export default Filter;