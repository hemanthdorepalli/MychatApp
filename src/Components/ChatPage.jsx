import React from 'react'
import SideBar from './SideBar'
import ChatCantainer from './ChatCantainer'
import './ChatPage.css'

const ChatPage = ({currentUser, signOut}) => {
  
  return (
    <div className='chatpage'>
      <div className="chatpage-container">
        {/* sidebar */}
       <SideBar currentUser={currentUser} signOut={signOut}/>
       {/* chat container */}
       <ChatCantainer currentUser={currentUser}/>
      </div>
    </div>
  )
}

export default ChatPage;