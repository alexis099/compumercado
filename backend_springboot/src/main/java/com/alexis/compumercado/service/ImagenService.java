package com.alexis.compumercado.service;

import com.alexis.compumercado.model.Imagen;
import com.alexis.compumercado.repository.ImagenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Service;

@Service
public class ImagenService extends GeneralServiceImpl<Imagen, Long> {
    @Autowired
    ImagenRepository imagenRepository;

    @Override
    public CrudRepository<Imagen, Long> getRepository() {
        return imagenRepository;
    }
}
