import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
    Drawer, List, ListItemButton, ListItemIcon, ListItemText,
    IconButton, Typography, Box, CssBaseline, Divider, Tooltip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import {
    LayoutDashboard, Building2, MessageSquareQuote,
    GalleryThumbnails, FolderGit2, Settings, Bot, LogOut, Home, Mail, Users,
} from 'lucide-react';
import UseAuth from '../hooks/useAuth';

const drawerWidth = 240;
const collapsedWidth = 72;

const SuperAdminSidebar = () => {
    const [open, setOpen] = useState(true);
    const location = useLocation();
    const { logout, user } = UseAuth({ middleware: 'auth' });

    const menuItems = [
        { text: 'Dashboard',     icon: <LayoutDashboard size={20} />, path: '/superadmin-dash' },
        { text: 'Tenants',       icon: <Building2 size={20} />,       path: '/superadmin-dash/tenants' },
        { text: 'Usuarios',      icon: <Users size={20} />,           path: '/superadmin-dash/usuarios' },
        { text: 'Testimonios',   icon: <MessageSquareQuote size={20} />, path: '/superadmin-dash/testimonios' },
        { text: 'Galería',       icon: <GalleryThumbnails size={20} />, path: '/superadmin-dash/ejemplos' },
        { text: 'Servicios',     icon: <FolderGit2 size={20} />,      path: '/superadmin-dash/servicios' },
        { text: 'Chatbot',       icon: <Bot size={20} />,             path: '/superadmin-dash/chatbot' },
        { text: 'Mail Config',   icon: <Mail size={20} />,            path: '/superadmin-dash/mail-config' },
        { text: 'Configuración', icon: <Settings size={20} />,        path: '/superadmin-dash/configuraciones' },
    ];

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />

            <Drawer
                variant="permanent"
                open={open}
                sx={{
                    width: open ? drawerWidth : collapsedWidth,
                    flexShrink: 0,
                    whiteSpace: 'nowrap',
                    '& .MuiDrawer-paper': {
                        width: open ? drawerWidth : collapsedWidth,
                        transition: 'width 0.3s ease',
                        overflowX: 'hidden',
                        boxShadow: 2,
                        background: '#1e1e2e',
                        color: '#cdd6f4',
                    },
                }}
            >
                {/* Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, minHeight: 64 }}>
                    {open ? (
                        <Box component="a" href="/" target="_blank" rel="noopener noreferrer"
                            sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none', color: '#cba6f7' }}>
                            <Home size={20} />
                            <Typography variant="body2" fontWeight={700} sx={{ color: '#cba6f7' }}>
                                SuperAdmin
                            </Typography>
                        </Box>
                    ) : (
                        <Tooltip title="Ver sitio" placement="right">
                            <IconButton component="a" href="/" target="_blank" size="small" sx={{ color: '#cba6f7', mx: 'auto' }}>
                                <Home size={20} />
                            </IconButton>
                        </Tooltip>
                    )}
                    <Tooltip title={open ? 'Contraer' : 'Expandir'} placement="right">
                        <IconButton onClick={() => setOpen(!open)} sx={{ color: '#cdd6f4' }}>
                            <MenuIcon />
                        </IconButton>
                    </Tooltip>
                </Box>

                <Divider sx={{ borderColor: '#313244' }} />

                {/* Info usuario */}
                {open && user && (
                    <Box sx={{ px: 2, py: 1.5, backgroundColor: '#181825', borderBottom: '1px solid #313244' }}>
                        <Typography variant="caption" sx={{ color: '#6c7086' }} display="block">
                            Conectado como
                        </Typography>
                        <Typography variant="body2" fontWeight={600} noWrap sx={{ color: '#cba6f7' }}>
                            {user.name || user.email}
                        </Typography>
                    </Box>
                )}

                {/* Menú */}
                <List sx={{ flexGrow: 1, py: 1 }}>
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path ||
                            (item.path !== '/superadmin-dash' && location.pathname.startsWith(item.path));

                        return (
                            <Tooltip key={item.text} title={!open ? item.text : ''} placement="right">
                                <NavLink to={item.path} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <ListItemButton
                                        selected={isActive}
                                        sx={{
                                            justifyContent: open ? 'initial' : 'center',
                                            px: 2.5, mx: 1, mb: 0.5, borderRadius: 1,
                                            backgroundColor: isActive ? '#313244' : 'transparent',
                                            color: isActive ? '#cba6f7' : '#cdd6f4',
                                            '&:hover': { backgroundColor: '#313244' },
                                            '&.Mui-selected': { backgroundColor: '#313244' },
                                        }}
                                    >
                                        <ListItemIcon sx={{ minWidth: 0, mr: open ? 2 : 'auto', justifyContent: 'center', color: 'inherit' }}>
                                            {item.icon}
                                        </ListItemIcon>
                                        {open && (
                                            <ListItemText
                                                primary={item.text}
                                                primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: isActive ? 600 : 400 }}
                                            />
                                        )}
                                    </ListItemButton>
                                </NavLink>
                            </Tooltip>
                        );
                    })}
                </List>

                <Divider sx={{ borderColor: '#313244' }} />

                {/* Logout */}
                <Tooltip title={!open ? 'Cerrar sesión' : ''} placement="right">
                    <ListItemButton
                        onClick={logout}
                        sx={{
                            justifyContent: open ? 'initial' : 'center',
                            px: 2.5, mx: 1, my: 1, borderRadius: 1,
                            backgroundColor: '#f38ba8',
                            color: 'white',
                            '&:hover': { backgroundColor: '#e8627a' },
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: 0, mr: open ? 2 : 'auto', justifyContent: 'center', color: 'white' }}>
                            <LogOut size={20} />
                        </ListItemIcon>
                        {open && (
                            <ListItemText primary="Cerrar sesión"
                                primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 600 }} />
                        )}
                    </ListItemButton>
                </Tooltip>
            </Drawer>

            <Box component="main" className="bg-gray-50 min-h-screen"
                sx={{ flexGrow: 1, p: 3, transition: 'margin 0.3s ease' }}>
                <Box sx={{ height: 64 }} />
                <Outlet />
            </Box>
        </Box>
    );
};

export default SuperAdminSidebar;
