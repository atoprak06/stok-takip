import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useEffect, useState } from "react";
import StoresWidget from "../widgets/StoresWidget";
import ActiveStore from "../widgets/ActiveStore";
import {
  useDeleteParentCategoryMutation,
  useDeleteStoreMutation,
  useGetAllParentCategoriesMutation,
  useGetAllStoresMutation,
} from "@/api/api";
import { ParentCategoryI, StoreI } from "@/types/Types";
import ParentCategoriesWidget from "../widgets/ParentCategoriesWidget";
import ActiveParentCategory from "../widgets/ActiveParentCategory";
import NullActive from "../widgets/NullActive";

const AdminDashBoard = () => {
  const [deleteStore] = useDeleteStoreMutation();
  const [getStores] = useGetAllStoresMutation();
  const [getParentCategories] = useGetAllParentCategoriesMutation();
  const [deleteParentCategory] = useDeleteParentCategoryMutation();
  const [activeStore, setActiveStore] = useState(0);
  const [openStore, setOpenStore] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);
  const [itemId, setItemId] = useState(0);
  const [storesData, setStoresData] = useState([]);
  const [activeParentCategory, setActiveParentCategory] = useState(0);
  const [parentCategoriesData, setParentCategoriesData] = useState([]);
  const [nullActive, setNullActive] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const stores = await getStores("");
      const parentCategories = await getParentCategories("");
      if ("data" in stores) {
        setStoresData(stores.data);
      }
      if ("data" in parentCategories) {
        setParentCategoriesData(parentCategories.data);
      }
    };
    fetchData();
    return () => {
      setStoresData([]);
    };
  }, [getParentCategories, getStores]);

  const handleActiveStore = (storeId: number) => {
    if (activeStore === storeId) {
      setActiveStore(0);
    } else {
      setActiveStore(storeId);
    }
  };

  const handleDeleteStore = (storeId: number) => {
    setOpenStore(true);
    setItemId(storeId);
  };

  const handleConfirmationStore = async (confirmed: boolean) => {
    setOpenStore(false);
    if (confirmed) {
      await deleteStore({ storeId: itemId });

      const updatedStore = storesData?.filter(
        (store: StoreI) => store.id !== itemId,
      );
      setStoresData(updatedStore);
      setItemId(0);
      setActiveStore(0);
    }
  };

  const handleConfirmationCategory = async (confirmed: boolean) => {
    setOpenCategory(false);
    if (confirmed) {
      await deleteParentCategory({ parentCategoryId: itemId });

      const updatedParentCategory = parentCategoriesData?.filter(
        (parentCategory: ParentCategoryI) => parentCategory.id !== itemId,
      );
      setParentCategoriesData(updatedParentCategory);
      setItemId(0);
      setActiveParentCategory(0);
    }
  };

  const handleActiveParentCategory = (parentCategoryId: number) => {
    if (activeParentCategory === parentCategoryId) {
      setActiveParentCategory(0);
    } else {
      setActiveParentCategory(parentCategoryId);
    }
  };

  const handleDeleteParentCategory = (storeId: number) => {
    setOpenCategory(true);
    setItemId(storeId);
  };

  return (
    <Box py={2} px={4} display={"flex"} flexDirection={"column"} gap={2}>
      <StoresWidget
        activeStore={activeStore}
        handleActiveStore={(storeId: number) => handleActiveStore(storeId)}
        storesData={storesData}
      />
      {activeStore > 0 ? (
        <ActiveStore
          handleDeleteStore={(storeId: number) => handleDeleteStore(storeId)}
          activeStore={activeStore}
        />
      ) : (
        ""
      )}
      <ParentCategoriesWidget
        parentCategoriesData={parentCategoriesData}
        activeParentCategory={activeParentCategory}
        handleActiveParentCategory={(parentCategoryId: number) =>
          handleActiveParentCategory(parentCategoryId)
        }
        setNullActive={setNullActive}
        nullActive={nullActive}
      />
      {activeParentCategory > 0 ? (
        <ActiveParentCategory
          handleDeleteParentCategory={(parentCategoryId: number) =>
            handleDeleteParentCategory(parentCategoryId)
          }
          activeParentCategory={activeParentCategory}
        />
      ) : nullActive ? (
        <NullActive nullActive={nullActive} />
      ) : (
        ""
      )}
      <Dialog open={openStore} onClose={() => handleConfirmationStore(false)}>
        <DialogTitle>Delete Store</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this Store? Deleting the Store will
          also remove all associated products.
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => handleConfirmationStore(false)}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            onClick={() => handleConfirmationStore(true)}
            color="secondary"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openCategory}
        onClose={() => handleConfirmationCategory(false)}
      >
        <DialogTitle>Delete Parent Category</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this Parent-Category? Deleting the
          Parent-Category will also remove all associated Sub-Categories.
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => handleConfirmationCategory(false)}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            onClick={() => handleConfirmationCategory(true)}
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

export default AdminDashBoard;
