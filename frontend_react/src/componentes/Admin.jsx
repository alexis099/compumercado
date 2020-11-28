import React, { useState, useEffect } from 'react';
import './Admin.css';

/* redux */
import { useSelector } from "react-redux";

/* datos del programa */
import { 
	baseURL, 
	verComprasURL, 
	verVentasURL, 
	verPublicacionesURL, 
	verCarritoURL, 
	pagarArticuloURL, 
	eliminarPublicacionURL,
	deshex, 
	arrayBase64 } from "../datos";

import { FormularioPago } from "./PagarCompra";

/* axios */
import axios from "axios";

const Informacion = (props) => {
	const [formulario, setFormulario] = useState(false);
	const [exito, setExito] = useState(false);
	const [datos, setDatos] = useState([]);
	const [total, setTotal] = useState("");
	const [usr, setUsr] = useState(null);

	const titulos = ["Compras", "Ventas", "Publicaciones", "Carrito"];
	const verbos = ["Comprado", "Vendido", "Publicado", "Agregado"];

	let usr_tmp = useSelector(state => state.usuario);
	if(usr_tmp && !usr) setUsr(usr_tmp);

	let sel = props.sel;
	useEffect(() => {
		if(usr) {
			let url = baseURL;
			if(sel === "0") url += verComprasURL;
			if(sel === "1") url += verVentasURL;
			if(sel === "2") url += verPublicacionesURL;
			if(sel === "3") url += verCarritoURL
			let formData = new FormData();
			formData.append("dataid", usr.dataId);
			axios.post(url, formData)
			.then(res => {
				if(sel === "0") setDatos(res.data.map((item, i) => [item, 1]));
				if(sel === "1") setDatos(res.data.map((item, i) => [item, 1]));
				if(sel === "2") setDatos(res.data.map((item, i) => [item, 1]));
				if(sel === "3") {setDatos(res.data.map((item, i) => [item, 1])); setTotal("0.00")};
			});
		}
	}, [usr])

	function sumar() {
		let suma = 0;
		datos.forEach(item => {
			suma += Number(item[0].precio) * Number(item[1]);
		});
		return suma.toString();
	}

    const Item = (props) => {
		let dato = props.d[0];
		let indice = props.indice;
		let sel = props.sel;
		const [borrar, setBorrar] = useState(false);
		const [cantidad, setCantidad] = useState(props.d[1]); // cantidad de cada item en el carrito
		const [recargar, setRecargar] = useState(false);

		useEffect(() => {if(recargar) window.location.reload(); setRecargar(false)}, [recargar]);

		function eliminarPublicacion(id) {
			let url = baseURL + eliminarPublicacionURL;
			let formData = new FormData();
			formData.append("idp", id.toString());
			axios.post(url, formData)
			.then(res => {
				if(res.data == "0") {
					alert("Eliminado");
					setRecargar(true);
				}
				else console.log(res.data);
			})
			.catch(err => console.log(err));
		}

		function cantidades() {
			let a = [];
			for(let i = 0; i < parseInt(dato.cantidadTotal); i++ ) {
				a.push((i + 1).toString());
			}
			return a;
		}

        return(
			<>
			<li className="dblock li-item "> 
                <div className="dblock gris-mas-oscuro" href={"/comprar/"+dato.id+"/"+dato.url}>
					<div className="li-item-datos">
						<img className="li-item__icono" src={"data:image/*;base64,"+arrayBase64(dato.miniatura)} width="48px" height="48px" alt="Imagen del articulo"/>
                
						<div className="li-item__info">
							<div className="li-item__nombre-articulo roboto-c"><a className="a-limpio2 gris-mas-oscuro" href={"/comprar/"+dato.id+"/"+dato.url}>{deshex(dato.titulo)}</a></div>
							{sel === "0" && <div className="roboto">Vendedor: {dato.vendedor}</div>}
							{sel === "1" && <div className="roboto">Comprador: {dato.comprador}</div>}
							{sel === "2" && 
								<>
									<a className="chip" href={"/editar/"+dato.id}>
										Editar publicacion
									</a>
									<span className="chip" onClick={ _ => setBorrar(true)}>Eliminar</span>
								</>
							}
							{sel === "3" && 
								<>
									<span style={{marginRight: 10}}>Cantidad:</span>
									<select onChange={e => {
										setCantidad(e.target.value); 
										let nuevosDatos = [...datos];
										nuevosDatos[indice][1] = e.target.value;
										setDatos(nuevosDatos);
									}}>
										{cantidades().map(item => <option selected={item == cantidad} >{item}</option>)}
									</select>
								</>
							}
						</div>
				
						<div className="li-item__fecha dflex">
							<span className="roboto">
								{borrar ? "\u00bfBorrar esta publicaci\u00f3n?" : verbos[sel] + " el " + dato.fechadia + "/" + dato.fechames + "/" + dato.fechayear}
							</span>
						</div>
						<div className="li-item__precio dflex justify-sb">
							<span className={"li-item__precio roboto-c" + (borrar ? " cursor-pointer" : "")} onClick={_ => {if(borrar) eliminarPublicacion(dato.id)}}>{borrar ? "Si" : "$"}</span>
							<span className={"li-item__precio roboto-c" + (borrar ? " cursor-pointer" : "")} onClick={_ => setBorrar(false)} >{borrar ? "No" : (dato.precio * cantidad)}</span>
						</div>
					</div>
				</div>
            </li>
			</>
        )
	};
    return(
        <>
			{exito && 
				<>
					<h2
						className=" titulo__caption roboto-c"
						style={{ textAlign:"center", paddingTop: "2em" }} >
						{"\u00a1Compra terminada con \u00e9xito!"}
					</h2>
				</>
			}
			{!exito && !formulario && 
			<>
				{/* titulo de cada seccion */}
				<div className="titulo__contenedor">
					<h2 className="titulo__caption roboto-c">{titulos[sel]}</h2>
				</div>

				{/* listado de compras/ventas/carrito... */}
				<div className="lista-items border-box">
					{datos.length === 0 && !usr && <span className="gris-oscuro">Cargando...</span> }
					{datos.length === 0 && usr && <span className="gris-oscuro">{sel === "3" ? "No hay items en el carrito" : "No hay " + titulos[sel].toLowerCase() + " que mostrar."}</span> }
					{datos.map((item, i) => 
						<Item key={i} sel={sel} d={item} indice={i} />
					)}
				</div>

				{/* el total a pagar por todos los items del carrito */}
				{datos.length !== 0 && sel === "3" &&
				<>
					<span className="total-carrito-admin gris-oscuro">Total: $ {sumar()}</span>
					<span
						className="bot-finalizar-compra n-boton a-limpio"
						onClick={_ => {
							setFormulario(!formulario)
						}} >
						FINALIZAR COMPRA
					</span>
				</>
				}
			</>
			}
			{!exito && formulario && 
			<>
			<FormularioPago idp={datos.map(item => item[0].id)} cants={datos.map(item => item[1])} precioTotal={sumar()} usr_id={usr.dataId} exito={setExito} />
			</>
			}
        </>
    )
};


const MenuLateral = (props) => {
	const listaItems = [
    	{icono: <i className="fas fa-shopping-bag"></i>, texto: "Compras", direccion: "0", url: "/compras"},
    	{icono: <i className="fas fa-hand-holding-usd"></i>, texto: "Ventas", direccion: "1", url: "/ventas"},
    	{icono: <i className="fas fa-clone"></i>, texto: "Publicaciones", direccion: "2", url: "/publicaciones"},
    	{icono: <i className="fas fa-shopping-cart"></i>, texto: "Carrito", direccion: "3", url: "/carrito"},
	];

    return(
        <div className="admin__menu-lateral">
			{listaItems.map(item => 
				<a className="admin__item dblock a-limpio2" href={"/admin"+item.url}>
					<span className="admin__item_icono">{item.icono}</span>
					<span className="admin__item_texto">{item.texto}</span>
				</a>
            )}
        </div>
    )
}

const Admin = (props) => {
	const [pagina, setPagina] = useState(props.pagina);

	// const usr = props.usr;
    let usr = useSelector(state => state.usuario);

	/* useEffect(() => {
		if(busqueda){
			let url = baseURL;
			if(pagina === "0") url += verComprasURL;
			if(pagina === "1") url += verVentasURL;
			if(pagina === "2") url += verPublicacionesURL;
			if(pagina === "3") url += verCarritoURL
			let formData = new FormData();
			formData.append("dataid", usr.dataId);

			axios.post(url, formData)
			.then(res => {
				if(pagina === "0") setCompras(res.data);
				if(pagina === "1") setVentas(res.data);
				if(pagina === "2") setPublicaciones(res.data);	
				if(pagina === "3") { setCarrito(res.data.items); setTotal(res.data.total) }
				setBusqueda(false);
			})
			.catch(err => {});
		}
	}, [busqueda]) */

	function clickMenuLateral(pag) {
		setPagina(pag);
	}

	return(
		<div className="admin-view">
			<MenuLateral accion={clickMenuLateral} />
			<div className="admin-panel">
				<Informacion sel={pagina} />
			</div>
		</div>
	)
};

export default Admin;
