import {
  useCreateNewProductMutation,
  useGetAttributesBySubCategoryMutation,
  useGetParentCategoriesQuery,
  useGetSubCategoryByParentIdMutation,
  useGetUnitsQuery,
} from "@/api/api";
import {
  AttributeI,
  ParentCategoryI,
  SubCategoryI,
  UnitI,
} from "@/types/Types";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { ChangeEvent, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as Yup from "yup";

type Props = {};

const AddProduct = (props: Props) => {
  const { data: parentCategoryData } = useGetParentCategoriesQuery("");
  const { data: unitData } = useGetUnitsQuery("");
  const [getSubCategories] = useGetSubCategoryByParentIdMutation();
  const [getAttributes] = useGetAttributesBySubCategoryMutation();
  const [createNewProduct] = useCreateNewProductMutation();
  const location = useLocation();
  const { state } = location;
  const theme = useTheme();
  const navigate = useNavigate();

  const [parentCategory, setParentCategory] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [attributes, setAttributes] = useState<AttributeI[]>([]);
  const [initialValues, setInitialValues] = useState({
    name: "",
    parentCategory: "",
    subCategory: "",
    stock: "",
    unit: "",
    store: state,
    attributes: [],
  });

  const handleParentCategoryChange = async (selectedCategory: string) => {
    if (parseInt(selectedCategory) > 0) {
      const subCategoriesFetched = await getSubCategories({
        parentId: selectedCategory,
      });
      if ("data" in subCategoriesFetched) {
        setSubCategories(subCategoriesFetched.data);
      }
    } else {
      setSubCategories([]);
      setAttributes([]);
    }
  };

  const handleSubCategoryChange = async (selectedSubCategory: string) => {
    if (parseInt(selectedSubCategory) > 0) {
      const attributesFetched = await getAttributes({
        subCategoryId: selectedSubCategory,
      });
      if ("data" in attributesFetched) {
        setAttributes(attributesFetched.data);
        const attributeInitialValues = attributesFetched.data.reduce(
          (acc: Object, attribute: AttributeI) => {
            const fieldName = attribute.id;
            return {
              ...acc,
              [fieldName]: "",
            };
          },
          {},
        );
        setInitialValues((prev) => {
          return { ...prev, attributes: attributeInitialValues };
        });
      }
    } else {
      setAttributes([]);
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
      setAttributes([]);
    };
  }, [navigate, parentCategoryData, state]);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required").min(3),
    parentCategory: Yup.string().required("Parent category is required"),
    subCategory: Yup.string().required("Sub category is required"),
    stock: Yup.number().required("Stock is required").min(1),
    unit: Yup.string().required("Select unit"),
  });

  const handleSubmit = async (values: any) => {
    await createNewProduct(values);
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
                    setFieldValue("subCategory", "");
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
                  onChange={(e) => {
                    setFieldValue("subCategory", e.target.value);
                    handleSubCategoryChange(e.target.value);
                    setFieldValue("attributes", {});
                  }}
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
                  {unitData?.map((unit: UnitI) => (
                    <MenuItem key={unit.id} value={unit.id}>
                      {unit.name}
                    </MenuItem>
                  ))}
                </Field>
                <ErrorMessage name="unit" component="div" />
              </FormControl>

              <Typography
                variant="h4"
                color={theme.palette.primary.main}
                fontWeight={500}
                mx={"auto"}
                sx={{ textDecoration: "underline" }}
              >
                Attributes
              </Typography>

              {attributes?.map((attr) => {
                const matchingValue = values.attributes[attr.id];
                if (attr.valueType.name === "String") {
                  return (
                    <Field
                      value={matchingValue !== undefined ? matchingValue : ""}
                      key={`attr_${attr.id}`}
                      as={TextField}
                      type="text"
                      id={`attr_${attr.id}`}
                      name={attr.name}
                      label={attr.name}
                      variant="outlined"
                      fullWidth
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setFieldValue("attributes", {
                          ...values.attributes,
                          [attr.id]: e.target.value,
                        });
                      }}
                    />
                  );
                } else if (attr.valueType.name === "Boolean") {
                  return (
                    <FormControlLabel
                      key={`attr_${attr.id}`}
                      control={
                        <Field
                          as={Checkbox}
                          type="checkbox"
                          id={`attr_${attr.id}`}
                          name={attr.name}
                          checked={
                            matchingValue !== undefined ? matchingValue : false
                          }
                          onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            setFieldValue("attributes", {
                              ...values.attributes,
                              [attr.id]: e.target.checked,
                            });
                          }}
                        />
                      }
                      label={attr.name}
                    />
                  );
                } else if (attr.valueType.name === "Number") {
                  return (
                    <Field
                      value={matchingValue !== undefined ? matchingValue : ""}
                      key={`attr_${attr.id}`}
                      as={TextField}
                      type="number"
                      id={`attr_${attr.id}`}
                      name={attr.name}
                      label={attr.name}
                      variant="outlined"
                      fullWidth
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        const newValue =
                          e.target.value !== ""
                            ? parseFloat(e.target.value)
                            : null;

                        setFieldValue("attributes", {
                          ...values.attributes,
                          [attr.id]: newValue,
                        });
                      }}
                    />
                  );
                }
                return null;
              })}

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
