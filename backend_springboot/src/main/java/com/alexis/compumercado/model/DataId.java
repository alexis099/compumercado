package com.alexis.compumercado.model;

import javax.persistence.*;

@Entity
@Table(name = "data_id")
public class DataId {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    Long idData;

    @Column(name = "usuarios")
    Long ultimoUsuario;

    @Column(name = "articulos")
    Long ultimoArticulo;

    @Column(name = "publicaciones")
    Long ultimaPublicacion;

    public DataId() {}

    public Long getIdData() {
        return idData;
    }

    public void setIdData(Long idData) {
        this.idData = idData;
    }

    public Long getUltimoUsuario() {
        return ultimoUsuario;
    }

    public void setUltimoUsuario(Long ultimo_usuario) {
        this.ultimoUsuario = ultimo_usuario;
    }

    public Long getUltimoArticulo() {
        return ultimoArticulo;
    }

    public void setUltimoArticulo(Long ultimo_articulo) {
        this.ultimoArticulo = ultimo_articulo;
    }

    public Long getUltimaPublicacion() {
        return ultimaPublicacion;
    }

    public void setUltimaPublicacion(Long ultimaPublicacion) {
        this.ultimaPublicacion = ultimaPublicacion;
    }
}
