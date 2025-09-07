import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, Box, useTheme, useMediaQuery } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import StarIcon from '@mui/icons-material/Star';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { Link, useLocation } from 'react-router-dom';
const menu = [
	{ text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
	{ text: 'Users', icon: <PeopleIcon />, path: '/users' },
	{ text: 'Favorites', icon: <StarIcon />, path: '/favorites' },
	{ text: 'Records', icon: <ListAltIcon />, path: '/records' },
];

const drawerWidth = 220;
const Sidebar = () => {
	const location = useLocation();
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
	return (
		<Drawer
			variant={isMobile ? 'temporary' : 'permanent'}
			anchor="left"
			open={!isMobile}
			sx={{
				width: drawerWidth,
				flexShrink: 0,
				'& .MuiDrawer-paper': {
					width: drawerWidth,
					boxSizing: 'border-box',
				},
			}}
		>
			<Toolbar />
			<Box sx={{ overflow: 'auto' }}>
				<List>
					{menu.map((item) => (
						<ListItem
							button
							key={item.text}
							component={Link}
							to={item.path}
							selected={location.pathname === item.path}
						>
							<ListItemIcon>{item.icon}</ListItemIcon>
							<ListItemText primary={item.text} />
						</ListItem>
					))}
				</List>
			</Box>
		</Drawer>
	);
};

export default Sidebar;
