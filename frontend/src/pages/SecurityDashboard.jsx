import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Grid, Button, TextField, Divider } from '@mui/material';
import DataTable from '../components/DataTable';
import api from '../api';

const columns = [
	{ field: 'vehicle_id', headerName: 'Vehicle ID', width: 90 },
	{ field: 'plate_number', headerName: 'Plate Number', width: 130 },
	{ field: 'full_name', headerName: 'Owner', width: 200 },
	{ field: 'nic', headerName: 'NIC', width: 130 },
];

const SecurityDashboard = () => {
	const [rows, setRows] = useState([]);
	const [loading, setLoading] = useState(false);
	const [nicOrVip, setNicOrVip] = useState('');
	const [plate, setPlate] = useState('');

	useEffect(() => {
		setLoading(true);
		api.get('/report/active-vehicles')
			.then(res => setRows(res.data))
			.finally(() => setLoading(false));
	}, []);

	const handleIn = () => {
		// TODO: Implement IN logic
	};
	const handleOut = () => {
		// TODO: Implement OUT logic
	};

	return (
		<Box sx={{ p: 3 }}>
			<Typography variant="h4" gutterBottom>Security Dashboard</Typography>
			<Paper sx={{ p: 2, mb: 3 }}>
				<Typography variant="h6">Register Vehicle IN/OUT</Typography>
				<Grid container spacing={2} alignItems="center" sx={{ mt: 1 }}>
					<Grid item xs={12} sm={3}>
						<TextField label="NIC or VIP Code" fullWidth size="small" value={nicOrVip} onChange={e => setNicOrVip(e.target.value)} />
					</Grid>
					<Grid item xs={12} sm={3}>
						<TextField label="Plate Number" fullWidth size="small" value={plate} onChange={e => setPlate(e.target.value)} />
					</Grid>
					<Grid item xs={12} sm={2}>
						<Button variant="contained" color="success" fullWidth onClick={handleIn}>IN</Button>
					</Grid>
					<Grid item xs={12} sm={2}>
						<Button variant="contained" color="error" fullWidth onClick={handleOut}>OUT</Button>
					</Grid>
				</Grid>
			</Paper>
			<Divider sx={{ mb: 3 }} />
			<Paper sx={{ p: 2 }}>
				<Typography variant="h6" gutterBottom>Currently Parked Vehicles</Typography>
				<DataTable columns={columns} rows={rows} loading={loading} />
			</Paper>
		</Box>
	);
};

export default SecurityDashboard;
