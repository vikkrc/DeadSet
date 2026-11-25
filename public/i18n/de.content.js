// Deutsch: Spielinhalte (Rollen, Träume, Regelkarten, Modi, Szenariokarten, Anleitung).
export default {
  and: 'und',
  numbers: ['kein', 'ein', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun', 'zehn'],
  roles: {
    G_UNDERTAKER: { name: "Totengräber", when: "Immer", summary: "Du hast das Grabregister. Gib deiner Bande ein Wort und eine Zahl.", detail: "Nur du und der andere Totengräber wisst, was unter jedem Stein liegt. Dein Wort soll so viele Gräber deiner Bande verbinden und weit weg vom Grab des Todes führen." },
    G_DIGGER: { name: "Grabräuber", when: "Immer", summary: "Lies das Zeichen deines Totengräbers und grab die Reliquien deiner Bande aus.", detail: "Beratet euch, dann stimm auf dem Handy für ein Grab. Eure Reliquie: weitergraben. Ein leeres Grab oder eine Reliquie der anderen Bande: Der Zug geht weiter. Das Grab des Todes: Eure Bande verliert." },
    O_SEER: { name: "Seher", when: "Immer", summary: "Sag voraus, wo das Rad stehen bleibt, und dreh es, wenn es sich lohnt.", detail: "Sag jede Runde heimlich Leben, Tod oder Wiedergeburt voraus und entscheide, ob du das Rad einen Schritt drehst (es kostet einen deiner fünf Einflüsse). Alle Drehungen werden addiert. Ein Treffer bringt 3; unbenutzter Einfluss am Ende je 1." },
    W_READER: { name: "Leser", when: "Immer", summary: "Beantworte das Dilemma für dich und sag einen Freund voraus.", detail: "Jede Runde beantwortest du ein erfundenes Dilemma und sagst die Antwort der Person voraus, die du liest. Ein Treffer bringt 2; deine eigene Antwort nichts, also darfst du deinen Leser ruhig überraschen." },
    Q_MIMIC: { name: "Nachahmer", when: "Immer", summary: "Du trägst das Gesicht eines Freundes. Du weißt nicht, wo du bist.", detail: "Alle anderen sind am selben Ort. Hör den Fragen zu, antworte, als gehörtest du dazu, und finde den Ort heraus. Enttarne dich jederzeit und nenne ihn, um zu gewinnen; ein verurteilter Nachahmer hat noch einen letzten Tipp." },
    Q_LIVING: { name: "Lebender", when: "Immer", summary: "Du kennst den Ort. Beweise es, ohne ihn zu verraten.", detail: "Stell und beantworte Fragen zum Ort: genau genug, um zu zeigen, dass du dort warst, vage genug, dass der Nachahmer ihn nicht errät. Beschuldige einmal pro Spiel; nur ein einstimmiger Tisch verurteilt." },
    S_GHOST: { name: "Geist", when: "Immer", summary: "Du wurdest ermordet. Du weißt wer, wo und warum, und kannst nicht sprechen.", detail: "Schick jedem Leser eine Vision zu seiner Reihe. Mit einem kalten Fleck vereist du eine Vision, die nicht von dir ist." },
    S_MEDIUM: { name: "Medium", when: "Immer", summary: "Lies die Visionen und entzünde Kerzen auf die Wahrheit.", detail: "Jede Runde liest du eine Reihe: wer, wo oder warum. Löst alle drei, bevor die Kerzen herunterbrennen, dann nennt den Täuscher." },
    S_DECEIVER: { name: "Täuscher", when: "Immer", summary: "Ein zweiter Geist in einem lebenden Körper. Du kennst die Wahrheit, und du lügst.", detail: "Du siehst genau aus wie ein Medium. Ein paarmal pro Spiel tauschst du die Vision des Geistes für einen anderen Leser gegen deine eigene. Du gewinnst, wenn die Kerzen herunterbrennen oder der Tisch den falschen Spieler nennt." },
    N_SLEEPER: { name: "Schläfer", when: "Immer", summary: "Eine Nacht, eine Abstimmung. Deine Karte kann den Besitzer wechseln, während du schläfst.", detail: "Sieh dir deine Karte einmal an, handle, wenn dein Handy dich weckt, dann streitet und zeigt. Du bist die Karte, die im Morgengrauen vor dir liegt." },
    N_TWIN: { name: "Zwilling", when: "Nachts", summary: "Du wachst mit deinem Zwilling auf, und ihr seht euch.", detail: "Die Zwillinge kommen als Paar. Ist dein Zwilling nicht am Tisch, liegt die zweite Karte in der Mitte." },
    N_INSOMNIAC: { name: "Schlaflose", when: "Nachts, zuletzt", summary: "Du wachst zuletzt auf und siehst deine eigene Karte an.", detail: "Du siehst, ob dir jemand in der Nacht die Karte genommen hat, und was du im Morgengrauen bist." },
    K_GUEST: { name: "Maskierter Gast", when: "Immer", summary: "Tanze, spähe und beanspruche Masken, um Seelen zu sammeln. 13 Seelen gewinnen.", detail: "Deine Maske ist eine Rollenkarte, die du einmal gesehen hast. Tausche oder täusche, um sie zu verbergen; späh, um sie zu kennen; beanspruche eine Maske, um ihre Kraft zu nutzen. Wer glaubt, sie sei seine, kann dich herausfordern." },
    C_DIGGER: { name: "Totengräber", when: "Immer", summary: "Vergrabe deine Särge, biete, wie viele du öffnen kannst, und grabe. Zwei saubere Grabungen gewinnen.", detail: "Dein Fluch ist dein Bluff: Vergrabe ihn, damit andere darüber stolpern. Gewinnst du das Bieten, öffnest du zuerst dein eigenes Grab." },
    X_LIVING: { name: "Lebend", when: "Immer", summary: "In der Kristallkugel siehst du das Passwort. Sag ein Wort, das beweist, dass du es kennst, ohne es dem Dämon zu verraten.", detail: "Zu offensichtlich, und der Dämon kennt das Passwort. Zu rätselhaft, und der Tisch verdächtigt dich. Dann benennt den Dämon." },
    X_DEMON: { name: "Dämon", when: "Immer", summary: "Du siehst nur die Kategorie. Fall nicht auf: Sag ein Wort, als würdest du das Passwort kennen.", detail: "Hör den anderen zu und knack das Passwort. Benennt der Tisch jemand anderen, gewinnst du. Wirst du entlarvt, gewinnt ein richtiger Tipp trotzdem." },
    M_JESTER: { name: "Narr", when: "Immer", summary: "Du gewinnst allein, wenn der Tisch dich im Letzten Gefecht benennt oder der Schnitter dich in der Abrechnung benennt.", detail: "Du bist weder Lebend noch Tod: Das Medium sieht dich nicht, die Kerze zeigt dich als Lebend. Auf Missionen darfst du Erfolg oder Sabotage spielen. Wirk verdächtig, aber nicht zu sehr." },
    TWIN: { name: "Zwilling", when: "Immer", summary: "Es gibt zwei Zwillinge. Ihr kennt einander und gehört beide zu den Lebenden.", detail: "Du kannst nur Erfolg spielen. Vertrau deinem Zwilling, aber Vorsicht: Bürgt ihr zu laut füreinander, weiß der Tod, wo er suchen muss." },
    UNDERTAKER: { name: "Totengräber", when: "Nach einer gescheiterten Mission", summary: "Scheitert eine Mission, erfährst du, wie viele Tod-Spieler in diesem Team waren.", detail: "Gezählt wird jeder Tod-Spieler, auch der Verschleierte und der Streuner, egal welche Karte sie spielten. Nur du hörst es. Du kannst nur Erfolg spielen." },
    MEDIUM: { name: "Medium", when: "Immer", summary: "Du siehst jeden Spieler des Todes, außer dem Verschleierten. Lenke die Expedition, ohne dich zu verraten.", detail: "Gewinnen die Lebenden drei Missionen oder fangen sie im letzten Gefecht einen Spieler des Todes, darf der Tod einmal raten, wer du bist. Nennt er dich, gewinnt der Tod." },
    BELIEVER: { name: "Gläubiger", when: "Immer", summary: "Du siehst zwei Kerzen: das Medium und den Scharlatan. Du weißt nicht, wer wer ist.", detail: "Finde heraus, welche Kerze das echte Medium ist, und schütze es – oft, indem du dich selbst wie das Medium verhältst. Ohne Scharlatan im Spiel ist deine einzige Kerze das Medium." },
    COMPANION: { name: "Gefährte", when: "Immer", summary: "Du weißt nichts außer deinem eigenen Herzen. Beobachte die Abstimmungen und die Missionen.", detail: "Du kannst nur Erfolg spielen. Lies, wer wen vorschlägt, wer welchem Team zustimmt und welche Missionen scheitern." },
    REAPER: { name: "Schnitter", when: "Immer", summary: "Du führst den Tod an. In der Abrechnung entscheidest du, wer das Medium ist.", detail: "Du siehst den Rest des Todes (außer dem Streuner). Auf einer Mission darfst du Erfolg oder Sabotage spielen. Dein Team kann in der Abrechnung Namen vorschlagen; deine Wahl zählt." },
    CHARLATAN: { name: "Scharlatan", when: "Immer", summary: "Für den Gläubigen siehst du genau wie das Medium aus. Nutze es.", detail: "Du siehst den Rest des Todes (außer dem Streuner). Auf einer Mission darfst du Erfolg oder Sabotage spielen." },
    VEILED: { name: "Verschleierter", when: "Immer", summary: "Das Medium kann dich nicht sehen.", detail: "Du siehst den Rest des Todes (außer dem Streuner). Auf einer Mission darfst du Erfolg oder Sabotage spielen." },
    STRAY: { name: "Streuner", when: "Immer", summary: "Du dienst dem Tod allein: Du kennst die anderen nicht, und sie kennen dich nicht.", detail: "Das Medium sieht dich trotzdem. Auf einer Mission darfst du Erfolg oder Sabotage spielen. In der Abrechnung enttarnt sich der Tod, und du schließt dich den anderen an." },
    SHADE: { name: "Schatten", when: "Immer", summary: "Du gehst mit dem Tod und kennst deine Mitspieler.", detail: "Du siehst den Rest des Todes (außer dem Streuner). Auf einer Mission darfst du Erfolg oder Sabotage spielen." },
    CULT_LEADER: { name: "Sektenführer", when: "Jede Nacht", summary: "Wirb jede Nacht einen Spieler für die Sekte an. Die Sekte gewinnt, sobald sie in der Überzahl ist.", detail: "Ein Angeworbener behält Rolle und Fähigkeiten, gewinnt aber jetzt mit der Sekte und erfährt, wer die anderen Mitglieder sind. Tod-gesinnte Spieler, der Ripper und geschützte Spieler können nicht angeworben werden. Stirbt der Führer, kann niemand mehr anwerben." },
    RIPPER: { name: "Der Ripper", when: "Jede Nacht", summary: "Töte jede Nacht allein einen Spieler. Du gewinnst als Letzter, der noch steht, oder allein mit einem anderen, der kein Mörder ist.", detail: "Dein Mord wird von denselben Schutzwirkungen gestoppt wie der des Todes (Wächter, Schutzengel, Hexensegen, vorübergehende Wiederbelebung). Der Tod kann dich nachts nicht töten, außer bei Blutmond. Du giltst als NICHT TOD-GESINNT." },
    DEATH: { name: 'Tod', when: 'Jede Nacht', summary: 'Einigt euch mit allen lebenden Tod-Mitspielern jede Nacht auf einen gemeinsamen Mord.', detail: 'Alle aktiven Tod-Spieler müssen genau dieselbe Zielmenge bestätigen, sonst passt die Fraktion. Grundsätzlich gibt es einen Mord; Doppelte Gefahr, Nachtschicht oder Kraftschub können ihn auf höchstens zwei erhöhen — nie einen Mord pro Tod-Spieler.' },
    INNOCENT: { name: 'Unschuldiger', when: 'Tag', summary: 'Keine Fähigkeit. Deine Stimme und dein Votum sind deine Waffe.', detail: 'Argumentiere, beschuldige, stimme ab. Auch du erhältst jede Nacht einen Traum und kannst von Zuständen betroffen sein.' },
    MENTALIST: { name: 'Mentalist', when: 'Jede Nacht', summary: 'Lies einen anderen Spieler: Steht er auf der Seite des Todes oder nicht?', detail: 'Du erfährst nur die aktuelle Gesinnung des Ziels (TOD-GESINNT / NICHT TOD-GESINNT), nie seine genaue Rolle. Eine blockierte Lesung ergibt nichts.' },
    GUARDIAN: { name: 'Wächter', when: 'Jede Nacht', summary: 'Schütze einen Spieler (auch dich selbst) vor dem Tod und dem Psycho.', detail: 'Stoppt nur den Mord der Tod-Fraktion und den Zustand des Psychos. Nicht Bomben, Selbstjustiz, Sündenbock, verbundene Schicksale oder Ablauf. Du darfst dasselbe Ziel wiederholen.' },
    PSYCHO: { name: 'Psycho', when: 'Nachts (standardmäßig einmal pro Spiel)', summary: 'Einmal: Bring jemanden zum Schweigen oder nimm ihm für den nächsten Tag die Stimme.', detail: 'STUMM: darf in der Diskussion nicht sprechen, aber nominieren und abstimmen. KEINE STIMME: darf sprechen, aber nicht abstimmen. Wächter, Schutzengel und Hexensegen blockieren es. Die Ladung ist auch bei Blockade verbraucht. Wie oft, bestimmt der Tisch: standardmäßig einmal pro Spiel; der Gastgeber kann einmal Stumm und einmal Keine Stimme erlauben oder eine Markierung jede Nacht.' },
    WHORE: { name: 'Hure', alias: 'Begleiterin', when: 'Jede Nacht', summary: 'Besuche jemanden. Besuchst du einen Tod, scheitert der Mord des ganzen Teams.', detail: 'Ist die besuchte Person ein aktiver Tod, sinkt die Mordkapazität der Fraktion auf 0. Wird die besuchte Person vom Tod getötet, stirbst du mit; wird sie in die Luft gesprengt, erwischt dich die Explosion.' },
    TRAVELING_AGENT: { name: 'Handelsreisender', when: 'Jede Nacht', summary: 'Liefere ein rätselhaftes Produkt. Reine Atmosphäre — und eine Visitenkarte.', detail: 'Der Empfänger erfährt bei Tagesanbruch, dass ein Handelsreisender bei ihm war. Das Produkt hat keine Wirkung, doch der Besuch selbst ist eine Information, die ihr beide nutzen könnt.' },
    TERRORIST: { name: 'Terrorist', when: 'Jede Nacht', summary: 'Leg eine Bombe vor eine Tür. Fifty-fifty, dass sie hochgeht.', detail: 'Der Server wirft eine faire Münze. Bei JA stirbt das Ziel, und jede Hure, die es besucht, stirbt in der Explosion. Der Wächter hält keine Bombe auf; Schutzengel, Hexensegen und vorübergehende Wiederbelebung schon.' },
    MIMIC: { name: 'Nachahmer', when: 'Nur Nacht 1 (Pflicht)', summary: 'Werde in Nacht 1 dauerhaft eine Kopie der Rolle eines anderen.', detail: 'Du übernimmst Rolle und Gesinnung des Ziels mit frischen Ladungen. Kopierte Fähigkeiten wirken ab Nacht 2; ein kopierter Tod tritt ab Nacht 2 dem Team bei. Kopierst du einen Nachahmer — oder wählst gar nicht —, bleibst du für den Rest des Spiels ein machtloser Nachahmer.' },
    DOUBLE_AGENT: { name: 'Doppelagent', when: 'Nur Nacht 1 (Pflicht)', summary: 'Wähle in Nacht 1 heimlich deine Seite für den Rest des Spiels.', detail: 'Wähle TOD oder NICHT-TOD. Wählst du den Tod, wechselst du am Ende von Nacht 1 die Seite; ab Nacht 2 bist du im Raum des Todesteams und teilt seinen einen Mord. Ohne Wahl bleibst du Nicht-Tod.' },
    DIPLOMAT: { name: 'Diplomat', when: 'Einmal pro Spiel, Tag (vor den Nominierungen)', summary: 'Einmal: Erkläre dich für einen Tag immun gegen eine Verurteilung.', detail: 'Wird öffentlich im Morgenfenster erklärt. An diesem Tag kannst du nicht nominiert werden. Schützt nicht vor nächtlichen Morden, Bomben, Selbstjustiz oder Sündenbock.' },
    SCAPEGOAT: { name: 'Sündenbock', when: 'Passiv, Tag', summary: 'Endet ein Tag ohne Verurteilung, stirbst du an ihrer Stelle.', detail: 'Gleichstand, keine Nominierungen, keine Stimmen, gescheiterte Mehrheitsregel oder Aufhebung durch den Spieler — alles zählt als „keine Verurteilung“. Das ist ein Mord, keine Verurteilung. Pro Tag stirbt nur ein Sündenbock (der mit dem niedrigsten Platz).' },
    NECROMANCER: { name: 'Nekromant', when: 'Einmal pro Spiel, nachts', summary: 'Einmal: Erwecke einen ausgeschiedenen Spieler für einen Tag und eine Nacht.', detail: 'Der Zurückgekehrte behält Rolle und Gesinnung, ist während der Wiederbelebung gegen jeden Mord immun und vergeht nach der folgenden Nacht. Du musst die Nacht überleben, damit das Ritual wirkt. Jeder kann nur einmal wiederbelebt werden.' },
    CONSPIRATOR: { name: 'Verschwörer', when: 'Passive Tagesstimme, Nachtchat', summary: 'Deine Stimme zählt +1. Nachts öffnest du ein privates Flüstern mit einem Spieler.', detail: 'Deine Stimme trägt ein zusätzliches Gewicht auf denselben Kandidaten. Jede Nacht darfst du einen kurzen Textkanal zu zweit mit einem lebenden Spieler öffnen; er verrät für sich keine Rollen.' },
    MAGISTRATE: { name: 'Richter', when: 'Passiv, Tag', summary: 'Deine Stimme wiegt 2 (3 bei Paranoia).', detail: 'Eine Stimme, ein Kandidat, doppeltes Gewicht. Ein „Keine Stimme“ des Psychos senkt sie auf null.' },
    ORACLE: { name: 'Orakel', when: 'Einmal pro Spiel, nachts', summary: 'Einmal: Errate, wen der Tod heute Nacht holt. Liegst du richtig, überlebt die Person.', detail: 'Steht deine Vorhersage in der bestätigten Zielmenge der Tod-Fraktion, ist dieser Spieler vor einem Mord des Todes geschützt. Ein falscher Tipp oder ein Pass des Todes bringt nichts.' },
    GAMBLER: { name: 'Spieler', when: 'Einmal pro Spiel, nachts', summary: 'Einmal: Wette auf den ersten Nominierten von morgen. Gewinnst du, hängt niemand.', detail: 'Stimmt die erste offizielle Nominierung des nächsten Tages mit deiner Wette überein, wird die Verurteilung des Tages vor der Auszählung aufgehoben. Ein Sündenbock kann durch die fehlende Verurteilung trotzdem sterben.' },
    VIGILANTE: { name: 'Rächer', when: 'Einmal pro Spiel, Tag (vor den Nominierungen)', summary: 'Einmal: Erschieße morgens einen Spieler, ganz ohne Abstimmung.', detail: 'Ein Rollenmord, keine Verurteilung. Diplomatische Immunität hält ihn nicht auf. Der Sieg wird sofort danach geprüft.' },
    JESTER: { name: 'Narr', when: 'Unabhängig', summary: 'Du gewinnst allein — aber nur, wenn die Stadt dich verurteilt.', detail: 'Jeder andere Tod (Nachtmord, Bombe, Rächer, Sündenbock) zählt nicht. Bis zum Ende zu überleben ist auch kein Sieg. Gegen die Mehrheit des Todes zählst du als „anderer“ Spieler.' },
    BODYGUARD: { name: 'Leibwächter', when: 'Jede Nacht', summary: 'Stell dich zu jemandem. Kommt der Tod, fängst du die Klinge ab.', detail: 'Würde dein Schützling durch den Mord des Todes sterben und nichts anderes rettet ihn, stirbst du an seiner Stelle. Du kannst dich nicht selbst bewachen, keine Bomben oder verbundenen Tode aufhalten und fängst höchstens einen Mord pro Nacht ab.' },
    BARD: { name: 'Barde', when: 'Einmal pro Spiel, nachts', summary: 'Einmal: Bring die Nacht zum Schweigen. Jede Rollenfähigkeit versagt, auch die des Todes.', detail: 'Alle aktiven Rollenfähigkeiten dieser Nacht werden unterdrückt. Träume, Abläufe und Spielregeln gelten weiter. Schlafparalyse auf dem Barden verhindert die Stille.' },
    WITCH: { name: 'Hexe', when: 'Jede Nacht', summary: 'Segne einen Spieler gegen Schaden oder verfluche seine nächste Aktion, damit sie verpufft.', detail: 'Segen: schützt heute Nacht vor schädlichen Rollenaktionen und Bomben (nicht vor verbundenen Schicksalen). Fluch: die nächste gezielte Rollenaktion des Ziels verpufft; ein verfluchter aktiver Tod blockiert den Mord der Fraktion. Nie dich selbst.' },
  },
  dreams: {
    SLEEP_PARALYSIS: { name: 'Schlafparalyse', text: 'Du kannst deine nächtliche Rollenaktion nicht nutzen. Bist du ein aktiver Tod, ist der ganze Mord der Fraktion blockiert.' },
    PREMONITION: { name: 'Vorahnung', text: 'Bei Tagesanbruch erfährst du den Namen eines lebenden, tod-gesinnten Spielers.' },
    WHISPERS: { name: 'Flüstern der Vergangenheit', text: 'Bei Tagesanbruch erfährst du die genaue Rolle eines zufälligen ausgeschiedenen Spielers.' },
    SLEEPWALKING: { name: 'Schlafwandeln', text: 'Du bist an den Spieler direkt vor dir gebunden. Stirbt er heute Nacht, stirbst du am Ende der Nacht.' },
    DREAM_SNATCHER: { name: 'Traumdieb', text: 'Bevor die Aktionen öffnen, darfst du Traumkarten mit einem anderen lebenden Spieler tauschen.' },
    NIGHT_SHIFT: { name: 'Nachtschicht', text: 'Ein zusätzlicher Einsatz einer wiederholbaren Nachtfähigkeit, auf ein zweites Ziel. Für den Tod: Teamkapazität wird 2.' },
    SHARED_NIGHTMARE: { name: 'Geteilter Albtraum', text: 'Wähle einen Traumpartner. Stirbt er heute Nacht, stirbst du mit.' },
    INSOMNIA: { name: 'Schlaflosigkeit', text: 'Bei Tagesanbruch erhältst du einen vollständigen, chronologischen Bericht aller Aktionen dieser Nacht — falls du überlebst.' },
    GUARDIAN_ANGEL: { name: 'Schutzengel', text: 'Heute Nacht bist du immun gegen Tod, Psycho, Bomben, Hexenfluch und verbundene Tode.' },
  },
  mcards: {
    REGULAR: { name: "Normale Mission", text: "Keine besondere Wirkung." },
    LANTERN: { name: "Laternenträger", text: "Der Anführer muss im Team sein." },
    FRESH_FACES: { name: "Neue Gesichter", text: "Mindestens die Hälfte des Teams (aufgerundet) darf nicht auf der vorigen Mission gewesen sein." },
    EXTRA_HAND: { name: "Zusätzliche Hand", text: "Das Team ist um einen Spieler größer." },
    SKELETON_CREW: { name: "Rumpfmannschaft", text: "Das Team ist um einen Spieler kleiner." },
    MASKED_VOTE: { name: "Verdeckte Abstimmung", text: "Teamabstimmungen zeigen nur die Summen, nicht wer wie gestimmt hat." },
    SHORT_PATIENCE: { name: "Kurze Geduld", text: "Der dritte Vorschlag zieht los, egal wie abgestimmt wird." },
    WARD: { name: "Schutz", text: "Mit dem Team nennt der Anführer ein Mitglied, dessen Karte Erfolg sein muss." },
    STEADFAST: { name: "Standhaft", text: "Zum Scheitern braucht es eine Sabotage mehr als sonst." },
    BRITTLE: { name: "Brüchig", text: "Eine einzige Sabotage lässt sie scheitern, obwohl diese Mission sonst zwei braucht." },
    SMOKE: { name: "Rauch", text: "Nur das Ergebnis wird gezeigt, nicht wie viele Sabotagekarten gespielt wurden." },
    GRAND: { name: "Große Mission", text: "Das Ergebnis zählt doppelt auf der Leiste." },
    TRAIL: { name: "Fährte", text: "Gelingt sie, findet ein zufälliges lebendes Teammitglied nachts einen Hinweis." },
    WITNESS: { name: "Zeuge", text: "Nachts sieht der Anführer des Teams heimlich die Karte eines anderen Mitglieds." },
    HAUNTED_ROAD: { name: "Spukweg", text: "Scheitert sie, wählt der Schnitter eines ihrer Mitglieder, das die nächste Mission aussetzen muss." },
  },
  missionStory: {
    steps: [
      ["Die zerrissene Karte finden", "Der falschen Spur folgen", "An den Attrappen vorbeigraben", "Den Tresor öffnen", "Das Gold hinaustragen"],
      ["Die Uhr finden", "Die Schlüssel stehlen", "Das erste Schloss knacken", "Den Alarmen entkommen", "Die letzte Tür erreichen"],
      ["Die Kerzen sammeln", "Den Kreis ziehen", "Die verbotenen Worte sprechen", "Den Altar nähren", "Den Kreis schließen"],
      ["Die Leiche untersuchen", "Den Butler befragen", "Die Waffe finden", "Das Alibi knacken", "Den Mörder nennen"],
      ["Die Warnzeichen lesen", "Die Quelle finden", "Den richtigen Draht kappen", "Die Stellung halten", "Den letzten Hebel ziehen"],
      ["Das verfluchte Ding finden", "Seinen wahren Namen erfahren", "Den Geist ärgern", "Ihn in Salz bannen", "Den Fluch zerschlagen"],
      ["Sich ins Spiel einkaufen", "Die Karten zählen", "Den Falschspieler entlarven", "Alles setzen", "Die letzte Hand gewinnen"],
      ["Den Erben finden", "Den Erben verstecken", "Das Abendessen überleben", "Die Attentäter täuschen", "Den Erben krönen"],
      ["Die Sterne lesen", "Die Dunkelheit durchqueren", "Den Fährmann bestechen", "Den letzten Hügel erklimmen", "Die Haustür öffnen"],
      ["Einen Brief abfangen", "Den Schritten folgen", "Eine Falle stellen", "Die Falle zuschnappen lassen", "Den Verräter entlarven"],
      ["Die Türen verbarrikadieren", "Die Kerzen rationieren", "Das Klopfen ignorieren", "Über Mitternacht durchhalten", "Den Morgen begrüßen"],
      ["Die Witterung aufnehmen", "Den Hehler finden", "Den Safe knacken", "Die Fälschung unterschieben", "Das Relikt zurückbringen"],
      ["Die alte Glocke läuten", "Herausfinden, wer das Schlaflied sang", "Den bitteren Kaffee brauen", "Den Bürgermeister wecken", "Den Bann brechen"],
      ["Die erste Seite finden", "Die Symbole entziffern", "Den fehlenden Schlüssel finden", "Zwischen den Zeilen lesen", "Das letzte Wort lesen"],
      ["Das Tagebuch verbrennen", "Den Papagei zum Schweigen bringen", "Den Zeugen bestechen", "Den Detektiv abhängen", "Es mit ins Grab nehmen"],
      ["Das alte Kontobuch finden", "Den Gläubiger aufspüren", "Das Geschuldete auftreiben", "Treffen an der Wegkreuzung", "Alles zurückzahlen"],
      ["Die alten Liebesbriefe finden", "Herausfinden, wohin sie ging", "Ihre Freunde gewinnen", "Ein zufälliges Treffen arrangieren", "Es endlich sagen"],
      ["Zählen, was zurückblieb", "Die Fingerabdrücke abwischen", "Die Quittungen verbrennen", "Die Waffe verstecken", "Keine Spur hinterlassen"],
      ["Die Schatzkammer auskundschaften", "Eine Wache bestechen", "Das Glas schneiden", "Die Krone austauschen", "Lächelnd hinausgehen"],
      ["Den Zeugen finden", "Herausfinden, was er sah", "Das Telefonkabel kappen", "Ihn weglocken", "Ihn bis zum Morgen still halten"],
      ["Das Testament finden", "Beweisen, wer du bist", "Die anderen Erben überdauern", "Die Familiengruft öffnen", "Nehmen, was dir gehört"],
      ["Sein Grab besuchen", "Herausfinden, wer ihn verriet", "Ihr Versteck finden", "Ihre Freunde umdrehen", "Die Rechnung begleichen"],
      ["Sich anmelden", "Die erste Runde überstehen", "Den Favoriten überlisten", "Das Finale überleben", "Den Preis in die Höhe stemmen"],
      ["Das Urteil lesen", "Das wahre Alibi finden", "Den echten Täter aufspüren", "Den Richter überzeugen", "Die Zellentür öffnen"],
      ["Heimlich packen", "Die Kutschenschlüssel stehlen", "Am Vater vorbeischleichen", "Die Kapelle erreichen", "Vor Sonnenaufgang Ja sagen"],
      ["Die alte Kiste ausgraben", "Lesen, was darin steht", "Herausfinden, wer es noch weiß", "Die letzte Kopie verbrennen", "Es tiefer vergraben"],
      ["Die Symptome studieren", "Das seltene Kraut finden", "Das Heilmittel brauen", "Es an dir selbst testen", "Den Patienten retten"],
      ["Die schwarzen Kerzen entzünden", "Seinen Namen sprechen", "Den Kreis öffnen", "Die Frage stellen", "Ihn zurückschicken"],
      ["Das rechtmäßige Siegel finden", "Die alte Garde sammeln", "Die Tore stürmen", "Dem Thronräuber gegenübertreten", "Den Thron besteigen"],
      ["Die verlorenen Skizzen finden", "Das verbotene Pigment anrühren", "Die Nacht durchmalen", "Es vor den Kritikern verstecken", "Die Leinwand signieren"],
    ],
    scenes: [
      ["Der Ballsaal kippt, aber die Kapelle weigert sich aufzuhören.", "In der Kapitänskajüte steht das Wasser knöcheltief – und steigt.", "Die Rettungsboote wurden zweimal gezählt. Es sind nicht genug.", "Im gefluteten Maschinenraum tickt noch etwas.", "Das Deck steht fast senkrecht. Halt dich fest. An irgendwas."],
      ["Das Karussell setzt sich in Bewegung, kaum dass ihr ankommt.", "Das Spiegelkabinett zeigt einen von euch zu viel.", "Vor der Geisterbahn steht eine Schlange. Niemand darin atmet.", "Das Riesenrad bleibt stehen – mit euch ganz oben.", "Jede Clownsstatue hat sich zu euch umgedreht."],
      ["Die Tür schließt sich zischend hinter euch. Das Licht flackert.", "Das Funkgerät knistert mit einer Stimme, die eure Namen kennt.", "Auf den Rationen steht „Nicht öffnen“. Jemand hat sie geöffnet.", "Ebene minus vier steht auf keinem Plan.", "Noch zwanzig Minuten Luft. Wahrscheinlich."],
      ["Die Porträts folgen euch mit den Augen – und mit den Füßen.", "Das Abendessen ist für genau einen Gast mehr gedeckt, als ihr seid.", "Die Geheimtür liegt hinter dem Buch, das du gerade berührt hast.", "Die Dachbodentreppe knarrt in Worten.", "Das Haus tut nicht mehr so, als wäre es leer."],
      ["Der Schnee frisst eure Spuren so schnell, wie ihr sie macht.", "Die Schlittenhunde weigern sich, auch nur einen Schritt weiterzugehen.", "Etwas Großes folgt euren Spuren schon den ganzen Tag.", "Das Eis auf dem See hat zu singen begonnen.", "Der Schneesturm zieht zu. Ihr seht eure eigenen Hände nicht mehr."],
      ["Die Lampe dreht sich, aber seit Jahren ist niemand die Treppe hinaufgestiegen.", "Das Nebelhorn beantwortet Fragen, die niemand gestellt hat.", "Das Logbuch des Wärters endet mitten im Satz.", "Die Felsen unten sind voller Schiffe, die diesem Licht vertraut haben.", "Oben erlischt die Lampe. Im Dunkeln atmet etwas."],
      ["Die Schwerkraft funktioniert in den meisten Räumen. Den meisten.", "Die Stations-KI wünscht einen guten Morgen. Es ist nicht Morgen.", "In der Hydrokultur wachsen Pflanzen, die niemand gepflanzt hat.", "Laut Schleusenprotokoll ist jemand hinausgegangen. Niemand fehlt.", "Die Umlaufbahn zerfällt. Alle mal die Luft anhalten."],
      ["Der Schaffner entwertet deine Fahrkarte und flüstert: falscher Zug.", "Der Speisewagen ist für ein Festmahl gedeckt, aber der Koch ist weg.", "Ein Tunnel. Als das Licht zurückkommt, ist ein Fahrgast ein anderer.", "Der Zug überquert eine Brücke, die gestern noch nicht da war.", "Die Bremsen versagen. Der Berg nicht."],
      ["Ihr rudert durchs Kirchenschiff, während die Orgel unter Wasser spielt.", "Die Kerzen brennen unter der Oberfläche. Das dürfte nicht möglich sein.", "Die Heiligen in den Bleiglasfenstern zeigen alle auf euch.", "Die Krypta ist geflutet, und die Särge treiben.", "Die Glocke läutet unter Wasser, langsam und ganz nah."],
      ["Die Rosen neigen sich euch entgegen. Noch höflich.", "Im Gewächshaus ist es schwül, und etwas darin summt.", "Eine fleischfressende Pflanze hat die Karte gefressen. Und den Gärtner.", "Das Heckenlabyrinth ordnet sich bei jedem Blinzeln neu.", "Der große Baum in der Mitte öffnet ein verschlafenes Auge."],
      ["Die Rezeption hat eure Buchung. Ihr habt nie gebucht.", "Der Pool ist voller Sand, und der Bademeister ist noch im Dienst.", "Zimmer 313 summt nachts. Ein Zimmer 312 gibt es nicht.", "Ein Sandsturm färbt jedes Fenster rostrot.", "Der Brunnen im Herzen der Oase hat zu flüstern begonnen."],
      ["Die Mönche haben ein Schweigegelübde abgelegt und brechen es lautstark.", "Die Glocken schlagen dreizehnmal.", "Im Skriptorium liegt ein Buch, das sich selbst schreibt.", "Der Klippenpfad ist rutschig, und die Ziegen urteilen über euch.", "In der Krypta wartet der Abt. Er starb 1611."],
      ["Der Erntemond hängt so tief, dass man hineinbeißen könnte.", "Die Kellerfässer lagern etwas, das kein Wein ist.", "Die Vogelscheuche hat vor einer Minute noch in die andere Richtung geschaut.", "Der Probierraum riecht nach Pflaumen, Rauch und schlechten Entscheidungen.", "Die Trauben sind über Nacht schwarz geworden. Sie hören zu."],
      ["Studio 9 ist beleuchtet und dreht. Niemand steht hinter der Kamera.", "In der Requisite fehlt genau ein echtes Messer.", "Auf dem Außengelände wirft eine Pappstadt echte Schatten.", "Auf dem Regiestuhl steht dein Name – falsch geschrieben.", "Die letzte Rolle liegt im Projektor. Spielt sie ab und seht, wie es endet."],
      ["Jede Uhr im Saal zeigt eine andere Zeit, und alle gehen nach.", "Der Schachautomat verlangt eine Revanche.", "Ein mechanischer Vogel singt den Alarm, und der Alarm singt zurück.", "Das große Planetarium hat sich von selbst zu drehen begonnen.", "Es schlägt Mitternacht, und jedes Ausstellungsstück dreht den Kopf."],
      ["Der Kirchturm ist der einzige Weg hinüber.", "Laternen leuchten in Fenstern unter Wasser.", "Ein Ruderboot treibt vorbei, niemand an den Riemen.", "Die Dorfglocke läutet unter der Oberfläche.", "Das Wasser steigt, und die Häuser füllen sich mit Stimmen."],
      ["Das Orchester stimmt. Musiker gibt es keine.", "Loge fünf ist immer reserviert. Heute sitzt jemand darin.", "Der Kronleuchter schwingt, obwohl es nicht zieht.", "Die Primadonna singt einen Ton, der die Spiegel springen lässt.", "Der Vorhang hebt sich zum letzten Akt. Ihr spielt mit."],
      ["Das Tor öffnet sich, bevor ihr es berührt.", "Ein frisches Grab, und der Stein trägt eure Initialen.", "Die Krähen zählen euch.", "Jemand pflegt diese Gräber. Jede Nacht.", "Der Boden seufzt, und die Erde gerät in Bewegung."],
      ["Das Teleskop zielt schon auf etwas.", "Die Sternkarten zeigen einen Stern zu viel.", "Die Kuppel schließt nicht, und der Mond schaut herein.", "Die Notizen des Astronomen enden mit: Es kommt näher.", "Eine Finsternis beginnt, zwölf Jahre zu früh."],
      ["Das Orchester spielt einen Walzer, dessen Schritte niemand kennt.", "Jeder Tänzer trägt eine Maske, und keiner hat ein Gesicht.", "Der Champagner geht nie aus. Genau das ist das Problem.", "Die Spiegel zeigen den Ball vor hundert Jahren.", "Die Musik verstummt. Alle drehen sich zu euch um."],
      ["Das Eis ist so klar, dass man Gesichter darunter sieht.", "Schlittschuhspuren kreisen um ein Loch, das vorher nicht da war.", "Die Fischerhütten sind leer, die Schnüre noch gespannt.", "Ein Riss kriecht auf euch zu, langsam und absichtlich.", "Unter euren Füßen klopft etwas, um herausgelassen zu werden."],
      ["Das Zirkuszelt steht über Nacht, und niemand hat es aufgebaut.", "Die Wahrsagerin kennt eure Namen schon.", "Der Löwenkäfig steht offen. Der Löwe fehlt.", "Der Direktor kündigt eine Nummer an, der ihr nie zugestimmt habt.", "Der Zirkus packt um euch herum zusammen. Ihr gehört jetzt zur Vorstellung."],
      ["Die Bücher sind trocken, obwohl das Wasser hüfthoch steht.", "Eine Karteikarte verzeichnet ein Buch über euch.", "Die Bibliothekarin zischt euch unter Wasser zum Schweigen.", "Die Seiten blättern sich in der Strömung von selbst um.", "Im tiefsten Regal steht das einzige Exemplar. Das Wasser steigt."],
      ["Der Lebkuchen duftet köstlich. So kriegt sie euch.", "Der Kessel brodelt, und niemand hat Feuer gemacht.", "Die schwarze Katze zeigt euch den Weg. Traut ihr nicht.", "Die Gläser im Regal tragen eure Namen.", "Die Hexe kommt früher nach Hause."],
      ["Die Könige liegen in einer Reihe. Ein Sarg ist offen.", "Die Fackeln entzünden sich von selbst, wenn ihr vorbeigeht.", "Eine Inschrift warnt: Nur königliches Blut darf passieren.", "Das Abbild der Königin hat den Kopf gedreht.", "Die Steintür knirscht hinter euch zu."],
      ["Eine Laterne gibt Zeichen von den Klippen. Niemand antwortet.", "Die Höhle ist voller Kisten, jede mit einem Totenkopf.", "Die Flut kommt schneller, als die Karten sagen.", "Zöllner am Strand, und ein Schmuggler unter euch.", "Das letzte Boot legt um Mitternacht ab, mit oder ohne euch."],
      ["Die Stände öffnen um Mitternacht und verkaufen, was ihr verloren habt.", "Ein Händler bietet euch ein Geschäft an. Der Preis ist eine Erinnerung.", "Die Münzen in euren Taschen sind zu Laub geworden.", "Jemand verkauft eine Karte des Ortes, zu dem ihr wollt.", "Beim ersten Licht verschwindet der ganze Markt. Beeilt euch."],
      ["Die Flügel drehen sich, obwohl der Wind erstorben ist.", "Rauch quillt aus der Mühle, doch nichts verbrennt.", "Der Müller mahlt mitten im Feuer noch Mehl.", "Nur die Leiter führt hinauf, und sie glimmt schon.", "Das große Rad bricht in einem Funkenregen zusammen."],
      ["Die Patienten schlafen alle, und alle lächeln.", "Die Akten des Arztes sind in eurer Handschrift geschrieben.", "Die Seilbahn fährt nur bergab.", "Zimmer 9 ist kalt, obwohl der Heizkörper glüht.", "Eine Lawine versperrt die Straße. Jetzt geht niemand mehr."],
      ["Hinter jeder Ecke seht ihr eine etwas schlechtere Version von euch selbst.", "Ein Spiegelbild ist einen Augenblick zu spät.", "Jemand in den Spiegeln trägt eine Maske mit eurem Gesicht.", "Das Ausgangsschild zeigt in alle Richtungen.", "Die Spiegel zerspringen, und eure Spiegelbilder treten heraus."],
    ],
    genericSteps: ["Der erste Schritt", "Tiefer hinein", "Der Punkt ohne Wiederkehr", "Der schwerste Teil", "Das Ende des Weges"],
    genericScenes: ["Die Expedition bricht auf. Niemand schaut zurück.", "Der Pfad wird enger – und das Vertrauen auch.", "Halbzeit. Jemand zählt die Schritte.", "Mit jeder Entscheidung wird die Luft kälter.", "Die letzte Strecke. Was hier wartet, hat auf euch gewartet."],
  },
  sideMissions: {"GO_TWICE": "Geh auf mindestens zwei Missionen.", "GO_THRICE": "Geh auf mindestens drei Missionen.", "STAY_BEHIND": "Geh auf höchstens eine Mission.", "EARLY_BIRD": "Geh auf Mission 1 oder Mission 2.", "LATE_ARRIVAL": "Geh weder auf Mission 1 noch auf Mission 2.", "LANTERN_LEADS": "Führe ein Team, das auf seine Mission geht.", "NO_LANTERN": "Führe nie ein Team, das auf seine Mission geht.", "GOOD_COMPANY": "Sei auf einer Mission, die gelingt.", "BAD_LUCK": "Sei auf einer Mission, die scheitert.", "CLEAN_RECORD": "Sei nie auf einer Mission, die scheitert.", "NAYSAYER": "Stimme mindestens dreimal mit Ablehnen.", "OPEN_HEART": "Stimme nie mit Ablehnen.", "LONE_VOICE": "Lehne ein Team ab, das der Tisch annimmt.", "LOST_CAUSE": "Nimm ein Team an, das der Tisch ablehnt.", "CONTRARIAN": "Steh zweimal auf der unterlegenen Seite einer Teamabstimmung.", "CROWD": "Stimme immer mit der Mehrheit.", "FIRST_TRUST": "Nimm den ersten Vorschlag zweier verschiedener Missionen an.", "POPULAR": "Steh auf mindestens drei vorgeschlagenen Teams.", "SELF_STARTER": "Setz dich selbst auf ein Team, das du vorschlägst.", "HUMBLE": "Setz dich nie selbst auf ein Team, das du vorschlägst.", "NEIGHBOURS": "Geh zusammen mit deinem linken Nachbarn auf eine Mission.", "CANDLE_BEARER": "Halte irgendwann die Kerze.", "STEADY_EYE": "Ändere nie deinen Verdacht (und gib mindestens zwei ab).", "RESTLESS": "Richte deinen Verdacht auf drei verschiedene Spieler."},
  rules: {
    OPEN_BALLOT: { name: "Offene Abstimmung", text: "Jede Stimme ist öffentlich: Alle sehen, wer für wen stimmt, während die Stimmen eingehen.", enforcement: "Stimmen können bis zur Sperrung noch geändert werden. Auch Geisterstimmen sind öffentlich." },
    FOG_OF_WAR: { name: 'Nebel des Krieges', text: 'Während der Diskussion darfst du nur direkt mit den Spielern auf den Plätzen neben dir sprechen.', enforcement: 'Am Tisch Ehrensache. Online ersetzt Nachbarflüstern den Tischchat.' },
    DOUBLE_JEOPARDY: { name: 'Doppelte Gefahr', text: 'Die Tod-Fraktion darf jede Nacht bis zu zwei Spieler töten (feste Obergrenze 2).', enforcement: 'Blockaden wie der Besuch einer Hure oder Paralyse senken sie trotzdem auf 0.' },
    PARANOIA: { name: 'Paranoia', text: 'Jede lebende Stimme erhält +1 Gewicht. Der Richter wiegt 3; der Verschwörer gibt noch +1 dazu.', enforcement: 'Geisterstimmen bleiben bei Gewicht 1.' },
    UNRELIABLE_POWER: { name: 'Unzuverlässige Kraft', text: 'Jede nächtliche Rollenaktion würfelt einen W6: 1–3 scheitert, 4–6 wirkt. Der Tod würfelt einmal fürs Team.', enforcement: 'Eine gescheiterte Einmal-Fähigkeit ist trotzdem verbraucht.' },
    POWER_SURGE: { name: 'Kraftschub', text: 'Jede Nacht erhält eine zufällige, berechtigte wiederholbare Fähigkeit einen zusätzlichen Einsatz. Der Tod zählt als ein Eintrag.', enforcement: 'Nie mehr als zwei Einsätze für irgendwen; die Kapazität des Todes ist auf 2 begrenzt.' },
    EQUAL_EXCHANGE: { name: 'Gleicher Tausch', text: 'Ein per Abstimmung verurteilter, tod-gesinnter Spieler darf einen lebenden Nicht-Tod-Spieler mit sich nehmen.', enforcement: 'Nachtmorde, Schüsse des Rächers und verbundene Tode lösen ihn nicht aus.' },
    CURSED_SILENCE: { name: 'Verfluchte Stille', text: 'Während der Diskussion darfst du nur sprechen, wenn du direkt angesprochen wirst.', enforcement: 'Ehrensache. Nominierungen und Abstimmungen sind nicht betroffen.' },
    MAJORITY_RULE: { name: 'Mehrheitsregel', text: 'Eine Verurteilung braucht mehr als die Hälfte des Gewichts aller berechtigten lebenden Wähler auf einem Nominierten.', enforcement: 'Enthaltungen und Nichtwähler zählen im Nenner mit. Geisterstimmen zählen nie.' },
    HIDDEN_ROLES: { name: 'Verborgene Rollen', text: 'Die Rollen ausgeschiedener Spieler werden bis zum Spielende nie öffentlich gezeigt.', enforcement: 'Ohnehin der Standard; diese Karte fixiert ihn.' },
    VENGEFUL_GHOSTS: { name: 'Rachsüchtige Geister', text: 'Jeder ausgeschiedene Spieler darf pro Tag eine Geisterstimme mit Gewicht 1 abgeben.', enforcement: 'Geister können nicht nominieren, keine Fähigkeiten nutzen und die Mehrheitsregel nicht beeinflussen.' },
  },
  presets: {
    graverobbers: { name: "Dead Set: Grabräuber", blurb: "Zwei Grabräuberbanden, Mond und Sonne, durchwühlen einen Friedhof aus Wörtern oder Symbolen nach den Reliquien ihrer Gottheit. Nur die Totengräber wissen, was darunter liegt. Ein Grab gehört dem Tod." },
    omen: { name: "Dead Set: Das Omen", blurb: "Ein okkultes Rad zeigt auf Leben, Tod oder Wiedergeburt. Jeder darf es heimlich drehen; sag voraus, wo es stehen bleibt." },
    mirror: { name: "Dead Set: Der Spiegel", blurb: "Der Spukspiegel zeigt, was deine Freunde glauben, dass du tun würdest. Beantworte das Dilemma und lies die Person dir gegenüber." },
    mimic: { name: "Dead Set: Nachahmer", blurb: "Alle wissen, wo ihr seid, außer dem Ding mit dem Gesicht eines Freundes. Fragen, antworten, beschuldigen; der Nachahmer lauscht nach dem Ort." },
    seance: { name: "Dead Set: Séance", blurb: "Ein stummer, ermordeter Geist schickt Visionen; die Medien lesen daraus wer, wo und warum. Ein Täuscher unter ihnen tauscht Visionen gegen Lügen." },
    midnight: { name: "Dead Set: Mitternacht", blurb: "Eine Nacht, eine Abstimmung. Karten wechseln im Dunkeln die Hände; im Morgengrauen bist du, was vor dir liegt. Finde den Tod, oder sei er." },
    carnival: { name: "Dead Set: Karneval", blurb: "Ein Maskenball aus Bluff und Gedächtnis. Jeder trägt eine Rollenkarte als Maske, gemischt, bis niemand mehr sicher ist. Beanspruche Masken und sammle Seelen; 13 gewinnen." },
    coffins: { name: "Dead Set: Särge", blurb: "Ein schnelles Bluffspiel. Vergrabe Gold und einen Fluch, biete, wie viele Särge du öffnen kannst, dann grabe. Zwei saubere Grabungen gewinnen." },
    exorcism: { name: "Dead Set: Exorzismus", blurb: "Ein Wortspiel voller Bluff. In der Kristallkugel sehen alle das Passwort, nur der Dämon nicht. Jeder ein Wort, dann wird der Dämon benannt." },
    missions: { name: "Dead Set: Missionen", blurb: "Teams, Abstimmungen und Sabotage. Niemand stirbt: Führt Missionen an, lest die Stimmen und findet den Tod, bevor er das Medium findet." },
    standard: { name: 'Standard', blurb: 'Das eigentliche Dead-Set-Erlebnis. Zehn Zusatzrollen ab 7 Spielern, jede Nacht ein Traum für alle, 1–3 Regelkarten.' },
    classic: { name: 'Klassisch / Lernen', blurb: 'Zum Beibringen. Nur Grundrollen — Zusatzplätze werden mit Unschuldigen gefüllt. Träume standardmäßig aus, höchstens eine einfache Regel.' },
    full: { name: 'Volles Deck / Chaos', blurb: 'Alle 17 Zusatzrollen inklusive Narr, Barde und Hexe. Viel Zufall, nur für erfahrene Gruppen.' },
    doomsday: { name: 'Weltuntergang', blurb: 'Standard, gegen die Uhr. Hat bis zum Ende des letzten Tages niemand gewonnen, gewinnt der Tod.' },
    custom: { name: 'Eigenes Spiel', blurb: 'Wähle Zusatzpool, Träume, Regeln und Uhr selbst — oder tippe das genaue Deck ein. Warnt vor unausgewogenen Aufstellungen.' },
  },
  scenario: {
    WHO: ['Zeitreisende', 'Weltraumforscher', 'Fabelwesen', 'Geister historischer Persönlichkeiten', 'Mutanten', 'Mitglieder einer Geheimgesellschaft', 'Verirrte Touristen', 'Künstliche Intelligenzen', 'Mittelalterliche Dorfbewohner', 'Promi-Doppelgänger', "Zirkusartisten im Ruhestand", "Leuchtturmwärter", "Rivalisierende Köche", "Verbannte Adelige", "Nachtschwestern", "Tiefseetaucher", "Hochzeitsgäste", "Gestrandete Astronomen", "Maskenballtänzer", "Schweigende Mönche", "Mitternachtsgärtner", "Uhrmacher", "Schmuggler", "Opernsänger", "Grabräuber", "Königliche Wachen", "Fischer", "Alchemisten", "Bankiers", "Zugschaffner", "Wahrsagerinnen", "Bergführer", "Laternenanzünder", "Puppenspieler", "Vogelbeobachter", "Bestatter", "Falschspieler", "Jäger", "Feuerschlucker", "Schlangenbeschwörer"],
    WHERE: ['Ein sinkendes Schiff', 'Ein verlassener Freizeitpark', 'Ein unterirdischer Bunker', 'Ein Spukhaus', 'Eine verschneite Tundra', "Ein Leuchtturm im Nebel", "Eine verlassene Raumstation", "Ein Nachtzug durch die Berge", "Eine überflutete Kathedrale", "Ein verwilderter botanischer Garten", "Ein Oasenhotel in der Wüste", "Ein abgelegenes Kloster", "Ein Weinberg im Mondlicht", "Ein verlassenes Filmstudio", "Ein Uhrwerkmuseum", "Ein versunkenes Dorf", "Ein Opernhaus bei Kerzenlicht", "Ein vergessener Friedhof", "Ein Mondobservatorium", "Ein vergoldeter Ballsaal", "Ein zugefrorener See", "Ein Wanderzirkus", "Eine versunkene Bibliothek", "Eine Hexenhütte", "Eine Königsgruft", "Eine Schmugglerbucht", "Ein Mitternachtsmarkt", "Eine brennende Windmühle", "Ein Sanatorium in den Alpen", "Ein Spiegelkabinett"],
    WHY: ['Einen verborgenen Schatz finden', 'Entkommen, bevor die Zeit abläuft', 'Ein Ritual vollenden', 'Einen Mord aufklären', 'Eine drohende Katastrophe verhindern', "Einen uralten Fluch brechen", "Beim Kartenspiel ein Vermögen gewinnen", "Einen königlichen Erben schützen", "Den Weg nach Hause finden", "Einen Verräter entlarven", "Bis zum Sonnenaufgang überleben", "Ein gestohlenes Relikt zurückholen", "Die schlafende Stadt wecken", "Eine letzte Botschaft entschlüsseln", "Ein schreckliches Geheimnis bewahren", "Eine alte Schuld begleichen", "Eine verlorene Liebe zurückgewinnen", "Die Beweise verstecken", "Die Kronjuwelen stehlen", "Einen Zeugen zum Schweigen bringen", "Ein Erbe antreten", "Einen Bruder rächen", "Den Hauptpreis gewinnen", "Die eigene Unschuld beweisen", "Vor Sonnenaufgang durchbrennen", "Die Vergangenheit begraben", "Eine seltsame Krankheit heilen", "Einen Geist beschwören", "Einen geraubten Thron zurückfordern", "Das Meisterwerk vollenden"],
  },
  products: ['einen Messingschlüssel, der in kein Schloss passt', 'ein Glas warmen Sand', 'eine Fahrkarte für einen Zug, der gestern abgefahren ist', 'eine einzelne schwarze Feder', 'eine rückwärts laufende Taschenuhr', 'einen versiegelten Brief an dich', 'ein Fläschchen graues Parfüm', 'ein Kartenspiel ohne Dame', 'eine Kerze, die nach Regen riecht', 'ein Foto eines leeren Zimmers', 'eine samtgefütterte Schachtel (leer)', 'einen Kompass, der auf dich zeigt'],
  whispers: [
    'Bo wurde tot aufgefunden. Niemand sah die Hure gehen.',
    'Die Stadt hängte den Narren. Er lachte.',
    'Die Mentalistin wusste es. Niemand glaubte ihr.',
    'Zwei Stimmen zu wenig. Der Sündenbock zahlte.',
    'Fay schwor, sie sei der Wächter. Gus auch.',
    'Der Nekromant erweckte den falschen Freund.',
    'Eine Bombe vor der Tür. Eine Münze, geworfen.',
    'Alle wachten auf. Irgendwie war das schlimmer.',
    'Der Tod stimmte mit der Stadt. Natürlich.',
  ],
  // The Mirror: dilemmas by stable id, [prompt, A, B, C] (see public/dilemmas.js).
  dilemmas: {
    d001: ["Um Mitternacht klopft ein Fremder, vom Sturm durchnässt, und bittet um Einlass.", "Hereinlassen", "Durch die Tür reden", "So tun, als wäre niemand zu Hause", "Der Besucher um Mitternacht"],
    d002: ["Auf dem Dachboden deines neuen Hauses findest du ein verschlossenes Tagebuch.", "Das Schloss aufbrechen und lesen", "Es den alten Besitzern zurückgeben", "Es ungelesen verbrennen", "Das verschlossene Tagebuch"],
    d003: ["Eine Wahrsagerin bietet dir an, den Tag deines Todes zu nennen.", "Zuhören", "Höflich ablehnen", "Stattdessen nach jemand anderem fragen", "Die Wahrsagerin"],
    d004: ["Bei einem Abendessen geht das Licht aus, und ein Schrei ertönt.", "Zum Schrei rennen", "Erst eine Kerze suchen", "Völlig still bleiben", "Das dunkle Dinner"],
    d005: ["Ein Geist bietet an, eine Woche lang jeden heimzusuchen, den du nennst.", "Einen Rivalen nennen", "Einen Freund nennen, aus Spaß", "Ablehnen", "Der geliehene Geist"],
    d006: ["Du erbst eine bröckelnde Burg samt Familienfluch.", "Trotzdem einziehen", "Sofort verkaufen", "Ein Hotel daraus machen", "Das verfluchte Schloss"],
    d007: ["Jede Nacht um drei landet ein Rabe auf deinem Fensterbrett.", "Ihn füttern", "Mit ihm reden", "Die Vorhänge zuziehen", "Der Rabe um drei"],
    d008: ["Du darfst eine Nacht eingeschlossen an einem berühmten Spukort verbringen.", "In einem Burgverlies", "In einer verlassenen Anstalt", "Auf einem Geisterschiff auf See", "Die Spuknacht"],
    d009: ["Dein Spiegelbild blinzelt einen Augenblick nach dir.", "Es niederstarren", "Alle Spiegel verhängen", "Winken und abwarten", "Das späte Spiegelbild"],
    d010: ["Eine Séance geht schief, und ein Geist bittet um einen Gefallen.", "Ihn anhören", "Die Séance sofort beenden", "Erst etwas aushandeln", "Die Bitte des Geistes"],
    d011: ["Der letzte Zug nach Hause ist leer bis auf einen schweigenden Fahrgast.", "Sich neben ihn setzen", "So weit weg wie möglich sitzen", "Auf den nächsten Zug warten", "Der letzte Zug"],
    d012: ["Du darfst einen Gegenstand ins Jenseits mitnehmen.", "Ein Foto", "Ein gutes Buch", "Ein Kartenspiel", "Das Gepäck fürs Jenseits"],
    d013: ["Eine verfluchte Münze bringt Glück, kostet dich aber jeden Tag eine Erinnerung.", "Behalten", "An jemanden weitergeben", "In den Fluss werfen", "Die verfluchte Münze"],
    d014: ["Du verirrst dich in der Dämmerung in einem nebligen Wald.", "Den fernen Lichtern folgen", "Auf einen Baum klettern und warten", "Den Weg zurückgehen", "Der Nebelwald"],
    d015: ["Auf einem Maskenball trägt jemand dein Gesicht als Maske.", "Zur Rede stellen", "Leise folgen", "Masken tauschen und gehen", "Das geliehene Gesicht"],
    d016: ["Du erfährst ein Geheimnis über jede Person an diesem Tisch.", "Ihre größte Angst", "Ihre größte Lüge", "Ihr geheimes Talent", "Die Geheimnisse der Runde"],
    d017: ["Auf dem Weg zu einem wichtigen Treffen kreuzt eine schwarze Katze deinen Weg.", "Weitergehen", "Einen anderen Weg nehmen", "Anhalten und sie streicheln", "Die schwarze Katze"],
    d018: ["In deinem Haus spukt ein freundlicher, aber sehr lauter Geist.", "Sich damit arrangieren", "Einen Exorzisten rufen", "Eintritt von Touristen verlangen", "Der laute Geist"],
    d019: ["Du wachst als Vampir auf.", "Das Nachtleben annehmen", "Ein Heilmittel suchen", "Es geheim halten und weitermachen", "Der neue Vampir"],
    d020: ["Ein geheimnisvoller Brief lädt dich zur Testamentseröffnung in ein Herrenhaus.", "Allein hingehen", "Mit einem Freund hingehen", "Ihn ignorieren", "Die Testamentseröffnung"],
    d021: ["Du bist der letzte wache Gast in einem alten Gasthaus, und die Treppe knarrt.", "Nachsehen", "Die Tür abschließen", "Schlaf vortäuschen", "Die knarrende Treppe"],
    d022: ["Eine Hexe schenkt dir einen Trank.", "Liebestrank", "Wahrheitstrank", "Unsichtbarkeitstrank", "Der Gratistrank"],
    d023: ["Du darfst in jedem Jahrhundert leben, ohne Rückweg.", "In der Vergangenheit", "Hier und jetzt", "In der fernen Zukunft", "Das Jahrhundert ohne Rückkehr"],
    d024: ["Ein sprechendes Porträt gibt Ratschläge gegen Klatsch.", "Klatsch tauschen", "Es ignorieren", "Es zur Wand drehen", "Das sprechende Porträt"],
    d025: ["Eure Gruppe sitzt in einer Hütte fest, und morgen geht das Essen aus.", "Die Flucht anführen", "Rationieren und warten", "Den Keller durchsuchen", "Die eingeschneite Hütte"],
    d026: ["Aus dem Wald ruft deine eigene Stimme deinen Namen.", "Antworten", "Darauf zugehen", "In die andere Richtung rennen", "Die Stimme im Wald"],
    d027: ["Ein Dschinn gewährt einen Wunsch, aber die Formulierung muss perfekt sein.", "Reichtum wünschen", "Mehr Wünsche wünschen", "Den Dschinn freiwünschen", "Der Wunsch des Dschinns"],
    d028: ["Eine alte Spieldose spielt jede Nacht von selbst.", "Sie selbst aufziehen", "Das Werk ausbauen", "Sie als Beweis aufnehmen", "Die Spieluhr"],
    d029: ["Du darfst für den Rest deines Lebens nur ein Gericht essen.", "Ein großes Festmahl", "Einfaches Brot und Suppe", "Etwas Süßes", "Die eine Mahlzeit"],
    d030: ["Du findest eine Karte deines eigenen Gartens mit einem X.", "Noch heute Nacht graben", "Bei Tag mit Freunden graben", "Es vergraben lassen", "Das vergrabene X"],
    d031: ["Ein Freund gesteht, dass er heimlich ein Werwolf ist.", "Beim Verstecken helfen", "Ihn bei Vollmond einsperren", "Um die Verwandlung bitten", "Der Werwolf-Freund"],
    d032: ["Du darfst einen Tag lang mit jemandem an diesem Tisch das Leben tauschen.", "Mit jemand Furchtlosem", "Mit jemand Reichem", "Mit jemand Geheimnisvollem", "Das geliehene Leben"],
    d033: ["Der Bestatter bietet an, deine Beerdigung vorab zu planen, mit Rabatt.", "Ein prächtiger Trauerzug", "Eine stille Zeremonie", "Ein Fest mit Tanz", "Die frühe Beerdigung"],
    d034: ["In deinem Haus läuft eine Uhr rückwärts.", "Reparieren", "In Ruhe lassen", "Versuchen, sie zu nutzen", "Die rückwärts laufende Uhr"],
    d035: ["Der Zirkus ist in der Stadt, und ein Clown steckt dir eine Karte für eine geheime Vorstellung zu.", "Hingehen", "Die Karte verschenken", "Sie zerreißen", "Die geheime Vorstellung"],
    d036: ["Du kannst mit einer Tierart sprechen.", "Katzen", "Krähen", "Hunde", "Die Tiersprache"],
    d037: ["Ein Sturm sperrt dich über Nacht in einen Leuchtturm mit einem Wärter, der nie schläft.", "Wach bleiben und reden", "Mit einem offenen Auge schlafen", "Dem Sturm trotzen", "Der schlaflose Wärter"],
    d038: ["Dein Schatten beginnt, sich von selbst zu bewegen.", "Ihm folgen", "Im Licht bleiben", "Freundschaft schließen", "Der ruhelose Schatten"],
    d039: ["Man bietet dir Unsterblichkeit an, aber du kannst diese Stadt nie verlassen.", "Annehmen", "Ablehnen", "Um eine größere Stadt bitten", "Die Stadt für immer"],
    d040: ["Eines Morgens steht eine versiegelte Gruft auf dem Friedhof offen.", "Hineinsehen", "Dem Pfarrer Bescheid sagen", "Sie schließen und schweigen", "Die offene Gruft"],
    d041: ["Eins davon darfst du für immer behalten.", "Einen Schlüssel, der jede Tür öffnet", "Eine Kerze, die nie erlischt", "Einen Kompass, der nach Hause zeigt", "Das Andenken"],
    d042: ["Auf einer Auktion geht ein verfluchtes Gemälde billig weg.", "Mitbieten", "Die anderen Bieter warnen", "Weggehen", "Das billige Gemälde"],
    d043: ["Das Dorf bittet dich, die Brücke in der Nacht zu bewachen, in der etwas sie überquert.", "Wache halten", "Eine Falle stellen", "Einen Grund finden, weg zu sein", "Die Brückenwache"],
    d044: ["In deinem Glückskeks steht: Trau nicht der Person zu deiner Linken.", "Es glauben", "Darüber lachen", "Es ihr zeigen", "Der Glückskeks"],
    d045: ["Du darfst einen Tag deines Lebens noch einmal erleben.", "Deinen glücklichsten Tag", "Einen Tag, um einen Fehler gutzumachen", "Einen gewöhnlichen, faulen Tag", "Der Tag noch einmal"],
    d046: ["Ein Spiegel im Antiquitätenladen zeigt dich zehn Jahre älter.", "Ihn kaufen", "Fragen, was er zeigt", "Schnell gehen", "Der ältere Spiegel"],
    d047: ["Ein Geist soll dich ein Leben lang beschützen.", "Ein Ritter", "Eine Großmutter", "Ein freches Kind", "Der Schutzgeist"],
    d048: ["Der Gastgeber einer Feier hat alle Türen von außen abgeschlossen.", "Einen anderen Ausgang suchen", "Weiterfeiern", "Eine Erklärung verlangen", "Die verschlossene Party"],
    d049: ["Man darf sich an dich nur für eine Sache erinnern.", "Güte", "Mut", "Humor", "Die eine Erinnerung"],
    d050: ["Ein Zauberbuch liegt vor deiner Tür.", "Einen Zauber ausprobieren", "Es lesen, aber nichts zaubern", "Es in eine Bibliothek bringen", "Das Zauberbuch"],
    d051: ["Man bietet dir einen Platz auf einem Schiff an, das nie von seinen Fahrten zurückkehrte.", "Mitsegeln", "An Land bleiben", "Erst die Mannschaft fragen", "Das Schiff ohne Wiederkehr"],
    d052: ["Im Nachbardorf lebt dein Doppelgänger.", "Ihn treffen", "Aus der Ferne beobachten", "Wegziehen", "Der Doppelgänger im Dorf"],
    d053: ["Beim Abendessen werden alle Kerzen auf einmal blau.", "Weiteressen", "Sie auspusten", "Fragen, wer im Raum ist", "Die blauen Kerzen"],
    d054: ["Du kannst einmal die Zeit für eine Stunde anhalten.", "Heute nutzen", "Für einen Notfall aufheben", "Sie verschlafen", "Die angehaltene Stunde"],
    d055: ["Ein Wasserspeier an der Kathedrale verlangt ein Rätsel von dir.", "Eins erzählen", "Stattdessen eins verlangen", "So tun, als hörte man nichts", "Das Rätsel des Wasserspeiers"],
    d056: ["Auf deiner eigenen Beerdigung läuft dein Lieblingslied. Welches?", "Etwas Trauriges", "Etwas Fröhliches", "Etwas, das niemand erwartet", "Das Lied zur Beerdigung"],
    d057: ["Du darfst in einer Spukstadt einen einzigen Beruf haben.", "Bestatter", "Wirt", "Nachtwache", "Das Handwerk in der Spukstadt"],
    d058: ["Ein Freund leiht deinen Mantel und bringt ihn mit dem Brief eines Fremden in der Tasche zurück.", "Den Brief lesen", "Ihn dem Freund zurückgeben", "Den Fremden suchen", "Der Brief des Fremden"],
    d059: ["Der Vollmond geht auf, und alle Hunde der Stadt beginnen zu heulen.", "Die Türen abschließen", "Nach draußen gehen", "Mitheulen", "Der heulende Mond"],
    d060: ["Du darfst einen Sinn aufgeben, um die anderen zu schärfen.", "Den Geschmack", "Den Geruch", "Niemals, keinen", "Der getauschte Sinn"],
    d061: ["Eine Kutsche ohne Kutscher hält vor dir.", "Einsteigen", "Den Kutscher suchen", "Weitergehen", "Die Kutsche ohne Kutscher"],
    d062: ["Du darfst genau wissen, was eine Person wirklich von dir denkt.", "Dein bester Freund", "Dein Rivale", "Niemand, danke", "Die wahre Meinung"],
    d063: ["Dichter Nebel zieht auf, und die Stadtglocke schlägt dreizehn.", "Noch einmal zählen", "Drinnen verstecken", "Zum Glockenturm gehen", "Die dreizehnte Glocke"],
    d064: ["Du entdeckst, dass dein Haus ein verborgenes Zimmer hat.", "Sofort öffnen", "Auf Tageslicht warten", "Es zutapezieren", "Das verborgene Zimmer"],
    d065: ["Ein Hausierer verkauft Glück in Flaschen.", "Eine Flasche kaufen", "Die ganze Kiste kaufen", "Ihn aus der Stadt jagen", "Der Händler"],
    d066: ["Du musst ein Jahr allein in einem Bergkloster verbringen.", "Einen Stapel Bücher mitnehmen", "Ein Instrument mitnehmen", "Ein Tagebuch mitnehmen", "Das Jahr im Berg"],
    d067: ["Deine Teeblätter bilden einen Namen, den du nicht kennst.", "Die Person suchen", "Noch eine Tasse trinken", "Niemandem erzählen", "Die Teeblätter"],
    d068: ["Du darfst als Gast jede Feier der Geschichte besuchen.", "Eine Königskrönung", "Einen wilden Maskenball", "Ein legendäres Konzert", "Die Party der Geschichte"],
    d069: ["Ein Sterbender gibt dir einen Schlüssel und flüstert: Öffne es niemals.", "Öffnen", "Ihn für immer behalten", "Ihn wegwerfen", "Der verbotene Schlüssel"],
    d070: ["Der Tisch muss bestimmen, wer die Gruft zuerst erkundet.", "Freiwillig melden", "Jemand anderen vorschlagen", "Strohhalme ziehen vorschlagen", "Der Erste in der Gruft"],
    d071: ["Man bietet dir einen Platz an der Abendtafel des Todes an.", "Höflich annehmen", "Ein Geschenk mitbringen", "Eine Ausrede finden", "Das Mahl mit dem Tod"],
    d072: ["Ein altes Foto zeigt dich auf einer Feier vor hundert Jahren.", "Nachforschen", "Es einrahmen", "Es verstecken", "Die alte Fotografie"],
    d073: ["Du kannst dich nach Belieben in ein Wesen verwandeln.", "Eine Fledermaus", "Einen Wolf", "Eine Katze", "Der Gestaltwandler"],
    d074: ["Jemand legt jede Nacht Blumen vor deine Tür.", "Wach bleiben, um zu sehen, wer", "Einen Dankeszettel hinlegen", "Nicht mehr aufmachen", "Die Blumen vor der Tür"],
    d075: ["Ein Sturm legt während eines Gruselfilms den Strom lahm.", "Geistergeschichten erzählen", "Ins Bett gehen", "Das Ende bei Kerzenlicht nachspielen", "Der Stromausfall"],
    d076: ["Du darfst eine Erfindung der Geschichte rückgängig machen.", "Wecker", "Handys", "Nichts, alles bleibt", "Die ungeschehene Erfindung"],
    d077: ["An einer Kreuzung um Mitternacht bietet ein Fremder an, deine Gitarre zu stimmen.", "Sie ihm geben", "Erst nach dem Preis fragen", "Mit der Gitarre gehen", "Der Fremde am Kreuzweg"],
    d078: ["Du darfst jemanden für ein einziges Gespräch zurückholen.", "Einen Verwandten", "Eine berühmte Person", "Einen Kindheitsfreund", "Das letzte Gespräch"],
    d079: ["Über Nacht erscheint eine Falltür im Küchenboden.", "Hinuntersteigen", "Sie zunageln", "Eine Münze hineinwerfen und lauschen", "Die Falltür"],
    d080: ["Die letzte Kerze brennt herunter, und nur einer von euch kann sie halten.", "Sie nehmen", "Sie jemand anderem anbieten", "Sie gemeinsam ausblasen", "Die letzte Kerze"],
  },
  guide: {
    missionCardsH: "Missionskarten",
    sidesH: "Weitere Seiten und Wendungen",
    sides: `<p>Optional, in der Lobby einschaltbar (oder in eigenen Spielen über die Rollenzähler). Die Stadt gewinnt erst, wenn Tod, Sekte und Ripper alle verschwunden sind.</p>
<ul>
<li><b>Liebende:</b> Zwei zufällige Spieler, egal von welcher Seite, verlieben sich. Jeder erfährt den Namen des anderen. Stirbt einer, stirbt der andere an gebrochenem Herzen. Sind sie die letzten beiden Lebenden, gewinnen sie gemeinsam.</li>
<li><b>Die Sekte:</b> Ein Sektenführer wirbt jede Nacht einen Spieler an. Angeworbene behalten ihre Rolle, gewinnen aber mit der Sekte, die gewinnt, sobald sie in der Überzahl ist. Tod, Ripper und geschützte Spieler können nicht angeworben werden.</li>
<li><b>Der Ripper:</b> ein einsamer Mörder, der jede Nacht zuschlägt. Der Tod kann den Ripper nachts nicht töten (außer bei Blutmond). Der Ripper gewinnt als Letzter, der noch steht, oder allein mit einem Spieler, der kein Mörder ist.</li>
<li><b>Hinweise</b> (standardmäßig an, selten): An manchen Morgen erhalten ein oder zwei Spieler außerhalb des Todesteams einen wahren Hinweis, etwa „A oder B geht mit dem Tod“.</li>
<li><b>Münzwurf bei Gleichstand</b> (optional): Ein Gleichstand an der Spitze wird per Münzwurf entschieden, statt alle zu verschonen.</li>
<li><b>Offene Abstimmung</b> (eine Regelkarte): Jede Stimme ist öffentlich, sobald sie abgegeben wird.</li>
</ul>`,
    title: 'So wird<br><i>gespielt.</i>',
    toc: ['Grundlagen', 'Eine Runde', 'Sieg', 'Grundrollen', 'Zusatzrollen', 'Volles Deck', 'Träume', 'Regelkarten', 'Modi', 'Nachtreihenfolge', 'Handys'],
    basicsH: 'Die Grundlagen',
    roundH: 'Eine Runde',
    round: `<ol>
<li><b>Nacht 0 — die Enthüllung.</b> Dreh deine Rollenkarte um, lies sie, tippe auf <em>Verstanden</em>. Sonst passiert nichts: keine Morde, keine Träume, keine Fähigkeiten. Tod-Spieler sehen ihre Mitspieler.</li>
<li><b>Morgen.</b> Die Nachrichten des Tagesanbruchs werden verlesen: wer in der Nacht starb (nie wie, nie die Rolle). Was du privat erfahren hast, steht unter <em>Nur du weißt es</em>. Ein Diplomat kann hier Immunität erklären; ein Rächer kann schießen.</li>
<li><b>Diskussion & Nominierungen.</b> Redet. Jeder lebende Spieler darf pro Tag <b>eine offizielle Nominierung</b> abgeben. Wer jemand bereits Nominierten nominiert, unterstützt die Nominierung nur.</li>
<li><b>Verteidigung.</b> Jeder Nominierte bekommt in der Reihenfolge der Nominierung das Wort.</li>
<li><b>Geheime Abstimmung.</b> Jeder berechtigte lebende Spieler stimmt am eigenen Handy für einen Nominierten oder enthält sich. Du kannst deine Stimme ändern, bis der Gastgeber sie sperrt. Nur Summen werden veröffentlicht.</li>
<li><b>Urteil.</b> Die einzige höchste Summe wird verurteilt (scheidet aus). <b>Ein Gleichstand an der Spitze verurteilt niemanden.</b> Pro Tag wird höchstens eine Person verurteilt.</li>
<li><b>Nacht.</b> Die Bildschirme werden dunkel. Mit Träumen dauert der Einbruch der Nacht fünfzehn Sekunden (ohne fünf): Alle decken ihren Traum auf, und Traumdiebe dürfen tauschen. Wem der Traum gestohlen wurde, der sieht es. Dann öffnen sich die Nachtaktionen von selbst. Wer eine Nachtfähigkeit hat, gibt sie heimlich ab; der Tod einigt sich auf seinen Mord. Wenn alle schlafen — oder die Zeit abläuft —, wertet der Server alle Aktionen gleichzeitig aus, und der nächste Tag bricht an.</li>
</ol>
<p class="small">Was du bis zum Schließen eines Fensters nicht abgibst, wird zum Pass (oder zur Enthaltung). Ein getrenntes Handy behält seinen Platz und seine Geheimnisse.</p>`,
    winH: 'Sieg',
    win: `<ul>
<li><b>Nicht-Tod gewinnt</b>, sobald kein tod-gesinnter Spieler mehr lebt.</li>
<li><b>Der Tod gewinnt</b>, sobald die lebenden Tod-Gesinnten alle anderen Lebenden <b>zahlenmäßig übertreffen</b>. Gleichstand reicht nicht.</li>
<li>Der <b>Narr</b> (nur Volles Deck) gewinnt allein und sofort, wenn die Stadt ihn per Abstimmung verurteilt.</li>
<li>Lässt eine Nacht niemanden am Leben, endet das Spiel <b>unentschieden</b>.</li>
<li>Mit der <b>Weltuntergangsuhr</b> gewinnt der Tod auch, wenn bis zum Ende des letzten Tages niemand gewonnen hat.</li>
<li><b>Blutmond</b> (standardmäßig an): Nach zwei Nächten in Folge ohne Tote hält in der nächsten Nacht kein Schutz, und nichts kann den Mord des Todes blockieren. So enden Pattsituationen wie ein Wächter, der sich gegen einen einzelnen Tod immer selbst schützt.</li>
<li><b>Ein ruhiger erster Tag</b> (standardmäßig an): An Tag 1 wird nur geredet. Niemand kann nominiert werden und es gibt keine Abstimmung; das erste Urteil kann an Tag 2 fallen.</li>
<li><b>Der Psycho</b>: wie oft der Psycho jemanden markieren darf. Einmal pro Spiel (Standard); einmal Stumm und einmal Keine Stimme, in beliebiger Reihenfolge; oder einmal jede Nacht.</li>
<li><b>Tod gewinnt unter den letzten zwei</b> (optional): Ist ein Tod unter den letzten zwei Lebenden, gewinnt der Tod sofort.</li>
</ul>
<p>Der Sieg wird nach jeder vollständigen Auswertung geprüft — nie mitten in einer Nacht.</p>`,
    coreH: 'Grundrollen',
    coreP: 'Immer im Spiel.',
    killH: 'Wie das Todesteam tötet',
    kill: 'Alle lebenden Tod-Mitspieler teilen sich einen Raum. Jeder schlägt Ziele vor; der Mord geschieht nur, wenn <b>alle genau dieselbe Auswahl bestätigen</b>. Jede Uneinigkeit oder fehlende Bestätigung, und der Tod passt. Das Team tötet <b>einen</b> Spieler pro Nacht, egal wie viele Tode es gibt — zwei mit Doppelter Gefahr, Nachtschicht oder Kraftschub, aber nie mehr als zwei.',
    extH: 'Zusatzrollen — Standard',
    extP: 'Ab 7 Spielern werden zusätzliche Plätze aus diesem Pool gefüllt (geheim gezogen). 7 Spieler → 1 Zusatzplatz, 10 → 2, 11+ → 3.',
    fullH: 'Ergänzungen im vollen Deck',
    fullP: 'Nur in Volles Deck / Chaos oder Eigenes Spiel. Für erfahrene Gruppen.',
    dreamsH: 'Träume',
    dreamsP: 'Ab Nacht 1 zieht jeder lebende Spieler jede Nacht zufällig eine Traumkarte (Doppelte möglich). Sie gilt nur für diese Nacht. Du darfst deinen beschreiben — wahrheitsgemäß oder nicht.',
    dreamsNote: `Manche Träume sind seltener als andere, und Schlaflosigkeit kommt nie öfter als zweimal pro Spiel vor; im eigenen Spiel lässt sich die Häufigkeit jedes Traums einstellen. Tausche der Traumdiebe passieren während des Einbruchs der Nacht, bevor die Aktionen öffnen, in Sitzreihenfolge, je einmal. Es zählt die Karte, die du am Ende hältst.`,
    rulesH: 'Regelkarten',
    rulesP: '1–3 werden beim Aufbau gezogen (oder gewählt) und gelten das ganze Spiel. Manche lassen sich nur auf Ehrenwort durchsetzen, wenn ihr im selben Raum spielt.',
    countsH: 'Rollenanzahl',
    countsTh: ['Spieler', 'Tod', 'Unschuldiger', 'Wächter · Mentalist · Psycho', 'Zusatz'],
    modesNote: 'Klassisch / Lernen füllt Zusatzplätze mit Unschuldigen. Im selben Raum oder online ist nur eine Frage der Übertragung, kein anderes Spiel: online gibt es zusätzlich einen Tischchat in der App (und bei Nebel des Krieges Nachbarflüstern).',
    orderH: 'Wer schlägt was in der Nacht',
    order: `<p>Alle geben gleichzeitig ab; danach wertet der Server in fester Reihenfolge aus, sodass das Ergebnis nie davon abhängt, wer zuerst getippt hat.</p>
<ol>
<li><b>Unterdrückung.</b> Die Stille des Barden hebt jede Rollenfähigkeit auf. Schlafparalyse stoppt ihren Träger — und ein aktiver Tod mit Paralyse stoppt den ganzen Mord. Unzuverlässige Kraft würfelt.</li>
<li><b>Flüche & Besuche.</b> Der Fluch einer Hexe lässt die Aktion des Ziels verpuffen (oder den ganzen Mord des Todes). Eine Hure, die einen aktiven Tod besucht, setzt den Mord auf null.</li>
<li><b>Bekehrungen.</b> Erst das Gelöbnis des Doppelagenten, dann die Kopie des Nachahmers. Für den Mentalisten zählen sie schon heute Nacht, doch neue Tod-Mitglieder morden erst ab der nächsten Nacht mit.</li>
<li><b>Der Mord des Todes.</b> Ein Ziel überlebt, wenn es in dieser Reihenfolge hat: vorübergehende Wiederbelebung, Schutzengel, Hexensegen, Schild des Wächters, eine richtige Vorhersage des Orakels. Sonst fängt ein Leibwächter die Klinge ab — sonst stirbt es.</li>
<li><b>Psycho.</b> Die Markierung greift, außer das Ziel ist tot oder geschützt (Wiederbelebung, Engel, Segen, Wächter).</li>
<li><b>Bomben & der Rest.</b> Eine Bombe ist ein fairer Münzwurf; der Wächter hält sie nicht auf. Besuchende Huren geraten in die Explosion. Lesungen, Lieferungen, Wetten.</li>
<li>Der <b>Nekromant</b> erweckt die Toten — nur wenn er selbst die Nacht überlebt hat.</li>
<li><b>Verbundene Schicksale.</b> Huren sterben mit einem besuchten Opfer des Todes; Träger von Geteiltem Albtraum und Schlafwandeln sterben mit ihrem Partner. Nur Wiederbelebung oder Schutzengel verhindern einen verbundenen Tod. Danach läuft geliehene Zeit ab.</li>
<li><b>Tagesanbruch.</b> Überlebende erhalten ihre privaten Berichte. Die Öffentlichkeit erfährt nur, wer gestorben ist.</li>
</ol>`,
    kicker: "Das Regelbuch",
    intro: "Dead Set ist eine Familie von Partyspielen für einen Raum. Alle spielen auf dem eigenen Handy; ein Fernseher, falls vorhanden, ist die gemeinsame Bühne. Wählt ein Spiel, lest sein Kapitel, spielt.",
    aboutH: "Was Dead Set ist",
    about: `<p>Dead Set ist eine Sammlung sozialer Spiele (verborgene Rollen, Bluff, Wortspiele, Vorhersagen), die sich einen Tisch teilen. Jedes Spiel funktioniert gleich: Das <b>Handy jeder Person ist ein privater Bildschirm</b>, der nur zeigt, was diese Person wissen darf, und die App ist der Erzähler. Niemand muss aussetzen, um das Spiel zu leiten.</p>
<ul>
<li><b>Keine Installation.</b> Es läuft im Browser. Beitreten mit einem sechsstelligen Code, einem Link oder einem QR-Code.</li>
<li><b>3 bis 25 Spieler</b>, je nach Spiel. Jedes Kapitel nennt Tischgröße und Dauer.</li>
<li><b>Ein Fernseher ist optional, aber am schönsten.</b> Er zeigt den Tisch, die Szenen, die Punkte und die Musik. Ein Geheimnis zeigt er nie.</li>
<li><b>Sieben Sprachen.</b> Jede Person wählt ihre eigene; Wortspiele nutzen die Tischsprache auf allen Handys, damit die Wörter übereinstimmen.</li>
<li><b>Ein Tisch, viele Spiele.</b> Wechselt das Spiel zwischen den Runden in der Lobby; innerhalb einer Partie werden die Punkte übernommen.</li>
</ul>`,
    tableH: "Einen Tisch eröffnen",
    table: `<ol>
<li><b>Tisch eröffnen.</b> Der Gastgeber tippt auf <em>Tisch eröffnen</em>, gibt einen Namen ein und erhält einen sechsstelligen Raumcode.</li>
<li><b>Einladen.</b> Teilt den Code, den Link oder den QR-Code. Alle anderen tippen auf <em>Tisch beitreten</em> (oder öffnen den Link), geben einen Namen ein und wählen ein Porträt.</li>
<li><b>Den Fernseher einschalten.</b> Tippt in der Lobby auf <em>TV-Anzeige</em>, oder öffnet den Raum im Browser des Fernsehers und wählt <em>TV-Tisch öffnen</em>. Mehrere Bildschirme können den Tisch gleichzeitig zeigen.</li>
<li><b>Plätze.</b> Die Spieler sitzen in der Reihenfolge, in der sie beitreten. Der Gastgeber kann auf einen Platz tippen, um jemanden umzusetzen oder zu entfernen.</li>
</ol>
<p>Dein Platz ist an deinen Browser gebunden. Fällt ein Handy aus, kann der Gastgeber dir im Raummenü einen einmaligen Wiederherstellungscode geben; wähle auf dem neuen Handy <em>Meinen Platz wiederherstellen</em> und gib ihn ein, dann zieht dein Platz (mit seinen Geheimnissen) dorthin um. Ein Handy, das die Verbindung verliert, behält seinen Platz und holt auf, sobald es zurück ist.</p>
<p>Für einen Tisch, an dem jemand das Spiel leiten und alles sehen will, eröffnet den Raum mit einem <b>vertrauenswürdigen Moderator</b>. Der Moderator hat keinen Platz, und alle werden darüber informiert.</p>`,
    setupH: "Ein Spiel einrichten",
    setup: `<p>Die Lobby führt den Gastgeber bei jedem Spiel durch dieselben nummerierten Schritte. Gäste sehen dieselben Schritte, nur zum Lesen.</p>
<ol>
<li><b>Das Spiel.</b> Wählt eines, nach Familien geordnet: Verborgene Treue, Wechselnde Hände, Menschenkenntnis, Zeichen &amp; Rätsel, Bluff &amp; Einsatz.</li>
<li><b>So funktioniert es.</b> Vier oder fünf bebilderte Schritte: das ganze Spiel auf einen Blick.</li>
<li><b>Das Deck.</b> Was bei dieser Tischgröße ausgeteilt wird: Rollen, Masken, Karten oder Orte. Es passt sich an, wenn Spieler beitreten.</li>
<li><b>Regeln.</b> Die Schalter des Spiels. Die Voreinstellungen ergeben ein gutes erstes Spiel.</li>
<li><b>Der Tisch.</b> Die Tischsprache, die Musik und ihr Stil, Hintergründe und (wo es etwas ändert) ob ihr im selben Raum oder per Fernspiel mit Chat spielt.</li>
<li><b>Timer.</b> Wie lange jeder Schritt dauert. Eingeklappt; die Voreinstellungen passen für die meisten Tische.</li>
</ol>
<p>Alle tippen auf <b>Bereit</b>, sobald sie die Einstellungen gelesen haben, und der Gastgeber startet das Spiel. Ein Problem mit den Einstellungen (zu wenige Spieler für eine Rolle zum Beispiel) erscheint als Hinweis unter den Schritten.</p>`,
    playH: "Wie jedes Spiel abläuft",
    play: `<ul>
<li><b>Zeig nie deinen Bildschirm.</b> Dein Handy zeigt deine Rolle, deine Karten und deine Entscheidungen. Alles andere wird laut gesagt oder auf dem Fernseher gezeigt.</li>
<li><b>Gemeinsame Szenen.</b> Große Momente (eine Enthüllung, eine Stimmauszählung, die Nacht) laufen auf allen Handys und dem Fernseher im selben Moment und gleich lang. Man kann sie nicht überspringen, und währenddessen läuft kein Timer.</li>
<li><b>Eine Person wählen:</b> Tippe auf ihren Platz am Tischkreis. Ein wählbarer Platz pulsiert; deine Wahl wird pergamentfarben.</li>
<li><b>Bestätigen:</b> Eine private Entscheidung (eine Stimme, eine verdeckt gespielte Karte, eine Vorhersage) ist ein <b>Tippen</b> und lässt sich bis zum Ende des Schritts ändern. <b>Halten</b> gibt es nur für öffentliche Züge, die sich nicht zurücknehmen lassen, und der Knopf sagt es immer: Lass den Daumen drauf, bis die goldene Füllung voll ist.</li>
<li><b>Die Kopfzeile</b> nennt den aktuellen Schritt des Spiels und seine Nummer (Nacht II, Mission 3, Runde 4…) mit der verbleibenden Zeit.</li>
<li><b>Unter dem Tisch:</b> <em>Meine Karte</em> (deine Rolle, jederzeit), das Nachschlageblatt des Spiels, deine privaten <em>Notizen</em> und die <em>Geschichte</em>, wo das Spiel sie hat.</li>
<li><b>Timer.</b> Läuft die Zeit ab, handelt das Spiel für alle, die noch nichts getan haben: meist ein Passen oder eine Enthaltung, aber manche Spiele wählen für dich (Särge etwa vergräbt einen zufälligen Sarg). Der Gastgeber kann im Raummenü 30 Sekunden hinzufügen, weitergehen oder das Spiel beenden.</li>
<li><b>Hinweise</b> darauf, was andere gerade getan haben, erscheinen kurz in der Kopfzeile.</li>
<li><b>Ehrenregeln.</b> Einige Regeln (Schweigen, stummgeschaltete Spieler) kann nur der Tisch selbst einhalten. Beim Fernspiel setzt der Chat sie durch.</li>
</ul>`,
    afterH: "Nach einem Spiel",
    after: `<p>Der Endbildschirm nennt die Sieger, deckt jedes Geheimnis auf und spielt in den meisten Spielen nach, was wirklich geschah. Blättere die Rückschau in deinem Tempo durch.</p>
<p>Viele Spiele werden als <b>Partie</b> aus 1, 3 oder 5 Spielen gespielt: Die Punkte werden übernommen, und der Tisch kehrt mit denselben Einstellungen in dieselbe Lobby zurück, alle bereit für das nächste Spiel. In der Lobby kann der Gastgeber auch zu einem anderen Spiel wechseln; Tisch, Plätze und Porträts bleiben.</p>`,
    hSetup: "Vorbereitung",
    hCast: "Die Besetzung",
    hLoop: "Ablauf eines Spiels",
    hWin: "Sieg und Punkte",
    hOpts: "Optionen in der Lobby",
    classicP: "Das ursprüngliche Dead Set: verborgene Rollen, nächtliche Morde und eine geheime Abstimmung am Tag. Die meisten von euch wollen überleben. Ein paar von euch sind der Tod. Niemand weiß, wer wer ist — außer dem Tod, der seine Mitspieler kennt.",
    presetsH: "Varianten",
    modesTh: ['Variante', 'Spieler', 'Was sich ändert'],
    classicSetup: `<p>5–13 Spieler (bis 25 mit eigenem Deck). Alle erhalten eine geheime <b>Rolle</b>. Die meisten Rollen gehören zur Seite <b>Nicht-Tod</b>; ein oder mehrere Spieler sind heimlich der <b>Tod</b>, und die Spieler des Todes kennen einander. Nacht und Tag wechseln sich ab, bis eine Seite gewinnt.</p>
<ul>
<li><b>Rollen</b> sind, wer du das ganze Spiel über bist: deine Seite und deine Fähigkeit.</li>
<li><b>Träume</b> sind Effekte für eine Nacht: Ab Nacht 1 zieht jeder lebende Spieler jede Nacht heimlich einen.</li>
<li><b>Regelkarten</b> (1–3, beim Aufbau gezogen) verbiegen das ganze Spiel: doppelte Morde, gewichtete Stimmen, Geister, die abstimmen.</li>
<li><b>Die Geschichte</b> (WER / WO / WARUM) ist reines Erzählen. Sie ändert nie eine Regel.</li>
</ul>
<p>Du darfst die Wahrheit über deine Rolle sagen, lügen oder schweigen. Der Gastgeber spielt wie alle anderen und sieht nicht mehr Geheimnisse.</p>`,
    missionsSetup: `<p>5–12 Spieler. Niemand stirbt: Der Tod hat sich in die Expedition eingeschlichen, und der Tisch muss ihn finden, bevor er das Medium findet. Alle erhalten eine geheime Rolle. Die Spieler des Todes sehen einander (außer dem Streuner); die Lebenden kennen nur sich selbst, und das Medium spürt, wer der Tod ist.</p>
<p>Der Tisch spielt fünf Missionen. Jede Mission braucht ein Team bestimmter Größe (in der Lobby und auf dem Fernseher gezeigt); ab 7 Spielern braucht Mission 4 zwei Sabotagen, um zu scheitern.</p>`,
    missionsLoop: `<ol>
<li><b>Die Missionskarte.</b> Jede Mission beginnt mit einer Karte. Die meisten sind regulär; ab und zu ändert eine das Team, die Abstimmung oder die Enthüllung dieser Mission.</li>
<li><b>Der Vorschlag.</b> Der Missionsanführer (er hält die Laterne) tippt Spieler im Kreis an, um das Team zu füllen.</li>
<li><b>Die Teamabstimmung.</b> Alle tippen heimlich Zustimmen oder Ablehnen. Die Stimmen werden auf einmal aufgedeckt, mit Namen. Eine Mehrheit schickt das Team los; sonst geht die Laterne an den nächsten Spieler. Der fünfte Vorschlag einer Mission gilt unabhängig von der Abstimmung.</li>
<li><b>Die Mission.</b> Jedes Teammitglied spielt verdeckt eine Karte. Die Lebenden können nur Erfolg spielen; der Tod darf Erfolg oder Sabotage spielen. Die Karten werden gemischt und einzeln umgedreht: Eine Sabotage lässt die Mission scheitern.</li>
<li><b>Das nächtliche Zwischenspiel.</b> Alle notieren einen geheimen Verdacht, wer der Tod ist. Nach den Missionen 2, 3 und 4 erfährt der Halter der Kerze die Seite eines Spielers, und die Kerze geht an diesen Spieler. Mit Hinweisen kann im Morgengrauen ein wahrer Hinweis kommen.</li>
</ol>`,
    missionsWin: `<ul>
<li><b>Drei Erfolge:</b> Der Tod enttarnt sich, und der Schnitter nennt, wen er für das Medium hält (der Tod darf sich vorher beraten). Richtig: Der Tod gewinnt. Falsch: Die Lebenden gewinnen.</li>
<li><b>Drei Fehlschläge:</b> das letzte Gefecht. Alle nennen einen Spieler. Nennt der Tisch einen Lebenden, gewinnt der Tod; fängt er den Tod, bekommt der Schnitter trotzdem die Abrechnung: Findet er das Medium, stiehlt der Tod den Sieg.</li>
<li><b>Nebenmissionen</b> ändern das Gewicht deiner Stimme im letzten Gefecht: doppelt, wenn du deine erfüllt hast, halb, wenn nicht.</li>
<li>Der Narr gewinnt, falls im Spiel, allein, wenn er im letzten Gefecht oder vom Schnitter genannt wird.</li>
</ul>`,
    missionsOpts: `<ul>
<li><b>Rollen:</b> Gläubiger, Scharlatan, Verschleierter, Streuner, Totengräber und Narr ein- oder ausschalten, und die Zwillinge hinzufügen.</li>
<li><b>Nebenmissionen:</b> ein geheimes persönliches Ziel für alle.</li>
<li><b>Nächster Missionsanführer:</b> der Nächste in der Reihe, oder vom letzten Anführer gewählt.</li>
<li><b>Missionskarten:</b> aus, selten oder manchmal.</li>
<li><b>Hinweise:</b> selten, gelegentlich oder häufig.</li>
<li><b>Geschichte:</b> ein zufälliges WER / WO / WARUM, oder eure eigene.</li>
</ul>`,
    exorcismSetup: `<p>3–12 Spieler, 5–10 Minuten pro Runde. Die Lebenden kennen das geheime Passwort, das den Dämon unter ihnen bannen würde; der Dämon kennt es nicht. Alle sehen die Kategorie. Die Wörter erscheinen auf allen Handys in der Tischsprache, damit sie übereinstimmen.</p>`,
    exorcismLoop: `<ol>
<li><b>Die Kristallkugel.</b> Tippe darauf, um hineinzusehen: die Kategorie und (wenn du lebend bist) das Passwort. Der Dämon sieht nur die Kategorie und muss bluffen.</li>
<li><b>Das Los.</b> Eine Lotterie bestimmt, wer zuerst spricht; dann geht der Zug in Sitzreihenfolge um den Tisch.</li>
<li><b>Ein Wort pro Person.</b> Sag in deinem Zug ein Wort, das mit dem Passwort zu tun hat, und halte dann die Taste auf deinem Handy. Beweise, dass du es kennst, ohne es dem Dämon zu verraten. Je nach Lobby gehen die Wörter einmal oder öfter herum und können eingetippt und auf dem Fernseher gezeigt werden.</li>
<li><b>Den Dämon nennen.</b> Beratet euch, dann stimmen alle für einen Spieler.</li>
<li><b>Ein letzter Versuch.</b> Ein gefasster Dämon darf das Passwort nennen, aus dem Wortgitter oder eingetippt.</li>
</ol>`,
    exorcismWin: `<ul>
<li>Die Abstimmung trifft einen Lebenden oder endet unentschieden (außer die Münze entscheidet Gleichstände): <b>Der Dämon gewinnt</b>.</li>
<li>Die Abstimmung trifft den Dämon: <b>Die Lebenden gewinnen</b>, außer der Dämon errät dann das Passwort und stiehlt den Sieg.</li>
<li>Die Punkte laufen Runde für Runde weiter: jeder Lebende +1 für einen Sieg, jeder Dämon +2.</li>
</ul>`,
    exorcismOpts: `<ul>
<li><b>Dämonen:</b> einer, oder ab 7 Spielern zwei; zwei Dämonen können einander kennen oder nicht.</li>
<li><b>Ein letzter Versuch:</b> an oder aus.</li>
<li><b>Gleichstand:</b> Der Dämon entkommt, oder eine Münze entscheidet.</li>
<li><b>Wortgitter:</b> 16 Wörter auf Fernseher und Handys; das Passwort ist eines davon.</li>
<li><b>Runden:</b> wie oft die Wörter um den Tisch gehen. <b>Wörter eintippen:</b> auf dem Fernseher gezeigt.</li>
<li><b>Kategorien:</b> aus welchen Wortlisten gezogen wird.</li>
</ul>`,
    coffinsSetup: `<p>3–10 Spieler, ein schnelles Spiel. Alle spielen für sich und halten vier Särge: drei mit Gold und einen Fluch (fünf mit der längeren Option: vier Gold, ein Fluch). Deine Särge sind vor allen anderen verborgen.</p>`,
    coffinsLoop: `<ol>
<li><b>Die Beerdigung.</b> Alle vergraben gleichzeitig heimlich einen Sarg: Tippe einen Sarg an, dann auf Vergraben. Dein Grab ist ein Stapel, der neueste oben.</li>
<li><b>Vergraben oder herausfordern.</b> Ab dem ersten Spieler der Runde vergräbst du in deinem Zug entweder einen weiteren Sarg oben auf deinem Stapel, oder du forderst heraus: „Ich kann N öffnen“, höchstens so viele, wie insgesamt vergraben sind.</li>
<li><b>Das Bieten.</b> Reihum erhöht man die Zahl oder passt. Passen gilt für die ganze Runde. Wer als letzter Bieter übrig bleibt, ist der Gräber.</li>
<li><b>Das Graben.</b> Der Gräber öffnet zuerst die eigenen Särge, von oben nach unten, dann wählt er andere Gräber, jeweils den obersten Sarg, bis N Särge offen sind. Jeder Sarg wird auf dem Fernseher umgedreht.</li>
<li><b>Das Ergebnis.</b> Alles Gold: ein sauberes Graben, und dein Grabstein wird vergoldet. Ein Fluch im eigenen Grab: Du wählst einen Sarg, den du verlierst. Der Fluch eines anderen: Er zieht blind einen deiner Särge, und der ist weg; der Besitzer des Fluchs beginnt die nächste Runde.</li>
</ol>`,
    coffinsWin: `<ul>
<li>Gewinne mit zwei sauberen Grabungen (1 oder 3 in der Lobby), oder als letzter Spieler mit Särgen.</li>
<li>Über eine Partie: der Sieger +3, jedes saubere Graben +1, jede Rückkehr von den Toten +1.</li>
</ul>`,
    coffinsOpts: `<ul>
<li><b>Der Sarg des Todes</b> (voreingestellt an): In jeder Runde hält ein verborgener Spieler ihn anstelle eines Goldsargs. Gräbst du ihn aus, scheitert das Graben; sein Halter stiehlt einen deiner Särge, der zu Gold wird.</li>
<li><b>Geisterwetten und Wiedergänger</b> (voreingestellt an): Spieler ohne Särge wetten bei jedem Graben auf Gold oder Fluch; dreimal richtig, und sie kehren mit einem Goldsarg zurück.</li>
<li><b>Reliquien</b> (voreingestellt aus): eine geheime Laterne (in ein Grab spähen), ein Schlüssel (ein anderes Grab vor dem eigenen öffnen) oder ein Schutz (ein Fluch kostet nichts), je einmal nutzbar.</li>
<li><b>Saubere Grabungen zum Sieg, Särge pro Spieler, Spiele pro Partie.</b></li>
</ul>`,
    carnivalSetup: `<p>4–12 Spieler. Alle spielen für sich. Jede Maske ist eine bekannte Dead-Set-Rolle mit einer Fähigkeit. Alle beginnen mit 6 Seelen; die Opfergabe, der Teller in der Tischmitte, ist zu Beginn leer. Bei 4–5 Spielern liegen zwei zusätzliche Masken auf leeren Stühlen: Sie nehmen am Ball teil, handeln aber nie.</p>
<p><b>Die Demaskierung:</b> Ein paar Sekunden lang wird jede Maske offen gezeigt, auf dem Fernseher und auf allen Handys. Merkt sie euch; dann werden sie umgedreht. Eine Lotterie bestimmt den ersten Tänzer, und es geht im Uhrzeigersinn weiter.</p>`,
    carnivalLoop: `<p>In deinem Zug tust du eines von drei Dingen:</p>
<ul>
<li><b>Tauschen oder täuschen.</b> Wähle eine andere Maske (einen Spieler oder einen leeren Stuhl) und halte dann Tauschen oder Täuschen. Die beiden Tasten sehen gleich aus, und niemand, nicht einmal der andere Spieler, erfährt, was du gewählt hast.</li>
<li><b>Spähen.</b> Sieh dir kurz deine eigene Maske an. Alle sehen, dass du geschaut hast.</li>
<li><b>Beanspruchen.</b> Nenne eine Maske, „Ich bin der Richter“, und nutze ihre Fähigkeit.</li>
</ul>
<p><b>Herausforderungen.</b> Beansprucht jemand eine Maske, fragt jedes andere Handy: <em>Ist das deine Maske?</em> Fordert niemand heraus, gilt der Anspruch, und die Fähigkeit wirkt, was auch immer der Beanspruchende wirklich trägt. Fordert jemand heraus, heben der Beanspruchende und alle Herausforderer ihre Masken: Wer sie wirklich trägt, nutzt die Fähigkeit, alle anderen Aufgedeckten zahlen eine Seele (oder mehr, je nach Lobby) in die Opfergabe.</p>
<p><b>Der Eröffnungstanz.</b> Der erste Zug jedes Spielers (zwei, wenn der Gastgeber will) muss Tauschen oder täuschen sein, damit die Masken schon im Zweifel sind, bevor jemand etwas beansprucht.</p>`,
    carnivalWin: `<ul>
<li><b>Ein voller Beutel:</b> 13 Seelen (oder die Zahl aus der Lobby), und du gewinnst sofort.</li>
<li><b>Die Ernte des Todes:</b> Wer durch Ansprüche als Tod 6 Seelen geerntet hat, gewinnt.</li>
<li><b>Ruin:</b> Sobald jemand auf 0 Seelen fällt, gewinnt der Reichste (bei Gleichstand die höhere Ernte).</li>
<li>Über eine Partie: der Sieger +3, alle anderen +1 für jede Seele über 6.</li>
</ul>`,
    carnivalOpts: `<ul>
<li><b>Masken:</b> Das empfohlene Set wächst mit dem Tisch; oder stellt euer eigenes zusammen, eine Maske pro Platz (der Tod ist Pflicht; nur der Unschuldige darf mehrfach vorkommen).</li>
<li><b>Voller Beutel, Ernte des Todes, Strafe für einen falschen Anspruch, Eröffnungstanz, Spiele pro Partie.</b></li>
<li><b>Notizen (das Balltagebuch):</b> voreingestellt aus, damit ihr das Gesehene im Kopf behaltet.</li>
</ul>
<p>Tippe jederzeit auf <em>Masken auf dem Ball</em>, um jede Maske im Spiel mit ihrer Fähigkeit zu sehen, als Zeichenreihe gezeichnet.</p>`,
    midnightSetup: `<p>4–12 Spieler, etwa 10 Minuten. Eine Nacht, eine Abstimmung, keine zweite Chance. Das Deck hat eine Karte pro Spieler und drei verdeckte Karten auf dem Tisch (die leeren Stühle). Das Deck ist öffentlich; wer was hält, nicht. Alle sehen ihre eigene Karte einmal, beim Austeilen.</p>
<p>Karten wechseln im Dunkeln den Besitzer. <b>Im Morgengrauen bist du die Karte, die vor dir liegt</b>, nicht die, die du bekommen hast.</p>`,
    midnightLoop: `<ol>
<li><b>Das Austeilen.</b> Sieh dir deine Karte einmal an.</li>
<li><b>Die Nacht.</b> Die Handys wecken jede Rolle der Reihe nach: Nachahmer, Tod, Verschwörer, Zwillinge, Mentalist, Doppelagent, Hexe, Spieler, Schlaflose. Jeder Schritt dauert gleich lange, 10 Sekunden, und läuft auch, wenn seine Karte auf dem Tisch liegt, damit die Nacht nichts verrät. Nur wer diese Karte bekommen hat, erhält Steuerelemente; jedes andere Handy sagt, die Augen geschlossen zu halten. Ein Spieler, der nichts tut, tauscht mit einer zufälligen Tischkarte.</li>
<li><b>Der Tag.</b> Eine Diskussion (voreingestellt 5 Minuten): behaupten, beschuldigen, lügen. Karten können gewandert sein; traut niemandem, nicht einmal euch selbst. Der Gastgeber kann die Abstimmung früher öffnen.</li>
<li><b>Die Abstimmung.</b> Alle zeigen gleichzeitig auf einen anderen Spieler. Wer die meisten Stimmen hat, stirbt, wenn es mindestens zwei sind; bei Gleichstand an der Spitze sterben alle Gleichplatzierten. Stirbt der Rächer, stirbt auch der Spieler, auf den er gezeigt hat.</li>
</ol>`,
    midnightWin: `<ul>
<li>Die Seiten werden von den Karten im Morgengrauen abgelesen (ein Nachahmer zählt als die kopierte Rolle).</li>
<li><b>Die Lebenden</b> gewinnen, wenn mindestens ein Tod stirbt; ist kein Tod unter den Spielern, wenn niemand stirbt.</li>
<li><b>Der Tod und der Verschwörer</b> gewinnen, wenn kein Tod stirbt (und der Narr nicht starb).</li>
<li><b>Der Narr</b> gewinnt allein, wenn er hinausgewählt wird. Mehrere Seiten können zusammen gewinnen.</li>
<li>Über eine Partie: jeder Sieger +1, der Narr +2. Der Endbildschirm zeigt jede Karte wie ausgeteilt und im Morgengrauen und spielt die Nacht nach.</li>
</ul>`,
    midnightOpts: `<ul>
<li><b>Karten:</b> Das empfohlene Deck wächst mit dem Tisch; oder wählt sie selbst (Tod 1–2, Zwillinge 0 oder 2, Unschuldige 0–4, der Rest 0–1; insgesamt Spieler + 3).</li>
<li><b>Ein einsamer Tod späht:</b> Ein Tod, der allein erwacht, darf eine Tischkarte ansehen.</li>
<li><b>Länge der Diskussion, Spiele pro Partie.</b></li>
</ul>`,
    seanceSetup: `<p>4–10 Spieler, etwa 30 Minuten. Ein kooperativer Mordfall mit einem Verräter. Ein Spieler ist der Geist: Er weiß, wer ihn getötet hat, wo und warum, und er kann nicht sprechen. Alle anderen sind Medien und lesen seine Visionen. Ab fünf Spielern kann sich ein Täuscher unter den Medien verstecken: ein zweiter Geist, der die Wahrheit kennt und gegen den Tisch arbeitet.</p>
<p><b>Das Brett:</b> drei Reihen Story-Karten, WER, WO und WARUM. In jeder Reihe ist eine Karte die Wahrheit. Die Séance fragt nacheinander: erst wer, dann wo, dann warum.</p>`,
    seanceLoop: `<ol>
<li><b>Visionen.</b> Der Geist schickt jedem Medium eine Vision zur Frage: eine Karte mit zwei oder drei radierten Motiven. Seine Hand hält immer ein paar, die zur Antwort passen; der Rest ist das Glück des Stapels. Währenddessen markiert jedes Medium heimlich seinen <b>Verdacht</b>: wen es verdächtigt.</li>
<li><b>Der Tausch des Täuschers.</b> Ein paar Mal pro Spiel tauscht der Täuscher heimlich die Vision eines anderen Mediums gegen eine eigene, die auf eine falsche Karte deutet.</li>
<li><b>Hände.</b> Die Visionen werden aufgedeckt und bleiben liegen, bis die Frage beantwortet ist. Beratet euch. Der Geist schweigt, kann aber eine Vision mit einem kalten Fleck vereisen: <em>Die ist nicht von mir.</em> Dann legt jedes Medium seine Hand auf eine Karte.</li>
<li><b>Der Geist antwortet.</b> Die Karte unter den meisten Händen wird dem Geist vorgelegt; bei Gleichstand, oder ohne Hände, wählt die Planchette zufällig. Ja: weiter zur nächsten Frage. Nein: Die Karte wird gestrichen.</li>
<li><b>Die Uhr.</b> Jede Runde brennt eine von sieben Kerzen ab, egal wie die Antwort lautet.</li>
</ol>`,
    seanceWin: `<ul>
<li>Beantwortet alle drei Fragen, bevor die Kerzen abbrennen, und benennt dann den Täuscher (euer letzter Verdacht ist markiert). Richtig: ein <b>voller Sieg</b>. Falsch: ein <b>hohler Sieg</b>, geteilt mit dem Täuscher.</li>
<li>Brennt die Uhr ab, gewinnt der Täuscher (ohne Täuscher verliert der Tisch). Blind raten reicht nicht: sieben Kerzen für drei Antworten unter je sechs Karten.</li>
<li>Über ein Match: voller Sieg +2 für den Geist und jedes Medium; hohler Sieg +1 für alle und +1 für den Täuscher; Sieg des Täuschers +3.</li>
<li>Der Endbildschirm spielt jede Runde nach: die wahren Visionen, die Täusche, die Hände und die Verdachte.</li>
</ul>`,
    seanceOpts: `<ul>
<li><b>Schwierigkeit:</b> wie viele Karten in einer Reihe liegen, wie viele Visionen des Geistes zur Antwort passen und wie viele Kerzen die Uhr hat.</li>
<li><b>Täuscher:</b> keiner, einer oder zwei, und ob zwei einander kennen; wie viele Täusche sie haben.</li>
<li><b>Die kalten Flecken des Geistes:</b> wie viele Visionen er vereisen darf.</li>
<li><b>Der Geist:</b> ausgelost oder vom Gastgeber gewählt. <b>Spiele pro Match.</b></li>
</ul>`,
    graveSetup: `<p>4–12 Spieler, etwa 15 Minuten. Zwei Grabräuberbanden, der Mond und die Sonne, graben auf einem Friedhof mit 25 Grabsteinen nach den Reliquien, die ihre Gottheit rufen. Eine Münze bestimmt die Bande, die zuerst gräbt: Sie hat 9 Reliquien in der Erde, die andere 8. Sieben Gräber sind leer, und eines ist das Grab des Todes.</p>
<p>Jede Bande hat einen <b>Totengräber</b>, den einzigen Spieler, der das Grabregister sieht: was unter jedem Stein liegt. Alle anderen graben. Die Grabsteine zeigen Wörter in der Tischsprache oder Bleistiftsymbole.</p>`,
    graveLoop: `<ol>
<li><b>Das Zeichen.</b> Im Zug seiner Bande gibt der Totengräber ein Wort und eine Zahl, „Ozean · 3“: ein Wort, das mehrere Gräber seiner Bande verbindet, und wie viele. Das Wort darf nicht auf dem Brett stehen. Danach sagt er nichts mehr.</li>
<li><b>Das Graben.</b> Die Gräber beraten sich und stimmen auf ihren Handys ab; das Grab mit den meisten Stimmen wird geöffnet (bei Gleichstand entscheidet die Münze).</li>
<li><b>Was darunter liegt.</b> Eine Reliquie deiner Bande: Grabt weiter, bis zur Zahl. Ein leeres Grab oder eine Reliquie der anderen Bande (die nun ihr gehört): Der Zug geht weiter. Das Grab des Todes: Eure Bande verliert sofort.</li>
<li><b>Aufhören.</b> Die Bande kann dafür stimmen aufzuhören. Wer vor Erreichen der Zahl aufhört, behält ein Bonusgraben für den nächsten Zug (es sammelt sich nie an).</li>
</ol>
<p>Schalte dein Handy zwischen <em>Steine</em> (Wörter oder Symbole) und <em>Karte</em> (das Brett auf einen Blick) um.</p>
<p><b>Drei Banden</b> (6–12 Spieler): der Mond, die Sonne und die Sterne, je ein Drittel des Tisches. Die erste Bande versteckt 7 Reliquien, die anderen je 6, mit 5 leeren Gräbern. Das Grab des Todes wirft eine Bande aus dem Spiel; die anderen graben weiter, und bleibt eine Bande übrig, gewinnt sie.</p>`,
    graveWin: `<ul>
<li>Die erste Bande, deren Reliquien alle ausgegraben sind, gewinnt, auch wenn die andere Bande einige davon versehentlich ausgegraben hat.</li>
<li>Eine Bande, die das Grab des Todes öffnet, verliert sofort (bei drei Banden scheidet sie aus).</li>
<li>Über eine Partie aus 1, 3 oder 5 Spielen: jeder Sieg +1. Die Totengräber wechseln zwischen den Spielen.</li>
</ul>`,
    graveOpts: `<ul>
<li><b>Anzahl der Banden:</b> zwei, oder ab 6 Spielern drei.</li>
<li><b>Auf den Gräbern:</b> Wörter oder Symbole; <b>berühmte Namen</b> (Filme, Helden, Wahrzeichen) an oder aus.</li>
<li><b>Banden:</b> nach Plätzen (setzt Spieler um, um die Bande zu wechseln) oder zufällig. <b>Totengräber:</b> reihum, zufällig oder gewählt.</li>
<li><b>Zeichen:</b> getippt (das Wort erscheint auf allen Bildschirmen) oder gesprochen (laut gesagt, die Zahl getippt). <b>Spiele pro Partie.</b></li>
</ul>`,
    mimicSetup: `<p>4–12 Spieler, etwa 8 Minuten pro Spiel. Alle teilen einen geheimen Ort, eine Story-Karte, und spielen dort eine Figur, außer dem Nachahmer, der nur Rauschen und das Brett der möglichen Orte sieht. Die Lebenden müssen den Nachahmer finden; der Nachahmer muss den Ort herausfinden.</p>`,
    mimicLoop: `<ol>
<li><b>Fragen.</b> Wer die Laterne hält, stellt irgendwem laut eine Frage zum Ort und tippt dann auf die gefragte Person; die Laterne geht an sie, und sie fragt als Nächstes. Frag nie die Person zurück, die dich gerade gefragt hat. Antworte so, dass die Lebenden dich erkennen, ohne dem Nachahmer den Ort zu verraten.</li>
<li><b>Beschuldigen.</b> Einmal pro Spiel darf jede Person einen Spieler beschuldigen. Die Uhr hält an; alle anderen stimmen mit Zustimmen oder Ablehnen. Nur ein einstimmiger Tisch verurteilt; sonst läuft die Uhr weiter.</li>
<li><b>Der Nachahmer enttarnt sich.</b> Jederzeit darf der Nachahmer sich zeigen und den Ort nennen.</li>
<li><b>Die Zeit ist um.</b> Läuft die Uhr ab (voreingestellt 8 Minuten), zeigen alle auf einen Verdächtigen. Die meisten Stimmen werden verurteilt; bei Gleichstand entwischt der Nachahmer.</li>
</ol>
<p>Streiche beim Zuhören Orte auf deinem Handy durch: Deine Notizen sind privat.</p>`,
    mimicWin: `<ul>
<li>Verurteilt den Nachahmer: <b>Die Lebenden gewinnen</b>, außer ein gefasster Nachahmer nennt dann den Ort und stiehlt den Sieg.</li>
<li>Verurteilt einen Lebenden, oder lasst den Nachahmer entwischen: <b>Der Nachahmer gewinnt</b>.</li>
<li>Der Nachahmer nennt den Ort: richtig, er gewinnt; falsch, die Lebenden gewinnen.</li>
<li>Über eine Partie (voreingestellt 3 Spiele): die Lebenden je +1, wer den Nachahmer beschuldigt und gefangen hat, +1 mehr; der Nachahmer +2, oder +3 für den richtigen Ort.</li>
</ul>`,
    mimicOpts: `<ul>
<li><b>Orte auf dem Brett:</b> Mehr Orte machen es dem Nachahmer schwerer.</li>
<li><b>Letzter Tipp:</b> Ein gefasster Nachahmer darf noch den Ort nennen.</li>
<li><b>Der Hintergrund am Fernseher wird schärfer:</b> eine Vertrauensoption. Der Fernseher zeigt den wahren Ort stark verschwommen, der mit ablaufender Zeit schärfer wird. Wer den TV-Link öffnet, könnte ihn erkennen.</li>
<li><b>Fragezeit, Spiele pro Partie.</b></li>
</ul>`,
    omenSetup: `<p>4–12 Spieler, etwa 10 Minuten. Alle spielen für sich; es gibt keine verborgenen Seiten. Ein okkultes Rad zeigt auf eines von drei Feldern, Leben, Tod und Wiedergeburt, in dieser Reihenfolge im Uhrzeigersinn. Alle beginnen mit 5 Einfluss, für alle sichtbar.</p>`,
    omenLoop: `<p>Sieben Runden, jede in drei Schritten:</p>
<ol>
<li><b>Das Rad</b> zeigt, wo es in dieser Runde beginnt.</li>
<li><b>Der versiegelte Stimmzettel.</b> Sag heimlich voraus, wo das Rad stehen bleibt, und entscheide, ob du es einen Schritt zurück, einen Schritt weiter drehst oder lässt. Eine Drehung kostet einen Einfluss; ohne Einfluss kannst du es nur lassen. Du kannst deinen Zettel ändern, bis alle abgegeben haben.</li>
<li><b>Die Enthüllung.</b> Alle Drehungen werden zusammengezählt, und das Rad bewegt sich einmal, um die Summe (drei Schritte in dieselbe Richtung bringen es zurück). Danach wird jede Vorhersage und jede Drehung gezeigt.</li>
</ol>
<p>Die Kunst ist, den Tisch zu lesen: Wer hat noch Einfluss, wer will das Rad wo haben, und wer wird es drehen?</p>`,
    omenWin: `<ul>
<li>Eine richtige Vorhersage bringt 3 Punkte. Ein fehlender Zettel sagt nichts voraus und dreht nichts.</li>
<li>Am Ende ist jeder unverbrauchte Einfluss 1 Punkt wert. Die meisten Punkte gewinnen; Gleichstand teilt den Sieg.</li>
</ul>`,
    omenOpts: `<p>Keine Schalter: nur die Timer für jeden Schritt.</p>`,
    mirrorSetup: `<p>4–12 Spieler, etwa 15 Minuten. Alle spielen für sich. Ein verwunschener Spiegel zeigt nicht dein Spiegelbild: Er zeigt, was deine Freunde glauben, dass du tust. Acht erfundene Dilemmata, jedes mit drei Antworten, A, B und C, und keiner richtigen.</p>
<p>In jeder Runde liest du einen anderen Spieler. Die Paare wechseln, sodass im Lauf des Spiels alle alle lesen, und jede Person wird in jeder Runde von genau einer gelesen.</p>`,
    mirrorLoop: `<ol>
<li><b>Beratet euch.</b> Das Dilemma und wer wen liest, sind öffentlich. Fragt, neckt, führt in die Irre.</li>
<li><b>Der versiegelte Stimmzettel.</b> Wähle deine eigene Antwort und sag die Antwort der Person voraus, die du liest. Beides ist nötig, und du kannst es ändern, bis alle abgegeben haben.</li>
<li><b>Der Spiegel zeigt alles:</b> jede Antwort und jede Lesung, richtig oder falsch.</li>
</ol>`,
    mirrorWin: `<ul>
<li>Eine richtige Vorhersage bringt 2 Punkte; deine eigene Antwort bringt nichts, also ist es fair, deinen Leser zu überraschen.</li>
<li>Ein fehlender Zettel wird zu einer zufälligen Antwort; wer diese Person liest, wird trotzdem daran gemessen.</li>
<li>Wer am besten liest, gewinnt; Gleichstand teilt den Sieg.</li>
</ul>`,
    mirrorOpts: `<p>Keine Schalter außer den Timern. Sobald es mehr Dilemma-Pakete gibt, lässt euch die Lobby wählen, aus welchen die acht gezogen werden.</p>`,
  },
};
