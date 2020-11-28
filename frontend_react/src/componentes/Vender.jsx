import React, { useState, useEffect } from 'react';
import './Vender.css';

/* axios */
import axios from "axios";

/* datos */
import { categorias, baseURL, publicarURL, verArticuloURL, hex, deshex, arrayBase64, base64Archivo, Redirigir } from "../datos";

/* react-router-dom */
import { useParams } from "react-router-dom";

import { Camera } from "react-bootstrap-icons";

/* material ui */
import Paper from '@material-ui/core/Paper';

import { 
    XCircle } from "react-bootstrap-icons";
import { useRef } from 'react';

/*  usado para comprobar si los campos fueron editados al menos una vez
    antes de mostrar errores en la validacion */
const camposActivados = {
    categoria: false,
    titulo: false,
    descripcion: false,
    precio: false,
    cantidad: false,
    fotos: false,
};

const Vender = (props) => {
	const [mostrar, setMostrar] = useState(false);

    const [paso, setPaso] = useState(0);
	const [id, setId] = useState(null);
    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [categoria, setCategoria] = useState("-1");
    const [precio, setPrecio] = useState("");
    const [cantidad, setCantidad] = useState(1);
    const [envio, setEnvio] = useState(true);
    const [fotos, setFotos] = useState([]);
    const [uris, setUris] = useState([]);
    const [excedido, setExcedido] = useState(false);
    const [error, setError] = useState(false);
    /* se usa pura y exclusivamente para forzar un re-renderizado (?) */
    const [_, setErrores] = useState(false);

	const { idpublicacion } = useParams();

	useEffect( _ => {
		if(idpublicacion) {
			let url = baseURL + verArticuloURL + "/" + idpublicacion;
			axios.get(url)
			.then(res => {
				let p = res.data;
				setId(p.id);
				setTitulo(deshex(p.titulo));
				setDescripcion(deshex(p.descripcion));
				setCategoria(p.categoria);
				setPrecio(p.precio);
				setCantidad(p.cantidad);
				for(let k=0;k<p.imagenes.length;k++){
					let dataurl = "data:image/*;base64,"+arrayBase64(p.imagenes[k].bytes);
					setUris((uris) => [...uris, dataurl] ); 
					let ff = base64Archivo(dataurl, "foto"+k);
                    setFotos(fotos => [...fotos, ff]);
				}
				setMostrar(true);
			})
			.catch(err => {
                console.log(err);
                setError(true)
            });
		}
		else setMostrar(true);
	}, []);

    /* titulos de los pasos */
    const titulos = [
        'Seleccion\u00e1 la categor\u00eda del producto', 
        'Indic\u00e1 un t\u00edtulo y una descripci\u00f3n', 
        'Establece el precio y la cantidad disponible', 
        'Agreg\u00e1 fotos del producto', 
        'Publicar'
    ];

    /* nombres de los pasos */
    const pasos = [
        'Categor\u00eda', 
        'T\u00edtulo y descripci\u00f3n', 
        'Precio y cantidad', 
        'Fotos', 
        'Publicar'
    ];
    
    /* funcion para avanzar o retroceder */
    const mover = direccion => {
        let hayErrores = false;
        if(direccion === 1) {
            switch(paso) {
                case 0:
                    hayErrores = categoria === "-1";
                    camposActivados.categoria = categoria === "-1";
                    break;
                case 1:
                    hayErrores = titulo === "" || descripcion === "";
                    camposActivados.titulo = titulo === "";
                    camposActivados.descripcion = descripcion === "";
                    break;
                case 2:
                    if(precio === "") setPrecio("0");
                    if(cantidad === "") setCantidad("1");
                    break;
                case 3:
                    hayErrores = uris.length === 0;
                    camposActivados.fotos = uris.length === 0;
                    break;
                default: break;
            }
        }
        setErrores(hayErrores);
        if(hayErrores) return;

		if(paso === pasos.length - 1 && direccion > 0) {finalizarPublicacion(); return;}
		if(paso + direccion < 0 || paso + direccion >= pasos.length) return;
        setPaso(paso + direccion);
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    };
    
    /* funcion para subir imagenes del producto, en el paso "Fotos" */
    const cargarFotos = (e) => {
        if(e.target.files){
            setExcedido(e.target.files.length + uris.length > 7);
            if(e.target.files.length + uris.length <= 7)
                for(let i = 0; i < e.target.files.length; i++)
                {
                    let item = e.target.files[i];
                    if(item.size >= 1048576)
                    {
                        console.log("El archivo debe ser menor a 1MB.");
                        continue;
                    }

                    let filereader = new FileReader();
                    filereader.onload = (ev) => {
                        setUris((uris) => [...uris, ev.target.result] );
                        setFotos(fotos => [...fotos, item]);
                    };
                    filereader.readAsDataURL(e.target.files[i]);
                }
        }
        if (props.onChange !== undefined)
            props.onChange(e);
    };

    /* miniaturas de vista previa de las fotos subidas en el paso "Fotos" */
    const Miniatura = () => {
        let imgTag = null;
        if (uris.length > 0) {
            imgTag = [];
            uris.map((item, i) => {
                imgTag.push(
                    <div className="publicacion-foto">
                        <img className="img" src={item} alt="Imagen" />
                        <span
                            className="btn-eliminar"
                            atr={i}
                            onClick={(e) => borrarImagen(e)}>
                            <XCircle />
                        </span>
                    </div>
                );
            });
        }
        return imgTag;
    };

    /* arreglo de miniaturas */
    const min = Miniatura();

    /* funcion del boton X que se muestra en el centro de las miniaturas, al asomar el mouse */
    const borrarImagen = (e) => {
        let at = e.currentTarget.getAttribute("atr");
        setUris((uris) => uris.filter((item, i) => i != at));
        setFotos((fotos) => fotos.filter((item, i) => i != at));
        //setUris(uris.filter((item, i) => i != at));
        setExcedido(excedido.length > 7);
    }

    function urlRepresentativo(s) {
	const permitidos = "abcdefghijklmnopqrstuvwxyz1234567890";
	let str = s;
	while(str.includes("  ")) str = str.replaceAll("  ", " ");
	for(let k=0; k<=str.length;k++) {
	    let c = str.charAt(k);
	    if(!permitidos.includes(c.toLowerCase())) str = str.replaceAll(c, "-");
    }
    while(str.includes("--")) str = str.replaceAll("--", "-");
	return str;
    }

    function finalizarPublicacion() {
        let usr_dataid = props.dataId;
        const imgData = new FormData();
		if(id) imgData.append("id", id);
        imgData.append("data_id", usr_dataid);
        imgData.append("categoria", categoria);
        imgData.append("titulo", hex(titulo));
        imgData.append("url", urlRepresentativo(titulo));
        imgData.append("descripcion", hex(descripcion));
        imgData.append("precio", precio);
        imgData.append("cantidad", cantidad.toString());
        imgData.append("envios", envio ? "1" : "0");
        for(let i = 0; i < fotos.length; i++) {
            imgData.append("foto", fotos[i]);
        }
        axios.post(baseURL + publicarURL, imgData).then(res => {
			if(res.data == "0") {
				console.log(res);
				setPaso(-1);
            }
            else console.log(res.data);
        })
        .catch(err => console.log(err));
    }

    const Categoria = (props) => {
        let ref = useRef();
        const catClick = (e) => {
            let cn = ref.current.getAttribute("catnum");
            //  setCategoria(cn);
            setCategoria(props.catnum);
        }

        return(
            <div
                className={categoria === props.catnum ? "categoria-vender seleccionado dflex border-box box-shadow-1" 
                             : "categoria-vender dflex border-box box-shadow-1"}
                catnum={props.catnum}
                ref={ref}
                onClick={(e) => catClick(e)}>
                <div className="subcontenedor dflex pointer-events-none user-select-none">
                    <span className="categoria-icono pointer-events-none user-select-none">{props.datos.icono}</span>
                    <span className="categoria-titulo pointer-events-none user-select-none">{props.datos.titulo}</span>
                </div>
            </div>
        )
    };

	const ConfirmacionPublicacion = () => {
		return(
			<div>
				<h2>{"\u00a1Publicaci\u00f3n realizada con \u00e9xito!"}</h2>
			</div>
		)
	}

    return(
		<>
        {error && <Redirigir donde="/error" /> }
		{!error && paso === -1 && <ConfirmacionPublicacion />}
		{!error && mostrar && paso !== -1 && <Paper
            className="vender-articulo-view"
            elevation={3}>
            <div className="titulos-etapas">
                <h2 className="vender-articulo-titulo titulo-1 gris-oscuro">
                    {titulos[paso]}
                </h2>
            </div>
            <div>
                {/* categoria */}
                {paso === 0 && <>
                    
                    <div className="categorias-contenedor talign-center">
                        {categorias.map(item => <Categoria datos={item} catnum={item.categoria} />)}
                    </div>
                    <small
                        className={categoria === "-1" && camposActivados.categoria ? "validacion-error" : "validacion-error invisible"}>
                        {"Eleg\u00ed una categor\u00eda adecuada para tu publicaci\u00f3n"}
                    </small>
                </>}

                {/* titulo */}
                {paso === 1 && 
                <>
                    <div className="titulo-publicacion-contenedor">
                        <label htmlFor="">{"T\u00edtulo de la publicaci\u00f3n"}</label>
                        <input
                            className="n-textfield width100"
                            label={"T\u00edtulo"} 
                            variant="outlined"
                            value={titulo}
                            onChange={(e) => {
                                camposActivados.titulo = true;
                                setTitulo(e.target.value);
                            }} />
                        <small
                            className={titulo === "" && camposActivados.titulo ? "validacion-error" : "validacion-error invisible"}>
                            {"Escrib\u00ed un t\u00edtulo para tu publicaci\u00f3n"}
                        </small>
                    </div>
                    <br/>
                    <div className="descripcion-publicacion-contenedor">
                        <label htmlFor="">{"Escriba una descripci\u00f3n"}</label>
                        <textarea
                            className="n-textarea width100"
                            rows="5"
                            value={descripcion}
                            onChange={(e) => {
                                setDescripcion(e.target.value); 
                                camposActivados.descripcion = true;
                            }} />
                        <small 
                            className={descripcion === "" && camposActivados.descripcion ? "validacion-error" : "validacion-error invisible"}>
                            {"Escrib\u00ed una descripci\u00f3n para tu publicaci\u00f3n"}
                        </small>
                    </div>
                </>}
                
                {/* precio y cantidad */}
                {paso === 2 && <>
                    <div className="precio-cantidad-publicacion-contenedor">
                        <div className="precio-cantidad-publicacion__precio">
                            <label className="form__label dblock" >Establece un precio: </label>
                            <input 
                                className="n-textfield width100 xhx"
                                label="Precio" 
                                value={precio}
                                type="number"
                                onChange={(e) => {
                                    setPrecio(e.target.value); 
                                    camposActivados.precio = true;
                                }} />
                        </div>
                        <br/>
                        <div className="precio-cantidad-publicacion__cantidad">
                            <label className="form__label dblock" >{"\u00bfQu\u00e9 cantidad dispon\u00e9s?"}</label>
                            <input 
                                className="n-textfield width100"
                                label="Cantidad" 
                                value={cantidad}
                                type="number"
                                onChange={(e) => {
                                    setCantidad(e.target.value); 
                                    camposActivados.cantidad = true;
                                }} />
                        </div>
                        <br/>
                        <label className="form__label dblock" >{"Forma de env\u00edo:"}</label>
						<select className="n-select" onChange={e => setEnvio(e.target.value.includes("Envio"))}>
							<option className="opt">Envio a domicilio</option>
							<option className="opt">Retiro en el local</option>
						</select>
                    </div>
                </>}

                {/* fotos */}
                {paso === 3 && <>
                    <div className="fotos-publicacion-contenedor">
                        <div className="talign-center">
                            <div className="subir-fotos">
                                <label
                                    htmlFor="AAwTrket449EAAmd"
                                    className="button dinline">
                                        <button className="vender-articulo__bot-agregar-fotos n-boton dflex pointer-events-none">
                                            <span className="sp-icono pointer-events-none"><Camera /></span>
                                            <span className="sp-label pointer-events-none">Agregar fotos</span>
                                        </button>
                                </label>
                                <input
                                    className="dnone"
                                    id="AAwTrket449EAAmd"
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={e => {
                                        cargarFotos(e); 
                                        camposActivados.fotos = true;
                                    }}/>
                                <br/>
                                <small
                                    className={!excedido ? "limite-excedido invisible dblock" : "limite-excedido dblock"}>
                                    {"\u00a1M\u00e1ximo 7 fotos!"}
                                </small>
                                <br/>
                                <small
                                    className={uris.length === 0 && camposActivados.fotos ? "validacion-error" : "validacion-error invisible"}>
                                    {"Agreg\u00e1 al menos una foto para tu publicaci\u00f3n"}
                                </small>
                                <div className="contenedor-fotos-publicacion">
                                    {min}
                                </div>
                            </div>
                        </div>
                    </div>
                </>}

                {/* final */}
                {paso === 4 && <>
                    <div className="finalizar-publicacion-contenedor">
                        <div className="finalizar-campo">
                            <h5 className="finalizar-campo__info">Titulo: </h5>
                            <span className="finalizar-campo__valor">{titulo}</span>
                        </div>
                        <br/>
                        <div className="finalizar-campo">
                            <h5 className="finalizar-campo__info">Descripcion: </h5>
                            <span className="finalizar-campo__valor" style={{whiteSpace: "pre-wrap"}}>{descripcion}</span>
                        </div>
                        <br/>
                        <div className="finalizar-campo">
                            <h5 className="finalizar-campo__info">Precio: </h5>
                            <span className="finalizar-campo__valor">{"$" + Number(precio)}</span>
                        </div>
                        <br/>
                        <div className="finalizar-campo">
                            <h5 className="finalizar-campo__info">Cantidad disponible: </h5>
                            <span className="finalizar-campo__valor">{cantidad}</span>
                        </div>
                        <br/>
                        <div className="finalizar-campo">
                            <h5 className="finalizar-campo__info">Envios: </h5>
                            <span className="finalizar-campo__valor">{envio ? "Envio a domicilio" : "Solo retiro en local"}</span>
                        </div>
                    </div>
                </>}
            </div>
            <div className="navegacion-pasos dflex justify-sb">
                <button
                    className={paso === 0 ? "invisible n-boton" : "n-boton"}
                    style={{width: 140}}
                    onClick={e => mover(-1)} >
                    Anterior
                </button>
                <div className="publicacion-steeper">
                </div>
                <button
                    className="n-boton"
                    style={{width: 140}}
                    onClick={e => mover(1)} >
                    {paso === 4 ? "Finalizar" : "Siguiente"}
                </button>
            </div>
            
        </Paper>}
		</>
    )
};

export default Vender;
