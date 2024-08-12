import React from 'react'
import './HomePage.css'
import SideBar from './SideBar'

const HomePage = ({currentUser, signOut}) => {
  return (
    <div className='home'>
        <div className="home-container">
           
            <SideBar currentUser={currentUser} signOut={signOut}/>
           
             <div className="home-bg">
              <img src="./chatLogo.png" alt="" />
             </div>
        </div>
    </div>
  )
}

export default HomePage