import React, { useState, useCallback, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
  IconButton,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Container,
  Tooltip,
  Divider
} from '@mui/material';
import {
  Bell,
  LogOut,
  Shield,
  User,
  LayoutDashboard,
  Plus,
  Radio,
  AlertTriangle,
  Megaphone,
  BarChart3,
  Wallet,
  Activity,
  Globe,
  Briefcase,
  Menu as MenuIcon,
  X,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { notifications = [], markAllRead } = useSocket() ?? {};
  const navigate = useNavigate();
  const location = useLocation();

  // State
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElNotif, setAnchorElNotif] = useState(null);

  const unreadCount = useMemo(() =>
    (notifications ?? []).filter((n) => !n.read).length,
    [notifications]);

  // Handlers
  const handleOpenUserMenu = useCallback((event) => {
    setAnchorElUser(event.currentTarget);
  }, []);

  const handleCloseUserMenu = useCallback(() => {
    setAnchorElUser(null);
  }, []);

  const handleOpenNotifMenu = useCallback((event) => {
    setAnchorElNotif(event.currentTarget);
    markAllRead?.();
  }, [markAllRead]);

  const handleCloseNotifMenu = useCallback(() => {
    setAnchorElNotif(null);
  }, []);

  const handleLogout = useCallback(() => {
    handleCloseUserMenu();
    logout();
    navigate('/login');
  }, [logout, navigate, handleCloseUserMenu]);

  const isActive = useCallback((path) => location.pathname === path, [location]);

  const NavButton = ({ to, icon: Icon, label, variant = 'text', color = 'inherit' }) => (
    <Button
      component={Link}
      to={to}
      startIcon={<Icon size={16} />}
      sx={{
        mx: 0.5,
        px: 2,
        py: 1,
        borderRadius: 2,
        fontSize: '0.75rem',
        fontWeight: 700,
        textTransform: 'none',
        letterSpacing: '0.02em',
        color: isActive(to) ? 'primary.main' : '#64748b',
        backgroundColor: isActive(to) ? 'rgba(37, 99, 235, 0.05)' : 'transparent',
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.03)',
          color: '#0f172a'
        },
        ...(variant === 'contained' && {
          backgroundColor: '#2563eb',
          color: '#ffffff',
          '&:hover': { backgroundColor: '#1d4ed8' }
        })
      }}
    >
      {label}
    </Button>
  );

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid',
        borderColor: 'divider',
        color: '#0f172a',
        zIndex: (theme) => theme.zIndex.drawer + 1
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: { xs: 64, md: 72 } }}>
          {/* Logo */}
          <Box
            component={Link}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              textDecoration: 'none',
              mr: 4
            }}
          >
            <Box sx={{
              width: 32,
              height: 32,
              bgcolor: 'primary.main',
              borderRadius: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 16px -4px rgba(37, 99, 235, 0.4)'
            }}>
              <Typography sx={{ color: 'white', fontWeight: 900, fontSize: '0.8rem' }}>C+</Typography>
            </Box>
            <Typography
              variant="h6"
              noWrap
              sx={{
                fontWeight: 900,
                letterSpacing: '-0.02em',
                color: 'inherit',
                display: { xs: 'none', md: 'block' }
              }}
            >
              CivicPlus
            </Typography>
          </Box>

          {/* Desktop Navigation */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
            {user?.role === 'citizen' && (
              <>
                <NavButton to="/dashboard" icon={LayoutDashboard} label="My Issues" />
                <NavButton to="/city-feed" icon={Radio} label="City Feed" />
                <NavButton to="/report" icon={Plus} label="Report Issue" variant="contained" />
              </>
            )}
            {user?.role === 'government' && (
              <>
                <NavButton to="/gov-dashboard" icon={Shield} label="Command Center" />
                <NavButton to="/gov-alerts" icon={AlertTriangle} label="Alerts" />
                <NavButton to="/gov-announcements" icon={Megaphone} label="Broadcast" />
                <NavButton to="/gov-work" icon={Briefcase} label="Workers" />
                <NavButton to="/gov-analytics" icon={BarChart3} label="Analytics" />
                <NavButton to="/gov-budget" icon={Wallet} label="Budget" />
                <NavButton to="/gov-wards" icon={Activity} label="Wards" />
                <NavButton to="/gov-live" icon={Globe} label="Live" />
              </>
            )}
          </Box>

          {/* Right Side Actions */}
          <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center', gap: { xs: 1, md: 2 } }}>
            {user?.role === 'citizen' && (
              <Box>
                <Tooltip title="Notifications">
                  <IconButton
                    onClick={handleOpenNotifMenu}
                    sx={{
                      bgcolor: 'rgba(0,0,0,0.03)',
                      '&:hover': { bgcolor: 'rgba(0,0,0,0.06)' }
                    }}
                  >
                    <Badge badgeContent={unreadCount} color="error" variant="dot" invisible={unreadCount === 0}>
                      <Bell size={18} color="#64748b" />
                    </Badge>
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar-notif"
                  anchorEl={anchorElNotif}
                  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                  keepMounted
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  open={Boolean(anchorElNotif)}
                  onClose={handleCloseNotifMenu}
                  PaperProps={{
                    sx: { width: 320, borderRadius: 3, mt: 1, boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)' }
                  }}
                >
                  <Box sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8' }}>SYSTEM EVENTS</Typography>
                    <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: '#94a3b8', bgcolor: '#f1f5f9', px: 1, borderRadius: 1 }}>{notifications.length}</Typography>
                  </Box>
                  <Divider />
                  {notifications.length === 0 ? (
                    <Box sx={{ py: 4, textAlign: 'center' }}>
                      <Typography sx={{ fontSize: '0.7rem', color: '#94a3b8', letterSpacing: '0.1em' }}>NO_NEW_DATA</Typography>
                    </Box>
                  ) : (
                    notifications.map((n, idx) => (
                      <MenuItem key={idx} sx={{ py: 1.5, whiteSpace: 'normal' }}>
                        <Typography sx={{ fontSize: '0.8rem', color: '#475569' }}>{n.message}</Typography>
                      </MenuItem>
                    ))
                  )}
                </Menu>
              </Box>
            )}

            {user ? (
              <Box>
                <Tooltip title="Account settings">
                  <Button
                    onClick={handleOpenUserMenu}
                    endIcon={<ChevronDown size={14} />}
                    sx={{
                      textTransform: 'none',
                      bgcolor: 'rgba(0,0,0,0.03)',
                      px: 1.5,
                      py: 0.75,
                      borderRadius: 2.5,
                      '&:hover': { bgcolor: 'rgba(0,0,0,0.06)' }
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 24,
                        height: 24,
                        fontSize: '0.7rem',
                        fontWeight: 900,
                        bgcolor: user.role === 'government' ? 'error.main' : 'primary.main',
                        mr: 1
                      }}
                    >
                      {user.name?.[0]?.toUpperCase()}
                    </Avatar>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#1e293b', display: { xs: 'none', sm: 'block' } }}>
                      {user.name}
                    </Typography>
                  </Button>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar-user"
                  anchorEl={anchorElUser}
                  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                  keepMounted
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                  PaperProps={{
                    sx: { width: 220, borderRadius: 3, mt: 1, boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)' }
                  }}
                >
                  <Box sx={{ px: 2, py: 1.5 }}>
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 800, color: '#1e293b' }}>{user.name}</Typography>
                    <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {user.role} Account
                    </Typography>
                  </Box>
                  <Divider />
                  <MenuItem
                    component={Link}
                    to={user.role === 'government' ? '/gov-profile' : '/profile'}
                    onClick={handleCloseUserMenu}
                    sx={{ py: 1.5 }}
                  >
                    <ListItemIcon><User size={18} /></ListItemIcon>
                    <ListItemText primary="View Profile" primaryTypographyProps={{ sx: { fontSize: '0.8rem', fontWeight: 600 } }} />
                  </MenuItem>
                  <MenuItem onClick={handleLogout} sx={{ py: 1.5, color: 'error.main' }}>
                    <ListItemIcon><LogOut size={18} color="#ef4444" /></ListItemIcon>
                    <ListItemText primary="Sign Out" primaryTypographyProps={{ sx: { fontSize: '0.8rem', fontWeight: 600 } }} />
                  </MenuItem>
                </Menu>
              </Box>
            ) : (
              <Button
                component={Link}
                to="/login"
                sx={{
                  textTransform: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#64748b'
                }}
              >
                Sign In
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
