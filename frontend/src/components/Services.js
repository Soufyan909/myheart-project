import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  useTheme
} from '@mui/material';

const Services = () => {
  const theme = useTheme();

  const services = [
    {
      title: 'Online Consultations',
      description: 'Connect with healthcare professionals from the comfort of your home through secure video consultations.',
      image: 'https://source.unsplash.com/800x600/?telemedicine'
    },
    {
      title: 'Appointment Management',
      description: 'Easy scheduling and management of medical appointments with your preferred healthcare providers.',
      image: 'https://source.unsplash.com/800x600/?calendar'
    },
    {
      title: 'Medical Records',
      description: 'Secure storage and access to your complete medical history, test results, and prescriptions.',
      image: 'https://source.unsplash.com/800x600/?medical-records'
    },
    {
      title: 'Emergency Care',
      description: '24/7 emergency support and quick access to urgent care services when you need them most.',
      image: 'https://source.unsplash.com/800x600/?emergency'
    },
    {
      title: 'Specialist Referrals',
      description: 'Seamless referrals to specialists and coordination of care between healthcare providers.',
      image: 'https://source.unsplash.com/800x600/?doctor'
    },
    {
      title: 'Health Monitoring',
      description: 'Regular health monitoring and tracking of vital signs, symptoms, and progress.',
      image: 'https://source.unsplash.com/800x600/?health-monitor'
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
            Our Services
          </Typography>
          <Typography
            variant="h5"
            color="text.secondary"
            paragraph
            sx={{ maxWidth: '800px', mx: 'auto', mb: 4 }}
          >
            Comprehensive healthcare solutions designed to meet all your medical needs
            with convenience and excellence.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {services.map((service, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-5px)'
                  }
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={service.image}
                  alt={service.title}
                  sx={{
                    objectFit: 'cover'
                  }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="h2"
                    color="primary"
                  >
                    {service.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {service.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Services; 