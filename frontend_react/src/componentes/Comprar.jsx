import React, { useState, useEffect } from 'react';
import './Comprar.css';

/* axios */
import axios from "axios";

/* react-router-dom */
import { useParams } from "react-router-dom";

/* datos del programa */
import { baseURL, verArticuloURL, deshex, arrayBase64 } from "../datos";

import { Star, StarFill } from 'react-bootstrap-icons';

/*
const Review = (props) => {
    return(
        <div className="review-usuario border-box">
            <div className="review-contenido dflex">
                <div className="review__foto-perfil">
                    <img className="img" src="/res/reviews-usuarios/foto-1.png" alt=""/>
                </div>
                <div className="review__informacion">
                    <p className="roboto" style={{fontWeight: "600"}}>Lautaro I. Pressman</p>
                    <div 
                        className="review-puntuacion dflex"
                        style={{margin: "1em 0", color: "#888"}}>
                        <StarFill />
                        <StarFill />
                        <StarFill />
                        <StarFill />
                        <Star />
                    </div>
                    <span>Y, volviendo las riendas, encaminó a Rocinante hacia donde le pareció que las voces salían. Y, a pocos pasos que entró por el bosque, vio atada una yegua a una encina, y atado en otra a un muchacho, desnudo de medio cuerpo arriba, hasta de edad de quince años, que era el que las voces daba; y no sin causa, porque le estaba dando con una pretina muchos azotes un labrador de buen talle, y cada azote le acompañaba con una reprehensión y consejo. Porque decía:.</span>
                </div>
            </div>
        </div>
    )
}


function useClickFuera(ref, handler) {
    useEffect((e) => {
        const listener = evento => {
            if (!ref.current || ref.current.contains(evento.target)) {
                return;
            }
            else handler(evento);
        };

        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);

        return () => {
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        };

    }, [ref, handler]);
}


const Lista = (props) => {
    const [expandido, setExpandido] = useState(false);
    const [elegido, setElegido] = useState(props.elementos[0]);
    const ref = useRef();

    const elegirItem = (evento) => {
        let seleccionado = evento.currentTarget.innerHTML;
        setElegido(seleccionado);
        setExpandido(false);
    }

    useClickFuera(ref, () => setExpandido(false));

    return(
        <div
            className="lista" 
            ref={ref}>
            <div className="lista-header" onClick={() => setExpandido(!expandido)}>
                <span>{elegido}</span>
            </div>
            <div className={ expandido ? "lista-contenedor" : "lista-contenedor cerrado" }>
                {props.elementos.map((item, i) => {
                    return <div className="lista-item" onClick={(e) => elegirItem(e)}>{item}</div>
                })}
            </div>
        </div>
    )
}
*/

const Comprar = (props) => {
    const [busqueda, setBusqueda] = useState(true);
    const [publicacion, setPublicacion] = useState(null);
	const [miniaturas, setMiniaturas] = useState([]);
	const [minsel, setMinsel] = useState(-1);
    const [error, setError] = useState(false);
    const [descripcionColapsada, setDescripcionColapsada] = useState(false);

    const { rnart } = useParams();
    
    useEffect(() => {
        if(busqueda) {
            let url = baseURL + verArticuloURL + "/" + rnart.toString();
            let form = new FormData();
            form.append("id", rnart.toString());
            axios.get(url, form)
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

    return(
        <>
        {publicacion === null && !error && <div className="div-cargando"/> }
        {error && <div>Error conectando al servidor.</div> }
        {publicacion !== null && minsel != -1 &&
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
                        <br/>
                        <div className="dflex">
                            {/* <a 
                                className="n-boton a-limpio"
                                style={{width: 60, backgroundColor: "#66d37e"}}
                                href={"/pago/"+rnart} >
                                <i className="fas fa-shopping-cart"></i>
                            </a> */}
                            {publicacion.cantidad !== "0" && <a  
                                className="n-boton a-limpio" 
                                href={"/pago/"+rnart} >
                                Comprar
                            </a>}
                        </div>
                    </div>
                </div>
                {/* <div className="comprar-reviews-usuarios">
                    <h2 className="roboto" style={{textAlign: "left"}}>Reviews de usuarios</h2>
                    <Review />
                </div> */}
            </div>
        </div>}
        </>
    )
};

export default Comprar;
