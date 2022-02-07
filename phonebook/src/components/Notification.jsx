import React from 'react';

const messageStyle = {
  border: "solid",
  background: "lightgrey",
  fontSize: 20,
  padding: 5,
  marginBottom: 10
}

const Notification = ({message}) => {

    if(message === null) {
        return null
    }

  return (
      <div style={messageStyle}>
        {message}
      </div>
  );
};

export default Notification;