package com.alexis.compumercado.service;

import com.alexis.compumercado.model.Carrito;
import com.alexis.compumercado.repository.CarritoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Service;

@Service
public class CarritoService extends GeneralServiceImpl<Carrito, Long> {

    @Autowired
    CarritoRepository carritoRepository;

    @Override
    public CrudRepository<Carrito, Long> getRepository() {
        return carritoRepository;
    }
}
