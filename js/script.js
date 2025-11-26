// declaramos la función asíncrona que se ejecutará al dar clic en el botón
async function buscarProductos() {
    event.preventDefault(); //Evita que se recargue la página

    // obtenemos el valor ingresado por el usuario en la caja de texto
    const cadenaBusqueda = document.getElementById('cadenaBusqueda').value.trim();
    


    // validamos que el campo no este vacío
    if (!cadenaBusqueda) {
        document.getElementById('respuesta').textContent = 'Proporciona una característica.';
        return; // Terminamos la función si no hay cadenaBusqueda
    }

    //creamos una promesa que realizará la solicitud al servidor
    let myPromise = new Promise(function (resolve, reject) {

        // creamos el objeto XMLHttpRequest para enviar y recibir datos del servidor
        let req = new XMLHttpRequest();

        // abrimos la conexión con el método POST y la USRL del archivo PHP que recibirá los datos
        req.open('POST','https://dawcampusjalpa2025.duckdns.org/examen1/api/productos.php'); // modifica la ruta según tu conveniencia 
        
        // Indicamos que enviaremos los datos en formato JSON
        req.setRequestHeader('Content-Type','application/json;charset=UTF-8');

        // Evento que se ejecuta cuando el servidor
        req.onload = function () {

            // Si la respuesta del servidor tiene un código 200 (éxito)
            if (req.status >= 200 && req.status < 300) {
                
                try{
                    // convertimos la respuesta (texto) a un objeto JSON y resolvemos la promesa
                    resolve(JSON.parse(req.responseText));
                } catch (e) {
                    reject(new Error('La respuesta JSON no es valida'));
                }// fin del catch

            } else {

                reject(new Error('Error HTTP ' + req.status));

            }// Fin del if req.status

        }// Fin function onload


        // Evento que se ejecuta si hay un error de red o CORS
        req.onerror = function () {
            reject(new Error('Error de red o CORS'));
        }

        // Enviamos los datos al servidor en formato JSON con el mensaje para existencia del producto
        req.send(JSON.stringify({ cadenaBusqueda: cadenaBusqueda}));


    }); //Fin de la promesa

    //Esperamos La resolución de la promesa con await
    try {
        
        // Esperamos la respuesta del servidor
        const data = await myPromise;

        if(!data.resultados || data.resultados.length === 0){
            document.getElementById('respuesta').innerHTML = 
                `<span style='color:red;'>${data.mensaje}</span>`;
            return;
        }

        let productos = data.resultados;

        //Mostramos las targetas correspondientes al mensaje obtenido
        //Si existe el producto, mostramos todas las imagenes que correspondan
        //Si no, mostramos el mensaje devuelto por el servidor (p. ej., "products not found")
        //La respuesta ya viene en objeto JSON no es necesario utilizar JSON.parse

        
        let salida =  `<div class="row m-5 col-12 text-center">
        
                            <div class="col-12 text-center"> 
                                <h4>FOUND PRODUCTS</h4>
                            </div> 
                        </div>

                        <div class="row m-5">`;

        productos.forEach(p => {
            salida += `
                <div class="col-lg-4 col-md-6 col-sm-12">
                    <div class="card mis-cards-ajust">
                        <img src="https://dawcampusjalpa2025.duckdns.org/examen1/imagenes/${p.image}" 
                            class="card-img-top w-100" 
                            alt="${p.product}">
                        <div class="card-body">
                            <h5 class="card-title">${p.product}</h5>
                            <p class="card-text">${p.description}</p>
                            <a href="#" class="btn btn-primary mis-nuttom-ajust">Go somewhere</a>
                        </div>
                    </div>
                </div>
            `;
        });

        salida += `</div>`;

        document.getElementById('respuesta').innerHTML = salida;
        //}

    } catch (err) {
        //Si ocurre un error en la conexión o en la respuesta
        document.getElementById('respuesta').innerHTML = "Error: " + err.message;

    }

}// Fin de la función async
