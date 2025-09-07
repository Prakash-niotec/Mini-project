import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Button, Divider, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar, Alert } from '@mui/material';
import DataTable from '../components/DataTable';
import api from '../api';

const columns = [
	{ field: 'vip_id', headerName: 'VIP ID', width: 80 },
	{ field: 'vip_code', headerName: 'VIP Code', width: 130 },
	{ field: 'nic', headerName: 'NIC', width: 130 },
	{ field: 'full_name', headerName: 'Full Name', width: 200 },
	{ field: 'registered_at', headerName: 'Registered At', width: 180 },
];

const VIPs = () => {
	const [rows, setRows] = useState([]);
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);
	const [form, setForm] = useState({ full_name: '', nic: '', vip_code: '' });
	const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

	const fetchVIPs = () => {
		setLoading(true);
		api.get('/vip')
			.then(res => setRows(res.data))
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		fetchVIPs();
	}, []);

	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);
	const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

	const handleAdd = async () => {
		if (!form.full_name || !form.nic || !form.vip_code) {
			setSnackbar({ open: true, message: 'All fields are required', severity: 'error' });
			return;
		}
		try {
			// 1. Create or get Person with role 'VIP'
			let person_id;
			const res = await api.get(`/person?role=VIP`);
			const existing = res.data.find(p => p.nic === form.nic);
			if (existing) {
				person_id = existing.person_id;
			} else {
				const addRes = await api.post('/person', { nic: form.nic, full_name: form.full_name, role: 'VIP' });
				person_id = addRes.data.person_id;
			}
			// 2. Add VIP_Customer
			await api.post('/vip', { person_id, vip_code: form.vip_code });
			setSnackbar({ open: true, message: 'VIP added successfully', severity: 'success' });
			fetchVIPs();
			setOpen(false);
			setForm({ full_name: '', nic: '', vip_code: '' });
		} catch (e) {
			setSnackbar({ open: true, message: e?.response?.data?.error || 'Failed to add VIP', severity: 'error' });
		}
	};

	return (
		<Box sx={{ p: 3 }}>
			<Typography variant="h4" gutterBottom>VIP Customers</Typography>
			<Paper sx={{ p: 2, mb: 3 }}>
				<Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={handleOpen}>Add VIP</Button>
				<DataTable columns={columns} rows={rows} loading={loading} getRowId={(row) => row.vip_id} />
			</Paper>
			<Divider sx={{ mb: 3 }} />
			<Paper sx={{ p: 2 }}>
				<Typography variant="h6">VIP Details</Typography>
				<Typography color="text.secondary">(Details placeholder)</Typography>
			</Paper>
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>Add VIP</DialogTitle>
				   <DialogContent>
					   <TextField label="Full Name" name="full_name" value={form.full_name} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
					   <TextField label="NIC" name="nic" value={form.nic} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
					   <TextField label="VIP Code" name="vip_code" value={form.vip_code} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
				   </DialogContent>
				<DialogActions>
					<Button onClick={handleAdd} variant="contained">Add</Button>
					<Button onClick={handleClose}>Cancel</Button>
				</DialogActions>
			</Dialog>
			<Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
				<Alert severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
			</Snackbar>
		</Box>
	);
};

export default VIPs;
