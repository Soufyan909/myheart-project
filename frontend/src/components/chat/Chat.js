import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  List,
  ListItem,
  Divider,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  Fade,
  Tooltip,
  Badge
} from '@mui/material';
import {
  Send as SendIcon,
  Mic as MicIcon,
  Stop as StopIcon,
  AttachFile as AttachFileIcon,
  Check as CheckIcon,
  DoneAll as DoneAllIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { notificationService } from '../../services/NotificationService';
import io from 'socket.io-client';
import axios from 'axios';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [socket, setSocket] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();
  const [isTyping, setIsTyping] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (user) {
      const newSocket = io(process.env.REACT_APP_CHAT_URL, {
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        query: {
          userId: user.userId,
          role: user.role
        }
      });

      newSocket.on('connect', () => {
        console.log('Connected to chat server');
        setError(null);
      });

      newSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        setError('Failed to connect to chat server');
      });

      newSocket.on('message', (message) => {
        console.log('Received message:', message);
        setMessages(prev => [...prev, message]);
        if (message.senderId !== user.userId) {
          notificationService.showMessageNotification(message);
        }
      });

      newSocket.on('typing', (data) => {
        if (data.userId !== user.userId) {
          setIsTyping(true);
          setTimeout(() => setIsTyping(false), 3000);
        }
      });

      setSocket(newSocket);

      // Fetch existing messages when component mounts
      if (selectedAppointment) {
        fetchMessages(selectedAppointment);
      }

      return () => {
        newSocket.close();
      };
    }
  }, [user, selectedAppointment]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3002/api/appointments', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAppointments(response.data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setError('Failed to fetch appointments');
      }
    };

    if (user) {
      fetchAppointments();
    }
  }, [user]);

  const fetchMessages = async (appointmentId) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_CHAT_URL}/api/messages/${appointmentId}`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Failed to fetch messages');
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedAppointment || !socket) {
      setError('Please select an appointment and enter a message');
      return;
    }

    const message = {
      appointmentId: selectedAppointment,
      senderId: user.userId,
      senderName: user.name,
      content: newMessage.trim(),
      timestamp: new Date()
    };

    try {
      socket.emit('message', message);
      setNewMessage('');
      setError(null);
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again.');
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
          setAudioChunks(chunks);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' });
        await uploadAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setError('Failed to access microphone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const uploadAudio = async (audioBlob) => {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob);
      formData.append('appointmentId', selectedAppointment);
      formData.append('senderId', user._id);
      formData.append('senderName', user.name);

      const response = await axios.post('http://localhost:3003/api/chat/upload-audio', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const messageData = {
        text: 'Audio message',
        senderId: user._id,
        senderName: user.name,
        appointmentId: selectedAppointment,
        audioUrl: response.data.audioUrl,
        timestamp: new Date().toISOString()
      };

      socket.emit('message', messageData);
    } catch (error) {
      console.error('Error uploading audio:', error);
      setError('Failed to upload audio message');
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('appointmentId', selectedAppointment);
      formData.append('senderId', user._id);
      formData.append('senderName', user.name);

      const response = await axios.post('http://localhost:3003/api/chat/upload-file', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const messageData = {
        text: `File: ${file.name}`,
        senderId: user._id,
        senderName: user.name,
        appointmentId: selectedAppointment,
        fileUrl: response.data.fileUrl,
        fileName: file.name,
        timestamp: new Date().toISOString()
      };

      socket.emit('message', messageData);
    } catch (error) {
      console.error('Error uploading file:', error);
      setError('Failed to upload file');
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleTyping = () => {
    if (socket && selectedAppointment) {
      socket.emit('typing', {
        userId: user.userId,
        appointmentId: selectedAppointment
      });
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getMessageStatus = (message) => {
    if (message.senderId !== user._id) return null;
    return message.status === 'read' ? <DoneAllIcon color="primary" fontSize="small" /> :
           message.status === 'delivered' ? <DoneAllIcon fontSize="small" /> :
           <CheckIcon fontSize="small" />;
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Chat
        </Typography>
        <FormControl fullWidth>
          <InputLabel>Select Appointment</InputLabel>
          <Select
            value={selectedAppointment}
            onChange={(e) => setSelectedAppointment(e.target.value)}
            label="Select Appointment"
            disabled={loading}
          >
            {appointments.map((appointment) => (
              <MenuItem key={appointment._id} value={appointment._id}>
                {new Date(appointment.date).toLocaleDateString()} - {appointment.time}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ flex: 1, overflow: 'auto', mb: 2, p: 2, bgcolor: '#f5f5f5' }}>
        <List>
          {messages.map((message, index) => (
            <React.Fragment key={index}>
              <Fade in={true}>
                <ListItem
                  sx={{
                    flexDirection: 'column',
                    alignItems: message.senderId === user._id ? 'flex-end' : 'flex-start',
                    mb: 1
                  }}
                >
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>
                    {message.senderName}
                  </Typography>
                  {message.audioUrl ? (
                    <Box sx={{ 
                      bgcolor: message.senderId === user._id ? 'primary.main' : 'white',
                      color: message.senderId === user._id ? 'white' : 'text.primary',
                      p: 1,
                      borderRadius: 2,
                      maxWidth: '70%',
                      boxShadow: 1
                    }}>
                      <audio controls src={message.audioUrl} />
                    </Box>
                  ) : message.fileUrl ? (
                    <Button
                      variant="contained"
                      href={message.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ 
                        bgcolor: message.senderId === user._id ? 'primary.main' : 'white',
                        color: message.senderId === user._id ? 'white' : 'text.primary',
                        '&:hover': {
                          bgcolor: message.senderId === user._id ? 'primary.dark' : 'grey.100'
                        }
                      }}
                    >
                      Download {message.fileName}
                    </Button>
                  ) : (
                    <Box sx={{ 
                      bgcolor: message.senderId === user._id ? 'primary.main' : 'white',
                      color: message.senderId === user._id ? 'white' : 'text.primary',
                      p: 1.5,
                      borderRadius: 2,
                      maxWidth: '70%',
                      boxShadow: 1
                    }}>
                      <Typography variant="body2">{message.text}</Typography>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'flex-end',
                        mt: 0.5,
                        gap: 0.5
                      }}>
                        <Typography variant="caption" sx={{ opacity: 0.7 }}>
                          {formatTime(message.timestamp)}
                        </Typography>
                        {getMessageStatus(message)}
                      </Box>
                    </Box>
                  )}
                </ListItem>
              </Fade>
              <Divider />
            </React.Fragment>
          ))}
          {isTyping && (
            <ListItem>
              <Typography variant="caption" color="text.secondary">
                Someone is typing...
              </Typography>
            </ListItem>
          )}
          <div ref={messagesEndRef} />
        </List>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Grid container spacing={1} alignItems="center">
          <Grid item xs>
            <TextField
              fullWidth
              multiline
              maxRows={4}
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
                handleTyping();
              }}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              disabled={!selectedAppointment || loading}
            />
          </Grid>
          <Grid item>
            <input
              type="file"
              id="file-upload"
              style={{ display: 'none' }}
              onChange={handleFileUpload}
              disabled={!selectedAppointment || loading}
            />
            <label htmlFor="file-upload">
              <Tooltip title="Attach file">
                <IconButton component="span" disabled={!selectedAppointment || loading}>
                  <AttachFileIcon />
                </IconButton>
              </Tooltip>
            </label>
          </Grid>
          <Grid item>
            <Tooltip title={isRecording ? "Stop Recording" : "Record Audio"}>
              <IconButton
                onClick={isRecording ? stopRecording : startRecording}
                color={isRecording ? 'error' : 'primary'}
                disabled={!selectedAppointment || loading}
              >
                {isRecording ? <StopIcon /> : <MicIcon />}
              </IconButton>
            </Tooltip>
          </Grid>
          <Grid item>
            <Tooltip title="Send message">
              <IconButton
                color="primary"
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || !selectedAppointment || loading}
              >
                <SendIcon />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Chat; 