import {
  useCreateNewProductMutation,
  useGetParentCategoriesQuery,
  useGetSubCategoryByParentIdMutation,
} from "@/api/api";
import { ParentCategoryI, SubCategoryI } from "@/types/Types";
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

const AddProduct = (props: Props) => {
  const { data: parentCategoryData } = useGetParentCategoriesQuery("");
  const [getSubCategories] = useGetSubCategoryByParentIdMutation();
  const [createNewProduct] = useCreateNewProductMutation();
  const location = useLocation();
  const { state } = location;
  const theme = useTheme();
  const navigate = useNavigate();

  const [parentCategory, setParentCategory] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const handleParentCategoryChange = async (selectedCategory: string) => {
    const subCategoriesFetched = await getSubCategories({
      parentId: selectedCategory,
    });
    if ("data" in subCategoriesFetched) {
      setSubCategories(subCategoriesFetched.data);
    }
  };

  useEffect(() => {
    if (!state) {
      navigate("/dashboard");
    }
    setParentCategory(parentCategoryData);
    return () => {
      setParentCategory([]);
      setSubCategories([]);
    };
  }, [navigate, parentCategoryData, state]);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required").min(3),
    parentCategory: Yup.string().required("Parent category is required"),
    subCategory: Yup.string().required("Sub category is required"),
    stock: Yup.number().required("Stock is required").min(1),
    unit: Yup.string().required("Select unit"),
  });

  const initialValues = {
    name: "",
    parentCategory: "",
    subCategory: "",
    stock: "",
    unit: "",
    store: state,
  };

  const handleSubmit = async (values: any) => {
    const formData = new FormData();
    for (let value in values) {
      formData.append(value, values[value]);
    }
    await createNewProduct(formData);
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
        Add product
      </Typography>
      <Formik
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
                <InputLabel htmlFor="parentCategory">
                  Parent Category
                </InputLabel>
                <Select
                  id="parentCategory"
                  name="parentCategory"
                  label="Parent Category"
                  value={values.parentCategory}
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
                  value={values.subCategory}
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
                Add
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default AddProduct;
