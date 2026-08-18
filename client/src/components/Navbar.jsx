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
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton
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
  ChevronDown,
  ArrowRight,
  Sparkles,
  Layers,
  MapPin
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
  const [mobileOpen, setMobileOpen] = useState(false);

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

  const NavButton = ({ to, icon: Icon, label, variant = 'text', highlight = false }) => {
    const active = isActive(to);
    return (
      <Button
        component={Link}
        to={to}
        startIcon={Icon ? <Icon size={15} /> : null}
        sx={{
          mx: 0.3,
          px: 1.8,
          py: 0.85,
          borderRadius: '9999px',
          fontSize: '0.8rem',
          fontWeight: 700,
          textTransform: 'none',
          letterSpacing: '-0.01em',
          color: active ? '#ea580c' : '#475569',
          backgroundColor: active ? 'rgba(234, 88, 12, 0.08)' : 'transparent',
          transition: 'all 200ms',
          '&:hover': {
            backgroundColor: 'rgba(234, 88, 12, 0.06)',
            color: '#ea580c',
            transform: 'translateY(-1px)'
          },
          ...(highlight && {
            backgroundColor: '#ea580c',
            color: '#ffffff',
            boxShadow: '0 4px 14px rgba(234, 88, 12, 0.25)',
            '&:hover': {
              backgroundColor: '#c2410c',
              color: '#ffffff',
              boxShadow: '0 6px 20px rgba(234, 88, 12, 0.35)',
              transform: 'translateY(-1px)'
            }
          })
        }}
      >
        {label}
      </Button>
    );
  };

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid',
          borderColor: 'rgba(226, 232, 240, 0.8)',
          color: '#0f172a',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          top: 0
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ minHeight: { xs: 60, md: 68 }, display: 'flex', justifyContent: 'space-between' }}>
            
            {/* Logo */}
            <Box
              component={Link}
              to="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.25,
                textDecoration: 'none',
                mr: { xs: 2, md: 4 }
              }}
            >
              <Box sx={{
                width: 34,
                height: 34,
                background: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 6px 14px -2px rgba(234, 88, 12, 0.35)'
              }}>
                <Typography sx={{ color: 'white', fontWeight: 900, fontSize: '0.85rem', letterSpacing: '-0.02em' }}>C+</Typography>
              </Box>
              <Typography
                variant="h6"
                noWrap
                sx={{
                  fontWeight: 900,
                  letterSpacing: '-0.03em',
                  fontSize: '1.25rem',
                  color: '#0f172a',
                  fontFamily: "'Space Grotesk', sans-serif",
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                CIVIC<span style={{ color: '#ea580c' }}>PLUS</span>
              </Typography>
            </Box>

            {/* Desktop Navigation */}
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
              {/* Guest / Public Links */}
              {!user && (
                <>
                  <NavButton to="/city-feed" icon={Radio} label="Live City Feed" />
                  <NavButton to="/login" icon={Shield} label="Gov Command Hub" />
                </>
              )}

              {/* Citizen Links */}
              {user?.role === 'citizen' && (
                <>
                  <NavButton to="/dashboard" icon={LayoutDashboard} label="My Issues" />
                  <NavButton to="/city-feed" icon={Radio} label="City Feed" />
                  <NavButton to="/report" icon={Plus} label="Report Issue" highlight />
                </>
              )}

              {/* Government Links */}
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 1.5 } }}>
              {/* Notifications for logged-in citizen */}
              {user?.role === 'citizen' && (
                <Box>
                  <Tooltip title="Notifications">
                    <IconButton
                      onClick={handleOpenNotifMenu}
                      sx={{
                        bgcolor: 'rgba(15, 23, 42, 0.04)',
                        border: '1px solid rgba(226, 232, 240, 0.8)',
                        '&:hover': { bgcolor: 'rgba(234, 88, 12, 0.08)', borderColor: 'rgba(234, 88, 12, 0.2)' }
                      }}
                    >
                      <Badge badgeContent={unreadCount} color="error" variant="dot" invisible={unreadCount === 0}>
                        <Bell size={18} color="#475569" />
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
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b' }}>LIVE EVENT STREAM</Typography>
                      <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#ea580c', bgcolor: '#fff7ed', px: 1, py: 0.25, borderRadius: 1 }}>{notifications.length}</Typography>
                    </Box>
                    <Divider />
                    {notifications.length === 0 ? (
                      <Box sx={{ py: 4, textAlign: 'center' }}>
                        <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8' }}>No new notifications</Typography>
                      </Box>
                    ) : (
                      notifications.map((n, idx) => (
                        <MenuItem key={idx} sx={{ py: 1.5, whiteSpace: 'normal' }}>
                          <Typography sx={{ fontSize: '0.8rem', color: '#334155' }}>{n.message}</Typography>
                        </MenuItem>
                      ))
                    )}
                  </Menu>
                </Box>
              )}

              {/* User Avatar Menu or Guest CTAs */}
              {user ? (
                <Box>
                  <Tooltip title="Account settings">
                    <Button
                      onClick={handleOpenUserMenu}
                      endIcon={<ChevronDown size={14} />}
                      sx={{
                        textTransform: 'none',
                        bgcolor: 'rgba(15, 23, 42, 0.04)',
                        border: '1px solid rgba(226, 232, 240, 0.8)',
                        px: 1.5,
                        py: 0.6,
                        borderRadius: '9999px',
                        '&:hover': { bgcolor: 'rgba(15, 23, 42, 0.08)' }
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 26,
                          height: 26,
                          fontSize: '0.75rem',
                          fontWeight: 900,
                          bgcolor: user.role === 'government' ? '#ea580c' : '#2563eb',
                          mr: 1
                        }}
                      >
                        {user.name?.[0]?.toUpperCase()}
                      </Avatar>
                      <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', display: { xs: 'none', sm: 'block' } }}>
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
                      <Typography sx={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a' }}>{user.name}</Typography>
                      <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#ea580c', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {user.role} Portal
                      </Typography>
                    </Box>
                    <Divider />
                    <MenuItem
                      component={Link}
                      to={user.role === 'government' ? '/gov-profile' : '/profile'}
                      onClick={handleCloseUserMenu}
                      sx={{ py: 1.25 }}
                    >
                      <ListItemIcon><User size={17} /></ListItemIcon>
                      <ListItemText primary="View Profile" primaryTypographyProps={{ sx: { fontSize: '0.8rem', fontWeight: 600 } }} />
                    </MenuItem>
                    <MenuItem onClick={handleLogout} sx={{ py: 1.25, color: '#ef4444' }}>
                      <ListItemIcon><LogOut size={17} color="#ef4444" /></ListItemIcon>
                      <ListItemText primary="Sign Out" primaryTypographyProps={{ sx: { fontSize: '0.8rem', fontWeight: 600 } }} />
                    </MenuItem>
                  </Menu>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Button
                    component={Link}
                    to="/login"
                    sx={{
                      textTransform: 'none',
                      fontSize: '0.825rem',
                      fontWeight: 700,
                      color: '#475569',
                      px: 2,
                      py: 0.85,
                      borderRadius: '9999px',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        color: '#0f172a'
                      }
                    }}
                  >
                    Sign In
                  </Button>

                  <Button
                    component={Link}
                    to="/register"
                    sx={{
                      textTransform: 'none',
                      fontSize: '0.825rem',
                      fontWeight: 700,
                      bgcolor: '#ea580c',
                      color: '#ffffff',
                      px: 2.25,
                      py: 0.85,
                      borderRadius: '9999px',
                      boxShadow: '0 4px 14px rgba(234, 88, 12, 0.25)',
                      transition: 'all 200ms',
                      '&:hover': {
                        bgcolor: '#c2410c',
                        boxShadow: '0 6px 18px rgba(234, 88, 12, 0.35)',
                        transform: 'scale(1.03)'
                      }
                    }}
                  >
                    Report Issue
                  </Button>
                </Box>
              )}

              {/* Mobile Hamburger Toggle */}
              <IconButton
                onClick={() => setMobileOpen(!mobileOpen)}
                sx={{
                  display: { xs: 'flex', md: 'none' },
                  bgcolor: 'rgba(15, 23, 42, 0.04)',
                  p: 1
                }}
              >
                {mobileOpen ? <X size={20} /> : <MenuIcon size={20} />}
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="top"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            top: 60,
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(20px)',
            p: 2.5,
            borderBottom: '1px solid #e2e8f0',
            boxShadow: '0 20px 40px rgba(0,0,0,0.08)'
          }
        }}
      >
        <List sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {!user && (
            <>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/city-feed" onClick={() => setMobileOpen(false)} sx={{ borderRadius: 2 }}>
                  <ListItemIcon><Radio size={18} color="#ea580c" /></ListItemIcon>
                  <ListItemText primary="Live City Feed" primaryTypographyProps={{ fontWeight: 700 }} />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/login" onClick={() => setMobileOpen(false)} sx={{ borderRadius: 2 }}>
                  <ListItemIcon><Shield size={18} color="#ea580c" /></ListItemIcon>
                  <ListItemText primary="Gov Command Hub" primaryTypographyProps={{ fontWeight: 700 }} />
                </ListItemButton>
              </ListItem>
              <Divider sx={{ my: 1 }} />
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/register" onClick={() => setMobileOpen(false)} sx={{ bgcolor: '#ea580c', color: '#fff', borderRadius: 2, textAlign: 'center', '&:hover': { bgcolor: '#c2410c' } }}>
                  <ListItemText primary="Report an Issue" primaryTypographyProps={{ fontWeight: 800, textAlign: 'center' }} />
                </ListItemButton>
              </ListItem>
            </>
          )}

          {user?.role === 'citizen' && (
            <>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/dashboard" onClick={() => setMobileOpen(false)}>
                  <ListItemIcon><LayoutDashboard size={18} /></ListItemIcon>
                  <ListItemText primary="My Issues" primaryTypographyProps={{ fontWeight: 700 }} />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/city-feed" onClick={() => setMobileOpen(false)}>
                  <ListItemIcon><Radio size={18} /></ListItemIcon>
                  <ListItemText primary="City Feed" primaryTypographyProps={{ fontWeight: 700 }} />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/report" onClick={() => setMobileOpen(false)} sx={{ bgcolor: '#ea580c', color: '#fff', borderRadius: 2, '&:hover': { bgcolor: '#c2410c' } }}>
                  <ListItemIcon><Plus size={18} color="#fff" /></ListItemIcon>
                  <ListItemText primary="Report Issue" primaryTypographyProps={{ fontWeight: 800 }} />
                </ListItemButton>
              </ListItem>
            </>
          )}

          {user?.role === 'government' && (
            <>
              {[
                { to: '/gov-dashboard', label: 'Command Center', icon: Shield },
                { to: '/gov-alerts', label: 'Alerts', icon: AlertTriangle },
                { to: '/gov-announcements', label: 'Broadcast', icon: Megaphone },
                { to: '/gov-work', label: 'Workers', icon: Briefcase },
                { to: '/gov-analytics', label: 'Analytics', icon: BarChart3 },
                { to: '/gov-budget', label: 'Budget', icon: Wallet },
                { to: '/gov-wards', label: 'Wards', icon: Activity },
                { to: '/gov-live', label: 'Live Map', icon: Globe },
              ].map((item) => (
                <ListItem key={item.to} disablePadding>
                  <ListItemButton component={Link} to={item.to} onClick={() => setMobileOpen(false)}>
                    <ListItemIcon><item.icon size={18} /></ListItemIcon>
                    <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 700 }} />
                  </ListItemButton>
                </ListItem>
              ))}
            </>
          )}
        </List>
      </Drawer>
    </>
  );
}
