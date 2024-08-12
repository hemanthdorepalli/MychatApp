import React from 'react'
import './ChatMessage.css'
import { auth } from './firebase';

const ChatMessage = ({ message, date, sender, isOwnMessage, fileURL}) => {
  return (
      <div className={`chat-message ${isOwnMessage ? 'own-message' : 'other-message'}`}
            style={{alignSelf:sender === auth.currentUser?.email ? 'flex-end' : 'flex-start',
              backgroundColor:sender == auth?.currentUser?.email ? '#dcf8cf' : '#fff'
            }}>
          <div className="chat-message-content">
              <p>{message}</p>
              {/* {fileURL && (
                    <div className="chat-message-file">
                        <a href={fileURL} target="_blank" rel="noopener noreferrer">
                            {__filename || 'Download File'}
                        </a>
                    </div>
                )} */}
              <span className="chat-message-date">
                  {new Date(date?.toDate()).toLocaleTimeString()}
              </span>
          </div>
      </div>
  );
};

export default ChatMessage