package com.alexis.compumercado.model;

import javax.persistence.*;
import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "articulo")
public class Articulo {
    /*   id_articulo, cantidad, categoria, descripcion, fecha_creacion, fecha_modificado, precio, titulo   */
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id_articulo")
    Long idArticulo;

    @Column(name = "data_id")
    Long dataId;

    @Lob
    @Column(name = "titulo", nullable = false)
    String titulo;

    @Lob
    @Column(name = "url_representativo")
    String url;

    @Lob
    @Column(name = "descripcion", nullable = false)
    String descripcion;

    @Column(name = "categoria")
    String categoria;

    @Column(name = "fecha_creacion")
    Date fechaCreacion;

    @Column(name = "fecha_modificado")
    Date fechaModificado;

    /* @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "articuloId")
    List<Carrito> carritos; */

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "articuloId")
    List<Compra> compras;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "articuloId")
    List<Publicacion> publicaciones;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "articulo")
    List<TieneImagen> imagenes;

    public Articulo() {
//        this.titulo = "";
//        this.descripcion = "";
//        this.categoria = "Otros";
//        this.fechaCreacion = new Date(System.currentTimeMillis());
//        this.fechaModificado = new Date(System.currentTimeMillis());
        // this.carritos = new ArrayList<>();
        this.compras = new ArrayList<>();
        this.publicaciones = new ArrayList<>();
        this.imagenes = new ArrayList<>();
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public Long getIdArticulo() {
        return idArticulo;
    }

    public void setIdArticulo(Long idArticulo) {
        this.idArticulo = idArticulo;
    }

    public Long getDataId() {
        return dataId;
    }

    public void setDataId(Long dataId) {
        this.dataId = dataId;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getUrl() { return url; };

    public void setUrl(String url) {
	    this.url = url;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Date getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(Date fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public Date getFechaModificado() {
        return fechaModificado;
    }

    public void setFechaModificado(Date fechaModificado) {
        this.fechaModificado = fechaModificado;
    }

    /* public List<Carrito> getCarritos() {
        return carritos;
    }

    public void setCarritos(List<Carrito> carritos) {
        this.carritos = carritos;
    } */

    public List<Compra> getCompras() {
        return compras;
    }

    public void setCompras(List<Compra> compras) {
        this.compras = compras;
    }

    public List<Publicacion> getPublicaciones() {
        return publicaciones;
    }

    public void setPublicaciones(List<Publicacion> publicaciones) {
        this.publicaciones = publicaciones;
    }

    public List<TieneImagen> getImagenes() {
        return imagenes;
    }

    public void setImagenes(List<TieneImagen> imagenes) {
        this.imagenes = imagenes;
    }

    public String  tituloURL() {
        final String permitidos = "abcdefghijklmnopqrstuvwxyz0123456789-";
        String s = titulo;
        while(s.contains("  ")) s = s.replaceAll("  ", " ");
        for(int i=0;i<s.length();i++) {
            String c = s.charAt(i) + "";
            if(!permitidos.contains(c.toLowerCase()))
                s = s.replaceAll(c, "-");
        }
        while(s.contains("--")) s = s.replaceAll("--", "-");
        return s;
    }

    @Override
    public String toString() {
        return "Articulo{" +
                "idArticulo=" + idArticulo +
                ", titulo='" + titulo + '\'' +
                ", descripcion='" + descripcion + '\'' +
                ", categoria='" + categoria + '\'' +
                ", fechaCreacion=" + fechaCreacion +
                ", fechaModificado=" + fechaModificado +
                // ", carritos=" + carritos +
                ", compras=" + compras +
                ", publicaciones=" + publicaciones +
                '}';
    }
}
