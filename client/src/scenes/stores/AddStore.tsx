import { useAddStoreMutation } from "@/api/api";
import { Box, Button, TextField, Typography, useTheme } from "@mui/material";
import { ErrorMessage, Field, Form, Formik } from "formik";

import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

type Props = {};

const AddStore = (props: Props) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [addStore] = useAddStoreMutation();

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required").min(3),
  });

  const initialValues = {
    name: "",
  };

  const handleSubmit = async (values: any) => {
    const formData = new FormData();
    for (let value in values) {
      formData.append(value, values[value]);
    }
    await addStore(formData);
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
        Add Store
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

export default AddStore;
