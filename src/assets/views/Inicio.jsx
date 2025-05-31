    import { useNavigate } from "react-router-dom";
    import React, { useState, useEffect } from 'react';
    import { Container, Button } from "react-bootstrap";
    import ModalInstalacionIOS from "../components/inicio/ModalInstalacionIOS";
    import { useTranslation } from 'react-i18next';

    const Inicio = () => {
    const navigate = useNavigate();

    const [solicitudInstalacion, setSolicitudInstalacion] = useState(null);
    const [mostrarBotonInstalacion, setMostrarBotonInstalacion] = useState(false);
    const [esDispositivoIOS, setEsDispositivoIOS] = useState(false);
    const [mostrarModalInstrucciones, setMostrarModalInstrucciones] = useState(false);

    const abrirModalInstrucciones = () => setMostrarModalInstrucciones(true);
    const cerrarModalInstrucciones = () => setMostrarModalInstrucciones(false);

    const handleNavigate = (path) => {
        navigate(path);
    };

    const { t } = useTranslation();

    useEffect(() => {
        const esIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        setEsDispositivoIOS(esIOS);
    }, []);

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
        <h1>{t('menu.inicio')}</h1>

        <Container className="my-3">
            <Button className="m-2" variant="secondary" onClick={() => handleNavigate("/categorias")}>
            {t('menu.irACategorias')}
            </Button>
            <Button className="m-2" variant="secondary" onClick={() => handleNavigate("/productos")}>
            {t('menu.irAProductos')}
            </Button>
            <Button className="m-2" variant="secondary" onClick={() => handleNavigate("/catalogo")}>
            {t('menu.irACatalogo')}
            </Button>
            <Button className="m-2" variant="secondary" onClick={() => handleNavigate("/libros")}>
            {t('menu.irALibros')}
            </Button>
            <Button className="m-2" variant="secondary" onClick={() => handleNavigate("/clima")}>
            {t('menu.irAClima')}
            </Button>
            <Button className="m-2" variant="secondary" onClick={() => handleNavigate("/palabracard")}>
            {t('menu.irAPronunciacion')}
            </Button>
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
