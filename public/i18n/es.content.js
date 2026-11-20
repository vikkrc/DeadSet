// Español: contenido del juego (roles, sueños, cartas de regla, modos, cartas de escenario, guía).
export default {
  and: 'y',
  numbers: ['ningún', 'un', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez'],
  roles: {
    G_UNDERTAKER: { name: "Enterrador", when: "Siempre", summary: "Tienes el registro de sepulturas. Da a tu cuadrilla una palabra y un número.", detail: "Solo tú y el otro Enterrador sabéis qué yace bajo cada piedra. Tu palabra debe unir tantas tumbas de tu cuadrilla y llevar lejos de la tumba de la Muerte." },
    G_DIGGER: { name: "Saqueador", when: "Siempre", summary: "Lee la señal de tu Enterrador y desentierra las reliquias de tu cuadrilla.", detail: "Habladlo y vota por una tumba en tu móvil. Vuestra reliquia: seguid cavando. Una tumba vacía o una reliquia de la otra cuadrilla: el turno pasa. La tumba de la Muerte: vuestra cuadrilla pierde." },
    O_SEER: { name: "Vidente", when: "Siempre", summary: "Predice dónde se detiene la rueda, y gírala cuando compense.", detail: "Cada ronda, predice en secreto Vida, Muerte o Renacimiento, y decide si giras la rueda un paso (cuesta una de tus cinco Influencias). Todos los giros se suman. Acertar vale 3; la Influencia sin usar vale 1 cada una al final." },
    W_READER: { name: "Lector", when: "Siempre", summary: "Responde al dilema por ti, y predice a un amigo.", detail: "Cada ronda respondes a un dilema ficticio y predices la respuesta de quien lees. Acertar vale 2; tu propia respuesta no puntúa, así que sorprender a tu lector es juego limpio." },
    Q_MIMIC: { name: "Imitador", when: "Siempre", summary: "Llevas la cara de un amigo. No sabes dónde estás.", detail: "Todos los demás comparten un lugar. Escucha las preguntas, responde como si pertenecieras allí y averigua el lugar. Desenmascárate cuando quieras y nómbralo para ganar; un Imitador condenado aún tiene un último intento." },
    Q_LIVING: { name: "Vivo", when: "Siempre", summary: "Conoces el lugar. Demuéstralo sin delatarlo.", detail: "Pregunta y responde sobre el lugar: con la precisión justa para demostrar que estuviste allí y la vaguedad justa para que el Imitador no lo adivine. Acusa una vez por partida; solo una mesa unánime condena." },
    S_GHOST: { name: "Fantasma", when: "Siempre", summary: "Te asesinaron. Sabes quién, dónde y por qué, y no puedes hablar.", detail: "Envía a cada lector una visión para su fila. Con una mancha fría, escarcha una visión que no es tuya." },
    S_MEDIUM: { name: "Médium", when: "Siempre", summary: "Lee las visiones y enciende velas sobre la verdad.", detail: "Cada ronda lees una fila: quién, dónde o por qué. Resolved las tres antes de que se consuman las velas y luego nombrad al Impostor." },
    S_DECEIVER: { name: "Impostor", when: "Siempre", summary: "Un segundo espíritu en un cuerpo vivo. Conoces la verdad, y mientes.", detail: "Pareces exactamente un Médium. Unas pocas veces por partida, cambias la visión del Fantasma de otro lector por una tuya. Ganas si se consumen las velas o si la mesa nombra al jugador equivocado." },
    N_SLEEPER: { name: "Durmiente", when: "Siempre", summary: "Una noche, una votación. Tu carta puede cambiar de manos mientras duermes.", detail: "Mira tu carta una vez, actúa cuando tu móvil te despierte, luego discutid y señalad. Eres la carta que tienes delante al amanecer." },
    N_TWIN: { name: "Gemelo", when: "De noche", summary: "Te despiertas con tu gemelo y os veis.", detail: "Los Gemelos van en pareja. Si tu gemelo no está en la mesa, la otra carta está en el centro." },
    N_INSOMNIAC: { name: "Insomne", when: "De noche, el último", summary: "Te despiertas el último y miras tu propia carta.", detail: "Ves si alguien te quitó la carta durante la noche, y qué eres al amanecer." },
    K_GUEST: { name: "Invitado enmascarado", when: "Siempre", summary: "Baila, echa un vistazo y reclama máscaras para reunir Almas. 13 Almas ganan.", detail: "Tu máscara es una carta de rol que viste una vez. Cambia o finge para esconderla; echa un vistazo para conocerla; reclama una máscara para usar su poder. Quien crea que es suya puede desafiarte." },
    C_DIGGER: { name: "Sepulturero", when: "Siempre", summary: "Entierra tus ataúdes, apuesta cuántos puedes abrir y cava. Dos excavaciones limpias ganan.", detail: "Tu Maldición es tu farol: entiérrala para que otros tropiecen con ella. Si ganas la puja, abres primero tu propia tumba." },
    X_LIVING: { name: "Vivo", when: "Siempre", summary: "Ves la contraseña en la bola de cristal. Di una palabra que demuestre que la sabes, sin dársela al Demonio.", detail: "Demasiado obvia, y el Demonio descubre la contraseña. Demasiado rebuscada, y la mesa sospecha de ti. Luego nombrad al Demonio." },
    X_DEMON: { name: "Demonio", when: "Siempre", summary: "Solo ves la categoría. Pasa desapercibido: di una palabra como si conocieras la contraseña.", detail: "Escucha a los demás y descifra la contraseña. Si la mesa nombra a otro, ganas. Si te descubren, un intento acertado gana igualmente." },
    M_JESTER: { name: "Bufón", when: "Siempre", summary: "Ganas solo si la mesa te nombra en la Última Resistencia o el Segador te nombra en el Ajuste de cuentas.", detail: "No eres Vivo ni de la Muerte: el Médium no te ve y la Vela te muestra como Vivo. En misión puedes jugar Éxito o Sabotaje. Parece culpable, pero no demasiado." },
    TWIN: { name: "Gemelo", when: "Siempre", summary: "Hay dos Gemelos. Os conocéis y los dos sois Vivos.", detail: "Solo puedes jugar Éxito. Confía en tu gemelo, pero cuidado: si os avaláis el uno al otro demasiado alto, la Muerte sabrá dónde mirar." },
    UNDERTAKER: { name: "Enterrador", when: "Tras una misión fallida", summary: "Cuando una misión falla, sabes cuántos jugadores de la Muerte iban en ese equipo.", detail: "Cuentan todos los jugadores de la Muerte, también el Velado y el Errante, jugaran la carta que jugaran. Solo tú lo oyes. Solo puedes jugar Éxito." },
    MEDIUM: { name: "Médium", when: "Siempre", summary: "Ves a todos los jugadores de la Muerte, salvo al Velado. Guía a la expedición sin delatarte.", detail: "Si los Vivos ganan tres misiones, o atrapan a un jugador de la Muerte en la Última Resistencia, la Muerte tiene un intento para adivinar quién eres. Si te nombra, gana la Muerte." },
    BELIEVER: { name: "Creyente", when: "Siempre", summary: "Ves dos velas: el Médium y el Charlatán. No sabes cuál es cuál.", detail: "Averigua qué vela es el verdadero Médium y protégelo, a menudo haciéndote pasar tú por el Médium. Sin Charlatán en juego, tu única vela es el Médium." },
    COMPANION: { name: "Compañero", when: "Siempre", summary: "No sabes nada salvo lo que dice tu corazón. Observa los votos y las misiones.", detail: "Solo puedes jugar Éxito. Lee quién propone a quién, quién aprueba qué equipo y qué misiones fracasan." },
    REAPER: { name: "Segador", when: "Siempre", summary: "Diriges a la Muerte. En el Ajuste de cuentas, decides quién es el Médium.", detail: "Ves al resto de la Muerte (salvo al Errante). En una misión puedes jugar Éxito o Sabotaje. Tu equipo puede sugerir nombres en el Ajuste de cuentas; tu elección es la que cuenta." },
    CHARLATAN: { name: "Charlatán", when: "Siempre", summary: "Para el Creyente pareces exactamente el Médium. Aprovéchalo.", detail: "Ves al resto de la Muerte (salvo al Errante). En una misión puedes jugar Éxito o Sabotaje." },
    VEILED: { name: "Velado", when: "Siempre", summary: "El Médium no puede verte.", detail: "Ves al resto de la Muerte (salvo al Errante). En una misión puedes jugar Éxito o Sabotaje." },
    STRAY: { name: "Errante", when: "Siempre", summary: "Sirves a la Muerte en solitario: no conoces a los demás, y ellos no te conocen.", detail: "El Médium sí te ve. En una misión puedes jugar Éxito o Sabotaje. En el Ajuste de cuentas, la Muerte se desenmascara y te unes a los demás." },
    SHADE: { name: "Sombra", when: "Siempre", summary: "Caminas con la Muerte y conoces a tus compañeros.", detail: "Ves al resto de la Muerte (salvo al Errante). En una misión puedes jugar Éxito o Sabotaje." },
    CULT_LEADER: { name: "Líder de la Secta", when: "Cada noche", summary: "Cada noche, recluta a un jugador para la Secta. La Secta gana cuando supera en número a todos los demás.", detail: "Un recluta conserva su rol y sus poderes, pero ahora gana con la Secta y descubre quiénes son los demás miembros. Los jugadores del bando de la Muerte, el Destripador y los jugadores protegidos no pueden ser reclutados. Si el Líder muere, nadie más puede reclutar." },
    RIPPER: { name: "El Destripador", when: "Cada noche", summary: "Mata a un jugador cada noche, en solitario. Ganas si eres el último en pie, o si quedas solo con otro jugador que no es un asesino.", detail: "Tu asesinato lo detienen las mismas protecciones que el de la Muerte (Guardián, Ángel de la guarda, Bendición de la Bruja, resurrección temporal). La Muerte no puede matarte de noche, salvo bajo una Luna de sangre. Apareces como NO ALINEADO CON LA MUERTE." },
    DEATH: { name: 'La Muerte', when: 'Cada noche', summary: 'Poneos de acuerdo con todos los compañeros Muerte vivos en un único asesinato compartido cada noche.', detail: 'Todos los jugadores Muerte activos deben confirmar exactamente los mismos objetivos o la facción pasa. La capacidad base es un asesinato; Doble Peligro, Turno de Noche o Sobrecarga pueden subirla hasta un máximo de dos — nunca un asesinato por cada jugador Muerte.' },
    INNOCENT: { name: 'Inocente', when: 'Día', summary: 'Sin poder. Tu voz y tu voto son tu arma.', detail: 'Argumenta, acusa y vota. Igualmente recibes un Sueño cada noche y pueden afectarte estados.' },
    MENTALIST: { name: 'Mentalista', when: 'Cada noche', summary: 'Lee a otro jugador: ¿está del lado de la Muerte o no?', detail: 'Solo averiguas la lealtad actual del objetivo (DEL LADO DE LA MUERTE / NO DEL LADO DE LA MUERTE), nunca su rol exacto. Una lectura bloqueada no devuelve nada.' },
    GUARDIAN: { name: 'Guardián', when: 'Cada noche', summary: 'Protege a un jugador (tú incluido) de la Muerte y del Psicópata.', detail: 'Solo detiene el asesinato de la facción Muerte y el estado del Psicópata. No bombas, Justiciero, Chivo expiatorio, destinos ligados ni expiración. Puedes repetir objetivo.' },
    PSYCHO: { name: 'Psicópata', when: 'De noche (por defecto, una vez por partida)', summary: 'Una vez: deja mudo a alguien o quítale el voto para el día siguiente.', detail: 'MUDO: no puede hablar en la discusión, pero sí nominar y votar. SIN VOTO: puede hablar pero no votar. El Guardián, el Ángel de la guarda y la Bendición de la Bruja lo bloquean. La carga se gasta aunque se bloquee. La mesa decide con qué frecuencia: por defecto una vez por partida; el anfitrión puede permitir un Silencio y un Sin voto, o una marca cada noche.' },
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
  mcards: {
    REGULAR: { name: "Misión normal", text: "Sin efecto especial." },
    LANTERN: { name: "Portador del farol", text: "El Líder debe estar en el equipo." },
    FRESH_FACES: { name: "Caras nuevas", text: "Al menos la mitad del equipo (redondeando hacia arriba) no debe haber ido a la misión anterior." },
    EXTRA_HAND: { name: "Una mano más", text: "El equipo tiene un jugador más." },
    SKELETON_CREW: { name: "Tripulación mínima", text: "El equipo tiene un jugador menos." },
    MASKED_VOTE: { name: "Voto oculto", text: "Las votaciones del equipo solo muestran los totales, no quién votó qué." },
    SHORT_PATIENCE: { name: "Poca paciencia", text: "La tercera propuesta parte sea cual sea la votación." },
    WARD: { name: "Protección", text: "Con el equipo, el Líder nombra a un miembro cuya carta será Éxito por fuerza." },
    STEADFAST: { name: "Firmeza", text: "Hace falta un Sabotaje más de lo habitual para fracasar." },
    BRITTLE: { name: "Frágil", text: "Un solo Sabotaje la hace fracasar, aunque esta misión normalmente necesite dos." },
    SMOKE: { name: "Humo", text: "Solo se muestra el resultado, no cuántas cartas de Sabotaje se jugaron." },
    GRAND: { name: "Gran misión", text: "El resultado cuenta doble en el marcador." },
    TRAIL: { name: "Rastro", text: "Si tiene éxito, un miembro vivo del equipo al azar encuentra una pista por la noche." },
    WITNESS: { name: "Testigo", text: "Por la noche, el Líder del equipo ve en secreto la carta de otro miembro." },
    HAUNTED_ROAD: { name: "Camino embrujado", text: "Si fracasa, el Segador elige a uno de sus miembros, que no podrá ir a la próxima misión." },
  },
  missionStory: {
    steps: [
      ["Encontrar el mapa roto", "Seguir la pista falsa", "Cavar más allá de los señuelos", "Abrir la cámara acorazada", "Sacar el oro"],
      ["Encontrar el reloj", "Robar las llaves", "Forzar la primera cerradura", "Dejar atrás las alarmas", "Llegar a la última puerta"],
      ["Reunir las velas", "Trazar el círculo", "Pronunciar las palabras prohibidas", "Alimentar el altar", "Cerrar el círculo"],
      ["Examinar el cuerpo", "Interrogar al mayordomo", "Encontrar el arma", "Romper la coartada", "Nombrar al asesino"],
      ["Leer las señales de alarma", "Encontrar el origen", "Cortar el cable correcto", "Aguantar la línea", "Tirar de la última palanca"],
      ["Encontrar el objeto maldito", "Aprender su verdadero nombre", "Fastidiar al espíritu", "Atarlo con sal", "Romper la maldición"],
      ["Entrar en la partida", "Contar las cartas", "Pillar al tramposo", "Apostarlo todo", "Ganar la última mano"],
      ["Encontrar al heredero", "Esconder al heredero", "Sobrevivir a la cena", "Engañar a los asesinos", "Coronar al heredero"],
      ["Leer las estrellas", "Cruzar la oscuridad", "Sobornar al barquero", "Subir la última colina", "Abrir la puerta de casa"],
      ["Interceptar una carta", "Seguir los pasos", "Tender una trampa", "Hacer saltar la trampa", "Desenmascarar al traidor"],
      ["Atrancar las puertas", "Racionar las velas", "Ignorar los golpes en la puerta", "Aguantar pasada la medianoche", "Saludar al alba"],
      ["Seguir el rastro", "Encontrar al perista", "Abrir la caja fuerte", "Colar la falsificación", "Devolver la reliquia"],
      ["Tocar la vieja campana", "Averiguar quién cantó la nana", "Preparar el café amargo", "Despertar al alcalde", "Romper el hechizo"],
      ["Encontrar la primera página", "Descifrar los símbolos", "Encontrar la clave que falta", "Leer entre líneas", "Leer la última palabra"],
      ["Quemar el diario", "Hacer callar al loro", "Sobornar al testigo", "Despistar al detective", "Llevárselo a la tumba"],
      ["Encontrar el viejo libro de cuentas", "Localizar al prestamista", "Reunir lo que se debe", "Cita en la encrucijada", "Pagarlo todo"],
      ["Encontrar las viejas cartas de amor", "Averiguar adónde se fue", "Ganarse a sus amigos", "Preparar un encuentro casual", "Decirlo por fin"],
      ["Contar lo que quedó atrás", "Borrar las huellas", "Quemar los recibos", "Esconder el arma", "No dejar rastro"],
      ["Vigilar el tesoro", "Sobornar a un guardia", "Cortar el cristal", "Cambiar la corona", "Salir sonriendo"],
      ["Encontrar al testigo", "Averiguar qué vio", "Cortar el cable del teléfono", "Atraerlo lejos", "Mantenerlo callado hasta el alba"],
      ["Encontrar el testamento", "Demostrar quién eres", "Resistir a los otros herederos", "Abrir la cripta familiar", "Reclamar lo que es tuyo"],
      ["Visitar su tumba", "Averiguar quién lo traicionó", "Encontrar su escondite", "Ganarse a sus amigos", "Ajustar cuentas"],
      ["Inscribirse en el concurso", "Superar la primera ronda", "Burlar al favorito", "Sobrevivir a la final", "Alzar el premio"],
      ["Leer el veredicto", "Encontrar la verdadera coartada", "Rastrear al verdadero culpable", "Convencer al juez", "Abrir la puerta de la celda"],
      ["Hacer las maletas en secreto", "Robar las llaves del carruaje", "Pasar a escondidas junto al padre", "Llegar a la capilla", "Decir que sí antes del amanecer"],
      ["Desenterrar la vieja caja", "Leer lo que dice", "Averiguar quién más lo sabe", "Quemar la última copia", "Enterrarlo más hondo"],
      ["Estudiar los síntomas", "Encontrar la hierba rara", "Preparar el remedio", "Probarlo en uno mismo", "Salvar al paciente"],
      ["Encender las velas negras", "Pronunciar su nombre", "Abrir el círculo", "Hacer la pregunta", "Devolverlo"],
      ["Encontrar el sello legítimo", "Reunir a la vieja guardia", "Asaltar las puertas", "Enfrentarse al usurpador", "Ocupar el trono"],
      ["Encontrar los bocetos perdidos", "Mezclar el pigmento prohibido", "Pintar toda la noche", "Esconderlo de los críticos", "Firmar el lienzo"],
    ],
    scenes: [
      ["El salón de baile se inclina, pero la orquesta se niega a parar.", "En el camarote del capitán el agua llega a los tobillos. Y sigue subiendo.", "Los botes salvavidas se han contado dos veces. No hay suficientes.", "En la sala de máquinas inundada, algo sigue haciendo tic-tac.", "La cubierta está casi vertical. Agarraos a algo. A lo que sea."],
      ["El tiovivo arranca solo en cuanto llegáis.", "La casa de los espejos muestra a uno de vosotros de más.", "Hay cola en el tren fantasma. Nadie en ella respira.", "La noria se detiene con vosotros en lo más alto.", "Todas las estatuas de payaso se han girado hacia vosotros."],
      ["La puerta se sella a vuestra espalda con un siseo. Las luces parpadean.", "La radio crepita con una voz que sabe vuestros nombres.", "En las raciones pone «No abrir». Alguien las ha abierto.", "El nivel menos cuatro no aparece en ningún plano.", "Quedan veinte minutos de aire. Probablemente."],
      ["Los retratos os siguen con la mirada, y también con los pies.", "La cena está servida para exactamente un invitado más de los que sois.", "La puerta secreta está detrás del libro que acabas de tocar.", "La escalera del desván cruje formando palabras.", "La casa ha dejado de fingir que está vacía."],
      ["La nieve se come vuestras huellas tan rápido como las hacéis.", "Los perros del trineo se niegan a dar un paso más.", "Algo grande lleva todo el día siguiendo vuestras huellas.", "El hielo del lago ha empezado a cantar.", "La ventisca se cierra. Ya no veis ni vuestras propias manos."],
      ["La lámpara gira, pero nadie ha subido la escalera en años.", "La sirena de niebla responde a preguntas que nadie ha hecho.", "El diario del farero termina a mitad de frase.", "Las rocas de abajo están llenas de barcos que confiaron en esta luz.", "Arriba, la lámpara se apaga. Algo respira en la oscuridad."],
      ["La gravedad funciona en casi todas las salas. Casi.", "La IA de la estación da los buenos días. No es de día.", "El invernadero hidropónico está lleno de plantas que nadie plantó.", "Según el registro de la esclusa, alguien salió. No falta nadie.", "La órbita se degrada. Todos, contened la respiración."],
      ["El revisor pica tu billete y susurra: tren equivocado.", "El vagón restaurante está preparado para un banquete, pero el cocinero ha desaparecido.", "Un túnel. Cuando vuelve la luz, un pasajero es otro.", "El tren cruza un puente que ayer no estaba.", "Los frenos han dejado de funcionar. La montaña, no."],
      ["Remáis por la nave mientras el órgano suena bajo el agua.", "Las velas arden bajo la superficie. Eso no debería ser posible.", "Todos los santos de las vidrieras os señalan.", "La cripta se ha inundado y los ataúdes flotan.", "La campana suena bajo el agua, lenta y muy cerca."],
      ["Las rosas se inclinan hacia vosotros. Con educación, de momento.", "El invernadero es húmedo y algo en él zumba.", "Una planta carnívora se ha comido el mapa. Y al jardinero.", "El laberinto de setos se reordena cada vez que parpadeáis.", "El gran árbol del centro abre un ojo adormilado."],
      ["En recepción tienen vuestra reserva. Nunca hicisteis ninguna.", "La piscina está llena de arena y el socorrista sigue de servicio.", "La habitación 313 zumba de noche. No existe la 312.", "Una tormenta de arena tiñe cada ventana de color óxido.", "El pozo en el corazón del oasis ha empezado a susurrar."],
      ["Los monjes hicieron voto de silencio y lo están rompiendo a gritos.", "Las campanas tocan trece veces.", "En el scriptorium hay un libro que se escribe solo.", "El sendero del acantilado resbala y las cabras os juzgan.", "En la cripta espera el abad. Murió en 1611."],
      ["La luna de la cosecha cuelga tan baja que podrías morderla.", "Los barriles de la bodega envejecen algo que no es vino.", "Hace un minuto el espantapájaros miraba hacia el otro lado.", "La sala de catas huele a ciruela, humo y malas decisiones.", "Las uvas se volvieron negras en una noche. Están escuchando."],
      ["El plató 9 está iluminado y rodando. No hay nadie tras la cámara.", "En atrezo falta exactamente un cuchillo de verdad.", "En el decorado exterior, un pueblo de cartón proyecta sombras reales.", "La silla del director lleva tu nombre, mal escrito.", "La última bobina está en el proyector. Ponedla y ved cómo acaba."],
      ["Cada reloj de la sala marca una hora distinta, y todos van tarde.", "El autómata ajedrecista exige la revancha.", "Un pájaro mecánico canta la alarma, y la alarma le responde.", "El gran planetario mecánico ha empezado a girar solo.", "Dan las doce, y cada pieza del museo gira la cabeza."],
      ["El campanario es el único paso.", "Hay faroles encendidos en ventanas bajo el agua.", "Una barca pasa a la deriva, sin nadie a los remos.", "La campana del pueblo suena bajo la superficie.", "El agua sube y las casas se llenan de voces."],
      ["La orquesta afina. No hay músicos.", "El palco cinco siempre está reservado. Esta noche está ocupado.", "La araña se balancea, aunque no hay corriente.", "La diva da una nota que agrieta los espejos.", "El telón se alza para el último acto. Estáis en él."],
      ["La verja se abre antes de que la toquéis.", "Una tumba reciente, y la lápida lleva vuestras iniciales.", "Los cuervos os están contando.", "Alguien cuida estas tumbas. Cada noche.", "El suelo suspira y la tierra empieza a moverse."],
      ["El telescopio ya apunta a algo.", "Las cartas estelares muestran una estrella de más.", "La cúpula no se cierra y la luna se asoma.", "Las notas del astrónomo terminan con: se está acercando.", "Empieza un eclipse, doce años antes de tiempo."],
      ["La orquesta toca un vals cuyos pasos nadie conoce.", "Cada bailarín lleva una máscara, y ninguno tiene rostro.", "El champán nunca se acaba. Ese es el problema.", "Los espejos muestran el baile de hace un siglo.", "La música se detiene. Todos se vuelven hacia vosotros."],
      ["El hielo es tan claro que se ven caras debajo.", "Huellas de patines rodean un agujero que antes no estaba.", "Las casetas de pesca están vacías, los sedales aún tensos.", "Una grieta avanza hacia vosotros, lenta y deliberada.", "Bajo vuestros pies, algo golpea para que lo dejen salir."],
      ["La carpa se levantó de noche, y nadie la montó.", "La adivina ya sabe vuestros nombres.", "La jaula del león está abierta. El león no está.", "El maestro de ceremonias anuncia un número que nunca aceptasteis.", "El circo recoge a vuestro alrededor. Ahora sois parte del espectáculo."],
      ["Los libros están secos, aunque el agua llega a la cintura.", "Una ficha del catálogo registra un libro sobre vosotros.", "La bibliotecaria os chista desde debajo del agua.", "Las páginas pasan solas con la corriente.", "El estante más hondo guarda el único ejemplar. El agua sube."],
      ["El pan de jengibre huele de maravilla. Así es como os atrapa.", "El caldero burbujea y nadie ha encendido el fuego.", "El gato negro os enseña el camino. No os fiéis.", "Los tarros del estante llevan vuestros nombres.", "La bruja vuelve antes de tiempo."],
      ["Los reyes yacen en fila. Un ataúd está abierto.", "Las antorchas se encienden solas a vuestro paso.", "Una inscripción advierte: solo la sangre real puede pasar.", "La efigie de la reina ha girado la cabeza.", "La puerta de piedra se cierra chirriando a vuestra espalda."],
      ["Un farol hace señales desde los acantilados. Nadie responde.", "La cueva está llena de cajas, todas marcadas con una calavera.", "La marea sube más rápido de lo que dicen las cartas.", "Aduaneros en la playa, y un contrabandista entre vosotros.", "El último bote sale a medianoche, con o sin vosotros."],
      ["Los puestos abren a medianoche y venden lo que habéis perdido.", "Un mercader os ofrece una ganga. El precio es un recuerdo.", "Las monedas de vuestros bolsillos se han vuelto hojas.", "Alguien vende un mapa del lugar adonde vais.", "Con la primera luz, el mercado entero desaparecerá. Daos prisa."],
      ["Las aspas giran, aunque el viento ha muerto.", "Sale humo del molino, pero nada se consume.", "El molinero sigue moliendo harina en medio del fuego.", "Solo la escalera lleva arriba, y ya humea.", "La gran rueda se derrumba en una lluvia de chispas."],
      ["Todos los pacientes duermen, y todos sonríen.", "Los informes del médico están escritos con vuestra letra.", "El teleférico solo baja.", "La habitación 9 está helada, aunque el radiador arde.", "Un alud corta la carretera. Ya nadie se marcha."],
      ["Cada recodo os muestra una versión de vosotros un poco peor.", "Un reflejo llega un instante tarde.", "Alguien en los espejos lleva una máscara con vuestra cara.", "El cartel de salida señala en todas direcciones.", "Los espejos se agrietan y vuestros reflejos salen de ellos."],
    ],
    genericSteps: ["El primer paso", "Más adentro", "El punto sin retorno", "Lo más difícil", "El final del camino"],
    genericScenes: ["La expedición se pone en marcha. Nadie mira atrás.", "El camino se estrecha, y la confianza también.", "A mitad de camino. Alguien cuenta los pasos.", "El aire se enfría con cada decisión.", "El último tramo. Lo que espera aquí os esperaba a vosotros."],
  },
  sideMissions: {"GO_TWICE": "Ve al menos a dos misiones.", "GO_THRICE": "Ve al menos a tres misiones.", "STAY_BEHIND": "No vayas a más de una misión.", "EARLY_BIRD": "Ve a la misión 1 o a la misión 2.", "LATE_ARRIVAL": "No vayas ni a la misión 1 ni a la 2.", "LANTERN_LEADS": "Lidera un equipo que salga a su misión.", "NO_LANTERN": "Nunca lideres un equipo que salga a su misión.", "GOOD_COMPANY": "Ve en una misión que tenga éxito.", "BAD_LUCK": "Ve en una misión que fracase.", "CLEAN_RECORD": "Nunca vayas en una misión que fracase.", "NAYSAYER": "Vota Rechazar al menos tres veces.", "OPEN_HEART": "Nunca votes Rechazar.", "LONE_VOICE": "Rechaza un equipo que la mesa aprueba.", "LOST_CAUSE": "Aprueba un equipo que la mesa rechaza.", "CONTRARIAN": "Queda dos veces en el lado perdedor de una votación de equipo.", "CROWD": "Vota siempre con la mayoría.", "FIRST_TRUST": "Aprueba la primera propuesta de dos misiones distintas.", "POPULAR": "Aparece en al menos tres equipos propuestos.", "SELF_STARTER": "Ponte en un equipo que propongas.", "HUMBLE": "Nunca te pongas en un equipo que propongas.", "NEIGHBOURS": "Ve a una misión junto al jugador de tu izquierda.", "CANDLE_BEARER": "Sostén la Vela en algún momento.", "STEADY_EYE": "Nunca cambies tu Sospecha (y da al menos dos).", "RESTLESS": "Sospecha de tres jugadores distintos con tus Sospechas."},
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
    graverobbers: { name: "Dead Set: Saqueadores de tumbas", blurb: "Dos cuadrillas de saqueadores, la Luna y el Sol, excavan un cementerio de palabras o iconos en busca de las reliquias de su deidad. Solo los enterradores saben qué hay debajo. Una tumba es de la Muerte." },
    omen: { name: "Dead Set: El Presagio", blurb: "Una rueda oculta señala la Vida, la Muerte o el Renacimiento. Cualquiera puede girarla en secreto; predice dónde se detiene." },
    mirror: { name: "Dead Set: El Espejo", blurb: "El espejo encantado muestra lo que tus amigos creen que harías. Responde al dilema y lee a quien tienes enfrente." },
    mimic: { name: "Dead Set: Imitador", blurb: "Todos saben dónde estáis, salvo la cosa que lleva la cara de un amigo. Pregunta, responde, acusa; el Imitador escucha para dar con el lugar." },
    seance: { name: "Dead Set: Sesión", blurb: "Un Fantasma asesinado y mudo envía visiones; los Médiums leen en ellas quién, dónde y por qué. Un Impostor entre ellos cambia visiones por mentiras." },
    midnight: { name: "Dead Set: Medianoche", blurb: "Una noche, una votación. Las cartas cambian de manos en la oscuridad; al amanecer eres lo que tienes delante. Encuentra a la Muerte, o sé ella." },
    carnival: { name: "Dead Set: Carnaval", blurb: "Un baile de máscaras de faroles y memoria. Cada uno lleva una carta de rol como máscara, barajada hasta que nadie está seguro. Reclama máscaras y reúne Almas; 13 ganan." },
    coffins: { name: "Dead Set: Ataúdes", blurb: "Un juego de faroles rápido. Entierra oro y una maldición, puja cuántos ataúdes puedes abrir y luego cava. Dos excavaciones limpias ganan." },
    exorcism: { name: "Dead Set: Exorcismo", blurb: "Un juego de palabras y faroles. Todos ven la contraseña en la bola de cristal, menos el Demonio. Una palabra cada uno y luego desenmascarad al Demonio." },
    missions: { name: "Dead Set: Misiones", blurb: "Equipos, votos y sabotaje. Nadie muere: dirigid misiones, leed los votos y encontrad a la Muerte antes de que ella encuentre al Médium." },
    standard: { name: 'Estándar', blurb: 'La experiencia Dead Set tal como se pensó. Diez roles extendidos desde 7 jugadores, un Sueño para todos cada noche, 1–3 cartas de regla.' },
    classic: { name: 'Clásico / Aprender', blurb: 'Para enseñar. Solo roles básicos — los asientos extendidos son Inocentes. Sueños desactivados por defecto, como mucho una regla sencilla.' },
    full: { name: 'Mazo completo / Caos', blurb: 'Los 17 roles extendidos, incluidos Bufón, Bardo y Bruja. Mucho azar, solo para grupos con experiencia.' },
    doomsday: { name: 'Apocalipsis', blurb: 'Estándar, contra el reloj. Si nadie ha ganado al cerrar el último día, gana la Muerte.' },
    custom: { name: 'Personalizado', blurb: 'Elige tú la reserva extendida, los Sueños, las reglas y el reloj — o escribe el mazo exacto. Avisa de configuraciones desequilibradas.' },
  },
  scenario: {
    WHO: ['Viajeros en el tiempo', 'Exploradores espaciales', 'Criaturas míticas', 'Fantasmas de personajes históricos', 'Mutantes', 'Miembros de una sociedad secreta', 'Turistas perdidos', 'Inteligencias artificiales', 'Aldeanos medievales', 'Dobles de famosos', "Artistas de circo retirados", "Fareros", "Chefs rivales", "Nobles exiliados", "Enfermeras del turno de noche", "Buzos de aguas profundas", "Invitados de una boda", "Astrónomos varados", "Bailarines de un baile de máscaras", "Monjes silenciosos", "Jardineros de medianoche", "Relojeros", "Contrabandistas", "Cantantes de ópera", "Ladrones de tumbas", "Guardias reales", "Pescadores", "Alquimistas", "Banqueros", "Revisores de tren", "Adivinas", "Guías de montaña", "Faroleros", "Titiriteros", "Observadores de aves", "Enterradores", "Tahúres", "Cazadores", "Tragafuegos", "Encantadores de serpientes"],
    WHERE: ['Un barco que se hunde', 'Un parque de atracciones abandonado', 'Un búnker subterráneo', 'Una mansión encantada', 'Una tundra nevada', "Un faro entre la niebla", "Una estación espacial abandonada", "Un tren nocturno entre montañas", "Una catedral inundada", "Un jardín botánico invadido por la maleza", "Un hotel en un oasis", "Un monasterio remoto", "Un viñedo a la luz de la luna", "Un estudio de cine abandonado", "Un museo de autómatas", "Un pueblo sumergido", "Una ópera a la luz de las velas", "Un cementerio olvidado", "Un observatorio lunar", "Un salón de baile dorado", "Un lago helado", "Un circo ambulante", "Una biblioteca hundida", "La cabaña de una bruja", "Una cripta real", "Una cala de contrabandistas", "Un mercado de medianoche", "Un molino en llamas", "Un sanatorio alpino", "Un laberinto de espejos"],
    WHY: ['Encontrar un tesoro escondido', 'Escapar antes de que se acabe el tiempo', 'Completar un ritual', 'Resolver un asesinato', 'Detener un desastre inminente', "Romper una maldición antigua", "Ganar una fortuna a las cartas", "Proteger a un heredero real", "Encontrar el camino a casa", "Desenmascarar a un traidor", "Sobrevivir hasta el amanecer", "Recuperar una reliquia robada", "Despertar al pueblo dormido", "Descifrar un último mensaje", "Guardar un terrible secreto", "Saldar una vieja deuda", "Recuperar un amor perdido", "Esconder las pruebas", "Robar las joyas de la corona", "Silenciar a un testigo", "Cobrar una herencia", "Vengar a un hermano", "Ganar el gran premio", "Demostrar su inocencia", "Fugarse antes del alba", "Enterrar el pasado", "Curar una extraña enfermedad", "Invocar a un espíritu", "Reclamar un trono robado", "Terminar la obra maestra"],
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
  // The Mirror: dilemmas by stable id, [prompt, A, B, C] (see public/dilemmas.js).
  dilemmas: {
    d001: ["A medianoche llama un desconocido, empapado por la tormenta, pidiendo entrar.", "Dejarle pasar", "Hablar a través de la puerta", "Fingir que no hay nadie", "El visitante de medianoche"],
    d002: ["Encuentras un diario cerrado con candado en el desván de tu casa nueva.", "Forzar el candado y leerlo", "Devolverlo a los antiguos dueños", "Quemarlo sin leerlo", "El diario cerrado"],
    d003: ["Una adivina se ofrece a decirte el día de tu muerte.", "Escucharla", "Rechazarlo con educación", "Preguntar por otra persona", "La adivina"],
    d004: ["En una cena se apagan las luces y suena un grito.", "Correr hacia el grito", "Buscar antes una vela", "Quedarte totalmente quieto", "La cena a oscuras"],
    d005: ["Un fantasma se ofrece a perseguir a quien elijas durante una semana.", "Nombrar a un rival", "Nombrar a un amigo, por diversión", "Rechazar la oferta", "El fantasma prestado"],
    d006: ["Heredas un castillo en ruinas con maldición familiar incluida.", "Mudarte igualmente", "Venderlo enseguida", "Convertirlo en hotel", "El castillo maldito"],
    d007: ["Un cuervo se posa en tu ventana cada noche a las tres.", "Darle de comer", "Hablarle", "Correr las cortinas", "El cuervo de las tres"],
    d008: ["Puedes pasar una noche encerrado en un famoso lugar encantado.", "La mazmorra de un castillo", "Un manicomio abandonado", "Un barco fantasma en alta mar", "La noche encantada"],
    d009: ["Tu reflejo parpadea un instante después que tú.", "Sostenerle la mirada", "Tapar todos los espejos", "Saludarlo a ver qué pasa", "El reflejo tardío"],
    d010: ["Una sesión de espiritismo sale mal y un espíritu pide un favor.", "Escucharlo", "Terminar la sesión al instante", "Negociar algo primero", "El favor del espíritu"],
    d011: ["El último tren a casa va vacío salvo por un pasajero silencioso.", "Sentarte a su lado", "Sentarte lo más lejos posible", "Esperar al siguiente tren", "El último tren"],
    d012: ["Puedes llevarte un objeto al más allá.", "Una fotografía", "Un buen libro", "Una baraja de cartas", "El equipaje del más allá"],
    d013: ["Una moneda maldita da suerte, pero te cuesta un recuerdo cada día.", "Quedártela", "Pasársela a otro", "Tirarla al río", "La moneda maldita"],
    d014: ["Te pierdes al anochecer en un bosque con niebla.", "Seguir las luces lejanas", "Subir a un árbol y esperar", "Volver por donde viniste", "El bosque de niebla"],
    d015: ["En un baile de máscaras, alguien lleva tu cara como máscara.", "Enfrentarte a él", "Seguirlo en silencio", "Cambiar de máscara e irte", "El rostro prestado"],
    d016: ["Puedes conocer un secreto de cada persona de esta mesa.", "Su peor miedo", "Su mayor mentira", "Su talento oculto", "Los secretos de la mesa"],
    d017: ["Un gato negro se cruza en tu camino antes de una cita importante.", "Seguir adelante", "Tomar otra calle", "Pararte a acariciarlo", "El gato negro"],
    d018: ["Tu casa está encantada por un fantasma amable pero muy ruidoso.", "Aprender a convivir con él", "Llamar a un exorcista", "Cobrar entrada a los turistas", "El fantasma ruidoso"],
    d019: ["Te despiertas convertido en vampiro.", "Abrazar la vida nocturna", "Buscar una cura", "Guardar el secreto y seguir", "El nuevo vampiro"],
    d020: ["Una carta misteriosa te invita a una mansión para la lectura de un testamento.", "Ir solo", "Ir con un amigo", "Ignorarla", "La lectura del testamento"],
    d021: ["Eres el último huésped despierto en una vieja posada y cruje la escalera.", "Investigar", "Cerrar tu puerta con llave", "Fingir que duermes", "La escalera que cruje"],
    d022: ["Una bruja te regala una poción.", "Poción de amor", "Poción de la verdad", "Poción de invisibilidad", "La poción gratis"],
    d023: ["Puedes vivir en cualquier siglo, sin vuelta atrás.", "El pasado", "Aquí y ahora", "El futuro lejano", "El siglo sin vuelta"],
    d024: ["Un retrato parlante da consejos a cambio de cotilleos.", "Darle cotilleos", "Ignorarlo", "Ponerlo de cara a la pared", "El retrato parlante"],
    d025: ["Tu grupo está atrapado en una cabaña y mañana se acaba la comida.", "Liderar la huida", "Racionar y esperar", "Registrar el sótano", "La cabaña aislada"],
    d026: ["Oyes tu propia voz llamándote desde el bosque.", "Responder", "Ir hacia ella", "Huir en dirección contraria", "La voz del bosque"],
    d027: ["Un genio concede un deseo, pero la frase debe ser perfecta.", "Desear riqueza", "Desear más deseos", "Liberar al genio", "El deseo del genio"],
    d028: ["Una vieja caja de música suena sola cada noche.", "Darle cuerda tú", "Quitarle el mecanismo", "Grabarla como prueba", "La caja de música"],
    d029: ["Solo puedes comer un plato el resto de tu vida.", "Un gran banquete", "Pan y sopa sencillos", "Algo dulce", "La única comida"],
    d030: ["Encuentras un mapa de tu propio jardín marcado con una X.", "Cavar esta noche", "Cavar de día con amigos", "Dejarlo enterrado", "La X enterrada"],
    d031: ["Un amigo te confiesa que es un hombre lobo en secreto.", "Ayudarle a ocultarlo", "Encerrarlo con luna llena", "Pedirle ver la transformación", "El amigo lobo"],
    d032: ["Puedes cambiar tu vida un día con alguien de esta mesa.", "Alguien sin miedo", "Alguien rico", "Alguien misterioso", "La vida prestada"],
    d033: ["El enterrador ofrece planear tu funeral por adelantado, con descuento.", "Un gran cortejo", "Una ceremonia sencilla", "Una fiesta con baile", "El funeral anticipado"],
    d034: ["En tu casa hay un reloj que va hacia atrás.", "Arreglarlo", "Dejarlo estar", "Intentar usarlo", "El reloj al revés"],
    d035: ["Llega el circo y un payaso te pasa una entrada para un espectáculo secreto.", "Ir", "Regalar la entrada", "Romperla", "El espectáculo secreto"],
    d036: ["Puedes hablar con una especie animal.", "Los gatos", "Los cuervos", "Los perros", "La lengua animal"],
    d037: ["Una tormenta te encierra una noche en un faro con un farero que nunca duerme.", "Quedarte charlando", "Dormir con un ojo abierto", "Desafiar la tormenta", "El farero que no duerme"],
    d038: ["Tu sombra empieza a moverse sola.", "Seguirla", "Quedarte en la luz", "Hacerte su amigo", "La sombra inquieta"],
    d039: ["Te ofrecen la inmortalidad, pero nunca podrás salir de este pueblo.", "Aceptar", "Rechazar", "Pedir un pueblo más grande", "El pueblo para siempre"],
    d040: ["Una mañana, una cripta sellada del cementerio aparece abierta.", "Mirar dentro", "Avisar al cura", "Cerrarla y callar", "La cripta abierta"],
    d041: ["Puedes quedarte para siempre con una de estas cosas.", "Una llave que abre cualquier puerta", "Una vela que nunca se apaga", "Una brújula que señala a casa", "El recuerdo"],
    d042: ["En una subasta, un cuadro maldito sale muy barato.", "Pujar", "Avisar a los demás postores", "Marcharte", "El cuadro barato"],
    d043: ["El pueblo te pide vigilar el puente la noche en que algo lo cruza.", "Hacer guardia", "Poner una trampa", "Buscar una excusa para no estar", "La guardia del puente"],
    d044: ["Tu galleta de la suerte dice: No confíes en quien está a tu izquierda.", "Creértelo", "Reírte", "Enseñársela", "La galleta de la suerte"],
    d045: ["Puedes volver a vivir un día de tu vida.", "Tu día más feliz", "Un día para enmendar un error", "Un día corriente y perezoso", "El día otra vez"],
    d046: ["Un espejo de una tienda de antigüedades te muestra diez años mayor.", "Comprarlo", "Preguntar qué muestra", "Irte rápido", "El espejo del futuro"],
    d047: ["Un fantasma te protegerá de por vida.", "Un caballero", "Una abuela", "Un niño travieso", "El fantasma guardián"],
    d048: ["El anfitrión de una fiesta ha cerrado todas las puertas por fuera.", "Buscar otra salida", "Seguir la fiesta", "Exigir una explicación", "La fiesta cerrada"],
    d049: ["Solo te recordarán por una cosa.", "La bondad", "El valor", "El humor", "El único recuerdo"],
    d050: ["Aparece un libro de hechizos en tu puerta.", "Probar un hechizo", "Leerlo sin lanzar nada", "Llevarlo a una biblioteca", "El libro de hechizos"],
    d051: ["Te ofrecen plaza en un barco que nunca ha vuelto de sus viajes.", "Zarpar", "Quedarte en tierra", "Preguntar antes a la tripulación", "El barco sin regreso"],
    d052: ["Descubres que tu doble vive en el pueblo de al lado.", "Conocerlo", "Observarlo de lejos", "Mudarte", "El gemelo del pueblo"],
    d053: ["En la cena, todas las velas se vuelven azules a la vez.", "Seguir comiendo", "Apagarlas", "Preguntar quién está ahí", "Las velas azules"],
    d054: ["Puedes detener el tiempo una hora, una sola vez.", "Usarlo hoy", "Guardarlo para una emergencia", "Usarlo para dormir", "La hora detenida"],
    d055: ["Una gárgola de la catedral te pide una adivinanza.", "Contarle una", "Pedirle una a ella", "Fingir que no la oyes", "El acertijo de la gárgola"],
    d056: ["Tu canción favorita suena en tu propio funeral. ¿Cuál es?", "Algo triste", "Algo alegre", "Algo que nadie espera", "La canción del funeral"],
    d057: ["Solo puedes tener un oficio en un pueblo encantado.", "Enterrador", "Posadero", "Sereno", "El oficio embrujado"],
    d058: ["Un amigo te pide prestado el abrigo y lo devuelve con la carta de un desconocido en el bolsillo.", "Leer la carta", "Devolvérsela", "Buscar al desconocido", "La carta del desconocido"],
    d059: ["Sale la luna llena y todos los perros del pueblo empiezan a aullar.", "Cerrar las puertas", "Salir a mirar", "Aullar con ellos", "La luna aullante"],
    d060: ["Puedes renunciar a un sentido para agudizar los demás.", "El gusto", "El olfato", "Nunca, a ninguno", "El sentido cambiado"],
    d061: ["Un carruaje sin cochero se detiene ante ti.", "Subir", "Buscar al cochero", "Seguir andando", "El carruaje sin cochero"],
    d062: ["Puedes saber exactamente qué piensa de ti una persona.", "Tu mejor amigo", "Tu rival", "Nadie, gracias", "La opinión verdadera"],
    d063: ["Llega una niebla espesa y la campana del pueblo da trece campanadas.", "Volver a contar", "Esconderte en casa", "Ir al campanario", "La decimotercera campanada"],
    d064: ["Descubres que tu casa tiene una habitación oculta.", "Abrirla ya", "Esperar a que sea de día", "Empapelarla", "La habitación oculta"],
    d065: ["Un vendedor ambulante vende suerte embotellada.", "Comprar una botella", "Comprar la caja entera", "Echarlo del pueblo", "El vendedor"],
    d066: ["Debes pasar un año solo en un monasterio de montaña.", "Llevar una pila de libros", "Llevar un instrumento", "Llevar un diario", "El año en la montaña"],
    d067: ["Los posos del té forman un nombre que no conoces.", "Buscar a esa persona", "Tomar otra taza", "No contárselo a nadie", "Las hojas de té"],
    d068: ["Puedes ir como invitado a cualquier fiesta de la historia.", "Una coronación real", "Un baile de máscaras desenfrenado", "Un concierto legendario", "La fiesta de la historia"],
    d069: ["Un moribundo te da una llave y susurra: Nunca lo abras.", "Abrirlo", "Guardarla para siempre", "Tirarla", "La llave prohibida"],
    d070: ["La mesa debe elegir quién explora primero la cripta.", "Ofrecerte voluntario", "Proponer a otro", "Proponer echarlo a suertes", "El primero en la cripta"],
    d071: ["Te ofrecen un sitio en la mesa de la Muerte.", "Aceptar con educación", "Llevar un regalo", "Poner una excusa", "La cena con la Muerte"],
    d072: ["Una foto antigua te muestra en una fiesta de hace cien años.", "Investigar", "Enmarcarla", "Esconderla", "La vieja fotografía"],
    d073: ["Puedes convertirte a voluntad en una criatura.", "Un murciélago", "Un lobo", "Un gato", "El cambiaformas"],
    d074: ["Alguien deja flores en tu puerta cada noche.", "Quedarte despierto para ver quién", "Dejar una nota de agradecimiento", "Dejar de abrir la puerta", "Las flores en la puerta"],
    d075: ["Una tormenta corta la luz durante una película de terror.", "Contar historias de fantasmas", "Irte a dormir", "Representar el final a la luz de las velas", "El apagón"],
    d076: ["Puedes deshacer un invento de la historia.", "Los despertadores", "Los móviles", "Nada, que siga todo", "El invento deshecho"],
    d077: ["En un cruce a medianoche, un desconocido se ofrece a afinar tu guitarra.", "Dársela", "Preguntar antes el precio", "Irte con tu guitarra", "El forastero del cruce"],
    d078: ["Puedes traer a alguien de vuelta para una sola conversación.", "Un familiar", "Un personaje famoso", "Un amigo de la infancia", "La última conversación"],
    d079: ["De la noche a la mañana aparece una trampilla en el suelo de la cocina.", "Bajar", "Clavarla", "Tirar una moneda y escuchar", "La trampilla"],
    d080: ["La última vela se consume y solo uno de vosotros puede sostenerla.", "Cogerla", "Ofrecérsela a otro", "Apagarla juntos", "La última vela"],
  },
  guide: {
    missionCardsH: "Cartas de misión",
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
    title: 'Cómo<br><i>jugar.</i>',
    toc: ['Básico', 'Una ronda', 'Victoria', 'Roles básicos', 'Roles extendidos', 'Mazo completo', 'Sueños', 'Cartas de regla', 'Modos', 'Orden nocturno', 'Móviles'],
    basicsH: 'Lo básico',
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
<li><b>Un primer día tranquilo</b> (activado por defecto): el día 1 es solo para hablar. No se puede nominar a nadie y no hay votación; la primera condena puede llegar el día 2.</li>
<li><b>El Psicópata</b>: con qué frecuencia el Psicópata puede marcar a alguien. Una vez por partida (por defecto); un Silencio y un Sin voto, en cualquier orden; o una marca cada noche.</li>
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
    kicker: "El libro de reglas",
    intro: "Dead Set es una familia de juegos de fiesta para una sola sala. Cada uno juega en su propio móvil; una tele, si la tenéis, es el escenario común. Elegid un juego, leed su capítulo y a jugar.",
    aboutH: "Qué es Dead Set",
    about: `<p>Dead Set es una colección de juegos sociales (roles ocultos, faroles, juegos de palabras, predicción) que comparten una misma mesa. Todos se juegan igual: el <b>móvil de cada jugador es una pantalla privada</b> que solo muestra lo que ese jugador puede saber, y la aplicación es el narrador, así que nadie tiene que quedarse fuera para dirigir la partida.</p>
<ul>
<li><b>Sin instalar nada.</b> Funciona en el navegador. Se entra con un código de seis caracteres, un enlace o un código QR.</li>
<li><b>De 3 a 25 jugadores</b>, según el juego. Cada capítulo indica el número de jugadores y la duración.</li>
<li><b>La tele es opcional, pero lo mejor.</b> Muestra la mesa, las escenas, las puntuaciones y pone la música. Nunca muestra un secreto.</li>
<li><b>Siete idiomas.</b> Cada uno elige el suyo; los juegos de palabras usan el idioma de la mesa en todos los móviles para que las palabras coincidan.</li>
<li><b>Una mesa, muchos juegos.</b> Cambiad de juego en la sala entre rondas; dentro de un encuentro, las puntuaciones se mantienen.</li>
</ul>`,
    tableH: "Abrir una mesa",
    table: `<ol>
<li><b>Abrir una mesa.</b> El anfitrión toca <em>Abrir una mesa</em>, escribe un nombre y recibe un código de sala de seis caracteres.</li>
<li><b>Invitar.</b> Compartid el código, el enlace o el código QR. Los demás tocan <em>Unirse a una mesa</em> (o abren el enlace), escriben un nombre y eligen un retrato.</li>
<li><b>Encended la tele.</b> Tocad <em>Tablero de tele</em> en la sala, o abrid la sala en el navegador de la tele y elegid <em>Abrir la mesa en la TV</em>. Varias pantallas pueden mostrar la mesa a la vez.</li>
<li><b>Los asientos.</b> Los jugadores se sientan alrededor de la mesa en el orden en que entran. El anfitrión puede tocar un asiento para mover o quitar a un jugador.</li>
</ol>
<p>Tu asiento está ligado a tu navegador. Si un móvil se apaga, el anfitrión puede darte un código de recuperación de un solo uso desde el menú de la sala; en el móvil nuevo elige <em>Recuperar mi asiento</em> e introdúcelo, y tu asiento (con sus secretos) pasa allí. Un móvil que se desconecta conserva su asiento y se pone al día al volver.</p>
<p>Si alguien quiere dirigir la partida y verlo todo, abrid la sala con un <b>moderador de confianza</b>. El moderador no ocupa asiento, y todos lo saben.</p>`,
    setupH: "Preparar una partida",
    setup: `<p>La sala guía al anfitrión por los mismos pasos numerados en cada juego. Los invitados ven los mismos pasos, solo para leer.</p>
<ol>
<li><b>El juego.</b> Elegid uno, agrupados por familias: Lealtades ocultas, Cartas de mano en mano, Leer a los demás, Señales y enigmas, Farol y apuesta.</li>
<li><b>Cómo funciona.</b> Cuatro o cinco pasos ilustrados: todo el juego de un vistazo.</li>
<li><b>El mazo.</b> Lo que se repartirá con este número de jugadores: roles, máscaras, cartas o lugares. Se actualiza a medida que entran jugadores.</li>
<li><b>Reglas.</b> Los interruptores propios del juego. Los valores por defecto dan una buena primera partida.</li>
<li><b>La mesa.</b> El idioma de la mesa, la música y su estilo, los fondos y (cuando cambia algo) si jugáis en la misma sala o a distancia con chat.</li>
<li><b>Temporizadores.</b> Cuánto dura cada paso. Plegados; los valores por defecto sirven a la mayoría de las mesas.</li>
</ol>
<p>Cada uno toca <b>Listo</b> cuando ha leído la preparación, y el anfitrión empieza la partida. Cualquier problema de la preparación (pocos jugadores para un rol, por ejemplo) aparece como nota bajo los pasos.</p>`,
    playH: "Cómo se juega cada partida",
    play: `<ul>
<li><b>Nunca enseñes tu pantalla.</b> Tu móvil muestra tu rol, tus cartas y tus decisiones. Todo lo demás se dice en voz alta o se ve en la tele.</li>
<li><b>Escenas compartidas.</b> Los grandes momentos (una revelación, un recuento, la noche) se ven en todos los móviles y en la tele a la vez, durante el mismo tiempo. No se pueden saltar, y mientras duran no corre ningún temporizador.</li>
<li><b>Elegir a un jugador:</b> toca su asiento en el círculo de la mesa. Un asiento que puedes elegir palpita; tu elección se vuelve color pergamino.</li>
<li><b>Confirmar:</b> casi todas las decisiones son un toque y se pueden cambiar hasta que acaba el paso. Las decisiones selladas (un voto, una carta jugada boca abajo) se hacen <b>manteniendo pulsado</b>: deja el pulgar hasta que el sello se cierre.</li>
<li><b>La cabecera</b> nombra el paso actual del juego y su número (Noche II, Misión 3, Ronda 4…), con el tiempo que queda.</li>
<li><b>Bajo la mesa:</b> <em>Mi carta</em> (tu rol, en cualquier momento), la hoja de referencia del juego, tus <em>Notas</em> privadas y la <em>Historia</em>, si el juego las tiene.</li>
<li><b>Temporizadores.</b> Cuando se acaba el tiempo, lo que no hayas enviado cuenta como pasar o abstenerse. El anfitrión puede añadir 30 segundos, avanzar o terminar la partida desde el menú de la sala.</li>
<li><b>Los avisos</b> sobre lo que acaban de hacer los demás aparecen un momento en la franja de la cabecera.</li>
<li><b>Reglas de honor.</b> Algunas reglas (el silencio, los jugadores mudos) solo puede cumplirlas la propia mesa. A distancia, el chat las hace cumplir.</li>
</ul>`,
    afterH: "Después de una partida",
    after: `<p>La pantalla final nombra a los ganadores, destapa cada secreto y, en la mayoría de los juegos, repite lo que pasó de verdad. Recorre el resumen a tu ritmo.</p>
<p>Muchos juegos se juegan como un <b>encuentro</b> de 1, 3 o 5 partidas: las puntuaciones se mantienen, y la mesa vuelve a la misma sala con los mismos ajustes, todos listos para la siguiente. Desde la sala, el anfitrión también puede cambiar a otro juego; la mesa, los asientos y los retratos se quedan.</p>`,
    hSetup: "Preparación",
    hCast: "Los personajes",
    hLoop: "Cómo transcurre una partida",
    hWin: "Victoria y puntuación",
    hOpts: "Opciones de la sala",
    classicP: "El Dead Set original: roles ocultos, asesinatos nocturnos y una votación secreta de día. La mayoría queréis sobrevivir. Unos pocos sois la Muerte. Nadie sabe quién es quién, salvo la Muerte, que conoce a los suyos.",
    presetsH: "Variantes",
    modesTh: ['Variante', 'Jugadores', 'Qué cambia'],
    classicSetup: `<p>De 5 a 13 jugadores (hasta 25 con un mazo personalizado). Cada uno recibe un <b>rol</b> secreto. La mayoría de los roles pertenecen al bando <b>no-Muerte</b>; uno o más jugadores son en secreto <b>la Muerte</b>, y los jugadores de la Muerte se conocen entre sí. La noche y el día se alternan hasta que un bando gana.</p>
<ul>
<li><b>Los roles</b> son quién eres durante toda la partida: tu bando y tu poder.</li>
<li><b>Los Sueños</b> son efectos de una noche: desde la Noche 1, cada jugador vivo roba uno en secreto cada noche.</li>
<li><b>Las cartas de regla</b> (de 1 a 3, robadas al preparar) tuercen toda la partida: asesinatos dobles, votos con peso, fantasmas que votan.</li>
<li><b>La historia</b> (QUIÉN / DÓNDE / POR QUÉ) es pura narración. Nunca cambia una regla.</li>
</ul>
<p>Puedes decir la verdad sobre tu rol, mentir o callar. El anfitrión juega como los demás y no ve más secretos.</p>`,
    missionsSetup: `<p>De 5 a 12 jugadores. Nadie muere: la Muerte se ha colado en la expedición, y la mesa debe encontrarla antes de que ella encuentre al Médium. Cada uno recibe un rol secreto. Los jugadores de la Muerte se ven entre sí (salvo el Errante); los Vivos solo se conocen a sí mismos, y el Médium intuye quién es la Muerte.</p>
<p>La mesa juega cinco misiones. Cada misión necesita un equipo de un tamaño dado (se ve en la sala y en la tele); desde 7 jugadores, la misión 4 necesita dos Sabotajes para fracasar.</p>`,
    missionsLoop: `<ol>
<li><b>La carta de misión.</b> Cada misión empieza con una carta. La mayoría son normales; de vez en cuando una cambia el equipo, la votación o la revelación de esa misión.</li>
<li><b>La propuesta.</b> El Líder de la misión (que lleva el farol) toca jugadores en el círculo para formar el equipo.</li>
<li><b>La votación del equipo.</b> Todos mantienen pulsado Aprobar o Rechazar en secreto. Los votos se destapan a la vez, con nombres. Una mayoría envía al equipo; si no, el farol pasa al siguiente jugador. La quinta propuesta de una misión sale adelante sea cual sea el voto.</li>
<li><b>La misión.</b> Cada miembro del equipo juega una carta boca abajo. Los Vivos solo pueden jugar Éxito; la Muerte puede jugar Éxito o Sabotaje. Las cartas se barajan y se destapan una a una: un Sabotaje hace fracasar la misión.</li>
<li><b>El interludio nocturno.</b> Cada uno anota una Sospecha secreta sobre quién es la Muerte. Tras las misiones 2, 3 y 4, quien tiene la Vela descubre el bando de un jugador, y la Vela pasa a ese jugador. Con las Pistas, al amanecer puede llegar una pista verdadera.</li>
</ol>`,
    missionsWin: `<ul>
<li><b>Tres éxitos:</b> la Muerte se desenmascara y el Segador señala a quien cree que es el Médium (la Muerte puede deliberar antes). Si acierta, gana la Muerte. Si falla, ganan los Vivos.</li>
<li><b>Tres fracasos:</b> la Última Resistencia. Cada uno señala a un jugador. Si la mesa señala a un Vivo, gana la Muerte; si atrapa a la Muerte, el Segador aún tiene el Ajuste de cuentas: si encuentra al Médium, la Muerte roba la victoria.</li>
<li><b>Las Misiones secundarias</b> cambian el peso de tu voto en la Última Resistencia: doble si cumpliste la tuya, la mitad si fallaste.</li>
<li>El Bufón, si está en juego, gana solo si lo señalan en la Última Resistencia o el Segador.</li>
</ul>`,
    missionsOpts: `<ul>
<li><b>Roles:</b> activar o quitar al Creyente, el Charlatán, el Velado, el Errante, el Enterrador y el Bufón, y añadir a los Gemelos.</li>
<li><b>Misiones secundarias:</b> un objetivo personal secreto para cada uno.</li>
<li><b>Siguiente Líder de la misión:</b> el siguiente en orden, o elegido por el último líder.</li>
<li><b>Cartas de misión:</b> desactivadas, raras o a veces.</li>
<li><b>Pistas:</b> raras, ocasionales o frecuentes.</li>
<li><b>Historia:</b> un QUIÉN / DÓNDE / POR QUÉ al azar, o el vuestro.</li>
</ul>`,
    exorcismSetup: `<p>De 3 a 12 jugadores, 5–10 minutos por ronda. Los Vivos conocen la contraseña secreta que desterraría al Demonio escondido entre ellos; el Demonio no la conoce. Todos ven la categoría. Las palabras aparecen en el idioma de la mesa en todos los móviles, para que coincidan.</p>`,
    exorcismLoop: `<ol>
<li><b>La bola de cristal.</b> Tócala para mirar dentro: la categoría y (si eres Vivo) la contraseña. El Demonio solo ve la categoría y tiene que tirarse un farol.</li>
<li><b>El sorteo.</b> Una lotería decide quién habla primero; después el turno sigue el orden de los asientos.</li>
<li><b>Una palabra cada uno.</b> En tu turno, di una palabra relacionada con la contraseña y después mantén pulsado el botón de tu móvil. Demuestra que la conoces sin dársela al Demonio. Según la sala, las palabras dan una o más vueltas, y pueden escribirse y mostrarse en la tele.</li>
<li><b>Señalar al Demonio.</b> Habladlo y luego todos votan a un jugador.</li>
<li><b>Un último intento.</b> Un Demonio descubierto puede decir la contraseña, desde la cuadrícula de palabras o escrita.</li>
</ol>`,
    exorcismWin: `<ul>
<li>La votación señala a un Vivo, o acaba en empate (salvo que la moneda decida los empates): <b>gana el Demonio</b>.</li>
<li>La votación señala al Demonio: <b>ganan los Vivos</b>, salvo que el Demonio adivine entonces la contraseña y robe la victoria.</li>
<li>Las puntuaciones se acumulan ronda tras ronda: cada Vivo +1 por victoria, cada Demonio +2.</li>
</ul>`,
    exorcismOpts: `<ul>
<li><b>Demonios:</b> uno, o dos desde 7 jugadores; dos Demonios pueden conocerse o no.</li>
<li><b>Un último intento:</b> activado o no.</li>
<li><b>Empate:</b> el Demonio escapa, o decide una moneda.</li>
<li><b>Cuadrícula de palabras:</b> 16 palabras en la tele y los móviles; la contraseña es una de ellas.</li>
<li><b>Rondas:</b> cuántas vueltas dan las palabras. <b>Escribir las palabras:</b> se muestran en la tele.</li>
<li><b>Categorías:</b> de qué listas de palabras se roba.</li>
</ul>`,
    coffinsSetup: `<p>De 3 a 10 jugadores, una partida rápida. Cada uno juega por su cuenta y tiene cuatro ataúdes: tres de Oro y una Maldición (cinco con la opción larga: cuatro de Oro, una Maldición). Tus ataúdes están ocultos para los demás.</p>`,
    coffinsLoop: `<ol>
<li><b>El entierro.</b> Todos entierran un ataúd en secreto a la vez: toca un ataúd y luego Enterrarlo. Tu tumba es una pila, el más reciente arriba.</li>
<li><b>Enterrar o desafiar.</b> Desde el primer jugador de la ronda, en tu turno entierras otro ataúd encima de tu pila, o desafías: «Puedo abrir N», como mucho tantos como haya enterrados en total.</li>
<li><b>La puja.</b> Alrededor de la mesa se sube la cifra o se pasa. Pasar vale para toda la ronda. El último pujador que queda es el Excavador.</li>
<li><b>La excavación.</b> El Excavador abre primero sus propios ataúdes, de arriba abajo, y luego elige otras tumbas, el ataúd de arriba cada vez, hasta abrir N. Cada ataúd se destapa en la tele.</li>
<li><b>El resultado.</b> Todo Oro: una excavación limpia, y tu lápida se dora. Una Maldición en tu propia tumba: eliges un ataúd que pierdes. La Maldición de otro: roba a ciegas uno de tus ataúdes, y desaparece; el dueño de la Maldición empieza la ronda siguiente.</li>
</ol>`,
    coffinsWin: `<ul>
<li>Gana con dos excavaciones limpias (1 o 3 en la sala), o siendo el último jugador con ataúdes.</li>
<li>En un encuentro: el ganador +3, cada excavación limpia +1, cada vuelta de entre los muertos +1.</li>
</ul>`,
    coffinsOpts: `<ul>
<li><b>El ataúd de la Muerte</b> (activado por defecto): en cada ronda lo tiene un jugador oculto en lugar de un ataúd de Oro. Si lo desentierras, la excavación fracasa; su dueño te roba un ataúd, que se vuelve de Oro.</li>
<li><b>Apuestas de fantasmas y Aparecidos</b> (activado por defecto): los jugadores sin ataúdes apuestan Oro o Maldición en cada excavación; tres aciertos y vuelven con un ataúd de Oro.</li>
<li><b>Reliquias</b> (desactivado por defecto): un Farol secreto (mirar una tumba), una Llave (abrir otra tumba antes que la tuya) o una Protección (una maldición no cuesta nada), cada una de un solo uso.</li>
<li><b>Excavaciones limpias para ganar, ataúdes por jugador, partidas por encuentro.</b></li>
</ul>`,
    carnivalSetup: `<p>De 4 a 12 jugadores. Cada uno juega por su cuenta. Cada máscara es un rol conocido de Dead Set, con un poder. Todos empiezan con 6 Almas; la Ofrenda, el plato del centro de la mesa, empieza vacía. Con 4–5 jugadores hay dos máscaras más en sillas vacías: van al baile pero nunca actúan.</p>
<p><b>El desenmascaramiento:</b> durante unos segundos todas las máscaras se muestran boca arriba, en la tele y en cada móvil. Recordadlas; luego se ponen boca abajo. Una lotería elige al primer bailarín, y se sigue en el sentido de las agujas del reloj.</p>`,
    carnivalLoop: `<p>En tu turno, haz una de tres cosas:</p>
<ul>
<li><b>Intercambiar o fingir.</b> Elige otra máscara (un jugador o una silla vacía) y mantén pulsado Intercambiar o Fingir. Los dos botones son iguales, y nadie, ni siquiera el otro jugador, sabe cuál elegiste.</li>
<li><b>Echar un vistazo.</b> Mira tu propia máscara un momento. Todos ven que has mirado.</li>
<li><b>Reclamar.</b> Nombra una máscara, «Soy el Magistrado», y usa su poder.</li>
</ul>
<p><b>Desafíos.</b> Cuando alguien reclama, cada uno de los otros móviles pregunta: <em>¿Es tu máscara?</em> Si nadie desafía, la reclamación vale y el poder funciona, lleve lo que lleve en realidad quien reclama. Si alguien desafía, quien reclama y todos los que desafían levantan sus máscaras: quien de verdad la lleva usa el poder, y todos los demás descubiertos pagan un Alma (o más, según la sala) a la Ofrenda.</p>
<p><b>La danza de apertura.</b> El primer turno de cada jugador (dos, si el anfitrión quiere) debe ser Intercambiar o fingir, para que las máscaras ya estén en duda antes de la primera reclamación.</p>`,
    carnivalWin: `<ul>
<li><b>Bolsa llena:</b> 13 Almas (o la cifra de la sala) y ganas al instante.</li>
<li><b>La cosecha de la Muerte:</b> gana el jugador que ha cosechado 6 Almas con reclamaciones de la Muerte.</li>
<li><b>La ruina:</b> en cuanto alguien baja a 0 Almas, gana el más rico (en empate, la cosecha más alta).</li>
<li>En un encuentro: el ganador +3, todos los demás +1 por cada Alma por encima de 6.</li>
</ul>`,
    carnivalOpts: `<ul>
<li><b>Máscaras:</b> el conjunto recomendado crece con la mesa; o montad el vuestro, una máscara por asiento (la Muerte es obligatoria; solo el Inocente puede repetirse).</li>
<li><b>Bolsa llena, la cosecha de la Muerte, la penalización por reclamar mal, la danza de apertura, partidas por encuentro.</b></li>
<li><b>Notas (el diario del baile):</b> desactivadas por defecto, para que guardéis lo que visteis en la cabeza.</li>
</ul>
<p>Toca <em>Máscaras en el baile</em> cuando quieras: cada máscara en juego y su poder, dibujado como una línea de signos.</p>`,
    midnightSetup: `<p>De 4 a 12 jugadores, unos 10 minutos. Una noche, una votación, sin segundas oportunidades. El mazo tiene una carta por jugador más tres boca abajo en la mesa (las sillas vacías). El mazo es público; quién tiene qué, no. Cada uno ve su propia carta una vez, al repartir.</p>
<p>Las cartas cambian de manos a oscuras. <b>Al amanecer eres la carta que tienes delante</b>, no la que te repartieron.</p>`,
    midnightLoop: `<ol>
<li><b>El reparto.</b> Mira tu carta una vez.</li>
<li><b>La noche.</b> Los móviles despiertan cada rol por turno: Imitador, Muerte, Conspirador, Gemelos, Mentalista, Agente doble, Bruja, Apostador, Insomne. Cada paso dura los mismos 10 segundos y ocurre aunque su carta esté en la mesa, para que la noche no delate nada. Solo quien recibió esa carta tiene controles; todos los demás móviles dicen que mantengas los ojos cerrados. Un Apostador que no hace nada se cambia por una carta de la mesa al azar.</li>
<li><b>El día.</b> Una discusión (5 minutos por defecto): afirmad, acusad, mentid. Las cartas pueden haberse movido; no os fieis de nadie, ni de vosotros mismos. El anfitrión puede abrir la votación antes.</li>
<li><b>La votación.</b> Todos señalan a otro jugador a la vez. El más votado muere, si tiene al menos dos votos; si hay empate en cabeza, mueren todos los empatados. Si muere el Justiciero, también muere el jugador al que señaló.</li>
</ol>`,
    midnightWin: `<ul>
<li>Los bandos se leen en las cartas al amanecer (un Imitador cuenta como el rol que copió).</li>
<li><b>Los Vivos</b> ganan si muere al menos una Muerte; si no hay ninguna Muerte entre los jugadores, si no muere nadie.</li>
<li><b>La Muerte y el Conspirador</b> ganan si no muere ninguna Muerte (y el Bufón no murió).</li>
<li><b>El Bufón</b> gana solo si lo eliminan en la votación. Varios bandos pueden ganar a la vez.</li>
<li>En un encuentro: cada ganador +1, el Bufón +2. La pantalla final muestra cada carta tal como se repartió y al amanecer, y repite la noche.</li>
</ul>`,
    midnightOpts: `<ul>
<li><b>Cartas:</b> el mazo recomendado crece con la mesa; o elegidlas vosotros (Muerte 1–2, Gemelos 0 o 2, Inocente 0–4, el resto 0–1; en total jugadores + 3).</li>
<li><b>Una Muerte sola echa un vistazo:</b> una Muerte que despierta sola puede mirar una carta de la mesa.</li>
<li><b>Duración de la discusión, partidas por encuentro.</b></li>
</ul>`,
    seanceSetup: `<p>De 4 a 10 jugadores, unos 30 minutos. Un misterio de asesinato cooperativo con un traidor. Un jugador es el Fantasma: sabe quién lo mató, dónde y por qué, y no puede hablar. Todos los demás son Médiums que leen sus visiones. Desde cinco jugadores, un Impostor puede esconderse entre los Médiums: un segundo espíritu que conoce la verdad y juega contra la mesa.</p>
<p><b>El tablero:</b> tres filas de cartas de historia, QUIÉN, DÓNDE y POR QUÉ. En cada fila, una carta es la verdad.</p>`,
    seanceLoop: `<ol>
<li><b>Visiones.</b> En cada ronda, cada Médium recibe una fila. El Fantasma elige de su mano una visión para cada uno: una carta con dos o tres motivos grabados que debe apuntar a la verdad de esa fila.</li>
<li><b>La revelación.</b> Las visiones se destapan para todos. Describidlas, discutid, convenced. El Fantasma calla, pero puede helar una visión con una mancha fría: <em>esta no es mía</em>.</li>
<li><b>El cambio del Impostor.</b> Unas cuantas veces por partida, el Impostor cambia en secreto la visión de otro Médium por una de sus mentiras.</li>
<li><b>Velas.</b> Cada Médium enciende una vela sobre una carta de su fila, o se la guarda. La carta con más velas se presenta al espíritu. Si acierta, la fila queda resuelta. Si no, la carta se tacha.</li>
<li><b>El reloj.</b> Cada ronda consume una vela del reloj de la sesión (siete en dificultad Estándar).</li>
</ol>`,
    seanceWin: `<ul>
<li>Resolved las tres filas antes de que se consuman las velas y luego señalad al Impostor. Si acertáis: una <b>victoria plena</b>. Si no: una <b>victoria hueca</b>, compartida con el Impostor.</li>
<li>Si el reloj se consume, gana el Impostor (sin Impostor, la mesa pierde). Si solo queda una fila, antes todos encienden en ella una vela del último aliento.</li>
<li>En un encuentro: una victoria plena +2 para el Fantasma y cada Médium; una hueca +1 para cada uno y +1 para el Impostor; una victoria del Impostor +3.</li>
<li>La pantalla final repite cada ronda: las visiones verdaderas, los cambios y las velas.</li>
</ul>`,
    seanceOpts: `<ul>
<li><b>Dificultad:</b> cuántas cartas por fila, visiones por Médium y velas en el reloj.</li>
<li><b>Impostores:</b> ninguno, uno o dos, y si dos se conocen; cuántos cambios tienen.</li>
<li><b>Las manchas frías del Fantasma:</b> cuántas visiones puede helar.</li>
<li><b>Último aliento:</b> activado o no. <b>El Fantasma:</b> por sorteo, o lo elige el anfitrión. <b>Partidas por encuentro.</b></li>
</ul>`,
    graveSetup: `<p>De 4 a 12 jugadores, unos 15 minutos. Dos cuadrillas de saqueadores de tumbas, la Luna y el Sol, excavan un cementerio de 25 lápidas en busca de las reliquias que invocarán a su deidad. Una moneda decide la cuadrilla que excava primero: tiene 9 reliquias bajo tierra, la otra 8. Siete tumbas están vacías y una es la de la Muerte.</p>
<p>Cada cuadrilla tiene un <b>Enterrador</b>, el único jugador que ve el registro de sepulturas: qué hay bajo cada lápida. Todos los demás excavan. Las lápidas muestran palabras en el idioma de la mesa, o iconos a lápiz.</p>`,
    graveLoop: `<ol>
<li><b>La señal.</b> En el turno de su cuadrilla, el Enterrador da una palabra y un número, «Océano · 3»: una palabra que une varias tumbas de su cuadrilla, y cuántas. La palabra no puede estar en el tablero. Después no dice nada más.</li>
<li><b>La excavación.</b> Los excavadores lo hablan y votan en sus móviles; se excava la tumba más votada (en empate, decide la moneda).</li>
<li><b>Lo que hay debajo.</b> Una reliquia de tu cuadrilla: seguid excavando, hasta el número. Una tumba vacía, o una reliquia de la otra cuadrilla (ahora es suya): el turno pasa. La tumba de la Muerte: vuestra cuadrilla pierde al instante.</li>
<li><b>Parar.</b> La cuadrilla puede votar parar. Parar antes de llegar al número guarda una excavación extra para el turno siguiente (nunca se acumula).</li>
</ol>
<p>Cambia tu móvil entre <em>Lápidas</em> (las palabras o iconos) y <em>Mapa</em> (el tablero de un vistazo).</p>
<p><b>Tres cuadrillas</b> (6–12 jugadores): la Luna, el Sol y las Estrellas, un tercio de la mesa cada una. La primera cuadrilla esconde 7 reliquias, las otras 6 cada una, con 5 tumbas vacías. La tumba de la Muerte deja a una cuadrilla fuera del juego; las demás siguen excavando, y cuando queda una sola, gana.</p>`,
    graveWin: `<ul>
<li>Gana la primera cuadrilla con todas sus reliquias desenterradas, aunque la otra haya desenterrado algunas por error.</li>
<li>La cuadrilla que abre la tumba de la Muerte pierde al instante (con tres cuadrillas, queda fuera).</li>
<li>En un encuentro de 1, 3 o 5 partidas: cada victoria +1. Los Enterradores rotan entre partidas.</li>
</ul>`,
    graveOpts: `<ul>
<li><b>Número de cuadrillas:</b> dos, o tres desde 6 jugadores.</li>
<li><b>En las tumbas:</b> palabras o iconos; <b>nombres famosos</b> (películas, héroes, monumentos) activados o no.</li>
<li><b>Cuadrillas:</b> por asiento (mueve jugadores alrededor de la mesa para cambiar de cuadrilla) o al azar. <b>Enterradores:</b> rotativos, al azar o elegidos.</li>
<li><b>Señales:</b> escritas (la palabra aparece en todas las pantallas) o habladas (dichas en voz alta, el número tocado). <b>Partidas por encuentro.</b></li>
</ul>`,
    mimicSetup: `<p>De 4 a 12 jugadores, unos 8 minutos por partida. Todos comparten un lugar secreto, una carta de historia, y allí interpretan un personaje, salvo el Imitador, que solo ve estática y el tablero de lugares posibles. Los Vivos deben encontrar al Imitador; el Imitador debe averiguar el lugar.</p>`,
    mimicLoop: `<ol>
<li><b>Preguntas.</b> Quien tiene el farol hace en voz alta una pregunta sobre el lugar a quien quiera y luego toca a la persona preguntada; el farol pasa a ella, y es quien pregunta después. Nunca devuelvas la pregunta a quien acaba de preguntarte. Responde para que los Vivos te reconozcan, sin darle el lugar al Imitador.</li>
<li><b>Acusar.</b> Una vez por partida, cada uno puede acusar a un jugador. El reloj se detiene; todos los demás votan De acuerdo o En desacuerdo. Solo una mesa unánime condena; si no, el reloj sigue.</li>
<li><b>El Imitador se desenmascara.</b> En cualquier momento el Imitador puede revelarse y decir el lugar.</li>
<li><b>Se acabó el tiempo.</b> Cuando se agota el reloj (8 minutos por defecto), todos señalan a un sospechoso. El más votado es condenado; en empate, el Imitador se escapa.</li>
</ol>
<p>Tacha lugares en tu móvil mientras escuchas: tus notas son privadas.</p>`,
    mimicWin: `<ul>
<li>Condenad al Imitador: <b>ganan los Vivos</b>, salvo que el Imitador descubierto diga entonces el lugar y robe la victoria.</li>
<li>Condenad a un Vivo, o dejad escapar al Imitador: <b>gana el Imitador</b>.</li>
<li>El Imitador dice el lugar: si acierta, gana; si falla, ganan los Vivos.</li>
<li>En un encuentro (3 partidas por defecto): los Vivos +1 cada uno, y quien acusó y atrapó al Imitador +1 más; el Imitador +2, o +3 por acertar el lugar.</li>
</ul>`,
    mimicOpts: `<ul>
<li><b>Lugares en el tablero:</b> más lugares se lo ponen más difícil al Imitador.</li>
<li><b>Último intento:</b> un Imitador descubierto aún puede decir el lugar.</li>
<li><b>El fondo de la tele se aclara:</b> una opción de confianza. La tele muestra el lugar verdadero muy desenfocado, que se aclara a medida que pasa el tiempo. Quien abra el enlace de la tele podría leerlo.</li>
<li><b>Tiempo de preguntas, partidas por encuentro.</b></li>
</ul>`,
    omenSetup: `<p>De 4 a 12 jugadores, unos 10 minutos. Cada uno juega por su cuenta; no hay bandos ocultos. Una rueda oculta apunta a una de tres caras, Vida, Muerte y Renacimiento, en ese orden en el sentido de las agujas del reloj. Todos empiezan con 5 de Influencia, a la vista de todos.</p>`,
    omenLoop: `<p>Siete rondas, cada una en tres pasos:</p>
<ol>
<li><b>La rueda</b> muestra dónde empieza esta ronda.</li>
<li><b>La papeleta sellada.</b> En secreto, predice dónde se detendrá la rueda, y elige girarla un paso atrás, un paso adelante o dejarla. Un giro cuesta una Influencia; sin Influencia solo puedes dejarla. Puedes cambiar tu papeleta hasta que todos hayan votado.</li>
<li><b>La revelación.</b> Se suman todos los giros y la rueda se mueve una sola vez, por el total (tres pasos en el mismo sentido la devuelven al inicio). Después se muestran todas las predicciones y todos los giros.</li>
</ol>
<p>El arte es leer la mesa: ¿quién tiene aún Influencia, quién quiere la rueda dónde, y quién la va a empujar?</p>`,
    omenWin: `<ul>
<li>Una predicción acertada da 3 puntos. Una papeleta que falta no predice nada y no gira nada.</li>
<li>Al final, cada Influencia sin usar vale 1 punto. Gana quien tenga más puntos; los empates comparten la victoria.</li>
</ul>`,
    omenOpts: `<p>Sin interruptores: solo los temporizadores de cada paso.</p>`,
    mirrorSetup: `<p>De 4 a 12 jugadores, unos 15 minutos. Cada uno juega por su cuenta. Un espejo embrujado no muestra tu reflejo: muestra lo que tus amigos creen que harías. Ocho dilemas inventados, cada uno con tres respuestas, A, B y C, y ninguna es la correcta.</p>
<p>En cada ronda lees a otro jugador. Las parejas rotan, así que a lo largo de la partida todos leen a todos, y a cada uno lo lee exactamente un jugador en cada ronda.</p>`,
    mirrorLoop: `<ol>
<li><b>Habladlo.</b> El dilema y quién lee a quién son públicos. Preguntad, picad, despistad.</li>
<li><b>La papeleta sellada.</b> Elige tu propia respuesta y predice la del jugador que lees. Hacen falta las dos, y puedes cambiarlas hasta que todos hayan votado.</li>
<li><b>El espejo lo muestra todo:</b> cada respuesta y cada lectura, acertada o no.</li>
</ol>`,
    mirrorWin: `<ul>
<li>Una predicción acertada da 2 puntos; tu propia respuesta no da nada, así que sorprender a tu lector es juego limpio.</li>
<li>Una papeleta que falta se convierte en una respuesta al azar; a su lector se le puntúa igual con ella.</li>
<li>Gana el mejor lector; los empates comparten la victoria.</li>
</ul>`,
    mirrorOpts: `<p>Sin interruptores aparte de los temporizadores. Cuando haya más paquetes de dilemas, la sala os dejará elegir de cuáles se roban los ocho.</p>`,
  },
};
