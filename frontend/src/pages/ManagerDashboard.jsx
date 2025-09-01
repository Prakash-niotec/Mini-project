import React from 'react';
import { Box, Typography, Paper, Grid, Divider } from '@mui/material';

const ManagerDashboard = () => {
	return (
		<Box sx={{ p: 3 }}>
			<Typography variant="h4" gutterBottom>Manager Dashboard</Typography>
			<Paper sx={{ p: 2, mb: 3 }}>
				<Typography variant="h6">Reports</Typography>
				<Grid container spacing={2}>
					<Grid item xs={12} sm={6}>
						<Paper sx={{ p: 2, mb: 2 }}>
							<Typography variant="subtitle1">Most Frequent Customers</Typography>
							{/* Table for frequent customers */}
							<Typography color="text.secondary">(Table placeholder)</Typography>
						</Paper>
					</Grid>
					<Grid item xs={12} sm={6}>
						<Paper sx={{ p: 2, mb: 2 }}>
							<Typography variant="subtitle1">Active Vehicles</Typography>
							{/* Table for active vehicles */}
							<Typography color="text.secondary">(Table placeholder)</Typography>
						</Paper>
					</Grid>
				</Grid>
			</Paper>
			<Divider sx={{ mb: 3 }} />
			<Paper sx={{ p: 2 }}>
				<Typography variant="h6">System Overview</Typography>
				<Typography color="text.secondary">(Overview placeholder)</Typography>
			</Paper>
		</Box>
	);
};

export default ManagerDashboard;
