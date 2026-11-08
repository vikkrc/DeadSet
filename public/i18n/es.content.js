// Español: contenido del juego (roles, sueños, cartas de regla, modos, cartas de escenario, guía).
export default {
  and: 'y',
  numbers: ['ningún', 'un', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez'],
  roles: {
    CULT_LEADER: { name: "Líder de la Secta", when: "Cada noche", summary: "Cada noche, recluta a un jugador para la Secta. La Secta gana cuando supera en número a todos los demás.", detail: "Un recluta conserva su rol y sus poderes, pero ahora gana con la Secta y descubre quiénes son los demás miembros. Los jugadores del bando de la Muerte, el Destripador y los jugadores protegidos no pueden ser reclutados. Si el Líder muere, nadie más puede reclutar." },
    RIPPER: { name: "El Destripador", when: "Cada noche", summary: "Mata a un jugador cada noche, en solitario. Ganas si eres el último en pie, o si quedas solo con otro jugador que no es un asesino.", detail: "Tu asesinato lo detienen las mismas protecciones que el de la Muerte (Guardián, Ángel de la guarda, Bendición de la Bruja, resurrección temporal). La Muerte no puede matarte de noche, salvo bajo una Luna de sangre. Apareces como NO ALINEADO CON LA MUERTE." },
    DEATH: { name: 'La Muerte', when: 'Cada noche', summary: 'Poneos de acuerdo con todos los compañeros Muerte vivos en un único asesinato compartido cada noche.', detail: 'Todos los jugadores Muerte activos deben confirmar exactamente los mismos objetivos o la facción pasa. La capacidad base es un asesinato; Doble Peligro, Turno de Noche o Sobrecarga pueden subirla hasta un máximo de dos — nunca un asesinato por cada jugador Muerte.' },
    INNOCENT: { name: 'Inocente', when: 'Día', summary: 'Sin poder. Tu voz y tu voto son tu arma.', detail: 'Argumenta, acusa y vota. Igualmente recibes un Sueño cada noche y pueden afectarte estados.' },
    MENTALIST: { name: 'Mentalista', when: 'Cada noche', summary: 'Lee a otro jugador: ¿está del lado de la Muerte o no?', detail: 'Solo averiguas la lealtad actual del objetivo (DEL LADO DE LA MUERTE / NO DEL LADO DE LA MUERTE), nunca su rol exacto. Una lectura bloqueada no devuelve nada.' },
    GUARDIAN: { name: 'Guardián', when: 'Cada noche', summary: 'Protege a un jugador (tú incluido) de la Muerte y del Psicópata.', detail: 'Solo detiene el asesinato de la facción Muerte y el estado del Psicópata. No bombas, Justiciero, Chivo expiatorio, destinos ligados ni expiración. Puedes repetir objetivo.' },
    PSYCHO: { name: 'Psicópata', when: 'Una vez por partida, de noche', summary: 'Una vez: deja mudo a alguien o quítale el voto para el día siguiente.', detail: 'MUDO: no puede hablar en la discusión, pero sí nominar y votar. SIN VOTO: puede hablar pero no votar. El Guardián, el Ángel de la guarda y la Bendición de la Bruja lo bloquean. La carga se gasta aunque se bloquee.' },
    WHORE: { name: 'Ramera', alias: 'Acompañante', when: 'Cada noche', summary: 'Visita a alguien. Si visitas a una Muerte, falla el asesinato de todo su equipo.', detail: 'Si la persona visitada es una Muerte activa, la capacidad de asesinato de la facción baja a 0. Si la persona visitada muere a manos de la Muerte, mueres con ella; si la vuelan, te alcanza la explosión.' },
    TRAVELING_AGENT: { name: 'Viajante', when: 'Cada noche', summary: 'Entrega un producto misterioso. Pura ambientación — y una tarjeta de visita.', detail: 'Al amanecer, el destinatario sabe que un Viajante lo visitó. El producto no tiene efecto, pero la visita en sí es información que ambos podéis usar.' },
    TERRORIST: { name: 'Terrorista', when: 'Cada noche', summary: 'Coloca una bomba en una puerta. Cincuenta por ciento de que estalle.', detail: 'El servidor lanza una moneda justa. Si sale SÍ, el objetivo muere, y cualquier Ramera que lo visite muere en la explosión. El Guardián no detiene una bomba; el Ángel de la guarda, la Bendición y la resurrección temporal sí.' },
    MIMIC: { name: 'Imitador', when: 'Solo la noche 1 (obligatorio)', summary: 'La noche 1, conviértete en una copia permanente del rol de otro.', detail: 'Tomas el rol y la lealtad del objetivo con cargas nuevas. Los poderes copiados funcionan desde la noche 2; una Muerte copiada se une al equipo desde la noche 2. Copiar a un Imitador — o no elegir — te deja como Imitador sin poder el resto de la partida.' },
    DOUBLE_AGENT: { name: 'Agente doble', when: 'Solo la noche 1 (obligatorio)', summary: 'La noche 1, elige en secreto tu bando para el resto de la partida.', detail: 'Elige MUERTE o NO-MUERTE. Si eliges la Muerte, cambias al final de la noche 1; desde la noche 2 entras en la sala del equipo Muerte y compartes su único asesinato. Si no eliges, sigues en el bando no-Muerte.' },
    DIPLOMAT: { name: 'Diplomático', when: 'Una vez por partida, de día (antes de las nominaciones)', summary: 'Una vez: declárate inmune a la condena durante un día.', detail: 'Se declara en público durante la ventana de la mañana. Ese día nadie puede nominarte. No protege de asesinatos nocturnos, bombas, Justiciero ni Chivo expiatorio.' },
    SCAPEGOAT: { name: 'Chivo expiatorio', when: 'Pasivo, día', summary: 'Si un día termina sin condenado, mueres tú en su lugar.', detail: 'Empate, sin nominaciones, sin votos, Regla de mayoría fallida o anulación del Apostador: todo cuenta como «sin condena». Es un asesinato, no una condena. Solo muere un Chivo expiatorio (el de asiento más bajo) por día.' },
    NECROMANCER: { name: 'Nigromante', when: 'Una vez por partida, de noche', summary: 'Una vez: alza a un jugador eliminado durante un día y una noche.', detail: 'El retornado conserva su rol y lealtad, es inmune a todo asesinato mientras dura la resurrección y desaparece tras la noche siguiente. Debes sobrevivir a la noche para que el ritual funcione. Cada jugador solo puede ser resucitado una vez.' },
    CONSPIRATOR: { name: 'Conspirador', when: 'Voto pasivo de día, chat nocturno', summary: 'Tu voto cuenta +1. De noche, abre un susurro privado con un jugador.', detail: 'Tu papeleta lleva un peso extra sobre el mismo candidato. Cada noche puedes abrir un breve canal de texto entre dos con un jugador vivo; por sí solo no revela roles.' },
    MAGISTRATE: { name: 'Magistrado', when: 'Pasivo, día', summary: 'Tu voto pesa 2 (3 con Paranoia).', detail: 'Una papeleta, un candidato, doble peso. Un «Sin voto» del Psicópata lo reduce a cero.' },
    ORACLE: { name: 'Oráculo', when: 'Una vez por partida, de noche', summary: 'Una vez: adivina a quién golpeará la Muerte esta noche. Si aciertas, vive.', detail: 'Si tu predicción está entre los objetivos confirmados de la facción Muerte, ese jugador queda protegido de un asesinato de la Muerte. Un fallo o un pase de la Muerte no dan nada.' },
    GAMBLER: { name: 'Apostador', when: 'Una vez por partida, de noche', summary: 'Una vez: apuesta por el primer nominado de mañana. Si ganas, nadie cuelga.', detail: 'Si la primera nominación oficial del día siguiente coincide con tu apuesta, la condena de ese día se anula antes del recuento. Un Chivo expiatorio aún puede morir por la falta de condena.' },
    VIGILANTE: { name: 'Justiciero', when: 'Una vez por partida, de día (antes de las nominaciones)', summary: 'Una vez: dispara a un jugador por la mañana, sin votación.', detail: 'Un asesinato de rol, no una condena. La inmunidad del Diplomático no lo detiene. La victoria se comprueba justo después.' },
    JESTER: { name: 'Bufón', when: 'Independiente', summary: 'Ganas solo — únicamente si el pueblo vota tu condena.', detail: 'Morir de otra forma (asesinato nocturno, bomba, Justiciero, Chivo expiatorio) no cuenta. Sobrevivir hasta el final tampoco gana. Cuentas como «otro» jugador frente a la mayoría de la Muerte.' },
    BODYGUARD: { name: 'Guardaespaldas', when: 'Cada noche', summary: 'Quédate junto a alguien. Si la Muerte viene por él, recibes tú la hoja.', detail: 'Si tu protegido fuera a morir por el asesinato de la Muerte y nada más lo salva, mueres en su lugar. No puedes protegerte a ti mismo, ni detener bombas o muertes ligadas, y como mucho interceptas un asesinato por noche.' },
    BARD: { name: 'Bardo', when: 'Una vez por partida, de noche', summary: 'Una vez: silencia la noche. Todos los poderes de rol fallan, incluido el de la Muerte.', detail: 'Todas las habilidades de rol activas de esa noche quedan anuladas. Los Sueños, las expiraciones y las reglas siguen aplicándose. Una Parálisis del sueño sobre el Bardo impide el silencio.' },
    WITCH: { name: 'Bruja', when: 'Cada noche', summary: 'Bendice a un jugador contra el daño o maldice su próxima acción para que fracase.', detail: 'Bendición: protege esta noche de acciones de rol dañinas y de bombas (no de destinos ligados). Maldición: la próxima acción de rol dirigida del objetivo fracasa; maldecir a una Muerte activa bloquea el asesinato de la facción. Nunca sobre ti misma.' },
  },
  dreams: {
    SLEEP_PARALYSIS: { name: 'Parálisis del sueño', text: 'No puedes usar tu acción nocturna de rol. Si eres una Muerte activa, se bloquea todo el asesinato de la facción.' },
    PREMONITION: { name: 'Premonición', text: 'Al amanecer averiguas el nombre de un jugador vivo del lado de la Muerte.' },
    WHISPERS: { name: 'Susurros del pasado', text: 'Al amanecer averiguas el rol exacto de un jugador eliminado al azar.' },
    SLEEPWALKING: { name: 'Sonambulismo', text: 'Estás ligado al jugador sentado justo antes que tú. Si muere esta noche, mueres al final de la noche.' },
    DREAM_SNATCHER: { name: 'Ladrón de sueños', text: 'Antes de que se abran las acciones, puedes intercambiar cartas de Sueño con otro jugador vivo.' },
    NIGHT_SHIFT: { name: 'Turno de noche', text: 'Un uso extra de un poder nocturno repetible, sobre un segundo objetivo. Para la Muerte: la capacidad del equipo pasa a 2.' },
    SHARED_NIGHTMARE: { name: 'Pesadilla compartida', text: 'Elige un compañero de sueño. Si muere esta noche, mueres con él.' },
    INSOMNIA: { name: 'Insomnio', text: 'Al amanecer recibes un informe cronológico completo de las acciones de la noche — si sobrevives.' },
    GUARDIAN_ANGEL: { name: 'Ángel de la guarda', text: 'Esta noche eres inmune a la Muerte, al Psicópata, a las bombas, a la Maldición y a las muertes ligadas.' },
  },
  rules: {
    OPEN_BALLOT: { name: "Voto a la vista", text: "Cada voto es público: todos ven quién vota a quién a medida que llegan las papeletas.", enforcement: "Los votos se pueden cambiar hasta que se cierre la votación. Los votos de los fantasmas también son públicos." },
    FOG_OF_WAR: { name: 'Niebla de guerra', text: 'Durante la discusión solo puedes hablar directamente con los jugadores sentados a tu lado.', enforcement: 'En persona, por honor. A distancia, el chat de mesa se sustituye por susurros entre vecinos.' },
    DOUBLE_JEOPARDY: { name: 'Doble Peligro', text: 'La facción Muerte puede matar hasta a dos jugadores cada noche (tope fijo 2).', enforcement: 'Los bloqueos como la visita de una Ramera o la parálisis la siguen reduciendo a 0.' },
    PARANOIA: { name: 'Paranoia', text: 'Cada papeleta viva gana +1 de peso. El Magistrado pesa 3; el Conspirador suma otro +1.', enforcement: 'Las papeletas fantasma siguen pesando 1.' },
    UNRELIABLE_POWER: { name: 'Poder inestable', text: 'Cada acción nocturna de rol tira un d6: 1–3 falla, 4–6 funciona. La Muerte tira una vez por el equipo.', enforcement: 'Un poder de un solo uso fallido se gasta igualmente.' },
    POWER_SURGE: { name: 'Sobrecarga', text: 'Cada noche, un poder repetible elegible al azar gana un uso extra. La Muerte cuenta como una entrada.', enforcement: 'Nunca más de dos usos para nadie; la capacidad de la Muerte tiene tope 2.' },
    EQUAL_EXCHANGE: { name: 'Intercambio justo', text: 'Un jugador del lado de la Muerte condenado por votación puede llevarse consigo a un jugador no-Muerte vivo.', enforcement: 'Los asesinatos nocturnos, los disparos del Justiciero y las muertes ligadas no lo activan.' },
    CURSED_SILENCE: { name: 'Silencio maldito', text: 'Durante la discusión solo puedes hablar cuando se dirigen directamente a ti.', enforcement: 'Por honor. No afecta a nominaciones ni votos.' },
    MAJORITY_RULE: { name: 'Regla de mayoría', text: 'Una condena necesita más de la mitad del peso de todos los votantes vivos con derecho sobre un nominado.', enforcement: 'Las abstenciones y quienes no votan cuentan en el denominador. Las papeletas fantasma nunca cuentan.' },
    HIDDEN_ROLES: { name: 'Roles ocultos', text: 'Los roles de los eliminados nunca se muestran públicamente hasta el final de la partida.', enforcement: 'Ya es lo predeterminado; esta carta lo fija.' },
    VENGEFUL_GHOSTS: { name: 'Fantasmas vengativos', text: 'Cada jugador eliminado puede emitir una papeleta fantasma de peso 1 por día.', enforcement: 'Los fantasmas no pueden nominar, usar poderes ni influir en la Regla de mayoría.' },
  },
  presets: {
    standard: { name: 'Estándar', blurb: 'La experiencia Dead Set tal como se pensó. Diez roles extendidos desde 7 jugadores, un Sueño para todos cada noche, 1–3 cartas de regla.' },
    classic: { name: 'Clásico / Aprender', blurb: 'Para enseñar. Solo roles básicos — los asientos extendidos son Inocentes. Sueños desactivados por defecto, como mucho una regla sencilla.' },
    full: { name: 'Mazo completo / Caos', blurb: 'Los 17 roles extendidos, incluidos Bufón, Bardo y Bruja. Mucho azar, solo para grupos con experiencia.' },
    doomsday: { name: 'Apocalipsis', blurb: 'Estándar, contra el reloj. Si nadie ha ganado al cerrar el último día, gana la Muerte.' },
    custom: { name: 'Personalizado', blurb: 'Elige tú la reserva extendida, los Sueños, las reglas y el reloj — o escribe el mazo exacto. Avisa de configuraciones desequilibradas.' },
  },
  scenario: {
    WHO: ['Viajeros en el tiempo', 'Exploradores espaciales', 'Criaturas míticas', 'Fantasmas de personajes históricos', 'Mutantes', 'Miembros de una sociedad secreta', 'Turistas perdidos', 'Inteligencias artificiales', 'Aldeanos medievales', 'Dobles de famosos', "Artistas de circo retirados", "Fareros", "Chefs rivales", "Nobles exiliados", "Enfermeras del turno de noche", "Buzos de aguas profundas", "Invitados de una boda", "Astrónomos varados", "Bailarines de un baile de máscaras", "Monjes silenciosos"],
    WHERE: ['Un barco que se hunde', 'Un parque de atracciones abandonado', 'Un búnker subterráneo', 'Una mansión encantada', 'Una tundra nevada', "Un faro entre la niebla", "Una estación espacial abandonada", "Un tren nocturno entre montañas", "Una catedral inundada", "Un jardín botánico invadido por la maleza", "Un hotel en un oasis", "Un monasterio remoto", "Un viñedo a la luz de la luna", "Un estudio de cine abandonado", "Un museo de autómatas"],
    WHY: ['Encontrar un tesoro escondido', 'Escapar antes de que se acabe el tiempo', 'Completar un ritual', 'Resolver un asesinato', 'Detener un desastre inminente', "Romper una maldición antigua", "Ganar una fortuna a las cartas", "Proteger a un heredero real", "Encontrar el camino a casa", "Desenmascarar a un traidor", "Sobrevivir hasta el amanecer", "Recuperar una reliquia robada", "Despertar al pueblo dormido", "Descifrar un último mensaje", "Guardar un terrible secreto"],
  },
  products: ['una llave de latón que no abre ninguna cerradura', 'un tarro de arena caliente', 'un billete para un tren que salió ayer', 'una sola pluma negra', 'un reloj de bolsillo que va hacia atrás', 'una carta sellada a tu nombre', 'un frasco de perfume gris', 'una baraja a la que le falta la reina', 'una vela que huele a lluvia', 'una foto de una habitación vacía', 'una caja forrada de terciopelo (vacía)', 'una brújula que te señala a ti'],
  whispers: [
    'Encontraron muerto a Bo. Nadie vio salir a la Ramera.',
    'El pueblo ahorcó al Bufón. Se rio.',
    'La Mentalista lo sabía. Nadie la creyó.',
    'Faltaron dos votos. Pagó el Chivo expiatorio.',
    'Fay juró que era el Guardián. Gus también.',
    'El Nigromante resucitó al amigo equivocado.',
    'Una bomba en la puerta. Una moneda, al aire.',
    'Todos despertaron. De algún modo, fue peor.',
    'La Muerte votó con el pueblo. Cómo no.',
  ],
  guide: {
    sidesH: "Otros bandos y giros",
    sides: `<p>Opcionales, se activan en la sala (o se añaden con los contadores de roles en partidas personalizadas). El pueblo solo gana cuando la Muerte, la Secta y el Destripador han desaparecido.</p>
<ul>
<li><b>Enamorados:</b> dos jugadores al azar, de cualquier bando, se enamoran. Cada uno conoce el nombre del otro. Si uno muere, el otro muere de pena. Si son los dos últimos vivos, ganan juntos.</li>
<li><b>La Secta:</b> un Líder de la Secta recluta a un jugador cada noche. Los reclutas conservan su rol pero ganan con la Secta, que gana cuando supera en número a todos los demás. La Muerte, el Destripador y los jugadores protegidos no pueden ser reclutados.</li>
<li><b>El Destripador:</b> un asesino solitario que ataca cada noche. La Muerte no puede matarlo de noche (salvo bajo una Luna de sangre). Gana si es el último en pie, o si queda solo con un jugador que no es un asesino.</li>
<li><b>Pistas</b> (activadas por defecto, raras): algunos amaneceres, uno o dos jugadores fuera del equipo de la Muerte reciben una pista verdadera, como «A o B camina con la Muerte».</li>
<li><b>Desempate a cara o cruz</b> (opcional): un empate en cabeza se decide a cara o cruz en lugar de perdonar a todos.</li>
<li><b>Voto a la vista</b> (una carta de regla): cada voto es público en cuanto se emite.</li>
</ul>`,
    kicker: 'Las reglas, v1.0',
    title: 'Cómo<br><i>jugar.</i>',
    intro: 'La mayoría queréis sobrevivir. Unos pocos sois la Muerte. Nadie sabe quién es quién — salvo la Muerte, que conoce a los suyos.',
    toc: ['Básico', 'Una ronda', 'Victoria', 'Roles básicos', 'Roles extendidos', 'Mazo completo', 'Sueños', 'Cartas de regla', 'Modos', 'Orden nocturno', 'Móviles'],
    basicsH: 'Lo básico',
    basics: `<p>Dead Set es un juego de fiesta de deducción social para 5–13 jugadores. Todos entran en la misma sala desde su propio móvil y reciben un <b>rol</b> secreto. La mayoría de los roles pertenecen a la facción <b>no-Muerte</b>; uno o más jugadores son en secreto <b>la Muerte</b>.</p>
<ul>
<li>Los <b>roles</b> duran toda la partida: tu lealtad y tu poder.</li>
<li>Los <b>Sueños</b> son efectos de una noche: desde la noche 1, cada jugador vivo roba uno en secreto cada noche.</li>
<li>Las <b>cartas de regla</b> (1–3, robadas al preparar) retuercen toda la partida — asesinatos dobles, votos ponderados, fantasmas que votan.</li>
<li>El <b>escenario</b> (QUIÉN / DÓNDE / POR QUÉ) es pura narración. Nunca cambia una regla.</li>
</ul>
<p>Puedes decir la verdad sobre tu rol, mentir o callar. Nunca enseñes tu pantalla. La app es el narrador: nadie tiene que quedarse fuera, y el anfitrión no ve más secretos que nadie.</p>`,
    roundH: 'Una ronda',
    round: `<ol>
<li><b>Noche 0 — la revelación.</b> Da la vuelta a tu carta de rol, léela y toca <em>Entendido</em>. No pasa nada más: ni asesinatos, ni Sueños, ni poderes. Los jugadores Muerte ven a sus compañeros.</li>
<li><b>Mañana.</b> Se leen las noticias del amanecer: quién murió en la noche (nunca cómo, nunca su rol). Lo que hayas averiguado en privado aparece en <em>Solo tú lo sabes</em>. Un Diplomático puede declarar inmunidad aquí; un Justiciero puede disparar.</li>
<li><b>Discusión y nominaciones.</b> Hablad. Cada jugador vivo puede hacer <b>una nominación formal</b> por día. Nominar a alguien ya nominado solo la secunda.</li>
<li><b>Defensa.</b> Cada nominado, por orden de nominación, toma la palabra.</li>
<li><b>Votación secreta.</b> Cada jugador vivo con derecho vota a un nominado o se abstiene, en su propio móvil. Puedes cambiar el voto hasta que el anfitrión lo cierre. Solo se publican los totales.</li>
<li><b>Condena.</b> El único total más alto es condenado (eliminado). <b>Un empate en cabeza no condena a nadie.</b> Como mucho se condena a una persona por día.</li>
<li><b>Noche.</b> Las pantallas se oscurecen. Con Sueños, el anochecer dura quince segundos (cinco sin ellos): todos descubren su Sueño y los Ladrones de sueños pueden intercambiar. A quien le roban el Sueño lo ve. Luego las acciones nocturnas se abren solas. Quien tenga un poder nocturno lo envía en secreto; la Muerte acuerda su asesinato. Cuando todos duermen — o se acaba el tiempo —, el servidor resuelve todas las acciones a la vez y amanece el día siguiente.</li>
</ol>
<p class="small">Lo que no envíes antes de que cierre una ventana se convierte en pase (o abstención). Un móvil desconectado conserva su asiento y sus secretos.</p>`,
    winH: 'Victoria',
    win: `<ul>
<li>Los <b>no-Muerte ganan</b> en cuanto no queda vivo ningún jugador del lado de la Muerte.</li>
<li><b>La Muerte gana</b> en cuanto los vivos del lado de la Muerte <b>superan estrictamente</b> a todos los demás vivos. La igualdad no basta.</li>
<li>El <b>Bufón</b> (solo Mazo completo) gana solo, al instante, si el pueblo lo condena por votación.</li>
<li>Si una noche no deja a nadie vivo, la partida es un <b>empate</b>.</li>
<li>Con el <b>Reloj del Apocalipsis</b>, la Muerte también gana si nadie ha ganado al cerrar el último día.</li>
<li><b>Luna de sangre</b> (activada por defecto): tras dos noches seguidas sin muertes, la noche siguiente ninguna protección resiste y nada puede bloquear el asesinato de la Muerte. Acaba con los bloqueos, como un Guardián solitario que se protege una y otra vez frente a una Muerte solitaria.</li>
<li><b>La Muerte gana entre los dos últimos</b> (opcional): si una Muerte está entre los dos últimos vivos, la Muerte gana al instante.</li>
</ul>
<p>La victoria se comprueba tras cada resolución completa — nunca a mitad de una noche.</p>`,
    coreH: 'Roles básicos',
    coreP: 'Siempre en juego.',
    killH: 'Cómo mata el equipo de la Muerte',
    kill: 'Todos los compañeros Muerte vivos comparten una sala. Cada uno propone objetivos; el asesinato solo ocurre si <b>todos confirman exactamente la misma selección</b>. Ante cualquier desacuerdo o confirmación pendiente, la Muerte pasa. El equipo mata a <b>un</b> jugador por noche sin importar cuántas Muertes haya — dos con Doble Peligro, Turno de noche o Sobrecarga, y nunca más de dos.',
    extH: 'Roles extendidos — Estándar',
    extP: 'Desde 7 jugadores, los asientos extra se llenan con esta reserva (robados en secreto). 7 jugadores → 1 asiento extendido, 10 → 2, 11+ → 3.',
    fullH: 'Añadidos del Mazo completo',
    fullP: 'Solo en Mazo completo / Caos o Personalizado. Grupos con experiencia.',
    dreamsH: 'Sueños',
    dreamsP: 'Desde la noche 1, cada jugador vivo roba al azar una carta de Sueño cada noche (puede repetirse). Dura solo esa noche. Puedes describir el tuyo — con la verdad o no.',
    dreamsNote: `Algunos Sueños son más raros que otros, y el Insomnio nunca aparece más de dos veces por partida; en una partida Personalizada se puede ajustar la frecuencia de cada uno. Los intercambios de los Ladrones de sueños ocurren durante el anochecer, antes de que se abran las acciones, por orden de asiento, una vez cada uno. Cuenta la carta que tengas al final.`,
    rulesH: 'Cartas de regla',
    rulesP: 'Se roban (o eligen) 1–3 al preparar y siguen vigentes toda la partida. Algunas solo pueden cumplirse por honor cuando jugáis en la misma sala.',
    modesH: 'Modos',
    modesTh: ['Modo', 'Jugadores', 'Qué cambia'],
    countsH: 'Número de roles',
    countsTh: ['Jugadores', 'Muerte', 'Inocente', 'Guardián · Mentalista · Psicópata', 'Extendidos'],
    modesNote: 'Clásico / Aprender llena los asientos extendidos con Inocentes. Jugar en la misma sala o a distancia es solo cuestión de entrega, no otro juego: a distancia se añade chat de mesa en la app (y susurros entre vecinos con Niebla de guerra).',
    orderH: 'Quién gana a quién de noche',
    order: `<p>Todos envían a la vez; después el servidor resuelve en un orden fijo, así que el resultado nunca depende de quién tocó primero.</p>
<ol>
<li><b>Supresión.</b> El silencio del Bardo anula todos los poderes de rol. La Parálisis del sueño detiene a quien la tiene — y una Muerte activa con ella detiene todo el asesinato. El Poder inestable tira sus dados.</li>
<li><b>Maldiciones y visitas.</b> La Maldición de una Bruja hace fracasar la acción del objetivo (o todo el asesinato de la Muerte). Una Ramera que visita a cualquier Muerte activa deja el asesinato en cero.</li>
<li><b>Conversiones.</b> Primero el juramento del Agente doble, luego la copia del Imitador. Cuentan para el Mentalista esta misma noche, pero los nuevos miembros de la Muerte se unen al asesinato desde la noche siguiente.</li>
<li><b>El asesinato de la Muerte.</b> Un objetivo sobrevive si tiene, por este orden: resurrección temporal, Ángel de la guarda, Bendición, escudo del Guardián, una predicción correcta del Oráculo. Si no, un Guardaespaldas recibe la hoja — si no, muere.</li>
<li><b>Psicópata.</b> La marca se aplica salvo que el objetivo esté muerto o protegido (resurrección, Ángel, Bendición, Guardián).</li>
<li><b>Bombas y lo demás.</b> Una bomba es cara o cruz justa; el Guardián no la detiene. Las Rameras de visita caen en la explosión. Lecturas, entregas, apuestas.</li>
<li>El <b>Nigromante</b> alza a los muertos — solo si él mismo sobrevivió a la noche.</li>
<li><b>Destinos ligados.</b> Las Rameras mueren con la víctima de la Muerte que visitaban; quienes tienen Pesadilla compartida o Sonambulismo mueren con su compañero. Solo la resurrección o el Ángel de la guarda evitan una muerte ligada. Después expira el tiempo prestado.</li>
<li><b>Amanecer.</b> Los supervivientes reciben sus informes privados. El público solo sabe quién murió.</li>
</ol>`,
    phonesH: 'Jugar con el móvil',
    phones: `<ul>
<li>El anfitrión crea una sala y comparte el código de seis caracteres o el QR. Los demás abren el enlace, escriben un nombre y tocan <em>Listo</em>.</li>
<li>Tu asiento está ligado a tu navegador. Si un móvil se apaga, el anfitrión puede emitir desde sus controles un <b>código de recuperación</b> de un solo uso; al introducirlo en otro dispositivo, tu asiento pasa allí y el antiguo se desconecta.</li>
<li>El móvil del anfitrión es un móvil de jugador normal con algunos botones extra: avanzar la fase, añadir 30 segundos, terminar la partida. El anfitrión no ve roles, Sueños ni votos.</li>
<li>Se puede mostrar un <b>tablero público</b> (sin secretos) en una tele: abre <span class="mono">/board/CÓDIGO</span>.</li>
<li>Si alguien quiere dirigir la mesa y verlo todo, crea la sala como <b>moderador de confianza</b>. No puede ocupar asiento, y todos lo saben.</li>
<li>Cada jugador elige su idioma con el botón de idioma en la pantalla de inicio, la invitación o el menú de la sala. El anfitrión fija el idioma predeterminado de la mesa en la sala de espera.</li>
<li>MUDO, Niebla de guerra y Silencio maldito son reglas de honor en persona. A distancia, el chat las aplica.</li>
</ul>`,
  },
};
