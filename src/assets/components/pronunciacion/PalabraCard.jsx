    import React from "react";
    import { Button, Alert } from "react-bootstrap";
    import { useTranslation } from "react-i18next";

    const PalabraCard = ({
    palabra,
    escuchando,
    resultado,
    error,
    onHablar,
    onNueva
    }) => {

    const { t, i18n } = useTranslation();
        
    const cambiarIdioma = (lang) => {
        i18n.changeLanguage(lang);
    };

    return (
    <div className="text-center">
    <h4 className="mt-4">{t('menu.pronunciaPalabra')}</h4>
    <h1 className="display-4">{palabra}</h1>
    <Button
    variant="primary"
    onClick={onHablar}
    disabled={escuchando}
    className="mt-3"
    >
    {escuchando ? "Escuchando..." : "Hablar"}
    </Button>
    <Button variant="secondary" onClick={onNueva} className="ms-2 mt-3">
    {t('menu.nuevaPalabra')}
    </Button>
    {resultado && (
    <Alert
    variant={resultado.correcto ? "success" : "danger"}
    className="mt-4"
    >
    {resultado.correcto
    ? `¡Correcto! Dijiste "${resultado.texto}"`
    : `Incorrecto. Dijiste "${resultado.texto}", pero la palabra era
    "${palabra}"`}
    </Alert>
    )}
    {error && (
    <Alert variant="warning" className="mt-3">
    {error}
    </Alert>
    )}
    </div>
    );
    };
    export default PalabraCard;