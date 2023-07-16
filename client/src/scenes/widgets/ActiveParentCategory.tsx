import {
  useDeleteSubCategoryMutation,
  useGetSubCategoryByParentIdMutation,
} from "@/api/api";
import { SubCategoryI } from "@/types/Types";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  useTheme,
} from "@mui/material";
import { DataGrid, GridCellParams } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  activeParentCategory: number;
  handleDeleteParentCategory: (storeId: number) => void;
};

const ActiveParentCategory = (props: Props) => {
  const { activeParentCategory, handleDeleteParentCategory } = props;
  const [getSubCategories] = useGetSubCategoryByParentIdMutation();
  const [deleteSubCategory] = useDeleteSubCategoryMutation();
  const [subCategories, setSubCategories] = useState<Array<SubCategoryI>>([]);
  const [showData, setShowData] = useState(false);
  const [buttonText, setButtonText] = useState("Fetch Data");
  const [open, setOpen] = useState(false);
  const [itemId, setItemId] = useState(0);

  const theme = useTheme();
  const navigate = useNavigate();

  const subCategoryColumns = [
    {
      field: "id",
      headerName: "Sub Category id",
      flex: 0.5,
    },
    {
      field: "name",
      headerName: "Sub Category Name",
      flex: 0.5,
      renderCell: (params: GridCellParams) => `${params.value}`,
    },
    {
      field: "parentCategory",
      headerName: "Parent Category",
      flex: 0.5,
      renderCell: (params: GridCellParams) => {
        const parentCategoryName =
          (params.value as { name?: string })?.name || "";
        return parentCategoryName;
      },
    },
    {
      field: "delete",
      headerName: "Delete",
      width: 150,
      sortable: false,
      renderCell: (params: any) => (
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => handleDeleteSubCategory(params.id)}
        >
          Delete
        </Button>
      ),
    },
    {
      field: "update",
      headerName: "Update",
      width: 150,
      sortable: false,
      renderCell: (params: any) => (
        <Button
          variant="outlined"
          color="primary"
          onClick={() => handleUpdate(params.id)}
        >
          Update
        </Button>
      ),
    },
  ];

  const handleDeleteSubCategory = (id: number) => {
    setOpen(true);
    setItemId(id);
  };

  const handleUpdate = (id: number) => {
    navigate("/update-sub-category", { state: id });
  };

  const handleConfirmation = async (confirmed: boolean) => {
    setOpen(false);
    if (confirmed) {
      await deleteSubCategory({ subCategoryId: itemId });
      const updatedSubCategories = subCategories.filter(
        (subCategory) => subCategory.id !== itemId,
      );
      setSubCategories(updatedSubCategories);

      setItemId(0);
    }
  };

  const retrieveData = async () => {
    if (activeParentCategory > 0 && subCategories.length === 0) {
      const response = await getSubCategories({
        parentId: activeParentCategory,
      });
      if ("data" in response) {
        setSubCategories(response.data);
        setShowData(!showData);
        setButtonText("Hide Data");
      }
    } else {
      setSubCategories([]);
      setShowData(showData);
      setButtonText("Show Data");
    }
  };

  useEffect(() => {
    setSubCategories([]);
    setShowData(false);
    setButtonText("Fetch Data");
  }, [activeParentCategory]);

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
      <Box display={"flex"} gap={2}>
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
          onClick={retrieveData}
        >
          {buttonText}
        </Button>
        <Button
          sx={{
            fontSize: "12px",
            color: theme.palette.secondary[800],
            background: theme.palette.secondary[300],
            "&:hover": {
              backgroundColor: theme.palette.secondary[800],
              color: theme.palette.secondary[300],
            },
            width: "10%",
          }}
          onClick={() =>
            navigate("/add-sub-category", { state: activeParentCategory })
          }
        >
          Add Sub Category
        </Button>
        <Button
          sx={{
            fontSize: "12px",
            color: theme.palette.text.primary,
            background: theme.palette.error.main,
            "&:hover": {
              backgroundColor: theme.palette.secondary[800],
              color: theme.palette.secondary[300],
            },
            width: "10%",
          }}
          onClick={() => handleDeleteParentCategory(activeParentCategory)}
        >
          Delete Parent Category
        </Button>
      </Box>

      {subCategories.length > 0 && (
        <DataGrid
          rows={subCategories}
          columns={subCategoryColumns}
          hideFooter={true}
          rowHeight={35}
          columnHeaderHeight={25}
        />
      )}
      <Dialog open={open} onClose={() => handleConfirmation(false)}>
        <DialogTitle>Delete Sub Category</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this Sub-Category?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleConfirmation(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => handleConfirmation(true)}
            color="secondary"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ActiveParentCategory;
