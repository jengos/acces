import React from "react";
import Menu from "./menus/Menu";
import HorizontalNav from "./menus/Menu";


const menuItems = [
  {
    label: 'Inicio',
    position: 'first',
    subItems: [
      { label: 'Dashboard' },
      { label: 'Resumen' },
    ],
  },
  {
    label: 'Productos',
    subItems: [
      { label: 'Lista de productos' },
      { label: 'Categorías' },
      { label: 'Nuevo producto' },
    ],
  },
  {
    label: 'Clientes',
    subItems: [
      { label: 'Todos los clientes' },
      { label: 'Segmentos' },
    ],
  },
  {
    label: 'Reportes',
    subItems: [
      { label: 'Ventas' },
      { label: 'Ingresos' },
      { label: 'Inventario' },
    ],
  },
  {
    label: 'Configuración',
    position: 'last',
    subItems: [
      { label: 'Preferencias' },
      { label: 'Usuarios' },
      { label: 'Roles' },
    ],
  },
]




const App: React.FC = () => {
  return (
    <div >
    <HorizontalNav menuItems ={menuItems }/> 
    </div>
  );
};

export default App;
