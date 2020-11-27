import React from "react";
import "./ComponentesGenerales.css";

const TextField = (props) => {
    return(
        <input
            className="n-textfield" type={props.type ? props.type : "text"} 
            placeholder={props.placeholder ? props.placeholder : null}
            onChange={props.onChange ? props.onChange : null} />
    )
};

const Boton = (props) => {
    return(
        <button
            className="n-boton"
            onClick={props.onClick ? props.onClick : null} >
            {props.children}
        </button>
    )
}

export { TextField, Boton };