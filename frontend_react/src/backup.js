const Formulario = (props) => {
    const [uris, setUris] = useState([]);

    const SeleccionarArchivos = (props) => {
        const [id, setId] = useState("Q1");

        const miniatura = () => {
            let imgTag = null;
            if (uris.length > 0) {
                imgTag = [];
                uris.map((item) => {
                    imgTag.push(
                        <div className="publicacion-foto">
                            <img className="img" src={item}></img>
                            <span className="btn-eliminar">
                                <XCircle />
                            </span>
                        </div>
                    );
                });
            }
            return imgTag;
        };

        const obtenerURI = (e) => {
            if(e.target.files /* && e.target.files[0] */){
                for(let i = 0; i < e.target.files.length; i++)
                {
                    let filereader = new FileReader();
                    filereader.onload = (ev) => {
                        setUris((uris) => [...uris, ev.target.result] );
                    };
                    filereader.readAsDataURL(e.target.files[i]);
                }
            }
        };
        
        const cargarFotos = (e) => {
            obtenerURI(e);
            if (props.onChange !== undefined)
                props.onChange(e);
        }

        const min = miniatura();
        return(
            <div>
                <label
                    htmlFor={id}
                    className="button">
                    Elegir archivos
                </label>
                <input
                    id={id}
                    type="file"
                    multiple
                    onChange={(e) => cargarFotos(e)}
                    className="show-for-sr" />
                <div className="contenedor-fotos-publicacion">
                    {min}
                </div>
                <button onClick={() => console.log(uris[0])}>Ver uris</button>
            </div>
        )
    }

    let categorias = [
        "General", 
        "Teclados", 
        "Mouses", 
        "Monitores", 
        "Consolas y videojuegos", 
        "Laptops",
        "Componentes de PC"
    ];
    let formasEnvio = ["Env\u00edos a domicilio", "Solo retirar en el local"];

    return(
        <div className="form-vender-articulo">
            {/* titulo de la publicacion */}
            <div className="form-vender-articulo__titulo">
                <label className="form__label dblock">{"Eleg\u00ed un t\u00edtulo para tu art\u00edculo"}</label>
                <input className="form__input" type="text"/>
            </div>

            {/* descripcion */}
            <br/>
            <div className="form-vender-articulo__descripcion">
                <label className="form__label dblock">{"Escrib\u00ed una descripci\u00f3n detallada:"}</label>
                <textarea className="form__input" style={{height: 100}}/>
            </div>

            {/* categoria */}
            <br/>
            <div className="form-vender-articulo__descripcion">
                <label className="form__label dblock">{"\u00bfA qu\u00e9 categor\u00eda pertenece tu producto?"}</label>
                <Lista elementos={categorias} />
            </div>

            {/* cantidad disponible */}
            <br/>
            <div className="form-vender-articulo__descripcion">
                <label className="form__label dblock">{"\u00bfCuantas unidades dispon\u00e9s?"}</label>
                <input className="form__input" type="number"/>
            </div>

            {/* precio */}
            <br/>
            <div className="form-vender-articulo__descripcion">
                <label className="form__label dblock">{"Especifica el precio unitario:"}</label>
                <input className="form__input" type="number"/>
            </div>

            {/* formas de envio */}
            <br/>
            <div className="form-vender-articulo__descripcion">
                <label className="form__label dblock">{"\u00bfQu\u00e9 formas de env\u00edo realiz\u00e1s?"}</label>
                <Lista elementos={formasEnvio} />
            </div>

            {/* fotos */}
            <br/>
            <div className="form-vender-articulo__descripcion">
                <label className="form__label dblock">{"Escog\u00e9 al menos una imagen para tu producto."}</label>
                <SeleccionarArchivos />
            </div>
        </div>
    )
};


//////////////////////////////////////////////////////////////////////////////////

const BannerNormal = (props) => {

    return(
        <div className="banner roboto-c dflex border-box of-x-hidden">
            <div className="dflex width100">
                <LogoYBusqueda simple="0" />
                <LinksNavegacion />
            </div>
            <section className="banner__cuenta-usuario dflex">
                <a href="/ingresar" className="banner__cuenta-usuario__anchor cursor-pointer">Iniciar Sesión</a>
                <a href="/registro" className="banner__cuenta-usuario__anchor cursor-pointer">Crear Cuenta</a>
            </section>
            {/* <nav className="nav-categorias dblock">
                <a href="#">General</a>
                <a href="#">Componentes</a>
            </nav> */}
        </div>
    )
};