    import React from "react";
    import { Modal, Form, Button } from "react-bootstrap";
    import { useTranslation } from 'react-i18next';

    const ModalEdicionCategoria = ({
    showEditModal,
    setShowEditModal,
    categoriaEditada,
    handleEditInputChange,
    handleEditCategoria,
    }) => {
    if (!categoriaEditada) return null;

        const { t, i18n } = useTranslation();
            
                const cambiarIdioma = (lang) => {
                i18n.changeLanguage(lang);
                };

    return (
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
            <Modal.Title>{t('menu.editarCategoria')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
            <Form.Group className="mb-3">
                <Form.Label>{t('menu.nombre')}</Form.Label>
                <Form.Control
                type="text"
                name="nombre"
                value={categoriaEditada.nombre}
                onChange={handleEditInputChange}
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>{t('menu.descripcion')}</Form.Label>
                <Form.Control
                as="textarea"
                rows={3}
                name="descripcion"
                value={categoriaEditada.descripcion}
                onChange={handleEditInputChange}
                />
            </Form.Group>
            </Form>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            {t('menu.guardar')}
            </Button>
            <Button variant="primary" onClick={handleEditCategoria}>
            {t('menu.actualizar')}
            </Button>
        </Modal.Footer>
        </Modal>
    );
    };

    export default ModalEdicionCategoria;