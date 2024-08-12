import React, { useEffect, useState } from 'react'
import './SideBar.css'
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import UserProfile from './UserProfile';
import { db } from './firebase';
import { collection, doc, getDoc, getDocs, onSnapshot, setDoc } from 'firebase/firestore';

const SideBar = ({currentUser, signOut}) => {
  
  const [ allUsers, setAllUsers ] = useState([])
  const [ searchInput, setSearchInput ] = useState('');
  const [friendList, setFriendList] = useState([]);

  useEffect(() => {
      if (!currentUser?.email) return;
  
      const unsubscribeUsers = onSnapshot(
        collection(db, 'users'),
        (snapshot) => {
          const getAllUsers = snapshot.docs
            .filter((doc) => doc.data().email !== currentUser?.email)
            .map((doc) => doc.data()); 
          setAllUsers(getAllUsers);
        },
        (error) => {
          console.error("Error fetching users:", error);
        }
      );
  
      const friendListCollectionRef = collection(db, 'FriendList', currentUser.email, 'List');
      const unsubscribeFriends = onSnapshot(
        friendListCollectionRef,
        (snapshot) => {
          const friends = snapshot.docs.map(doc => doc.data());
          setFriendList(friends);
        },
        (error) => {
          console.error("Error fetching friend list:", error);
        }
      );
  
      return () => {
        unsubscribeUsers();
        unsubscribeFriends();
      };
  }, [currentUser?.email]);
   
        const searchedUser = allUsers.filter((user) => {
          if (searchInput) {
            if(user.fullname.includes(searchInput)){
              return user
            }
          }
        });

        const searchItem = searchedUser.map((user) => {
          return(
            <UserProfile
                  name={user.fullname}
                  photoURL={user.photoURL || './no-profile.jpg'}   
                  key={user.email}    
                  email={user.email}    
            />
          )
     })
     const friendListItems = friendList
     .sort((a, b) => {
         const timeA = a.lastMessageTime?.toMillis() || 0; 
         const timeB = b.lastMessageTime?.toMillis() || 0; 
         return timeB - timeA; 
     })
     .map((friend) => (
         <UserProfile
             key={friend.email}
             name={friend.fullname}
             photoURL={friend.photoURL || './no-profile.jpg'}
             email={friend.email}
             lastMessage ={friend.lastMessage}
         />
     ));

     
     
  return (
    <div className='sidebar'>
        <div className='sidebar-header'>
            <div className='sidebar-header-img'>
                <img src={currentUser?.photoURL} alt=""/>
            </div>
            <div className='sidebar-header-name'>
              <h6 >{currentUser?.fullname}</h6>
            </div>
            <div className='sidebar-header-btn'>
                 <LogoutIcon onClick={ signOut } style={{color:"rgb(121, 121, 155)"}} />
            </div>
        </div>

        <div className='sidebar-search'>
             <div className='sidebar-search-input'>
                 <SearchIcon/>
                 <input type="text" 
                        name='Search' 
                        placeholder='Search...' 
                        value={searchInput} 
                        onChange={(e) => setSearchInput(e.target.value)}/>
             </div>
        </div>

        <div className='sidebar-chat-list'>
          {
            searchItem.length > 0 ?(searchItem):(friendListItems)
          }        
        </div>
        
    </div>
  )
}

export default SideBar