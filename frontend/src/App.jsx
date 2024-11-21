import React, { useContext, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import MaterialsPage from "./pages/Materials";
import TasksPage from "./pages/Tasks";
import ProjectsPage from "./pages/Projects";
import UsersPage from "./pages/Users";
import AccountPage from "./pages/Account";
import {
  MainMaterialView,
  MainTaskView,
  MainProjectView,
  ProjectReportView,
} from "./components/cards/CustomElementViews";
import UserContext, { UserProvider } from "./components/userContext";
import "../src/styles/global.css";

function Logout() {
  const { auth } = useContext(UserContext);
  const { logout } = auth;

  useEffect(() => {
    logout();
  }, [logout]);

  return <Navigate to='/login' />;
}

function RegisterAndLogout() {
  localStorage.clear();
  return <Register />;
}

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route
              path='/materials'
              element={
                <ProtectedRoute>
                  <MaterialsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path='/tasks'
              element={
                <ProtectedRoute>
                  <TasksPage />
                </ProtectedRoute>
              }
            />
            <Route
              path='/projects'
              element={
                <ProtectedRoute>
                  <ProjectsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path='/materials/:id'
              element={
                <ProtectedRoute>
                  <MainMaterialView />
                </ProtectedRoute>
              }
            />
            <Route
              path='/tasks/:id'
              element={
                <ProtectedRoute>
                  <MainTaskView />
                </ProtectedRoute>
              }
            />
            <Route
              path='/projects/:id'
              element={
                <ProtectedRoute>
                  <MainProjectView />
                </ProtectedRoute>
              }
            />
            <Route
              path='/projects/:id/report'
              element={
                <ProtectedRoute>
                  <ProjectReportView />
                </ProtectedRoute>
              }
            />

            <Route
              path='/users'
              element={
                <ProtectedRoute>
                  <UsersPage />
                </ProtectedRoute>
              }
            />

            <Route path='/login' element={<Login />} />
            <Route path='/logout' element={<Logout />} />
            <Route path='/register' element={<RegisterAndLogout />} />

            <Route
              path='/account'
              element={
                <ProtectedRoute>
                  <AccountPage />
                </ProtectedRoute>
              }
            />

            <Route path='*' element={<NotFound />}></Route>
          </Routes>
        </Layout>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
