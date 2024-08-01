import React from 'react'
import data from '../database/data'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

function profile() {
  return (
    <div className='profile'>
        {
            data.map((data, ind) => {
                <div>
                    <p>mcq {ind + 1}</p>
                    <button>Add</button>
                    <button>Delete</button>
                    <button>Edit</button>
                </div>
            })
        }
    </div>
  )
}

export default profile
