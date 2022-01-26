//Declaracion de variables y funciones ------------------------------------------
const formAutos = document.getElementById("formAutos");
const divAutos = document.getElementById("divAutos");
const divParrafo = document.getElementById("divParrafo");
const formConsumo = document.getElementById("formConsumo");
const fabricante = document.getElementById("fabricante");
const motor = document.getElementById("motor");
const modelo = document.getElementById("modelo");
const version = document.getElementById("version");
const capacidadTanque = document.getElementById("capacidadTanque");
const img = document.getElementById("imagen");
const marcaIngresada = document.getElementById("marcaIngresada");
const distanciaIngresada = document.getElementById("distanciaIngresada");
const consumo = document.getElementById("consumo");
const textoError = document.getElementById("textoError");
const calcularConsumo = (cantLitros, consumoFijo) => (cantLitros * 100) / consumoFijo;
const calcularDistancia = (distanciaIngresada, consumo) =>
  distanciaIngresada <= consumo;
//-------------------------------------------------------------------------------

const crearAuto = (
  // Creo la funcion que retorna un objeto que sera cargado posteriormente
  fabricante,
  modelo,
  motor,
  version,
  capacidadTanque,
  consumo,
  img
) => {
  return {
    fabricante,
    modelo,
    motor,
    version,
    capacidadTanque,
    consumo,
    img,
  };
};

const mostrarAutos = (DATA_AUTOS) => {
  // Muestra las cards de bootstrap con la informacion de cada auto
  divAutos.innerHTML = "";
  DATA_AUTOS.forEach((autosArray, indice) => {
    // Recorro el array de la base de datos para generar una card de bootstrap por cada vehiculo cargado
    divAutos.innerHTML += `
      <div class="card divCard" id="auto${indice}" style="width: 18rem;">
        <img class="card-img-top" src="${autosArray.img}" alt="Card image cap">
        <div class="card-body">
          <h4 class="card-title">Fabricante: ${autosArray.fabricante}</h4>
          <p class="card-text">Modelo: ${autosArray.modelo}</p>
          <p class="card-text">Motor: ${autosArray.motor}</p>
          <p class="card-text">Version: ${autosArray.version}</p>
          <p class="card-text">Capacidad del tanque: ${autosArray.capacidadTanque}</p>
          <p class="card-text">Consumo: ${autosArray.consumo}</p>
          <button id="boton${indice}" class="btn btn-danger">Eliminar</button>
          <button id="autocompletar${indice}" class="btn btn-primary botonEnviar">Autocompletar</button>
        </div>
      </div>
    `;
  });
  DATA_AUTOS.forEach((autosArray, indice) => {
    document.getElementById(`boton${indice}`).addEventListener("click", () => {
      // Capturo el evento click del boton ELIMINAR de la card de bootstrap
      document.getElementById(`auto${indice}`).remove(); // Elimino el vehiculo del sitio
      DATA_AUTOS.splice(indice, 1); // Elimino el vehiculo del array
      localStorage.setItem("vehiculos", JSON.stringify(DATA_AUTOS)); // Elimino el vehiculo del local storage
    });
    DATA_AUTOS.forEach((autosArray, indice) => {
      document
        .getElementById(`autocompletar${indice}`)
        .addEventListener("click", () => {
          // Capturo el evento click para autocompletar el input con el modelo deseado
          marcaIngresada.value = autosArray.modelo;
        });
    });
  });
};

let DATA_AUTOS = [];
const init = () => {
  // Inicializacion de funciones
  $(() => {
    $.getJSON("vehiculos.json", function (data) {
      // Obtengo los datos del local storage
      DATA_AUTOS = data;
      DATA_AUTOS = JSON.parse(localStorage.getItem("vehiculos")) || DATA_AUTOS;
      mostrarAutos(DATA_AUTOS);
    });
  });
};

init();

const encontrarAuto = (marca) => {
  // Funcion para buscar la marca ingresada en el calculador de consumo
  return DATA_AUTOS.find((auto) => auto.modelo === marca) || "No encontrado";
};

formConsumo.addEventListener("submit", (e) => {
  // Capturo el evento Submit del formulario de consumo
  e.preventDefault();
  const autoBuscado = encontrarAuto(marcaIngresada.value); // Capturo el valor del input (marca ingresada)
  const leAlcanzaLosLitros = calcularDistancia(
    // Calculo de consumo
    distanciaIngresada.value,
    calcularConsumo(autoBuscado.capacidadTanque, autoBuscado.consumo)
  );

  if (!marcaIngresada.value.trim() || !distanciaIngresada.value.trim()) {
    calculadorError.innerHTML = `Por favor complete el formulario`;
    return;
  } else if (leAlcanzaLosLitros) {
    divParrafo.innerHTML = `
        <p>Puede recorrer esa distancia</p>
      `;
  } else {
    divParrafo.innerHTML = `
          <p>No puede recorrer esa distancia</p>
        `;
  }
});

formAutos.addEventListener("submit", (e) => {
  // Captura del evento Submit del formulario
  e.preventDefault();
  textoError.innerHTML = "";

  if (
    !fabricante.value.trim() ||
    !modelo.value.trim() ||
    !motor.value.trim() ||
    !version.value.trim() ||
    !capacidadTanque.value.trim() ||
    !consumo.value.trim()
  ) {
    textoError.innerHTML = `Por favor llene todo el formulario`;
    return;
  }

  const autoCargado = crearAuto(
    // Creo un nuevo vehiculo en la base de datos segun los datos ingresados
    fabricante.value,
    modelo.value.toLowerCase(),
    motor.value,
    version.value,
    capacidadTanque.value,
    consumo.value,
    img.value
  );
  formAutos.reset();
  DATA_AUTOS.push(autoCargado); // Pusheo el vehiculo ingresado al array
  localStorage.setItem("vehiculos", JSON.stringify(DATA_AUTOS)); // Cargo el vehiculo ingresado al local storage
  mostrarAutos(DATA_AUTOS); // Muestro el vehiculo nuevo cargado en un card de bootstrap
});
