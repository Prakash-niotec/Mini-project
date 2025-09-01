import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Settings = () => {
	return (
		<Box sx={{ p: 3 }}>
			<Typography variant="h4" gutterBottom>Settings</Typography>
			<Paper sx={{ p: 2 }}>
				<Typography variant="h6">System Configuration</Typography>
				<Typography color="text.secondary">(Settings placeholder)</Typography>
			</Paper>
		</Box>
	);
};

export default Settings;
