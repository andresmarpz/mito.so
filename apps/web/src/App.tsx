import { BrowserRouter, Routes, Route } from "react-router";
import Layout from "@/routes/layout";
import Dashboard from "@/routes/dashboard";
import Home from "@/routes/home";
import SignIn from "@/routes/sign-in";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="home" element={<Home />} />
          <Route path="sign-in" element={<SignIn />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
