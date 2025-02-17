import { Profile, Summary, Register, Login, Home, NotFoundPage } from "./pages"
import { Routes, Route } from "react-router";

function App() {

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/summary" element={<Summary />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
