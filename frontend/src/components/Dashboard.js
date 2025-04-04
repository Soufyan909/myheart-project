import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Avatar,
  Chip,
  Stack,
  Tabs,
  Tab,
  ListItemAvatar,
  IconButton,
  useTheme,
  alpha,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import {
  CalendarToday,
  Assignment,
  ExitToApp,
  Schedule,
  MedicalServices,
  Email,
  LocalHospital,
  CheckCircle,
  Pending,
  Cancel,
  Person,
  AccessTime,
  Add as AddIcon,
  Description,
  Notifications,
  Settings as SettingsIcon,
  Search,
  Chat as ChatIcon
} from '@mui/icons-material';
import axios from '../utils/axios';
import { useAuth } from '../contexts/AuthContext';
import { appointmentsService } from '../services/appointments';
import { Link as RouterLink } from 'react-router-dom';

const Dashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [doctors, setDoctors] = useState({});
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_APPOINTMENTS_URL}/api/appointments`);
      console.log('Appointments response:', response.data);
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError('Failed to fetch appointments. Please try again later.');
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/doctors`);
      console.log('Doctors response:', response.data);
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setError('Failed to fetch doctors. Please try again later.');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([fetchAppointments(), fetchDoctors()]);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNewAppointment = () => {
    navigate('/appointments/new');
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'scheduled':
        return <Pending color="primary" />;
      case 'completed':
        return <CheckCircle color="success" />;
      case 'cancelled':
        return <Cancel color="error" />;
      default:
        return <Pending color="primary" />;
    }
  };

  const filteredAppointments = useMemo(() => {
    return appointments
      .filter(appointment => {
        if (tabValue === 0) return true; // All appointments except cancelled
        if (tabValue === 1) return appointment.status === 'scheduled';
        if (tabValue === 2) return appointment.status === 'completed';
        if (tabValue === 3) return appointment.status === 'cancelled';
        return true;
      })
      .filter(appointment => appointment.status !== 'cancelled' || tabValue === 3)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [appointments, tabValue]);

  const getDoctorName = (doctorId) => {
    const doctor = doctors.find(d => d._id === doctorId);
    return doctor ? doctor.name : 'Unknown Doctor';
  };

  const getAppointmentStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'primary';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCancelClick = (appointment) => {
    setSelectedAppointment(appointment);
    setCancelDialogOpen(true);
  };

  const handleCancelConfirm = async () => {
    try {
      await axios.put(
        `${process.env.REACT_APP_APPOINTMENTS_URL}/api/appointments/${selectedAppointment._id}/cancel`
      );
      fetchAppointments();
      setCancelDialogOpen(false);
      setSelectedAppointment(null);
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      setError('Failed to cancel appointment. Please try again later.');
    }
  };

  const handleCancelClose = () => {
    setCancelDialogOpen(false);
    setSelectedAppointment(null);
  };

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
        sx={{ 
          background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
        }}
      >
        <CircularProgress size={60} thickness={4} sx={{ color: 'white' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ borderRadius: 2, boxShadow: 3 }}>{error}</Alert>
      </Container>
    );
  }

  const upcomingAppointments = appointments.filter(
    app => new Date(app.date) > new Date() && app.status.toLowerCase() === 'scheduled'
  );

  const pastAppointments = appointments.filter(
    app => new Date(app.date) <= new Date() || app.status.toLowerCase() !== 'scheduled'
  );

  const renderPatientDashboard = () => (
    <>
      {/* Today's Appointments Section */}
      <Grid item xs={12}>
        <Card sx={{ mb: 3, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Today's Appointments
            </Typography>
            {upcomingAppointments.filter(app => 
              new Date(app.date).toDateString() === new Date().toDateString()
            ).length > 0 ? (
              <List>
                {upcomingAppointments
                  .filter(app => new Date(app.date).toDateString() === new Date().toDateString())
                  .map(appointment => (
                    <ListItem key={appointment._id}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                          <LocalHospital />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={`Dr. ${getDoctorName(appointment.doctorId)}`}
                        secondary={`${appointment.time} - ${appointment.type}`}
                      />
                      <Chip
                        label={appointment.status}
                        color={getAppointmentStatusColor(appointment.status)}
                        size="small"
                      />
                    </ListItem>
                  ))}
              </List>
            ) : (
              <Typography color="text.secondary">No appointments scheduled for today</Typography>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Recent Medical Records Section */}
      <Grid item xs={12} md={6}>
        <Card sx={{ height: '100%', boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Recent Medical Records
            </Typography>
            {medicalRecords.length > 0 ? (
              <List>
                {medicalRecords.slice(0, 3).map(record => (
                  <ListItem key={record._id}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: theme.palette.secondary.main }}>
                        <Assignment />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={record.diagnosis}
                      secondary={`Dr. ${getDoctorName(record.doctorId)} - ${new Date(record.date).toLocaleDateString()}`}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography color="text.secondary">No recent medical records</Typography>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Health Metrics Section */}
      <Grid item xs={12} md={6}>
        <Card sx={{ height: '100%', boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Health Metrics
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h4" color="primary">
                    {medicalRecords.length > 0 ? medicalRecords[0].vitals?.bloodPressure || '--' : '--'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">Blood Pressure</Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h4" color="primary">
                    {medicalRecords.length > 0 ? medicalRecords[0].vitals?.heartRate || '--' : '--'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">Heart Rate</Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </>
  );

  const renderDoctorDashboard = () => (
    <>
      {/* Today's Schedule Section */}
      <Grid item xs={12}>
        <Card sx={{ mb: 3, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Today's Schedule
            </Typography>
            {appointments.filter(app => 
              new Date(app.date).toDateString() === new Date().toDateString() &&
              app.doctorId === user._id
            ).length > 0 ? (
              <List>
                {appointments
                  .filter(app => 
                    new Date(app.date).toDateString() === new Date().toDateString() &&
                    app.doctorId === user._id
                  )
                  .sort((a, b) => new Date(a.time) - new Date(b.time))
                  .map(appointment => (
                    <ListItem key={appointment._id}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                          <Person />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={`Patient: ${appointment.patientName}`}
                        secondary={`${appointment.time} - ${appointment.type}`}
                      />
                      <Chip
                        label={appointment.status}
                        color={getAppointmentStatusColor(appointment.status)}
                        size="small"
                      />
                    </ListItem>
                  ))}
              </List>
            ) : (
              <Typography color="text.secondary">No appointments scheduled for today</Typography>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Patient Queue Section */}
      <Grid item xs={12} md={6}>
        <Card sx={{ height: '100%', boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Patient Queue
            </Typography>
            {appointments.filter(app => 
              app.status === 'scheduled' &&
              app.doctorId === user._id &&
              new Date(app.date) >= new Date()
            ).length > 0 ? (
              <List>
                {appointments
                  .filter(app => 
                    app.status === 'scheduled' &&
                    app.doctorId === user._id &&
                    new Date(app.date) >= new Date()
                  )
                  .sort((a, b) => new Date(a.date) - new Date(b.date))
                  .slice(0, 5)
                  .map(appointment => (
                    <ListItem key={appointment._id}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: theme.palette.secondary.main }}>
                          <Person />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={appointment.patientName}
                        secondary={`${new Date(appointment.date).toLocaleDateString()} - ${appointment.time}`}
                      />
                    </ListItem>
                  ))}
              </List>
            ) : (
              <Typography color="text.secondary">No upcoming appointments</Typography>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Statistics Section */}
      <Grid item xs={12} md={6}>
        <Card sx={{ height: '100%', boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Statistics
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h4" color="primary">
                    {appointments.filter(app => 
                      app.doctorId === user._id &&
                      new Date(app.date).toDateString() === new Date().toDateString()
                    ).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">Today's Patients</Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h4" color="primary">
                    {appointments.filter(app => 
                      app.doctorId === user._id &&
                      app.status === 'completed'
                    ).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">Completed Appointments</Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </>
  );

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: alpha(theme.palette.background.default, 0.95),
      py: 4
    }}>
      <Container maxWidth="xl">
        {/* Header Section */}
        <Box sx={{ 
          mb: 4,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
          background: 'white',
          p: 3,
          borderRadius: 2,
          boxShadow: 2
        }}>
            <Box>
            <Typography variant="h4" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
              Welcome back, {user?.name}!
              </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Here's what's happening with your appointments
              </Typography>
            </Box>
          <Stack direction="row" spacing={2}>
            <IconButton>
              <Search />
            </IconButton>
            <IconButton>
              <Notifications />
            </IconButton>
            <IconButton
              component={RouterLink}
              to="/settings"
              color="inherit"
              title="Settings"
            >
              <SettingsIcon />
            </IconButton>
            <Button
              variant="outlined"
              color="inherit"
              onClick={handleLogout}
              startIcon={<ExitToApp />}
            >
              Logout
            </Button>
          </Stack>
        </Box>

        <Grid container spacing={3}>
          {/* Quick Stats */}
          <Grid item xs={12} md={3}>
            <Card sx={{ 
              height: '100%',
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              color: 'white'
            }}>
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ color: 'white', fontWeight: 'bold' }}>
                Upcoming Appointments
              </Typography>
                <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'white' }}>
                  {upcomingAppointments.length}
                </Typography>
                <Typography variant="body2">
                  Next: {upcomingAppointments[0]?.date ? new Date(upcomingAppointments[0].date).toLocaleDateString() : 'None scheduled'}
                </Typography>
            </CardContent>
          </Card>
        </Grid>

          <Grid item xs={12} md={3}>
            <Card sx={{ 
              height: '100%',
              background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
              color: 'white'
            }}>
              <CardContent>
                <Typography variant="h5" gutterBottom sx={{ color: 'white', fontWeight: 'bold' }}>
                  Medical Records
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'white' }}>
                  {medicalRecords.length}
                </Typography>
                <Typography variant="body2">
                  Last updated: {medicalRecords[0]?.date ? new Date(medicalRecords[0].date).toLocaleDateString() : 'No records'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Role-specific Dashboard Sections */}
          {user?.role === 'patient' ? renderPatientDashboard() : renderDoctorDashboard()}

          {/* Main Content */}
          <Grid item xs={12} md={8}>
            <Card sx={{ height: '100%', boxShadow: 3 }}>
              <CardContent>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  mb: 3 
                }}>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    Appointments
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleNewAppointment}
                    sx={{ 
                      borderRadius: 2,
                      textTransform: 'none',
                      px: 3
                    }}
                  >
                    New Appointment
                  </Button>
                </Box>

                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  sx={{ 
                    borderBottom: 1, 
                    borderColor: 'divider',
                    mb: 3,
                    '& .MuiTab-root': {
                      textTransform: 'none',
                      fontWeight: 500
                    }
                  }}
                >
                  <Tab label="All" />
                  <Tab label="Scheduled" />
                  <Tab label="Completed" />
                  <Tab label="Cancelled" />
                </Tabs>

                {filteredAppointments.length === 0 ? (
                  <Box sx={{ 
                    textAlign: 'center', 
                    py: 4,
                    background: alpha(theme.palette.background.default, 0.5),
                    borderRadius: 2
                  }}>
                    <CalendarToday sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                    <Typography color="text.secondary">
                      No appointments found
                    </Typography>
                  </Box>
                ) : (
                  <List>
                    {filteredAppointments.map((appointment) => (
                      <ListItem
                        key={appointment._id}
                        sx={{
                          cursor: 'pointer',
                          '&:hover': {
                            bgcolor: 'action.hover',
                          },
                        }}
                        onClick={() => navigate(`/appointments/${appointment._id}`)}
                      >
                        <ListItemIcon>
                          {getStatusIcon(appointment.status)}
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                              {user.role === 'patient' 
                                ? `Dr. ${getDoctorName(appointment.doctorId)}`
                                : `Patient: ${appointment.patientName || 'Unknown Patient'}`}
                            </Typography>
                          }
                          secondary={
                            <>
                              <Typography variant="body2" color="text.secondary">
                                {formatDate(appointment.date)} at {appointment.time}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Type: {appointment.type}
                              </Typography>
                            </>
                          }
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <IconButton 
                            color="primary" 
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/chat/${appointment._id}`);
                            }}
                            title="Chat with doctor"
                          >
                            <ChatIcon />
                          </IconButton>
                          <Chip
                            label={appointment.status}
                            color={getAppointmentStatusColor(appointment.status)}
                            size="small"
                            sx={{ textTransform: 'capitalize' }}
                          />
                        </Box>
                      </ListItem>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              {/* Patient Profile Card */}
              <Card sx={{ boxShadow: 3 }}>
              <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      sx={{ 
                        width: 64, 
                        height: 64, 
                        mr: 2,
                        bgcolor: theme.palette.primary.main
                      }}
                    >
                      {user?.name?.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {user?.name}
                </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {user?.email}
                  </Typography>
                    </Box>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <Email color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Email" 
                        secondary={user?.email || 'Not provided'} 
                      />
                    </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <Person color="primary" />
                          </ListItemIcon>
                          <ListItemText
                        primary="Phone" 
                        secondary={user?.phone || 'Not provided'} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CalendarToday color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Date of Birth" 
                        secondary={user?.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'Not provided'} 
                          />
                        </ListItem>
                  </List>
                </CardContent>
              </Card>

              {/* Quick Actions Card */}
              <Card sx={{ boxShadow: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Quick Actions
                  </Typography>
                  <List>
                    <ListItem 
                      button 
                      onClick={handleNewAppointment}
                      sx={{ 
                        borderRadius: 1,
                        '&:hover': {
                          background: alpha(theme.palette.primary.main, 0.1)
                        }
                      }}
                    >
                      <ListItemIcon>
                        <CalendarToday color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="New Appointment" />
                    </ListItem>
                    {user?.role === 'patient' && (
                      <ListItem 
                        button 
                        onClick={() => navigate('/medical-records')}
                        sx={{ 
                          borderRadius: 1,
                          '&:hover': {
                            background: alpha(theme.palette.primary.main, 0.1)
                          }
                        }}
                      >
                        <ListItemIcon>
                          <Assignment color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="View Medical Records" />
                      </ListItem>
                    )}
                  </List>
              </CardContent>
            </Card>
            </Stack>
          </Grid>
        </Grid>

        {/* Cancel Confirmation Dialog */}
        <Dialog open={cancelDialogOpen} onClose={handleCancelClose}>
          <DialogTitle>Cancel Appointment</DialogTitle>
          <DialogContent>
            <Typography variant="body1" gutterBottom>
              Are you sure you want to cancel this appointment?
            </Typography>
            {selectedAppointment && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Date: {formatDate(selectedAppointment.date)}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  Time: {selectedAppointment.time}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  Doctor: Dr. {getDoctorName(selectedAppointment.doctorId)}
                </Typography>
              </Box>
            )}
            <TextField
              autoFocus
              margin="dense"
              label="Reason for cancellation"
              type="text"
              fullWidth
              multiline
              rows={3}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              variant="outlined"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelClose}>No, Keep Appointment</Button>
            <Button 
              onClick={handleCancelConfirm} 
              color="error"
              variant="contained"
              disabled={!cancelReason.trim()}
            >
              Yes, Cancel Appointment
            </Button>
          </DialogActions>
        </Dialog>
    </Container>
    </Box>
  );
};

export default Dashboard; 