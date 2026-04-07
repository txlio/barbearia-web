import { useEffect, useState } from "react";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import Cliente from "./pages/Cliente";

function App() {
  const [usuarioLogado, setUsuarioLogado] = useState(null);

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem("usuarioLogadoBarbearia");

    if (usuarioSalvo) {
      setUsuarioLogado(JSON.parse(usuarioSalvo));
    }
  }, []);

  const handleLogin = (usuario) => {
    setUsuarioLogado(usuario);
    localStorage.setItem("usuarioLogadoBarbearia", JSON.stringify(usuario));
  };

  const handleLogout = () => {
    setUsuarioLogado(null);
    localStorage.removeItem("usuarioLogadoBarbearia");
  };

  if (!usuarioLogado) {
    return <Login onLogin={handleLogin} />;
  }

  if (usuarioLogado.tipo === "admin") {
    return <Admin usuario={usuarioLogado} onLogout={handleLogout} />;
  }

  return <Cliente usuario={usuarioLogado} onLogout={handleLogout} />;
}

export default App;