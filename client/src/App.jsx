// import React, { useEffect } from "react";
// import { Routes, Route } from "react-router-dom";
// import { useDispatch } from "react-redux";

// import Home from "./pages/Home";
// import Layout from "./pages/Layout";
// import Dashboard from "./pages/Dashboard";
// import ResumeBuilder from "./pages/ResumeBuilder";
// import Login from "./pages/Login";
// import Preview from "./pages/Preview";

// import api from "./configs/api";
// import { login, setLoading } from "./app/features/authSlice";
// import {Toaster} from 'react-hot-toast'

// const App = () => {
//   const dispatch = useDispatch();

//   const getUserData = async () => {
//     const token = localStorage.getItem("token");

//     try {
//       if (token) {
//         const { data } = await api.get("/api/users/data", {
//           headers: { Authorization: token },
//         });

//         if (data?.user) {
//           dispatch(login({ token, user: data.user }));
//         }
//       }
//     } catch (error) {
//       console.log("Auth error:", error.message);
//     } finally {
//       dispatch(setLoading(false));
//     }
//   };

//   useEffect(() => {
//     getUserData();
//   }, []);

//   return (
//   <>
//     <Toaster />
//     <Routes>
//       {/* Public routes */}
//       <Route path="/" element={<Home />} />
//       <Route path="/login" element={<Login />} />
//       <Route path="/register" element={<Login />} />

//       {/* Public direct preview route (used by shared links) */}
//       <Route path="/view/:resumeId" element={<Preview />} />

//       {/* Protected routes */}
//       <Route path="/app" element={<Layout />}>
//         <Route index element={<Dashboard />} />
//         <Route path="builder/:resumeId" element={<ResumeBuilder />} />
//         <Route path="preview/:resumeId" element={<Preview />} />
//       </Route>
//     </Routes>
//   </>
// );
// }

// export default App;

import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";

import Home from "./pages/Home";
import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import ResumeBuilder from "./pages/ResumeBuilder";
import Login from "./pages/Login";
import Preview from "./pages/Preview";

import api from "./configs/api";
import { login, setLoading } from "./app/features/authSlice";

import { Toaster } from "react-hot-toast";

const App = () => {

  const dispatch = useDispatch();

  const getUserData = async () => {

    const token = localStorage.getItem("token");

    if (!token) {
      dispatch(setLoading(false));
      return;
    }

    try {

      const { data } = await api.get("/api/users/data", {
        headers: {
          Authorization: token
        }
      });

      if (data?.user) {
        dispatch(
          login({
            token,
            user: data.user
          })
        );
      }

    } catch (error) {

      console.log("Auth error:", error.message);
      localStorage.removeItem("token");

    } finally {

      dispatch(setLoading(false));

    }
  };

  useEffect(() => {
    getUserData();
  }, [dispatch]);

  return (
    <>
      <Toaster />

      <Routes>

        {/* Public routes */}

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Login />} />

        {/* Public resume preview */}

        <Route path="/view/:resumeId" element={<Preview />} />

        {/* Protected routes */}

        <Route path="/app" element={<Layout />}>

          <Route index element={<Dashboard />} />

          <Route path="builder/:resumeId" element={<ResumeBuilder />} />

          <Route path="preview/:resumeId" element={<Preview />} />

        </Route>

      </Routes>
    </>
  );
};

export default App; 