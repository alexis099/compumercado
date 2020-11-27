const type = "GUARDAR_USUARIO";

export default function guardarUsuario(nuevo_usr) {
    return {
        type: "GUARDAR_USUARIO",
        payload: nuevo_usr
    };
}