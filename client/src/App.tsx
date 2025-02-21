import { Profile, Summary, Register, Login, Home, NotFoundPage, EditSummary, ShowSummary } from "./pages"
import { Routes, Route } from "react-router";
import { ProtectedLayout } from "@/layouts/ProtectedLayout";

function App() {

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route element={<ProtectedLayout />}>
        <Route path="/summary" element={<Summary />} />
        <Route path="/summary/:id" element={<ShowSummary />} />
        <Route path="/edit-summary/:id" element={<EditSummary />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
