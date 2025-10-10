import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import Home from "./pages/Home";
import ClientePage from "./pages/Cliente";
import Conta from "./pages/Conta";
import MBank from "./assets/LogoMB.png";

function AppShell() {
  const location = useLocation();
  const hideNav = location.pathname.startsWith("/contas"); // oculta na página de conta e subrotas

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {!hideNav && (
          <nav className="bg-pink-500 text-white p-4 fixed top-0 left-0 w-full z-50 shadow">
            <div className="container mx-auto flex justify-between items-center">
              <h1 className="text-2xl font-bold">
                <Link to="/" className="hover:opacity-80 transition-opacity">
                  <img src={MBank} alt="MarceloBank" className="h-12 inline" />
                </Link>
              </h1>

              <div className="space-x-4 flex items-center">
                <div className="relative group inline-block">
                  <button
                    className="hover:text-blue-200 transition-colors focus:outline-none"
                    type="button"
                  >
                    Sobre Nós
                  </button>
                </div>
              </div>

              <div className="space-x-4">
                <Link
                  to="/clientes"
                  className="hover:text-blue-200 transition-colors"
                >
                  Criar Conta
                </Link>
              </div>
            </div>
          </nav>
        )}
        {!hideNav && <div className="h-20"></div>}

        <main className="container mx-auto py-8 px-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/clientes" element={<ClientePage />} />
            <Route path="/contas" element={<Conta />} />
          </Routes>
        </main>
      </div>
      {!hideNav && (
        <footer className="bg-gray-500 text-white p-4 mt-8 text-center">
          {`© ${new Date().getFullYear()} Marcelo Bank. Todos os direitos reservados.`}
        </footer>
      )}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppShell />
    </Router>
  );
}

export default App;
