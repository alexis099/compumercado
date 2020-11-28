import React, { useState, useEffect } from 'react';
import './App.css';
import './componentes/ComponentesGenerales.css';

/* redux */
import { useDispatch, useSelector } from "react-redux";

/* react-router-dom */
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

/* js-cookie */
import Cookies from "js-cookie";

/* axios */
import axios from "axios";

/* datos del programa */
import { baseURL, verificarUsuarioURL, Redirigir, desencriptar, deshex } from "./datos";

/* componentes */
import { BannerSimple, BannerNormal } from './componentes/BannerSuperior';
import Galeria from './componentes/Galeria';
import IniciarSesion from './componentes/IniciarSesion';
import CrearCuenta from './componentes/CrearCuenta';
import CuentaCreadaConfirmacion from './componentes/CuentaCreadaConfirmacion';
import Admin from './componentes/Admin';
import Comprar from './componentes/Comprar';
import PagarCompra from './componentes/PagarCompra';
import Vender from './componentes/Vender';

const RoutingDesconectar = () => {
	Cookies.remove("usr");
	return <Redirigir donde="/" />
}

const RoutingNoEncontrado = (props) => {
	return(
		<React.Fragment>
			<BannerNormal />
			<div className="no-encontrado">404</div>
			<div className="talign-center roboto gris-oscuro">{"No se encontr\u00f3 lo que buscabas..."}</div>
		</React.Fragment>
	)
}

const RoutingAlgoHaSalidoMal = (props) => {
	return(
		<React.Fragment>
			<BannerNormal />
			<div className="algo-ha-salido-mal">Algo ha salido mal...</div>
			<div className="talign-center roboto gris-oscuro">{"Hubo un error al realizar la operaci\u00f3n."}</div>
		</React.Fragment>
	)
}

const RoutingNormal = (props) => {
	return(
		<React.Fragment>
			<BannerNormal />
      {props.tipo === 0 && <Galeria />}
      {props.tipo === 1 && (props.conectado ? <Admin pagina={props.pag} /> : <Redirigir donde="/ingresar" />)}
      {props.tipo === 2 && <Comprar usr={props.usrid} />}
      {props.tipo === 3 && (props.conectado ? <PagarCompra /> : <Redirigir donde="/ingresar" />)}
      {props.tipo === 4 && ((props.conectado) ? <Vender dataId={props.usrid.dataId} /> : <Redirigir donde="/ingresar" />)}
		</React.Fragment>
	)
}

const RoutingSimple = (props) => {
	return(
		<React.Fragment>
			<BannerSimple />
      {props.tipo === 0 && (props.conectado ? <Redirigir donde="/" /> : <IniciarSesion />)}
      {props.tipo === 1 && (props.conectado ? <Redirigir donde="/" /> : <CrearCuenta />)}
      {props.tipo === 2 && <CuentaCreadaConfirmacion />}
		</React.Fragment>
	)
}


function App() {
	const [conectado, setConectado] = useState(false);
  const [usr, setUsr] = useState(null);


  function verificarUsuario() {
    if(!usr) {
      Cookies.remove("usr");
      setConectado(false);
      return;
    }

    let url = baseURL + verificarUsuarioURL + "?dataid=" + usr.dataId;
    axios.get(url)
    .then(res => {})
    .catch(err => setUsr(null));
  }

  const dispatch = useDispatch();
  useEffect(() => {
    // verificarUsuario();
    dispatch( {type: "GUARDAR_USUARIO", payload: usr} );
  }, [usr]);

  let usuariocookie = Cookies.get("usr");
	let usr_data = null;
	if(!conectado && usuariocookie !== undefined) {
		let _dh = deshex(usuariocookie);
		let _desenc = desencriptar(_dh);
		usr_data = JSON.parse(_desenc);
		setUsr(JSON.parse(_desenc));
    setConectado(true); 
  }

  return (
    <Router>
      <div className='App width100 height100'>
        <div className='App__contenido width100 height100'>
          <Switch>
            <Route path='/' exact render={ _ => <RoutingNormal tipo={0} conectado={conectado} />} />
            <Route path='/categorias/:categoria' exact render={ _ => <RoutingNormal tipo={0} conectado={conectado} />} />
            <Route path='/busqueda/:busqueda_query' exact render={ _ => <RoutingNormal tipo={0} conectado={conectado} usr={usr} />} />
            <Route path='/ingresar' exact render={ _ => <RoutingSimple tipo={0} conectado={conectado} />} />
            <Route path='/registro' exact render={ _ => <RoutingSimple tipo={1} conectado={conectado} />} />
            <Route path='/registro/confirmacion' exact render={ _ => <RoutingSimple tipo={2} conectado={conectado} />} />
            <Route path='/desconectar' exact render={ _ => <RoutingDesconectar />} />
            <Route path='/admin/compras' exact render={ _ => <RoutingNormal tipo={1} conectado={conectado} pag="0" />} />
            <Route path='/admin/ventas' exact render={ _ => <RoutingNormal tipo={1} conectado={conectado} pag="1" />} />
            <Route path='/admin/publicaciones' exact render={ _ => <RoutingNormal tipo={1} conectado={conectado} pag="2" />} />
            <Route path='/admin/carrito' exact render={ _ => <RoutingNormal tipo={1} conectado={conectado} pag="3" />} />
            <Route path='/comprar/:rnart/:nomarticulo' exact render={ _ => <RoutingNormal tipo={2} conectado={conectado} usrid={usr} />} />
            <Route path='/pago/:rnart' exact render={ _ => <RoutingNormal tipo={3} conectado={conectado} />} />
            <Route path='/vender' exact render={ _ => <RoutingNormal tipo={4} usrid={usr} conectado={conectado} />} />
            <Route path='/editar/:idpublicacion' exact render={ _ => <RoutingNormal tipo={4} usrid={usr} conectado={conectado} usr={usr} />} />
            <Route path='/error' exact render={ _ => <RoutingAlgoHaSalidoMal /> } />
            <Route render={ _ => <RoutingNoEncontrado /> } />
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
