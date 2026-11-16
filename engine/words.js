// Dead Set: Exorcism — categories and passwords, index-aligned across languages
// (word k of a category means the same thing in every language). The table's
// language is forced on every phone, so one index is one password for all.
//
// Each list has exactly 20 words (or names, or titles); the 4×4 grid draws 16 of them.

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
  C('CARTOONS', { en: 'Cartoon characters', hu: 'Rajzfilmfigurák', sk: 'Kreslené postavičky', cs: 'Kreslené postavičky', de: 'Zeichentrickfiguren', fr: 'Personnages de dessins animés', es: 'Personajes de dibujos animados' }, {
    en: 'Mickey Mouse|Donald Duck|Goofy|Bugs Bunny|Tweety|Homer Simpson|SpongeBob|Scooby-Doo|Popeye|Garfield|Snoopy|Winnie the Pooh|Pink Panther|Peppa Pig|Papa Smurf|Asterix|Tintin|Fred Flintstone|Pinocchio|Bambi',
    hu: 'Miki egér|Donald kacsa|Goofy|Tapsi Hapsi|Csőrike|Homer Simpson|SpongyaBob|Scooby-Doo|Popeye|Garfield|Snoopy|Micimackó|Rózsaszín Párduc|Peppa malac|Törpapa|Asterix|Tintin|Frédi|Pinokkió|Bambi',
    sk: 'Myšiak Mickey|Káčer Donald|Goofy|Bugs Bunny|Tweety|Homer Simpson|SpongeBob|Scooby-Doo|Pepek námorník|Garfield|Snoopy|Macko Pú|Ružový panter|Prasiatko Peppa|Papa Šmolko|Asterix|Tintin|Fred Flintstone|Pinocchio|Bambi',
    cs: 'Myšák Mickey|Kačer Donald|Goofy|Bugs Bunny|Tweety|Homer Simpson|SpongeBob|Scooby-Doo|Pepek námořník|Garfield|Snoopy|Medvídek Pú|Růžový panter|Prasátko Peppa|Taťka Šmoula|Asterix|Tintin|Fred Flintstone|Pinocchio|Bambi',
    de: 'Micky Maus|Donald Duck|Goofy|Bugs Bunny|Tweety|Homer Simpson|SpongeBob|Scooby-Doo|Popeye|Garfield|Snoopy|Winnie Puuh|Paulchen Panther|Peppa Wutz|Papa Schlumpf|Asterix|Tim|Fred Feuerstein|Pinocchio|Bambi',
    fr: "Mickey|Donald|Dingo|Bugs Bunny|Titi|Homer Simpson|Bob l'éponge|Scooby-Doo|Popeye|Garfield|Snoopy|Winnie l'ourson|Panthère rose|Peppa Pig|Grand Schtroumpf|Astérix|Tintin|Fred Pierrafeu|Pinocchio|Bambi",
    es: 'Mickey Mouse|Pato Donald|Goofy|Bugs Bunny|Piolín|Homer Simpson|Bob Esponja|Scooby-Doo|Popeye|Garfield|Snoopy|Winnie the Pooh|Pantera Rosa|Peppa Pig|Papá Pitufo|Astérix|Tintín|Pedro Picapiedra|Pinocho|Bambi',
  }),
  C('CELEBS', { en: 'Famous people', hu: 'Híres emberek', sk: 'Slávni ľudia', cs: 'Slavní lidé', de: 'Berühmte Menschen', fr: 'Personnes célèbres', es: 'Personas famosas' }, {
    en: 'Albert Einstein|William Shakespeare|Mozart|Napoleon|Cleopatra|Elvis Presley|Michael Jackson|Marilyn Monroe|Leonardo da Vinci|Pablo Picasso|Taylor Swift|Lionel Messi|Cristiano Ronaldo|Elon Musk|Charlie Chaplin|Freddie Mercury|Madonna|Beyoncé|Usain Bolt|Barack Obama',
    hu: 'Albert Einstein|William Shakespeare|Mozart|Napóleon|Kleopátra|Elvis Presley|Michael Jackson|Marilyn Monroe|Leonardo da Vinci|Pablo Picasso|Taylor Swift|Lionel Messi|Cristiano Ronaldo|Elon Musk|Charlie Chaplin|Freddie Mercury|Madonna|Beyoncé|Usain Bolt|Barack Obama',
    sk: 'Albert Einstein|William Shakespeare|Mozart|Napoleon|Kleopatra|Elvis Presley|Michael Jackson|Marilyn Monroe|Leonardo da Vinci|Pablo Picasso|Taylor Swift|Lionel Messi|Cristiano Ronaldo|Elon Musk|Charlie Chaplin|Freddie Mercury|Madonna|Beyoncé|Usain Bolt|Barack Obama',
    cs: 'Albert Einstein|William Shakespeare|Mozart|Napoleon|Kleopatra|Elvis Presley|Michael Jackson|Marilyn Monroe|Leonardo da Vinci|Pablo Picasso|Taylor Swift|Lionel Messi|Cristiano Ronaldo|Elon Musk|Charlie Chaplin|Freddie Mercury|Madonna|Beyoncé|Usain Bolt|Barack Obama',
    de: 'Albert Einstein|William Shakespeare|Mozart|Napoleon|Kleopatra|Elvis Presley|Michael Jackson|Marilyn Monroe|Leonardo da Vinci|Pablo Picasso|Taylor Swift|Lionel Messi|Cristiano Ronaldo|Elon Musk|Charlie Chaplin|Freddie Mercury|Madonna|Beyoncé|Usain Bolt|Barack Obama',
    fr: 'Albert Einstein|William Shakespeare|Mozart|Napoléon|Cléopâtre|Elvis Presley|Michael Jackson|Marilyn Monroe|Leonardo da Vinci|Pablo Picasso|Taylor Swift|Lionel Messi|Cristiano Ronaldo|Elon Musk|Charlie Chaplin|Freddie Mercury|Madonna|Beyoncé|Usain Bolt|Barack Obama',
    es: 'Albert Einstein|William Shakespeare|Mozart|Napoleón|Cleopatra|Elvis Presley|Michael Jackson|Marilyn Monroe|Leonardo da Vinci|Pablo Picasso|Taylor Swift|Lionel Messi|Cristiano Ronaldo|Elon Musk|Charlie Chaplin|Freddie Mercury|Madonna|Beyoncé|Usain Bolt|Barack Obama',
  }),
  C('VIDEOGAMES', { en: 'Video games', hu: 'Videojátékok', sk: 'Videohry', cs: 'Videohry', de: 'Videospiele', fr: 'Jeux vidéo', es: 'Videojuegos' }, {
    en: 'Minecraft|Tetris|Fortnite|Pac-Man|Mario Kart|The Sims|Grand Theft Auto|FIFA|Call of Duty|Angry Birds|Candy Crush|Among Us|Roblox|Space Invaders|Animal Crossing|Pokémon Go|Counter-Strike|League of Legends|World of Warcraft|Street Fighter',
    hu: 'Minecraft|Tetris|Fortnite|Pac-Man|Mario Kart|The Sims|Grand Theft Auto|FIFA|Call of Duty|Angry Birds|Candy Crush|Among Us|Roblox|Space Invaders|Animal Crossing|Pokémon Go|Counter-Strike|League of Legends|World of Warcraft|Street Fighter',
    sk: 'Minecraft|Tetris|Fortnite|Pac-Man|Mario Kart|The Sims|Grand Theft Auto|FIFA|Call of Duty|Angry Birds|Candy Crush|Among Us|Roblox|Space Invaders|Animal Crossing|Pokémon Go|Counter-Strike|League of Legends|World of Warcraft|Street Fighter',
    cs: 'Minecraft|Tetris|Fortnite|Pac-Man|Mario Kart|The Sims|Grand Theft Auto|FIFA|Call of Duty|Angry Birds|Candy Crush|Among Us|Roblox|Space Invaders|Animal Crossing|Pokémon Go|Counter-Strike|League of Legends|World of Warcraft|Street Fighter',
    de: 'Minecraft|Tetris|Fortnite|Pac-Man|Mario Kart|The Sims|Grand Theft Auto|FIFA|Call of Duty|Angry Birds|Candy Crush|Among Us|Roblox|Space Invaders|Animal Crossing|Pokémon Go|Counter-Strike|League of Legends|World of Warcraft|Street Fighter',
    fr: 'Minecraft|Tetris|Fortnite|Pac-Man|Mario Kart|The Sims|Grand Theft Auto|FIFA|Call of Duty|Angry Birds|Candy Crush|Among Us|Roblox|Space Invaders|Animal Crossing|Pokémon Go|Counter-Strike|League of Legends|World of Warcraft|Street Fighter',
    es: 'Minecraft|Tetris|Fortnite|Pac-Man|Mario Kart|The Sims|Grand Theft Auto|FIFA|Call of Duty|Angry Birds|Candy Crush|Among Us|Roblox|Space Invaders|Animal Crossing|Pokémon Go|Counter-Strike|League of Legends|World of Warcraft|Street Fighter',
  }),
  C('GAMEHEROES', { en: 'Video game characters', hu: 'Videojáték-szereplők', sk: 'Postavy z videohier', cs: 'Postavy z videoher', de: 'Videospielfiguren', fr: 'Personnages de jeux vidéo', es: 'Personajes de videojuegos' }, {
    en: 'Mario|Luigi|Pikachu|Sonic|Lara Croft|Link|Donkey Kong|Kirby|Yoshi|Bowser|Peach|Creeper|Crash Bandicoot|Kratos|Wario|Mega Man|Geralt|Rayman|Spyro|Master Chief',
    hu: 'Mario|Luigi|Pikachu|Sonic|Lara Croft|Link|Donkey Kong|Kirby|Yoshi|Bowser|Peach|Creeper|Crash Bandicoot|Kratos|Wario|Mega Man|Geralt|Rayman|Spyro|Master Chief',
    sk: 'Mario|Luigi|Pikachu|Sonic|Lara Croft|Link|Donkey Kong|Kirby|Yoshi|Bowser|Peach|Creeper|Crash Bandicoot|Kratos|Wario|Mega Man|Geralt|Rayman|Spyro|Master Chief',
    cs: 'Mario|Luigi|Pikachu|Sonic|Lara Croft|Link|Donkey Kong|Kirby|Yoshi|Bowser|Peach|Creeper|Crash Bandicoot|Kratos|Wario|Mega Man|Geralt|Rayman|Spyro|Master Chief',
    de: 'Mario|Luigi|Pikachu|Sonic|Lara Croft|Link|Donkey Kong|Kirby|Yoshi|Bowser|Peach|Creeper|Crash Bandicoot|Kratos|Wario|Mega Man|Geralt|Rayman|Spyro|Master Chief',
    fr: 'Mario|Luigi|Pikachu|Sonic|Lara Croft|Link|Donkey Kong|Kirby|Yoshi|Bowser|Peach|Creeper|Crash Bandicoot|Kratos|Wario|Mega Man|Geralt|Rayman|Spyro|Master Chief',
    es: 'Mario|Luigi|Pikachu|Sonic|Lara Croft|Link|Donkey Kong|Kirby|Yoshi|Bowser|Peach|Creeper|Crash Bandicoot|Kratos|Wario|Mega Man|Geralt|Rayman|Spyro|Master Chief',
  }),
  C('MOVIES', { en: 'Movies', hu: 'Filmek', sk: 'Filmy', cs: 'Filmy', de: 'Filme', fr: 'Films', es: 'Películas' }, {
    en: 'Titanic|Avatar|Star Wars|Shrek|Frozen|The Lion King|Harry Potter|Jurassic Park|Home Alone|The Matrix|Toy Story|Jaws|Ghostbusters|Finding Nemo|King Kong|Rocky|E.T.|Back to the Future|The Godfather|Pirates of the Caribbean',
    hu: 'Titanic|Avatar|Csillagok háborúja|Shrek|Jégvarázs|Az oroszlánkirály|Harry Potter|Jurassic Park|Reszkessetek, betörők!|Mátrix|Toy Story|A cápa|Szellemirtók|Némó nyomában|King Kong|Rocky|E.T.|Vissza a jövőbe|A keresztapa|A Karib-tenger kalózai',
    sk: 'Titanic|Avatar|Hviezdne vojny|Shrek|Ľadové kráľovstvo|Leví kráľ|Harry Potter|Jurský park|Sám doma|Matrix|Toy Story|Čeľuste|Krotitelia duchov|Hľadá sa Nemo|King Kong|Rocky|E.T.|Návrat do budúcnosti|Krstný otec|Piráti z Karibiku',
    cs: 'Titanic|Avatar|Hvězdné války|Shrek|Ledové království|Lví král|Harry Potter|Jurský park|Sám doma|Matrix|Toy Story|Čelisti|Krotitelé duchů|Hledá se Nemo|King Kong|Rocky|E.T.|Návrat do budoucnosti|Kmotr|Piráti z Karibiku',
    de: 'Titanic|Avatar|Star Wars|Shrek|Die Eiskönigin|Der König der Löwen|Harry Potter|Jurassic Park|Kevin – Allein zu Haus|Matrix|Toy Story|Der weiße Hai|Ghostbusters|Findet Nemo|King Kong|Rocky|E.T.|Zurück in die Zukunft|Der Pate|Fluch der Karibik',
    fr: "Titanic|Avatar|Star Wars|Shrek|La Reine des neiges|Le Roi lion|Harry Potter|Jurassic Park|Maman, j'ai raté l'avion|Matrix|Toy Story|Les Dents de la mer|SOS Fantômes|Le Monde de Nemo|King Kong|Rocky|E.T.|Retour vers le futur|Le Parrain|Pirates des Caraïbes",
    es: 'Titanic|Avatar|La guerra de las galaxias|Shrek|Frozen|El rey león|Harry Potter|Parque Jurásico|Solo en casa|Matrix|Toy Story|Tiburón|Los cazafantasmas|Buscando a Nemo|King Kong|Rocky|E.T.|Regreso al futuro|El padrino|Piratas del Caribe',
  }),
  C('HEROES', { en: 'Heroes and villains', hu: 'Hősök és gonoszok', sk: 'Hrdinovia a zloduchovia', cs: 'Hrdinové a padouši', de: 'Helden und Schurken', fr: 'Héros et méchants', es: 'Héroes y villanos' }, {
    en: 'Batman|Superman|Spider-Man|Wonder Woman|Iron Man|Hulk|Thor|Captain America|Joker|Darth Vader|Wolverine|Black Panther|Catwoman|Thanos|Deadpool|Aquaman|Harley Quinn|Voldemort|Zorro|Robin Hood',
    de: 'Batman|Superman|Spider-Man|Wonder Woman|Iron Man|Hulk|Thor|Captain America|Joker|Darth Vader|Wolverine|Black Panther|Catwoman|Thanos|Deadpool|Aquaman|Harley Quinn|Voldemort|Zorro|Robin Hood',
    hu: 'Batman|Superman|Pókember|Csodanő|Vasember|Hulk|Thor|Amerika Kapitány|Joker|Darth Vader|Rozsomák|Fekete Párduc|Macskanő|Thanos|Deadpool|Aquaman|Harley Quinn|Voldemort|Zorro|Robin Hood',
    sk: 'Batman|Superman|Spider-Man|Wonder Woman|Iron Man|Hulk|Thor|Kapitán Amerika|Joker|Darth Vader|Wolverine|Black Panther|Catwoman|Thanos|Deadpool|Aquaman|Harley Quinn|Voldemort|Zorro|Robin Hood',
    cs: 'Batman|Superman|Spider-Man|Wonder Woman|Iron Man|Hulk|Thor|Kapitán Amerika|Joker|Darth Vader|Wolverine|Black Panther|Catwoman|Thanos|Deadpool|Aquaman|Harley Quinn|Voldemort|Zorro|Robin Hood',
    fr: 'Batman|Superman|Spider-Man|Wonder Woman|Iron Man|Hulk|Thor|Captain America|Joker|Darth Vader|Wolverine|Black Panther|Catwoman|Thanos|Deadpool|Aquaman|Harley Quinn|Voldemort|Zorro|Robin des Bois',
    es: 'Batman|Superman|Spider-Man|Mujer Maravilla|Iron Man|Hulk|Thor|Capitán América|Joker|Darth Vader|Lobezno|Pantera Negra|Catwoman|Thanos|Deadpool|Aquaman|Harley Quinn|Voldemort|El Zorro|Robin Hood',
  }),
  C('LANDMARKS', { en: 'Famous places', hu: 'Híres helyek', sk: 'Slávne miesta', cs: 'Slavná místa', de: 'Berühmte Orte', fr: 'Lieux célèbres', es: 'Lugares famosos' }, {
    en: 'Eiffel Tower|Big Ben|Colosseum|Pyramids of Giza|Statue of Liberty|Great Wall of China|Taj Mahal|Stonehenge|Mount Everest|Niagara Falls|Sydney Opera House|Leaning Tower of Pisa|Machu Picchu|Hollywood|Kremlin|Acropolis|Sagrada Família|Golden Gate Bridge|Buckingham Palace|Disneyland',
    hu: 'Eiffel-torony|Big Ben|Colosseum|Gízai piramisok|Szabadság-szobor|Kínai nagy fal|Tádzs Mahal|Stonehenge|Mount Everest|Niagara-vízesés|Sydney-i Operaház|Pisai ferde torony|Machu Picchu|Hollywood|Kreml|Akropolisz|Sagrada Família|Golden Gate híd|Buckingham-palota|Disneyland',
    sk: 'Eiffelova veža|Big Ben|Koloseum|Pyramídy v Gíze|Socha slobody|Veľký čínsky múr|Tádž Mahal|Stonehenge|Mount Everest|Niagarské vodopády|Opera v Sydney|Šikmá veža v Pise|Machu Picchu|Hollywood|Kremeľ|Akropola|Sagrada Família|Golden Gate|Buckinghamský palác|Disneyland',
    cs: 'Eiffelova věž|Big Ben|Koloseum|Pyramidy v Gíze|Socha svobody|Velká čínská zeď|Tádž Mahal|Stonehenge|Mount Everest|Niagarské vodopády|Opera v Sydney|Šikmá věž v Pise|Machu Picchu|Hollywood|Kreml|Akropole|Sagrada Família|Golden Gate|Buckinghamský palác|Disneyland',
    de: 'Eiffelturm|Big Ben|Kolosseum|Pyramiden von Gizeh|Freiheitsstatue|Chinesische Mauer|Taj Mahal|Stonehenge|Mount Everest|Niagarafälle|Opernhaus Sydney|Schiefer Turm von Pisa|Machu Picchu|Hollywood|Kreml|Akropolis|Sagrada Família|Golden Gate Bridge|Buckingham Palace|Disneyland',
    fr: 'Tour Eiffel|Big Ben|Colisée|Pyramides de Gizeh|Statue de la Liberté|Grande Muraille de Chine|Taj Mahal|Stonehenge|Mont Everest|Chutes du Niagara|Opéra de Sydney|Tour de Pise|Machu Picchu|Hollywood|Kremlin|Acropole|Sagrada Família|Golden Gate Bridge|Palais de Buckingham|Disneyland',
    es: 'Torre Eiffel|Big Ben|Coliseo|Pirámides de Guiza|Estatua de la Libertad|Gran Muralla China|Taj Mahal|Stonehenge|Monte Everest|Cataratas del Niágara|Ópera de Sídney|Torre de Pisa|Machu Picchu|Hollywood|Kremlin|Acrópolis|Sagrada Familia|Puente Golden Gate|Palacio de Buckingham|Disneyland',
  }),
  // Common words added with Graverobbers (Beta 7): Exorcism draws them too.
  C('TOOLS', { en: "Tools", hu: "Szerszámok", sk: "Nástroje", cs: "Nástroje", de: "Werkzeuge", fr: "Outils", es: "Herramientas" }, {
    en: "hammer|saw|nail|rope|ladder|shovel|axe|needle|lock|bucket|brush|knife|drill|scissors|hook|magnet|lantern|wheel|compass|anvil",
    hu: "kalapács|fűrész|szög|kötél|létra|lapát|fejsze|tű|lakat|vödör|ecset|kés|fúró|olló|horog|mágnes|lámpás|kerék|iránytű|üllő",
    sk: "kladivo|píla|klinec|lano|rebrík|lopata|sekera|ihla|zámok|vedro|štetec|nôž|vŕtačka|nožnice|hák|magnet|lampáš|koleso|kompas|nákova",
    cs: "kladivo|pila|hřebík|lano|žebřík|lopata|sekera|jehla|zámek|kbelík|štětec|nůž|vrtačka|nůžky|hák|magnet|lucerna|kolo|kompas|kovadlina",
    de: "Hammer|Säge|Nagel|Seil|Leiter|Schaufel|Axt|Nadel|Schloss|Eimer|Pinsel|Messer|Bohrer|Schere|Haken|Magnet|Laterne|Rad|Kompass|Amboss",
    fr: "marteau|scie|clou|corde|échelle|pelle|hache|aiguille|cadenas|seau|pinceau|couteau|perceuse|ciseaux|crochet|aimant|lanterne|roue|boussole|enclume",
    es: "martillo|sierra|clavo|cuerda|escalera|pala|hacha|aguja|candado|cubo|pincel|cuchillo|taladro|tijeras|gancho|imán|farol|rueda|brújula|yunque",
  }),
  C('BODY', { en: "The body", hu: "A test", sk: "Telo", cs: "Tělo", de: "Der Körper", fr: "Le corps", es: "El cuerpo" }, {
    en: "hand|heart|eye|bone|tooth|tongue|nose|ear|finger|foot|knee|hair|blood|skin|shoulder|lip|neck|back|brain|thumb",
    hu: "kéz|szív|szem|csont|fog|nyelv|orr|fül|ujj|láb|térd|haj|vér|bőr|váll|ajak|nyak|hát|agy|hüvelykujj",
    sk: "ruka|srdce|oko|kosť|zub|jazyk|nos|ucho|prst|noha|koleno|vlasy|krv|koža|rameno|pera|krk|chrbát|mozog|palec",
    cs: "ruka|srdce|oko|kost|zub|jazyk|nos|ucho|prst|noha|koleno|vlasy|krev|kůže|rameno|ret|krk|záda|mozek|palec",
    de: "Hand|Herz|Auge|Knochen|Zahn|Zunge|Nase|Ohr|Finger|Fuß|Knie|Haar|Blut|Haut|Schulter|Lippe|Hals|Rücken|Gehirn|Daumen",
    fr: "main|cœur|œil|os|dent|langue|nez|oreille|doigt|pied|genou|cheveux|sang|peau|épaule|lèvre|cou|dos|cerveau|pouce",
    es: "mano|corazón|ojo|hueso|diente|lengua|nariz|oreja|dedo|pie|rodilla|pelo|sangre|piel|hombro|labio|cuello|espalda|cerebro|pulgar",
  }),
  C('SKY', { en: "The sky", hu: "Az ég", sk: "Obloha", cs: "Obloha", de: "Der Himmel", fr: "Le ciel", es: "El cielo" }, {
    en: "comet|eclipse|dawn|dusk|lightning|frost|hail|tornado|planet|meteor|aurora|breeze|drizzle|sunset|horizon|galaxy|orbit|twilight|haze|heatwave",
    hu: "üstökös|napfogyatkozás|hajnal|alkony|villám|dér|jégeső|tornádó|bolygó|meteor|sarki fény|szellő|szitálás|naplemente|látóhatár|galaxis|pálya|szürkület|pára|hőség",
    sk: "kométa|zatmenie|úsvit|súmrak|blesk|mráz|krupobitie|tornádo|planéta|meteor|polárna žiara|vánok|mrholenie|západ slnka|obzor|galaxia|obežná dráha|šero|opar|horúčava",
    cs: "kometa|zatmění|úsvit|soumrak|blesk|mráz|kroupy|tornádo|planeta|meteor|polární záře|vánek|mrholení|západ slunce|obzor|galaxie|oběžná dráha|šero|opar|vedro",
    de: "Komet|Finsternis|Morgengrauen|Dämmerung|Blitz|Frost|Hagel|Tornado|Planet|Meteor|Polarlicht|Brise|Nieselregen|Sonnenuntergang|Horizont|Galaxie|Umlaufbahn|Zwielicht|Dunst|Hitzewelle",
    fr: "comète|éclipse|aube|crépuscule|éclair|givre|grêle|tornade|planète|météore|aurore|brise|bruine|coucher de soleil|horizon|galaxie|orbite|pénombre|brume|canicule",
    es: "cometa|eclipse|alba|anochecer|relámpago|escarcha|granizo|tornado|planeta|meteoro|aurora|brisa|llovizna|puesta de sol|horizonte|galaxia|órbita|penumbra|neblina|ola de calor",
  }),
  C('MUSIC', { en: "Music", hu: "Zene", sk: "Hudba", cs: "Hudba", de: "Musik", fr: "Musique", es: "Música" }, {
    en: "piano|drum|bell|violin|trumpet|harp|organ|flute|guitar|choir|song|note|opera|whistle|horn|record|band|concert|lullaby|bagpipes",
    hu: "zongora|dob|harang|hegedű|trombita|hárfa|orgona|furulya|gitár|kórus|dal|hangjegy|opera|síp|kürt|lemez|zenekar|koncert|altatódal|duda",
    sk: "klavír|bubon|zvon|husle|trúbka|harfa|organ|flauta|gitara|zbor|pieseň|nota|opera|píšťalka|lesný roh|platňa|kapela|koncert|uspávanka|gajdy",
    cs: "klavír|buben|zvon|housle|trumpeta|harfa|varhany|flétna|kytara|sbor|píseň|nota|opera|píšťalka|lesní roh|deska|kapela|koncert|ukolébavka|dudy",
    de: "Klavier|Trommel|Glocke|Geige|Trompete|Harfe|Orgel|Flöte|Gitarre|Chor|Lied|Note|Oper|Pfeife|Horn|Schallplatte|Band|Konzert|Wiegenlied|Dudelsack",
    fr: "piano|tambour|cloche|violon|trompette|harpe|orgue|flûte|guitare|chœur|chanson|note|opéra|sifflet|cor|disque|groupe|concert|berceuse|cornemuse",
    es: "piano|tambor|campana|violín|trompeta|arpa|órgano|flauta|guitarra|coro|canción|nota|ópera|silbato|cuerno|disco|banda|concierto|nana|gaita",
  }),
  C('SEA', { en: "The sea", hu: "A tenger", sk: "More", cs: "Moře", de: "Das Meer", fr: "La mer", es: "El mar" }, {
    en: "wave|anchor|pearl|shell|octopus|whale|sail|reef|tide|mermaid|pirate|treasure|seal|crab|net|jellyfish|shipwreck|dolphin|seaweed|oyster",
    hu: "hullám|horgony|gyöngy|kagyló|polip|bálna|vitorla|zátony|dagály|sellő|kalóz|kincs|fóka|rák|háló|medúza|hajóroncs|delfin|hínár|osztriga",
    sk: "vlna|kotva|perla|mušľa|chobotnica|veľryba|plachta|útes|príliv|morská panna|pirát|poklad|tuleň|krab|sieť|medúza|vrak|delfín|riasa|ustrica",
    cs: "vlna|kotva|perla|mušle|chobotnice|velryba|plachta|útes|příliv|mořská panna|pirát|poklad|tuleň|krab|síť|medúza|vrak|delfín|řasa|ústřice",
    de: "Welle|Anker|Perle|Muschel|Krake|Wal|Segel|Riff|Gezeiten|Meerjungfrau|Pirat|Schatz|Robbe|Krabbe|Netz|Qualle|Schiffswrack|Delfin|Seetang|Auster",
    fr: "vague|ancre|perle|coquillage|pieuvre|baleine|voile|récif|marée|sirène|pirate|trésor|phoque|crabe|filet|méduse|épave|dauphin|algue|huître",
    es: "ola|ancla|perla|concha|pulpo|ballena|vela|arrecife|marea|sirena|pirata|tesoro|foca|cangrejo|red|medusa|naufragio|delfín|alga|ostra",
  }),
  C('CASTLE', { en: "The castle", hu: "A vár", sk: "Hrad", cs: "Hrad", de: "Die Burg", fr: "Le château", es: "El castillo" }, {
    en: "tower|throne|dungeon|knight|dragon|sword|shield|gate|king|queen|prince|princess|flag|wall|moat|banquet|jester|armour|torch|drawbridge",
    hu: "torony|trón|tömlöc|lovag|sárkány|kard|pajzs|kapu|király|királynő|herceg|hercegnő|zászló|fal|várárok|lakoma|udvari bolond|páncél|fáklya|felvonóhíd",
    sk: "veža|trón|žalár|rytier|drak|meč|štít|brána|kráľ|kráľovná|princ|princezná|vlajka|múr|priekopa|hostina|šašo|brnenie|fakľa|padací most",
    cs: "věž|trůn|žalář|rytíř|drak|meč|štít|brána|král|královna|princ|princezna|vlajka|zeď|příkop|hostina|šašek|zbroj|pochodeň|padací most",
    de: "Turm|Thron|Verlies|Ritter|Drache|Schwert|Schild|Tor|König|Königin|Prinz|Prinzessin|Fahne|Mauer|Burggraben|Bankett|Hofnarr|Rüstung|Fackel|Zugbrücke",
    fr: "tour|trône|cachot|chevalier|dragon|épée|bouclier|porte|roi|reine|prince|princesse|drapeau|rempart|douve|banquet|bouffon|armure|torche|pont-levis",
    es: "torre|trono|mazmorra|caballero|dragón|espada|escudo|puerta|rey|reina|príncipe|princesa|bandera|muralla|foso|banquete|bufón|armadura|antorcha|puente levadizo",
  }),
  C('KITCHEN', { en: "The kitchen", hu: "A konyha", sk: "Kuchyňa", cs: "Kuchyně", de: "Die Küche", fr: "La cuisine", es: "La cocina" }, {
    en: "pot|pan|spoon|fork|plate|cup|oven|bottle|glass|jar|ladle|bowl|sink|fridge|stove|pepper|sugar|tray|napkin|teapot",
    hu: "fazék|serpenyő|kanál|villa|tányér|csésze|sütő|üveg|pohár|befőttesüveg|merőkanál|tál|mosogató|hűtő|tűzhely|bors|cukor|tálca|szalvéta|teáskanna",
    sk: "hrniec|panvica|lyžica|vidlička|tanier|šálka|rúra|fľaša|pohár|zaváraninový pohár|naberačka|misa|drez|chladnička|sporák|korenie|cukor|podnos|obrúsok|čajník",
    cs: "hrnec|pánev|lžíce|vidlička|talíř|šálek|trouba|láhev|sklenice|zavařovačka|naběračka|mísa|dřez|lednice|sporák|pepř|cukr|podnos|ubrousek|konvice",
    de: "Topf|Pfanne|Löffel|Gabel|Teller|Tasse|Ofen|Flasche|Glas|Einmachglas|Schöpfkelle|Schüssel|Spüle|Kühlschrank|Herd|Pfeffer|Zucker|Tablett|Serviette|Teekanne",
    fr: "marmite|poêle|cuillère|fourchette|assiette|tasse|four|bouteille|verre|bocal|louche|bol|évier|frigo|cuisinière|poivre|sucre|plateau|serviette|théière",
    es: "olla|sartén|cuchara|tenedor|plato|taza|horno|botella|vaso|tarro|cucharón|cuenco|fregadero|nevera|fogón|pimienta|azúcar|bandeja|servilleta|tetera",
  }),
  C('SCIENCE', { en: "Science", hu: "Tudomány", sk: "Veda", cs: "Věda", de: "Wissenschaft", fr: "Science", es: "Ciencia" }, {
    en: "atom|robot|laser|microscope|telescope|battery|engine|code|virus|crystal|acid|bomb|satellite|gene|signal|formula|lab|computer|fossil|element",
    hu: "atom|robot|lézer|mikroszkóp|távcső|elem|motor|kód|vírus|kristály|sav|bomba|műhold|gén|jel|képlet|labor|számítógép|kövület|vegyi elem",
    sk: "atóm|robot|laser|mikroskop|ďalekohľad|batéria|motor|kód|vírus|kryštál|kyselina|bomba|satelit|gén|signál|vzorec|laboratórium|počítač|skamenelina|prvok",
    cs: "atom|robot|laser|mikroskop|dalekohled|baterie|motor|kód|virus|krystal|kyselina|bomba|satelit|gen|signál|vzorec|laboratoř|počítač|zkamenělina|prvek",
    de: "Atom|Roboter|Laser|Mikroskop|Teleskop|Batterie|Motor|Code|Virus|Kristall|Säure|Bombe|Satellit|Gen|Signal|Formel|Labor|Computer|Fossil|Element",
    fr: "atome|robot|laser|microscope|télescope|pile|moteur|code|virus|cristal|acide|bombe|satellite|gène|signal|formule|labo|ordinateur|fossile|élément",
    es: "átomo|robot|láser|microscopio|telescopio|pila|motor|código|virus|cristal|ácido|bomba|satélite|gen|señal|fórmula|laboratorio|ordenador|fósil|elemento",
  }),
  C('PLAY', { en: "Play and sport", hu: "Játék és sport", sk: "Hra a šport", cs: "Hra a sport", de: "Spiel und Sport", fr: "Jeu et sport", es: "Juego y deporte" }, {
    en: "ball|goal|racket|match|race|team|coach|referee|medal|trophy|stadium|skate|helmet|arrow|jump|score|kite|puzzle|doll|marble",
    hu: "labda|gól|ütő|mérkőzés|verseny|csapat|edző|bíró|érem|serleg|stadion|korcsolya|sisak|nyíl|ugrás|pontszám|papírsárkány|kirakós|baba|üveggolyó",
    sk: "lopta|gól|raketa|zápas|preteky|tím|tréner|rozhodca|medaila|trofej|štadión|korčuľa|prilba|šíp|skok|skóre|šarkan|skladačka|bábika|guľôčka",
    cs: "míč|gól|raketa|zápas|závod|tým|trenér|rozhodčí|medaile|trofej|stadion|brusle|helma|šíp|skok|skóre|papírový drak|skládačka|panenka|kulička",
    de: "Ball|Tor|Schläger|Spiel|Rennen|Mannschaft|Trainer|Schiedsrichter|Medaille|Pokal|Stadion|Schlittschuh|Helm|Pfeil|Sprung|Punktestand|Drachen|Puzzle|Puppe|Murmel",
    fr: "ballon|but|raquette|match|course|équipe|entraîneur|arbitre|médaille|trophée|stade|patin|casque|flèche|saut|score|cerf-volant|puzzle|poupée|bille",
    es: "pelota|gol|raqueta|partido|carrera|equipo|entrenador|árbitro|medalla|trofeo|estadio|patín|casco|flecha|salto|marcador|cometa de papel|puzle|muñeca|canica",
  }),
  C('BUILDINGS', { en: "Buildings", hu: "Épületek", sk: "Budovy", cs: "Budovy", de: "Gebäude", fr: "Bâtiments", es: "Edificios" }, {
    en: "bank|factory|mill|barn|temple|palace|cinema|bakery|chapel|cabin|warehouse|tent|igloo|skyscraper|pyramid|windmill|tavern|monastery|fortress|greenhouse",
    hu: "bank|gyár|malom|pajta|szentély|palota|mozi|pékség|kápolna|kunyhó|raktár|sátor|iglu|felhőkarcoló|piramis|szélmalom|kocsma|kolostor|erőd|üvegház",
    sk: "banka|továreň|mlyn|stodola|chrám|palác|kino|pekáreň|kaplnka|chata|sklad|stan|iglu|mrakodrap|pyramída|veterný mlyn|krčma|kláštor|pevnosť|skleník",
    cs: "banka|továrna|mlýn|stodola|chrám|palác|kino|pekárna|kaple|chata|sklad|stan|iglú|mrakodrap|pyramida|větrný mlýn|krčma|klášter|pevnost|skleník",
    de: "Bank|Fabrik|Mühle|Scheune|Tempel|Palast|Kino|Bäckerei|Kapelle|Hütte|Lagerhaus|Zelt|Iglu|Wolkenkratzer|Pyramide|Windmühle|Taverne|Kloster|Festung|Gewächshaus",
    fr: "banque|usine|moulin|grange|temple|palais|cinéma|boulangerie|chapelle|cabane|entrepôt|tente|igloo|gratte-ciel|pyramide|moulin à vent|taverne|monastère|forteresse|serre",
    es: "banco|fábrica|molino|granero|templo|palacio|cine|panadería|capilla|cabaña|almacén|tienda de campaña|iglú|rascacielos|pirámide|molino de viento|taberna|monasterio|fortaleza|invernadero",
  }),
  C('PLANTS', { en: "Plants", hu: "Növények", sk: "Rastliny", cs: "Rostliny", de: "Pflanzen", fr: "Plantes", es: "Plantas" }, {
    en: "rose|oak|ivy|lily|cactus|tulip|pine|moss|fern|thorn|seed|root|leaf|vine|willow|daisy|bamboo|clover|nettle|poppy",
    hu: "rózsa|tölgy|borostyán|liliom|kaktusz|tulipán|fenyő|moha|páfrány|tüske|mag|gyökér|levél|szőlőtő|fűz|százszorszép|bambusz|lóhere|csalán|pipacs",
    sk: "ruža|dub|brečtan|ľalia|kaktus|tulipán|borovica|mach|papraď|tŕň|semeno|koreň|list|vinič|vŕba|sedmokráska|bambus|ďatelina|žihľava|mak",
    cs: "růže|dub|břečťan|lilie|kaktus|tulipán|borovice|mech|kapradí|trn|semínko|kořen|list|vinná réva|vrba|sedmikráska|bambus|jetel|kopřiva|mák",
    de: "Rose|Eiche|Efeu|Lilie|Kaktus|Tulpe|Kiefer|Moos|Farn|Dorn|Samen|Wurzel|Blatt|Weinrebe|Weide|Gänseblümchen|Bambus|Klee|Brennnessel|Mohn",
    fr: "rose|chêne|lierre|lys|cactus|tulipe|pin|mousse|fougère|épine|graine|racine|feuille|vigne|saule|marguerite|bambou|trèfle|ortie|coquelicot",
    es: "rosa|roble|hiedra|lirio|cactus|tulipán|pino|musgo|helecho|espina|semilla|raíz|hoja|vid|sauce|margarita|bambú|trébol|ortiga|amapola",
  }),
  C('MAGIC', { en: "Magic", hu: "Mágia", sk: "Mágia", cs: "Magie", de: "Magie", fr: "Magie", es: "Magia" }, {
    en: "spell|charm|wizard|rune|cloak|amulet|tarot|portal|scroll|raven|unicorn|fairy|orb|elixir|oracle|phoenix|goblin|ritual|prophecy|talisman",
    hu: "varázsige|bűbáj|varázsló|rúna|köpeny|amulett|tarot|portál|tekercs|holló|egyszarvú|tündér|gömb|elixír|jós|főnix|kobold|szertartás|jóslat|talizmán",
    sk: "kúzlo|čaro|čarodejník|runa|plášť|amulet|tarot|portál|zvitok|havran|jednorožec|víla|guľa|elixír|veštec|fénix|škriatok|rituál|proroctvo|talizman",
    cs: "kouzlo|čáry|čaroděj|runa|plášť|amulet|tarot|portál|svitek|havran|jednorožec|víla|koule|elixír|věštec|fénix|skřet|rituál|proroctví|talisman",
    de: "Zauberspruch|Zauber|Zauberer|Rune|Umhang|Amulett|Tarot|Portal|Schriftrolle|Rabe|Einhorn|Fee|Kugel|Elixier|Orakel|Phönix|Kobold|Ritual|Prophezeiung|Talisman",
    fr: "sortilège|charme|magicien|rune|cape|amulette|tarot|portail|parchemin|corbeau|licorne|fée|orbe|élixir|oracle|phénix|gobelin|rituel|prophétie|talisman",
    es: "hechizo|encanto|mago|runa|capa|amuleto|tarot|portal|pergamino|cuervo|unicornio|hada|orbe|elixir|oráculo|fénix|duende|ritual|profecía|talismán",
  }),
  C('FABRIC', { en: "Colours and cloth", hu: "Színek és anyagok", sk: "Farby a látky", cs: "Barvy a látky", de: "Farben und Stoffe", fr: "Couleurs et tissus", es: "Colores y telas" }, {
    en: "red|black|white|gold|silver|velvet|silk|lace|wool|leather|cotton|fur|button|thread|ribbon|stripe|purple|green|blue|ink",
    hu: "piros|fekete|fehér|arany|ezüst|bársony|selyem|csipke|gyapjú|irha|pamut|szőrme|gomb|cérna|szalag|csík|lila|zöld|kék|tinta",
    sk: "červená|čierna|biela|zlato|striebro|zamat|hodváb|čipka|priadza|useň|bavlna|kožušina|gombík|niť|stuha|pruh|fialová|zelená|modrá|atrament",
    cs: "červená|černá|bílá|zlato|stříbro|samet|hedvábí|krajka|příze|useň|bavlna|kožešina|knoflík|nit|stuha|pruh|fialová|zelená|modrá|inkoust",
    de: "Rot|Schwarz|Weiß|Gold|Silber|Samt|Seide|Spitze|Wolle|Leder|Baumwolle|Pelz|Knopf|Faden|Schleife|Streifen|Lila|Grün|Blau|Tinte",
    fr: "rouge|noir|blanc|or|argent|velours|soie|dentelle|laine|cuir|coton|fourrure|bouton|fil|ruban|rayure|violet|vert|bleu|encre",
    es: "rojo|negro|blanco|oro|plata|terciopelo|seda|encaje|lana|cuero|algodón|pelaje|botón|hilo|cinta|raya|morado|verde|azul|tinta",
  }),
  C('CRIME', { en: "Crime", hu: "Bűntény", sk: "Zločin", cs: "Zločin", de: "Verbrechen", fr: "Crime", es: "Crimen" }, {
    en: "spy|alibi|clue|witness|poison|ransom|fingerprint|handcuffs|safe|heist|bullet|pistol|motive|suspect|trial|verdict|disguise|forgery|blackmail|getaway",
    hu: "kém|alibi|nyom|tanú|méreg|váltságdíj|ujjlenyomat|bilincs|széf|rablás|golyó|pisztoly|indíték|gyanúsított|tárgyalás|ítélet|álruha|hamisítvány|zsarolás|menekülés",
    sk: "špión|alibi|stopa|svedok|jed|výkupné|odtlačok prsta|putá|trezor|lúpež|guľka|pištoľ|motív|podozrivý|súdny proces|rozsudok|prestrojenie|falzifikát|vydieranie|útek",
    cs: "špion|alibi|stopa|svědek|jed|výkupné|otisk prstu|pouta|trezor|loupež|kulka|pistole|motiv|podezřelý|soud|rozsudek|převlek|padělek|vydírání|útěk",
    de: "Spion|Alibi|Spur|Zeuge|Gift|Lösegeld|Fingerabdruck|Handschellen|Tresor|Raubzug|Kugel|Pistole|Motiv|Verdächtiger|Prozess|Urteil|Verkleidung|Fälschung|Erpressung|Flucht",
    fr: "espion|alibi|indice|témoin|poison|rançon|empreinte|menottes|coffre-fort|braquage|balle|pistolet|mobile|suspect|procès|verdict|déguisement|faux|chantage|cavale",
    es: "espía|coartada|pista|testigo|veneno|rescate|huella|esposas|caja fuerte|atraco|bala|pistola|móvil|sospechoso|juicio|veredicto|disfraz|falsificación|chantaje|fuga",
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
