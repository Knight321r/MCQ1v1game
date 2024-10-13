import React from 'react'
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios'
import './Mcqlist.css'

function Mcqlist() {
    const [mcq, setmcq] = useState([]);
    const {id} = useParams()
    // console.log("id is :", id);
    useEffect(() => {
      fetchmcq();
    }, []);

    const fetchmcq = async () => {
      try{
        const response = await axios.get(`http://localhost:8080/api/mcqlists/${id}/mcqs`, {
          headers : {
            Authorization : `Bearer ${localStorage.getItem('token')}`
          }
        })
        setmcq(response.data);
      }
      catch(error){
        console.error("error in fetchmcqlist:", error);
      }
    }

    const handleupdatemcq = async (mcqid) => {
      try{
        const updatedquestion = prompt('Enter the update question:')
        const updatedoptions = prompt('Enter the updated options(comma-separated):').split(',')
        const updatedanswer = prompt('Enter the updated answer indices(comma-separated):').split(',').map(Number)
        const response = await axios.put(`http://localhost:8080/api/mcqlists/${id}/mcqs/${mcqid}`,{
          question : updatedquestion,
          options : updatedoptions,
          correctAnswer : updatedanswer
        },{
          headers : {
            Authorization : `Bearer ${localStorage.getItem('token')}`
          }
        })
        setmcq(mcq.map(mcqs => mcqs._id === mcqid ? response.data : mcqs))
      }
      catch(error){
        console.error('error in handleupdatemcq:', error);
      }
    }

    const handledeletemcq = async (mcqid) => {
        try{
          await axios.delete(`http://localhost:8080/api/mcqlists/${id}/mcqs/${mcqid}`,{
            headers: {
              Authorization : `Bearer ${localStorage.getItem('token')}`
            }
          })
          setmcq(mcq.filter(mcq => mcq._id !== mcqid));
        }
        catch(error){
          console.error("error in handledeletemcq");
        }
    }

    const handleaddmcq = async () => {
      try{
        const question = prompt('Enter the question name:')
        const options = prompt('Enter the options (comma-separated):').split(',')
        const correctanswers = prompt('Enter the correct answer indices (comma-separated):').split(',').map(Number)
        const response = await axios.post(`http://localhost:8080/api/mcqlists/${id}/mcqs`, 
          {
            question,
            options,
            correctAnswer: correctanswers
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );

        setmcq([...mcq, response.data]);
      }
      catch(error){
        console.error("error in handleaddmcq:", error);
      }
    }
    
              
  return (
    <div className='Mcqlist'>
      <h1>Mcqs</h1>
      <button onClick={handleaddmcq}>Add Mcq</button>
      {mcq.map((item, ind) => (
        <div key={item._id}>
            <h3>{`${ind + 1})${item.question}`}</h3>
            <h3>options:</h3>
            {item.options.map((option, index) => (
              <div key={`${item._id}-option-${index}`}>
                <p>{`${index + 1})${option}`}</p>
              </div>
            ))}
            <h3>correct answers:</h3>
            {item.correctAnswer.map((answer, index) => (
              <div key={`${item._id}-answer-${index}`}>
                <p>{`${answer}) ${item.options[answer - 1]}`}</p>
              </div>
            ))}
            <button onClick={() => handleupdatemcq(item._id)}>Update</button>
            <button onClick={() => handledeletemcq(item._id)}>Delete</button>
        </div>
      ))}
    </div>
  )
}

export default Mcqlist
