import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Clientes from "./pages/Clientes";
import Contas from "./pages/Contas";
import Transacacoes from "./pages/Transacacoes";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-blue-600 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">MarceloBank</h1>
            <div className="space-x-4">
              <Link to="/" className="hover:text-blue-200 transition-colors">
                Home
              </Link>
              <Link
                to="/clientes"
                className="hover:text-blue-200 transition-colors"
              >
                Clientes
              </Link>
              <Link
                to="/contas"
                className="hover:text-blue-200 transition-colors"
              >
                Contas
              </Link>
              <Link
                to="/transacoes"
                className="hover:text-blue-200 transition-colors"
              >
                Transações
              </Link>
            </div>
          </div>
        </nav>

        <main className="container mx-auto py-8 px-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/contas" element={<Contas />} />
            <Route path="/transacoes" element={<Transacacoes />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
