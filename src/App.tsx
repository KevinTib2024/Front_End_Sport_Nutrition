import "./App.css";
import { Outlet } from "react-router-dom";
import Navbar from "./Components/navbar/Navbar";
import { AuthProvider } from "./Context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <section className="layout">
        <header>
          <Navbar />
        </header>
        <main>
          <Outlet />
        </main>
        <footer>Museo Nacional</footer>
        <div className="icon-container">
        </div>
      </section>
    </AuthProvider>
  );
}

export default App;
