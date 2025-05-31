    import React, { useState, useEffect } from "react";
    import { Container, Row, Form, Col } from "react-bootstrap";
    import { db } from "../database/firebaseconfig";
    import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
    import TarjetaProducto from "../components/catalogo/TarjetaProducto";
    import ModalEdicionProducto from "../components/productos/ModalEdicionProducto";
    import { useTranslation } from "react-i18next";

    const Catalogo= () => {
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todas");

    const [showEditModal, setShowEditModal] = useState(false); //Controlar la visibilidad del modal
    const [productoEditado, setProductoEditado] = useState(null);

    const productosCollection = collection(db, "productos");
    const categoriasCollection = collection(db, "categorias");

    const { t, i18n } = useTranslation();

    const cambiarIdioma = (lang) => {
    i18n.changeLanguage(lang);
    };

    const fetchData = async () => {
        try {
        // Obtener productos
        const productosData = await getDocs(productosCollection);
        const fetchedProductos = productosData.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
        }));
        setProductos(fetchedProductos);

        // Obtener categorías
        const categoriasData = await getDocs(categoriasCollection);
        const fetchedCategorias = categoriasData.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
        }));
        setCategorias(fetchedCategorias);
        } catch (error) {
        console.error("Error al obtener datos:", error);
        }
    };

    // Manejador de cambios en inputs del formulario de edición
    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setProductoEditado((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setProductoEditado((prev) => ({ ...prev, imagen: reader.result }));
        };
        reader.readAsDataURL(file);
        }
    };

     // Función para actualizar un producto existente (UPDATE)
        const handleEditProducto = async () => {
            if (!productoEditado.nombre || !productoEditado.precio || !productoEditado.categoria) {
            alert("Por favor, completa todos los campos requeridos.");
            return;
            }
            try {
            const productoRef = doc(db, "productos", productoEditado.id);
            await updateDoc(productoRef, productoEditado);
            setShowEditModal(false);
            await fetchData();
            } catch (error) {
            console.error("Error al actualizar producto:", error);
            }
        };

        // Hook useEffect para carga inicial de datos
        useEffect(() => {
            fetchData();
        }, []);

    // Función para abrir el modal de edición con datos prellenados
        const openEditModal = (producto) => {
            setProductoEditado({ ...producto });
            setShowEditModal(true);
        };

    // Filtrar productos por categoría
    const productosFiltrados = categoriaSeleccionada === "Todas"
        ? productos
        : productos.filter((producto) => producto.categoria === categoriaSeleccionada);

    return (
        <Container className="mt-5">
        <br />
        <h4>{t('menu.catalogoProductos')}</h4>
        {/* Filtro de categorías */}
        <Row>
            <Col lg={3} md={3} sm={6}>
            <Form.Group className="mb-3">
                <Form.Label>{t('menu.filtrarPorCategoria')}</Form.Label>
                <Form.Select
                value={categoriaSeleccionada}
                onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                >
                <option value="Todas">{t('menu.todas')}</option>
                {categorias.map((categoria) => (
                    <option key={categoria.id} value={categoria.nombre}>
                    {categoria.nombre}
                    </option>
                ))}
                </Form.Select>
                
            </Form.Group>
            </Col>
            <ModalEdicionProducto
            showEditModal={showEditModal}
            setShowEditModal={setShowEditModal}
            productoEditado={productoEditado}
            handleEditInputChange={handleEditInputChange}
            handleEditImageChange={handleEditImageChange}
            handleEditProducto={handleEditProducto}
            categorias={categorias}
        />
        </Row>

        {/* Catálogo de productos filtrados */}
        <Row>
            {productosFiltrados.length > 0 ? (
            productosFiltrados.map((producto) => (
                <TarjetaProducto key={producto.id} producto={producto} openEditModal={openEditModal}/>
            ))
            ) : (
            <p>No hay productos en esta categoría.</p>
            )}
        </Row>
        </Container>
    );
    };

    export default Catalogo;