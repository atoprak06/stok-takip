import {
  useGetAllParentCategoriesMutation,
  useGetSubCategoryMutation,
  useUpdateSubCategoryMutation,
} from "@/api/api";
import { ParentCategoryI } from "@/types/Types";
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

const UpdateSubCategory = (props: Props) => {
  const location = useLocation();
  const { state } = location;
  const [getParentCategories] = useGetAllParentCategoriesMutation();
  const [getSubCategory] = useGetSubCategoryMutation();
  const [updateSubCategory] = useUpdateSubCategoryMutation();

  const [initialValues, setInitialValues] = useState({
    name: "",
    parentCategory: "",
  });

  const theme = useTheme();
  const navigate = useNavigate();

  const [parentCategory, setParentCategory] = useState([]);

  useEffect(() => {
    if (!state) {
      navigate("/dashboard");
    } else {
      const fetchData = async () => {
        const parentCategoryData = await getParentCategories("");
        const subCategoryData = await getSubCategory({ subCategoryId: state });

        if ("data" in subCategoryData) {
          setInitialValues({
            name: subCategoryData.data.name,
            parentCategory: subCategoryData.data.parentCategory
              ? subCategoryData.data.parentCategory.id
              : "",
          });
        }

        if ("data" in parentCategoryData) {
          setParentCategory(parentCategoryData.data);
        }
      };

      fetchData();
    }

    return () => {
      setInitialValues({
        name: "",
        parentCategory: "",
      });
      setParentCategory([]);
    };
  }, [getParentCategories, getSubCategory, navigate, state]);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    parentCategory: Yup.string().required("Parent category is required"),
  });

  const handleSubmit = async (values: any) => {
    const formData = new FormData();
    for (let value in values) {
      formData.append(value, values[value]);
    }
    await updateSubCategory({ subCategoryId: state, formData });
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
        Update Sub Category
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

export default UpdateSubCategory;
