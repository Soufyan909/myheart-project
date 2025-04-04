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
  Chip,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Card,
  CardContent,
  IconButton,
  Stack,
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  People,
  CalendarToday,
  Assignment,
  Notifications,
  Analytics,
  Chat,
  Emergency,
  Search,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocalHospital,
  Description,
  Assessment,
  Timeline
} from '@mui/icons-material';
import axios from '../../utils/axios';
import { useAuth } from '../../contexts/AuthContext';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [medicalReports, setMedicalReports] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [newReport, setNewReport] = useState({
    patientId: '',
    diagnosis: '',
    prescription: '',
    notes: ''
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [patientsRes, appointmentsRes, reportsRes, notificationsRes] = await Promise.all([
        axios.get('/api/doctors/patients'),
        axios.get('/api/appointments/doctor'),
        axios.get('/api/medical-reports/doctor'),
        axios.get('/api/notifications/doctor')
      ]);

      setPatients(patientsRes.data);
      setAppointments(appointmentsRes.data);
      setMedicalReports(reportsRes.data);
      setNotifications(notificationsRes.data);
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

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleCreateReport = (patient) => {
    setSelectedPatient(patient);
    setNewReport({ ...newReport, patientId: patient._id });
    setReportDialogOpen(true);
  };

  const handleReportSubmit = async () => {
    try {
      await axios.post('/api/medical-reports', newReport);
      fetchDashboardData();
      setReportDialogOpen(false);
      setNewReport({ patientId: '', diagnosis: '', prescription: '', notes: '' });
    } catch (error) {
      console.error('Error creating report:', error);
      setError('Failed to create medical report. Please try again.');
    }
  };

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderPatientManagement = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Patient Management</Typography>
            <TextField
              size="small"
              placeholder="Search patients..."
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Box>
          <List>
            {filteredPatients.map((patient) => (
              <ListItem
                key={patient._id}
                secondaryAction={
                  <Stack direction="row" spacing={1}>
                    <IconButton onClick={() => handleCreateReport(patient)}>
                      <AddIcon />
                    </IconButton>
                    <IconButton>
                      <EditIcon />
                    </IconButton>
                  </Stack>
                }
              >
                <ListItemAvatar>
                  <Avatar>{patient.name[0]}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={patient.name}
                  secondary={patient.email}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Grid>
    </Grid>
  );

  const renderAppointments = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Appointments</Typography>
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
                  primary={`Appointment with ${appointment.patientName}`}
                  secondary={`Date: ${new Date(appointment.date).toLocaleDateString()} | Time: ${new Date(appointment.date).toLocaleTimeString()}`}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Grid>
    </Grid>
  );

  const renderMedicalReports = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Medical Reports</Typography>
          <List>
            {medicalReports.map((report) => (
              <ListItem
                key={report._id}
                secondaryAction={
                  <Stack direction="row" spacing={1}>
                    <IconButton>
                      <EditIcon />
                    </IconButton>
                    <IconButton>
                      <DeleteIcon />
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
                  primary={`Report for ${report.patientName}`}
                  secondary={`Diagnosis: ${report.diagnosis} | Date: ${new Date(report.createdAt).toLocaleDateString()}`}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Grid>
    </Grid>
  );

  const renderAnalytics = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Patient Overview
            </Typography>
            <Typography variant="h3">{patients.length}</Typography>
            <Typography color="textSecondary">Total Patients</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Appointments Today
            </Typography>
            <Typography variant="h3">
              {appointments.filter(app => 
                new Date(app.date).toDateString() === new Date().toDateString()
              ).length}
            </Typography>
            <Typography color="textSecondary">Scheduled Appointments</Typography>
          </CardContent>
        </Card>
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
              Welcome, Dr. {user?.name}
            </Typography>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab icon={<People />} label="Patients" />
              <Tab icon={<CalendarToday />} label="Appointments" />
              <Tab icon={<Assignment />} label="Medical Reports" />
              <Tab icon={<Analytics />} label="Analytics" />
              <Tab icon={<Notifications />} label="Notifications" />
            </Tabs>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          {tabValue === 0 && renderPatientManagement()}
          {tabValue === 1 && renderAppointments()}
          {tabValue === 2 && renderMedicalReports()}
          {tabValue === 3 && renderAnalytics()}
          {tabValue === 4 && renderNotifications()}
        </Grid>
      </Grid>

      <Dialog open={reportDialogOpen} onClose={() => setReportDialogOpen(false)}>
        <DialogTitle>Create Medical Report</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Diagnosis"
            value={newReport.diagnosis}
            onChange={(e) => setNewReport({ ...newReport, diagnosis: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Prescription"
            value={newReport.prescription}
            onChange={(e) => setNewReport({ ...newReport, prescription: e.target.value })}
            margin="normal"
            multiline
            rows={4}
          />
          <TextField
            fullWidth
            label="Notes"
            value={newReport.notes}
            onChange={(e) => setNewReport({ ...newReport, notes: e.target.value })}
            margin="normal"
            multiline
            rows={4}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReportDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleReportSubmit} variant="contained" color="primary">
            Create Report
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DoctorDashboard; 