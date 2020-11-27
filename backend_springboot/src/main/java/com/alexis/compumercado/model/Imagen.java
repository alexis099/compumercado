package com.alexis.compumercado.model;

import javax.persistence.*;
import java.sql.Date;

@Entity
@Table(name = "imagen")
public class Imagen {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id_imagen")
    Long  idImagen;

    @Column(name = "nombre_archivo")
    String nombreArchivo;

    @Column(name = "fecha_creacion")
    Date fechaCreacion;

    @ManyToOne(cascade = CascadeType.ALL)
    TieneImagen articuloId;

    public Imagen() {}

    public Long getIdImagen() {
        return idImagen;
    }

    public void setIdImagen(Long  idImagen) {
        this.idImagen = idImagen;
    }

    public String getNombreArchivo() {
        return nombreArchivo;
    }

    public void setNombreArchivo(String nombreArchivo) {
        this.nombreArchivo = nombreArchivo;
    }

    public Date getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(Date fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public TieneImagen getArticuloId() {
        return articuloId;
    }

    public void setArticuloId(TieneImagen articuloId) {
        this.articuloId = articuloId;
    }
}
