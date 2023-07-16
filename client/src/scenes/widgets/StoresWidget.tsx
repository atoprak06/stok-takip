import { StoreI } from "@/types/Types";
import { Avatar, Box, Button, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";

type Props = {
  activeStore: number;
  handleActiveStore: (storeId: number) => void;
  storesData: Array<StoreI> | undefined;
};

function StoresWidget(props: Props) {
  const { activeStore, handleActiveStore, storesData } = props;

  const theme = useTheme();
  const navigate = useNavigate();

  const stores = storesData?.map((store) => {
    return (
      <Box
        key={"store" + store.id}
        display={"flex"}
        flexDirection={"column"}
        sx={{
          "&:hover": { cursor: "pointer" },
          backgroundColor:
            activeStore === store.id ? theme.palette.grey[300] : "",
          p: 2,
          borderRadius: 2,
          justifyContent: "center",
          alignItems: "center",
        }}
        onClick={() => handleActiveStore(store.id)}
      >
        <Avatar
          alt="img"
          src="/storage.png"
          sx={{ width: "4rem", height: "4rem" }}
        />
        <Typography
          variant="h4"
          fontWeight={500}
          color={theme.palette.secondary.main}
        >
          {store.name}
        </Typography>
      </Box>
    );
  });

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.grey[100],
        p: "1rem 6%",
        borderRadius: "0.7rem",
        display: "flex",
        flexDirection: "column",
        textAlign: "center",
        justifyContent: "center",
        gap: 4,
      }}
    >
      <Box
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        width={"100%"}
      >
        <Typography
          variant="h1"
          fontWeight={700}
          color={theme.palette.primary.light}
          sx={{ textAlign: "center", flex: "1" }}
        >
          Total Stores : {storesData?.length}
        </Typography>
        <Button
          sx={{
            fontSize: "12px",
            color: theme.palette.primary[800],
            background: theme.palette.primary[300],
            "&:hover": {
              backgroundColor: theme.palette.primary[800],
              color: theme.palette.primary[300],
            },
            width: "10%",
          }}
          onClick={() => navigate("/add-store")}
        >
          Add Store
        </Button>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(125px, 1fr))",
          overflowX: "auto",
          overflowY: "auto",
        }}
      >
        {stores}
      </Box>
    </Box>
  );
}

export default StoresWidget;
