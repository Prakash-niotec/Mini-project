import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import StarIcon from '@mui/icons-material/Star';
import ListAltIcon from '@mui/icons-material/ListAlt';
import SettingsIcon from '@mui/icons-material/Settings';
import { Link } from 'react-router-dom';

const menu = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Customers', icon: <PeopleIcon />, path: '/customers' },
  { text: 'VIPs', icon: <StarIcon />, path: '/vips' },
  { text: 'Records', icon: <ListAltIcon />, path: '/records' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
];

const Sidebar = () => (
  <Drawer variant="permanent" anchor="left">
    <List>
      {menu.map((item) => (
        <ListItem button key={item.text} component={Link} to={item.path}>
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.text} />
        </ListItem>
      ))}
    </List>
  </Drawer>
);

export default Sidebar;
