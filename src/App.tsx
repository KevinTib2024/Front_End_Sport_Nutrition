import "./App.css";
import { Outlet } from "react-router-dom";
import Navbar from "./Components/navbar/Navbar";
import { AuthProvider } from "./Context/AuthContext";
import MailtoButton from "./Components/MailtoButton";
import { useAuth } from "./Context/AuthContext"; // para saber si el usuario está autenticado

function AppContent() {
  const { state } = useAuth();
  const user = state.user;
  

  return (
    <section className="layout">
      <header>
        <Navbar />
      </header>
      <main>
        <Outlet />
      </main>

      <footer>
        SPORTT NUTRITION
        {user && (
          <div style={{ marginTop: "1rem" }}>
            <MailtoButton
              to="soporte@tudominio.com"
              subject="Consulta desde Sportt Nutrition"
              body="Hola, necesito ayuda con..."
            />
          </div>
        )}
      </footer>

      <div className="icon-container"></div>
    </section>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
