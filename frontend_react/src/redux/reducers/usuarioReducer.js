export default function usuarioReducer( state = null, { type, payload } ) {
    switch(type) {
        case "GUARDAR_USUARIO":
            return payload;
        default:
            return state;
    }
}
