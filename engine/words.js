// Dead Set: Exorcism — categories and passwords, index-aligned across languages
// (word k of a category means the same thing in every language). The table's
// language is forced on every phone, so one index is one password for all.
//
// Each list has exactly 20 words; the 4×4 grid draws 16 of them.

const C = (id, name, words) => ({ id, name, words: Object.fromEntries(Object.entries(words).map(([l, s]) => [l, s.split('|')])) });

export const CATEGORIES = [
  C('ANIMALS', { en: 'Animals', hu: 'Állatok', sk: 'Zvieratá', cs: 'Zvířata', de: 'Tiere', fr: 'Animaux', es: 'Animales' }, {
    en: 'cat|dog|horse|owl|wolf|bat|spider|snake|rabbit|fox|bear|crow|frog|mouse|deer|goat|pig|shark|eagle|rat',
    hu: 'macska|kutya|ló|bagoly|farkas|denevér|pók|kígyó|nyúl|róka|medve|varjú|béka|egér|szarvas|kecske|disznó|cápa|sas|patkány',
    sk: 'mačka|pes|kôň|sova|vlk|netopier|pavúk|had|zajac|líška|medveď|vrana|žaba|myš|jeleň|koza|prasa|žralok|orol|potkan',
    cs: 'kočka|pes|kůň|sova|vlk|netopýr|pavouk|had|zajíc|liška|medvěd|vrána|žába|myš|jelen|koza|prase|žralok|orel|krysa',
    de: 'Katze|Hund|Pferd|Eule|Wolf|Fledermaus|Spinne|Schlange|Hase|Fuchs|Bär|Krähe|Frosch|Maus|Hirsch|Ziege|Schwein|Hai|Adler|Ratte',
    fr: 'chat|chien|cheval|hibou|loup|chauve-souris|araignée|serpent|lapin|renard|ours|corbeau|grenouille|souris|cerf|chèvre|cochon|requin|aigle|rat',
    es: 'gato|perro|caballo|búho|lobo|murciélago|araña|serpiente|conejo|zorro|oso|cuervo|rana|ratón|ciervo|cabra|cerdo|tiburón|águila|rata',
  }),
  C('FOOD', { en: 'Food and drink', hu: 'Étel és ital', sk: 'Jedlo a pitie', cs: 'Jídlo a pití', de: 'Essen und Trinken', fr: 'Nourriture et boissons', es: 'Comida y bebida' }, {
    en: 'bread|cheese|apple|soup|honey|cake|egg|pumpkin|garlic|chocolate|butter|pizza|salt|lemon|pie|candy|mushroom|carrot|coffee|wine',
    hu: 'kenyér|sajt|alma|leves|méz|torta|tojás|tök|fokhagyma|csokoládé|vaj|pizza|só|citrom|pite|cukorka|gomba|répa|kávé|bor',
    sk: 'chlieb|syr|jablko|polievka|med|torta|vajce|tekvica|cesnak|čokoláda|maslo|pizza|soľ|citrón|koláč|cukrík|huba|mrkva|káva|víno',
    cs: 'chléb|sýr|jablko|polévka|med|dort|vejce|dýně|česnek|čokoláda|máslo|pizza|sůl|citron|koláč|bonbon|houba|mrkev|káva|víno',
    de: 'Brot|Käse|Apfel|Suppe|Honig|Kuchen|Ei|Kürbis|Knoblauch|Schokolade|Butter|Pizza|Salz|Zitrone|Pastete|Bonbon|Pilz|Karotte|Kaffee|Wein',
    fr: 'pain|fromage|pomme|soupe|miel|gâteau|œuf|citrouille|ail|chocolat|beurre|pizza|sel|citron|tarte|bonbon|champignon|carotte|café|vin',
    es: 'pan|queso|manzana|sopa|miel|pastel|huevo|calabaza|ajo|chocolate|mantequilla|pizza|sal|limón|tarta|caramelo|seta|zanahoria|café|vino',
  }),
  C('HOUSE', { en: 'In the house', hu: 'A házban', sk: 'V dome', cs: 'V domě', de: 'Im Haus', fr: 'Dans la maison', es: 'En la casa' }, {
    en: 'mirror|candle|clock|bed|door|window|chair|lamp|carpet|stairs|chimney|attic|kettle|pillow|cupboard|bath|key|curtain|table|cellar',
    hu: 'tükör|gyertya|óra|ágy|ajtó|ablak|szék|lámpa|szőnyeg|lépcső|kémény|padlás|teáskanna|párna|szekrény|kád|kulcs|függöny|asztal|pince',
    sk: 'zrkadlo|sviečka|hodiny|posteľ|dvere|okno|stolička|lampa|koberec|schody|komín|povala|kanvica|vankúš|skriňa|vaňa|kľúč|záves|stôl|pivnica',
    cs: 'zrcadlo|svíčka|hodiny|postel|dveře|okno|židle|lampa|koberec|schody|komín|půda|konvice|polštář|skříň|vana|klíč|závěs|stůl|sklep',
    de: 'Spiegel|Kerze|Uhr|Bett|Tür|Fenster|Stuhl|Lampe|Teppich|Treppe|Kamin|Dachboden|Wasserkessel|Kissen|Schrank|Badewanne|Schlüssel|Vorhang|Tisch|Keller',
    fr: 'miroir|bougie|horloge|lit|porte|fenêtre|chaise|lampe|tapis|escalier|cheminée|grenier|bouilloire|oreiller|placard|baignoire|clé|rideau|table|cave',
    es: 'espejo|vela|reloj|cama|puerta|ventana|silla|lámpara|alfombra|escalera|chimenea|desván|tetera|almohada|armario|bañera|llave|cortina|mesa|sótano',
  }),
  C('PLACES', { en: 'Places', hu: 'Helyek', sk: 'Miesta', cs: 'Místa', de: 'Orte', fr: 'Lieux', es: 'Lugares' }, {
    en: 'church|castle|forest|hospital|school|market|cemetery|library|station|harbour|prison|farm|museum|bridge|lighthouse|circus|hotel|theatre|mine|island',
    hu: 'templom|kastély|erdő|kórház|iskola|piac|temető|könyvtár|pályaudvar|kikötő|börtön|tanya|múzeum|híd|világítótorony|cirkusz|szálloda|színház|bánya|sziget',
    sk: 'kostol|hrad|les|nemocnica|škola|trh|cintorín|knižnica|stanica|prístav|väzenie|farma|múzeum|most|maják|cirkus|hotel|divadlo|baňa|ostrov',
    cs: 'kostel|hrad|les|nemocnice|škola|trh|hřbitov|knihovna|nádraží|přístav|vězení|statek|muzeum|most|maják|cirkus|hotel|divadlo|důl|ostrov',
    de: 'Kirche|Burg|Wald|Krankenhaus|Schule|Markt|Friedhof|Bibliothek|Bahnhof|Hafen|Gefängnis|Bauernhof|Museum|Brücke|Leuchtturm|Zirkus|Hotel|Theater|Bergwerk|Insel',
    fr: 'église|château|forêt|hôpital|école|marché|cimetière|bibliothèque|gare|port|prison|ferme|musée|pont|phare|cirque|hôtel|théâtre|mine|île',
    es: 'iglesia|castillo|bosque|hospital|escuela|mercado|cementerio|biblioteca|estación|puerto|cárcel|granja|museo|puente|faro|circo|hotel|teatro|mina|isla',
  }),
  C('JOBS', { en: 'Jobs', hu: 'Foglalkozások', sk: 'Povolania', cs: 'Povolání', de: 'Berufe', fr: 'Métiers', es: 'Oficios' }, {
    en: 'doctor|baker|teacher|soldier|farmer|priest|sailor|nurse|judge|painter|butcher|pilot|thief|actor|miner|gardener|chef|clown|detective|firefighter',
    hu: 'orvos|pék|tanár|katona|gazda|pap|tengerész|ápoló|bíró|festő|hentes|pilóta|tolvaj|színész|bányász|kertész|szakács|bohóc|nyomozó|tűzoltó',
    sk: 'lekár|pekár|učiteľ|vojak|roľník|kňaz|námorník|zdravotná sestra|sudca|maliar|mäsiar|pilot|zlodej|herec|baník|záhradník|kuchár|klaun|detektív|hasič',
    cs: 'lékař|pekař|učitel|voják|sedlák|kněz|námořník|zdravotní sestra|soudce|malíř|řezník|pilot|zloděj|herec|horník|zahradník|kuchař|klaun|detektiv|hasič',
    de: 'Arzt|Bäcker|Lehrer|Soldat|Bauer|Priester|Seemann|Krankenpfleger|Richter|Maler|Metzger|Pilot|Dieb|Schauspieler|Bergmann|Gärtner|Koch|Clown|Detektiv|Feuerwehrmann',
    fr: 'médecin|boulanger|professeur|soldat|fermier|prêtre|marin|infirmier|juge|peintre|boucher|pilote|voleur|acteur|mineur|jardinier|cuisinier|clown|détective|pompier',
    es: 'médico|panadero|profesor|soldado|granjero|cura|marinero|enfermero|juez|pintor|carnicero|piloto|ladrón|actor|minero|jardinero|cocinero|payaso|detective|bombero',
  }),
  C('NATURE', { en: 'Nature and weather', hu: 'Természet és időjárás', sk: 'Príroda a počasie', cs: 'Příroda a počasí', de: 'Natur und Wetter', fr: 'Nature et météo', es: 'Naturaleza y clima' }, {
    en: 'rain|snow|thunder|moon|star|river|mountain|storm|fog|wind|sun|rainbow|volcano|desert|ice|cave|lake|flower|tree|cloud',
    hu: 'eső|hó|mennydörgés|hold|csillag|folyó|hegy|vihar|köd|szél|nap|szivárvány|vulkán|sivatag|jég|barlang|tó|virág|fa|felhő',
    sk: 'dážď|sneh|hrom|mesiac|hviezda|rieka|hora|búrka|hmla|vietor|slnko|dúha|sopka|púšť|ľad|jaskyňa|jazero|kvet|strom|oblak',
    cs: 'déšť|sníh|hrom|měsíc|hvězda|řeka|hora|bouře|mlha|vítr|slunce|duha|sopka|poušť|led|jeskyně|jezero|květina|strom|mrak',
    de: 'Regen|Schnee|Donner|Mond|Stern|Fluss|Berg|Sturm|Nebel|Wind|Sonne|Regenbogen|Vulkan|Wüste|Eis|Höhle|See|Blume|Baum|Wolke',
    fr: 'pluie|neige|tonnerre|lune|étoile|rivière|montagne|tempête|brouillard|vent|soleil|arc-en-ciel|volcan|désert|glace|grotte|lac|fleur|arbre|nuage',
    es: 'lluvia|nieve|trueno|luna|estrella|río|montaña|tormenta|niebla|viento|sol|arcoíris|volcán|desierto|hielo|cueva|lago|flor|árbol|nube',
  }),
  C('GAMES', { en: 'Sports and games', hu: 'Sport és játék', sk: 'Šport a hry', cs: 'Sport a hry', de: 'Sport und Spiele', fr: 'Sports et jeux', es: 'Deportes y juegos' }, {
    en: 'football|tennis|chess|boxing|skiing|golf|cards|dice|swimming|hockey|archery|fencing|darts|cycling|bowling|marathon|rugby|sailing|poker|juggling',
    hu: 'foci|tenisz|sakk|boksz|síelés|golf|kártya|dobókocka|úszás|jégkorong|íjászat|vívás|darts|kerékpározás|bowling|maraton|rögbi|vitorlázás|póker|zsonglőrködés',
    sk: 'futbal|tenis|šach|box|lyžovanie|golf|karty|kocky|plávanie|hokej|lukostreľba|šerm|šípky|cyklistika|bowling|maratón|ragby|plachtenie|poker|žonglovanie',
    cs: 'fotbal|tenis|šachy|box|lyžování|golf|karty|kostky|plavání|hokej|lukostřelba|šerm|šipky|cyklistika|bowling|maraton|ragby|plachtění|poker|žonglování',
    de: 'Fußball|Tennis|Schach|Boxen|Skifahren|Golf|Karten|Würfel|Schwimmen|Eishockey|Bogenschießen|Fechten|Darts|Radfahren|Bowling|Marathon|Rugby|Segeln|Poker|Jonglieren',
    fr: 'football|tennis|échecs|boxe|ski|golf|cartes|dés|natation|hockey|tir à l\'arc|escrime|fléchettes|cyclisme|bowling|marathon|rugby|voile|poker|jonglage',
    es: 'fútbol|tenis|ajedrez|boxeo|esquí|golf|cartas|dados|natación|hockey|tiro con arco|esgrima|dardos|ciclismo|bolos|maratón|rugby|vela|póker|malabares',
  }),
  C('TRANSPORT', { en: 'Getting around', hu: 'Közlekedés', sk: 'Doprava', cs: 'Doprava', de: 'Unterwegs', fr: 'Transports', es: 'Transporte' }, {
    en: 'car|train|ship|bicycle|plane|bus|carriage|rocket|tram|taxi|boat|helicopter|submarine|sled|tractor|balloon|motorbike|truck|canoe|broomstick',
    hu: 'autó|vonat|hajó|bicikli|repülő|busz|hintó|rakéta|villamos|taxi|csónak|helikopter|tengeralattjáró|szánkó|traktor|léggömb|motor|teherautó|kenu|seprű',
    sk: 'auto|vlak|loď|bicykel|lietadlo|autobus|koč|raketa|električka|taxík|čln|vrtuľník|ponorka|sánky|traktor|balón|motorka|nákladiak|kanoe|metla',
    cs: 'auto|vlak|loď|kolo|letadlo|autobus|kočár|raketa|tramvaj|taxi|člun|vrtulník|ponorka|sáňky|traktor|balón|motorka|náklaďák|kánoe|koště',
    de: 'Auto|Zug|Schiff|Fahrrad|Flugzeug|Bus|Kutsche|Rakete|Straßenbahn|Taxi|Boot|Hubschrauber|U-Boot|Schlitten|Traktor|Ballon|Motorrad|Lastwagen|Kanu|Besen',
    fr: 'voiture|train|navire|vélo|avion|bus|carrosse|fusée|tramway|taxi|barque|hélicoptère|sous-marin|luge|tracteur|montgolfière|moto|camion|canoë|balai',
    es: 'coche|tren|barco|bicicleta|avión|autobús|carruaje|cohete|tranvía|taxi|bote|helicóptero|submarino|trineo|tractor|globo|moto|camión|canoa|escoba',
  }),
  C('SPOOKY', { en: 'Things that go bump', hu: 'Kísérteties dolgok', sk: 'Strašidelné veci', cs: 'Strašidelné věci', de: 'Gruseliges', fr: 'Choses qui font peur', es: 'Cosas que asustan' }, {
    en: 'ghost|coffin|skeleton|witch|vampire|zombie|mummy|werewolf|curse|potion|grave|skull|cauldron|crypt|chains|scream|shadow|cobweb|mask|wand',
    hu: 'szellem|koporsó|csontváz|boszorkány|vámpír|zombi|múmia|vérfarkas|átok|bájital|sír|koponya|üst|kripta|lánc|sikoly|árnyék|pókháló|maszk|varázspálca',
    sk: 'duch|rakva|kostra|bosorka|upír|zombie|múmia|vlkolak|kliatba|elixír|hrob|lebka|kotol|krypta|reťaze|výkrik|tieň|pavučina|maska|prútik',
    cs: 'duch|rakev|kostra|čarodějnice|upír|zombie|mumie|vlkodlak|kletba|lektvar|hrob|lebka|kotel|krypta|řetězy|výkřik|stín|pavučina|maska|hůlka',
    de: 'Geist|Sarg|Skelett|Hexe|Vampir|Zombie|Mumie|Werwolf|Fluch|Zaubertrank|Grab|Schädel|Kessel|Gruft|Ketten|Schrei|Schatten|Spinnennetz|Maske|Zauberstab',
    fr: 'fantôme|cercueil|squelette|sorcière|vampire|zombie|momie|loup-garou|malédiction|potion|tombe|crâne|chaudron|crypte|chaînes|cri|ombre|toile d\'araignée|masque|baguette',
    es: 'fantasma|ataúd|esqueleto|bruja|vampiro|zombi|momia|hombre lobo|maldición|poción|tumba|calavera|caldero|cripta|cadenas|grito|sombra|telaraña|máscara|varita',
  }),
  C('CLOTHES', { en: 'Clothes and accessories', hu: 'Ruhák és kiegészítők', sk: 'Oblečenie a doplnky', cs: 'Oblečení a doplňky', de: 'Kleidung und Zubehör', fr: 'Vêtements et accessoires', es: 'Ropa y complementos' }, {
    en: 'hat|coat|glove|boot|scarf|dress|sock|belt|tie|ring|crown|cape|veil|wig|apron|uniform|pyjamas|sandal|necklace|umbrella',
    hu: 'kalap|kabát|kesztyű|csizma|sál|ruha|zokni|öv|nyakkendő|gyűrű|korona|köpeny|fátyol|paróka|kötény|egyenruha|pizsama|szandál|nyaklánc|esernyő',
    sk: 'klobúk|kabát|rukavica|čižma|šál|šaty|ponožka|opasok|kravata|prsteň|koruna|plášť|závoj|parochňa|zástera|uniforma|pyžamo|sandál|náhrdelník|dáždnik',
    cs: 'klobouk|kabát|rukavice|bota|šála|šaty|ponožka|pásek|kravata|prsten|koruna|plášť|závoj|paruka|zástěra|uniforma|pyžamo|sandál|náhrdelník|deštník',
    de: 'Hut|Mantel|Handschuh|Stiefel|Schal|Kleid|Socke|Gürtel|Krawatte|Ring|Krone|Umhang|Schleier|Perücke|Schürze|Uniform|Schlafanzug|Sandale|Halskette|Regenschirm',
    fr: 'chapeau|manteau|gant|botte|écharpe|robe|chaussette|ceinture|cravate|bague|couronne|cape|voile|perruque|tablier|uniforme|pyjama|sandale|collier|parapluie',
    es: 'sombrero|abrigo|guante|bota|bufanda|vestido|calcetín|cinturón|corbata|anillo|corona|capa|velo|peluca|delantal|uniforme|pijama|sandalia|collar|paraguas',
  }),
];

export const CATEGORY_IDS = CATEGORIES.map((c) => c.id);
export const categoryById = (id) => CATEGORIES.find((c) => c.id === id) ?? null;
export const WORD_LANGS = ['en', 'hu', 'sk', 'cs', 'de', 'fr', 'es'];

/** Lowercase, no accents, letters only: how guesses are compared. */
export const fold = (s) => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/œ/g, 'oe').replace(/ß/g, 'ss').replace(/[^a-z0-9]/g, '');

function lev(a, b) {
  if (Math.abs(a.length - b.length) > 2) return 9;
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}

/** Does a typed guess name this word? Accents and case never matter; one typo is forgiven in words of 5+ letters. */
export function sameWord(guess, word) {
  const g = fold(guess); const w = fold(word);
  if (!g) return false;
  if (g === w) return true;
  return w.length >= 5 && lev(g, w) <= 1;
}
