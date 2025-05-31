    import React from "react";
    import { Modal, Button } from "react-bootstrap";
    import { useTranslation } from 'react-i18next';

    const ModalEliminacionCategoria = ({
    showDeleteModal,
    setShowDeleteModal,
    handleDeleteCategoria,
    }) => {

        const { t, i18n } = useTranslation();
                
                    const cambiarIdioma = (lang) => {
                    i18n.changeLanguage(lang);
                    };

    return (
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
            <Modal.Title>{t('menu.confirmacion')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {t('menu.smsEliminar')}
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            {t('menu.cancelar')}
            </Button>
            <Button variant="danger" onClick={handleDeleteCategoria}>
            {t('menu.eliminar')}
            </Button>
        </Modal.Footer>
        </Modal>
    );
    };

    export default ModalEliminacionCategoria;
