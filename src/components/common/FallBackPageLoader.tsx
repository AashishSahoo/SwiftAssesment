import { Box, Skeleton } from "@mui/material";


export default function FallBackPageLoader() {
  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: { xs: 2, sm: 2, md: 2 },
        backgroundColor: (theme) => theme.palette.background.default,
        zIndex: 9999,
      }}
    >
      <Skeleton
        variant="rectangular"
        animation="wave"
        width="100%"
        height="100%"
        sx={{
          borderRadius: 3,
          bgcolor: (theme) => theme.palette.action.hover,
        }}
      />
    </Box>
  );
}
