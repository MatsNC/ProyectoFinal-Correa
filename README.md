# ProyectoFinal-Correa
## Repositorio del Proyecto Final del Curso de Javascript de Coderhouse

## Descripción 

Es una página que simula un ecommerce para adquirir cursos de una Sociedad de Algiología Veterinaria que se llama Siavet.
Este proyecto se basa en una sección de un sitio web realizado previamente.

## Instrucciones para su uso

Los cursos se toman de un archivo json que simula un servidor. Se trata de los cursos ofrecidos por la sociedad y sus características (precios, descripción, etc.).
Debajo de cada curso se coloca un botón para reservar un lugar en el curso (se reserva una plaza extra cada vez que se pulsa el botón). En la parte derecha superior de la página hay un carrito de compras con un contador que va indicando la cantidad de lugares reservados (el total). Cuando se abre el carrito presenta un modal con la imágen, descripción, precio y cantidad de plazas reservadas para ese curso (esta información la toma del archivo .json). Al lado de cada curso presenta también el total del costo (precio x cantidad de lugares reservados) y la imagen de un cesto de basura que si se presiona elimina ese curso del carrito. La cantidad de plazas se puede modificar desde el carrito (+ y - a los costados de la cantidad reservada). Al pie del modal se presenta el total de la compra hasta el momento (suma de los totales parciales de cada curso) y tres botones: cerrar el modal, limpiar el carrito (borra todo lo agregado hasta el momento) y Pagar. Si colocamos Pagar se cierra el modal atual y se abre otro para seleccionar método de pago (tarjeta de débito o crédito) y completar los datos de la tarjeta seleccionada y agregar una dirección de mail (estos campos están autocompletados para el simulador). Si no se selecciona método de pago o se completan los campos (en caso que no estuvieran autocompletados) le indica al usuario que debe completar los campos y cómo debe hacerlo. Al pie, hay tres botones: cerrar el modal, volver al anterior y continuar. Si se pulsa continuar se cierra este modal y se presenta otro (esta vez se utiliza la librería sweet alert 2 para los siguientes dos modales) que dice procesando pago y a continuación otro que dice pago realizado con éxito. Después de esto el modal se cierra automáticamente (luego de un tiempo) y se limpia el contenido del carrito. Cabe aclarar que el carrito se almacena en el localStorage, lo cual permite que esté disponible cuando se cierra y vuelve a abrir la página (o se recarga). Cuando se vuelve a cargar la página verifica si hay productos en el carrito (localStorage) y presenta un modal (después de un par de segundos) que indica que hay productos en el carrito. Cuando se limpia el carrito o se eliminan cursos también se lo hace de la memoria.
Para recuperar el json se usa un fetch y si no se pueden recuperar se usa un catch que muestra al usuario que hubo un error recuperando los datos.

## Características y herramientas utilizadas

- HTML y CSS.
- Bootstrap.
- Sweet Alert 2.
- DOM
- Bloque try-catch para manejo de error. Función asincrónica y fetch para recuperar datos de json.
- Archivo JSON para simular datos en servidor
- localStorage

## Feedback

Para más consultas, podés escribirme a matscorrea333@gmail.com

