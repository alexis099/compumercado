package com.alexis.compumercado.service;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Service;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public abstract class GeneralServiceImpl<T, ID extends Serializable> implements GeneralService<T, ID> {

    // listar
    public List<T> listar() {
        List<T> lista = new ArrayList<>();
        getRepository().findAll().forEach(item -> lista.add(item));
        return lista;
    }

    // buscar por id
    public T buscar(ID id) {
        Optional<T> resul = getRepository().findById(id);
        if(resul.isPresent()) return (T) resul;
        return null;
    }

    // agregar
    public void agregar(T nuevoT) {
        getRepository().save(nuevoT);
    }

    // modificar
    public void modificar(ID id, T t) {
        getRepository().save(t);
    }

    // borrar
    public void borrar(ID id) {
        getRepository().deleteById(id);
    }

    public abstract CrudRepository<T, ID> getRepository();
}
