import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Alert,
  Card,
  CardContent,
  CardActions,
  Avatar,
  Snackbar,
  CircularProgress
} from '@mui/material';
import { LocalHospital } from '@mui/icons-material';
import axios from 'axios';

const NewAppointment = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    doctorId: '',
    date: '',
    time: '',
    reason: ''
  });

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Token:', token);
        
        const apiUrl = `${process.env.REACT_APP_API_URL}/api/auth/doctors`;
        console.log('Fetching doctors from:', apiUrl);

        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        console.log('Doctors API Response:', response.data);
        
        if (Array.isArray(response.data)) {
          setDoctors(response.data);
          console.log('Doctors set in state:', response.data);
        } else {
          console.error('Unexpected response format:', response.data);
          setError('Invalid data format received from server');
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching doctors:', err.response || err);
        setError(err.response?.data?.message || 'Failed to load doctors. Please try again later.');
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.doctorId) {
      setError('Please select a doctor first');
      return;
    }
    setSubmitting(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));
      
      // Combine date and time
      const dateTime = new Date(`${formData.date}T${formData.time}`);
      
      const appointmentData = {
        doctorId: formData.doctorId,
        patientId: user.id,
        dateTime: dateTime.toISOString(),
        reason: formData.reason,
        type: 'consultation'
      };

      console.log('Sending appointment data:', appointmentData);

      const response = await axios.post(
        `${process.env.REACT_APP_APPOINTMENTS_URL || 'http://localhost:3002'}/api/appointments`,
        appointmentData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Appointment created:', response.data);
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      console.error('Error creating appointment:', err.response || err);
      setError(err.response?.data?.message || 'Failed to create appointment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDoctorSelect = (doctorId) => {
    setFormData(prev => ({
      ...prev,
      doctorId
    }));
  };

  if (loading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Book New Appointment
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Choose a Doctor
            </Typography>
            <Grid container spacing={3}>
              {doctors.length > 0 ? (
                doctors.map((doctor) => (
                  <Grid item xs={12} sm={6} md={4} key={doctor._id}>
                    <Card 
                      sx={{ 
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        cursor: 'pointer',
                        border: formData.doctorId === doctor._id ? '2px solid #1976d2' : 'none'
                      }}
                      onClick={() => handleDoctorSelect(doctor._id)}
                    >
                      <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                        <Avatar
                          sx={{
                            width: 80,
                            height: 80,
                            margin: '0 auto 16px',
                            bgcolor: formData.doctorId === doctor._id ? '#1976d2' : 'grey.400'
                          }}
                        >
                          <LocalHospital />
                        </Avatar>
                        <Typography variant="h6" gutterBottom>
                          Dr. {doctor.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {doctor.email}
                        </Typography>
                      </CardContent>
                      <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                        <Button
                          size="small"
                          variant={formData.doctorId === doctor._id ? "contained" : "outlined"}
                          onClick={() => handleDoctorSelect(doctor._id)}
                        >
                          {formData.doctorId === doctor._id ? "Selected" : "Select Doctor"}
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Alert severity="info">
                    No doctors are currently available. Please try again later.
                  </Alert>
                </Grid>
              )}
            </Grid>
          </Box>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Appointment Date"
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    min: new Date().toISOString().split('T')[0]
                  }}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Appointment Time"
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    step: 300 // 5 minutes
                  }}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Reason for Visit"
                  name="reason"
                  multiline
                  rows={4}
                  value={formData.reason}
                  onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={submitting || !formData.doctorId}
                  sx={{
                    mt: 1,
                    height: 48
                  }}
                >
                  {submitting ? <CircularProgress size={24} /> : 'Book Appointment'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>

      <Snackbar
        open={success}
        autoHideDuration={2000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Appointment booked successfully! Redirecting to dashboard...
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default NewAppointment; 