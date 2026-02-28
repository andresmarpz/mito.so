import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router";
import Dashboard from "@/routes/dashboard";
import DashboardLayout from "@/routes/dashboard-layout";
import Home from "@/routes/home";
import Layout from "@/routes/layout";
import SignIn from "@/routes/sign-in";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
            </Route>
            <Route path="home" element={<Home />} />
            <Route path="sign-in" element={<SignIn />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
