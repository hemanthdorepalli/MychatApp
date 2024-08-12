import React from 'react'
import './UserProfile.css'
import { useNavigate } from 'react-router-dom'

const UserProfile = ({name, photoURL, email, lastMessage}) => {
  const navigate = useNavigate()
  const goToUser = (emailId) => {
    if(emailId){
      navigate(`/${emailId}`)

      document.body.classList.add('chat-opened');
      // document.querySelector('.chat-display-container').classList.add('openchat');
    }
  }
  return (
    <div className='user-profile' onClick={() =>goToUser(email)}>
        {/* img of user */}
         <div className='user-img'>
              <img src={photoURL} alt="" />
         </div>
         {/* name of user */}
         <div className='user-info'>
            <p className='user-name'>{name}</p>
              {
                lastMessage && (<p className='user-lastmessage'>{lastMessage}</p>)
              }
         </div>
    </div>
  )
}

export default UserProfile