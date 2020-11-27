package com.alexis.compumercado;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class CompuMercadoApplication {

	public static void main(String[] args) {
		// EntityManagerFactory emf = Persistence.createEntityManagerFactory("JPA_Persistencia");
		// EntityManager manager = emf.createEntityManager(); CompuMercadoApplication

		SpringApplication.run(CompuMercadoApplication.class, args);
	}
}
