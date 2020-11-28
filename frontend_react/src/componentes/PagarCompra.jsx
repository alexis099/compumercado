import React, { useState, useEffect } from 'react';
import './PagarCompra.css';

/* redux */
import { useSelector } from "react-redux";

/* axios */
import axios from "axios";

/* react-router-dom */
import { useParams } from "react-router-dom";

/* precioTotal del programa */
import { baseURL, verArticuloURL, pagarArticuloURL, deshex, arrayBase64 } from "../datos";

export const FormularioPago = (props) => {
    const [nombre, setNombre] = useState("");
    const [cp, setCp] = useState("");
    const [numero, setNumero] = useState("");
    const [cvv, setCVV] = useState("");
    const [expMes, setExpMes] = useState("");
    const [expYear, setExpYear] = useState("");
    const [validar, setValidar] = useState(false);


    let precioTotal = props.precioTotal;
    let usr_id = props.usr_id;
    let idp = props.idp;
    let cants = props.cants;
    const funcionExito = props.exito;

    function finalizarCompra() {
        setValidar(true);
        if(nombre === "" || cp === "" || numero === "" || cvv === "" || expMes === "" || expYear === "") return;
        let url = baseURL + pagarArticuloURL;
        let formData = new FormData();
        formData.append("idusuario", usr_id);
        for(let k=0;k<idp.length;k++)
            formData.append("id", idp[k]);
        for(let k=0;k<cants.length;k++)
            formData.append("cantidades", cants[k]);
        axios.post(url, formData)
        .then(res => {
            funcionExito(true);
        }).catch(err => {
        })
    }

    return(
        <div className="pagar-compra__pago border-box">
            <h2 className="pagar-compra__pago__titulo roboto-c gris-oscuro">Informacion de pago</h2>
            <div className="pagar-compra__pago__nombre-codigo dflex width100">
                <div className="pagar-compra__pago__nombre-tarjeta campo1 width100">
                    <label className="form__label dblock roboto">Nombre en la tarjeta</label>
                    <input
                        type="text"
                        className="n-textfield width100"
                        value={nombre}
                        onChange={e => setNombre(e.target.value)} />
                    <small className={validar && nombre.length === 0 ? "" : "invisible"} style={{color: "var(--color-principal)"}} >Complete este campo.</small>
                </div>
                <div className="pagar-compra__pago__codigo-postal campo2 width100">
                    <label className="form__label dblock roboto">Codigo postal</label>
                    <input
                        type="text"
                        className="n-textfield width100"
                        value={cp}
                        onChange={e => setCp(e.target.value)} />
                    <small className={validar && cp.length === 0 ? "" : "invisible"} style={{color: "var(--color-principal)"}} >Complete este campo.</small>
                </div>
            </div>
            <br/>
            <div className="pagar-compra__pago__numero-cvv dflex width100">
                <div className="pagar-compra__pago__numero-tarjeta campo1 width100">
                    <label className="form__label dblock roboto">Numero de tarjeta</label>
                    <input
                        type="text"
                        className="n-textfield width100"
                        value={numero}
                        onChange={e => setNumero(e.target.value)} />
                    <small className={validar && numero.length === 0 ? "" : "invisible"} style={{color: "var(--color-principal)"}} >Complete este campo.</small>
                </div>
                <div className="pagar-compra__pago__cvv campo2 width100">
                    <label className="form__label dblock roboto">CVV</label>
                    <input
                        type="text"
                        className="n-textfield width100"
                        value={cvv}
                        onChange={e => setCVV(e.target.value)} />
                    <small className={validar && cvv.length === 0 ? "" : "invisible"} style={{color: "var(--color-principal)"}} >Complete este campo.</small>
                </div>
            </div>
            <br/>
            <div className="pagar-compra__pago__expiracion  dflex width100">
                <div className="pagar-compra__pago__expiracion-mes campo1 width100">
                    <label className="form__label dblock roboto">{"Expiraci\u00f3n/Mes"}</label>
                    <input
                        type="text"
                        className="n-textfield width100"
                        placeholder="MM"
                        value={expMes}
                        onChange={e => setExpMes(e.target.value)} />
                    <small className={validar && expMes.length === 0 ? "" : "invisible"} style={{color: "var(--color-principal)"}} >Complete este campo.</small>
                </div>
                <div className="pagar-compra__pago__expiracion-year campo2 width100">
                    <label className="form__label dblock roboto">{"Expiraci\u00f3n/A\u00f1o"}</label>
                    <input
                        type="text"
                        className="n-textfield width100"
                        placeholder="AA"
                        value={expYear}
                        onChange={e => setExpYear(e.target.value)} />
                    <small className={validar && expYear.length === 0 ? "" : "invisible"} style={{color: "var(--color-principal)"}} >Complete este campo.</small>
                </div>
            </div>
            <br/>
            <div className="pagar-compra__pago__cantidad-retiro dflex width100">
                <div className="pagar-compra__pago__retiro campo1 width100">
                    <label className="form__label dblock roboto">Retiro</label>
                    <select className="n-select">
                        <option className="opt">Envio a domicilio</option>
                        <option className="opt">Retiro en el local</option>
                    </select>
                </div>
                <div className="pagar-compra__pago__cantidad campo1 width100"></div>
            </div>
            <div className="pagar-compra__pago__precio-total width100 campo1">
                <table style={{tableLayout: "fixed", width: "100%"}}>
                    <tbody>
                        <tr>
                            <td style={{padding: ".4em 0"}}>Articulo:</td>
                            <td style={{padding: "0 1.5em"}}>{"$"+precioTotal}</td>
                        </tr>
                        <tr>
                            <td>Envio:</td>
                            <td style={{padding: "0 1.5em"}}>$399</td>
                        </tr>
                        <tr>
                            <td><strong>Total:</strong></td>
                            <td className="precio-total" style={{padding: "0 .5em"}}>{"$"+(Number(precioTotal) + Number(399))}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <button
                className="bot-finalizar-compra n-boton campo1"
                onClick={ _ => finalizarCompra()} >
                Finalizar compra
            </button>
        </div>
    )
};

const PagarCompra = (props) => {
    const [busqueda, setBusqueda] = useState(true);
    const [publicacion, setPublicacion] = useState(null);
    const [error, setError] = useState(false);
    const [exito, setExito] = useState(false);
    const [usr, setUsr] = useState(null);

    const { rnart } = useParams();

	let usr_tmp = useSelector(state => state.usuario);
	if(usr_tmp && !usr) setUsr(usr_tmp);
    useEffect(() => {
        if(busqueda) {
            let url = baseURL + verArticuloURL + "/" + rnart.toString();
            let form = new FormData();
            form.append("id", rnart.toString());
            axios.get(url, form)
            .then(res => {
                setPublicacion(res.data);
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
            {publicacion === null && !error && <div className="cargando">Cargando</div> }
            {error && <div>Hubo un error conectando con el servidor.</div> }
            {exito && 
            <div>
                <h2 className="talign-center gris-oscuro">{"\u00a1Compra exitosa!"}</h2>
            </div> }
            {publicacion !== null && !exito && usr && 
            <div className="pagar-compra-view border-box">
                <div className="pagar-compra__info-articulo">
                    <h2 className="pagar-compra__info-articulo__titulo-articulo roboto-c gris-oscuro">{deshex(publicacion.titulo)}</h2>
                    <img className="img" src={"data:image/*;base64,"+arrayBase64(publicacion.imagenes[0].bytes)} alt=""/>
                </div>
                <FormularioPago precioTotal={publicacion.precio} usr_id={usr.dataId} idp={[rnart]} exito={setExito} />
            </div>
            }
        </>
    )
}

export default PagarCompra;
