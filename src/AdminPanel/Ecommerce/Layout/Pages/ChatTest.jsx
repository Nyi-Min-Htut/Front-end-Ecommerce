import React, { useState, useEffect, useRef } from 'react';
import Pusher from 'pusher-js';

export default function ChatTest() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [username, setUsername] = useState('User' + Math.floor(Math.random() * 1000));
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef(null);
  const pusherRef = useRef(null);

  // ============================================
  // LOAD INITIAL MESSAGES - RUNS ONLY ONCE
  // ============================================
  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/messages');
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // ============================================
  // SETUP WEBSOCKET - RUNS ONLY ONCE
  // ============================================
  useEffect(() => {
    // Initialize Pusher (connects to Laravel WebSocket)
    const pusher = new Pusher('local', {
      wsHost: '127.0.0.1',
      wsPort: 6001, // Change to 8080 if using Reverb
      forceTLS: false,
      disableStats: true,
      cluster: 'mt1',
      enabledTransports: ['ws', 'wss']
    });

    pusherRef.current = pusher;

    // Connection event handlers
    pusher.connection.bind('connected', () => {
      console.log('✅ Connected to WebSocket');
      setIsConnected(true);
    });

    pusher.connection.bind('disconnected', () => {
      console.log('🔴 Disconnected from WebSocket');
      setIsConnected(false);
    });

    // Subscribe to channel and listen for events
    const channel = pusher.subscribe('demo-channel');
    
    channel.bind('demo-event', (data) => {
      console.log('📨 New message received:', data);
      
      // Add new message to state - REACT AUTOMATICALLY RE-RENDERS!
      setMessages(prevMessages => [...prevMessages, {
        id: Date.now(),
        message: data.message,
        user: data.user || 'Anonymous',
        created_at: new Date().toISOString()
      }]);
    });

    // Cleanup on component unmount
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, []); // ← EMPTY ARRAY = RUN ONLY ONCE!

  // ============================================
  // AUTO-SCROLL TO BOTTOM WHEN NEW MESSAGE ARRIVES
  // ============================================
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ============================================
  // SEND MESSAGE
  // ============================================
  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    try {
      const response = await fetch('http://127.0.0.1:8000/api/send_message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || ''
        },
        body: JSON.stringify({
          message: inputMessage,
          user: username
        })
      });

      if (response.ok) {
        setInputMessage(''); // Clear input
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.title}>💬 Real-time Chat</h2>
        <div style={styles.statusContainer}>
          <span style={{
            ...styles.statusDot,
            backgroundColor: isConnected ? '#4caf50' : '#f44336'
          }} />
          <span style={styles.statusText}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      {/* Username input */}
      <div style={styles.usernameContainer}>
        <label style={styles.usernameLabel}>Your name:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.usernameInput}
          maxLength="50"
        />
      </div>

      {/* Messages container */}
      <div style={styles.messagesContainer}>
        {messages.length === 0 ? (
          <div style={styles.emptyMessages}>
            No messages yet. Start chatting!
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              style={{
                ...styles.messageBubble,
                alignSelf: msg.user === username ? 'flex-end' : 'flex-start',
                backgroundColor: msg.user === username ? '#dcf8c6' : '#ffffff',
                borderBottomRightRadius: msg.user === username ? '4px' : '18px',
                borderBottomLeftRadius: msg.user === username ? '18px' : '4px',
              }}
            >
              <div style={styles.messageHeader}>
                <span style={styles.messageUser}>{msg.user || 'Anonymous'}</span>
                <span style={styles.messageTime}>
                  {formatTime(msg.created_at || Date.now())}
                </span>
              </div>
              <div style={styles.messageContent}>
                {msg.message || msg.content || msg}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          style={styles.input}
          disabled={!isConnected}
        />
        <button
          onClick={sendMessage}
          style={{
            ...styles.button,
            opacity: !isConnected ? 0.6 : 1,
            cursor: !isConnected ? 'not-allowed' : 'pointer'
          }}
          disabled={!isConnected}
        >
          Send
        </button>
      </div>

      {/* Debug info - remove in production */}
      <div style={styles.debug}>
        <small>Connected clients will see messages in real-time</small>
      </div>
    </div>
  );
}

// ============================================
// STYLES
// ============================================
const styles = {
  container: {
    maxWidth: '800px',
    margin: '20px auto',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f0f2f5',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  header: {
    backgroundColor: '#075e54',
    color: 'white',
    padding: '15px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    margin: 0,
    fontSize: '20px'
  },
  statusContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  statusDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    display: 'inline-block'
  },
  statusText: {
    fontSize: '14px'
  },
  usernameContainer: {
    padding: '10px 20px',
    backgroundColor: '#fff',
    borderBottom: '1px solid #e0e0e0',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  usernameLabel: {
    fontSize: '14px',
    color: '#666'
  },
  usernameInput: {
    padding: '8px 12px',
    border: '1px solid #ddd',
    borderRadius: '20px',
    fontSize: '14px',
    flex: '0 1 200px'
  },
  messagesContainer: {
    height: '400px',
    overflowY: 'auto',
    padding: '20px',
    backgroundColor: '#e5ddd5',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  emptyMessages: {
    textAlign: 'center',
    color: '#999',
    marginTop: '20px',
    fontStyle: 'italic'
  },
  messageBubble: {
    maxWidth: '70%',
    padding: '10px 15px',
    borderRadius: '18px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
    position: 'relative'
  },
  messageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '5px',
    fontSize: '12px'
  },
  messageUser: {
    fontWeight: 'bold',
    color: '#075e54'
  },
  messageTime: {
    color: '#999',
    fontSize: '10px',
    marginLeft: '10px'
  },
  messageContent: {
    fontSize: '14px',
    wordWrap: 'break-word'
  },
  inputContainer: {
    display: 'flex',
    padding: '15px',
    backgroundColor: '#fff',
    borderTop: '1px solid #e0e0e0'
  },
  input: {
    flex: 1,
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '25px',
    fontSize: '14px',
    outline: 'none',
    marginRight: '10px'
  },
  button: {
    padding: '12px 25px',
    backgroundColor: '#075e54',
    color: 'white',
    border: 'none',
    borderRadius: '25px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s'
  },
  debug: {
    padding: '10px',
    textAlign: 'center',
    backgroundColor: '#f9f9f9',
    color: '#999',
    borderTop: '1px solid #e0e0e0',
    fontSize: '12px'
  }
};