import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import {
  Description,
  CalendarToday,
  LocalHospital,
  Person,
  Attachment,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const ViewMedicalRecords = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    fetchMedicalRecords();
  }, []);

  const fetchMedicalRecords = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/medical-records`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch medical records');
      }

      const data = await response.json();
      setRecords(data);
    } catch (error) {
      console.error('Error fetching medical records:', error);
      setError('Failed to load medical records. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (record) => {
    setSelectedRecord(record);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRecord(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'primary';
      case 'completed':
        return 'success';
      case 'requires_follow_up':
        return 'warning';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Medical Records
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                {user.role === 'doctor' && <TableCell>Patient</TableCell>}
                {user.role === 'patient' && <TableCell>Doctor</TableCell>}
                <TableCell>Diagnosis</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {records.map((record) => (
                <TableRow key={record._id}>
                  <TableCell>
                    {new Date(record.date).toLocaleDateString()}
                  </TableCell>
                  {user.role === 'doctor' && (
                    <TableCell>{record.patientId.name}</TableCell>
                  )}
                  {user.role === 'patient' && (
                    <TableCell>Dr. {record.doctorId.name}</TableCell>
                  )}
                  <TableCell>{record.diagnosis}</TableCell>
                  <TableCell>
                    <Chip
                      label={record.status}
                      color={getStatusColor(record.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleViewDetails(record)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Details Dialog */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
        >
          {selectedRecord && (
            <>
              <DialogTitle>
                Medical Record Details
                <Typography variant="subtitle2" color="textSecondary">
                  {new Date(selectedRecord.date).toLocaleDateString()}
                </Typography>
              </DialogTitle>
              <DialogContent dividers>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    <Person sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Patient: {selectedRecord.patientId.name}
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    <LocalHospital sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Doctor: Dr. {selectedRecord.doctorId.name}
                  </Typography>
                </Box>

                <Typography variant="h6" gutterBottom>
                  <Description sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Diagnosis
                </Typography>
                <Typography paragraph>{selectedRecord.diagnosis}</Typography>

                <Typography variant="h6" gutterBottom>
                  Symptoms
                </Typography>
                <Box sx={{ mb: 2 }}>
                  {selectedRecord.symptoms.map((symptom, index) => (
                    <Chip
                      key={index}
                      label={symptom}
                      sx={{ mr: 1, mb: 1 }}
                      size="small"
                    />
                  ))}
                </Box>

                {selectedRecord.treatment && (
                  <>
                    <Typography variant="h6" gutterBottom>
                      Treatment
                    </Typography>
                    <Typography paragraph>{selectedRecord.treatment}</Typography>
                  </>
                )}

                {selectedRecord.prescription && (
                  <>
                    <Typography variant="h6" gutterBottom>
                      Prescription
                    </Typography>
                    <Typography paragraph>{selectedRecord.prescription}</Typography>
                  </>
                )}

                {selectedRecord.notes && (
                  <>
                    <Typography variant="h6" gutterBottom>
                      Notes
                    </Typography>
                    <Typography paragraph>{selectedRecord.notes}</Typography>
                  </>
                )}

                {selectedRecord.followUpDate && (
                  <Typography variant="subtitle1" gutterBottom>
                    <CalendarToday sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Follow-up Date:{' '}
                    {new Date(selectedRecord.followUpDate).toLocaleDateString()}
                  </Typography>
                )}

                {selectedRecord.attachments?.length > 0 && (
                  <>
                    <Typography variant="h6" gutterBottom>
                      <Attachment sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Attachments
                    </Typography>
                    <Box>
                      {selectedRecord.attachments.map((attachment, index) => (
                        <Button
                          key={index}
                          variant="outlined"
                          size="small"
                          sx={{ mr: 1, mb: 1 }}
                          href={`${process.env.REACT_APP_API_URL}/${attachment.path}`}
                          target="_blank"
                        >
                          {attachment.filename}
                        </Button>
                      ))}
                    </Box>
                  </>
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog}>Close</Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Paper>
    </Container>
  );
};

export default ViewMedicalRecords; 