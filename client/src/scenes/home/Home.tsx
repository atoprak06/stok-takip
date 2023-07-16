import { Box, Typography, useTheme } from "@mui/material";

const Home = () => {
  const theme = useTheme();
  return (
    <Box
      textAlign={"center"}
      height={"100%"}
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{
        backgroundImage: `linear-gradient(to bottom, ${theme.palette.primary.main}, ${theme.palette.grey[900]})`,
      }}
    >
      <Typography
        variant="h1"
        fontWeight={700}
        fontSize={"7rem"}
        color={theme.palette.grey[200]}
        my="auto"
      >
        Manage your inventory efficiently with our powerful app.
      </Typography>
    </Box>
  );
};

export default Home;
