package com.alexis.compumercado.service;

import com.alexis.compumercado.model.Articulo;
import com.alexis.compumercado.repository.ArticuloRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Service;

@Service
public class ArticuloService extends GeneralServiceImpl<Articulo, Long> {

    @Autowired
    private ArticuloRepository articuloRepository;

    @Override
    public CrudRepository<Articulo, Long> getRepository() {
        return articuloRepository;
    }
}
