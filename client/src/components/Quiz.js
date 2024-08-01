import React, { useState } from 'react'
import data from '../database/data';
import Question from './Question';

function Quiz() {
    const [ind, setind] = useState(0);
    const len = data.length
    const handlechange = (id) =>{
        if(id === 0){
            let newind = (ind + 1) % len;   
            setind(newind);
        }
        else{
            let newind = (ind - 1 + len) % len;
            setind(newind);
        }
    }

  return (
    <div className='quiz'>
        <Question num={ind}/>
        <button onClick={() => handlechange(0)}>Next</button>
        <button onClick={() => handlechange(1)}>Prev</button>
    </div>
  )
}

export default Quiz
