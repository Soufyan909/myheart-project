import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  useTheme,
} from '@mui/material';
import { ArrowForward } from '@mui/icons-material';

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const handleGetStarted = () => {
    navigate('/register');
  };

  return (
    <Box sx={{ backgroundColor: 'white' }}>
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Box sx={{ textAlign: 'center', maxWidth: '800px', mx: 'auto' }}>
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              mb: 2,
              color: 'primary.main'
            }}
          >
            Your Health, Our Priority
          </Typography>
          <Typography
            variant="h5"
            sx={{
              mb: 4,
              color: 'text.secondary',
              fontSize: { xs: '1.2rem', md: '1.5rem' },
              lineHeight: 1.4
            }}
          >
            Connect with expert doctors and book appointments online
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={handleGetStarted}
            endIcon={<ArrowForward />}
            sx={{
              px: 6,
              py: 2,
              borderRadius: 2,
              fontSize: '1.1rem',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 8px rgba(0,0,0,0.15)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            Get Started Now
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Home; 