    import React from "react";
    import { Modal, Form, Button } from "react-bootstrap";
    import { useTranslation } from 'react-i18next';

    const ModalRegistroProducto = ({
    showModal,
    setShowModal,
    nuevoProducto,
    handleInputChange,
    handleImageChange,
    handleAddProducto,
    categorias
    }) => {

    const { t, i18n } = useTranslation();
            
                const cambiarIdioma = (lang) => {
                i18n.changeLanguage(lang);
                };

    return (
        <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
            <Modal.Title>{t('menu.agregarProducto')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
            <Form.Group className="mb-3">
                <Form.Label>{t('menu.nombre')}</Form.Label>
                <Form.Control
                type="text"
                name="nombre"
                value={nuevoProducto.nombre}
                onChange={handleInputChange}
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>{t('menu.precio')}</Form.Label>
                <Form.Control
                type="number"
                name="precio"
                value={nuevoProducto.precio}
                onChange={handleInputChange}
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>{t('menu.categoria')}</Form.Label>
                <Form.Select
                name="categoria"
                value={nuevoProducto.categoria}
                onChange={handleInputChange}
                >
                <option value="">Seleccione una categoría</option>
                {categorias.map((cat) => (
                    <option key={cat.id} value={cat.nombre}>
                    {cat.nombre}
                    </option>
                ))}
                </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>{t('menu.imagen')}</Form.Label>
                <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                />
            </Form.Group>
            </Form>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
            {t('menu.cancelar')}
            </Button>
            <Button variant="primary" onClick={handleAddProducto}>
            {t('menu.guardar')}
            </Button>
        </Modal.Footer>
        </Modal>
    );
    };

    export default ModalRegistroProducto;