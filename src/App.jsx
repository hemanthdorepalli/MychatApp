import { Route, Routes } from 'react-router-dom'
import './App.css'
import ChatPage from './Components/ChatPage'
import HomePage from './Components/HomePage'
import Login from './Components/Login'
import { useState } from 'react'
import { auth } from './Components/firebase'



function App() {

  const  [user, setUser] = useState(JSON.parse(localStorage.getItem("user")))

  const signOut = async ()=>{
   await auth.signOut()
    .then(()=>{
       setUser(null)
       localStorage.removeItem("user")
    })
    .catch((err) => alert(err.message))
  }
 

  return (
  <div>
    {
      user ? (  <Routes>
                <Route path="/:emailID" element={<ChatPage currentUser={user} signOut={signOut}/>} />
                <Route path='/' element={<HomePage currentUser={user} signOut={signOut}/>} />
                </Routes>):(<Login setUser={setUser}/>)
    }
  </div>
  )
}

export default App
