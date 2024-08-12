import React from 'react'
import './Login.css'
import { GoogleAuthProvider, signInWithPopup} from 'firebase/auth'
import { db, auth } from './firebase' 
import { useNavigate } from 'react-router-dom'
import { doc, setDoc } from 'firebase/firestore'

const Login = ({setUser}) => {
    const navigate = useNavigate()
    
    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();

        const storeUserData = async (userID, userData)=>{
          await setDoc( doc (db, "users" ,userID), userData);      
        }

        await signInWithPopup( auth, provider).then( async (result) => {
            const newUser = {
                fullname: result.user.displayName,
                email: result.user.email,
                photoURL: result.user.photoURL,
                // uid: result.user.uid,
            }
            navigate("/")
            setUser(newUser)
            localStorage.setItem("user", JSON.stringify(newUser))
            storeUserData(result.user.email, newUser)            
        })
        .catch((err) => console.log(err.message))

    }
  return (
    <div className='login'>
      <div className="login-container">
        <img className='login-logo' src="./chatLogo.png" alt="" />
        <p>MyChat Web</p>
        <button className='login-btn' onClick={signInWithGoogle}>
           <img src="./googlelogo.png" alt="" />
           Login with Google
        </button>
        <p style={{color:'grey'}}>
        "Note: When logging in with Google, you cannot set a username; by default, your Google user ID is used. You can search for friends using this user ID."
        </p>
      </div>
      
    </div>
  )
}

export default Login