package com.alexis.compumercado.model;

import javax.persistence.*;
import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "cuenta_usuario")
public class CuentaUsuario {
    /*  email, apellido, fecha_creacion, fecha_modificado, nombre, passwrd  */
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id_cuenta")
    Long idCuentaUsuario;

    @Column(name = "data_id")
    Long dataId;

    @Column(name = "email")
    String email;

    @Column(name = "nombre")
    String nombre;

    @Column(name = "apellido")
    String apellido;

    @Column(name = "passwrd")
    String passwrd;

    @Column(name = "articulos")
    Integer articulos;

    @Column(name = "fecha_creacion")
    Date fechaCreacion;

    @Column(name = "fecha_modificado")
    Date fechaModificado;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "cuentaId")
    List<Carrito> carritos;  // todas las publicaciones que están en el carrito

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "compradorId")
    List<Compra> compras;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "vendedorId")
    List<Compra> ventas;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "autorId")
    List<Publicacion> publicaciones;

    public CuentaUsuario() {
        this.compras = new ArrayList<>();
        this.publicaciones = new ArrayList<>();
    }

    public Long getIdCuentaUsuario() {
        return idCuentaUsuario;
    }

    public void setIdCuentaUsuario(Long idCuentaUsuario) {
        this.idCuentaUsuario = idCuentaUsuario;
    }

    public Long getDataId() {
        return dataId;
    }

    public void setDataId(Long dataId) {
        this.dataId = dataId;
    }

    public Date getFechaModificado() {
        return fechaModificado;
    }

    public void setFechaModificado(Date fechaModificado) {
        this.fechaModificado = fechaModificado;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellido() {
        return apellido;
    }

    public void setApellido(String apellido) {
        this.apellido = apellido;
    }

    public String getPasswrd() {
        return passwrd;
    }

    public void setPasswrd(String passwrd) {
        this.passwrd = passwrd;
    }

    public Integer getArticulos() {
        return articulos;
    }

    public void setArticulos(Integer articulos) {
        this.articulos = articulos;
    }

    public Date getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(Date fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }


    public List<Carrito> getCarritos() {
        return carritos;
    }

    public void setCarritos(List<Carrito> carritos) {
        this.carritos = carritos;
    }

    public List<Compra> getCompras() {
        return compras;
    }

    public void setCompras(List<Compra> compras) {
        this.compras = compras;
    }

    public List<Compra> getVentas() {
        return ventas;
    }

    public void setVentas(List<Compra> ventas) {
        this.ventas = ventas;
    }

    public List<Publicacion> getPublicaciones() {
        return publicaciones;
    }

    public void setPublicaciones(List<Publicacion> publicaciones) {
        this.publicaciones = publicaciones;
    }

    @Override
    public String toString() {
        return "CuentaUsuario{" +
                "idCuentaUsuario=" + idCuentaUsuario +
                ", email='" + email + '\'' +
                ", nombre='" + nombre + '\'' +
                ", apellido='" + apellido + '\'' +
                ", passwrd='" + passwrd + '\'' +
                ", fechaCreacion=" + fechaCreacion +
                ", fechaModificado=" + fechaModificado +
                ", carrito=" + carritos +
                ", compras=" + compras +
                ", publicaciones=" + publicaciones +
                '}';
    }
}
