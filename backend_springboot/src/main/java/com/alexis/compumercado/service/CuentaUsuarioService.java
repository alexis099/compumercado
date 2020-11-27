package com.alexis.compumercado.service;

import com.alexis.compumercado.model.CuentaUsuario;
import com.alexis.compumercado.repository.CuentaUsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Service;

@Service
public class CuentaUsuarioService extends GeneralServiceImpl<CuentaUsuario, Long> {

    @Autowired
    private CuentaUsuarioRepository cuentaUsuarioRepository;

    @Override
    public CrudRepository<CuentaUsuario, Long> getRepository() {
        return cuentaUsuarioRepository;
    }
}
