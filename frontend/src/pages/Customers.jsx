import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Button, Divider } from '@mui/material';
import DataTable from '../components/DataTable';
import api from '../api';

const columns = [
	{ field: 'person_id', headerName: 'ID', width: 70 },
	{ field: 'nic', headerName: 'NIC', width: 130 },
	{ field: 'full_name', headerName: 'Full Name', width: 200 },
	{ field: 'role', headerName: 'Role', width: 120 },
	{ field: 'created_at', headerName: 'Created At', width: 180 },
];

const Customers = () => {
	const [rows, setRows] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		setLoading(true);
		api.get('/person?role=Customer')
			.then(res => setRows(res.data))
			.finally(() => setLoading(false));
	}, []);

	return (
		<Box sx={{ p: 3 }}>
			<Typography variant="h4" gutterBottom>Customers</Typography>
			<Paper sx={{ p: 2, mb: 3 }}>
				<Button variant="contained" color="primary" sx={{ mb: 2 }}>Add Customer</Button>
				<DataTable columns={columns} rows={rows} loading={loading} />
			</Paper>
			<Divider sx={{ mb: 3 }} />
			<Paper sx={{ p: 2 }}>
				<Typography variant="h6">Customer Details</Typography>
				<Typography color="text.secondary">(Details placeholder)</Typography>
			</Paper>
		</Box>
	);
};

export default Customers;
