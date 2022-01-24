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
const calcularConsumo = (cantLitros, consumoFijo) => cantLitros * consumoFijo;
const calcularDistancia = (distanciaIngresada, consumo) =>
  distanciaIngresada <= consumo;

const crearAuto = (
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
  divAutos.innerHTML = "";
  DATA_AUTOS.forEach((autosArray, indice) => {
    divAutos.innerHTML += `
      <div class="card animate__animated animate__fadeIn divCard" id="auto${indice}" style="width: 18rem;">
        <img class="card-img-top" src="${autosArray.img}" alt="Card image cap">
        <div class="card-body">
          <h4 class="card-title">Fabricante: ${autosArray.fabricante}</h4>
          <p class="card-text">Modelo: ${autosArray.modelo}</p>
          <p class="card-text">Motor: ${autosArray.motor}</p>
          <p class="card-text">Version: ${autosArray.version}</p>
          <p class="card-text">Capacidad del tanque: ${autosArray.capacidadTanque}</p>
          <p class="card-text">Consumo: ${autosArray.consumo}</p>
          <button id="boton${indice}" class="btn btn-danger">Eliminar</button>
          <button id="autocompletar${indice}" class="btn btn-primary">Autocompletar</button>
        </div>
      </div>
    `;
  });
  DATA_AUTOS.forEach((autosArray, indice) => {
    document.getElementById(`boton${indice}`).addEventListener("click", () => {
      document.getElementById(`auto${indice}`).remove();
      DATA_AUTOS.splice(indice, 1);
      localStorage.setItem("vehiculos", JSON.stringify(DATA_AUTOS));
    });
    DATA_AUTOS.forEach((autosArray, indice) => {
      document.getElementById(`autocompletar${indice}`).addEventListener("click", () => {
        marcaIngresada.value = autosArray.modelo
      })
    })  
  });
};


let DATA_AUTOS = [];
const init = () => {
  $(() => {
    $.getJSON("vehiculos.json", function (data) {
      DATA_AUTOS = data;
      DATA_AUTOS = JSON.parse(localStorage.getItem("vehiculos")) || DATA_AUTOS;
      mostrarAutos(DATA_AUTOS);
    });
  });
};

init();

const encontrarAuto = (marca) => {
  return DATA_AUTOS.find((auto) => auto.modelo === marca) || "No encontrado";
};

formConsumo.addEventListener("submit", (e) => {
  e.preventDefault();
  const autoBuscado = encontrarAuto(marcaIngresada.value);
  const leAlcanzaLosLitros = calcularDistancia(
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
  e.preventDefault();
  textoError.innerHTML = "";

  if (
    !fabricante.value.trim() ||
    !motor.value.trim() ||
    !version.value.trim() ||
    !capacidadTanque.value.trim() ||
    !consumo.value.trim()
  ) {
    textoError.innerHTML = `Por favor llene todo el formulario`;
    return;
  }

  const autoCargado = crearAuto(
    fabricante.value,
    modelo.value.toLowerCase(),
    motor.value,
    version.value,
    capacidadTanque.value,
    consumo.value,
    img.value
  );
  formAutos.reset();
  DATA_AUTOS.push(autoCargado);
  localStorage.setItem("vehiculos", JSON.stringify(DATA_AUTOS));
  mostrarAutos(DATA_AUTOS);
});
