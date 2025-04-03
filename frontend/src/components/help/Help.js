import React from 'react';
import {
  Container,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Help as HelpIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  AccessTime as AccessTimeIcon,
  LocationOn as LocationIcon,
  QuestionAnswer as FAQIcon,
  Support as SupportIcon,
} from '@mui/icons-material';

const Help = () => {
  const faqs = [
    {
      question: 'How do I book an appointment?',
      answer: 'To book an appointment, log in to your account, click on "Appointments" in the navigation bar, and then click "New Appointment". Select your preferred doctor, date, and time, and provide any necessary details about your visit.',
    },
    {
      question: 'How can I view my medical records?',
      answer: 'After logging in, click on "Medical Records" in the navigation bar. You will see a list of your medical records, including past appointments, diagnoses, and prescriptions.',
    },
    {
      question: 'How do I update my profile information?',
      answer: 'Click on your profile icon in the top right corner and select "Profile". Here you can update your personal information, contact details, and other relevant information.',
    },
    {
      question: 'What should I do if I need to cancel an appointment?',
      answer: 'Go to the "Appointments" section, find the appointment you want to cancel, and click on it. You will see an option to cancel the appointment. Please note that cancellations should be made at least 24 hours before the scheduled time.',
    },
  ];

  const contactInfo = [
    {
      icon: <PhoneIcon />,
      title: 'Phone Support',
      content: '+1 (555) 123-4567',
      description: 'Available Monday to Friday, 9 AM - 6 PM',
    },
    {
      icon: <EmailIcon />,
      title: 'Email Support',
      content: 'support@medicalservices.com',
      description: '24/7 email support with response within 24 hours',
    },
    {
      icon: <AccessTimeIcon />,
      title: 'Business Hours',
      content: 'Monday - Friday',
      description: '9:00 AM - 6:00 PM',
    },
    {
      icon: <LocationIcon />,
      title: 'Office Location',
      content: '123 Medical Center Drive',
      description: 'Healthcare City, HC 12345',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 8, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box display="flex" alignItems="center" mb={4}>
          <HelpIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">
            Help & Support
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Contact Information */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Contact Information
                </Typography>
                <List>
                  {contactInfo.map((info, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>{info.icon}</ListItemIcon>
                      <ListItemText
                        primary={info.title}
                        secondary={
                          <>
                            <Typography component="span" variant="body2">
                              {info.content}
                            </Typography>
                            <br />
                            <Typography component="span" variant="caption" color="textSecondary">
                              {info.description}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* FAQs */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Frequently Asked Questions
                </Typography>
                {faqs.map((faq, index) => (
                  <Accordion key={index}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography>{faq.question}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>{faq.answer}</Typography>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </CardContent>
            </Card>
          </Grid>

          {/* Support Section */}
          <Grid item xs={12}>
            <Card sx={{ mt: 2 }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <SupportIcon sx={{ fontSize: 30, mr: 2, color: 'primary.main' }} />
                  <Typography variant="h6">
                    Need Additional Support?
                  </Typography>
                </Box>
                <Typography variant="body1" paragraph>
                  If you need additional assistance or have specific questions about our services,
                  please don't hesitate to contact our support team. We're here to help you with:
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <FAQIcon />
                    </ListItemIcon>
                    <ListItemText primary="Technical Support" secondary="Help with using our platform" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <HelpIcon />
                    </ListItemIcon>
                    <ListItemText primary="General Inquiries" secondary="Questions about our services" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <SupportIcon />
                    </ListItemIcon>
                    <ListItemText primary="Emergency Support" secondary="24/7 assistance for urgent matters" />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Help; 