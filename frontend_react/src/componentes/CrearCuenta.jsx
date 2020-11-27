import React, { useRef } from "react";
import "./CrearCuenta.css";
import axios from "axios";
import { useState } from "react";
import { Redirect } from 'react-router-dom';

/* datos */
import { baseURL, crearCuentaURL } from "../datos";

const CrearCuenta = (props) => {
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmarPassword, setConfirmarPassword] = useState("");
    const [redirigir, setRedirigir] = useState(false);
    const [deshabilitar, setDeshabilitar] = useState(false);
    const [error, setError] = useState(false); // ya existe el usuario
    const [errorPassword, setErrorPassword] = useState(false); // 
    const [validar, setValidar] = useState(false); // 

    function enviar() {
        setValidar(true);
        if(password !== confirmarPassword) {
            setErrorPassword( true );
            return;
        }
        else setErrorPassword( false );
        if(nombre.length === 0 || apellido.length === 0 || email.length === 0 || password.length === 0) return;
        if(nombre.length === 0 || apellido.length === 0 || email.length === 0 || password.length === 0) return;
        setDeshabilitar(true);
        let url = baseURL + crearCuentaURL;
        let formdata = new FormData();
        formdata.append("nombre", nombre);
        formdata.append("apellido", apellido);
        formdata.append("email", email);
        formdata.append("password", password);

        axios.post(url, formdata)
        .then(res => {
            if(res.data == "0") {
                console.log("Exito!");
                setRedirigir(true);
                setDeshabilitar(false);
                setValidar(false);
                setError(false);
            }
            else {
                setDeshabilitar(false);
                setError(true);
            }
        })
        .catch(err => {});
    }
    
    return(
        <div>
            {redirigir && <Redirect to="/registro/confirmacion" />}
            <div className="crear-cuenta-view">
                <div className="form-crear-cuenta box-shadow-2 border-box">
                    <h2 className="inicio-sesion-form__titulo form__titulo talign-center roboto">Crear cuenta</h2>
                    <div className="form-crear-cuenta__nombre-apellido dflex">
                        <div className="form-crear-cuenta__campo-1 width100">
                            <label className="dblock form__label form-crear-cuenta__font-size">Nombre</label>
                            <input
                                className="n-textfield width100"
                                variant="outlined"
                                type="text"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)} />
                            <small className={validar && nombre.length === 0 ? "validacion-error" : "invisible"}>Indique su nombre.</small>
                        </div>
                        <div className="form-crear-cuenta__campo-2 width100">
                            <label className="dblock form__label form-crear-cuenta__font-size">Apellido</label>
                            <input
                                className="n-textfield width100"
                                variant="outlined"
                                type="text"
                                value={apellido}
                                onChange={(e) => setApellido(e.target.value)} />
                            <small className={validar && apellido.length === 0 ? "validacion-error" : "invisible"}>Indique su apellido.</small>
                        </div>
                    </div>
                    <br/>
                    <div className="width100 width100 form-crear-cuenta__campo-1">
                        <label htmlFor="email" className="dblock form__label form-crear-cuenta__font-size">E-mail</label>
                        <input
                            className="n-textfield width100"
                            variant="outlined"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} />
                        <small className={error || (validar && email.length === 0) ? "validacion-error" : " invisible"}>
                            {error && "Ya existe una cuenta con este email."}
                            {!error && "Escriba una direcci\u00f3n de correo electronico v\u00e1lida."}
                        </small>
                    </div>
                    <br/>
                    <div className="dflex">
                        <div className="width100 form-crear-cuenta__campo-1">
                            <label className="dblock form__label form-crear-cuenta__font-size">{"Contrase\u00f1a"}</label>
                            <input
                                className="n-textfield width100"
                                variant="outlined"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} />
                            <small className={validar && password.length === 0 ? "validacion-error" : "invisible"}>{"Debe indicar una contrase\u00f1a."}</small>
                        </div>

                        <div className="width100 form-crear-cuenta__campo-2">
                            <label className="dblock form__label form-crear-cuenta__font-size">{"Confirmar contrase\u00f1a"}</label>
                            <input
                                className="n-textfield width100"
                                variant="outlined"
                                type="password" 
                                value={confirmarPassword}
                                onChange={(e) => setConfirmarPassword(e.target.value)} />
                            <small className={validar && errorPassword && password.length > 0 ? "validacion-error" : "invisible"}>
                                {"Las contrase\u00f1as no coinciden."}
                            </small>
                        </div>
                    </div>

                    <div className="talign-center">
                        <br/>
                        <br/>
                        <button
                            className="n-boton dflex justify-center"
                            variant="contained"
                            color="primary"
                            onClick={ _ => {
                                if(deshabilitar) return;
                                enviar();
                            }}>
                            
                            {deshabilitar && 
                                <div className="spinner pointer-events-none dinline"></div>
                            }
                            {!deshabilitar && 
                                <span className="caption pointer-events-none">
                                    Crear cuenta
                                </span>
                            }
                        </button>
                        <br/>
                        <br/>
                        <a href="/registro" className="dblock" >{"\u00bfYa tiene una cuenta? Iniciar sesi\u00f3n."}</a>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default CrearCuenta;