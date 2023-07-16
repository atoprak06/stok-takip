import {
  useDeleteProductMutation,
  useGetProductsByStoreMutation,
} from "@/api/api";
import { ProductI } from "@/types/Types";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Pagination,
  useTheme,
} from "@mui/material";
import { DataGrid, GridCellParams } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  activeStore: number;
  handleDeleteStore: (storeId: number) => void;
};

const ActiveStore = (props: Props) => {
  const { activeStore, handleDeleteStore } = props;
  const [getProductsByStore] = useGetProductsByStoreMutation();
  const [deleteProduct] = useDeleteProductMutation();
  const page = 0;
  const [countData, setCountData] = useState<number>();
  const [products, setProducts] = useState<Array<ProductI>>([]);
  const [showData, setShowData] = useState(false);
  const [buttonText, setButtonText] = useState("Fetch Data");
  const [open, setOpen] = useState(false);
  const [itemId, setItemId] = useState(0);

  const theme = useTheme();
  const navigate = useNavigate();

  const productColumns = [
    {
      field: "id",
      headerName: "product id",
      flex: 0.5,
    },
    {
      field: "name",
      headerName: "name",
      flex: 0.5,
      renderCell: (params: GridCellParams) => `${params.value}`,
    },
    {
      field: "stock",
      headerName: "stock",
      flex: 0.5,
      renderCell: (params: GridCellParams) => `${params.value}`,
    },
    {
      field: "unit",
      headerName: "unit",
      flex: 0.5,
      renderCell: (params: GridCellParams) => `${params.value}`,
    },
    {
      field: "subCategory",
      headerName: "Sub Category",
      flex: 0.5,
      renderCell: (params: GridCellParams) => {
        const subCategoryName = (params.value as { name?: string })?.name || "";
        return subCategoryName;
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
          onClick={() => handleDeleteProduct(params.id)}
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

  const handleDeleteProduct = (id: number) => {
    setOpen(true);
    setItemId(id);
  };

  const handleUpdate = (id: number) => {
    navigate("/update-product", { state: id });
  };

  const handleConfirmation = async (confirmed: boolean) => {
    setOpen(false);
    if (confirmed) {
      await deleteProduct({ productId: itemId });
      const updatedProducts = products.filter(
        (product) => product.id !== itemId,
      );
      setProducts(updatedProducts);

      setItemId(0);
    }
  };

  const retrieveData = async () => {
    if (activeStore > 0 && products.length === 0) {
      const response = await getProductsByStore({
        storeId: `${activeStore}`,
        page,
      });
      if ("data" in response) {
        setCountData(response.data.count);
        setProducts(response.data.products);
        setShowData(!showData);
        setButtonText("Hide Data");
      }
    } else {
      setCountData(0);
      setProducts([]);
      setShowData(showData);
      setButtonText("Show Data");
    }
  };

  const handlePageChange = async (
    event: React.ChangeEvent<unknown>,
    page: number,
  ) => {
    const response = await getProductsByStore({
      storeId: `${activeStore}`,
      page,
    });
    if ("data" in response) {
      setCountData(response.data.count);
      setProducts(response.data.products);
    }
  };

  useEffect(() => {
    setCountData(0);
    setProducts([]);
    setShowData(false);
    setButtonText("Fetch Data");
  }, [activeStore]);

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
          onClick={() => navigate("/add-product", { state: activeStore })}
        >
          Add Product
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
          onClick={() => handleDeleteStore(activeStore)}
        >
          Delete Store
        </Button>
      </Box>

      {products.length > 0 && (
        <DataGrid
          rows={products}
          columns={productColumns}
          hideFooter={true}
          rowHeight={35}
          columnHeaderHeight={25}
        />
      )}
      {countData && countData > 0 ? (
        <Pagination
          onChange={(event, page) => handlePageChange(event, page - 1)}
          sx={{ mx: "auto" }}
          count={Math.ceil(countData / 15)}
        />
      ) : (
        ""
      )}
      <Dialog open={open} onClose={() => handleConfirmation(false)}>
        <DialogTitle>Delete Product</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this item?
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

export default ActiveStore;
