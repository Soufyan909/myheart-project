import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  useTheme
} from '@mui/material';
import {
  LocalHospital,
  Security,
  AccessTime,
  MedicalServices
} from '@mui/icons-material';

const About = () => {
  const theme = useTheme();

  const features = [
    {
      icon: <LocalHospital sx={{ fontSize: 40 }} />,
      title: 'Expert Healthcare',
      description: 'Access to qualified medical professionals and specialists'
    },
    {
      icon: <Security sx={{ fontSize: 40 }} />,
      title: 'Secure Platform',
      description: 'Your health data is protected with state-of-the-art security'
    },
    {
      icon: <AccessTime sx={{ fontSize: 40 }} />,
      title: '24/7 Access',
      description: 'Book appointments and access medical records anytime'
    },
    {
      icon: <MedicalServices sx={{ fontSize: 40 }} />,
      title: 'Comprehensive Care',
      description: 'Complete healthcare solutions under one platform'
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
            About MyHeart Healthcare
          </Typography>
          <Typography
            variant="h5"
            color="text.secondary"
            paragraph
            sx={{ maxWidth: '800px', mx: 'auto', mb: 4 }}
          >
            We are dedicated to providing accessible, high-quality healthcare services
            through our innovative digital platform. Our mission is to connect patients
            with healthcare providers seamlessly.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-5px)'
                  }
                }}
              >
                <Box
                  sx={{
                    p: 2,
                    borderRadius: '50%',
                    bgcolor: theme.palette.primary.light,
                    color: theme.palette.primary.main,
                    mb: 2
                  }}
                >
                  {feature.icon}
                </Box>
                <Typography variant="h6" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom color="primary">
            Our Vision
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: '800px', mx: 'auto' }}
          >
            To revolutionize healthcare delivery by making it more accessible,
            efficient, and patient-centered through innovative digital solutions.
            We strive to create a healthcare ecosystem where quality care is just
            a click away.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default About; 