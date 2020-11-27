package com.alexis.compumercado.model;

import javax.persistence.*;
import java.sql.Date;
import java.util.List;

@Entity
@Table(name = "publicacion")
public class Publicacion {
    @Id
    @Column(name = "id_publicacion")
    @GeneratedValue(strategy = GenerationType.AUTO)
    Long idPublicacion;

    @Column(name = "data_id")
    Long dataId;

    @Column(name = "precio", nullable = false)
    Double precio;

    @Column(name = "cantidad")
    Integer cantidad;

    @Column(name = "envios")
    String envios;

    @Column(name = "fecha_publicacion")
    Date fechaPublicacion;

    @Column(name = "fecha_modificado")
    Date fechaModificado;

    @ManyToOne
    @JoinColumn(name = "autor")
    CuentaUsuario autorId;

    @ManyToOne
    @JoinColumn(name = "articulo")
    Articulo articuloId;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "publicacionId")
    List<Carrito> carritos;

    public Publicacion() {}

    public Long  getIdPublicacion() {
        return idPublicacion;
    }

    public void setIdPublicacion(Long idPublicacion) {
        this.idPublicacion = idPublicacion;
    }

    public Long getDataId() {
        return dataId;
    }

    public void setDataId(Long dataId) {
        this.dataId = dataId;
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

    public String  getEnvios() {
        return envios;
    }

    public void setEnvios(String envios) {
        this.envios = envios;
    }

    public Date getFechaPublicacion() {
        return fechaPublicacion;
    }

    public void setFechaPublicacion(Date fechaPublicacion) {
        this.fechaPublicacion = fechaPublicacion;
    }

    public Date getFechaModificado() {
        return fechaModificado;
    }

    public void setFechaModificado(Date fechaModificado) {
        this.fechaModificado = fechaModificado;
    }

    public CuentaUsuario getAutorId() {
        return autorId;
    }

    public void setAutorId(CuentaUsuario autorId) {
        this.autorId = autorId;
    }

    public Articulo getArticuloId() {
        return articuloId;
    }

    public void setArticuloId(Articulo articuloId) {
        this.articuloId = articuloId;
    }

    @Override
    public String toString() {
        return "Publicacion: " +
                "\nid: " + idPublicacion +
                "\nautor: " + autorId.getNombre() + " " + autorId.getApellido() +
                "\narticulo: " + articuloId.getTitulo() +
                "\nprecio: " + precio;
    }
}
