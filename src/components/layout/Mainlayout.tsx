import { useState } from "react";
import type { MouseEvent } from "react";
import { Icon } from "@iconify/react";
import {
  AppBar,
  Avatar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Tooltip,
  MenuItem,
} from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";

const Main = styled("main")(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  marginTop: "70px",
}));

const settings = ["Profile", "Logout"];

export default function MainLayout() {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = (setting?: string) => {
    setAnchorElUser(null);

    if (setting === "Profile") navigate("/profile");

    if (setting === "Logout") {
      console.log("Logout clicked");
    }
  };

  return (
    <>
      {/* ---------- NAVBAR ---------- */}
      <AppBar position="fixed" sx={{ background: "#0d1117" }}>
        <Container maxWidth="xl">
          <Toolbar
            disableGutters
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            {/* ---------- LEFT: LOGO ---------- */}
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1, cursor: "pointer" }}
              onClick={() => navigate("/dashboard")}
            >
              <Icon icon="mdi:flash" width={32} height={32} />
              <Typography
                variant="h6"
                noWrap
                sx={{ fontWeight: 700, letterSpacing: ".1rem" }}
              >
                SWIFT
              </Typography>
            </Box>

            {/* ---------- RIGHT: USER ---------- */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography
                sx={{
                  fontSize: "1rem",
                  fontWeight: 500,
                  display: { xs: "none", sm: "block" },
                }}
              >
                Ashish
              </Typography>

              {/* PROFILE ICON → DIRECT REDIRECT */}
              <Tooltip title="Profile">
                <IconButton
                  onClick={() => navigate("/profile")}
                  sx={{ p: 0 }}
                >
                  <Avatar sx={{ bgcolor: "#222" }}>
                    <Icon icon="mdi:account" width={24} height={24} />
                  </Avatar>
                </IconButton>
              </Tooltip>

              {/* (Optional) MENU ICON FOR SETTINGS */}
              <IconButton onClick={handleOpenUserMenu}>
                <Icon icon="mdi:dots-vertical" width={24} height={24} />
              </IconButton>

              {/* ---------- DROPDOWN MENU ---------- */}
              <Menu
                sx={{ mt: "45px" }}
                anchorEl={anchorElUser}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                open={Boolean(anchorElUser)}
                onClose={() => handleCloseUserMenu()}
              >
                {settings.map((setting) => (
                  <MenuItem
                    key={setting}
                    onClick={() => handleCloseUserMenu(setting)}
                  >
                    {setting}
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* ---------- MAIN CONTENT ---------- */}
      <Main>
        <Outlet />
      </Main>
    </>
  );
}
