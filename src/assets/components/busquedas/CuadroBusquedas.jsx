    import React from "react";
    import { InputGroup, Form } from "react-bootstrap";
    import "bootstrap-icons/font/bootstrap-icons.css";
    import { useTranslation } from 'react-i18next';

    const CuadroBusquedas = ({ searchText, handleSearchChange}) => {
        const { t, i18n } = useTranslation();

        const cambiarIdioma = (lang) => {
        i18n.changeLanguage(lang);
        };

        return (
            <InputGroup className="mb-3" style={{width:"400px"}}>
            <InputGroup.Text>
                <i className="bi bi-search"></i>
            </InputGroup.Text>
            <Form.Control
                type="text"
                placeholder={t('menu.buscar')}
                value={searchText}
                onChange={handleSearchChange}
                >
            </Form.Control>
        </InputGroup> 
        );
    }

    export default CuadroBusquedas;