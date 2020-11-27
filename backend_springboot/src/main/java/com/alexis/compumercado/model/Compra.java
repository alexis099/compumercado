package com.alexis.compumercado.model;

import javax.persistence.*;
import java.sql.Date;

@Entity
@Table(name = "compra")
public class Compra {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id_reg_compra")
    Long idCompra;

    @Column(name = "precio")
    Double precio; // precio en el momento de la compra

    @Column(name = "cantidad")
    Integer cantidad;

    @Column(name = "fecha_compra")
    Date fechaCompra;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comprador_id")
    CuentaUsuario compradorId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendedor_id")
    CuentaUsuario vendedorId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "articulo_id")
    Articulo articuloId;

    public Compra() {
        this.idCompra = 0L;
        this.fechaCompra = new Date(System.currentTimeMillis());
        this.precio = 0.0;
    }

    public Long getIdCompra() {
        return idCompra;
    }

    public void setIdCompra(Long idCompra) {
        this.idCompra = idCompra;
    }

    public CuentaUsuario getCompradorId() {
        return compradorId;
    }

    public void setCompradorId(CuentaUsuario compradorId) {
        this.compradorId = compradorId;
    }

    public CuentaUsuario getVendedorId() {
        return vendedorId;
    }

    public void setVendedorId(CuentaUsuario vendedorId) {
        this.vendedorId = vendedorId;
    }

    public Articulo getArticuloId() {
        return articuloId;
    }

    public void setArticuloId(Articulo articuloId) {
        this.articuloId = articuloId;
    }

    public Double getPrecio() {
        return precio;
    }

    public String getPrecioStr() {
        String precio_str = String.valueOf(precio);
        precio_str = precio_str.endsWith(".0") ? precio_str.substring(0, precio_str.length() - 2) : precio_str;
        return precio_str;
    }

    public void setPrecio(Double precio) {
        this.precio = precio;
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }

    public Date getFechaCompra() {
        return fechaCompra;
    }

    public void setFechaCompra(Date fechaCompra) {
        this.fechaCompra = fechaCompra;
    }

    @Override
    public String toString() {
        return "Compra{" +
                "idCompra=" + idCompra +
                ", precio=" + precio +
                ", fechaCompra=" + fechaCompra +
                ", compradorId=" + compradorId.getIdCuentaUsuario() +
                ", articuloId=" + articuloId.getIdArticulo() +
                '}';
    }
}
