import { useAddSubCategoryMutation } from "@/api/api";
import { Box, Button, TextField, Typography, useTheme } from "@mui/material";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useEffect } from "react";

import { useLocation, useNavigate } from "react-router-dom";
import * as Yup from "yup";

type Props = {};

const AddSubCategory = (props: Props) => {
  const location = useLocation();
  const { state } = location;
  const [addSubCategory] = useAddSubCategoryMutation();
  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    if (!state) {
      navigate("/dashboard");
    }
  }, [navigate, state]);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
  });

  const initialValues = {
    name: "",
    parentCategory: state,
  };

  const handleSubmit = async (values: any) => {
    const formData = new FormData();
    for (let value in values) {
      formData.append(value, values[value]);
    }
    await addSubCategory(formData);
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
        Add Sub Category
      </Typography>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {() => (
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

export default AddSubCategory;
