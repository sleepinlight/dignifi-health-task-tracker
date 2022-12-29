import React, { StrictMode } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import logo from "./logo.svg";
import "./App.css";
import HomePage from "./Components/HomePage";
import LoginPage from "./Components/LoginPage";
import { ProtectedRoute } from "./Shared/components/ProtectedRoute";
import { QueryClient, QueryClientProvider } from "react-query";
import RegisterPage from "./Components/RegisterPage";
import { AuthProvider } from "./Shared/hooks/useAuth";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <StrictMode>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <HomePage />
                  </ProtectedRoute>
                }
              />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </StrictMode>
    </QueryClientProvider>
  );
}

export default App;
