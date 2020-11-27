import React, { useState, useEffect } from 'react';
import './Galeria.css';

/* redux */
import { useSelector } from "react-redux";

/* react-router-dom */
import { useParams } from "react-router-dom";

/* axios */
import axios from "axios";

/* datos del programa */
import { baseURL, inicioURL, agregarCarritoURL, deshex, arrayBase64 } from "../datos";

/* vista */ 

const Articulo = (props) => {
	function agregarCarrito() {
		if(!props.dataid) alert("Debes iniciar sesion!!!")
		else {
			let url = baseURL + agregarCarritoURL;
			let formData = new FormData();
			formData.append("idp", props.idp);
			formData.append("dataid", props.dataid.toString());
			axios.post(url, formData)
			.then(res => alert(res.data == "0" ? "Agregado!" : "Error :<"))
			.catch(err => {});
		}
	}

    return(
        <div className="cuadricula-articulos__item box-shadow-1">
            <a className="item-link a-limpio" href={"/comprar/"+props.idp+"/"+props.url} >
                <img className="articulo__img" src={"data:image/*;base64,"+props.img} alt="Imagen" />
				<div className="item-info"> 
					<span className="articulo__precio dblock">{props.precio}</span>
					<div className="articulo__separador"></div>
					<span className="articulo__titulo dblock">{props.titulo}</span>
				</div>
            </a>
			{/* <div className="articulo__boton-comprar dflex">
				<span className="agregar-carrito cursor-pointer">
					<i className="fas fa-shopping-cart"></i>
					<span
						className="link-menu-agregar cursor-pointer box-shadow-1"
						onClick={e => agregarCarrito(props.idp)}>
						Agregar al carrito
					</span>
				</span>
				<a className="comprar-articulo dblock a-limpio" href={"/pago/"+props.idp}>
					COMPRAR
				</a>
			</div> */}
        </div>
    )
}

const Galeria = (props) => {
    const [listado, setListado] = useState([]);
    const [busqueda, setBusqueda] = useState(true);
    const [error, setError] = useState(false);
    const [usr, setUsr] = useState(null);

	let { categoria, busqueda_query } = useParams();

	let usr_tmp = useSelector(state => state.usuario);
	if(usr_tmp && !usr) setUsr(usr_tmp);

    useEffect(() => {
        if(busqueda){ 
			let url = baseURL + inicioURL;
			if(categoria) {
				url += "?categoria=" + categoria;
			}
			else if(busqueda_query) {
				url += "?busqueda=" + busqueda_query;
			}
			axios.get(url)
			.then(res => {
				setListado(res.data);
				setBusqueda(false);
				setError(false);
			})
			.catch(err => {
				setError(true);
			})
		};
    }, [listado, busqueda]); 

	if(error) return( <div className="talign-center">No se pudo conectar con el servidor.</div>)
	else if(busqueda && !error) return(<div className="div-cargando"/>)
	else if(!busqueda && !error && listado.length === 0) 
		return(<div className="talign-center">
			{busqueda_query && "No hay publicaciones que coincidan con la busqueda \"" + busqueda_query + "\"."}
			{!busqueda_query && 
			<>
				<div>
					<div style={{marginBottom: "4em"}}></div>
					<div className="gris-mas-oscuro" style={{fontSize: "3rem", marginBottom: "2em"}}>{"Todav\u00eda no hay publicaciones..."}</div>
					<a className="a-limpio2" href="/vender" style={{fontSize: "1.5rem", color: "var(--color-principal)"}}>{"\u00a1S\u00e9 el primero en crear una publicaci\u00f3n!"}</a>
				</div>
			</>
			}
		</div>)

    return(
        <div className="galeria-articulos-view" >
			<div className="cuadricula-articulos">
				{listado.map(item => 
					{
						let titulo = deshex(item.titulo);
						return(<Articulo
						idp={item.id}
						url={item.url}
						dataid={usr ? usr.dataId : null}
						titulo={titulo.substring(0, Math.min(60, titulo.length)) + "..."}
						precio={"$"+item.precio} 
						img={arrayBase64(item.imagenes[0].bytes)} />)
					}
				)}
			</div>
        </div>
    )
}

export default Galeria;
