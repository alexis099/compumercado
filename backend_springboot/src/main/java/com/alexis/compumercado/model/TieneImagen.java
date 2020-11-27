package com.alexis.compumercado.model;

import javax.persistence.*;

@Entity
@Table(name = "usa_imagen")
public class TieneImagen {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    Articulo articulo;

    @ManyToOne(fetch = FetchType.LAZY)
    Imagen imagen;

    public TieneImagen() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Articulo getArticulo() {
        return articulo;
    }

    public void setArticulo(Articulo articulo) {
        this.articulo = articulo;
    }

    public Imagen getImagen() {
        return imagen;
    }

    public void setImagen(Imagen imagen) {
        this.imagen = imagen;
    }
}
