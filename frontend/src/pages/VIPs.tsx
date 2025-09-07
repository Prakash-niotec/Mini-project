import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Button, Divider } from '@mui/material';
import DataTable from '../components/DataTable';
import api from '../api';

interface VIP {
  vip_id: number;
  vip_code: string;
  nic: string;
  full_name: string;
  registered_at: string;
}

const columns = [
  { field: 'vip_id', headerName: 'VIP ID', width: 80 },
  { field: 'vip_code', headerName: 'VIP Code', width: 130 },
  { field: 'nic', headerName: 'NIC', width: 130 },
  { field: 'full_name', headerName: 'Full Name', width: 200 },
  { field: 'registered_at', headerName: 'Registered At', width: 180 },
];

const VIPs: React.FC = () => {
  const [rows, setRows] = useState<VIP[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get('/vip')
      .then((res: { data: VIP[] }) => setRows(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>VIP Customers</Typography>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Button variant="contained" color="primary" sx={{ mb: 2 }}>Add VIP</Button>
  <DataTable columns={columns} rows={rows} loading={loading} getRowId={(row: VIP) => row.vip_id} />
      </Paper>
      <Divider sx={{ mb: 3 }} />
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">VIP Details</Typography>
        <Typography color="text.secondary">(Details placeholder)</Typography>
      </Paper>
    </Box>
  );
};

export default VIPs;
