import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, TextField, Button, Snackbar, Alert } from '@mui/material';
import api from '../api';

const Settings = () => {
	const [config, setConfig] = useState({ parkingCapacity: '', companyName: '' });
	const [loading, setLoading] = useState(false);
	const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

	useEffect(() => {
		setLoading(true);
		api.get('/settings')
			.then(res => setConfig(res.data))
			.catch(() => setSnackbar({ open: true, message: 'Failed to load settings', severity: 'error' }))
			.finally(() => setLoading(false));
	}, []);

	const handleChange = (e) => {
		setConfig({ ...config, [e.target.name]: e.target.value });
	};

	const handleSave = () => {
		if (!config.parkingCapacity || !config.companyName) {
			setSnackbar({ open: true, message: 'All fields are required', severity: 'error' });
			return;
		}
		setLoading(true);
		api.post('/settings', config)
			.then(() => setSnackbar({ open: true, message: 'Settings saved', severity: 'success' }))
			.catch(() => setSnackbar({ open: true, message: 'Failed to save settings', severity: 'error' }))
			.finally(() => setLoading(false));
	};

	return (
		<Box sx={{ p: 3 }}>
			<Typography variant="h4" gutterBottom>Settings</Typography>
			<Paper sx={{ p: 2, maxWidth: 400 }}>
				<Typography variant="h6" gutterBottom>System Configuration</Typography>
				<TextField
					label="Company Name"
					name="companyName"
					value={config.companyName}
					onChange={handleChange}
					fullWidth
					margin="normal"
					disabled={loading}
				/>
				<TextField
					label="Parking Capacity"
					name="parkingCapacity"
					type="number"
					value={config.parkingCapacity}
					onChange={handleChange}
					fullWidth
					margin="normal"
					disabled={loading}
				/>
				<Button variant="contained" color="primary" onClick={handleSave} disabled={loading} sx={{ mt: 2 }} fullWidth>
					Save
				</Button>
			</Paper>
			<Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
				<Alert severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
			</Snackbar>
		</Box>
	);
};

// Settings page removed as requested. File left empty for safe deletion.
