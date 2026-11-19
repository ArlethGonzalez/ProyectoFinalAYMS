/**
 * ==========================================
 * MODELO (Adaptado de paquete modelo.*)
 * ==========================================
 */

class GeneradorNumeroAleatorio {
  static crearNumero() {
    // Genera un entero aleatorio entre 0 y 99, igual que azar.nextInt(100)
    return Math.floor(Math.random() * 100);
  }
}

class ConvertidorBinario {
  static ultimoHistorial = "";

  static comprobarRespuesta(numeroDeciActual, respuestaBin) {
    let dividendo = numeroDeciActual;
    let numBinCorrecto = "";
    let proceso = `Paso a paso de la conversión de:\n${numeroDeciActual} al sistema binario, dividiendo continuamente entre 2:\n\n`;

    if (dividendo === 0) {
      numBinCorrecto = "0";
      proceso += "0 dividido entre 2 es 0, con residuo: 0\n";
    } else {
      while (dividendo > 0) {
        const cociente = Math.floor(dividendo / 2);
        const residuo = dividendo % 2;
        proceso += `${dividendo} / 2 = ${cociente} con residuo: ${residuo}\n`;
        numBinCorrecto = residuo + numBinCorrecto;
        dividendo = cociente;
      }
    }

    proceso += `\nAhora se leen los resultados de abajo hacia arriba.\n`;
    proceso += `La conversión a sistema binario correcta es: ${numBinCorrecto}\n`;

    let historial = "";
    if (respuestaBin === numBinCorrecto) {
      historial = `¡MUY BIEN, TU RESPUESTA ES CORRECTA!\n` +
                  `El número ${numeroDeciActual} en sistema binario, en efecto es: ${numBinCorrecto}\n`;
    } else {
      historial = `¡Ups, respuesta incorrecta!\n` +
                  `La respuesta que diste fue: ${respuestaBin}\n\n${proceso}`;
    }

    // Guarda el historial en memoria (equivalente a historialPracticas.txt)
    this.ultimoHistorial = historial;
    return historial;
  }

  static descargarArchivoHistorial() {
    if (!this.ultimoHistorial) {
      alert("Aún no hay resultados registrados para descargar.");
      return;
    }
    const blob = new Blob([this.ultimoHistorial], { type: "text/plain;charset=utf-8" });
    const enlace = document.createElement("a");
    enlace.href = URL.createObjectURL(blob);
    enlace.download = "historialPracticas.txt";
    enlace.click();
    URL.revokeObjectURL(enlace.href);
  }
}

/**
 * ==========================================
 * CONTROLADOR Y VISTAS (MenuPrincipal y Practica)
 * ==========================================
 */

document.addEventListener("DOMContentLoaded", () => {
  // Referencias a Vistas
  const vistaMenu = document.getElementById("vistaMenuPrincipal");
  const vistaPractica = document.getElementById("vistaPractica");

  // Botones Menú Principal
  const btnAprendeConIA = document.getElementById("btnAprendeConIA");
  const btnPractica = document.getElementById("btnPractica");
  const btnSalir = document.getElementById("btnSalir");

  // Controles Vista Práctica
  const btnGenerarNumero = document.getElementById("btnGenerarNumero");
  const txtNumero = document.getElementById("txtNumero");
  const txtNumeroBinario = document.getElementById("txtNumeroBinario");
  const txtAreaComprobar = document.getElementById("txtAreaComprobar");
  const btnComprueba = document.getElementById("btnComprueba");
  const btnLimpia = document.getElementById("btnLimpia");
  const btnDescargarTxt = document.getElementById("btnDescargarTxt");
  const btnRegresa = document.getElementById("btnRegresa");

  // Estado de la práctica
  let numeroDeciActual = -1;

  // --- Eventos MenuPrincipal ---
  btnAprendeConIA.addEventListener("click", () => {
    window.open(
      "https://gemini.google.com/app/5c08fc2f94ab730a?utm_source=app_launcher&utm_medium=owned&utm_campaign=base_all",
      "_blank",
      "noopener,noreferrer"
    );
  });

  btnPractica.addEventListener("click", () => {
    vistaMenu.classList.replace("vista-activa", "vista-oculta");
    vistaPractica.classList.replace("vista-oculta", "vista-activa");
  });

  btnSalir.addEventListener("click", () => {
    if (confirm("¿Deseas cerrar la aplicación?")) {
      window.close();
      // Si el navegador bloquea window.close(), muestra mensaje amigable
      document.body.innerHTML = "<h2 style='color:#00ffff; text-align:center;'>Gracias por usar el Sistema Convertidor de Números Binarios.</h2>";
    }
  });

  // --- Eventos Practica ---
  btnGenerarNumero.addEventListener("click", () => {
    numeroDeciActual = GeneradorNumeroAleatorio.crearNumero();
    txtNumero.value = numeroDeciActual;
    txtAreaComprobar.value = "";
    txtNumeroBinario.value = "";
    txtNumeroBinario.focus();
    // Bloquea el botón Generar hasta que el usuario acierte
    btnGenerarNumero.disabled = true;
  });

  btnComprueba.addEventListener("click", () => {
    if (numeroDeciActual === -1) {
      txtAreaComprobar.value = "Por favor, da clic en el botón titulado Generar.\n";
      return;
    }

    const respuestaBin = txtNumeroBinario.value.trim();
    if (respuestaBin === "") {
      txtAreaComprobar.value = "No se puede quedar ese campo vacío, por favor, añade una respuesta.\n";
      return;
    }

    // Validación extra: solo permitir ceros y unos en el campo binario
    if (!/^[01]+$/.test(respuestaBin)) {
      txtAreaComprobar.value = "Entrada inválida: un número binario solo puede contener dígitos 0 y 1.\n";
      return;
    }

    const contenidoDeArch = ConvertidorBinario.comprobarRespuesta(numeroDeciActual, respuestaBin);
    txtAreaComprobar.value = contenidoDeArch;

    // Desbloquea el botón Generar solo si la respuesta es correcta
    if (contenidoDeArch.includes("CORRECTA")) {
      btnGenerarNumero.disabled = false;
    } else {
      btnGenerarNumero.disabled = true;
    }
  });

  // Permite presionar Enter dentro del input para comprobar más rápido
  txtNumeroBinario.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      btnComprueba.click();
    }
  });

  btnLimpia.addEventListener("click", () => {
    txtNumeroBinario.value = "";
    txtNumeroBinario.focus();
  });

  btnDescargarTxt.addEventListener("click", () => {
    ConvertidorBinario.descargarArchivoHistorial();
  });

  btnRegresa.addEventListener("click", () => {
    vistaPractica.classList.replace("vista-activa", "vista-oculta");
    vistaMenu.classList.replace("vista-oculta", "vista-activa");
  });
});