
// Declaración de variables globales:
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];    //recupera carrito de localStorage
let lista = [];
let cursosimg = document.querySelector('#cards-curso');
let carritoModal = document.querySelector('.modal-body');
let carritoModalFooter = document.querySelector('.modal-footer');
let pagarBoton = document.getElementsByClassName('btn_pagar');
let botonPagar = document.createElement('div');
let cantidadCarrito = document.getElementById("cantidadCarrito");
let limpiarCarrito = document.createElement('input');
let formMail = document.getElementById('Mail');
let formNroTarj = document.getElementById('SelectCard');
let formPass = document.getElementById('Password');
let once = 0;

// Función que autocompleta los campos del modal de pago
const autocompleteForm = () => {
    formMail.value = "name@example.com";
    formNroTarj.value = "1111111111111111";
    formPass.value = "111";
}

// Función para dibujar el contenido del carrito de cursos:
const carritoDraw = () => {
    carritoModal.innerHTML = "";

    carrito.forEach((prod) => {
        let modalContent = document.createElement("div");
        modalContent.className = "div-modal";
        modalContent.innerHTML += `
            <img src=${prod.imagen}>
            <p class="desc-item-modal">${prod.nombre}</p>
            <p class="precio-item-modal">${prod.precio}$</p>
            <span class="control-cantidad restar"> - </span>
            <p class="cant-item-modal">${prod.cantidad}</p>
            <span class="control-cantidad sumar"> + </span>
            <p class="total-precio">Total: ${prod.cantidad * prod.precio}$</p>
            <button class="button-borrar">🗑️</button>
        `;
        carritoModal.append(modalContent);

        let restar = modalContent.querySelector('.restar');

        restar.addEventListener("click", () => {
            if (prod.cantidad != 1) {
                prod.cantidad--;
            }
            carritoDraw();
        })

        let sumar = modalContent.querySelector('.sumar');

        sumar.addEventListener("click", () => {
            prod.cantidad++;
            carritoDraw();
        })

        let eliminarCurso = modalContent.querySelector('.button-borrar');

        eliminarCurso.addEventListener("click", () => {
            eliminarProd(prod.id);
        });

        carritoCounter();

    });

    sumarTotal(carritoModal);
}

// Función para acumular el total del precio por cantidad de cada curso, realizar la suma total y mostrar al final del modal del carrito.
// También agrega un botón para limpiar el contenido del carrito y lo elimina del localStorage.
// Parámetro: el body del modal del carrito para agregarle el footer.
const sumarTotal = (modal) => {
    let total = carrito.reduce((accumulator, el) => accumulator + el.precio * el.cantidad, 0);
    let modalFooter = document.createElement('div');
    modalFooter.className = "modal-footer card";
    modalFooter.innerHTML += `
        <h5 class="card-header">El Total de su compra: ${total}$</h5>
    `;

    modal.append(modalFooter);

    if (once === 0 && total > 0) {
        botonPagar.innerHTML += `
            <button type="button" class="btn btn-success btn_pagar" data-bs-dismiss="modal"
            data-bs-target="#seleccionPago" data-bs-toggle="modal">Pagar</button> 
        `;
        carritoModalFooter.append(botonPagar);

        limpiarCarrito.style.display = "block";

        limpiarCarrito.type = "button";
        limpiarCarrito.className = "btn btn-dark";
        limpiarCarrito.value = "Limpiar Carrito"
        carritoModalFooter.append(limpiarCarrito);

        limpiarCarrito.addEventListener('click', () => {
            deleteMemory();
            carrito = [];
            limpiarCarrito.style.display = "none";
            carritoDraw();
        })

        once = 1;
    }

    if (total === 0) {
        once = 0;
        limpiarCarrito.style.display = "none";
        botonPagar.innerHTML = "";
        carritoModalFooter.append(botonPagar);
        carritoCounter();
    }

}
// Función para eliminar curso del carrito y de localStorage:
// Parámetro: recibe el id del curso a eliminar.
const eliminarProd = (id) => {

    const encontrar = carrito.find((el) => el.id === id);
    carrito = carrito.filter((carritoId) => {
        if (carritoId !== encontrar) {
            return carritoId
        }
    });
    carritoDraw();

}

//Función que chequea si existe carrito de compras (en memoria y de la sesión). Si no existe muestra un modal que 
// diga "El Total de su compra: 0$"
const checkCarrito = () => {

    if (carrito.length === 0) {
        let modalBase = document.createElement('div');
        modalBase.className = "modal-footer card";
        modalBase.innerHTML += `
            <h5 class="card-header">El Total de su compra: 0$</h5>
        `;
        carritoModal.append(modalBase);
        deleteMemory();
        carritoCounter();
    }
}

//Función que mediante la librería Sweet Alert 2 presenta los modales "Procesando Pago" y "Pago Exitoso"
// y borra el carrito (de la memoria y de la sesión local). 
const mostrarPagoExitoso = () => {
    deleteMemory();
    carrito = [];
    let timerInterval
    Swal.fire({
        title: 'Procesando Pago',
        background: "#fff",
        customClass: {
            title: 'swal2-title-1'
        },
        timer: 2000,
        timerProgressBar: true,
        didOpen: () => {
            Swal.showLoading()
            const b = Swal.getHtmlContainer().querySelector('b')
            timerInterval = setInterval(() => {
                b.textContent = Swal.getTimerLeft()
            }, 100)
        },
        willClose: () => {
            clearInterval(timerInterval)
        }
    }).then((result) => {

        if (result.dismiss === Swal.DismissReason.timer) {

            Swal.fire({
                position: 'top-center',
                background: "#fff",
                titleColor: "#7a7ce4",
                icon: 'success',
                title: 'Pago realizado con éxito. En instantes recibirá un mail de confirmación',
                showConfirmButton: false,
                timer: 2000
            })
        }
    })
}

// Función para validar los formularios del modal de pago y mostrar los mensajes de error correspondientes. También cierra este modal cuando está todo
// ok y llama a función mostrarPagoExitoso.
let validatePayment = () => {
    let selectValidar = document.getElementById('select');
    let errorText1 = document.getElementById('errorText1');
    let errorText2 = document.getElementById('errorText2');
    let errorText3 = document.getElementById('errorText3');
    let validCounts = 0;

    if (selectValidar.value == 0) {
        errorText1.innerHTML = "";
        errorText1.innerHTML += `Ingrese una opción válida`;
        validCounts = 0;
    }
    else {
        errorText1.innerHTML = "";
        validCounts++;
    }

    if (isNaN(formNroTarj.value) || formNroTarj.value === "" || formNroTarj.value.length !== 16) {
        errorText2.innerHTML = "";
        errorText2.innerHTML += `Ingrese 16 números sin los guiones`;
        validCounts = 0;
    }
    else {
        errorText2.innerHTML = "";
        validCounts++;
    }

    if (isNaN(formPass.value) || formPass.value === "" || formPass.value.length !== 3) {
        errorText3.innerHTML = "";
        errorText3.innerHTML += `Ingrese los tres números al dorso`;
        validCounts = 0;
    }
    else {
        errorText3.innerHTML = "";
        validCounts++;
    }

    if (validCounts++ > 2) {

        let modalCheckout = bootstrap.Modal.getOrCreateInstance('#seleccionPago');

        modalCheckout.hide();

        mostrarPagoExitoso();

        carritoDraw();

    }
}

// Función que muestra el contador del carrito y lo actualiza cuando se agregan o eliminan cursos.
// También lo guarda en localStorage bajo el key "carrito".
const carritoCounter = () => {
    let totalCant = carrito.reduce((accumulator, el) => accumulator + el.cantidad, 0);
    cantidadCarrito.style.display = "block";
    const mostrarCantidad = totalCant;
    cantidadCarrito.innerText = mostrarCantidad;
    saveLocal();
};

// Función asincrónica para obtener datos del json, que contiene toda la info de los cursos comercializados. Esta función trae los datos y los 
// presenta en pantalla insertando html. En caso de error se utiliza un catch que lanza un alert para mostrarle al usuario que hubo un error
// trayendo los datos.
let getData = async () => {
    try {
        const resp = await fetch('./json/cursos.json');
        const data = await resp.json();
        lista = data;
        lista.forEach((product) => {
            let content = document.createElement("div");
            content.className = "col";
            content.innerHTML += `
            <div class="img-curso">
            <img src=${product.imagen} class="w-100 h-100" alt=${product.nombre}>
            </div>
            
            `;
            cursosimg.append(content);

            let descCont = document.createElement("div");
            content.className = "col";
            content.innerHTML += `
                <div class="row">
                    <div class="col-sm-12">
                        <p>${product.descripcion}</p> 
                        <p>DURACION: ${product.duracion}</p>
                        <p>${product.textoad}</p>
                        <p>PRECIO: ${product.precio}</p>
                    </div>                
                </div>
            `;
            content.append(descCont);

            let comprar = document.createElement("div");
            comprar.className = "col-sm-12 btn-reserva";

            content.append(comprar);

            let butComprar = document.createElement('button');
            butComprar.className = "btn btn-primary";
            butComprar.innerText = "RESERVA TU LUGAR";

            comprar.append(butComprar);

            butComprar.addEventListener("click", () => {
                const repeat = carrito.some((repeatProduct) => repeatProduct.id === product.id);

                if (repeat) {
                    carrito.map((prod) => {
                        if (prod.id === product.id) {
                            prod.cantidad++;
                        }
                    });
                } else {
                    carrito.push({
                        nombre: product.nombre,
                        id: product.id,
                        imagen: product.imagen,
                        descripcion: product.descripcion,
                        precio: product.precio,
                        cantidad: product.cantidad,
                    });

                }
                carritoDraw();
            });
        })

    } catch (error) {
        alert('Se ha producido un error recuperando los datos');
    }
}

//Función que guarda el contenido del carrito en localStorage bajo el key "carrito".
const saveLocal = () => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
};

//Función que mediante la librería Sweet Alert 2 presenta un modal  que avisa al usuario si de la lectura del localStorage  
// se detecta que quedaron productos en el carrito.
const showCarritoNotEmpty = () => {
    if (carrito.length !== 0) {
        carritoDraw();
        setTimeout(() => {
            Swal.fire({
                title: 'Información',
                text: 'Usted tiene productos en su carrito',
                imageUrl: '/images/carrito_img.jpg',
                imageWidth: 150,
                imageHeight: 150,
                imageAlt: 'Carrito de compras',
            })
        }, 2000);

    }
}

// Función que remueve del localStorage lo que contiene el key "carrito" (o sea, el carrito de compras que está guardado en memoria).
const deleteMemory = () => {
    localStorage.removeItem("carrito");
}

// Se llama a las funciones que inician la lógica:
autocompleteForm();
showCarritoNotEmpty();
checkCarrito();
getData();

