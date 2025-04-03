import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  useTheme,
  useMediaQuery,
  IconButton,
  Menu,
  MenuItem,
  Fade,
  useScrollTrigger,
  Slide
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

// Hide Navbar on scroll down, show on scroll up
function HideOnScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger({
    threshold: 100,
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const navLinks = [
    { text: 'Home', path: '/' },
    { text: 'About', path: '/about' },
    { text: 'Services', path: '/services' },
    { text: 'Contact', path: '/contact' }
  ];

  return (
    <HideOnScroll>
      <AppBar 
        position="fixed" 
        sx={{ 
          background: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
          backdropFilter: 'blur(10px)',
          boxShadow: scrolled ? '0 2px 10px rgba(0,0,0,0.1)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(0,0,0,0.1)' : 'none',
          transition: 'all 0.3s ease-in-out'
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            <LocalHospitalIcon 
              sx={{ 
                display: { xs: 'none', md: 'flex' }, 
                mr: 1,
                color: scrolled ? 'primary.main' : 'white',
                fontSize: 32,
                transition: 'color 0.3s ease-in-out'
              }} 
            />
            <Typography
              variant="h6"
              noWrap
              component={RouterLink}
              to="/"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: scrolled ? 'primary.main' : 'white',
                textDecoration: 'none',
                flexGrow: 1,
                transition: 'color 0.3s ease-in-out'
              }}
            >
              MEDICAL SERVICES
            </Typography>

            {isMobile ? (
              <>
                <IconButton
                  size="large"
                  aria-label="menu"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color={scrolled ? 'primary' : 'inherit'}
                  sx={{ ml: 'auto' }}
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  TransitionComponent={Fade}
                >
                  {navLinks.map((link) => (
                    <MenuItem 
                      key={link.text}
                      component={RouterLink} 
                      to={link.path} 
                      onClick={handleClose}
                      sx={{ 
                        color: 'primary.main',
                        fontWeight: 500
                      }}
                    >
                      {link.text}
                    </MenuItem>
                  ))}
                  <MenuItem 
                    component={RouterLink} 
                    to="/login" 
                    onClick={handleClose}
                    sx={{ 
                      color: 'primary.main',
                      fontWeight: 500
                    }}
                  >
                    Login
                  </MenuItem>
                  <MenuItem 
                    component={RouterLink} 
                    to="/register" 
                    onClick={handleClose}
                    sx={{ 
                      color: 'primary.main',
                      fontWeight: 500
                    }}
                  >
                    Register
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Box sx={{ flexGrow: 1, display: 'flex', gap: 2, mr: 4 }}>
                  {navLinks.map((link) => (
                    <Button
                      key={link.text}
                      component={RouterLink}
                      to={link.path}
                      color={scrolled ? 'primary' : 'inherit'}
                      sx={{
                        fontWeight: 600,
                        textTransform: 'none',
                        px: 2,
                        '&:hover': {
                          backgroundColor: scrolled ? 'rgba(33, 150, 243, 0.1)' : 'rgba(255, 255, 255, 0.1)',
                        },
                      }}
                    >
                      {link.text}
                    </Button>
                  ))}
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    component={RouterLink}
                    to="/login"
                    color={scrolled ? 'primary' : 'inherit'}
                    sx={{
                      fontWeight: 600,
                      textTransform: 'none',
                      px: 3,
                      '&:hover': {
                        backgroundColor: scrolled ? 'rgba(33, 150, 243, 0.1)' : 'rgba(255, 255, 255, 0.1)',
                      },
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/register"
                    variant="contained"
                    color="primary"
                    sx={{
                      fontWeight: 600,
                      textTransform: 'none',
                      px: 3,
                      background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                      boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #1976D2 30%, #1CB5E0 90%)',
                        boxShadow: '0 4px 8px 2px rgba(33, 203, 243, .4)',
                      },
                    }}
                  >
                    Register
                  </Button>
                </Box>
              </>
            )}
          </Toolbar>
        </Container>
      </AppBar>
    </HideOnScroll>
  );
};

export default Navbar; 