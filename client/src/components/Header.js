import React from 'react'

function Header() {
  return (
    <div className='header'>
        <div className='header-logo'>
            <img src='../pic1.png' alt = 'image'></img>
        </div>
        <div className='header-meta'>
            <div className='header-meta-userinfo'>
                <span>Signup</span>
            </div>
            <div className='header-meta-routers'>
                <span></span>
            </div>
        </div>
    </div>
  )
}

export default Header 