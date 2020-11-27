package com.alexis.compumercado.service;

import com.alexis.compumercado.model.Compra;
import com.alexis.compumercado.repository.CompraRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Service;

@Service
public class CompraService extends GeneralServiceImpl<Compra, String> {

    @Autowired
    CompraRepository compraRepository;

    @Override
    public CrudRepository<Compra, String> getRepository() {
        return compraRepository;
    }
}
