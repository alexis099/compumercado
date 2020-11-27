import React from "react";
import "./CuentaCreadaConfirmacion.css";

const CuentaCreadaConfirmacion = (props) => {
    return(
        <div>
            <div className="cuenta-creada-confirmacion-view">
                <div className="form-cuenta-creada-confirmacion width100 height100 box-shadow-2 border-box">
                    <h2 className="form__titulo form-cuenta-creada-confirmacion__titulo">{"\u00a1Cuenta creada con exito!"}</h2>
                    <p className="form-cuenta-creada-confirmacion__msj">{'\u00a1Bienvenido! Ahora puede iniciar sesión con su email y contraseña.'}</p>
                    <a className="n-boton form-cuenta-creada-confirmacion__btn a-limpio" href="/ingresar">INICIAR SESION</a>
                </div>
            </div>
        </div>
    )
};

export default CuentaCreadaConfirmacion;
