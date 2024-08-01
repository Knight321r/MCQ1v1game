import React from 'react'
import data from '../database/data'

function Question(props) {

    // console.log(data);

  return (
    <div className='Question'>
        <h3>{data[props.num].question}</h3>
        {
            data[props.num].answer.map((opt, ind) =>(
                <div key={ind}>
                    <input type='radio' name={props.num} id={`q${ind}`}></input>
                    <label htmlFor={`q${ind}`}>{opt}</label>
                </div>
            ))
        }
    </div>
  )
}

export default Question
