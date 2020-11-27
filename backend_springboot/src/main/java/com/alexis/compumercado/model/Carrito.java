package com.alexis.compumercado.model;

import javax.persistence.*;
import java.sql.Date;

@Entity
@Table(name = "carrito")
public class Carrito {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id_reg_carrito")
    Long idCarrito;

    @Column(name = "fecha_agregado")
    Date fechaAgregado;

    @Column(name = "precio")
    Double precio;

    @ManyToOne
    CuentaUsuario cuentaId;

    @ManyToOne
    Publicacion publicacionId;

    public Carrito() {
        fechaAgregado = new Date(System.currentTimeMillis());
    }

    public Long getIdCarrito() {
        return idCarrito;
    }

    public void setIdCarrito(Long idCarrito) {
        this.idCarrito = idCarrito;
    }

    public CuentaUsuario getCuentaId() {
        return cuentaId;
    }

    public void setCuentaId(CuentaUsuario cuentaId) {
        this.cuentaId = cuentaId;
    }

    public Publicacion getPublicacionIdId() {
        return publicacionId;
    }

    public void setPublicacionId(Publicacion publicacionIdId) {
        this.publicacionId = publicacionIdId;
    }

    public Double getPrecio() {
        return precio;
    }

    public void setPrecio(Double precio) {
        this.precio = precio;
    }

    public Date getFechaAgregado() {
        return fechaAgregado;
    }

    public void setFechaAgregado(Date fechaAgregado) {
        this.fechaAgregado = fechaAgregado;
    }
}
