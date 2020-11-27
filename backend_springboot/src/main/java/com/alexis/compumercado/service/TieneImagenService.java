package com.alexis.compumercado.service;

import com.alexis.compumercado.model.TieneImagen;
import com.alexis.compumercado.repository.TieneImagenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Service;

@Service
public class TieneImagenService extends GeneralServiceImpl<TieneImagen, Long> {
    @Autowired
    TieneImagenRepository tieneImagenRepository;

    @Override
    public CrudRepository<TieneImagen, Long> getRepository() {
        return tieneImagenRepository;
    }
}
