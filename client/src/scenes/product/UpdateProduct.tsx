import {
  useGetAllParentCategoriesMutation,
  useGetAllStoresMutation,
  useGetProductByIdMutation,
  useGetSubCategoryByParentIdMutation,
  useUpdateProductMutation,
} from "@/api/api";
import { ParentCategoryI, StoreI, SubCategoryI } from "@/types/Types";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as Yup from "yup";

type Props = {};

const UpdateProduct = (props: Props) => {
  const location = useLocation();
  const { state } = location;

  const [getProductData] = useGetProductByIdMutation();
  const [getSubCategories] = useGetSubCategoryByParentIdMutation();
  const [getParentCategories] = useGetAllParentCategoriesMutation();
  const [getStores] = useGetAllStoresMutation();
  const [updateProduct] = useUpdateProductMutation();

  const theme = useTheme();
  const navigate = useNavigate();

  const [parentCategory, setParentCategory] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [stores, setStores] = useState([]);
  const [initialValues, setInitialValues] = useState({
    name: "",
    parentCategory: "",
    subCategory: "",
    stock: 0,
    unit: "",
    store: "",
  });

  const handleParentCategoryChange = async (selectedCategory: string) => {
    const subCategoriesFetched = await getSubCategories({
      parentId: selectedCategory,
    });
    if ("data" in subCategoriesFetched) {
      setSubCategories(subCategoriesFetched?.data);
    }
  };

  useEffect(() => {
    if (!state) {
      navigate("/dashboard");
    } else {
      const fetchData = async () => {
        const productData = await getProductData({ productId: state });
        const parentCategoryData = await getParentCategories("");
        const storeData = await getStores("");
        if ("data" in productData && productData?.data?.subCategory !== null) {
          const subCategoryData = await getSubCategories({
            parentId: productData?.data?.subCategory?.parentCategory?.id,
          });
          if ("data" in subCategoryData) {
            setSubCategories(subCategoryData.data);
          }
        }

        if ("data" in productData) {
          setInitialValues({
            name: productData.data.name,
            parentCategory:
              productData.data.subCategory !== null
                ? productData.data.subCategory.parentCategory?.id
                : "",
            subCategory:
              productData.data.subCategory !== null
                ? productData.data.subCategory.id
                : "",
            stock: productData.data.stock,
            unit: productData.data.unit,
            store: productData.data.store.id,
          });
        }
        if ("data" in parentCategoryData) {
          setParentCategory(parentCategoryData.data);
        }
        if ("data" in storeData) {
          setStores(storeData.data);
        }
      };

      fetchData();
    }

    return () => {
      setInitialValues({
        name: "",
        parentCategory: "",
        subCategory: "",
        stock: 0,
        unit: "",
        store: "",
      });
      setParentCategory([]);
      setStores([]);
      setSubCategories([]);
    };
  }, [
    getParentCategories,
    getProductData,
    getStores,
    getSubCategories,
    navigate,
    state,
  ]);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    parentCategory: Yup.string().required("Parent category is required"),
    subCategory: Yup.string().required("Sub category is required"),
    stock: Yup.number().required("Stock is required").min(1),
    unit: Yup.string().required("Select unit"),
  });

  const handleSubmit = async (values: any) => {
    const formData = new FormData();
    for (let value in values) {
      formData.append(value, values[value]);
    }
    await updateProduct({ productId: state, formData });
    navigate("/");
  };

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      gap={4}
    >
      <Typography variant="h1" color={theme.palette.primary.main}>
        Update product
      </Typography>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue }) => (
          <Form>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                maxWidth: "400px",
                margin: "0 auto",
              }}
            >
              <Field
                as={TextField}
                type="text"
                id="name"
                name="name"
                label="Name"
                variant="outlined"
                fullWidth
              />
              <ErrorMessage name="name" component="div" />

              <FormControl variant="outlined" fullWidth>
                <InputLabel htmlFor="store">Stores</InputLabel>
                <Select
                  id="store"
                  name="store"
                  label="store"
                  value={values?.store || ""}
                  onChange={(e) => {
                    setFieldValue("store", e.target.value);
                  }}
                >
                  <MenuItem value="">Select a store</MenuItem>
                  {stores?.map((store: StoreI) => (
                    <MenuItem key={store.id} value={store.id}>
                      {store.name}
                    </MenuItem>
                  ))}
                </Select>
                <ErrorMessage name="stores" component="div" />
              </FormControl>

              <FormControl variant="outlined" fullWidth>
                <InputLabel htmlFor="parentCategory">
                  Parent Category
                </InputLabel>
                <Select
                  id="parentCategory"
                  name="parentCategory"
                  label="Parent Category"
                  value={values?.parentCategory || ""}
                  onChange={(e) => {
                    const selectedCategory = e.target.value;
                    setFieldValue("parentCategory", selectedCategory);
                    handleParentCategoryChange(selectedCategory);
                  }}
                >
                  <MenuItem value="">Select a parent category</MenuItem>
                  {parentCategory?.map((category: ParentCategoryI) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
                <ErrorMessage name="parentCategory" component="div" />
              </FormControl>

              <FormControl variant="outlined" fullWidth>
                <InputLabel htmlFor="subCategory">Sub Category</InputLabel>
                <Select
                  id="subCategory"
                  name="subCategory"
                  label="Sub Category"
                  value={values?.subCategory}
                  onChange={(e) => setFieldValue("subCategory", e.target.value)}
                >
                  <MenuItem value="">Select a sub-category</MenuItem>
                  {subCategories?.map((category: SubCategoryI) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
                <ErrorMessage name="subCategory" component="div" />
              </FormControl>

              <Field
                as={TextField}
                type="number"
                id="stock"
                name="stock"
                label="Stock"
                variant="outlined"
                fullWidth
              />
              <ErrorMessage name="stock" component="div" />

              <FormControl variant="outlined" fullWidth>
                <InputLabel htmlFor="unit">Unit</InputLabel>
                <Field as={Select} id="unit" name="unit" label="Unit">
                  <MenuItem value="">Select a unit</MenuItem>
                  <MenuItem value="piece">Piece</MenuItem>
                  <MenuItem value="kg">Kg</MenuItem>
                </Field>
                <ErrorMessage name="unit" component="div" />
              </FormControl>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Update
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default UpdateProduct;
