    import { Button, Card, Col } from "react-bootstrap";
    import "bootstrap-icons/font/bootstrap-icons.css";
    import { Zoom } from "react-awesome-reveal";

    const TarjetaProducto = ({ producto, openEditModal }) => {
    return (
        <Col lg={3} md={4} sm={12} className="mb-4">
        <Zoom cascade triggerOnce delay={10} duration={600}>
        <Card>
            {producto.imagen && (
            <Card.Img variant="top" src={producto.imagen} alt={producto.nombre} />
            )}
            <Card.Body>
            <Card.Title>{producto.nombre}</Card.Title>
            <Card.Text>
                Precio: C${producto.precio} <br />
                Categoría: {producto.categoria}
            </Card.Text>
            <Button
                variant="outline-warning"
                size="sm"
                className="me-2"
                onClick={() => openEditModal(producto)}
                >
                <i className="bi bi-pencil"></i>
                            </Button>
            </Card.Body>
        </Card>
        </Zoom>
        </Col>
    );
    };

    export default TarjetaProducto;
