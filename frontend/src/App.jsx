import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Sidebar from './components/Sidebar';
import SecurityDashboard from './pages/SecurityDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import Customers from './pages/Customers';
import VIPs from './pages/VIPs';
import Records from './pages/Records';

const App = () => {
		return (
			<Router>
				<div style={{ display: 'flex' }}>
					<Sidebar />
					<main style={{ flexGrow: 1, padding: 24, marginLeft: 220, minHeight: '100vh', background: '#f5f5f5' }}>
						<Routes>
							<Route path="/" element={<SecurityDashboard />} />
							<Route path="/manager" element={<ManagerDashboard />} />
							<Route path="/customers" element={<Customers />} />
							<Route path="/vips" element={<VIPs />} />
							<Route path="/records" element={<Records />} />
						</Routes>
					</main>
				</div>
			</Router>
		);
};

export default App;
