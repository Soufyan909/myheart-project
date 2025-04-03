import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  useTheme,
  Fade,
  Button
} from '@mui/material';
import {
  LocalHospital,
  AccessTime,
  Security,
  SupportAgent,
  MedicalServices,
  HealthAndSafety,
  Psychology,
  Vaccines
} from '@mui/icons-material';

const Services = () => {
  const theme = useTheme();

  const services = [
    {
      icon: <MedicalServices sx={{ fontSize: 40 }} />,
      title: 'Primary Care',
      description: 'Comprehensive primary healthcare services including routine check-ups, preventive care, and chronic disease management.',
      price: 'Starting from $50'
    },
    {
      icon: <HealthAndSafety sx={{ fontSize: 40 }} />,
      title: 'Emergency Care',
      description: '24/7 emergency medical services with rapid response times and immediate medical attention.',
      price: 'Contact for pricing'
    },
    {
      icon: <Psychology sx={{ fontSize: 40 }} />,
      title: 'Mental Health',
      description: 'Professional mental health services including counseling, therapy, and psychiatric care.',
      price: 'Starting from $80'
    },
    {
      icon: <Vaccines sx={{ fontSize: 40 }} />,
      title: 'Vaccination',
      description: 'Complete vaccination services for all age groups, including travel vaccines and seasonal flu shots.',
      price: 'Starting from $30'
    }
  ];

  return (
    <Box sx={{ pt: 8 }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'url("https://images.unsplash.com/photo-1538108149393-fbbd81895907?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          py: 12,
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.9) 0%, rgba(33, 203, 243, 0.9) 100%)',
            zIndex: 1
          }
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Fade in timeout={1000}>
            <Box sx={{ textAlign: 'center', color: 'white' }}>
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  fontWeight: 700,
                  mb: 3,
                  fontSize: { xs: '2.5rem', md: '3.5rem' }
                }}
              >
                Our Services
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  maxWidth: '800px',
                  mx: 'auto',
                  opacity: 0.9,
                  fontSize: { xs: '1.2rem', md: '1.5rem' }
                }}
              >
                Comprehensive healthcare solutions tailored to your needs.
              </Typography>
            </Box>
          </Fade>
        </Container>
      </Box>

      {/* Services Section */}
      <Box sx={{ py: 8, backgroundColor: '#f5f7fa' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', maxWidth: '800px', mx: 'auto', mb: 6 }}>
            <Typography
              variant="h3"
              component="h2"
              sx={{
                fontWeight: 700,
                color: 'primary.main',
                mb: 3
              }}
            >
              Available Services
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                fontWeight: 500,
                lineHeight: 1.6
              }}
            >
              Choose from our wide range of healthcare services designed to meet your medical needs.
            </Typography>
          </Box>
          <Grid container spacing={4}>
            {services.map((service, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Fade in timeout={1000}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 4,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      borderRadius: 4,
                      background: 'white',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                      transition: 'transform 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        color: 'primary.main',
                        mb: 2
                      }}
                    >
                      {service.icon}
                    </Box>
                    <Typography
                      variant="h6"
                      component="h3"
                      sx={{
                        fontWeight: 600,
                        mb: 2
                      }}
                    >
                      {service.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{
                        lineHeight: 1.6,
                        mb: 3,
                        flexGrow: 1
                      }}
                    >
                      {service.description}
                    </Typography>
                    <Typography
                      variant="h6"
                      color="primary"
                      sx={{
                        fontWeight: 600,
                        mb: 2
                      }}
                    >
                      {service.price}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      sx={{
                        textTransform: 'none',
                        borderRadius: 2,
                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                        boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #1976D2 30%, #1CB5E0 90%)',
                          boxShadow: '0 4px 8px 2px rgba(33, 203, 243, .4)',
                        },
                      }}
                    >
                      Learn More
                    </Button>
                  </Paper>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Additional Services Section */}
      <Box sx={{ py: 8, backgroundColor: 'white' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Fade in timeout={1000}>
                <Typography
                  variant="h3"
                  component="h2"
                  sx={{
                    fontWeight: 700,
                    mb: 3,
                    color: 'primary.main'
                  }}
                >
                  Additional Services
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: '1.1rem',
                    lineHeight: 1.8,
                    mb: 4
                  }}
                >
                  We also offer specialized services including:
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {[
                    'Telemedicine consultations',
                    'Home healthcare services',
                    'Laboratory testing',
                    'Medical equipment rental',
                    'Health insurance assistance'
                  ].map((service, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2
                      }}
                    >
                      <LocalHospital
                        sx={{
                          color: 'primary.main',
                          fontSize: 24
                        }}
                      />
                      <Typography
                        variant="body1"
                        sx={{
                          fontSize: '1.1rem',
                          fontWeight: 500
                        }}
                      >
                        {service}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Fade>
            </Grid>
            <Grid item xs={12} md={6}>
              <Fade in timeout={1000}>
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80"
                  alt="Additional Services"
                  sx={{
                    width: '100%',
                    borderRadius: 4,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                  }}
                />
              </Fade>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Services; 