import React from 'react';
import './style.css';

const Button = ({handleClick}) => {
  return (
    <button onClick={()=>handleClick()} className="buttonBlue">
      SOLVE
    </button>
  );
};

export default Button;