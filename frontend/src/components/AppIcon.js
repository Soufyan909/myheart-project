import React from 'react';
import { LocalHospital } from '@mui/icons-material';

const AppIcon = ({ sx, ...props }) => (
  <LocalHospital
    sx={{
      color: 'primary.main',
      ...sx
    }}
    {...props}
  />
);

export default AppIcon; 