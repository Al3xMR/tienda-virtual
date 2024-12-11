import React, { useState, useCallback, useEffect } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Importar useNavigate
import ProductList from "./ProductList"; // Importa el componente ProductList
import SearchBar from "./SearchBar"; // Importa el componente SearchBar
import Cart from "./Cart"; // Importa el componente Carrito
import logo from "../imagenes/asdlogo.png";
import "./principal.css";

const Principal = () => {
  const [productsState, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [searchQuery, setSearchQuery] = useState("");
  const [cartVisible, setCartVisible] = useState(false); // Estado para la visibilidad del carrito
  const [isLoading, setIsLoading] = useState(true); // Estado para indicar carga
  const [error, setError] = useState(null); // Estado para errores
  const navigate = useNavigate();
  const [usuarioNombre, setUsuarioNombre] = useState("");

  const categories = [
    "Todas",
    "Verduras-Legumbres",
    "Bebidas",
    "Lacteos",
    "Frutas",
    "Enlatados-Panificados",
    "Carnes-Embutidos",
    "Abastos",
  ];

  // Hook para cargar productos desde el backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true); // Mostrar indicador de carga
        setError(null); // Limpiar errores previos

        const response = await fetch("http://localhost:4000/api/productos/");
        if (!response.ok) throw new Error("Error al cargar los productos");

        const data = await response.json();
        if (!Array.isArray(data)) throw new Error("Formato de datos inválido");
        setProducts(data); // Actualizamos los productos
        setFilteredProducts(data); // Inicializamos el estado filtrado
      } catch (error) {
        setError(error.message);
        console.error("Error al cargar los productos:", error);
      } finally {
        setIsLoading(false); // Ocultar indicador de carga
      }
    };

    fetchProducts();
  }, []); // Este efecto solo se ejecuta al montar el componente

  useEffect(() => {
    const nombre = localStorage.getItem("usuarioNombre");
    if (nombre) {
      setUsuarioNombre(nombre);
    }
  }, []);

  // Filtrar productos según la búsqueda y categoría seleccionada
  const filterProducts = useCallback(() => {
    const lowerQuery = searchQuery.toLowerCase();
    const filtered = productsState.filter(
      (product) =>
        product.nombre.toLowerCase().includes(lowerQuery) &&
        (selectedCategory === "Todas" || product.categoria === selectedCategory)
    );
    setFilteredProducts(filtered);
  }, [searchQuery, selectedCategory, productsState]);

  // Efecto para actualizar los productos filtrados
  useEffect(() => {
    filterProducts();
  }, [filterProducts]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleAddToCart = (product) => {
    if (product.inventario > 0) {
      const updatedProducts = productsState.map((p) =>
        p._id === product._id
          ? {
              ...p,
              inventario: p.inventario - 1,
              quantity: (p.quantity || 0) + 1,
            }
          : p
      );
      setProducts(updatedProducts);
    }
  };

  const handleRemoveFromCart = (product) => {
    if (product.quantity > 0) {
      const updatedProducts = productsState.map((p) =>
        p._id === product._id
          ? { ...p, inventario: p.inventario + 1, quantity: p.quantity - 1 }
          : p
      );
      setProducts(updatedProducts);
    }
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!event.target.closest(".user-menu")) {
        setShowMenu(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  const handleClearCart = () => {
    const clearedProducts = productsState.map((product) => ({
      ...product,
      quantity: 0, // Restablece la cantidad a 0
      inventario: product.inventario + product.quantity, // Devuelve los productos al inventario
    }));
    setProducts(clearedProducts); // Actualiza el estado de los productos
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo">
          <img src={logo} alt="Tu Despensa Logo" className="logo-img" />
          <div className="name">TU DESPENSA 🛒</div>
        </div>

        <SearchBar onSearch={handleSearch} />
        {/* Botón de Login */}
        {usuarioNombre ? (
          <div className="user-menu">
            <span
              className="header-button user-name"
              onClick={() => setShowMenu((prev) => !prev)}
            >
              ¡Hola, {usuarioNombre}!
            </span>
            {showMenu && (
              <div className="dropdown-menu">
                <button
                  className="dropdown-item"
                  onClick={() => {
                    localStorage.removeItem("usuarioNombre");
                    setUsuarioNombre("");
                    setShowMenu(false);
                  }}
                >
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        ) : (
          <button className="header-button" onClick={() => navigate("/login")}>
            Iniciar Sesión
          </button>
        )}

        {/* Botón para abrir/cerrar el carrito */}
        {!cartVisible && (
          <button
            className="cart-button"
            onClick={() => setCartVisible(!cartVisible)}
            aria-label="Ver Carrito"
          >
            <FaShoppingCart size={30} />
          </button>
        )}
      </header>

      <div className="main-container">
        <aside className="sidebar">
          <h3>Categorías</h3>
          <ul className="category-list">
            {categories.map((category) => (
              <li
                key={category}
                className={`category-item ${
                  selectedCategory === category ? "active" : ""
                }`}
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </li>
            ))}
          </ul>
        </aside>

        <main className="content">
          {/* Lista de productos */}
          <ProductList
            products={filteredProducts}
            onAddToCart={handleAddToCart}
          />
        </main>
      </div>

      {/* Renderizar el carrito si está visible */}
      {cartVisible && (
        <Cart
          products={productsState.filter((product) => product.quantity > 0)}
          onAddToCart={handleAddToCart}
          onRemoveFromCart={handleRemoveFromCart}
          onClearCart={handleClearCart}
          onClose={() => setCartVisible(false)} // Función para cerrar el carrito
        />
      )}
      <footer className="app-footer">
        <p>© 2024 Tudespensa. Todos los derechos reservados.</p>
        <p>Contacto: info@tudespensa.com</p>
      </footer>
    </div>
  );
};
export default Principal;
