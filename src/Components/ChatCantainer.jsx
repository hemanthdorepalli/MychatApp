import React, { useEffect, useRef, useState } from 'react'
import './ChatCantainer.css'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';
import EmojiPicker from 'emoji-picker-react';
import ChatMessage from './ChatMessage';
import {  useNavigate, useParams } from 'react-router-dom';
import { db } from './firebase';
import {  collection, doc, getDoc, getDocs, onSnapshot, orderBy, query, writeBatch } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ChatCantainer = ({currentUser}) => {
    const [message, setMessage] = useState('')
    const [openEmojiBox, setOpenEmojiBox] = useState(false)
    const { emailID } = useParams();
    const [chatUser, setChatUser ] = useState({})
    const [ chatMessages, setChatMessages] = useState([])
    const chatBox = useRef(null)
    const navigate = useNavigate();

    // console.log(emailID)
    
    useEffect(() => {
   
        const fetchChatUser = async () => {
            try {
                const userDoc = doc(db, 'users', emailID);
                const userSnapshot = ((await getDoc(userDoc)));
               
                    setChatUser(userSnapshot.data())
                
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        const getMessages = () => {
            const q = query(
                collection(db, 'chats', emailID, 'messages'),
                orderBy('timeStamp', 'asc')
            );
        
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const messages = snapshot.docs.map(doc => doc.data());
        
                // Filter messages where the current user is either the sender or receiver
                const newMessages = messages.filter(
                    message =>
                        (message.senderEmail === currentUser.email && message.receiverEmail === emailID) ||
                        (message.senderEmail === emailID && message.receiverEmail === currentUser.email)
                );
        
                setChatMessages(newMessages);
            });
            return unsubscribe;
        };

        fetchChatUser();
        getMessages();
    }, [emailID]);
       

    useEffect(() => {
        const chatBoxElement = chatBox.current;
    
        if (!chatBoxElement) return;
    
        // Scroll to the bottom when the component mounts or chatMessages change
        const scrollToBottom = () => {
            chatBoxElement.scrollTo({
                top: chatBoxElement.scrollHeight,
                behavior: "smooth",
            });
        };
    
        // Create a MutationObserver to monitor changes in the chatBox
        const observer = new MutationObserver((mutations) => {
            // Check if there are any mutations and if so, scroll to bottom
            if (mutations.length) {
                scrollToBottom();
            }
        });
    
        // Start observing the chatBox for changes to its child elements
        observer.observe(chatBoxElement, { childList: true });
    
        // Initial scroll to bottom when the component is mounted
        scrollToBottom();
    
        // Cleanup the observer when the component unmounts or chatMessages changes
        return () => {
            observer.disconnect();
        };
    }, [chatMessages]);
    
    const send =async (e)=>{
        e.preventDefault();

        if (!message.trim()) {
            console.log("Cannot send an empty message");
            return;
        }

        if(emailID){
            const batch = writeBatch(db);
            let payload = {
                text: message.trim(),
                senderEmail: currentUser.email,
                receiverEmail: emailID,
                timeStamp: Timestamp.now(),
            }
        //  sender
        const senderDocRef = doc(db, `chats/${currentUser.email}/messages/${Date.now()}`);
        // receiver
        const receiverDocRef = doc(db, `chats/${emailID}/messages/${Date.now()}`);

        batch.set(senderDocRef, payload);
        batch.set(receiverDocRef, payload);


         // Friend list updates
         const currentUserFriendRef = doc(db, "FriendList", currentUser.email, "List", emailID);
         const chatUserFriendRef = doc(db, "FriendList", emailID, "List", currentUser.email);
 
         const friendListPayloadForCurrentUser = {
             email: chatUser.email,
             fullname: chatUser.fullname,
             photoURL: chatUser.photoURL,
             lastMessage: message,
             lastMessageTime: Timestamp.now(),
         };
 
         const friendListPayloadForChatUser = {
             email: currentUser.email,
             fullname: currentUser.fullname,
             photoURL: currentUser.photoURL,
             lastMessage: message,
             lastMessageTime: Timestamp.now(),
         };
 
         // Add the friend list updates to the batch
         batch.set(currentUserFriendRef, friendListPayloadForCurrentUser);
         batch.set(chatUserFriendRef, friendListPayloadForChatUser);
 
         try {
             await batch.commit(); 
             console.log("Messages and friend list updated successfully.");
         } catch (error) {
             console.error("Error sending messages or updating friend list: ", error);
         }
 
         setMessage(""); 
        
        }
    }
    // console.log(chatMessages)
    const clearChat = async () => {
        if (emailID) {
            const messagesRef = collection(db, 'chats', emailID, 'messages');
            const q = query(messagesRef);
            const querySnapshot = await getDocs(q);

            const batch = writeBatch(db);
            querySnapshot.forEach((doc) => {
                batch.delete(doc.ref);
            });

            try {
                await batch.commit();
                setChatMessages([]);
                console.log('Chat cleared successfully.');
            } catch (error) {
                console.error('Error clearing chat:', error);
            }
        }
    };
   const handleBackClick = ()=>{
    window.location.reload();
   }
  return (
    <div className='chat-container'>
        <div className="chat-container-header">
            <div className="chat-user-info">
                <div className='ArrowBackIcon' onClick={handleBackClick}>
                    <ArrowBackIcon/>
                </div>
                <div className="chat-user-img">
                    <img src={chatUser?.photoURL} alt="" />
                </div>
                <p>{chatUser?.fullname}</p>
            </div>
            <div className="chat-container-header-btm">
                 <p onClick={clearChat}>Clear Chat</p>
            </div>
        </div> 
        {/* chatdisplay container */}
             <div className="chat-display-container" ref={chatBox}>
             {chatMessages.map((message, index) => (
        <ChatMessage 
            key={index}
            message={message.text}
            date={message.timeStamp}
            sender={message.senderEmail}
            isOwnMessage={message.senderEmail === currentUser.email}
        />
    ))}
             </div>
        {/* chatinput */}
        <div className="chat-input">
        {/* buttons */}
        { openEmojiBox && <EmojiPicker className='emoji-picker-react' onEmojiClick={(EmojiObjects) => setMessage(message + EmojiObjects.emoji)}/>}
        <div className="chat-input-btn">
           <InsertEmoticonIcon onClick={()=> setOpenEmojiBox(!openEmojiBox)} />
           {/* <AttachFileIcon/> */}
        </div>
        {/* text input element */}
        <form action="" onSubmit={send} >
            <input type="text" placeholder='Type a Message' value={message} onChange={(e) =>{setMessage(e.target.value)}}/>
        </form>
        {/* send button */}
        <div  className="chat-input-btn-send" onClick={send} >
             <SendIcon/>
        </div>
        </div>
    </div>
  )
}

export default ChatCantainer