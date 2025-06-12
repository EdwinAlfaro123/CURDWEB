//EndPoint de Integrantes - API
const API_URL ="https://retoolapi.dev/4pgKCW/Integrantes";

//Funcion que manda a traer el JSON con GET
async function ObtenerIntegrantes(){

    //Respuesta del servidor
    const respuesta = await fetch(API_URL);

    //Pasamos a JSON la respuesta del servidor
    const data = await respuesta.json(); //Esto es un JSON

    //Enviamos el JSON a la funcion que genera las filas en la tabla
    MostrarDatos(data);
}

//Funcion para crear las filas de la tabla en base a un JSON
//"Datos" representara el JSON donde viene la informacion
function MostrarDatos(data){
    //Se llama a la tabla con elemento "id" y luego al tbody
    const tabla = document.querySelector("#tabla tbody");

    //Para inyectar codigo HTML usamos "innerHTML"
    tabla.innerHTML = ""; //Vaciamos el contenido de la tabla

    data.forEach(integrante => {
        tabla.innerHTML += `
            <tr>
                <td>${integrante.id}</td>
                <td>${integrante.Nombre}</td>
                <td>${integrante.Apellido}</td>
                <td>${integrante.Correo}</td>
                <td>
                    <button onclick="AbrirModalEditar('${integrante.id}', '${integrante.Nombre}', '${integrante.Apellido}', '${integrante.Correo}')">Editar</button>
                    <button onclick="EliminarPersonas(${integrante.id})">Eliminar</button>
                </td>
            </tr>
        `;
    });
}

ObtenerIntegrantes();




//Proceso para agregar un nuevo integrante
const modal = document.getElementById("mdAgregar"); //Cuadro de dialogo
const btnAgregar = document.getElementById("btnAgregar"); //Boton para agregar registro
const btnCerrar = document.getElementById("btnCerrar"); //Boton para cerrar el popup

btnAgregar.addEventListener("click", ()=>{
    modal.showModal(); //
});

btnCerrar.addEventListener("click", ()=>{
    modal.close();
})

//Agregar nuevo integrante desde el formulario
document.getElementById("frmAgregar").addEventListener("submit", async e => {e.preventDefault(); //"e" representa a "submit". Evita que el formulario se envie de un solo

    //Capturar los valores del formulario
    const Nombre = document.getElementById("txtNombre").value.trim();
    const Apellido = document.getElementById("txtApellido").value.trim();
    const Correo = document.getElementById("txtEmail").value.trim();

    //Validacion basica
    if(!Nombre || !Apellido || !Correo){
        alert("Ingrese todos los valores");
        return; //Para evitar que el codigo se siga ejecutando
    }

    //Llamar a la API para enviar el registro
    const respuesta = await fetch(API_URL, {
        method: "POST", //Tipo de solicitud
        headers: {'Content-Type':'application/json'}, //Tipo de dato enviado
        body: JSON.stringify({Nombre, Apellido, Correo}) //Datos enviados
    });

    //Verificar si la API responde que los datos fueron enviados correctamente
    if(respuesta.ok){
        alert("El registro fue agregado correctamente");
        
        //Limpiar el formulario
        document.getElementById("frmAgregar").reset();
    
        //Cerrar el modal (dialog)
        modal.close();

        //Recargar la tabla
        ObtenerIntegrantes();
    }
    else{
        //En caso de que la API devuelva un codigo diferente a 200-299
        alert("El registro no pudo ser agregado");
    }

});


//Funcion para borrar registros
async function EliminarPersonas(id){
    const confirmacion = confirm("¿Realmente deseas eliminar el registro?");
    
    //Validamos si el usuario si escogio borrar
    if(confirmacion){
        await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
        });

        //Recargar la tabla despues de eliminar
        ObtenerIntegrantes();
    }else{

    }
}

//Funcion para editar Usuarios
const modalEditar = document.getElementById("mdModificar");
const btnCerrarModificar = document.getElementById("btnCerrarModificar")

btnCerrarModificar.addEventListener("click", ()=>{
    modalEditar.close(); 
});

function AbrirModalEditar(id, Nombre, Apellido, Correo){
    //Se agregan los valores del registro de los input
    document.getElementById("txtIdEditar").value = id
    document.getElementById("txtNombreModificar").value = Nombre
    document.getElementById("txtApellidoModificar").value = Apellido
    document.getElementById("txtEmailModificar").value = Correo

    //Abrimos el modal despues de pasar
    modalEditar.showModal();
}