import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  CircularProgress
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { notificationService } from '../../services/NotificationService';
import axios from 'axios';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [appointmentType, setAppointmentType] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
  }, [user]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3002/api/appointments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError('Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3001/api/auth/doctors', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setError('Failed to fetch doctors');
    }
  };

  const handleCreateAppointment = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const appointmentData = {
        doctorId: selectedDoctor,
        date: appointmentDate,
        time: appointmentTime,
        type: appointmentType,
        notes: notes
      };

      const response = await axios.post('http://localhost:3002/api/appointments', appointmentData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setAppointments([...appointments, response.data]);
      setOpenDialog(false);
      resetForm();
      
      // Show notification for new appointment
      notificationService.showAppointmentNotification(response.data);
    } catch (error) {
      console.error('Error creating appointment:', error);
      setError('Failed to create appointment');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedDoctor('');
    setAppointmentDate('');
    setAppointmentTime('');
    setAppointmentType('');
    setNotes('');
  };

  const handleCancelAppointment = async (appointmentId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3002/api/appointments/${appointmentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setAppointments(appointments.filter(app => app._id !== appointmentId));
    } catch (error) {
      console.error('Error canceling appointment:', error);
      setError('Failed to cancel appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Appointments</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          New Appointment
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {appointments.map((appointment) => (
            <Grid item xs={12} md={6} key={appointment._id}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Appointment with {appointment.doctorName}
                </Typography>
                <Typography color="text.secondary">
                  Date: {new Date(appointment.date).toLocaleDateString()}
                </Typography>
                <Typography color="text.secondary">
                  Time: {appointment.time}
                </Typography>
                <Typography color="text.secondary">
                  Type: {appointment.type}
                </Typography>
                {appointment.notes && (
                  <Typography color="text.secondary">
                    Notes: {appointment.notes}
                  </Typography>
                )}
                <Typography
                  sx={{
                    color: appointment.status === 'scheduled' ? 'success.main' : 'error.main',
                    mt: 1
                  }}
                >
                  Status: {appointment.status}
                </Typography>
                {appointment.status === 'scheduled' && (
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleCancelAppointment(appointment._id)}
                    sx={{ mt: 2 }}
                  >
                    Cancel Appointment
                  </Button>
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Appointment</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Select Doctor</InputLabel>
              <Select
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                label="Select Doctor"
              >
                {doctors.map((doctor) => (
                  <MenuItem key={doctor._id} value={doctor._id}>
                    {doctor.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              type="date"
              label="Appointment Date"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              type="time"
              label="Appointment Time"
              value={appointmentTime}
              onChange={(e) => setAppointmentTime(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Appointment Type</InputLabel>
              <Select
                value={appointmentType}
                onChange={(e) => setAppointmentType(e.target.value)}
                label="Appointment Type"
              >
                <MenuItem value="consultation">Consultation</MenuItem>
                <MenuItem value="follow-up">Follow-up</MenuItem>
                <MenuItem value="emergency">Emergency</MenuItem>
                <MenuItem value="routine">Routine Check-up</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleCreateAppointment}
            disabled={!selectedDoctor || !appointmentDate || !appointmentTime || !appointmentType}
          >
            Create Appointment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Appointments; 