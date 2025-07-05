import { Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { Signup } from "./pages/Signup";
import { Signin } from "./pages/Signin";
// import { SignIn } from "./pages/SignIn"; // if you have one

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<Signin />} />
    </Routes>
  );
}

export default App;
