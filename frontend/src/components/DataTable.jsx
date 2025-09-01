import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

const DataTable = ({ columns, rows, loading }) => {
	return (
		<div style={{ height: 400, width: '100%' }}>
			<DataGrid
				rows={rows}
				columns={columns}
				paginationModel={{ pageSize: 10, page: 0 }}
				pageSizeOptions={[10, 25, 50]}
				loading={loading}
				disableRowSelectionOnClick
				autoHeight
			/>
		</div>
	);
};

export default DataTable;
