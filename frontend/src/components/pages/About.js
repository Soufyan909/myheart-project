import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Avatar,
  useTheme,
  Fade
} from '@mui/material';
import {
  LocalHospital,
  EmojiPeople,
  Speed,
  Security
} from '@mui/icons-material';

const About = () => {
  const theme = useTheme();

  const values = [
    {
      icon: <LocalHospital sx={{ fontSize: 40 }} />,
      title: 'Quality Healthcare',
      description: 'We are committed to providing the highest quality healthcare services to our patients.'
    },
    {
      icon: <EmojiPeople sx={{ fontSize: 40 }} />,
      title: 'Patient-Centered',
      description: 'Our patients are at the heart of everything we do. We prioritize their needs and well-being.'
    },
    {
      icon: <Speed sx={{ fontSize: 40 }} />,
      title: 'Efficiency',
      description: 'We streamline healthcare processes to provide faster and more efficient services.'
    },
    {
      icon: <Security sx={{ fontSize: 40 }} />,
      title: 'Trust & Security',
      description: 'We maintain the highest standards of security and confidentiality for our patients.'
    }
  ];

  const team = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Medical Director',
      avatar: 'https://i.pravatar.cc/150?img=1',
      bio: 'With over 15 years of experience in healthcare management.'
    },
    {
      name: 'Dr. Michael Chen',
      role: 'Chief Technology Officer',
      avatar: 'https://i.pravatar.cc/150?img=2',
      bio: 'Leading our digital transformation initiatives.'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Patient Care Director',
      avatar: 'https://i.pravatar.cc/150?img=3',
      bio: 'Ensuring exceptional patient care and satisfaction.'
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
                About Us
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
                We are dedicated to revolutionizing healthcare through technology and innovation.
              </Typography>
            </Box>
          </Fade>
        </Container>
      </Box>

      {/* Mission Section */}
      <Box sx={{ py: 8, backgroundColor: '#f5f7fa' }}>
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
                  Our Mission
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: '1.1rem',
                    lineHeight: 1.8,
                    mb: 4
                  }}
                >
                  At Medical Services, our mission is to provide accessible, high-quality healthcare solutions through innovative technology. We believe in making healthcare more efficient, transparent, and patient-centered.
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: '1.1rem',
                    lineHeight: 1.8
                  }}
                >
                  We strive to bridge the gap between patients and healthcare providers, ensuring that everyone has access to the care they need when they need it.
                </Typography>
              </Fade>
            </Grid>
            <Grid item xs={12} md={6}>
              <Fade in timeout={1000} style={{ transitionDelay: '200ms' }}>
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80"
                  alt="Healthcare Mission"
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

      {/* Values Section */}
      <Box sx={{ py: 8, backgroundColor: 'white' }}>
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
              Our Values
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                fontWeight: 500,
                lineHeight: 1.6
              }}
            >
              These core values guide everything we do at Medical Services.
            </Typography>
          </Box>
          <Grid container spacing={4}>
            {values.map((value, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Fade in timeout={1000} style={{ transitionDelay: `${index * 100}ms` }}>
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
                      background: '#f5f7fa',
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
                      {value.icon}
                    </Box>
                    <Typography
                      variant="h6"
                      component="h3"
                      sx={{
                        fontWeight: 600,
                        mb: 2
                      }}
                    >
                      {value.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{
                        lineHeight: 1.6
                      }}
                    >
                      {value.description}
                    </Typography>
                  </Paper>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Team Section */}
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
              Our Team
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                fontWeight: 500,
                lineHeight: 1.6
              }}
            >
              Meet the dedicated professionals behind Medical Services.
            </Typography>
          </Box>
          <Grid container spacing={4}>
            {team.map((member, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Fade in timeout={1000} style={{ transitionDelay: `${index * 100}ms` }}>
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
                    <Avatar
                      src={member.avatar}
                      sx={{
                        width: 120,
                        height: 120,
                        mb: 3,
                        border: '4px solid',
                        borderColor: 'primary.main'
                      }}
                    />
                    <Typography
                      variant="h5"
                      component="h3"
                      sx={{
                        fontWeight: 600,
                        mb: 1
                      }}
                    >
                      {member.name}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      color="primary"
                      sx={{
                        mb: 2
                      }}
                    >
                      {member.role}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{
                        lineHeight: 1.6
                      }}
                    >
                      {member.bio}
                    </Typography>
                  </Paper>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default About; 