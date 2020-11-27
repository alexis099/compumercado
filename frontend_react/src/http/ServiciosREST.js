import http from 'http';
import axios from 'axios';

class ServiciosRest {
    constructor(url, r) {
        this.baseUrl = url;
        this.route = r;
    }

    getData(res) {
        const prom = axios.get(this.baseUrl + "/" + this.route + res);
        const dataProm = prom.then((respuesta) => {
            respuesta.data;
        });
        return dataProm;
    }
}

const get = () => {
    return http.get("/jugadores");
}

const actualizar = id => {
    return http.get("/jugadores/actualizar/{" + id + "}");
}

export default ServiciosRest;