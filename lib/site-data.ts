import {
  BadgeCheck,
  BriefcaseBusiness,
  Car,
  ClipboardCheck,
  Gavel,
  HardHat,
  Mail,
  Phone,
  UserRoundCheck,
} from "lucide-react";

export const firm = {
  name: "Dr. Ponte Wisto Leonardo & Asoc.",
  shortName: "Ponte Wisto & Asoc.",
  phoneDisplay: "011-15-68063420",
  phoneHref: "tel:+5491168063420",
  email: "lpontewisto@live.com.ar",
  emailHref: "mailto:lpontewisto@live.com.ar",
  whatsappDisplay: "+54 9 11 6806-3420",
  whatsappHref:
    "https://wa.me/5491168063420?text=Hola%2C%20quisiera%20realizar%20una%20consulta%20por%20un%20accidente%20laboral%20o%20ART.",
  address: "Mitre 1290, 1er piso · Morón, Buenos Aires",
  addressHref: "https://www.google.com/maps/search/?api=1&query=Mitre+1290+Mor%C3%B3n+Buenos+Aires+Argentina",
};

export const navItems = [
  { label: "Inicio", href: "#inicio" },
  { label: "El Estudio", href: "#estudio" },
  { label: "ART", href: "#art" },
  { label: "Stand de Abogados", href: "#equipo" },
  { label: "Contacto", href: "#contacto" },
];

export const practiceAreas = [
  {
    title: "Accidentes de Tránsito",
    description:
      "Te acompañamos y asesoramos en todo el proceso para que recibas la indemnización que merecés.",
    icon: Car,
    features: [
      "Indemnización por daños materiales y lesiones",
      "Reclamos a aseguradoras",
      "Contestación de demandas",
      "Defensa penal",
      "Querella — Particular damnificado",
      "Asesoría integral y personalizada",
    ],
    primary: true,
  },
  {
    title: "Accidentes Laborales",
    description:
      "Defendemos tus derechos frente a ART, empleadores y aseguradoras para garantizar tu protección.",
    icon: HardHat,
    features: [
      "Prestaciones médicas",
      "Incapacidad laboral",
      "Recalificación de invalidez",
      "Indemnizaciones",
      "Contestación de demandas",
      "Defensa penal",
      "Querella — Particular damnificado",
      "Asesoría integral y personalizada",
    ],
    primary: false,
  },
];

export const processSteps = [
  {
    title: "Consulta inicial",
    description:
      "Relevamos el accidente, la respuesta de la ART y la documentación disponible para ordenar el caso.",
    icon: Phone,
  },
  {
    title: "Evaluación jurídica",
    description:
      "Analizamos cobertura, plazos, prestaciones médicas, incapacidad y estrategia conveniente.",
    icon: ClipboardCheck,
  },
  {
    title: "Reclamo y seguimiento",
    description:
      "Impulsamos el reclamo correspondiente y mantenemos una comunicación clara sobre cada avance.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Resolucion",
    description:
      "Buscamos encauzar el caso hacia una reparacion seria, acuerdo o instancia formal cuando corresponda.",
    icon: BadgeCheck,
  },
];

export const team = [
  {
    name: "Dr. Ponte Wisto Leonardo",
    role: "Dirección legal",
    description: "Estrategia jurídica y seguimiento de reclamos por accidentes laborales y ART.",
    icon: UserRoundCheck,
    hasPhoto: true,
    photo: "/abogados/Leonardo.jpeg",
  },
  {
    name: "Atención al cliente",
    role: "Coordinación",
    description: "Comunicación clara para consultas, turnos y estado de cada gestión iniciada.",
    icon: Mail,
    hasPhoto: false,
    photo: null,
  },
  {
    name: "Dr. Canosa Pablo Anibal",
    role: "Abogado asociado",
    description: "Asistencia jurídica en causas laborales, ART y representación en instancias administrativas.",
    icon: Gavel,
    hasPhoto: true,
    photo: "/abogados/Anibal.jpeg",
  },
];
