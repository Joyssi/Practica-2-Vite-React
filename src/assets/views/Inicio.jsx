    import { useNavigate } from "react-router-dom";
    import React, { useState, useEffect } from 'react';
    import { Container, Button } from "react-bootstrap";
    import ModalInstalacionIOS from "../components/inicio/ModalInstalacionIOS";

    const Inicio = () => {
    const navigate = useNavigate();

    const [solicitudInstalacion, setSolicitudInstalacion] = useState(null);
    const [mostrarBotonInstalacion, setMostrarBotonInstalacion] = useState(false);
    const [esDispositivoIOS, setEsDispositivoIOS] = useState(false);
    const [mostrarModalInstrucciones, setMostrarModalInstrucciones] = useState(false); // corregido

    const abrirModalInstrucciones = () => setMostrarModalInstrucciones(true); // corregido
    const cerrarModalInstrucciones = () => setMostrarModalInstrucciones(false); // corregido

    // Función de navegación
    const handleNavigate = (path) => {
        navigate(path);
    };

    // Detectar dispositivo iOS
    useEffect(() => {
        const esIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        setEsDispositivoIOS(esIOS);
    }, []);

    // Manejar evento beforeinstallprompt
    useEffect(() => {
        const manejarSolicitudInstalacion = (evento) => {
        evento.preventDefault();
        setSolicitudInstalacion(evento);
        setMostrarBotonInstalacion(true);
        };

        window.addEventListener("beforeinstallprompt", manejarSolicitudInstalacion);

        return () => {
        window.removeEventListener("beforeinstallprompt", manejarSolicitudInstalacion);
        };
    }, []);

    const instalacion = async () => {
        if (!solicitudInstalacion) return;

        try {
        await solicitudInstalacion.prompt();
        const { outcome } = await solicitudInstalacion.userChoice;
        console.log(outcome === "accepted" ? "Instalación aceptada" : "Instalación rechazada");
        } catch (error) {
        console.error("Error al intentar instalar la PWA:", error);
        } finally {
        setSolicitudInstalacion(null);
        setMostrarBotonInstalacion(false);
        }
    };

    return (
        <div>
        <br />
        <br />
        <h1>Inicio</h1>

        <Container className="my-3">
            <Button className="m-2" variant="secondary" onClick={() => handleNavigate("/categorias")}>Ir a Categorías</Button>
            <Button className="m-2" variant="secondary" onClick={() => handleNavigate("/productos")}>Ir a Productos</Button>
            <Button className="m-2" variant="secondary" onClick={() => handleNavigate("/catalogo")}>Ir a Catálogo</Button>
            <Button className="m-2" variant="secondary" onClick={() => handleNavigate("/libros")}>Ir a Libros</Button>
            <Button className="m-2" variant="secondary" onClick={() => handleNavigate("/clima")}>Ir a Clima</Button>
            <Button className="m-2" variant="secondary" onClick={() => handleNavigate("/palabracard")}>Ir a Pronunciación</Button>
        </Container>

        {!esDispositivoIOS && mostrarBotonInstalacion && (
            <div className="text-center my-4">
            <Button className="sombra" variant="primary" onClick={instalacion}>
                Instalar app Ferreteria Selva <i className="bi-download"></i>
            </Button>
            </div>
        )}

        {esDispositivoIOS && (
            <div className="text-center my-4">
            <Button className="sombra" variant="primary" onClick={abrirModalInstrucciones}>
                Cómo instalar Ferreteria Selva en iPhone <i className="bi-phone"></i>
            </Button>
            </div>
        )}

        <ModalInstalacionIOS
            mostrar={mostrarModalInstrucciones}
            cerrar={cerrarModalInstrucciones}
        />
        </div>
    );
    };

    export default Inicio;
