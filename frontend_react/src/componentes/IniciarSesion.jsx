import React, { useState, useEffect } from 'react';
import './IniciarSesion.css';

/* axios */
import axios from 'axios';

/* react-router-dom */
import { Redirect } from "react-router-dom";

/* js-cookies */
import Cookies from "js-cookie";

/* datos del programa */
import { baseURL, iniciarSesionURL, Redirigir, encriptar, hex } from "../datos";

/* vista */

const IniciarSesion = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const [redireccionar, setRedireccionar] = useState(false);

    function ingresar() {
        let url = baseURL + iniciarSesionURL;
        let formData = new FormData();
        formData.append("email", email);
        formData.append("password", password);
    
        axios.post(url, formData)
        .then(res => {
            if(res.data == "-1") {
                setError(true);
            }
            else {
                let datos = JSON.stringify(res.data);
                let enc_usr_data = encriptar(datos);
                let hex_usr_data = hex(enc_usr_data);
                Cookies.set("usr", hex_usr_data, { expires: 999 } );
                setRedireccionar(true);
            }
        })
        .catch(err => {});
    }

    return(
        <div className='inicio-sesion-view'>
            {redireccionar && <Redirigir donde="/" />}
            <div className='inicio-sesion-form border-box box-shadow-2'>
                <h2 className='inicio-sesion-form__titulo form__titulo talign-center roboto'>Bienvenido</h2>
                <div className='inicio-sesion__nombre-usuario'>
                    <label className='dblock form__label'>Email</label>
                    <input
                            className="n-textfield width100"
                            type="email"
                            variant="outlined"
                            value={email}
                            onChange={e => setEmail(e.target.value)} />
                    
                </div>
                <br/>
                <div className='inicio-sesion__password'>
                    <label className='dblock form__label'>{'Contrase\u00f1a'}</label>
                    <input
                            className="n-textfield width100"
                            type="password"
                            variant="outlined"
                            value={password}
                            onChange={e => setPassword(e.target.value)} />
                </div>
                { error && <span className="validacion-error">{"Error: correo o contrase\u00f1a incorrectos."}</span> }
                <br/>
                <br/>
                <div className='talign-center'>
                    <button
                        className="n-boton"
                        onClick={() => ingresar()} >
                        {"Iniciar sesi\u00f3n"}
                    </button>
                    <br/><br/>
                    <a href="/registro" className='dblock'>Registrarse</a>
                </div>
            </div>
        </div>
    )
}

export default IniciarSesion;
