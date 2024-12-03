import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import fondo from "../imagenes/fondo212.jpg";
import "./cambio.css";
import logo from "../imagenes/asdlogo.png";

function CambioContrasena() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Se ha enviado un enlace de recuperación a: ${email}`);
    navigate("/cambio2"); 
  };

  const handleBack = () => {
    navigate(-1); 
  };

  return (
    <div
      className="change-password-container"
      style={{ backgroundImage: `url(${fondo})` }}
    >
      <header className="app-header">
        <div className="logo">
          <img src={logo} alt="Tu Despensa Logo" className="logo-img" />
          <div className="name">TU DESPENSA 🛒</div>
        </div>
      </header>

      <div className="back-button-container">
        <button
          type="button"
          onClick={handleBack}
          className="back-button"
        >
          Volver
        </button>
      </div>

      <main className="change-password-main">
        <div className="change-password-box">
          <h2 className="change-password-title">Cambio de contraseña</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="email" className="input-label">
                Correo Electrónico:
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ingresa tu correo electrónico"
                className="input-field"
                required
              />
            </div>
            <button type="submit" className="change-password-button">
              Enviar mensaje
            </button>
          </form>
        </div>
      </main>

      <footer className="app-footer">
        <p>© 2024 Tudespensa. Todos los derechos reservados.</p>
        <p>Contacto: info@tudespensa.com</p>
      </footer>
    </div>
  );
}

export default CambioContrasena;
