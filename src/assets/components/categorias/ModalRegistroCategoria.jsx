    import React from "react";
    import { Modal, Form, Button } from "react-bootstrap";
    import { useTranslation } from 'react-i18next';

    const ModalRegistroCategoria = ({
    showModal,
    setShowModal,
    nuevaCategoria,
    handleInputChange,
    handleAddCategoria,
    }) => {

        const { t, i18n } = useTranslation();
        
            const cambiarIdioma = (lang) => {
            i18n.changeLanguage(lang);
            };

    return (
        <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
            <Modal.Title>{t('menu.agregarCategoria')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
            <Form.Group className="mb-3">
                <Form.Label>{t('menu.nombre')}</Form.Label>
                <Form.Control
                type="text"
                name="nombre"
                value={nuevaCategoria.nombre}
                onChange={handleInputChange}
                placeholder={t('menu.ingresaNombre')}
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>{t('menu.descripcion')}</Form.Label>
                <Form.Control
                as="textarea"
                rows={3}
                name="descripcion"
                value={nuevaCategoria.descripcion}
                onChange={handleInputChange}
                placeholder={t('menu.ingresaDescripcion')}
                />
            </Form.Group>
            </Form>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
            {t('menu.cancelar')}
            </Button>
            <Button variant="primary" onClick={handleAddCategoria}>
            {t('menu.guardar')}
            </Button>
        </Modal.Footer>
        </Modal>
    );
    };

    export default ModalRegistroCategoria;