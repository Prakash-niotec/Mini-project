import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Divider, Snackbar, Alert } from '@mui/material';
import DataTable from '../components/DataTable';
import api from '../api';

const columns = [
	{ field: 'record_id', headerName: 'Record ID', width: 90 },
	{ field: 'person_id', headerName: 'Person ID', width: 90 },
	{ field: 'vehicle_id', headerName: 'Vehicle ID', width: 90 },
	{ field: 'action', headerName: 'Action', width: 90 },
	{ field: 'recorded_by', headerName: 'Recorded By', width: 110 },
	{ field: 'occurred_at', headerName: 'Occurred At', width: 180 },
];

const Records = () => {
	const [rows, setRows] = useState([]);
	const [loading, setLoading] = useState(false);
	const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

	useEffect(() => {
	 setLoading(true);
	 api.get('/report/records')
		 .then(res => setRows(res.data))
		 .catch(() => setSnackbar({ open: true, message: 'Failed to fetch records', severity: 'error' }))
		 .finally(() => setLoading(false));
	}, []);

	return (
		<Box sx={{ p: 3 }}>
			<Typography variant="h4" gutterBottom>Parking Records</Typography>
			<Paper sx={{ p: 2, mb: 3 }}>
				 <DataTable columns={columns} rows={rows} loading={loading} getRowId={(row) => row.record_id || row.vehicle_id} />
			</Paper>
			<Divider sx={{ mb: 3 }} />
			<Paper sx={{ p: 2 }}>
				<Typography variant="h6">Record Details</Typography>
				<Typography color="text.secondary">(Details placeholder)</Typography>
			</Paper>
			<Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
				<Alert severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
			</Snackbar>
		</Box>
	);
};

export default Records;
