import { ParentCategoryI } from "@/types/Types";
import { Avatar, Box, Button, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";

type Props = {
  parentCategoriesData: Array<ParentCategoryI>;
  activeParentCategory: number;
  handleActiveParentCategory: (parentCategoryId: number) => void;
  nullActive: boolean;
  setNullActive: any;
};

function ParentCategoriesWidget(props: Props) {
  const {
    parentCategoriesData,
    activeParentCategory,
    handleActiveParentCategory,
    nullActive,
    setNullActive,
  } = props;
  const theme = useTheme();
  const navigate = useNavigate();

  const categories = parentCategoriesData?.map((category) => {
    return (
      <Box
        key={"store" + category.id}
        display={"flex"}
        flexDirection={"column"}
        sx={{
          "&:hover": { cursor: "pointer" },
          backgroundColor:
            activeParentCategory === category.id ? theme.palette.grey[300] : "",
          p: 2,
          borderRadius: 2,
          justifyContent: "center",
          alignItems: "center",
        }}
        onClick={() => {
          setNullActive(false);
          handleActiveParentCategory(category.id);
        }}
      >
        <Avatar
          alt="img"
          src="/category.png"
          sx={{ width: "4rem", height: "4rem" }}
        />
        <Typography
          variant="h4"
          fontWeight={500}
          color={theme.palette.secondary.main}
        >
          {category.name}
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
          Total Categories : {parentCategoriesData?.length}
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
          onClick={() => navigate("/add-parent-category")}
        >
          Add Parent Category
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
        {categories}
        <Box
          display={"flex"}
          flexDirection={"column"}
          sx={{
            "&:hover": { cursor: "pointer" },
            backgroundColor: nullActive ? theme.palette.grey[300] : "",
            p: 2,
            borderRadius: 2,
            justifyContent: "center",
            alignItems: "center",
          }}
          onClick={() => {
            handleActiveParentCategory(0);
            setNullActive(!nullActive);
          }}
        >
          <Avatar
            alt="img"
            src="/null.jpg"
            sx={{ width: "4rem", height: "4rem" }}
          />
          <Typography
            variant="h4"
            fontWeight={500}
            color={theme.palette.secondary.main}
          >
            Null Sub-Categories
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default ParentCategoriesWidget;
