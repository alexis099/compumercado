package com.alexis.compumercado.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.web.multipart.MultipartResolver;
import org.springframework.web.multipart.support.StandardServletMultipartResolver;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import javax.sql.DataSource;

@Configuration
@ComponentScan(basePackages = "com.alexis.compumercado")
public class SpringMVCConfig implements WebMvcConfigurer {
    @Bean
    public DataSource dataSource() {
        String bd = "compumercado";
        String usuario = "compumercado";
        String password = "59049";
        String host = "localhost";
        String puerto = "3306";

        DriverManagerDataSource dataSource = new DriverManagerDataSource();
        dataSource.setDriverClassName("com.mysql.cj.jdbc.Driver");
        String url = "jdbc:mysql://" +
                host + ":" +
                puerto + "/" +
                bd + "?" +
                "useUnicode=true&" +
                "useJDBCCompilantTimezoneShift=true&" +
                "useLegacyDatetimeCode=false&" +
                "serverTimezone=UTC";
        dataSource.setUrl(url);
        dataSource.setUsername(usuario);
        dataSource.setPassword(password);
        return dataSource;
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/archivos/**").addResourceLocations("/archivos/");
        registry.addResourceHandler("/usuarios/**").addResourceLocations("/usuarios/");
    }

    @Bean
    public MultipartResolver multipartResolver() {
        return new StandardServletMultipartResolver();
    }
/*
    @Bean
    public ViewResolver getViewResolver() {
        InternalResourceViewResolver viewResolver = new InternalResourceViewResolver();
        viewResolver.setPrefix("/WEB-INF/views/");
        viewResolver.setSuffix(".jsp");
        return viewResolver;
    }
*/
}
