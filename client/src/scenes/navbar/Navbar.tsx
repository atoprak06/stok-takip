import FlexBetween from "@/components/FlexBetween";
import { setLogout } from "@/state/state";
import { StateI } from "@/types/Types";
import { IconButton, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import StoreIcon from "@mui/icons-material/Store";
import LogoutIcon from "@mui/icons-material/Logout";
import { useVerifyTokenQuery } from "@/api/api";
import Loading from "@/components/Loading";

const Navbar = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const token = useSelector<StateI>(
    (state) => state.persistedReducer.token,
  ) as string;

  const { data, isLoading } = useVerifyTokenQuery("", {
    skip: !token,
  });

  const handleLogout = () => {
    dispatch(setLogout());
    navigate("/");
  };

  if (isLoading) return <Loading />;

  return (
    <div className="Navbar">
      <FlexBetween px={4} py={2}>
        <IconButton
          onClick={() => navigate("/")}
          sx={{
            width: "fit",
            borderRadius: 0,
          }}
        >
          <FlexBetween gap={2}>
            <StoreIcon
              sx={{ color: theme.palette.primary.main, fontSize: "2rem" }}
            />
            <Typography
              variant="h1"
              fontWeight={700}
              color={theme.palette.primary.main}
            >
              StokTakip
            </Typography>
          </FlexBetween>
        </IconButton>

        {token?.length > 0 ? (
          <FlexBetween gap={1}>
            <Typography variant="h4" color={theme.palette.primary.main}>
              role-{data?.sub}
            </Typography>
            <IconButton
              onClick={handleLogout}
              sx={{
                width: "fit",
                borderRadius: 2,
                backgroundColor: theme.palette.primary.main,
              }}
            >
              <FlexBetween gap={1}>
                <LogoutIcon sx={{ color: theme.palette.secondary.main }} />
                <Typography variant="h4" color={theme.palette.grey[800]}>
                  Log Out
                </Typography>
              </FlexBetween>
            </IconButton>
          </FlexBetween>
        ) : (
          <IconButton
            onClick={() => navigate("/auth")}
            sx={{
              width: "5rem%",
              borderRadius: 2,
              backgroundColor: theme.palette.primary.main,
            }}
          >
            <Typography variant="h4" color={theme.palette.grey[800]}>
              Login
            </Typography>
          </IconButton>
        )}
      </FlexBetween>
    </div>
  );
};

export default Navbar;
