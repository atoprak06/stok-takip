import { useSelector } from "react-redux";
import { StateI } from "./types/Types";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./scenes/navbar/Navbar";
import AdminDashBoard from "./scenes/adminDashBoard/AdminDashBoard";
import AuthPage from "./scenes/auth/Auth";
import { useEffect, useState, useMemo } from "react";
import { useVerifyTokenQuery } from "./api/api";
import Loading from "./components/Loading";
import { themeSettings } from "./theme";
import Home from "./scenes/home/Home";
import AddProduct from "./scenes/product/AddProduct";
import UpdateProduct from "./scenes/product/UpdateProduct";
import AddStore from "./scenes/stores/AddStore";
import AddParentCategory from "./scenes/parentCategory/AddParentCategory";
import AddSubCategory from "./scenes/subCategory/AddSubCategory";
import UpdateSubCategory from "./scenes/subCategory/UpdateSubCategory";

function App() {
  const theme = useMemo(() => createTheme(themeSettings), []);
  const token = useSelector<StateI>(
    (state) => state.persistedReducer.token,
  ) as string;
  const [isLogged, setIsLogged] = useState(false);
  const { data, isLoading } = useVerifyTokenQuery("", {
    skip: !token,
  });

  useEffect(() => {
    if (token && token.length > 0) {
      const bool = data?.user !== null;
      setIsLogged(bool);
    } else {
      setIsLogged(false);
    }
    return () => {
      setIsLogged(false);
    };
  }, [token, data]);

  if (isLoading) return <Loading />;

  return (
    <div className="app" style={{ height: "100vh", width: "100vw" }}>
      <ThemeProvider theme={theme}>
        <CssBaseline>
          <BrowserRouter>
            <Navbar />
            <Routes>
              <Route
                path="/"
                element={isLogged ? <Navigate to="/dashboard" /> : <Home />}
              />
              <Route
                path="/auth"
                element={
                  !isLogged ? (
                    <AuthPage />
                  ) : (
                    <Navigate to="/dashboard" replace />
                  )
                }
              />
              <Route
                path="/dashboard"
                element={
                  isLogged ? (
                    <AdminDashBoard />
                  ) : (
                    <Navigate to="/auth" replace />
                  )
                }
              />
              <Route
                path="/add-product"
                element={
                  isLogged ? <AddProduct /> : <Navigate to="/auth" replace />
                }
              />
              <Route
                path="/update-product"
                element={
                  isLogged ? <UpdateProduct /> : <Navigate to="/auth" replace />
                }
              />
              <Route
                path="/add-store"
                element={
                  isLogged ? <AddStore /> : <Navigate to="/auth" replace />
                }
              />
              <Route
                path="/add-parent-category"
                element={
                  isLogged ? (
                    <AddParentCategory />
                  ) : (
                    <Navigate to="/auth" replace />
                  )
                }
              />
              <Route
                path="/add-sub-category"
                element={
                  isLogged ? (
                    <AddSubCategory />
                  ) : (
                    <Navigate to="/auth" replace />
                  )
                }
              />
              <Route
                path="/update-sub-category"
                element={
                  isLogged ? (
                    <UpdateSubCategory />
                  ) : (
                    <Navigate to="/auth" replace />
                  )
                }
              />
            </Routes>
          </BrowserRouter>
        </CssBaseline>
      </ThemeProvider>
    </div>
  );
}

export default App;
