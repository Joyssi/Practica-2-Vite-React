    import React from "react";
    import { Table } from "react-bootstrap";
    import Paginacion from "../ordenamiento/Paginacion";
    import { useTranslation } from 'react-i18next';

    const TablaEmpleados = ({
    empleados,
    totalItems,
    itemsPerPage,
    currentPage,
    setCurrentPage,
    }) => {
        
        const { t, i18n } = useTranslation();
        
                const cambiarIdioma = (lang) => {
                i18n.changeLanguage(lang);
                };

    return (
        <>
        <Table striped bordered hover responsive>
            <thead>
            <tr>
                <th>{t('menu.nombre')}</th>
                <th>{t('menu.apellido')}</th>
                <th>{t('menu.correo')}</th>
                <th>{t('menu.telefono')}</th>
                <th>{t('menu.cedula')}</th>
                <th>{t('menu.fechaNacimiento')}</th>
            </tr>
            </thead>
            <tbody>
            {empleados.map((empleado) => (
                <tr key={empleado.id}>
                <td>{empleado.nombre}</td>
                <td>{empleado.apellido}</td>
                <td>{empleado.correo}</td>
                <td>{empleado.telefono}</td>
                <td>{empleado.cedula}</td>
                <td>{empleado.fechaNacimiento}</td>
                </tr>
            ))}
            </tbody>
        </Table>
        <Paginacion
            itemsPerPage={itemsPerPage}
            totalItems={totalItems}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
        />
        </>
    );
    };

    export default TablaEmpleados;