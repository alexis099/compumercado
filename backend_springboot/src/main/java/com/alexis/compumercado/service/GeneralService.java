package com.alexis.compumercado.service;

import java.io.Serializable;
import java.util.List;

public interface GeneralService<T, ID extends Serializable> {
    // listar
    List<T> listar();

    // buscar por id
    T buscar(ID id);

    // agregar
    void agregar(T nuevoT);

    // modificar
    void modificar(ID id, T t);

    // borrar
    void borrar(ID id);

}
