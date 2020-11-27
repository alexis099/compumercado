/* package com.alexis.compumercado.controller;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;

public class ConexionManager {
    static EntityManagerFactory entityManagerFactory;

    public static EntityManager crearEntityManager() {
        try {
            if(entityManagerFactory == null) {
                entityManagerFactory = Persistence.createEntityManagerFactory("JPA_Persistencia");
            }
        } catch (Exception e) {

        }
        return entityManagerFactory.createEntityManager();
    }
}
*/