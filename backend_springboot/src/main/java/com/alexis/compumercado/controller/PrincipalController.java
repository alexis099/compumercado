package com.alexis.compumercado.controller;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class PrincipalController implements ErrorController {
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
            "/error",
            "/no-encontrado"

    })
    public String  index() {
        return "index";
    }

    @Override
    public String getErrorPath() {
        return null;
    }
}