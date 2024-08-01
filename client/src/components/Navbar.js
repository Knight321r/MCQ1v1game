import React from 'react'
import Userprofile from './Userprofile';
import { useNavigate } from 'react-router-dom';
function Navbar() {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
  return (
    <div className='Navbar'>
    {token && (
        <button onClick={()=> navigate('/Userprofile')}>Profile</button>
      )}
    </div>
  )
}

export default Navbar
