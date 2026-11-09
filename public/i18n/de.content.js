// Deutsch: Spielinhalte (Rollen, Träume, Regelkarten, Modi, Szenariokarten, Anleitung).
export default {
  and: 'und',
  numbers: ['kein', 'ein', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun', 'zehn'],
  roles: {
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
    PSYCHO: { name: 'Psycho', when: 'Einmal pro Spiel, nachts', summary: 'Einmal: Bring jemanden zum Schweigen oder nimm ihm für den nächsten Tag die Stimme.', detail: 'STUMM: darf in der Diskussion nicht sprechen, aber nominieren und abstimmen. KEINE STIMME: darf sprechen, aber nicht abstimmen. Wächter, Schutzengel und Hexensegen blockieren es. Die Ladung ist auch bei Blockade verbraucht.' },
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
    missions: { name: "Dead Set: Missionen", blurb: "Teams, Abstimmungen und Sabotage. Niemand stirbt: Führt Missionen an, lest die Stimmen und findet den Tod, bevor er das Medium findet." },
    standard: { name: 'Standard', blurb: 'Das eigentliche Dead-Set-Erlebnis. Zehn Zusatzrollen ab 7 Spielern, jede Nacht ein Traum für alle, 1–3 Regelkarten.' },
    classic: { name: 'Klassisch / Lernen', blurb: 'Zum Beibringen. Nur Grundrollen — Zusatzplätze werden mit Unschuldigen gefüllt. Träume standardmäßig aus, höchstens eine einfache Regel.' },
    full: { name: 'Volles Deck / Chaos', blurb: 'Alle 17 Zusatzrollen inklusive Narr, Barde und Hexe. Viel Zufall, nur für erfahrene Gruppen.' },
    doomsday: { name: 'Weltuntergang', blurb: 'Standard, gegen die Uhr. Hat bis zum Ende des letzten Tages niemand gewonnen, gewinnt der Tod.' },
    custom: { name: 'Eigenes Spiel', blurb: 'Wähle Zusatzpool, Träume, Regeln und Uhr selbst — oder tippe das genaue Deck ein. Warnt vor unausgewogenen Aufstellungen.' },
  },
  scenario: {
    WHO: ['Zeitreisende', 'Weltraumforscher', 'Fabelwesen', 'Geister historischer Persönlichkeiten', 'Mutanten', 'Mitglieder einer Geheimgesellschaft', 'Verirrte Touristen', 'Künstliche Intelligenzen', 'Mittelalterliche Dorfbewohner', 'Promi-Doppelgänger', "Zirkusartisten im Ruhestand", "Leuchtturmwärter", "Rivalisierende Köche", "Verbannte Adelige", "Nachtschwestern", "Tiefseetaucher", "Hochzeitsgäste", "Gestrandete Astronomen", "Maskenballtänzer", "Schweigende Mönche"],
    WHERE: ['Ein sinkendes Schiff', 'Ein verlassener Freizeitpark', 'Ein unterirdischer Bunker', 'Ein Spukhaus', 'Eine verschneite Tundra', "Ein Leuchtturm im Nebel", "Eine verlassene Raumstation", "Ein Nachtzug durch die Berge", "Eine überflutete Kathedrale", "Ein verwilderter botanischer Garten", "Ein Oasenhotel in der Wüste", "Ein abgelegenes Kloster", "Ein Weinberg im Mondlicht", "Ein verlassenes Filmstudio", "Ein Uhrwerkmuseum"],
    WHY: ['Einen verborgenen Schatz finden', 'Entkommen, bevor die Zeit abläuft', 'Ein Ritual vollenden', 'Einen Mord aufklären', 'Eine drohende Katastrophe verhindern', "Einen uralten Fluch brechen", "Beim Kartenspiel ein Vermögen gewinnen", "Einen königlichen Erben schützen", "Den Weg nach Hause finden", "Einen Verräter entlarven", "Bis zum Sonnenaufgang überleben", "Ein gestohlenes Relikt zurückholen", "Die schlafende Stadt wecken", "Eine letzte Botschaft entschlüsseln", "Ein schreckliches Geheimnis bewahren"],
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
  guide: {
    missionsH: "Dead Set: Missionen",
    missions: `<p>Ein zweiter Modus für 5–10 Spieler, in der Lobby wählbar. Niemand stirbt: Der Tod hat sich in die Expedition geschlichen, und der Tisch muss ihn finden.</p>
<ol>
<li><b>Die Missionskarte.</b> Jede Mission beginnt mit einer gezogenen Karte, bevor ein Team gewählt wird. Die meisten sind <i>Normale Missionen</i>; ab und zu ändert eine Karte das Team, die Abstimmung oder die Aufdeckung. Sie gilt für die ganze Mission.</li>
<li><b>Der Vorschlag.</b> Der Missionsanführer (die Laterne) wählt ein Team in der angezeigten Größe.</li>
<li><b>Die Teamabstimmung.</b> Alle stimmen geheim zu oder lehnen ab; die Stimmen werden alle auf einmal mit Namen aufgedeckt. Eine Mehrheit schickt das Team los. Sonst schlägt der nächste Spieler zur Linken vor. Der fünfte Vorschlag zieht los, egal wie abgestimmt wird.</li>
<li><b>Die Mission.</b> Jedes Teammitglied spielt geheim eine Karte. Die Lebenden können nur Erfolg spielen; der Tod darf Erfolg oder Sabotage spielen. Eine Sabotage lässt die Mission scheitern (zwei auf Mission 4 ab 7 Spielern). Die Karten werden gemischt und einzeln aufgedeckt.</li>
<li><b>Die nächtliche Pause.</b> Alle wählen einen geheimen Verdacht. Nach Mission 2, 3 und 4 erfährt der Halter der Kerze die Seite eines Spielers, und die Kerze geht an ihn über. Im Morgengrauen können Hinweise kommen.</li>
</ol>
<p><b>Das Ende.</b> Drei Erfolge: Der Tod enttarnt sich, und der Schnitter nennt das Medium. Richtig – der Tod gewinnt; falsch – die Lebenden gewinnen. Drei Fehlschläge: das letzte Gefecht. Alle nennen einen Spieler. Ist es einer der Lebenden, gewinnt der Tod; fangt ihr den Tod, bekommt der Schnitter trotzdem die Abrechnung.</p>`,
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
    kicker: 'Die Regeln, v1.0',
    title: 'So wird<br><i>gespielt.</i>',
    intro: 'Die meisten von euch wollen überleben. Ein paar von euch sind der Tod. Niemand weiß, wer wer ist — außer dem Tod, der seine Mitspieler kennt.',
    toc: ['Grundlagen', 'Eine Runde', 'Sieg', 'Grundrollen', 'Zusatzrollen', 'Volles Deck', 'Träume', 'Regelkarten', 'Modi', 'Nachtreihenfolge', 'Handys'],
    basicsH: 'Die Grundlagen',
    basics: `<p>Dead Set ist ein Social-Deduction-Partyspiel für 5–13 Spieler. Alle treten mit dem eigenen Handy demselben Raum bei und erhalten eine geheime <b>Rolle</b>. Die meisten Rollen gehören zur <b>Nicht-Tod</b>-Fraktion; ein oder mehrere Spieler sind heimlich der <b>Tod</b>.</p>
<ul>
<li><b>Rollen</b> gelten für das ganze Spiel: deine Gesinnung und deine Fähigkeit.</li>
<li><b>Träume</b> sind Effekte für eine Nacht: ab Nacht 1 zieht jeder lebende Spieler jede Nacht heimlich einen.</li>
<li><b>Regelkarten</b> (1–3, beim Aufbau gezogen) verbiegen das ganze Spiel — doppelte Morde, gewichtete Stimmen, Geister, die abstimmen.</li>
<li>Das <b>Szenario</b> (WER / WO / WARUM) ist reines Erzählen. Es ändert nie eine Regel.</li>
</ul>
<p>Du darfst die Wahrheit über deine Rolle sagen, lügen oder schweigen. Zeig nie deinen Bildschirm. Die App ist der Erzähler: Niemand muss aussetzen, und der Gastgeber sieht nicht mehr Geheimnisse als alle anderen.</p>`,
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
    modesH: 'Modi',
    modesTh: ['Modus', 'Spieler', 'Was sich ändert'],
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
    phonesH: 'Spielen am Handy',
    phones: `<ul>
<li>Der Gastgeber erstellt einen Raum und teilt den sechsstelligen Code oder QR-Code. Alle anderen öffnen den Link, geben einen Namen ein und tippen auf <em>Bereit</em>.</li>
<li>Dein Platz ist an deinen Browser gebunden. Ist ein Handy leer, kann der Gastgeber in seinen Steuerelementen einen einmaligen <b>Wiederherstellungscode</b> ausgeben; gibst du ihn auf einem neuen Gerät ein, wandert dein Platz dorthin und das alte Gerät wird abgemeldet.</li>
<li>Das Handy des Gastgebers ist ein normales Spielerhandy mit ein paar Extra-Knöpfen: Phase weiterschalten, 30 Sekunden hinzufügen, Spiel beenden. Der Gastgeber sieht weder Rollen noch Träume noch Stimmen.</li>
<li>Eine <b>öffentliche Anzeige</b> (ohne Geheimnisse) kann auf einem Fernseher laufen: öffne <span class="mono">/board/CODE</span>.</li>
<li>Soll jemand den Tisch leiten und alles sehen, erstelle den Raum als <b>vertrauenswürdiger Moderator</b>. Er kann keinen Platz einnehmen, und alle werden informiert.</li>
<li>Jeder wählt seine Sprache selbst über den Sprachknopf auf dem Startbildschirm, der Einladung oder im Raummenü. Die Standardsprache des Tisches legt der Gastgeber in der Lobby fest.</li>
<li>STUMM, Nebel des Krieges und Verfluchte Stille sind am Tisch Ehrensache. Online setzt der Chat sie durch.</li>
</ul>`,
  },
};
