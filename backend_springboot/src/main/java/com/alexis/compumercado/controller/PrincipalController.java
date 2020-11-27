package com.alexis.compumercado.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class PrincipalController {
    @RequestMapping(value = {
            "/",
            "/categorias/{categoria}",
            "/busqueda/{categoria}",
            "/ingresar",
            "/registro",
            "/registro/confirmacion",
            "/desconectar",
            "/admin/compras",
            "/admin/ventas",
            "/admin/publicaciones",
            "/admin/carrito",
            "/comprar/{rnart}/{nomarticulo}",
            "/pago/{rnart}",
            "/vender",
            "/editar/{idpublicacion}",
            "/error-servidor",
            "/no-encontrado"

    })
    public String  index() {
        return "index";
    }

}