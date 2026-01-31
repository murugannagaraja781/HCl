import React from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Button
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  CreditCard as CardIcon,
  AdminPanelSettings as AdminIcon,
  ExitToApp as LogoutIcon,
  AssignmentTurnedIn as TasksIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const drawerWidth = 260;

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: 'Offers', icon: <CardIcon />, path: '/dashboard', roles: ['USER', 'ADMIN', 'SUPER_ADMIN', 'MANAGER1', 'MANAGER2'] },
    { text: 'Admin Panel', icon: <AdminIcon />, path: '/admin', roles: ['ADMIN', 'SUPER_ADMIN'] },
    { text: 'Management', icon: <TasksIcon />, path: '/manager', roles: ['MANAGER', 'SUPER_ADMIN'] },
    { text: 'Credit Evaluation', icon: <PeopleIcon />, path: '/manager1', roles: ['MANAGER1', 'SUPER_ADMIN'] },
    { text: 'Limit Approval', icon: <TasksIcon />, path: '/manager2', roles: ['MANAGER2', 'SUPER_ADMIN'] },
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(user?.role));

  const drawer = (
    <div>
      <Toolbar sx={{ backgroundColor: 'primary.main', color: 'white', py: 2 }}>
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 800 }}>
          HCL BANK
        </Typography>
      </Toolbar>
      <Divider />
      <List sx={{ mt: 2 }}>
        {filteredItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => navigate(item.path)}
              selected={location.pathname === item.path}
              sx={{
                mx: 1,
                borderRadius: 2,
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '& .MuiListItemIcon-root': { color: 'white' },
                  '&:hover': { backgroundColor: 'primary.dark' }
                }
              }}
            >
              <ListItemIcon sx={{ color: location.pathname === item.path ? 'white' : 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: 600 }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Box sx={{ position: 'absolute', bottom: 20, width: '100%', px: 2 }}>
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          startIcon={<LogoutIcon />}
          onClick={logout}
          sx={{ py: 1.2 }}
        >
          Logout
        </Button>
      </Box>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          boxShadow: 'none',
          backgroundColor: 'background.default',
          borderBottom: '1px solid #e0e0e0',
          color: 'text.primary'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
            {filteredItems.find(item => item.path === location.pathname)?.text || 'Dashboard'}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
             <Typography variant="body2" sx={{ fontWeight: 600, opacity: 0.8 }}>
               {user?.name} ({user?.role})
             </Typography>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: '1px solid #e0e0e0' },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` }, minHeight: '100vh', mt: 8 }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
