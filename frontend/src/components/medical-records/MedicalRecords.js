import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Chip,
  MenuItem
} from '@mui/material';
import axios from 'axios';

const MedicalRecords = () => {
  const [records, setRecords] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    patientId: '',
    diagnosis: '',
    prescription: '',
    symptoms: '',
    treatment: '',
    visitDate: '',
    nextVisitDate: '',
    notes: ''
  });
  const [patients, setPatients] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchRecords();
    if (user.role === 'doctor') {
      fetchPatients();
    }
  }, [user.role]);

  const fetchRecords = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/records', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecords(response.data);
    } catch (error) {
      console.error('Error fetching medical records:', error);
    }
  };

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/auth/patients', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPatients(response.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:3000/api/records', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      handleClose();
      fetchRecords();
    } catch (error) {
      console.error('Error creating medical record:', error);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Medical Records
        </Typography>
        {user.role === 'doctor' && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpen}
            sx={{ mb: 3 }}
          >
            Add New Record
          </Button>
        )}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Visit Date</TableCell>
                <TableCell>Diagnosis</TableCell>
                <TableCell>Symptoms</TableCell>
                <TableCell>Treatment</TableCell>
                <TableCell>Prescription</TableCell>
                <TableCell>Next Visit</TableCell>
                <TableCell>Notes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {records.map((record) => (
                <TableRow key={record._id}>
                  <TableCell>{new Date(record.visitDate).toLocaleDateString()}</TableCell>
                  <TableCell>{record.diagnosis}</TableCell>
                  <TableCell>
                    {record.symptoms.map((symptom, index) => (
                      <Chip
                        key={index}
                        label={symptom}
                        size="small"
                        sx={{ mr: 0.5, mb: 0.5 }}
                      />
                    ))}
                  </TableCell>
                  <TableCell>{record.treatment}</TableCell>
                  <TableCell>{record.prescription}</TableCell>
                  <TableCell>
                    {record.nextVisitDate
                      ? new Date(record.nextVisitDate).toLocaleDateString()
                      : 'Not scheduled'}
                  </TableCell>
                  <TableCell>{record.notes}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogTitle>Add New Medical Record</DialogTitle>
          <DialogContent>
            <TextField
              select
              fullWidth
              label="Patient"
              name="patientId"
              value={formData.patientId}
              onChange={handleChange}
              margin="normal"
              required
            >
              {patients.map((patient) => (
                <MenuItem key={patient._id} value={patient._id}>
                  {patient.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              label="Diagnosis"
              name="diagnosis"
              value={formData.diagnosis}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Symptoms (comma-separated)"
              name="symptoms"
              value={formData.symptoms}
              onChange={handleChange}
              margin="normal"
              required
              helperText="Enter symptoms separated by commas"
            />
            <TextField
              fullWidth
              label="Treatment"
              name="treatment"
              value={formData.treatment}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Prescription"
              name="prescription"
              value={formData.prescription}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={3}
            />
            <TextField
              fullWidth
              label="Visit Date"
              name="visitDate"
              type="date"
              value={formData.visitDate}
              onChange={handleChange}
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Next Visit Date"
              name="nextVisitDate"
              type="date"
              value={formData.nextVisitDate}
              onChange={handleChange}
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={4}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained" color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default MedicalRecords; 