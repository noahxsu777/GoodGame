export type LegalDoc = {
  slug: string;
  title: string;
  updated: string;
  intro: string;
  sections: { heading: string; paragraphs: string[] }[];
};

/**
 * Textos legales de ejemplo para la demo. En un despliegue real habría que
 * revisarlos con asesoría legal de cada país donde se opere.
 */
export const LEGAL_DOCS: Record<string, LegalDoc> = {
  bases: {
    slug: "bases",
    title: "Bases de los sorteos",
    updated: "20 de agosto de 2026",
    intro:
      "Estas bases se aplican a todos los sorteos publicados en GG Play. Cada sorteo añade en su ficha el premio concreto, el precio del boleto, el número total de boletos, el mínimo necesario y la fecha del directo.",
    sections: [
      {
        heading: "1. Quién puede participar",
        paragraphs: [
          "Puede participar cualquier persona mayor de 18 años, o de la mayoría de edad de su país si esta es superior, residente en Latinoamérica o España.",
          "Se admite una única cuenta por persona. Las cuentas duplicadas se anulan y se reembolsa el importe de sus boletos.",
          "No pueden participar las personas que trabajan en la organización de los sorteos ni sus familiares directos.",
        ],
      },
      {
        heading: "2. Boletos",
        paragraphs: [
          "Cada boleto lleva un número correlativo asignado en el momento de la compra o del reclamo gratuito. El número queda visible en la cuenta del participante y no cambia.",
          "Toda cuenta tiene derecho a un boleto gratuito por sorteo, sin necesidad de compra. Ese boleto tiene exactamente la misma numeración y las mismas probabilidades que uno comprado.",
          "Los boletos no son transferibles entre cuentas.",
        ],
      },
      {
        heading: "3. Mínimo de boletos",
        paragraphs: [
          "Cada sorteo publica desde el primer día el número mínimo de boletos necesario para ejecutarse.",
          "Si al cerrar la venta no se alcanza ese mínimo, el sorteo se pospone una única vez o se cancela. En caso de cancelación se devuelve el importe íntegro de todos los boletos comprados por el mismo medio de pago.",
        ],
      },
      {
        heading: "4. Cómo se determina el ganador",
        paragraphs: [
          "Antes de abrir la venta se genera una semilla secreta aleatoria y se publica su hash SHA-256 en la ficha del sorteo.",
          "Durante el directo, la audiencia aporta una semilla pública. El boleto ganador se obtiene aplicando HMAC-SHA256 sobre ambas semillas y el número exacto de boletos vendidos.",
          "Al terminar se revela la semilla secreta para que cualquiera pueda repetir el cálculo desde la página de verificación.",
        ],
      },
      {
        heading: "5. Entrega del premio",
        paragraphs: [
          "Se contacta al ganador por el correo de su cuenta dentro de las 24 horas siguientes al sorteo. Dispone de 30 días naturales para responder y facilitar una dirección de envío.",
          "El envío incluye seguro y gastos de aduana. El ganador no paga nada por recibir su premio.",
          "El ganador puede optar por recibir el valor de referencia del premio en efectivo, solicitándolo dentro de los 14 días siguientes al sorteo.",
        ],
      },
      {
        heading: "6. Publicidad del resultado",
        paragraphs: [
          "Se publica el nombre que consta en la cuenta ganadora, su país y el número de boleto premiado. No se publican correos, teléfonos ni direcciones.",
          "El ganador puede pedir que se muestren solo sus iniciales escribiendo a la organización antes de la publicación.",
        ],
      },
    ],
  },
  terminos: {
    slug: "terminos",
    title: "Términos y condiciones",
    updated: "20 de agosto de 2026",
    intro:
      "Al crear una cuenta en GG Play aceptas estas condiciones de uso, además de las bases de cada sorteo en el que participes.",
    sections: [
      {
        heading: "1. La cuenta",
        paragraphs: [
          "Eres responsable de la veracidad de los datos de tu cuenta y de mantener tu contraseña a salvo.",
          "Puedes eliminar tu cuenta en cualquier momento. Los boletos de sorteos ya ejecutados se conservan de forma anonimizada por motivos de auditoría.",
        ],
      },
      {
        heading: "2. Pagos",
        paragraphs: [
          "Esta es una aplicación de demostración: los pagos están simulados y en ningún momento se solicitan ni se procesan datos de tarjeta reales.",
          "En un despliegue real, los cobros se tramitarían mediante una pasarela de pago certificada y los reembolsos se harían por el mismo medio de pago.",
        ],
      },
      {
        heading: "3. Uso aceptable",
        paragraphs: [
          "No se permite crear cuentas múltiples, automatizar compras ni intentar manipular los sorteos por ningún medio.",
          "La organización puede anular boletos y cerrar cuentas que incumplan estas condiciones, reembolsando el importe correspondiente.",
        ],
      },
      {
        heading: "4. Responsabilidad",
        paragraphs: [
          "El servicio se ofrece tal cual. No se garantiza la disponibilidad ininterrumpida de la web.",
          "Las incidencias con el transporte del premio se gestionan con la aseguradora, sin coste para el ganador.",
        ],
      },
    ],
  },
  privacidad: {
    slug: "privacidad",
    title: "Política de privacidad",
    updated: "20 de agosto de 2026",
    intro:
      "Recogemos los datos mínimos para que puedas participar en los sorteos y para poder entregarte el premio si ganas.",
    sections: [
      {
        heading: "Qué datos guardamos",
        paragraphs: [
          "Nombre, correo electrónico, país y un hash de tu contraseña. Nunca guardamos la contraseña en claro.",
          "El historial de tus boletos y participaciones, necesario para acreditar el resultado de cada sorteo.",
        ],
      },
      {
        heading: "Para qué los usamos",
        paragraphs: [
          "Para identificarte, asignarte boletos, avisarte si ganas y cumplir con las obligaciones legales de los sorteos.",
          "No vendemos ni cedemos datos personales a terceros con fines publicitarios.",
        ],
      },
      {
        heading: "Tus derechos",
        paragraphs: [
          "Puedes acceder, rectificar o eliminar tus datos desde tu cuenta o escribiendo a la organización.",
          "Al borrar la cuenta, los registros de sorteos ya ejecutados se conservan anonimizados por motivos de auditoría pública.",
        ],
      },
    ],
  },
  "juego-responsable": {
    slug: "juego-responsable",
    title: "Juego responsable",
    updated: "20 de agosto de 2026",
    intro:
      "Un sorteo es entretenimiento, no una forma de ganar dinero. Estas son las medidas que aplicamos y lo que te recomendamos.",
    sections: [
      {
        heading: "Lo que hacemos",
        paragraphs: [
          "Mostramos siempre cuántos boletos hay en total, para que sepas de antemano qué probabilidad tiene cada boleto.",
          "Todos los sorteos incluyen un boleto gratuito por cuenta: nunca hace falta gastar para participar.",
          "No enviamos avisos que presionen a comprar más boletos ni usamos temporizadores falsos de escasez.",
        ],
      },
      {
        heading: "Lo que te recomendamos",
        paragraphs: [
          "Fija un límite mensual antes de participar y no lo superes.",
          "Si sientes que estás gastando más de lo que querías, escribe a la organización: podemos limitar o bloquear tu cuenta a petición tuya.",
          "Si el juego te está afectando, busca ayuda profesional en tu país. Es un problema frecuente y tiene tratamiento.",
        ],
      },
    ],
  },
};
