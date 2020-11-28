import React, { useState, useEffect } from 'react';
import './Comprar.css';

/* axios */
import axios from "axios";

/* react-router-dom */
import { useParams } from "react-router-dom";

/* datos del programa */
import { baseURL, verArticuloURL, agregarCarritoURL, borrarDelCarritoURL, Redirigir, deshex, arrayBase64 } from "../datos";

const Comprar = (props) => {
    const [busqueda, setBusqueda] = useState(true);
    const [publicacion, setPublicacion] = useState(null);
	const [miniaturas, setMiniaturas] = useState([]);
	const [minsel, setMinsel] = useState(-1);
    const [error, setError] = useState(false);
    const [descripcionColapsada, setDescripcionColapsada] = useState(false);
    const [redirigirCarrito, setRedirigirCarrito] = useState(false);

    const { rnart } = useParams();
    
    useEffect(() => {
        if(busqueda) {
            let url = baseURL + verArticuloURL + "?idpublicacion=" + rnart.toString();
            if(props.usr) {
                url += "&dataidusuario=" + props.usr.dataId;
            }
            console.log(url);
            axios.get(url)
            .then(res => {
                setPublicacion(res.data);
				setMiniaturas(res.data.imagenes);
				setMinsel(0);
                setBusqueda(false);
                setError(false);
            })
            .catch(err => {
                setError(true);
            });
        }
    }, [busqueda]); 

    function agregarAlCarrito() {
		if(!props.usr) alert("Debes iniciar sesion!!!")
		else {
			let url = baseURL + agregarCarritoURL;
			let formData = new FormData();
			formData.append("idp", rnart.toString());
			formData.append("dataid", props.usr.dataId.toString());
			axios.post(url, formData)
			.then(res => {
                if(res.data == "0") {
                    alert("\u00a1Agregado!");
                    setRedirigirCarrito(true);
                }
            })
			.catch(err => {});
		}
    }

    function borrarDelCarrito() {
        if(props.usr) {
			let url = baseURL + borrarDelCarritoURL;
			let formData = new FormData();
			formData.append("idpublicacion", rnart.toString());
			formData.append("dataidusuario", props.usr.dataId.toString());
			axios.post(url, formData)
			.then(res => {
                if(res.data == "0") {
                    alert("\u00a1Eliminado!");
                    setRedirigirCarrito(true);
                }
            })
			.catch(err => {});
		}
    }
    
    return(
        <>
        {redirigirCarrito && <Redirigir donde="/admin/carrito" /> }
        {publicacion === null && !error && <div className="div-cargando"/> }
        {error && <Redirigir donde="/error" /> }
        {!error && publicacion !== null && minsel != -1 &&
		<div className="comprar-articulo-view border-box">
            <div className="marco box-shadow-1">
                <div className="detalles-compra border-box">
                    <div className="comprar-articulo__imagen">
			            <h2 className="titulo-alternativo gris-oscuro">{deshex(publicacion.titulo)}</h2>
                        <div className="imagen-visible">
                            <img className="img" src={"data:image/*;base64,"+arrayBase64(miniaturas[minsel].bytes)} alt="Imagen"/>
                        </div>
                        <div className="miniaturas talign-center">
                            {miniaturas.map((item, i) => (
                                <img    
                                key={i}
                                className="img-miniatura"
                                src={"data:image/*;base64,"+arrayBase64(item.bytes)}
								onMouseEnter={e => setMinsel(i)}
                                alt="" />
                            ))}
                        </div>
                    </div>
                    <div className="comprar-articulo__informacion">
                        <h2 className="titulo-publicacion-compra gris-oscuro">{deshex(publicacion.titulo)}</h2>
                        {publicacion.cantidad === "0" && <h3 style={{color: "#85203b"}}>{"\u00a1Producto sin stock!"}</h3>}
                        <span className="comprar-articulo__precio dblock gris-oscuro roboto-c">{"$" + publicacion.precio}</span>
                        <p 
                            className="gris-oscuro roboto"
                            style={{margin: ".9em 0 1em", fontSize: "1.4rem"}}>{"Detalles del art\u00edculo"}</p>
                        <div
                            className={"art-descr roboto cursor-pointer" + (descripcionColapsada ? "" : " colapsado")}
                            onClick={_ => setDescripcionColapsada(!descripcionColapsada)} >
                            {deshex(publicacion.descripcion)}
                        </div>
                        
                        <div className="">
                            {publicacion.cantidad !== "0" && 
                            <>
                                <br/>
                                <p>{"Cantidad disponible: " + publicacion.cantidad}</p>
                                <br/>
                                <div className="dflex"><a  
                                    className="n-boton a-limpio" 
                                    onClick={e => {
                                        if(publicacion.enCarrito == "false") {
                                            borrarDelCarrito();
                                        }
                                        else agregarAlCarrito()
                                    }} >
                                    {publicacion.enCarrito == "false" ? "BORRAR DEL CARRITO" : "AGREGAR AL CARRITO"}
                                </a>
                                </div>
                            </>
                        }
                        </div>
                    </div>
                </div>
            </div>
        </div>}
        </>
    )
};

export default Comprar;
