import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Button, TextField, Divider, Snackbar, Alert } from '@mui/material';
import Grid from '@mui/material/Grid';
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
	const [nic, setNic] = useState('');
	const [plateNumber, setPlateNumber] = useState('');
	const [recordedBy, setRecordedBy] = useState('1'); // TEMP: default Security person_id
	const [vipCode, setVipCode] = useState('');
	const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

	const fetchVehicles = () => {
		setLoading(true);
		api.get('/report/active-vehicles')
			.then(res => setRows(res.data))
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		fetchVehicles();
	}, []);

	const handleIn = () => {
		if (!nic || !plateNumber || !recordedBy) {
			setSnackbar({ open: true, message: 'NIC, Plate Number, and Security ID required', severity: 'error' });
			return;
		}
		api.post('/parking/in', { nic, plate_number: plateNumber, recorded_by: recordedBy, vip_code: vipCode })
			.then(() => {
				setSnackbar({ open: true, message: 'Vehicle IN registered', severity: 'success' });
				fetchVehicles();
				setNic('');
				setPlateNumber('');
				setVipCode('');
			})
			.catch(e => setSnackbar({ open: true, message: e?.response?.data?.error || 'Failed to register IN', severity: 'error' }));
	};
	const handleOut = () => {
		if (!nic || !plateNumber || !recordedBy) {
			setSnackbar({ open: true, message: 'NIC, Plate Number, and Security ID required', severity: 'error' });
			return;
		}
		api.post('/parking/out', { nic, plate_number: plateNumber, recorded_by: recordedBy, vip_code: vipCode })
			.then(() => {
				setSnackbar({ open: true, message: 'Vehicle OUT registered', severity: 'success' });
				fetchVehicles();
				setNic('');
				setPlateNumber('');
				setVipCode('');
			})
			.catch(e => setSnackbar({ open: true, message: e?.response?.data?.error || 'Failed to register OUT', severity: 'error' }));
	};

	return (
		<Box sx={{ p: 3 }}>
			<Typography variant="h4" gutterBottom>Security Dashboard</Typography>
					<Paper sx={{ p: 2, mb: 3 }}>
						<Typography variant="h6">Register Vehicle IN/OUT</Typography>
						<Grid container spacing={2} alignItems="center" sx={{ mt: 1 }}>
							<Grid item xs={12} sm={3}>
								<TextField label="NIC" fullWidth size="small" value={nic} onChange={e => setNic(e.target.value)} />
							</Grid>
							<Grid item xs={12} sm={3}>
								<TextField label="Plate Number" fullWidth size="small" value={plateNumber} onChange={e => setPlateNumber(e.target.value)} />
							</Grid>
							<Grid item xs={12} sm={2}>
								<TextField label="VIP Code (optional)" fullWidth size="small" value={vipCode} onChange={e => setVipCode(e.target.value)} />
							</Grid>
							<Grid item xs={12} sm={2}>
								<TextField label="Security ID" fullWidth size="small" value={recordedBy} onChange={e => setRecordedBy(e.target.value)} />
							</Grid>
							<Grid item xs={12} sm={1}>
								<Button variant="contained" color="success" fullWidth onClick={handleIn}>IN</Button>
							</Grid>
							<Grid item xs={12} sm={1}>
								<Button variant="contained" color="error" fullWidth onClick={handleOut}>OUT</Button>
							</Grid>
						</Grid>
					</Paper>
			<Divider sx={{ mb: 3 }} />
			<Paper sx={{ p: 2 }}>
				<Typography variant="h6" gutterBottom>Currently Parked Vehicles</Typography>
				<DataTable columns={columns} rows={rows} loading={loading} getRowId={(row) => row.vehicle_id} />
			</Paper>
			<Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
				<Alert severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
			</Snackbar>
		</Box>
	);
};

export default SecurityDashboard;
