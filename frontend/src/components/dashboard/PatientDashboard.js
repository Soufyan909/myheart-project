import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Button,
  Card,
  CardContent,
  IconButton,
  Stack,
  Divider,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tabs,
  Tab
} from '@mui/material';
import {
  Person,
  CalendarToday,
  Assignment,
  Notifications,
  LocalHospital,
  Description,
  Payment,
  Timeline,
  Emergency,
  Chat,
  Add as AddIcon,
  Download as DownloadIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import axios from '../../utils/axios';
import { useAuth } from '../../contexts/AuthContext';

const PatientDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [appointments, setAppointments] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [billingHistory, setBillingHistory] = useState([]);
  const [appointmentDialogOpen, setAppointmentDialogOpen] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    doctorId: '',
    date: '',
    time: '',
    reason: ''
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [
        appointmentsRes,
        recordsRes,
        prescriptionsRes,
        notificationsRes,
        billingRes
      ] = await Promise.all([
        axios.get('/api/appointments/patient'),
        axios.get('/api/medical-records/patient'),
        axios.get('/api/prescriptions/patient'),
        axios.get('/api/notifications/patient'),
        axios.get('/api/billing/patient')
      ]);

      setAppointments(appointmentsRes.data);
      setMedicalRecords(recordsRes.data);
      setPrescriptions(prescriptionsRes.data);
      setNotifications(notificationsRes.data);
      setBillingHistory(billingRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleNewAppointment = () => {
    setAppointmentDialogOpen(true);
  };

  const handleAppointmentSubmit = async () => {
    try {
      await axios.post('/api/appointments', newAppointment);
      fetchDashboardData();
      setAppointmentDialogOpen(false);
      setNewAppointment({ doctorId: '', date: '', time: '', reason: '' });
    } catch (error) {
      console.error('Error creating appointment:', error);
      setError('Failed to create appointment. Please try again.');
    }
  };

  const renderAppointments = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Appointments</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleNewAppointment}
            >
              New Appointment
            </Button>
          </Box>
          <List>
            {appointments.map((appointment) => (
              <ListItem
                key={appointment._id}
                secondaryAction={
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="outlined"
                      size="small"
                      color="primary"
                    >
                      Reschedule
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      color="error"
                    >
                      Cancel
                    </Button>
                  </Stack>
                }
              >
                <ListItemAvatar>
                  <Avatar>
                    <CalendarToday />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={`Appointment with Dr. ${appointment.doctorName}`}
                  secondary={`Date: ${new Date(appointment.date).toLocaleDateString()} | Time: ${new Date(appointment.date).toLocaleTimeString()}`}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Grid>
    </Grid>
  );

  const renderMedicalRecords = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Medical Records</Typography>
          <List>
            {medicalRecords.map((record) => (
              <ListItem
                key={record._id}
                secondaryAction={
                  <Stack direction="row" spacing={1}>
                    <IconButton>
                      <DownloadIcon />
                    </IconButton>
                  </Stack>
                }
              >
                <ListItemAvatar>
                  <Avatar>
                    <Description />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={`Medical Report from Dr. ${record.doctorName}`}
                  secondary={`Diagnosis: ${record.diagnosis} | Date: ${new Date(record.date).toLocaleDateString()}`}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Grid>
    </Grid>
  );

  const renderPrescriptions = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Prescriptions</Typography>
          <List>
            {prescriptions.map((prescription) => (
              <ListItem
                key={prescription._id}
                secondaryAction={
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="outlined"
                      size="small"
                      color="primary"
                    >
                      Request Refill
                    </Button>
                  </Stack>
                }
              >
                <ListItemAvatar>
                  <Avatar>
                    <LocalHospital />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={prescription.medication}
                  secondary={`Prescribed by Dr. ${prescription.doctorName} | Dosage: ${prescription.dosage}`}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Grid>
    </Grid>
  );

  const renderBilling = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Billing History</Typography>
          <List>
            {billingHistory.map((bill) => (
              <ListItem
                key={bill._id}
                secondaryAction={
                  <Stack direction="row" spacing={1}>
                    <IconButton>
                      <DownloadIcon />
                    </IconButton>
                  </Stack>
                }
              >
                <ListItemAvatar>
                  <Avatar>
                    <Payment />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={`Invoice #${bill.invoiceNumber}`}
                  secondary={`Amount: $${bill.amount} | Date: ${new Date(bill.date).toLocaleDateString()}`}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Grid>
    </Grid>
  );

  const renderNotifications = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Notifications</Typography>
          <List>
            {notifications.map((notification) => (
              <ListItem key={notification._id}>
                <ListItemAvatar>
                  <Avatar>
                    <Notifications />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={notification.title}
                  secondary={notification.message}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Grid>
    </Grid>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h4" gutterBottom>
              Welcome, {user?.name}
            </Typography>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab icon={<CalendarToday />} label="Appointments" />
              <Tab icon={<Assignment />} label="Medical Records" />
              <Tab icon={<LocalHospital />} label="Prescriptions" />
              <Tab icon={<Payment />} label="Billing" />
              <Tab icon={<Notifications />} label="Notifications" />
            </Tabs>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          {tabValue === 0 && renderAppointments()}
          {tabValue === 1 && renderMedicalRecords()}
          {tabValue === 2 && renderPrescriptions()}
          {tabValue === 3 && renderBilling()}
          {tabValue === 4 && renderNotifications()}
        </Grid>
      </Grid>

      <Dialog open={appointmentDialogOpen} onClose={() => setAppointmentDialogOpen(false)}>
        <DialogTitle>Schedule New Appointment</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Doctor"
            value={newAppointment.doctorId}
            onChange={(e) => setNewAppointment({ ...newAppointment, doctorId: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Date"
            type="date"
            value={newAppointment.date}
            onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="Time"
            type="time"
            value={newAppointment.time}
            onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="Reason"
            value={newAppointment.reason}
            onChange={(e) => setNewAppointment({ ...newAppointment, reason: e.target.value })}
            margin="normal"
            multiline
            rows={4}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAppointmentDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAppointmentSubmit} variant="contained" color="primary">
            Schedule Appointment
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PatientDashboard; 