package com.alexis.compumercado.controller;

import com.alexis.compumercado.model.*;
import com.alexis.compumercado.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.ServletContextAware;
import org.springframework.web.multipart.MultipartFile;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.PBEKeySpec;
import javax.crypto.spec.SecretKeySpec;
import javax.persistence.*;
import javax.servlet.ServletContext;
import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.spec.KeySpec;
import java.text.SimpleDateFormat;
import java.sql.Date;
import java.util.*;

@RestController
@RequestMapping("") // quitar comentario!
// @RequestMapping("") // borrar!
// @CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:5500"})
@CrossOrigin // comentar al finalizar
public class CompumercadoRESTController implements ServletContextAware {
    public static String carpetaImagenes = System.getProperty("user.dir") + "/imagenestmp/";
    private ServletContext servletContext;
    private final String key = "OKmiszOYGPk098haoeXrPEylfmHllukv";
    private final String estb = "1hWmsTx1VazuAWxnnIGN56zHgxruIRVl";

    @Autowired
    EntityManager entityManager;

    @Autowired
    private CuentaUsuarioService cuentaUsuarioService;

    @Autowired
    private ArticuloService articuloService;

    @Autowired
    private CarritoService carritoService;

    @Autowired
    private CompraService compraService;

    @Autowired
    private PublicacionService publicacionService;

    @Autowired
    private DataIdService dataIdService;

    @Autowired
    private ImagenService imagenService;

    @Autowired
    private TieneImagenService tieneImagenService;

    /* iniciar sesion */
    @RequestMapping(value = "/ingresar", method = RequestMethod.POST)
    public ResponseEntity<?> iniciarSesion(@RequestParam(value = "email") String email,
                                           @RequestParam(value = "password") String password) {
        String sql = "SELECT c FROM CuentaUsuario c WHERE c.email = :email AND c.passwrd = :password";
        List usuarios = entityManager.createQuery(sql)
            .setParameter("email", email)
            .setParameter("password", password)
            .getResultList();

        if(!usuarios.isEmpty())
        {
            CuentaUsuario cuenta = (CuentaUsuario) usuarios.get(0);
            String nombre = cuenta.getNombre() + " " + cuenta.getApellido();
            String resul = "{\"nombre\":\"" + nombre + "\",";
            resul += "\"dataId\":\"" + cuenta.getDataId() + "\"}";
            return new ResponseEntity<>(resul, HttpStatus.OK);
        }

        return new ResponseEntity<>("-1", HttpStatus.OK);
    }

    /* verificar usuario */
    @RequestMapping(value = "/verificar-usuario", method = RequestMethod.GET)
    public ResponseEntity<String> verificarUsuario(@RequestParam("dataid") String dataid) {
        List usuarios = entityManager.createQuery("SELECT c FROM CuentaUsuario c WHERE c.dataId = :id")
                .setParameter("id", Long.parseLong(dataid))
                .getResultList();
        String res = usuarios.isEmpty() ? "11" : "0";
        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    /* obtener publicaciones (para la pantalla de inicio) */
    @RequestMapping(value = "/publicaciones-inicio", method = RequestMethod.GET)
    public ResponseEntity<String> verPublicacionesInicio(@RequestParam(required = false) String  categoria,
                                                         @RequestParam(required = false) String busqueda) {
        String sql;
        if(categoria != null && !categoria.equals("todos")) {
            sql = "SELECT p FROM Publicacion p WHERE p.articuloId.categoria=:cat";
        }
        else if(busqueda != null) {
            sql = "SELECT p FROM Publicacion p WHERE p.articuloId.url LIKE :busqueda";
        }
        else sql = "SELECT p FROM Publicacion p";

        List publicaciones;
        if(categoria != null && !categoria.equals("todos")) {
            publicaciones = entityManager.createQuery(sql).setParameter("cat", categoria).getResultList();
        }
        else if(busqueda != null) {
            String[] b = busqueda.replaceAll("  ", " ").split(" ");
            StringBuilder sparam = new StringBuilder("%");
            for(String j : b) sparam.append(j).append("%");
            publicaciones = entityManager.createQuery(sql).setParameter("busqueda", sparam.toString()).getResultList();

        }
        else {
            publicaciones = entityManager.createQuery(sql).getResultList();
        }
        if(publicaciones.isEmpty()) return new ResponseEntity<>("", HttpStatus.OK);

        StringBuilder sb = new StringBuilder("[");
        for(Object o : publicaciones) {
            sb.append(generarJSON((Publicacion) o)).append(",");
        }
        if(sb.toString().endsWith(",")) sb.deleteCharAt(sb.length() - 1);
        sb.append("]");
        return new ResponseEntity<>(sb.toString(), HttpStatus.OK);
    }

    /* publicar artículo */
    @RequestMapping(value = "/publicar", method = RequestMethod.POST)
    public ResponseEntity<String> agregarPublicacion(@RequestParam(value = "data_id") String data_id,
                                     @RequestParam(value = "id", required = false) String id,
                                     @RequestParam(value = "categoria") String categoria,
                                     @RequestParam(value = "titulo") String titulo,
				                     @RequestParam(value = "url") String url,
                                     @RequestParam(value = "descripcion") String descripcion,
                                     @RequestParam(value = "precio") String  precio,
                                     @RequestParam(value = "cantidad") String  cantidad,
                                     @RequestParam(value = "envios") String envios,
                                     @RequestParam(value = "foto", required = false, defaultValue = "null") MultipartFile[] fotos) {

        if(id != null) {
            // editar existente
            List publicaciones = entityManager.createQuery("SELECT p FROM Publicacion p WHERE p.idPublicacion = :id")
                    .setParameter("id", Long.parseLong(id))
                    .getResultList();
            if(publicaciones.isEmpty()) {
                return new ResponseEntity<>("11", HttpStatus.NOT_FOUND);
            }
            Publicacion publicacion = (Publicacion) publicaciones.get(0);
            publicacion.getArticuloId().setCategoria(categoria);
            publicacion.getArticuloId().setTitulo(titulo);
            publicacion.getArticuloId().setUrl(url);
            publicacion.getArticuloId().setDescripcion(descripcion);
            publicacion.setPrecio(Double.parseDouble(precio));
            publicacion.setCantidad(Integer.parseInt(cantidad));
            publicacion.setEnvios(envios);

            List imagenes = entityManager.createQuery("SELECT t FROM TieneImagen t WHERE t.articulo=:articulo")
                    .setParameter("articulo", publicacion.getArticuloId())
                    .getResultList();
            for(Object o : imagenes) {
                TieneImagen tieneImagen = (TieneImagen) o;
                tieneImagenService.borrar(tieneImagen.getId());
            }

            // generar nombre de cada imagen:
            int k = 0;
            for(MultipartFile file : fotos) {
                // fecha en formato string
                Date fecha_publicacion = new java.sql.Date(System.currentTimeMillis());
                SimpleDateFormat simpleDateFormat = new SimpleDateFormat("ddMMyyyyHHmmss");
                String str_fecha_publicacion = simpleDateFormat.format(fecha_publicacion);

                // obtener la carpeta personal del usuario
                String carpeta_usuario = String.valueOf(publicacion.getAutorId().getDataId());
                String sb = str_fecha_publicacion + "-" + k;
                String nombre_archivo = sHex(sb);

                // crear un nuevo objeto imagen
                Imagen imagen = new Imagen();
                imagen.setNombreArchivo(nombre_archivo);
                imagenService.agregar(imagen);

                // nueva relacion
                TieneImagen tieneImagen = new TieneImagen();
                tieneImagen.setArticulo(publicacion.getArticuloId());
                tieneImagen.setImagen(imagen);
                tieneImagenService.agregar(tieneImagen);
                // articulo.getImagenes().add(imagen);

                // guardar la imagen en la carpeta recientemente creada
                guardarArchivo(file, carpeta_usuario, String.valueOf(publicacion.getDataId()), nombre_archivo);
                k++;
            }
            publicacionService.agregar(publicacion);
            return new ResponseEntity<>("0", HttpStatus.OK);
        }

        // identificar al autor de la publicacion
        List usuario = entityManager.createQuery("SELECT c FROM CuentaUsuario c WHERE c.dataId = :dataid")
                .setParameter("dataid", Long.parseLong(data_id))
                .getResultList();
        if(usuario.isEmpty()) return new ResponseEntity<>("12", HttpStatus.NOT_FOUND);

        CuentaUsuario autor = (CuentaUsuario) usuario.get(0);

        // DataId se usa para registrar un conteo de artículos publicados.
        List data_id_articulo = entityManager.createQuery("SELECT d FROM DataId d")
                .getResultList();
        DataId dataId;
        if(data_id_articulo.isEmpty()) { // nunca estará vacía
            dataId = new DataId();
            dataId.setUltimoUsuario(0L);
            dataId.setUltimoArticulo(0L);
            dataId.setUltimoArticulo(0L);
        }
        else dataId = (DataId) data_id_articulo.get(0);
        dataId.setUltimoArticulo(dataId.getUltimoArticulo() + 1L);
        dataId.setUltimaPublicacion(dataId.getUltimaPublicacion() + 1L);

        // fecha en formato string
        Date fecha_publicacion = new java.sql.Date(System.currentTimeMillis());
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("ddMMyyyyHHmmss");
        String str_fecha_publicacion = simpleDateFormat.format(fecha_publicacion);

        // obtener la carpeta personal del usuario
        String carpeta_usuario = String.valueOf(autor.getDataId());

        // obtener la carpeta de la nueva publicacion
        String carpeta_nueva_publicacion = String.valueOf(dataId.getUltimaPublicacion());

        // crear fisicamente la carpeta de la nueva publicacion
        String url_carpeta_nueva_publicacion = this.servletContext.getRealPath("/usuarios/" + carpeta_usuario
                + "/publicaciones/" + carpeta_nueva_publicacion);
        Path path_carpeta_publicacion = Paths.get(url_carpeta_nueva_publicacion);
        File carpeta = new File(path_carpeta_publicacion.toUri());
        if(!carpeta.exists()) carpeta.mkdir();

        // generar articulo
        Articulo articulo = new Articulo();
        articulo.setCategoria(categoria.toLowerCase());
        articulo.setTitulo(titulo);
	    articulo.setUrl(url);
        articulo.setDescripcion(descripcion);
        articulo.setDataId(dataId.getUltimoArticulo());
        articulo.setFechaCreacion(fecha_publicacion);
        articuloService.agregar(articulo);

        // generar nombre de cada imagen:
        int k = 0;
        for(MultipartFile file : fotos) {
            String sb = str_fecha_publicacion + "-" + k;
            String nombre_archivo = sHex(sb);

            Imagen imagen = new Imagen();
            imagen.setNombreArchivo(nombre_archivo);
            imagenService.agregar(imagen);

            TieneImagen tieneImagen = new TieneImagen();
            tieneImagen.setArticulo(articulo);
            tieneImagen.setImagen(imagen);
            tieneImagenService.agregar(tieneImagen);
            // articulo.getImagenes().add(imagen);

            // guardar la imagen en la carpeta recientemente creada
            guardarArchivo(file, carpeta_usuario, carpeta_nueva_publicacion, nombre_archivo);
            k++;
        }

        // generar publicacion
        Publicacion publicacion = new Publicacion();
        publicacion.setFechaPublicacion(fecha_publicacion);
        publicacion.setFechaModificado(fecha_publicacion);
        publicacion.setPrecio(Double.parseDouble(precio));
        publicacion.setCantidad(Integer.parseInt(cantidad));
        publicacion.setEnvios(envios);
        publicacion.setDataId(dataId.getUltimaPublicacion());

        publicacion.setAutorId(autor);
        publicacion.setArticuloId(articulo);

        publicacionService.agregar(publicacion);
        dataIdService.agregar(dataId);

        return new ResponseEntity<>("0", HttpStatus.OK);
        // return new ResponseEntity<>(HttpStatus.OK);
    }

    /* crear nueva cuenta */
    @RequestMapping(value = "/crear-cuenta", method = RequestMethod.POST)
    public ResponseEntity<String> crearCuenta(@RequestParam("nombre") String nombre,
                                              @RequestParam("apellido") String apellido,
                                              @RequestParam("email") String email,
                                              @RequestParam("password") String password) {
        String sql = "SELECT c FROM CuentaUsuario c WHERE c.email=:email";
        List lista = entityManager.createQuery(sql).setParameter("email", email).getResultList();
        if(!lista.isEmpty()) return new ResponseEntity<>("1", HttpStatus.NOT_FOUND);

        sql = "SELECT d FROM DataId d";
        lista = entityManager.createQuery(sql).getResultList();
        DataId dataId;
        if(lista.isEmpty()) {
            // crear el primer usuario
            dataId = new DataId();
            dataId.setUltimoUsuario(0L);
            dataId.setUltimoArticulo(0L);
            dataId.setUltimaPublicacion(0L);
        }
        else {
            dataId = (DataId) lista.get(0);
        }

        dataId.setUltimoUsuario(dataId.getUltimoUsuario() + 1L);
        CuentaUsuario cuenta = new CuentaUsuario();
        cuenta.setNombre(nombre);
        cuenta.setApellido(apellido);
        cuenta.setEmail(email);
        cuenta.setPasswrd(password);
        cuenta.setFechaCreacion(new Date(System.currentTimeMillis()));
        cuenta.setFechaModificado(new Date(System.currentTimeMillis()));
        cuenta.setDataId(dataId.getUltimoUsuario());
        cuentaUsuarioService.agregar(cuenta);
        dataIdService.agregar(dataId);

        // crear carpeta para sus publicaciones
        String cuenta_data = String.valueOf(cuenta.getDataId());
        Path carpeta_usuario = Paths.get(this.servletContext.getRealPath("/usuarios/" + cuenta_data));
        File f = new File(carpeta_usuario.toUri());
        if(!f.exists()) f.mkdir();
        Path carpeta_publicaciones = Paths.get(this.servletContext.getRealPath("/usuarios/" + cuenta_data + "/publicaciones"));
        File g = new File(carpeta_publicaciones.toUri());
        if(!g.exists()) g.mkdir();
        return new ResponseEntity<>("0", HttpStatus.OK);
    }

    /* ver artículo */
    @RequestMapping(value = "/ver-articulo/{id}", method = RequestMethod.GET)
    public ResponseEntity<String> verArticulo(@PathVariable String id) {
        String sql = "SELECT p FROM Publicacion p WHERE p.idPublicacion=:id";
        List publicaciones = entityManager.createQuery(sql).setParameter("id", Long.parseLong(id)).getResultList();

        if(publicaciones.isEmpty())
            return new ResponseEntity<>("-1", HttpStatus.NOT_FOUND);

        Publicacion publicacion = (Publicacion) publicaciones.get(0);
	    return new ResponseEntity<>(generarJSON(publicacion), HttpStatus.OK);
    }

    /*
        realizar compra

        respuesta = 0: ok
        respuesta = 1: usuario inexistente
        respuesta = 2: publicacion/producto inexistente
     */
    @RequestMapping(value = "/realizar-compra", method = RequestMethod.POST)
    public ResponseEntity<String> realizarCompra(@RequestParam("idusuario") String idUsuario,
                                                 @RequestParam("id") String[] idpublicacion) {
        for(String id : idpublicacion) {
            String sql = "SELECT c FROM CuentaUsuario c WHERE c.dataId=:id";
            List usuarios = entityManager.createQuery(sql).setParameter("id", Long.parseLong(idUsuario)).getResultList();
            if (usuarios.isEmpty()) return new ResponseEntity<>("1", HttpStatus.NOT_FOUND); //

            sql = "SELECT p FROM Publicacion p WHERE p.idPublicacion=:id";
            List publicaciones = entityManager.createQuery(sql).setParameter("id", Long.parseLong(id)).getResultList();
            if (publicaciones.isEmpty()) return new ResponseEntity<>("2", HttpStatus.NOT_FOUND);

            CuentaUsuario comprador = (CuentaUsuario) usuarios.get(0);
            Publicacion publicacion = (Publicacion) publicaciones.get(0);
            if(publicacion.getCantidad() == 0) continue; // debería mostrar algun mensaje pero meh

            Articulo articulo = publicacion.getArticuloId();

            Compra compra = new Compra();
            compra.setCompradorId(comprador);
            compra.setVendedorId(publicacion.getAutorId());
            compra.setArticuloId(articulo);
            compra.setPrecio(publicacion.getPrecio());
            compra.setCantidad(1);
            compra.setFechaCompra(new Date(System.currentTimeMillis()));
            compraService.agregar(compra);

            List carritos = entityManager.createQuery("SELECT c FROM Carrito c WHERE c.cuentaId=:id AND c.publicacionId=:idp")
                    .setParameter("id", comprador)
                    .setParameter("idp", publicacion)
                    .getResultList();
            for(Object o : carritos) {
                Carrito carrito = (Carrito) o;
                carritoService.borrar(carrito.getIdCarrito());
            }
            publicacion.setCantidad(publicacion.getCantidad() - 1);
            publicacionService.agregar(publicacion);
        }
        return new ResponseEntity<>("0", HttpStatus.OK);
    }

    /* eliminar publicacion */
    @RequestMapping(value = "/eliminar-publicacion", method = RequestMethod.POST)
    public ResponseEntity<String> eliminarPublicacion(@RequestParam("idp") String  idp) {
        List publicaciones = entityManager.createQuery("SELECT p FROM Publicacion p WHERE p.idPublicacion=:id")
                .setParameter("id", Long.parseLong(idp))
                .getResultList();
        if(!publicaciones.isEmpty()) {
            Publicacion publicacion = (Publicacion) publicaciones.get(0);
            Articulo articulo = publicacion.getArticuloId();
            articuloService.borrar(articulo.getIdArticulo()); // en cascada
            // publicacionService.borrar(publicacion.getIdPublicacion());

            // borrar carpeta
            Path path = Paths.get(servletContext.getRealPath("/usuarios/" + publicacion.getAutorId().getDataId()
                            + "/publicaciones/") + publicacion.getDataId());
            File carpeta = new File(path.toUri());
            boolean resultado = false;
            if(carpeta.exists()) {
                // archivos... Gracias Java por no borrar carpetas no vacias <3 (sarcasm)
                File[] archivos = carpeta.listFiles();
                if(archivos != null) {
                    for(File archivo : archivos) archivo.delete(); // como no hay carpetas, no hace
                                                                   // falta hacerlo recursivo
                }
                resultado = carpeta.delete();
            }

            return new ResponseEntity<>(resultado ? "0" : "2", resultado ? HttpStatus.OK : HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>("11", HttpStatus.NOT_FOUND);
    }

    /* agregar al carrito */
    @RequestMapping(value = "/agregar-carrito", method = RequestMethod.POST)
    public ResponseEntity<String> agregarAlCarrito(@RequestParam("idp") String idp,
                                                   @RequestParam("dataid") String dataId) {
        List usuarios = entityManager.createQuery("SELECT c FROM CuentaUsuario c WHERE c.dataId=:dataid")
                .setParameter("dataid", Long.parseLong(dataId))
                .getResultList();
        if(usuarios.isEmpty()) return new ResponseEntity<>("1", HttpStatus.NOT_FOUND);
        CuentaUsuario usuario = (CuentaUsuario) usuarios.get(0);

        List publicaciones = entityManager.createQuery("SELECT p FROM Publicacion p WHERE p.idPublicacion=:id")
                .setParameter("id", Long.parseLong(idp))
                .getResultList();
        if(publicaciones.isEmpty()) return new ResponseEntity<>("2", HttpStatus.NOT_FOUND);
        Publicacion publicacion = (Publicacion) publicaciones.get(0);

        Carrito carrito = new Carrito();
        carrito.setCuentaId(usuario);
        carrito.setPublicacionId(publicacion);
        carrito.setFechaAgregado(new Date(System.currentTimeMillis()));
        carritoService.agregar(carrito); 

        return new ResponseEntity<>("0", HttpStatus.OK);
    }

    /* ver compras realizadas */
    @RequestMapping(value = "/compras", method = RequestMethod.POST)
    public ResponseEntity<String> verCompras(@RequestParam("dataid") String dataIdUsuario) {
        String sql = "SELECT c FROM Compra c WHERE c.compradorId.dataId=:id";
        List compras = entityManager.createQuery(sql)
                            .setParameter("id", Long.parseLong(dataIdUsuario))
                            .getResultList();



        StringBuilder sb = new StringBuilder("[");
        for(Object o : compras) {
            Compra compra = (Compra) o;
            sql = "SELECT p FROM Publicacion p WHERE p.articuloId.dataId=:id";
            List publicaciones = entityManager.createQuery(sql)
                    .setParameter("id", compra.getArticuloId().getDataId())
                    .getResultList();

            byte[] bytes = null;
            Long idpublicacion = null;
            if(!publicaciones.isEmpty()){
                Publicacion publicacion = (Publicacion) publicaciones.get(0);
                Imagen imagen = publicacion.getArticuloId().getImagenes().get(0).getImagen();
                Long dataId = publicacion.getAutorId().getDataId();
                bytes = getBytesImagen(imagen, dataId, publicacion);
                idpublicacion = publicacion.getIdPublicacion();
            }

            sb.append("{");
            if(idpublicacion != null) sb.append("\"id\":\"").append(idpublicacion).append("\",");
            sb.append("\"titulo\":\"").append(compra.getArticuloId().getTitulo()).append("\",");
            sb.append("\"url\":\"").append(compra.getArticuloId().getUrl()).append("\",");
            sb.append("\"vendedor\":\"")
                    .append(compra.getVendedorId().getNombre())
                    .append(" ")
                    .append(compra.getVendedorId().getApellido())
                    .append("\",");
            if(bytes != null) sb.append("\"miniatura\":").append(Arrays.toString(bytes)).append(",");
            sb.append("\"precio\":\"").append(compra.getPrecioStr()).append("\",");
            sb.append("\"fechadia\":\"").append(compra.getFechaCompra().toLocalDate().getDayOfMonth()).append("\",");
            sb.append("\"fechames\":\"").append(compra.getFechaCompra().toLocalDate().getMonthValue()).append("\",");
            sb.append("\"fechayear\":\"").append(compra.getFechaCompra().toLocalDate().getYear()).append("\"");
            sb.append("},");
        }
	    if(sb.length() > 1) sb.deleteCharAt(sb.length() - 1);
        sb.append("]");
        return new ResponseEntity<>(sb.toString(), HttpStatus.OK);
    }

    /* ver ventas realizadas */
    @RequestMapping(value = "/ventas", method = RequestMethod.POST)
    public ResponseEntity<String> verVentas(@RequestParam("dataid") String dataIdUsuario) {
        String sql = "SELECT c FROM Compra c WHERE c.vendedorId.dataId=:id";
        List compras = entityManager.createQuery(sql)
                .setParameter("id", Long.parseLong(dataIdUsuario))
                .getResultList();

        StringBuilder sb = new StringBuilder("[");
        Long idpublicacion = null;
        for(Object o : compras) {
            Compra compra = (Compra) o;

            sql = "SELECT p FROM Publicacion p WHERE p.articuloId.dataId=:id";
            List publicaciones = entityManager.createQuery(sql)
                    .setParameter("id", compra.getArticuloId().getDataId())
                    .getResultList();

            byte[] bytes = null;
            if(!publicaciones.isEmpty()){
                Publicacion publicacion = (Publicacion) publicaciones.get(0);
                Imagen imagen = publicacion.getArticuloId().getImagenes().get(0).getImagen();
                Long dataId = publicacion.getAutorId().getDataId();
                bytes = getBytesImagen(imagen, dataId, publicacion);
                idpublicacion = publicacion.getIdPublicacion();
            }

            sb.append("{");
            if(idpublicacion != null) sb.append("\"id\":\"").append(idpublicacion).append("\",");
            sb.append("\"titulo\":\"").append(compra.getArticuloId().getTitulo()).append("\",");
            sb.append("\"url\":\"").append(compra.getArticuloId().getUrl()).append("\",");
            sb.append("\"comprador\":\"")
                    .append(compra.getCompradorId().getNombre())
                    .append(" ")
                    .append(compra.getCompradorId().getApellido())
                    .append("\",");
            if(bytes != null) sb.append("\"miniatura\":").append(Arrays.toString(bytes)).append(",");
            sb.append("\"precio\":\"").append(compra.getPrecioStr()).append("\",");
            sb.append("\"fechadia\":\"").append(compra.getFechaCompra().toLocalDate().getDayOfMonth()).append("\",");
            sb.append("\"fechames\":\"").append(compra.getFechaCompra().toLocalDate().getMonthValue()).append("\",");
            sb.append("\"fechayear\":\"").append(compra.getFechaCompra().toLocalDate().getYear()).append("\"");
            sb.append("},");
        }
        if(sb.length() > 1) sb.deleteCharAt(sb.length() - 1);
        sb.append("]");
        return new ResponseEntity<>(sb.toString(), HttpStatus.OK);
    }

    /* ver publicaciones realizadas */
    @RequestMapping(value = "/publicaciones", method = RequestMethod.POST)
    public ResponseEntity<String> verPublicaciones(@RequestParam("dataid") String dataIdUsuario) {
        String sql = "SELECT p FROM Publicacion p WHERE p.autorId.dataId=:id";
        List publicaciones = entityManager.createQuery(sql)
                .setParameter("id", Long.parseLong(dataIdUsuario))
                .getResultList();

        StringBuilder sb = new StringBuilder("[");
        for(Object o : publicaciones) {
            Publicacion publicacion = (Publicacion) o;

            Imagen imagen = ((TieneImagen) publicacion.getArticuloId().getImagenes().get(0)).getImagen();
            Long dataId = Long.parseLong(dataIdUsuario);
            byte[] bytes = getBytesImagen(imagen, dataId, publicacion);

            sb.append("{");
            sb.append("\"id\":\"").append(publicacion.getIdPublicacion()).append("\",");
            sb.append("\"categoria\":\"").append(publicacion.getArticuloId().getCategoria()).append("\",");
            sb.append("\"titulo\":\"").append(publicacion.getArticuloId().getTitulo()).append("\",");
            sb.append("\"url\":\"").append(publicacion.getArticuloId().getUrl()).append("\",");
            sb.append("\"descripcion\":\"").append(publicacion.getArticuloId().getDescripcion()).append("\",");
            if(bytes != null) sb.append("\"miniatura\":").append(Arrays.toString(bytes)).append(",");
            sb.append("\"precio\":\"").append(publicacion.getPrecioStr()).append("\",");
            sb.append("\"cantidad\":\"").append(publicacion.getCantidad()).append("\",");
            sb.append("\"fechadia\":\"").append(publicacion.getFechaPublicacion().toLocalDate().getDayOfMonth()).append("\",");
            sb.append("\"fechames\":\"").append(publicacion.getFechaPublicacion().toLocalDate().getMonthValue()).append("\",");
            sb.append("\"fechayear\":\"").append(publicacion.getFechaPublicacion().toLocalDate().getYear()).append("\"");
            sb.append("},");
        }
        if(sb.length() > 1) sb.deleteCharAt(sb.length() - 1);
        sb.append("]");
        return new ResponseEntity<>(sb.toString(), HttpStatus.OK);
    }

    /* ver carrito de compras */
    @RequestMapping(value = "/carrito", method = RequestMethod.POST)
    public ResponseEntity<String> verCarrito(@RequestParam("dataid") String dataIdUsuario) {
        List usuarios = entityManager.createQuery("SELECT c FROM CuentaUsuario c WHERE c.dataId=:id")
                .setParameter("id", Long.parseLong(dataIdUsuario))
                .getResultList();
        if(usuarios.isEmpty()) {
            return new ResponseEntity<>("-1", HttpStatus.NOT_FOUND);
        }
        CuentaUsuario usuario = (CuentaUsuario) usuarios.get(0);

        List carritos = entityManager.createQuery("SELECT c FROM Carrito c WHERE c.cuentaId=:id")
                .setParameter("id", usuario)
                .getResultList();

        Double total = 0.0;
        StringBuilder sb = new StringBuilder("{\"items\":[");
        for(Object o : carritos) {
            Carrito carrito = (Carrito) o;
            Publicacion publicacion = carrito.getPublicacionIdId();

            Imagen imagen = ((TieneImagen) publicacion.getArticuloId().getImagenes().get(0)).getImagen();
            // Long dataId = Long.parseLong(dataIdUsuario);
            Long dataId = publicacion.getAutorId().getDataId();
            byte[] bytes = getBytesImagen(imagen, dataId, publicacion);

            sb.append("{");
            sb.append("\"id\":\"").append(publicacion.getIdPublicacion()).append("\",");
            sb.append("\"categoria\":\"").append(publicacion.getArticuloId().getCategoria()).append("\",");
            sb.append("\"titulo\":\"").append(publicacion.getArticuloId().getTitulo()).append("\",");
            sb.append("\"url\":\"").append(publicacion.getArticuloId().getUrl()).append("\",");
            sb.append("\"descripcion\":\"").append(publicacion.getArticuloId().getDescripcion()).append("\",");
            if(bytes != null) sb.append("\"miniatura\":").append(Arrays.toString(bytes)).append(",");
            sb.append("\"precio\":\"").append(publicacion.getPrecioStr()).append("\",");
            sb.append("\"cantidad\":\"").append(publicacion.getCantidad()).append("\",");
            sb.append("\"fechadia\":\"").append(carrito.getFechaAgregado().toLocalDate().getDayOfMonth()).append("\",");
            sb.append("\"fechames\":\"").append(carrito.getFechaAgregado().toLocalDate().getMonthValue()).append("\",");
            sb.append("\"fechayear\":\"").append(carrito.getFechaAgregado().toLocalDate().getYear()).append("\"");
            sb.append("},");
            total += publicacion.getPrecio();
        }

        String precio_str = String.valueOf(total);
        precio_str = precio_str.endsWith(".0") ? precio_str.substring(0, precio_str.length() - 2) : precio_str;


        if(sb.charAt(sb.length()-1) == ',') sb.deleteCharAt(sb.length() - 1);
        sb.append("], \"total\": \"").append(precio_str).append("\"}");
        return new ResponseEntity<>(sb.toString(), HttpStatus.OK);
    }

    /////////////////////////////////////////////////////

    private boolean guardarArchivo(MultipartFile archivo, String carpetaUsuario, String carpetaPublicacion, String nombreArchivo) {
        try {
            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("ddMMyyyyHHmmss");
            String nombre_archivo = simpleDateFormat.format(new java.util.Date());
            byte[] bytes = archivo.getBytes();
            Path path = Paths.get(this.servletContext.getRealPath("/usuarios/" + carpetaUsuario + "/publicaciones/"
                    + carpetaPublicacion + "/" + nombreArchivo));
            Files.write(path, bytes);
            return true;
        } catch (IOException e) {
            System.out.println(e.getCause() + ": " + e.getMessage());
            return false;
        }
    }

    private byte[] getBytesImagen(Imagen imagen, Long autorDataId, Publicacion publicacion) {
        String nombre_archivo = imagen.getNombreArchivo();
        Path path = Paths.get(servletContext.getRealPath("/usuarios/" + autorDataId
                + "/publicaciones/") + publicacion.getDataId() + "/" + nombre_archivo);
        File archivo_imagen = new File(path.toUri());
        if(archivo_imagen.exists()) {
            try {
                byte[] bytes = Files.readAllBytes(path);
                return bytes;
            } catch (Exception e) {}
        }
        return null;
    }

    private String generarJSON(Publicacion publicacion) {
	    StringBuilder sb = new StringBuilder("{");
	
        sb.append("\"id\": \"").append(publicacion.getIdPublicacion()).append("\",");
        sb.append("\"titulo\":\"").append(publicacion.getArticuloId().getTitulo()).append("\",");
	    sb.append("\"url\":\"").append(publicacion.getArticuloId().getUrl()).append("\",");
        sb.append("\"categoria\":\"").append(publicacion.getArticuloId().getCategoria()).append("\",");
        sb.append("\"descripcion\":\"").append(publicacion.getArticuloId().getDescripcion()).append("\",");
        sb.append("\"precio\":\"").append(publicacion.getPrecioStr()).append("\",");
        sb.append("\"cantidad\":\"").append(publicacion.getCantidad()).append("\",");

        sb.append("\"autor\":{");
        sb.append("\"nombre\":\"").append(publicacion.getAutorId().getNombre()).append(" ").append(publicacion.getAutorId().getApellido()).append("\",");
        sb.append("\"email\":\"").append(publicacion.getAutorId().getEmail()).append("\"");
        sb.append("},\n");

        sb.append("\"imagenes\": [");

        // imagenes
        Long autor_dataid = publicacion.getAutorId().getDataId();
        List imagenes = publicacion.getArticuloId().getImagenes();
        for(int i=0;i<imagenes.size();i++) {
            Imagen imagen = ((TieneImagen) imagenes.get(i)).getImagen();
            byte[] bytes = getBytesImagen(imagen, autor_dataid, publicacion);
            if(bytes != null) sb.append("{\"bytes\":").append(Arrays.toString(bytes)).append("}");
            if(i != imagenes.size() - 1) sb.append(",");

            /* String nombre_archivo = imagen.getNombreArchivo();
            Path path = Paths.get(servletContext.getRealPath("/usuarios/" + autor_dataid
                            + "/publicaciones/") + publicacion.getDataId() + "/" + nombre_archivo);
            File archivo_imagen = new File(path.toUri());
            if(archivo_imagen.exists()) {
                try {
                    byte[] bytes = Files.readAllBytes(path);
                    sb.append("{\"bytes\":").append(Arrays.toString(bytes)).append("}");
                    if(i != imagenes.size() - 1) sb.append(",");
                } catch (Exception e) {}
            } */
        }

        sb.append("]");
        sb.append("}");
	return sb.toString();
    }

    @Override
    public void setServletContext(ServletContext servletContext) {
        this.servletContext = servletContext;
    }

    private String encriptar(String texto) {
        try {
            byte[] iv = { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 };
            IvParameterSpec ivspec = new IvParameterSpec(iv);

            SecretKeyFactory factory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256");
            KeySpec spec = new PBEKeySpec(key.toCharArray(), estb.getBytes(), 65536, 256);
            SecretKey tmp = factory.generateSecret(spec);
            SecretKeySpec secretKey = new SecretKeySpec(tmp.getEncoded(), "AES");

            Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
            cipher.init(Cipher.ENCRYPT_MODE, secretKey, ivspec);
            return Base64.getEncoder().encodeToString(cipher.doFinal(texto.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception e) {
            return null;
        }
    }

    private String desencriptar(String texto) {
        try
        {
            byte[] iv = { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 };
            IvParameterSpec ivspec = new IvParameterSpec(iv);

            SecretKeyFactory factory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256");
            KeySpec spec = new PBEKeySpec(key.toCharArray(), estb.getBytes(), 65536, 256);
            SecretKey tmp = factory.generateSecret(spec);
            SecretKeySpec secretKey = new SecretKeySpec(tmp.getEncoded(), "AES");

            Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5PADDING");
            cipher.init(Cipher.DECRYPT_MODE, secretKey, ivspec);
            return new String(cipher.doFinal(Base64.getDecoder().decode(texto)));
        }
        catch (Exception e) {
            System.out.println("Error while decrypting: " + e.toString());
        }
        return null;
    }

    private String sHex(String t) {
        if(t == null || t.length() == 0) return "";
        char[] bytes = t.toCharArray();
        StringBuilder sb = new StringBuilder();
        for(int k=0;k<bytes.length;k++) {
            String h = Integer.toHexString(bytes[k]);
            sb.append(h);
        }
        return sb.toString();
    }

    private String hString(String h) {
        if(h == null || h.length() == 0) return "";
        char[] bytes = h.toCharArray();
        StringBuilder sb = new StringBuilder();
        for(int k=0;k<bytes.length;k+=2) {
            String st = ""+bytes[k]+""+bytes[k+1];
            char ch = (char)Integer.parseInt(st, 16);
            sb.append(ch);
        }
        return sb.toString();
    }
}
