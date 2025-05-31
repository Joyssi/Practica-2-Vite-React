    import React from "react";
    import { Table } from "react-bootstrap";
    import { useTranslation } from "react-i18next";

    const TablaClima = ({ datosPorHora }) => {

    const { t, i18n } = useTranslation();

    const cambiarIdioma = (lang) => {
    i18n.changeLanguage(lang);
    };

    return (
        <Table striped bordered hover responsive>
        <thead>
            <tr>
            <th>{t('menu.hora')}</th>
            <th>{t('menu.temperaturaC')}</th>
            </tr>
        </thead>
        <tbody>
            {datosPorHora.map((dato, indice) => (
            <tr key={indice}>
                <td>{dato.hora}</td>
                <td>{dato.temperatura}</td>
            </tr>
            ))}
        </tbody>
        </Table>
    );
    };

    export default TablaClima;
