import { Button } from "../UIelements/Button";
import { Navbar } from "../components/Navbar";
import "./HomePage.css"
export const HomePage = () => {
  return (
    <>
    <Navbar />
    <div className="home-content">
      <h1>Welcome to FlowBoard</h1>
      <p>A web-based collaborative to-do board application where multiple users can log in, manage
      tasks, and see changes happen in real time</p>
      <div className="auth-buttons">
        <Button variant="primary" as="a" href="/signup">
          Sign Up
        </Button>
        <Button variant="secondary" as="a" href="/signin">
          Sign In
        </Button>
      </div>
    </div>
    </>
  );
};
