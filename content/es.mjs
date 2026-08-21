// Coco Surf School — design-06 multipage — ESPAÑOL content (machine-translated, needs native proofreading)
const CARDS = [
  { img: 'real-deluxe-group.jpg', alt: 'Un pequeño grupo de surfistas en la playa', title: 'Clase de grupo deluxe', from: 'desde 44 €', p: 'Una clase de 2 a 6 personas máx. por monitor: la fórmula entre grupo y privado para progresar más rápido. Más tiempo con el coach.', chips: ['Grupo pequeño · máx. 6', '±2 h en total', 'Material incluido'] },
  { img: 'real-lesson-kids.jpg', alt: 'Alumnos aprendiendo a surfear en la espuma', title: 'Clase de grupo', from: 'desde 38 €', p: 'Una clase de calidad de 7 a 8 personas con un monitor. Buen ambiente y buen rollo incluidos.', chips: ['Grupo más grande · 7–8', '±2 h en total', 'Material incluido'] },
  { img: 'lesson-prive.jpg', alt: 'Una surfista en una bonita ola verde', title: 'Clase privada', from: 'desde 130 €', p: 'Una clase solo para ti, en pareja, en familia o con amigos. Un monitor totalmente dedicado a tu progresión.', chips: ['Tu propio grupo · 1–7', '±2 h en total', 'A medida'] },
  { img: 'lesson-team.jpg', alt: 'Compañeros de trabajo van al océano con sus tablas', title: 'Empresas &amp; team building', from: 'a petición', p: '¡Una salida deportiva entre compañeros! Espíritu de equipo, antiestrés, sonrisas y diversión garantizadas.', chips: ['A petición', 'Cohesión'] },
];
export default {
  waText: 'Hola Coco Surf School, me gustaría reservar una clase de surf.',
  ui: {
    nav: { lessons: 'Clases &amp; tarifas', coach: 'Coach', stay: 'Alojamiento', rental: 'Alquiler', contact: 'Contacto', learn: 'Aprender a surfear', faq: 'Preguntas frecuentes', legal: 'Aviso legal', privacy: 'Privacidad' },
    navLabel: 'Navegación principal', book: 'Reservar', langLabel: 'Selección de idioma', menuOpen: 'Abrir menú',
    crumbHome: 'Inicio', footTagline: 'Escuela de surf en Seignosse &amp; Hossegor. Calidad antes que cantidad — clases en grupos pequeños con Annelies.', footNav: 'Descubrir', langWord: 'Idioma',
  },
  pages: {
    home: {
      title: 'Coco Surf School — Aprende a surfear en Hossegor &amp; Seignosse',
      desc: 'Escuela de surf en Seignosse &amp; Hossegor, Francia. Clases en grupos pequeños de máx. 6 personas, tranquilas y a medida, tabla y neopreno incluidos.',
      jsonld: { '@context': 'https://schema.org', '@type': 'SportsActivityLocation', name: 'Coco Surf School', description: 'Escuela de surf en Seignosse y Hossegor (Landes, Francia), clases en grupos pequeños de máximo 6 personas.', url: 'https://www.coco-surfschool.com/es/', telephone: '+33647454265', email: 'cocobosurfschool@gmail.com', priceRange: '€40–€310', areaServed: ['Seignosse', 'Hossegor', 'Capbreton', 'Les Landes'], address: { '@type': 'PostalAddress', addressLocality: 'Seignosse', addressRegion: 'Landes', postalCode: '40510', addressCountry: 'FR' } },
      hero: { eyebrow: 'Escuela de surf móvil · Landes, Francia', h1: 'Tu escuela de surf en <em>Seignosse, Hossegor &amp; Capbreton</em>', lead: 'Clases, cursos intensivos y coaching para todas las edades, de niños a adultos — de principiante a surfista avanzado, en grupo pequeño, privado o en grupo. Con el acompañamiento de coaches diplomadas, tabla y neopreno incluidos. ¿Quieres dominar el surf de verdad? ¡Reserva un curso de 5 días!', cta1: 'Reservar una clase', cta2: 'Ver tarifas', cta3: 'Reservar un curso', facts: [{ b: '6', s: 'máx. / grupo' }, { b: '±2 h', s: 'por clase (1h30 en el agua)' }, { b: '5 días', s: 'curso · 5 × 2 h' }, { b: '38 €', s: 'desde, por persona' }], imgAlt: 'Alumnos de Coco Surf School frente al océano en Seignosse', badge1: 'Cursos de surf', badge2: 'grupo reducido · privado o colectivo' },
      trust: [{ ic: '👥', b: 'Grupos pequeños', s: 'Máx. 6 en la clase deluxe · grupo más grande posible' }, { ic: '🏄‍♀️', b: 'Coaches diplomadas', s: 'Coaches certificadas ISA &amp; FR' }, { ic: '🩱', b: 'Material incluido', s: 'Tabla &amp; neopreno incluidos' }, { ic: '📍', b: 'Escuela móvil', s: 'El mejor spot para tu nivel' }],
      philosophy: { eyebrow: 'Nuestra filosofía', title: 'Una escuelita que se toma el tiempo para hacerlo bien', lead: 'Calidad antes que cantidad. Grupos pequeños, coaches con experiencia que comparten su pasión contigo y mucho tiempo en el agua — para que progreses más rápido y disfrutes más. ¡Buen rollo garantizado!', points: [{ h: 'Calidad antes que cantidad', p: 'Máximo 6 por grupo en la clase deluxe, para más coaching y una progresión más rápida. Grupo más grande posible.' }, { h: 'Progresar con buen ambiente', p: 'Aprender a surfear debe ser divertido — buen rollo garantizado, desde tu primera ola hasta tu primera ola verde.' }, { h: 'El spot adecuado, cada día', p: 'Escuela móvil entre Seignosse, Hossegor y Capbreton: elegimos el mejor spot lo más cerca posible de ti.' }] },
      surfReport: { eyebrow: 'En directo · Les Bourdaines, Seignosse', title: 'Surf report', today: 'Hoy', tomorrow: 'Mañana', air: 'Aire', wave: 'Ola', water: 'Agua', wind: 'Viento', uv: 'UV', tide: 'Marea', high: 'Alta', low: 'Baja', sunrise: 'Amanecer', sunset: 'Atardecer', unavailable: 'Condiciones no disponibles ahora.' },
      lessonsT: { eyebrow: 'Las fórmulas', title: 'Elige la clase que va contigo', lead: 'Todas las clases duran 1h30 en el agua — cuenta con ±2 h en total (desplazamiento y cambio incluidos). Tabla y neopreno incluidos. Los horarios dependen de la marea, las condiciones del océano y tu nivel.', cards: CARDS, more: 'Ver todas las clases &amp; tarifas' },
      spots: { eyebrow: 'Dónde surfeamos', title: 'Dos de los mejores spots de las Landes', lead: 'Una escuela móvil entre Seignosse, Hossegor y Capbreton — elegimos el mejor spot según tu nivel y las condiciones del día.', hossegor: { alt: 'Las playas de surf de Hossegor', h: 'Surf en Hossegor', p: 'Beach breaks reconocidos, una ciudad surfera y clases para todos los niveles.' }, seignosse: { alt: 'La playa de Les Bourdaines en Seignosse', h: 'Surf en Seignosse', p: 'Nuestro campamento de verano en Les Bourdaines — olas suaves, perfectas para empezar.' } },
      reviews: { eyebrow: 'Opiniones', title: 'Lo que dicen los surfistas', sub: '5,0 · Opiniones de Google', cta: 'Ver en Google' },
      coachT: { alt: 'Annelies, coach de Coco Surf School, en una ola', eyebrow: 'Tu coach', title: 'Annelies, alias «Bo»', quote: '«El surf es uno de los descubrimientos más bonitos de mi vida.»', p: 'Monitora de surf diplomada (ISA &amp; FR), profesora de deporte y deportista de siempre. Tras diez años viajando y surfeando, Annelies se instaló en Seignosse para abrir una escuela tranquila y a escala humana. Progresar en un ambiente estupendo — ¡buen rollo garantizado!', cta: 'Conocer a Annelies' },
      cta: { h: '¿Con ganas de surfear con nosotros?', p: 'Grupos pequeños, todos los niveles, tabla &amp; neopreno incluidos. Escríbenos — te respondemos encantados.', b1: 'Reservar una clase', b2: 'Escríbenos por WhatsApp' },
    },
    lessons: {
      title: 'Clases de surf &amp; tarifas — Coco Surf School Hossegor &amp; Seignosse', desc: 'Clases de surf en las Landes: grupo deluxe (máx. 6) desde 44 €, grupo desde 38 €, privado desde 130 €. Tabla &amp; neopreno incluidos, 1h30.', h1: 'Clases de surf', crumb: 'Clases &amp; tarifas',
      eyebrow: 'Las fórmulas &amp; tarifas', h1html: 'Elige la clase que va <em>contigo</em>', lead: 'Todas las clases duran 1h30 en el agua — cuenta con ±2 h en total (desplazamiento y cambio incluidos). Tabla y neopreno incluidos. Los horarios dependen de la marea, las condiciones del océano y tu nivel.', cta1: 'Reservar una clase', cta2: 'Escríbenos por WhatsApp',
      cards: CARDS, note: '<strong>Bueno saberlo —</strong> la tabla y el neopreno siempre están incluidos. Duración: 1h30 por sesión — cuenta con ±2 h en total (desplazamiento y cambio incluidos).',
      rates: { eyebrow: 'Tarifas', title: 'Precios claros, todo incluido', lead: 'Tabla y neopreno incluidos · ±2h por clase (1h30 en el agua) · «pp» = por persona.', cards: [
        { featured: true, h: 'Grupo deluxe', flag: 'El más popular', sub: 'Un monitor para máx. 6 personas (mín. 2).', lines: [['1 clase', '52 € pp'], ['Pequeño surf trip (3 clases)', '138 € pp'], ['Curso de 5 días (5 clases)', '220 € pp'], ['Descuento familia (3 inscripciones)', '215 € pp']], incl: '2 o 4 clases también posibles · Tabla &amp; neopreno incluidos · ±2h (1h30 en el agua)' },
        { h: 'Grupo', sub: 'Grupos más grandes — un monitor para 8 máx. (mín. 3 para abrir la clase).', lines: [['1 clase', '40 € pp'], ['Pequeño surf trip (3 clases)', '115 € pp'], ['Curso de 5 días (5 clases)', '180 € pp']], incl: '2 o 4 clases también posibles · Tabla &amp; neopreno incluidos · ±2h (1h30 en el agua)' },
        { h: 'Clases privadas', sub: 'Tabla &amp; neopreno incluidos · ±2h en total (~1h15 de coaching en el agua).', lines: [['1 persona', '130 € <small>jul.–ago.: 180 €</small>'], ['2 personas', '170 € <small>jul.–ago.: 220 €</small>'], ['3 personas', '240 € <small>jul.–ago.: 260 €</small>'], ['4 personas', '290 €'], ['5 a 7 personas', '310 €']], incl: 'Un coach privado solo para ti' },
      ], extra: [{ h: 'Surf guiding', p: 'Descubre otras playas de Seignosse, Hossegor o Capbreton — cuenta con 5 a 6 h (2 sesiones de surf). Tarifas a petición.' }, { h: 'Reserva &amp; pago', p: 'Se pide un anticipo del 30 % al reservar. Pago por transferencia bancaria o en efectivo.' }] },
    },
    coach: {
      title: 'Tu coach Annelies — Coco Surf School Hossegor', desc: 'Conoce a Annelies («Bo»), monitora de surf diplomada (ISA &amp; FR) y fundadora de Coco Surf School en Hossegor/Seignosse.', h1: 'Tu coach', crumb: 'Coach', imgAlt: 'Annelies, coach y fundadora de Coco Surf School', eyebrow: 'Tu coach',
      quote: '«El surf es un descubrimiento maravilloso; el deporte y el coaching son una gran parte de mi vida.»',
      body: ['Tu coach de surf. Annelies nació y creció en Bélgica; desde pequeña le encanta el deporte y alcanza un buen nivel en trampolín. Descubre el surf a los 16 durante un viaje familiar a Soustons — ¡y se engancha al instante!', 'Tras su Máster en Educación Física (KU Leuven) sigue su sueño y se va a surfear, competir en snowboard y trabajar por el extranjero: Australia, Nueva Zelanda, EE. UU., Indonesia, Sri Lanka, Fiyi, Marruecos… «Después de mi vida como competidora, era tan lógico convertirme en profesora de deporte, surf y snowboard.»', 'Tras 10 años de viajes echaba demasiado de menos el océano y se instaló en Seignosse. «Estoy agradecida de haber podido trabajar unos años para el club de surf de Hossegor; ahora estoy encantada de acogeros en mi propia escuelita. Coco Surf School se centra en la calidad y no en la cantidad. Por eso proponemos la fórmula deluxe: clases en grupos pequeños de máximo 6 personas por profesor.»'],
      dipTitle: 'Diplomas &amp; certificaciones', diplomas: [['2000', 'Initiator Snowboard (VSSF)'], ['2003', 'Máster en Educación Física, KU Leuven'], ['2003', 'Diploma de enseñanza, KU Leuven'], ['2003', 'Trainer A fitness &amp; personal trainer, VTS'], ['2006', 'Level 2 Snowboard, ASI (US)'], ['2009', 'Level 1 ISA Surf Coach &amp; Lifeguard'], ['2013', 'Carte professionnelle Éducateur Sportif Surf (FR)'], ['2020', 'International Surf Judge, ISA'], ['2021', 'PSE1 Primeros auxilios, Hossegor']], cta: 'Reservar una clase con Annelies',
    },
    stay: {
      title: 'Dónde dormir — Alojamientos cerca de Coco Surf School, Seignosse', desc: 'Direcciones donde dormir cerca de Coco Surf School en Seignosse &amp; Hossegor: Maison Irene, Villa &amp; Maison de la Dune, Board &amp; Breakfast y campings.', h1: 'Dónde dormir', crumb: 'Alojamiento',
      eyebrow: 'Dónde dormir', h1html: 'Alojamientos justo <em>al lado</em> de la escuela', lead: 'Algunas direcciones de confianza para dejar las maletas a un paso del océano.',
      cards: [
        { pin: 'Seignosse · Les Bourdaines', h: 'Maison Irene', p: '8 personas, 3 habitaciones + sofá cama, 2 baños, gran terraza con jacuzzi. A 100 m de la playa y de la escuela. Anuncio de Airbnb disponible.', href: 'mailto:tudela_sire@hotmail.com', link: 'Contactar con Irene' },
        { pin: 'Seignosse', h: 'Villa de la Dune', p: 'Amplia villa de vacaciones en Seignosse, a un paso de las playas y de la escuela.', href: 'https://villadeladune-seignosse.fr', link: 'villadeladune-seignosse.fr' },
        { pin: 'Seignosse', h: 'Maison de la Dune', p: 'Casa de vacaciones con encanto en Seignosse, cerca de los spots y del centro.', href: 'https://maisondeladune-seignosse.fr', link: 'maisondeladune-seignosse.fr' },
        { pin: 'Labenne Océan', h: 'Board &amp; Breakfast', p: 'Anton te acoge en su bonita casa con piscina — alquiler completo hasta 20 personas o habitaciones estilo surf camp.', href: 'https://boardnbreakfast.com', link: 'boardnbreakfast.com' },
        { pin: 'Seignosse', h: 'Campings', p: 'Varios campings cerca, ideales en verano: Natureo, Les Maritimes y Les Oyats.', href: 'https://seignosse-tourisme.com', link: 'Ver los campings' },
        { pin: 'Oficina de turismo de Seignosse', h: 'Más opciones', p: 'Encuentra más alojamientos y consejos a través de la oficina de turismo de Seignosse.', href: 'https://seignosse-tourisme.com', link: 'seignosse-tourisme.com' },
      ],
    },
    rental: {
      title: 'Alquiler — tablas de surf &amp; neoprenos | Coco Surf School', desc: 'Alquila una tabla de surf o un neopreno en Coco Surf School en Seignosse &amp; Hossegor — de 2 horas a una semana.', h1: 'Alquiler', crumb: 'Alquiler',
      eyebrow: 'Alquiler', h1html: 'Alquila tu <em>material</em>', lead: 'Alquila tu tabla o tu neopreno con nosotros — de 2 horas a una semana entera. Recogida in situ.',
      board: 'Surf (solo tabla)', wetsuit: 'Neopreno',
      cols1: ['Tarifa', '2 h', '½ día', '1 día', '2 días'], cols2: ['Tarifa', '3 días', '4 días', '5 días', '6 días', '1 semana'],
      rows1: { board: ['€15', '€20', '€30', '€50'], wetsuit: ['€10', '€10', '€15', '€25'] },
      rows2: { board: ['€70', '€80', '€90', '€100', '€110'], wetsuit: ['€35', '€45', '€55', '€65', '€70'] },
      note: '<strong>Bueno saberlo —</strong> alquiler in situ. Pregúntanos al reservar o por WhatsApp.', cta: 'Reserva tu material',
    },
    contact: {
      title: 'Contacto &amp; reserva — Coco Surf School Hossegor &amp; Seignosse', desc: 'Reserva tu clase de surf en Coco Surf School. Teléfono +33 6 47 45 42 65, email cocobosurfschool@gmail.com. Anticipo del 30 %.', h1: 'Contacto', crumb: 'Contacto',
      eyebrow: 'Contacto', lead: 'La escuela te acoge en Seignosse, Hossegor y Capbreton. Escríbenos para reservar tu clase o hacer una pregunta — te respondemos encantados.',
      phone: 'Teléfono', where: 'Dónde', deposit: 'Se pide un anticipo del 30 % al reservar. Pago por transferencia bancaria o en efectivo.', fName: 'Nombre', fEmail: 'Email', fMsg: 'Mensaje', fPlaceholder: '¿Qué clase te interesa? ¿Cuántas personas? ¿Qué fechas?', send: 'Enviar', fSending: 'Enviando…', fOk: '¡Gracias! Te responderemos muy pronto.', fErr: 'Algo salió mal. Escríbenos directamente a cocobosurfschool@gmail.com.', faqTitle: 'Preguntas frecuentes',
      fConsent: 'Quiero recibir de vez en cuando novedades de la escuela (nuevas fechas, ofertas). Opcional.',
      fPrivacy: 'Usamos tu nombre, email y mensaje para responder a tu consulta y los guardamos dos años. Más información:',
      faqMore: 'Ver todas las preguntas frecuentes',
      h1: 'Ven a surfear con Coco Surf School',
      faq: [
        { q: '¿Dónde tienen lugar las clases de surf?', a: 'Coco Surf School es una escuela móvil entre Hossegor y Seignosse: el mejor spot para tu nivel se elige según las condiciones. En verano la escuela está en Seignosse, Les Bourdaines.' },
        { q: '¿Cuántas personas hay por clase?', a: 'Calidad antes que cantidad: máximo 6 personas por monitor (8 a petición), para más coaching y una progresión más rápida.' },
        { q: '¿Está incluido el material?', a: 'Sí, la tabla y el neopreno están incluidos en cada clase. Cada clase dura 1h30.' },
        { q: '¿Cómo reservo y pago?', a: 'Se pide un anticipo del 30 % al reservar. El pago se hace por transferencia bancaria o en efectivo.' },
        { q: '¿Necesito saber surfear ya?', a: 'No. Annelies acoge tanto a principiantes como a surfistas que quieren mejorar.' },
      ],
    },
    hossegor: {
      title: 'Clases de surf en Hossegor — Coco Surf School | Todos los niveles', desc: 'Clases de surf en Hossegor con Coco Surf School. Grupos pequeños (máx. 6), tabla &amp; neopreno incluidos, coaches diplomadas.', h1: 'Clases de surf en Hossegor', crumb: 'Surf en Hossegor', ogImage: 'owner-hossegor.jpg',
      eyebrow: 'Landes · Francia', h1html: 'Clases de surf en <em>Hossegor</em>', lead: '¡Ven a surfear con nosotros en Hossegor! Aprende a surfear en una de las ciudades surferas más reconocidas de Europa. Grupos pequeños de 6 máximo en la fórmula deluxe, tabla y neopreno incluidos, con coaches diplomadas.', cta1: 'Reservar una clase', cta2: 'Ver tarifas', img: 'owner-hossegor.jpg', imgAlt: 'Surfistas en una playa de Hossegor',
      body: '<p class="lead">Hossegor es el corazón del surf en las Landes, una referencia de los beach breaks en Europa. Coco Surf School es una escuela móvil entre Hossegor y Seignosse: elegimos el mejor spot según tu nivel y las condiciones del día.</p><h2>¿Por qué aprender en Hossegor?</h2><ul class="ticks"><li>Beach breaks atlánticos adaptados a todos los niveles, desde la espuma para empezar hasta picos más potentes.</li><li>Una ciudad volcada en el surf, ideal para una estancia con los pies en el agua.</li><li>Amplias playas de arena a un paso del océano.</li></ul><h2>Clases para todos los niveles</h2><p>¿Nunca has surfeado o quieres perfeccionarte? Cada sesión se adapta a ti. Las clases duran 1h30, tabla y neopreno incluidos, en grupos de 6 máximo (8 a petición).</p><h2>Bueno saberlo</h2><p>El mejor spot — Hossegor, Seignosse o Capbreton — se elige según la marea y las condiciones de las olas. En verano la escuela está en Seignosse, Les Bourdaines.</p>',
      aside: { h: 'Reservar en Hossegor', p: 'Grupos pequeños · todos los niveles · material incluido.', b1: 'Reservar una clase', b2: 'WhatsApp' },
    },
    seignosse: {
      title: 'Clases de surf en Seignosse — Coco Surf School | Les Bourdaines', desc: 'Clases de surf en Seignosse (Les Bourdaines) con Coco Surf School. Olas suaves para empezar, grupos pequeños (máx. 6), material incluido.', h1: 'Clases de surf en Seignosse', crumb: 'Surf en Seignosse', ogImage: 'a29fce_571dd78100a24c038429f1bfaf22b936.jpg',
      eyebrow: 'Landes · Francia', h1html: 'Clases de surf en <em>Seignosse</em>', lead: 'Nuestro campamento de verano en Les Bourdaines: beach breaks agradables, suaves y de arena, perfectos para aprender. Grupos pequeños de 6 máximo, tabla y neopreno incluidos.', cta1: 'Reservar una clase', cta2: 'Ver tarifas', img: 'a29fce_571dd78100a24c038429f1bfaf22b936.jpg', imgAlt: 'La playa de Les Bourdaines en Seignosse',
      body: '<p class="lead">Seignosse, justo al norte de Hossegor, ofrece algunas de las playas más acogedoras de las Landes. En verano, Coco Surf School está en Les Bourdaines — una amplia playa de arena donde la espuma es ideal para tus primeras olas.</p><h2>¿Por qué aprender en Seignosse?</h2><ul class="ticks"><li>Beach breaks de arena en Les Bourdaines, suaves para principiantes e intermedios.</li><li>Un entorno más tranquilo y natural que las playas de ciudad.</li><li>El campamento de verano de la escuela: clases fáciles de organizar.</li></ul><h2>Clases para todos los niveles</h2><p>Desde tus primeras olas en la espuma hasta tus primeros take-offs en la ola verde, cada sesión se adapta a ti. Las clases duran 1h30, tabla y neopreno incluidos, en grupos pequeños de 6 máximo. Por supuesto, también se puede surfear en grupo más grande.</p><h2>Bueno saberlo</h2><p>Escuela móvil entre Seignosse, Hossegor y Capbreton: elegimos el mejor spot según tu nivel y las condiciones del día.</p>',
      aside: { h: 'Reservar en Seignosse', p: 'Grupos pequeños · todos los niveles · material incluido.', b1: 'Reservar una clase', b2: 'WhatsApp' },
    },
    team: {
      title: 'Team building de surf en las Landes — Coco Surf School', desc: 'Team building de surf en Hossegor &amp; Seignosse. Una salida entre compañeros: espíritu de equipo, antiestrés y sonrisas garantizadas. Tarifas a petición.', h1: 'Team building', crumb: 'Team building', ogImage: 'owner-team-new.jpg',
      eyebrow: 'Empresas · Landes', h1html: 'Surf <em>team building</em>', lead: '¡Id a surfear con vuestros compañeros! Espíritu de equipo, antiestrés, sonrisas y diversión garantizadas — una jornada deportiva en el océano en Seignosse, Hossegor o Capbreton.', cta1: 'Pedir presupuesto', cta2: 'Ver tarifas', img: 'owner-team-new.jpg', imgAlt: 'Compañeros de trabajo van al océano con sus tablas',
      body: '<p class="lead">¿Os apetece una actividad de equipo diferente en las Landes? Llevad a vuestro equipo a surfear. Un reto compartido en el océano es una de las formas más bonitas de crear vínculos — y todos salen del agua con una sonrisa.</p><h2>¿Por qué surfear en equipo?</h2><ul class="ticks"><li><strong>Espíritu de equipo</strong> — una primera experiencia compartida en la que os animáis mutuamente.</li><li><strong>Antiestrés</strong> — nada despeja la mente como el océano y el aire libre.</li><li><strong>Accesible para todos</strong> — no se requiere experiencia, diversión garantizada.</li></ul><h2>Cómo funciona</h2><p>Las sesiones están dirigidas por Annelies, coach diplomada, tabla y neopreno incluidos. Podemos gestionar grupos grandes de hasta 32 personas a la vez. Adaptamos el formato a vuestro grupo y elegimos la mejor playa entre Seignosse, Hossegor y Capbreton. Tarifas a petición.</p>',
      aside: { h: 'Organizad vuestra jornada', p: 'Decidnos el tamaño del grupo y vuestras fechas — presupuesto a medida.', b1: 'Pedir presupuesto', b2: 'WhatsApp' },
    },
    learn: {
      title: 'Aprender a surfear — Clases para principiantes en Hossegor &amp; Seignosse', desc: '¿Nunca has surfeado? Aprende a surfear con Coco Surf School. Cómo es tu primera clase, qué está incluido y cómo progresas.', h1: 'Aprender a surfear', crumb: 'Aprender a surfear', ogImage: 'a29fce_4b942950b2834ef2ad4e3191df3d547a.jpg',
      eyebrow: 'Para principiantes', h1html: 'Aprender a <em>surfear</em>', lead: '¿Nunca has surfeado? Sin problema. Esto es exactamente cómo transcurre tu primera clase, qué está incluido y a qué velocidad progresas.', cta1: 'Reserva tu primera clase', cta2: 'Ver tarifas', img: 'a29fce_4b942950b2834ef2ad4e3191df3d547a.jpg', imgAlt: 'Alumnos aprendiendo a surfear en la espuma',
      body: '<p class="lead">Surfear es una de las mejores sensaciones que existen — y no necesitas experiencia para empezar. En Coco Surf School aprendes en un grupo pequeño de 6 máximo, para que el coach te acompañe desde tu primera ola.</p><h2>Tu primera clase, paso a paso</h2><p>Una clase dura 1h30 en el agua — cuenta con ±2 h en total. Empezamos en la playa con un calentamiento y lo básico — tumbarse en la tabla, remar, ponerse de pie. Después entramos en la espuma (las olas ya rotas, cerca de la orilla), el lugar más seguro y fácil para tus primeros deslizamientos. La mayoría de los principiantes se ponen de pie durante las primeras clases.</p><h2>Qué está incluido</h2><ul class="ticks"><li>Tabla y neopreno — siempre incluidos.</li><li>Una coach diplomada, en un grupo de 6 máximo (8 a petición).</li><li>La playa más adecuada para principiantes, elegida según las condiciones del día.</li></ul><h2>Qué traer</h2><p>Un bañador bajo el neopreno, una toalla, crema solar y agua. Del resto nos ocupamos nosotros.</p><h2>¿A qué velocidad se progresa?</h2><p>Grupos pequeños = más coaching y una progresión más rápida. Un <strong>pequeño surf trip (3 clases)</strong> o un <strong>curso de 5 días</strong> te ayuda a despegar de verdad.</p>',
      aside: { h: 'Tu primera clase', p: 'Grupos pequeños · todos los niveles · material incluido · 1h30.', b1: 'Reservar una clase', b2: 'WhatsApp' },
    },
    faq: {
      title: 'Aprender a surfear — preguntas frecuentes | Coco Surf School', desc: '¿Hay que saber nadar? ¿Desde qué edad? ¿Cuántas clases hacen falta? Annelies responde a las preguntas que se hacen los principiantes antes de su primera clase de surf.', h1: 'Preguntas frecuentes', crumb: 'Preguntas frecuentes',
      eyebrow: 'Te preguntas…', h1html: 'Las preguntas que <em>todo el mundo</em> hace', lead: 'Las respuestas son de Annelies, tal como las explica por teléfono. Si tu pregunta no está aquí, escríbenos sin problema.',
      cta1: 'Reservar una clase', cta2: 'Ver las tarifas',
      outro: '¿Otra pregunta? Escríbenos, siempre respondemos.',
      faq: [
        { g: 'Antes de empezar', q: '¿Hay que saber nadar para dar una clase de surf?', a: 'Los adultos sí: hay que saber nadar. Para los más pequeños, de 5 a 9 años, no hace falta — a esa edad nos quedamos en la espuma cerca de la orilla y nunca vamos a aguas profundas.' },
        { g: 'Antes de empezar', q: '¿A partir de qué edad pueden participar los niños?', a: 'A partir de los 5 o 6 años, según las ganas que tenga el niño de participar y según su desarrollo. Cada niño es diferente.' },
        { g: 'Antes de empezar', q: '¿Soy demasiado mayor para aprender a surfear?', a: 'Nunca se es demasiado mayor para aprender a surfear. Muchos de mis alumnos empiezan después de los 40 o los 50 y se lo pasan como nunca. No hay que dudarlo: con una buena guía nos divertimos muchísimo. No se trata de ser el mejor, se trata de disfrutar — como decimos, the best surfer is the one having the most fun. Surfistas de 5 a 120 años bienvenidos.' },
        { g: 'Antes de empezar', q: '¿Cómo puedo prepararme antes de mis clases de surf?', a: 'Cuanto mejor sea tu forma física, más fácil resulta aprender. Puedes prepararte entrenando antes en un gimnasio con un entrenador personal, o simplemente nadando con regularidad antes de venir.' },
        { g: 'Tu clase', q: '¿Cuántas clases hacen falta para ponerse de pie en una ola?', a: 'Recomendamos un mínimo de 3 clases para levantarse con regularidad en la espuma, y un curso de 5 días si de verdad quieres dominarlo — con la posibilidad, al final del curso, de surfear tu primera ola sin romper.' },
        { g: 'Tu clase', q: '¿Qué hay que llevar a una clase de surf?', a: 'Tu bañador, crema solar, agua y tus good vibes. La tabla y el neopreno los ponemos nosotros.' },
        { g: 'Tu clase', q: '¿Qué pasa si hace mal tiempo o el mar está muy movido?', a: 'Con mal tiempo las clases se dan igual: de todos modos te vas a mojar, y la lluvia no es problema. Si las olas son demasiado grandes — bandera roja — la clase se traslada a otro día, o se devuelve el importe si no es posible cambiarla.' },
        { g: 'Dónde y cuándo', q: '¿Cuál es la mejor época para aprender a surfear en las Landas?', a: 'Los meses de verano son los más cálidos, con olas pequeñas y agradables y agua templada. Mayo, junio y septiembre también son muy buenos. En abril y noviembre se puede surfear perfectamente, pero el agua está más fresca y las temperaturas son menos previsibles.' },
        { g: 'Dónde y cuándo', q: '¿Cuándo está abierta la escuela de surf?', a: 'Damos clases de abril a noviembre, todos los días de la semana. Los horarios dependen de la marea, del estado del mar y de tu nivel, así que se acuerdan contigo al reservar.' },
        { g: 'Dónde y cuándo', q: '¿Por qué Les Bourdaines, en Seignosse, es tan buena para principiantes?', a: 'Les Bourdaines es una playa con un banco de arena suave y olas de espuma largas — justo lo que hace falta para aprender a surfear con total seguridad. Para tus primeras olas no pasas de la altura de la cadera, y no hay rocas. Además es una playa excelente para surfistas con experiencia: hay para todos los niveles.' },
        { g: 'Dónde y cuándo', q: '¿Qué diferencia hay entre Hossegor y Seignosse para quien empieza?', a: 'Seignosse tiene más playas, así que a menudo hay más sitio para surfear. Hossegor es excelente los días en que las olas de Seignosse son demasiado grandes: una de sus playas recibe entonces olas más pequeñas, y esos días quedamos allí. Esa es la ventaja de ser una escuela de surf itinerante.' },
      ],
    },
    legal: {
      title: 'Aviso legal — Coco Surf School', desc: 'Aviso legal de coco-surfschool.com: titular, número SIRET, alojamiento y condiciones de uso.', h1: 'Aviso legal', crumb: 'Aviso legal',
      eyebrow: 'Información legal', h1html: 'Aviso <em>legal</em>', lead: 'Quién edita esta web y cómo contactarnos.',
      idTitle: 'Titular de la web',
      rowLabels: { publisher: 'Titular', status: 'Forma jurídica', address: 'Dirección', siret: 'SIRET', ape: 'Código APE / NAF', vat: 'IVA', registered: 'Alta', director: 'Responsable de la publicación', phone: 'Teléfono', email: 'Email', host: 'Alojamiento' },
      statusText: 'Empresaria individual — auto-entrepreneur, profesión liberal (Francia)',
      apeText: 'Enseñanza de disciplinas deportivas y actividades de ocio',
      vatText: 'IVA no aplicable, artículo 293 B del Código general de impuestos francés',
      body: `<h2>Actividad regulada</h2>
<p>Enseñar surf a cambio de una remuneración es una actividad regulada en Francia. Annelies Debo ejerce con una carte professionnelle d’éducateur sportif (surf) y cuenta con el certificado de primeros auxilios PSE1, además de un máster en Educación Física y una cualificación ISA de entrenadora de surf. El detalle está en la página <a href="{coach}">Coach</a>.</p>
<h2>Propiedad intelectual</h2>
<p>Todo el contenido de esta web — textos, fotografías, logotipo y elementos gráficos — pertenece a Coco Surf School, salvo indicación en contrario. Queda prohibida su reproducción o reutilización, total o parcial, sin autorización previa por escrito.</p>
<h2>Datos personales</h2>
<p>Lo que nos envías a través del formulario de contacto se trata como se describe en nuestra <a href="{privacy}">política de privacidad</a>.</p>
<h2>Reclamaciones</h2>
<p>Si algo no va bien, escríbenos primero: siempre buscamos una solución amistosa. Puedes contactarnos por email o por teléfono desde la página <a href="{contact}">Contacto</a>.</p>
<h2>Créditos</h2>
<p>Horarios de marea: Stormglass. Meteorología y oleaje: Open-Meteo. Fotografías: Coco Surf School.</p>`,
      updated: 'Última actualización: 21 de agosto de 2026.',
    },
    privacy: {
      title: 'Política de privacidad — Coco Surf School', desc: 'Qué pasa con tu mensaje: qué datos recogemos, cuánto tiempo los guardamos, qué proveedores intervienen y cuáles son tus derechos. Esta web no usa cookies.', h1: 'Política de privacidad', crumb: 'Privacidad',
      eyebrow: 'Tus datos', h1html: 'Política de <em>privacidad</em>', lead: 'Esta web no usa cookies y no te rastrea. Aquí tienes, en lenguaje claro, qué ocurre con lo que nos escribes.',
      body: `<h2>¿Quién es responsable de tus datos?</h2>
<p>Annelies Debo, bajo el nombre comercial Coco Surf School, 47 E avenue de la Marquèze, 40510 Seignosse, Francia. ¿Dudas? <a href="mailto:cocobosurfschool@gmail.com">cocobosurfschool@gmail.com</a>. Los datos completos están en el <a href="{legal}">aviso legal</a>.</p>
<h2>¿Qué datos recogemos?</h2>
<p>Únicamente lo que escribes tú mismo en el formulario de contacto: tu nombre, tu dirección de email y tu mensaje. Nada más. En esta web no hay cuenta, ni perfil, ni seguimiento publicitario.</p>
<h2>¿Para qué, y con qué base jurídica?</h2>
<ul class="ticks">
<li><strong>Para responder a tu consulta</strong> y preparar tu reserva — base jurídica: medidas precontractuales adoptadas a petición tuya (RGPD art. 6.1.b).</li>
<li><strong>Para enviarte de vez en cuando novedades de la escuela</strong>, como nuevas fechas o una oferta — solo si has marcado la casilla correspondiente. Base jurídica: tu consentimiento (RGPD art. 6.1.a). Puedes retirarlo en cualquier momento, simplemente respondiendo a uno de nuestros emails.</li>
</ul>
<h2>¿Cuánto tiempo los guardamos?</h2>
<p><strong>Dos años</strong> desde nuestro último contacto. Pasado ese plazo, tu mensaje y tus datos se eliminan. Si te has apuntado a las novedades de la escuela, conservamos tu dirección hasta que te des de baja.</p>
<h2>¿Quién más los ve?</h2>
<p>Dos proveedores técnicos, y nadie más. Tus datos no se venden, ni se alquilan, ni se intercambian.</p>
<ul class="ticks">
<li><strong>Resend</strong> entrega el mensaje del formulario en nuestro buzón. Está establecido en Estados Unidos; la transferencia se ampara en las cláusulas contractuales tipo de la Comisión Europea.</li>
<li><strong>Cloudflare</strong> aloja y sirve la web. Cloudflare trata tu dirección IP por seguridad del sitio y protección frente a abusos.</li>
</ul>
<h2>El surf report de la portada</h2>
<p>La portada muestra las condiciones del día en Les Bourdaines. Tu navegador pide esos datos directamente a <strong>Open-Meteo</strong>, lo que hace que tu dirección IP llegue a ese servicio. Open-Meteo no usa cookies ni construye ningún perfil de visitante. Los horarios de marea, en cambio, están precargados en nuestro propio servidor y no implican ninguna llamada externa.</p>
<h2>Cookies</h2>
<p>Esta web no instala <strong>ninguna cookie</strong>, no usa almacenamiento local y no incorpora herramientas de analítica, píxeles publicitarios ni contenido incrustado de terceros. Por eso tampoco se te pide aceptar ningún banner de consentimiento.</p>
<h2>Tus derechos</h2>
<p>Tienes derecho de acceso, rectificación, supresión, limitación, oposición y portabilidad, y puedes retirar tu consentimiento en cualquier momento. Escribe a <a href="mailto:cocobosurfschool@gmail.com">cocobosurfschool@gmail.com</a>: respondemos en el plazo de un mes.</p>
<p>Si nuestra respuesta no te satisface, puedes reclamar ante la autoridad francesa de protección de datos, la CNIL, 3 place de Fontenoy, TSA 80715, 75334 Paris Cedex 07 — <a href="https://www.cnil.fr" target="_blank" rel="noopener">cnil.fr</a> — o ante la autoridad de tu propio país.</p>`,
      updated: 'Última actualización: 21 de agosto de 2026.',
    },
    book: {
      title: 'Reservar una clase de surf — Coco Surf School', desc: 'Reserva tu clase de surf online en Coco Surf School: elige una sesión, el número de personas y tu formula.', h1: 'Reservar una clase', crumb: 'Reservar',
      eyebrow: 'Reserva online', h1html: 'Reserva tu <em>clase de surf</em>', lead: 'Elige una sesión a continuación y completa tus datos. Se requiere un depósito del 30 % para confirmar tu reserva.',
      fSessionH: 'Elige una sesión', fParty: 'Número de personas', fPack: 'Número de clases', fName: 'Nombre completo', fEmail: 'Email', fPhone: 'Teléfono', fLang: 'Idioma preferido',
      fConsent: 'Me gustaría recibir información sobre mis clases y ofertas por email', fRemarks: 'Comentarios (opcional)', fSubmit: 'Reservar ahora', fSending: 'Enviando…',
      fOk: '¡Gracias! Tu reserva está confirmada.', fErr: 'Algo salió mal. Inténtalo de nuevo o contáctanos directamente.', fEmpty: 'No hay sesiones disponibles en este momento.',
      deposit: 'Se requiere un depósito del 30 % para confirmar tu reserva. Pago por transferencia bancaria o en efectivo.',
    },
  },
};
