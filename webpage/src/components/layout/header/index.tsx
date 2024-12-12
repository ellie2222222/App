import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import MenuIcon from "@mui/icons-material/Menu";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useTheme } from "../../../contexts/ThemeContext";
import './index.scss';

const Header: React.FC = () => {
  const navItems = ["Home", "About", "Contact"];
  const userSettings = ["Profile", "Account", "Dashboard", "Logout"];
  const { theme, toggleTheme } = useTheme();

  const HeaderComponent = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

    const handleDrawerToggle = () => {
      setMobileOpen((prev) => !prev);
    };

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
      setAnchorElUser(null);
    };

    const drawer = (
      <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
        <Typography variant="h6" sx={{ my: 2 }}>
          MUI
        </Typography>
        <Divider />
        <List>
          {navItems.map((item) => (
            <ListItem key={item} disablePadding>
              <ListItemButton sx={{ textAlign: "center" }}>
                <ListItemText primary={item} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    );

    return (
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {/* Drawer */}
        <Drawer
          anchor="left"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { 
              boxSizing: "border-box", 
              width: 240, 
              backgroundColor: theme.palette.background.default ,
              color: theme.palette.text.primary
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* AppBar */}
        <AppBar position="sticky" sx={{ backgroundColor: theme.palette.background.default }}>
          <Toolbar sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
            {/* Drawer Toggle (Mobile) */}
            <IconButton
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" }, color: theme.palette.text.primary }}
            >
              <MenuIcon />
            </IconButton>
            
            <Typography
              variant="h6"
              sx={{
                display: { xs: "none", sm: "block", color: theme.palette.text.primary },
              }}
            >
              MUI
            </Typography>

            {/* Navigation in the center */}
            <Box sx={{ display: "flex", flexGrow: 1, justifyContent: "center" }}>
              {navItems.map((item) => (
                <Button key={item} sx={{ color: theme.palette.text.primary, marginX: 2 }}>
                  {item}
                </Button>
              ))}
            </Box>

            {/* Dark/Light Mode and User Menu on the right */}
            <Box sx={{ display: "flex", ml: "auto" }}>
              {/* Dark/Light Mode Button */}
              <Button sx={{ color: theme.palette.text.primary }} onClick={toggleTheme}>
                {theme.palette.mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
              </Button>

              {/* User Menu */}
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="User Avatar" src="/static/images/avatar/2.jpg" sx={{ backgroundColor: theme.palette.text.primary }} />
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={anchorElUser}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                keepMounted
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
                sx={{ ".MuiMenu-paper": { backgroundColor: theme.palette.background.default }}}
              >
                {userSettings.map((setting) => (
                  <MenuItem key={setting} onClick={handleCloseUserMenu} sx={{ color: theme.palette.text.primary }}>
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
    );
  };

  return <HeaderComponent />;
};

export default Header;
