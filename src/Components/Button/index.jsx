import React from 'react';
import './style.css';

const Button = ({handleClick, value}) => {
  return (
    <button onClick={()=>handleClick()} className="buttonBlue">
      {value}
    </button>
  );
};

export default Button;