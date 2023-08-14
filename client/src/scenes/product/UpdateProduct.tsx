import {
  useGetAllParentCategoriesMutation,
  useGetAllStoresMutation,
  useGetAttributeValuesByProductMutation,
  useGetAttributesBySubCategoryMutation,
  useGetProductByIdMutation,
  useGetSubCategoryByParentIdMutation,
  useGetUnitsQuery,
  useUpdateProductMutation,
} from "@/api/api";
import {
  AttributeI,
  AttributeValueI,
  ParentCategoryI,
  StoreI,
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

const UpdateProduct = (props: Props) => {
  const location = useLocation();
  const { state } = location;

  const [getProductData] = useGetProductByIdMutation();
  const [getSubCategories] = useGetSubCategoryByParentIdMutation();
  const [getParentCategories] = useGetAllParentCategoriesMutation();
  const [getStores] = useGetAllStoresMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [getAttributeValues] = useGetAttributeValuesByProductMutation();
  const [getAttributes] = useGetAttributesBySubCategoryMutation();
  const { data: unitData } = useGetUnitsQuery("");

  const theme = useTheme();
  const navigate = useNavigate();

  const [parentCategory, setParentCategory] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [stores, setStores] = useState([]);
  const [attributes, setAttributes] = useState<AttributeI[]>([]);

  const [initialValues, setInitialValues] = useState({
    name: "",
    parentCategory: "",
    subCategory: "",
    stock: 0,
    unit: "",
    store: "",
    attributes: [],
  });

  const handleParentCategoryChange = async (selectedCategory: string) => {
    if (parseInt(selectedCategory)) {
      setInitialValues((prev) => ({
        ...prev,
        subCategory: "",
        attributes: [],
        parentCategory: selectedCategory,
      }));
      const subCategoriesFetched = await getSubCategories({
        parentId: selectedCategory,
      });
      if ("data" in subCategoriesFetched) {
        setSubCategories(subCategoriesFetched?.data);
      }
    } else {
      setInitialValues((prev) => ({
        ...prev,
        subCategory: "",
        attributes: [],
        parentCategory: "",
      }));
      setSubCategories([]);
    }

    setAttributes([]);
  };

  const handleSubCategoryChange = async (selectedSubCategory: string) => {
    if (parseInt(selectedSubCategory)) {
      const attributesFetched = await getAttributes({
        subCategoryId: selectedSubCategory,
      });
      const attributeValuesFetched = await getAttributeValues({
        productId: state,
      });
      if ("data" in attributesFetched) {
        setAttributes(attributesFetched?.data);
        if ("data" in attributeValuesFetched) {
          const attributeInitialValues = attributeValuesFetched.data.reduce(
            (acc: Object, attribute: AttributeValueI) => {
              const fieldName = attribute.attribute.id;

              return {
                ...acc,
                [fieldName]: attribute.stringValue
                  ? attribute.stringValue
                  : attribute.numberValue
                  ? attribute.numberValue
                  : attribute.booleanValue,
              };
            },
            {},
          );
          setInitialValues((prev) => ({
            ...prev,
            attributes: attributeInitialValues,
            subCategory: selectedSubCategory,
          }));
        }
      }
    } else {
      setAttributes([]);
      setInitialValues((prev) => ({
        ...prev,
        attributes: [],
        subCategory: "",
      }));
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
          const attributesData = await getAttributes({
            subCategoryId:
              productData.data.subCategory !== null
                ? parseInt(productData.data.subCategory.id)
                : "",
          });
          const attributeValuesData = await getAttributeValues({
            productId: state,
          });

          if ("data" in attributeValuesData && "data" in attributesData) {
            const attributeInitialValues = attributeValuesData.data.reduce(
              (acc: Object, attribute: AttributeValueI) => {
                const attrId = attribute.attribute.id;
                const attributeValueType = attribute.attribute.valueType.name;
                let value;

                if (attributeValueType === "String") {
                  if (attribute.stringValue !== null) {
                    value = attribute.stringValue;
                  } else {
                    value = "";
                  }
                } else if (attributeValueType === "Number") {
                  if (attribute.numberValue !== null) {
                    value = attribute.numberValue;
                  } else {
                    value = "";
                  }
                } else {
                  if (attribute.booleanValue !== null) {
                    value = attribute.booleanValue;
                  } else {
                    value = false;
                  }
                }
                return {
                  ...acc,
                  [attrId]: value,
                };
              },
              {},
            );
            setAttributes(attributesData?.data);
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
              unit:
                productData.data.unit !== null ? productData.data.unit.id : "",
              store: productData.data.store.id,
              attributes: attributeInitialValues,
            });
          }
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
        attributes: [],
      });
      setParentCategory([]);
      setStores([]);
      setSubCategories([]);
      setAttributes([]);
    };
  }, [
    getParentCategories,
    getProductData,
    getStores,
    getSubCategories,
    navigate,
    state,
    getAttributeValues,
    getAttributes,
  ]);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    parentCategory: Yup.string().required("Parent category is required"),
    subCategory: Yup.string().required("Sub category is required"),
    stock: Yup.number().required("Stock is required").min(1),
    unit: Yup.string().required("Select unit"),
  });

  const handleSubmit = async (values: any) => {
    await updateProduct({ productId: state, values });
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
                    setFieldValue("subCategory", "");
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
                  onChange={(e) => {
                    const selectedSubCategory = e.target.value;
                    setFieldValue("subCategory", e.target.value);
                    handleSubCategoryChange(selectedSubCategory);
                    setFieldValue("attributes", []);
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

              {attributes?.map((attr: AttributeI) => {
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
                            : "";

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
