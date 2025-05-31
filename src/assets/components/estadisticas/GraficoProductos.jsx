import { Card } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import Chart from 'chart.js/auto';
import { useTranslation } from "react-i18next";

const GraficoProductos = ({ nombres, precios }) => {

    const { t, i18n } = useTranslation();
        
    const cambiarIdioma = (lang) => {
        i18n.changeLanguage(lang);
    };
    
    const data = {
        labels: nombres,
        datasets: [
            {
                label: 'Precio (C$)',
                data: precios,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: {
                display: true,
                text: 'Precios de Productos',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Precio (C$)',
                },
            },
            x: {
                title: {
                    display: true,
                    text: 'Productos',
                },
            },
        },
    };

    return (
        <div style={{ width: "100%", height: "400px" }}>
            <Card>
                <Card.Body>
                    <Card.Title>{t('menu.graficoProductos')}</Card.Title>
                    <Bar data={data} options={options} />
                </Card.Body>
            </Card>
        </div>
    );
};

export default GraficoProductos;
