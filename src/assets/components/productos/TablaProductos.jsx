    import React from "react";
    import { Table, Button, Image } from "react-bootstrap";
    import "bootstrap-icons/font/bootstrap-icons.css";
    import { useTranslation } from "react-i18next";

    const TablaProductos = ({ productos, openEditModal, openDeleteModal, handleCopy, generarPDFDetalleProducto }) => {

        const { t, i18n } = useTranslation();

        const cambiarIdioma = (lang) => {
        i18n.changeLanguage(lang);
        };

    return (
        <Table striped bordered hover responsive>
        <thead>
            <tr>
            <th>{t('menu.imagen')}</th>
            <th>{t('menu.nombre')}</th>
            <th>{t('menu.precio')}</th>
            <th>{t('menu.categoria')}</th>
            <th>{t('menu.acciones')}</th>
            </tr>
        </thead>
        <tbody>
            {productos.map((producto) => (
            <tr key={producto.id}>
                <td>
                {producto.imagen && (
                    <Image src={producto.imagen} width="80" height="80" />
                )}
                </td>
                <td>{producto.nombre}</td>
                <td>C$ {producto.precio}</td>
                <td>{producto.categoria}</td>
                <td>
                <Button
                    variant="outline-warning"
                    size="sm"
                    className="me-2 mt-2"
                    onClick={() => openEditModal(producto)}
                >
                    <i className="bi bi-pencil"></i>
                </Button>
                <Button
                variant="outline-secondary"
                size="sm"
                className="me-2 mt-2"
                onClick={() => generarPDFDetalleProducto(producto)}
                >
                    <i className="bi bi-filetype-pdf"></i>
                </Button>
                <Button
                    variant="outline-danger"
                    size="sm"
                    className="me-2 mt-2"
                    onClick={() => openDeleteModal(producto)}
                >
                    <i className="bi bi-trash"></i>
                </Button>
                <Button
                    variant="outline-info"
                    size="sm"
                    className="me-2 mt-2"
                    onClick={() => handleCopy(producto)}
                    >
                    <i className="bi bi-clipboard"></i>
                </Button>
                </td>
            </tr>
            ))}
        </tbody>
        </Table>
    );
    };

    export default TablaProductos;
