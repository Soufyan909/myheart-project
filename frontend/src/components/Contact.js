import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  Paper,
  useTheme,
  Card,
  CardContent
} from '@mui/material';
import {
  Phone,
  Email,
  LocationOn,
  AccessTime
} from '@mui/icons-material';

const Contact = () => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically handle the form submission
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  const contactInfo = [
    {
      icon: <Phone />,
      title: 'Phone',
      content: '+1 (555) 123-4567',
      subContent: 'Mon-Fri 9:00 AM - 6:00 PM'
    },
    {
      icon: <Email />,
      title: 'Email',
      content: 'support@myheart.com',
      subContent: '24/7 Online Support'
    },
    {
      icon: <LocationOn />,
      title: 'Location',
      content: '123 Healthcare Street',
      subContent: 'Medical District, NY 10001'
    },
    {
      icon: <AccessTime />,
      title: 'Working Hours',
      content: 'Monday - Friday',
      subContent: '9:00 AM - 6:00 PM'
    }
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        pt: 8,
        pb: 6
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            component="h1"
            variant="h2"
            color="primary"
            gutterBottom
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              backgroundClip: 'text',
              textFillColor: 'transparent'
            }}
          >
            Contact Us
          </Typography>
          <Typography
            variant="h5"
            color="text.secondary"
            paragraph
            sx={{ maxWidth: '800px', mx: 'auto', mb: 4 }}
          >
            Have questions? We'd love to hear from you. Send us a message
            and we'll respond as soon as possible.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Contact Information Cards */}
          {contactInfo.map((info, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-5px)'
                  }
                }}
              >
                <CardContent
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    p: 3
                  }}
                >
                  <Box
                    sx={{
                      bgcolor: theme.palette.primary.light,
                      color: theme.palette.primary.main,
                      p: 2,
                      borderRadius: '50%',
                      mb: 2
                    }}
                  >
                    {info.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    {info.title}
                  </Typography>
                  <Typography variant="body1" color="text.primary" gutterBottom>
                    {info.content}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {info.subContent}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}

          {/* Contact Form */}
          <Grid item xs={12}>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                mt: 4,
                maxWidth: 800,
                mx: 'auto'
              }}
            >
              <Typography variant="h4" gutterBottom color="primary">
                Send us a Message
              </Typography>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      label="Subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      label="Message"
                      name="message"
                      multiline
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      size="large"
                      sx={{
                        mt: 2,
                        px: 4,
                        py: 1
                      }}
                    >
                      Send Message
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Contact; 