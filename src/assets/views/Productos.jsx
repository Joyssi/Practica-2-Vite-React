    // Importaciones
    import React, { useState, useEffect } from "react";
    import { Container, Button, Col } from "react-bootstrap";
    import { db } from "../database/firebaseconfig";
    import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    onSnapshot,
    doc,
    } from "firebase/firestore";
    import TablaProductos from "../components/productos/TablaProductos";
    import ModalRegistroProducto from "../components/productos/ModalRegistroProducto";
    import ModalEdicionProducto from "../components/productos/ModalEdicionProducto";
    import ModalEliminacionProducto from "../components/productos/ModalEliminacionProducto";
    import CuadroBusquedas from "../components/busquedas/CuadroBusquedas"; //Importación del componente de búsqueda
    import Paginacion from "../components/ordenamiento/Paginacion";
    import jsPDF from "jspdf";
    import autoTable from "jspdf-autotable";
    import * as XLSX from 'xlsx';
    import { saveAs } from 'file-saver';
    import { useTranslation } from "react-i18next";

    const Productos = () => {
    // Estados para manejo de datos
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [nuevoProducto, setNuevoProducto] = useState({
        nombre: "",
        precio: "",
        categoria: "",
        imagen: ""
    });
    const [productoEditado, setProductoEditado] = useState(null);
    const [productoAEliminar, setProductoAEliminar] = useState(null);
    const [productosFiltrados, setProductosFiltrados] = useState([]);
    const [searchText, setSearchText] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // Número de productos por página

    // Referencia a las colecciones en Firestore
    const productosCollection = collection(db, "productos");
    const categoriasCollection = collection(db, "categorias");

    const [isOffline, setIsOffline] = useState(!navigator.onLine);

    const { t, i18n } = useTranslation();

    const cambiarIdioma = (lang) => {
    i18n.changeLanguage(lang);
    };

    // Función para obtener todas las categorías y productos de Firestore
        const fetchData = () => {
            // Escuchar productos
            const unsubscribeProductos = onSnapshot(productosCollection, (snapshot) => {
            const fetchedProductos = snapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));
            setProductos(fetchedProductos);
            setProductosFiltrados(fetchedProductos);
            if (isOffline) {
                console.log("Offline: Productos cargados desde caché local.");
            }
            }, (error) => {
            console.error("Error al escuchar productos:", error);
            if (isOffline) {
                console.log("Offline: Mostrando datos desde caché local.");
            } else {
                alert("Error al cargar productos: " + error.message);
            }
            });
        
            // Escuchar categorías
            const unsubscribeCategorias = onSnapshot(categoriasCollection, (snapshot) => {
            const fetchedCategorias = snapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));
            setCategorias(fetchedCategorias);
            if (isOffline) {
                console.log("Offline: Categorías cargadas desde caché local.");
            }
            }, (error) => {
            console.error("Error al escuchar categorías:", error);
            if (isOffline) {
                console.log("Offline: Mostrando categorías desde caché local.");
            } else {
                alert("Error al cargar categorías: " + error.message);
            }
            });
        
            return () => {
            unsubscribeProductos();
            unsubscribeCategorias();
            };
        };

    // Hook useEffect para carga inicial de datos
    useEffect(() => {
        fetchData();
    }, []);

        useEffect(() => {
            const handleOnline = () => {
            setIsOffline(false);
            };
            const handleOffline = () => {
            setIsOffline(true);
            };
            window.addEventListener("online", handleOnline);
            window.addEventListener("offline", handleOffline);
            setIsOffline(!navigator.onLine);
            return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
            };
        }, []);

    //Hook useEffect para filtrar productos según el texto de búsqueda
    const handleSearchChange = (e) => {
        const text = e.target.value.toLowerCase();
        setSearchText(text);
        
        const filtrados = productos.filter((producto) => 
            producto.nombre.toLowerCase().includes(text) || 
            producto.precio.toString().toLowerCase().includes(text) ||
            producto.categoria.toLowerCase().includes(text)
        );
    
        setProductosFiltrados(filtrados);
    };

    // Método para copiar datos al portapapeles
    const handleCopy = (producto) => {
    const rowData = `Nombre: ${producto.nombre}\nPrecio: C$$${producto.precio}\nCategoría: ${producto.categoria}`;
    navigator.clipboard
        .writeText(rowData)
        .then(() => {
        console.log("Datos de la fila copiados al portapapeles:\n" + rowData);
        })
        .catch((err) => {
        console.error("Error al copiar al portapapeles:", err);
        });
    };

    // Manejador de cambios en inputs del formulario de nuevo producto
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNuevoProducto((prev) => ({ ...prev, [name]: value }));
    };

    // Manejador de cambios en inputs del formulario de edición
    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setProductoEditado((prev) => ({ ...prev, [name]: value }));
    };

    // Manejador para la carga de imágenes
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setNuevoProducto((prev) => ({ ...prev, imagen: reader.result }));
        };
        reader.readAsDataURL(file);
        }
    };

    const handleEditImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setProductoEditado((prev) => ({ ...prev, imagen: reader.result }));
        };
        reader.readAsDataURL(file);
        }
    };

    // Función para agregar un nuevo producto (CREATE)
        const handleAddProducto = async () => {
            // Validar campos requeridos
            if (
            !nuevoProducto.nombre ||
            !nuevoProducto.precio ||
            !nuevoProducto.categoria ||
            !nuevoProducto.imagen
            ) {
            alert("Por favor, completa todos los campos, incluyendo la imagen.");
            return;
            }
        
            // Cerrar modal
            setShowModal(false);
        
            // Crear ID temporal y objeto del producto
            const tempId = `temp_${Date.now()}`;
            const productoConId = {
            ...nuevoProducto,
            id: tempId,
            precio: parseFloat(nuevoProducto.precio), // Asegurar que precio sea número
            };
        
            try {
            // Actualizar estado local
            setProductos((prev) => [...prev, productoConId]);
            setProductosFiltrados((prev) => [...prev, productoConId]);
        
            // Mensaje según estado de conexión
            if (isOffline) {
                console.log("Producto agregado localmente (sin conexión).");
                alert("Sin conexión: Producto agregado localmente. Se sincronizará al reconectar.");
            } else {
                console.log("Producto agregado exitosamente en la nube.");
            }
        
            // Guardar en Firestore
            await addDoc(productosCollection, {
                nombre: nuevoProducto.nombre,
                precio: parseFloat(nuevoProducto.precio),
                categoria: nuevoProducto.categoria,
                imagen: nuevoProducto.imagen,
            });
        
            // Limpiar formulario
            setNuevoProducto({ nombre: "", precio: "", categoria: "", imagen: "" });
            } catch (error) {
            console.error("Error al agregar el producto:", error);
            if (isOffline) {
                console.log("Offline: Producto almacenado localmente.");
            } else {
                // Revertir cambios locales si falla en la nube
                setProductos((prev) => prev.filter((prod) => prod.id !== tempId));
                setProductosFiltrados((prev) => prev.filter((prod) => prod.id !== tempId));
                alert("Error al agregar el producto: " + error.message);
            }
            }
        };

    // Función para actualizar un producto existente (UPDATE)
        const handleEditProducto = async () => {
            // Validar campos requeridos
            if (
            !productoEditado.nombre ||
            !productoEditado.precio ||
            !productoEditado.categoria ||
            !productoEditado.imagen
            ) {
            alert("Por favor, completa todos los campos, incluyendo la imagen.");
            return;
            }
        
            // Cerrar modal
            setShowEditModal(false);
        
            const productoRef = doc(db, "productos", productoEditado.id);
        
            try {
            // Actualizar estado local
            setProductos((prev) =>
                prev.map((prod) =>
                prod.id === productoEditado.id
                    ? { ...productoEditado, precio: parseFloat(productoEditado.precio) }
                    : prod
                )
            );
            setProductosFiltrados((prev) =>
                prev.map((prod) =>
                prod.id === productoEditado.id
                    ? { ...productoEditado, precio: parseFloat(productoEditado.precio) }
                    : prod
                )
            );
        
            // Mensaje según estado de conexión
            if (isOffline) {
                console.log("Producto actualizado localmente (sin conexión).");
                alert("Sin conexión: Producto actualizado localmente. Se sincronizará al reconectar.");
            } else {
                console.log("Producto actualizado exitosamente en la nube.");
            }
        
            // Actualizar en Firestore
            await updateDoc(productoRef, {
                nombre: productoEditado.nombre,
                precio: parseFloat(productoEditado.precio),
                categoria: productoEditado.categoria,
                imagen: productoEditado.imagen,
            });
        
            } catch (error) {
            console.error("Error al actualizar el producto:", error);
            if (isOffline) {
                console.log("Offline: Producto actualizado localmente.");
            } else {
                // Revertir cambios locales si falla en la nube
                setProductos((prev) =>
                prev.map((prod) =>
                    prod.id === productoEditado.id ? { ...prod } : prod
                )
                );
                setProductosFiltrados((prev) =>
                prev.map((prod) =>
                    prod.id === productoEditado.id ? { ...prod } : prod
                )
                );
                alert("Error al actualizar el producto: " + error.message);
            }
            }
        };

    // Función para eliminar un producto (DELETE)
    const handleDeleteProducto = async () => {
        if (!productoAEliminar) return;
    
        // Cerrar modal
        setShowDeleteModal(false);
    
        try {
          // Actualizar estado local
            setProductos((prev) => prev.filter((prod) => prod.id !== productoAEliminar.id));
            setProductosFiltrados((prev) => prev.filter((prod) => prod.id !== productoAEliminar.id));
        
            // Mensaje según estado de conexión
            if (isOffline) {
                console.log("Producto eliminado localmente (sin conexión).");
                alert("Sin conexión: Producto eliminado localmente. Se sincronizará al reconectar.");
            } else {
                console.log("Producto eliminado exitosamente en la nube.");
            }
        
            // Eliminar en Firestore
            const productoRef = doc(db, "productos", productoAEliminar.id);
            await deleteDoc(productoRef);
        
            } catch (error) {
            console.error("Error al eliminar el producto:", error);
            if (isOffline) {
                console.log("Offline: Eliminación almacenada localmente.");
            } else {
                // Restaurar producto en estado local si falla en la nube
                setProductos((prev) => [...prev, productoAEliminar]);
                setProductosFiltrados((prev) => [...prev, productoAEliminar]);
                alert("Error al eliminar el producto: " + error.message);
            }
            }
        };

      // Calcular productos paginados
    const paginatedProductos = productosFiltrados.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Función para abrir el modal de edición con datos prellenados
    const openEditModal = (producto) => {
        setProductoEditado({ ...producto });
        setShowEditModal(true);
    };

    // Función para abrir el modal de eliminación
    const openDeleteModal = (producto) => {
        setProductoAEliminar(producto);
        setShowDeleteModal(true);
    };

    const generarPDFProductos = () => {
        const doc = new jsPDF();
        //Encabezado
        doc.setFillColor(28,41,51);
        doc.rect(0,0,220,30, 'F'); //Ancho completo, alto 30
        //Titulo centrado con texto blanco
        doc.setTextColor(255,255, 255); //Color del título
        doc.setFontSize(28);
        doc.text("Lista de Productos", doc.internal.pageSize.getWidth()/2,18, {algin: "center"});

        const columnas = ["#", "Nombre", "Precio", "Categoría"];
        const filas = productosFiltrados.map((producto, index) => [
            index + 1,
            producto.nombre,
            `C$ ${producto.precio}`,
            producto.categoria,
        ]);

        //Marcador para mostrar el total de páginas
        const totalPaginas = "{total_pages_count_string}";

        //Configuración de la tabla
            autoTable(doc, {
            head: [columnas],
            body: filas,
            startY: 40,
            theme: "grid",
            styles: { fontSize: 10, cellPadding: 2 },
            margin: { top: 20, left: 14, right: 14 },
            tableWidth: "auto", // Ajuste de ancho automatico
            columnStyles: {
                0: { cellWidth: "auto" }, // Ajuste de ancho automatico
                1: { cellWidth: "auto" },
                2: { cellWidth: "auto" },
            },
            pageBreak: "auto",
            rowPageBreak: "auto",
            didDrawPage: function (data) {
                // Altura y ancho de la página actual
                const alturaPagina = doc.internal.pageSize.getHeight();
                const anchoPagina = doc.internal.pageSize.getWidth();

                // Número de página actual
                const numeroPagina = doc.internal.getNumberOfPages();
                const totalPaginas = doc.internal.getNumberOfPages(); // Esto debería ser el número total de páginas después de generar la tabla

                // Definir texto de número de página en el centro del documento
                doc.setFontSize(10);
                doc.setTextColor(0, 0, 0);
                const piePagina = `Página ${numeroPagina} de ${totalPaginas}`; // Asumo que totalPaginas se definirá correctamente en un contexto más amplio
                doc.text(piePagina, anchoPagina / 2 + 15, alturaPagina - 10, { align: "center" });
            },
            });

        //Actualizar el marcador con el total real de páginas
        if (typeof doc.putTotalPages === 'function') {
            doc.putTotalPages(totalPaginas);
        }

        // Guardar el PDF con un nombre basado en la fecha actual
        const fecha = new Date();
        const dia = String(fecha.getDate()).padStart(2, '0');
        const mes = String(fecha.getMonth() + 1).padStart(2, '0');
        const anio = fecha.getFullYear();
        const nombreArchivo = `productos_${dia}${mes}${anio}.pdf`;

        //Guardar documento PDF 
        doc.save(nombreArchivo);
    }

    const generarPDFDetalleProducto = (producto) => {
        const pdf = new jsPDF();

        // Encabezado
        pdf.setFillColor(28, 41, 51);
        pdf.rect(0, 0, 220, 30, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(22);
        pdf.text(producto.nombre, pdf.internal.pageSize.getWidth() / 2, 18, { align: "center" });

        // Imagen centrada (si existe)
        if (producto.imagen) {
            const propiedadesImagen = pdf.getImageProperties(producto.imagen);
            const anchoPagina = pdf.internal.pageSize.getWidth();
            const anchoImagen = 60;
            const altoImagen = (propiedadesImagen.height * anchoImagen) / propiedadesImagen.width;
            const posicionX = (anchoPagina - anchoImagen) / 2;
            pdf.addImage(producto.imagen, 'JPEG', posicionX, 40, anchoImagen, altoImagen);

            // Datos centrados debajo de la imagen
            const posicionY = 40 + altoImagen + 10;
            pdf.setTextColor(0, 0, 0);
            pdf.setFontSize(14);
            pdf.text(`Precio: C$ ${producto.precio}`, anchoPagina / 2, posicionY, { align: "center" });
            pdf.text(`Categoría: ${producto.categoria}`, anchoPagina / 2, posicionY + 10, { align: "center" });

        } else {
            // Si no hay imagen, mostrar los datos más arriba
            pdf.setTextColor(0, 0, 0);
            pdf.setFontSize(14);
            pdf.text(`Precio: C$ ${producto.precio}`, pdf.internal.pageSize.getWidth() / 2, 50, { align: "center" });
            pdf.text(`Categoría: ${producto.categoria}`, pdf.internal.pageSize.getWidth() / 2, 60, { align: "center" });
        }

        pdf.save(`${producto.nombre}.pdf`);
        };

        const exportarExcelProductos = () => {

            //Estructura de datos para la hoja de Excel
            const datos = productosFiltrados.map((producto, index) => ({
                "#": index + 1,
                Nombre: producto.nombre,
                Precio: parseFloat(producto.precio),
                Categoría: producto.categoria,
            }));

            //Crear hoja y libro Excel
            const hoja = XLSX.utils.json_to_sheet(datos);
            const libro = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(libro, hoja, 'Productos');

            //Crear el archivo binario
            const excelBuffer = XLSX.write(libro, { bookType: 'xlsx', type: 'array'});

            //Guardar el Excel con un nombre basado en la fecha actual
            const fecha = new Date();
            const dia = String(fecha.getDate()).padStart(2, '0');
            const mes = String(fecha.getMonth() + 1).padStart(2, '0');
            const anio = fecha.getFullYear();

            const nombreArchivo = `Productos_${dia}${mes}${anio}.xlsx`;

            //Guardar Archivo
            const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
            saveAs(blob, nombreArchivo);
        }


    // Renderizado del componente
    return (
        <Container className="mt-5">
        <br />
        <h4>{t('menu.gestionProductos')}</h4>
        <Button className="mb-3" onClick={() => setShowModal(true)}>
            {t('menu.agregarProducto')}
        </Button>
        <Col lg={3} md={4} sm={4} xs={5}>
            <Button
                className="mb-3"
                onClick={exportarExcelProductos}
                variant="secondary"
                style={{ width: "100%" }}
            >
                {t('menu.generarExcel')}
            </Button>
        </Col>

        <Col lg={3} md={4} sm={4} xs={5}>
            <Button
                className="mb-3"
                onClick={generarPDFProductos}
                variant="secondary"
                style={{ width: "100%" }}
            >
                {t('menu.generarReportePDF')}
            </Button>
        </Col>

        <CuadroBusquedas
            searchText={searchText}
            handleSearchChange={handleSearchChange}
        />
        <TablaProductos
            openEditModal={openEditModal}
            openDeleteModal={openDeleteModal}
            productos={paginatedProductos} // Pasar productos paginados
            totalItems={productos.length} // Total de productos
            itemsPerPage={itemsPerPage}   // Elementos por página
            currentPage={currentPage}     // Página actual
            setCurrentPage={setCurrentPage} // Método para cambiar página
            handleCopy={handleCopy} //Método para copiar los elementos de una fila
            generarPDFDetalleProducto={generarPDFDetalleProducto}
        />
        <Paginacion
            itemsPerPage={itemsPerPage}
            totalItems={productosFiltrados.length}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
        />
        <ModalRegistroProducto
            showModal={showModal}
            setShowModal={setShowModal}
            nuevoProducto={nuevoProducto}
            handleInputChange={handleInputChange}
            handleImageChange={handleImageChange}
            handleAddProducto={handleAddProducto}
            categorias={categorias}
        />
        <ModalEdicionProducto
            showEditModal={showEditModal}
            setShowEditModal={setShowEditModal}
            productoEditado={productoEditado}
            handleEditInputChange={handleEditInputChange}
            handleEditImageChange={handleEditImageChange}
            handleEditProducto={handleEditProducto}
            categorias={categorias}
        />
        <ModalEliminacionProducto
            showDeleteModal={showDeleteModal}
            setShowDeleteModal={setShowDeleteModal}
            handleDeleteProducto={handleDeleteProducto}
        />
        </Container>
    );
    };

    export default Productos;