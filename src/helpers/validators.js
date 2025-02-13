export const validarCedula = (cedula) => {
  cedula = String(cedula).replace(/[-\s]/g, "");


  if (cedula.length !== 11) { 
    return false;
  }

  let suma = 0;
  let multiplicadores = [1, 2]; 

  for (let i = 0; i < 10; i++) {
    let num = parseInt(cedula[i]) * multiplicadores[i % 2];
    suma += num > 9 ? num - 9 : num;
  }

  let digitoVerificador = (10 - (suma % 10)) % 10;
  return digitoVerificador === parseInt(cedula[10]);
};


export const validarTarjetaCredito = (tarjeta) => {

  tarjeta = String(tarjeta).replace(/[\s-]/g, "");

  
  if (!/^\d{13,19}$/.test(tarjeta)) {
    return false;
  }


  let suma = 0;
  let alternar = false;

  for (let i = tarjeta.length - 1; i >= 0; i--) {
    let num = parseInt(tarjeta[i]);

    if (alternar) {
      num *= 2;
      if (num > 9) num -= 9;
    }

    suma += num;
    alternar = !alternar;
  }

  return suma % 10 === 0;
};

export const validarLimiteCredito = (limiteCredito) => {
  if (limiteCredito <= 0) {
    return false;
  }

  return limiteCredito;
};

export const validarRenta = (renta) => {
  const { fechaRenta, fechaDevolucion, montoDia, cantDias, totalCobro } = renta;

  if (!fechaRenta || !fechaDevolucion) {
    return { valido: false, mensaje: "Debe ingresar ambas fechas." };
  }

  const fechaInicio = new Date(fechaRenta).getTime();
  const fechaFin = new Date(fechaDevolucion).getTime();

  let diff = fechaFin - fechaInicio;

  if (isNaN(fechaInicio) || isNaN(fechaFin)) {
    return { valido: false, mensaje: "Las fechas no son válidas." };
  }

  if (fechaFin < fechaInicio) {
    return {
      valido: false,
      mensaje:
        "La fecha de devolución no puede ser antes que la fecha de inicio.",
    };
  }

  if (fechaFin == fechaInicio) {
    return {
      valido: false,
      mensaje:
        "La fecha de devolución no puede ser igual a la fecha de inicio.",
    };
  }

  const diasCalculados = Math.round(diff / (1000 * 60 * 60 * 24));

  
  if (cantDias <= 0 || cantDias != diasCalculados) {
    return { valido: false, mensaje: "La cantidad de días es incorrecta." };
  }

  const montoCalculado = Number(montoDia) * Number(cantDias);
  if (Number(totalCobro) !== montoCalculado) {
    return {
      valido: false,
      mensaje:
        "El monto total no coincide con la cantidad de días y el monto por día.",
    };
  }

  return { valido: true };
};
