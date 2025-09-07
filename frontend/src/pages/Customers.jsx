import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Button, Divider, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar, Alert } from '@mui/material';
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
	const [open, setOpen] = useState(false);
	const [form, setForm] = useState({ full_name: '', nic: '' });
	const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

	const fetchCustomers = () => {
		setLoading(true);
		api.get('/person?role=Customer')
			.then(res => setRows(res.data))
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		fetchCustomers();
	}, []);

	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);
	const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

	const handleAdd = () => {
		if (!form.full_name || !form.nic) {
			setSnackbar({ open: true, message: 'All fields are required', severity: 'error' });
			return;
		}
		api.post('/person', { ...form, role: 'Customer' })
			.then(() => {
				setSnackbar({ open: true, message: 'Customer added successfully', severity: 'success' });
				fetchCustomers();
				setOpen(false);
				setForm({ full_name: '', nic: '' });
			})
			.catch(() => setSnackbar({ open: true, message: 'Failed to add customer', severity: 'error' }));
	};

	return (
		<Box sx={{ p: 3 }}>
			<Typography variant="h4" gutterBottom>Customers</Typography>
			<Paper sx={{ p: 2, mb: 3 }}>
				<Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={handleOpen}>Add Customer</Button>
				<DataTable columns={columns} rows={rows} loading={loading} getRowId={(row) => row.person_id} />
			</Paper>
			<Divider sx={{ mb: 3 }} />
			<Paper sx={{ p: 2 }}>
				<Typography variant="h6">Customer Details</Typography>
				<Typography color="text.secondary">(Details placeholder)</Typography>
			</Paper>
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>Add Customer</DialogTitle>
				<DialogContent>
					<TextField label="Full Name" name="full_name" value={form.full_name} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
					<TextField label="NIC" name="nic" value={form.nic} onChange={handleChange} fullWidth />
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>Cancel</Button>
					<Button onClick={handleAdd} variant="contained">Add</Button>
				</DialogActions>
			</Dialog>
			<Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
				<Alert severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
			</Snackbar>
		</Box>
	);
};

export default Customers;
