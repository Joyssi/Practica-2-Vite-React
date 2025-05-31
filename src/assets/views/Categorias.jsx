    import React, { useState, useEffect } from "react";
    import { Container, Button, Col } from "react-bootstrap";
    import { db } from "../database/firebaseconfig";
    import {
    collection,
    onSnapshot,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    } from "firebase/firestore";

    import TablaCategorias from "../components/categorias/TablaCategorias";
    import ModalRegistroCategoria from "../components/categorias/ModalRegistroCategoria";
    import ModalEdicionCategoria from "../components/categorias/ModalEdicionCategoria";
    import ModalEliminacionCategoria from "../components/categorias/ModalEliminacionCategoria";
    import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
    import Paginacion from "../components/ordenamiento/Paginacion";
    import ChatIA from "../components/chat/ChatIA";
    import { useTranslation } from "react-i18next";

    const Categorias = () => {
    const [categorias, setCategorias] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [nuevaCategoria, setNuevaCategoria] = useState({
        nombre: "",
        descripcion: "",
    });
    const [categoriaEditada, setCategoriaEditada] = useState(null);
    const [categoriaAEliminar, setCategoriaAEliminar] = useState(null);
    const [categoriasFiltradas, setCategoriasFiltradas] = useState([]);
    const [searchText, setSearchText] = useState("");

    const [showChatModal, setShowChatModal] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const categoriasCollection = collection(db, "categorias");
    const [isOffline, setIsOffline] = useState(!navigator.onLine);

    const { t } = useTranslation();

    const fetchCategorias = () => {
        const stopListening = onSnapshot(
        categoriasCollection,
        (snapshot) => {
            const fetchedCategorias = snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
            }));
            setCategorias(fetchedCategorias);
            setCategoriasFiltradas(fetchedCategorias);
        },
        (error) => {
            console.error("Error al escuchar categorías:", error);
            if (!isOffline) {
            alert("Error al cargar las categorías: " + error.message);
            }
        }
        );
        return stopListening;
    };

    useEffect(() => {
        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);
        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);
        setIsOffline(!navigator.onLine);
        return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
        };
    }, []);

    useEffect(() => {
        const cleanupListener = fetchCategorias();
        return () => cleanupListener();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNuevaCategoria((prev) => ({
        ...prev,
        [name]: value,
        }));
    };

    const handleSearchChange = (e) => {
        const text = e.target.value.toLowerCase();
        setSearchText(text);
        const filtradas = categorias.filter((categoria) =>
        categoria.nombre.toLowerCase().includes(text) ||
        categoria.descripcion.toLowerCase().includes(text)
        );
        setCategoriasFiltradas(filtradas);
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setCategoriaEditada((prev) => ({
        ...prev,
        [name]: value,
        }));
    };

    const handleAddCategoria = async () => {
        if (!nuevaCategoria.nombre || !nuevaCategoria.descripcion) {
        alert(t("mensajes.completarCampos"));
        return;
        }

        setShowModal(false);
        const tempId = `temp_${Date.now()}`;
        const categoriaConId = { ...nuevaCategoria, id: tempId };

        try {
        setCategorias((prev) => [...prev, categoriaConId]);
        setCategoriasFiltradas((prev) => [...prev, categoriaConId]);
        setNuevaCategoria({ nombre: "", descripcion: "" });
        await addDoc(categoriasCollection, nuevaCategoria);
        } catch (error) {
        console.error("Error al agregar la categoría:", error);
        if (!isOffline) {
            setCategorias((prev) => prev.filter((cat) => cat.id !== tempId));
            setCategoriasFiltradas((prev) =>
            prev.filter((cat) => cat.id !== tempId)
            );
            alert("Error al agregar la categoría: " + error.message);
        }
        }
    };

    const handleEditCategoria = async () => {
        if (!categoriaEditada?.nombre || !categoriaEditada?.descripcion) {
        alert(t("mensajes.completarCampos"));
        return;
        }

        setShowEditModal(false);
        const categoriaRef = doc(db, "categorias", categoriaEditada.id);

        try {
        await updateDoc(categoriaRef, {
            nombre: categoriaEditada.nombre,
            descripcion: categoriaEditada.descripcion,
        });

        setCategorias((prev) =>
            prev.map((cat) =>
            cat.id === categoriaEditada.id ? { ...categoriaEditada } : cat
            )
        );
        setCategoriasFiltradas((prev) =>
            prev.map((cat) =>
            cat.id === categoriaEditada.id ? { ...categoriaEditada } : cat
            )
        );
        } catch (error) {
        console.error("Error al actualizar la categoría:", error);
        alert("Ocurrió un error: " + error.message);
        }
    };

    const handleDeleteCategoria = async () => {
        if (!categoriaAEliminar) return;
        setShowDeleteModal(false);

        try {
        setCategorias((prev) =>
            prev.filter((cat) => cat.id !== categoriaAEliminar.id)
        );
        setCategoriasFiltradas((prev) =>
            prev.filter((cat) => cat.id !== categoriaAEliminar.id)
        );
        const categoriaRef = doc(db, "categorias", categoriaAEliminar.id);
        await deleteDoc(categoriaRef);
        } catch (error) {
        console.error("Error al eliminar la categoría:", error);
        alert("Error al eliminar la categoría: " + error.message);
        }
    };

    const paginatedCategorias = categoriasFiltradas.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const openEditModal = (categoria) => {
        setCategoriaEditada({ ...categoria });
        setShowEditModal(true);
    };

    const openDeleteModal = (categoria) => {
        setCategoriaAEliminar(categoria);
        setShowDeleteModal(true);
    };

    return (
        <Container className="mt-5">
        <br />
        <h4>{t('menu.gestionCategorias')}</h4>
        <Button className="mb-3" onClick={() => setShowModal(true)}>
            {t('menu.agregarCategoria')}
        </Button>
        <Col lg={3} md={4} sm={4} xs={5}>
            <Button className="mb-3" onClick={() => setShowChatModal(true)} style={{ width: "100%" }}>
            {t('menu.chatIA')}
            </Button>
        </Col>
        <CuadroBusquedas
            searchText={searchText}
            handleSearchChange={handleSearchChange}
            placeholder={t('menu.buscar')}
        />

        <TablaCategorias
            categorias={categoriasFiltradas}
            openEditModal={openEditModal}
            openDeleteModal={openDeleteModal}
            Categorias={paginatedCategorias}
            totalItems={categorias.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
        />
        <Paginacion
            itemsPerPage={itemsPerPage}
            totalItems={categoriasFiltradas.length}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
        />
        <ModalRegistroCategoria
            showModal={showModal}
            setShowModal={setShowModal}
            nuevaCategoria={nuevaCategoria}
            handleInputChange={handleInputChange}
            handleAddCategoria={handleAddCategoria}
        />
        <ModalEdicionCategoria
            showEditModal={showEditModal}
            setShowEditModal={setShowEditModal}
            categoriaEditada={categoriaEditada}
            handleEditInputChange={handleEditInputChange}
            handleEditCategoria={handleEditCategoria}
        />
        <ModalEliminacionCategoria
            showDeleteModal={showDeleteModal}
            setShowDeleteModal={setShowDeleteModal}
            handleDeleteCategoria={handleDeleteCategoria}
        />
        <ChatIA showChatModal={showChatModal} setShowChatModal={setShowChatModal} />
        </Container>
    );
    };

    export default Categorias;
