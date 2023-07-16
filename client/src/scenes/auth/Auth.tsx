import { useState } from "react";
import { useLoginMutation, useRegisterMutation } from "@/api/api";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

import { setLogin } from "@/state/state";
import FlexBetween from "@/components/FlexBetween";
import { Box, Button, TextField, Typography, useTheme } from "@mui/material";
import { useFormik } from "formik";

type Props = {};

const AuthPage = (props: Props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login] = useLoginMutation();
  const [register] = useRegisterMutation();
  const theme = useTheme();

  const [loginForm, setLoginForm] = useState(true);

  const yupValidationLogin = Yup.object({
    username: Yup.string().required("Required"),
    password: Yup.string().required("Required"),
  });

  const yupValidationRegister = Yup.object({
    username: Yup.string().required("Required"),
    password: Yup.string().required("Required").min(8, "At least 8 characters"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), "password should match"])
      .required("Required"),
  });

  const formikLogin = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    onSubmit: async (values, { setErrors }) => {
      const valuesBase64 = btoa(`${values.username}:${values.password}`);
      const response = await login(valuesBase64);

      if ("data" in response) {
        dispatch(setLogin(response.data));
        navigate("/dashboard");
      } else {
        if ("data" in response.error) {
          setErrors({ password: "Username or password is not correct" });
        }
      }
    },
    validationSchema: yupValidationLogin,
  });

  const formikRegister = useFormik({
    initialValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: async (values, { setErrors }) => {
      const formData = new FormData();
      for (let value in values) {
        formData.append(value, values[value as keyof typeof values]);
      }

      const response = await register(formData);

      if ("data" in response && response.data !== null) {
        setLoginForm(true);
      } else {
        setErrors({
          username: "User already exist.",
        });
      }
    },
    validationSchema: yupValidationRegister,
  });

  return (
    <FlexBetween flexDirection={"column"} gap={"2rem"} marginTop={"1rem"}>
      <Typography variant="h1" color={theme.palette.primary.main}>
        {loginForm ? "Login" : "Register"}
      </Typography>
      {loginForm ? (
        <form style={{ width: "60%" }} onSubmit={formikLogin.handleSubmit}>
          <Typography
            variant="h3"
            textAlign={"center"}
            mb={1}
            color={theme.palette.secondary.light}
          >
            username:"admin" - password:"password" for testing
          </Typography>
          <Box display={"flex"} gap={"1rem"} flexDirection={"column"}>
            <TextField
              autoComplete="false"
              sx={{ gridArea: "a" }}
              id="username"
              name="username"
              label="username"
              value={formikLogin.values.username}
              onChange={formikLogin.handleChange}
              error={
                formikLogin.touched.username &&
                Boolean(formikLogin.errors.username)
              }
              helperText={
                formikLogin.touched.username && formikLogin.errors.username
              }
            />
            <TextField
              autoComplete="false"
              sx={{ gridArea: "b" }}
              id="password"
              name="password"
              label="Password"
              type="password"
              value={formikLogin.values.password}
              onChange={formikLogin.handleChange}
              error={
                formikLogin.touched.password &&
                Boolean(formikLogin.errors.password)
              }
              helperText={
                formikLogin.touched.password && formikLogin.errors.password
              }
            />

            <Button
              type="submit"
              sx={{
                gridArea: "c",
                fontSize: "1.5rem",
                color: theme.palette.primary[800],
                background: theme.palette.primary[300],
                "&:hover": {
                  backgroundColor: theme.palette.primary[800],
                  color: theme.palette.primary[300],
                },
              }}
            >
              Login
            </Button>
            <Typography
              sx={{
                cursor: "pointer",
                color: theme.palette.primary.main,
                gridArea: "d",
              }}
              onClick={() => setLoginForm(false)}
              variant="h4"
            >
              Don't have an account ?
            </Typography>
          </Box>
        </form>
      ) : (
        <form style={{ width: "60%" }} onSubmit={formikRegister.handleSubmit}>
          <Box display={"flex"} gap={"1rem"} flexDirection={"column"}>
            <TextField
              autoComplete="false"
              sx={{ gridArea: "a" }}
              id="username"
              name="username"
              label="username"
              value={formikRegister.values.username}
              onChange={formikRegister.handleChange}
              error={
                formikRegister.touched.username &&
                Boolean(formikRegister.errors.username)
              }
              helperText={
                formikRegister.touched.username &&
                formikRegister.errors.username
              }
            />
            <TextField
              autoComplete="false"
              sx={{ gridArea: "b" }}
              id="password"
              name="password"
              label="Password"
              type="password"
              value={formikRegister.values.password}
              onChange={formikRegister.handleChange}
              error={
                formikRegister.touched.password &&
                Boolean(formikRegister.errors.password)
              }
              helperText={
                formikRegister.touched.password &&
                formikRegister.errors.password
              }
            />
            <TextField
              autoComplete="false"
              sx={{ gridArea: "c" }}
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              value={formikRegister.values.confirmPassword}
              onChange={formikRegister.handleChange}
              error={
                formikRegister.touched.confirmPassword &&
                Boolean(formikRegister.errors.confirmPassword)
              }
              helperText={
                formikRegister.touched.confirmPassword &&
                formikRegister.errors.confirmPassword
              }
            />
            <Button
              type="submit"
              sx={{
                gridArea: "d",
                fontSize: "1.5rem",
                color: theme.palette.primary[800],
                background: theme.palette.primary[300],
                "&:hover": {
                  backgroundColor: theme.palette.primary[800],
                  color: theme.palette.primary[300],
                },
              }}
            >
              Register
            </Button>
            <Typography
              onClick={() => setLoginForm(true)}
              variant="h4"
              sx={{
                gridArea: "e",
                cursor: "pointer",
                color: theme.palette.primary.main,
              }}
            >
              Already have an account?
            </Typography>
          </Box>
        </form>
      )}
    </FlexBetween>
  );
};

export default AuthPage;
