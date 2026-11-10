// Magyar: játéktartalom (szerepek, álmok, szabálykártyák, módok, történetkártyák, útmutató).
export default {
  and: 'és',
  numbers: ['nulla', 'egy', 'két', 'három', 'négy', 'öt', 'hat', 'hét', 'nyolc', 'kilenc', 'tíz'],
  roles: {
    M_JESTER: { name: "Bolond", when: "Mindig", summary: "Egyedül nyersz, ha az asztal téged nevez meg az Utolsó Esélyben, vagy a Kaszás téged nevez meg az Elszámolásban.", detail: "Se nem Élő, se nem a Halálé vagy: a Médium nem lát, a Gyertya Élőnek mutat. Küldetésen Sikert vagy Szabotázst is játszhatsz. Tűnj gyanúsnak, de ne túlságosan." },
    TWIN: { name: "Iker", when: "Mindig", summary: "Ketten vagytok Ikrek. Ismeritek egymást, és mindketten Élők vagytok.", detail: "Csak Sikert játszhatsz. Bízz az ikredben, de vigyázz: ha túl hangosan kezeskedtek egymásért, a Halál tudni fogja, hol keressen." },
    UNDERTAKER: { name: "Sírásó", when: "Elbukott küldetés után", summary: "Ha egy küldetés elbukik, megtudod, hány halálos játékos volt abban a csapatban.", detail: "A számba minden halálos játékos beletartozik, a Fátylas és a Kóborló is, bármit is játszottak. Csak te hallod. Csak Sikert játszhatsz." },
    MEDIUM: { name: "Médium", when: "Mindig", summary: "Látod a Halál minden játékosát, kivéve a Fátylast. Irányítsd az expedíciót úgy, hogy ne áruld el magad.", detail: "Ha az Élők megnyernek három küldetést, vagy az Utolsó Esélyben elkapnak egy Halál-játékost, a Halál egyszer tippelhet, ki vagy. Ha téged nevez meg, a Halál győz." },
    BELIEVER: { name: "Hívő", when: "Mindig", summary: "Két gyertyát látsz: a Médiumot és a Sarlatánt. Nem tudod, melyik melyik.", detail: "Derítsd ki, melyik gyertya az igazi Médium, és védd meg, gyakran úgy, hogy te magad viselkedsz Médiumként. Ha nincs Sarlatán a játékban, az egyetlen gyertyád a Médium." },
    COMPANION: { name: "Társ", when: "Mindig", summary: "Semmit sem tudsz, csak amit a szíved súg. Figyeld a szavazásokat és a küldetéseket.", detail: "Csak Sikert játszhatsz ki. Olvasd ki, ki kit javasol, ki melyik csapatot fogadja el, és mely küldetések buknak el." },
    REAPER: { name: "Kaszás", when: "Mindig", summary: "Te vezeted a Halált. Az Elszámolásban te döntöd el, ki a Médium.", detail: "Látod a Halál többi tagját (a Kóborló kivételével). Küldetésen Sikert vagy Szabotázst játszhatsz. A csapatod javasolhat neveket az Elszámolásban; a te döntésed számít." },
    CHARLATAN: { name: "Sarlatán", when: "Mindig", summary: "A Hívő számára pontosan úgy nézel ki, mint a Médium. Használd ki.", detail: "Látod a Halál többi tagját (a Kóborló kivételével). Küldetésen Sikert vagy Szabotázst játszhatsz." },
    VEILED: { name: "Fátylas", when: "Mindig", summary: "A Médium nem lát téged.", detail: "Látod a Halál többi tagját (a Kóborló kivételével). Küldetésen Sikert vagy Szabotázst játszhatsz." },
    STRAY: { name: "Kóborló", when: "Mindig", summary: "Egyedül szolgálod a Halált: nem ismered a többieket, és ők sem ismernek téged.", detail: "A Médium azért lát téged. Küldetésen Sikert vagy Szabotázst játszhatsz. Az Elszámoláskor a Halál leleplezi magát, és csatlakozol a többiekhez." },
    SHADE: { name: "Árny", when: "Mindig", summary: "A Halállal jársz, és ismered a társaidat.", detail: "Látod a Halál többi tagját (a Kóborló kivételével). Küldetésen Sikert vagy Szabotázst játszhatsz." },
    CULT_LEADER: { name: "Szektavezér", when: "Minden éjszaka", summary: "Minden éjjel szervezz be egy játékost a Szektába. A Szekta akkor győz, ha többen vannak, mint mindenki más.", detail: "A beszervezett megtartja szerepét és képességeit, de mostantól a Szektával győz, és megtudja, kik a többi tagok. Halál-oldali játékosok, a Hasfelmetsző és a védett játékosok nem szervezhetők be. Ha a Vezér meghal, senki más nem szervezhet be." },
    RIPPER: { name: "A Hasfelmetsző", when: "Minden éjszaka", summary: "Ölj meg minden éjjel egy játékost, egyedül. Akkor győzöl, ha utolsóként maradsz állva, vagy egyedül maradsz egy olyan játékossal, aki nem gyilkos.", detail: "A gyilkosságodat ugyanazok a védelmek állítják meg, mint a Halálét (Őrző, Őrangyal, Boszorkányáldás, ideiglenes feltámasztás). A Halál éjjel nem ölhet meg, kivéve Vérholdkor. NEM HALÁL-OLDALINAK látszol." },
    DEATH: { name: 'Halál', when: 'Minden éjszaka', summary: 'Minden éjjel egyetlen közös gyilkosságban kell megegyeznetek az élő Halál-társaitokkal.', detail: 'Minden aktív Halál-játékosnak pontosan ugyanazt a célpontot kell megerősítenie, különben a frakció passzol. Alapból egy gyilkosság jár; a Kettős veszély, az Éjszakai műszak vagy az Erőhullám legfeljebb kettőre emelheti — soha nem jár egy-egy minden Halálnak.' },
    INNOCENT: { name: 'Ártatlan', when: 'Nappal', summary: 'Nincs képességed. A hangod és a szavazatod a fegyvered.', detail: 'Érvelj, vádolj, szavazz. Éjszakánként te is kapsz Álmot, és hathatnak rád állapotok.' },
    MENTALIST: { name: 'Mentalista', when: 'Minden éjszaka', summary: 'Olvass ki egy másik játékost: a Halál oldalán áll-e vagy sem.', detail: 'Csak a célpont jelenlegi hovatartozását tudod meg (HALÁL OLDALÁN / NEM A HALÁL OLDALÁN), a pontos szerepét soha. A blokkolt olvasás nem ad eredményt.' },
    GUARDIAN: { name: 'Őrző', when: 'Minden éjszaka', summary: 'Védj meg egy játékost (akár magadat) a Haláltól és a Pszichopatától.', detail: 'Csak a Halál frakció gyilkossága és a Pszichopata állapota ellen véd. Bomba, Önbíráskodó, Bűnbak, összekötött sorsok és lejárat ellen nem. Ugyanazt a célpontot többször is választhatod.' },
    PSYCHO: { name: 'Pszichopata', when: 'Egyszer játékonként, éjjel', summary: 'Egyszer: némítsd el valakit, vagy vedd el a szavazatát a következő napra.', detail: 'NÉMA: nem szólalhat meg a vitában, de jelölhet és szavazhat. NINCS SZAVAZAT: beszélhet, de nem adhat le szavazatot. Az Őrző, az Őrangyal és a Boszorkány áldása kivédi. A képesség blokkolva is elhasználódik.' },
    WHORE: { name: 'Szajha', alias: 'Kísérő', when: 'Minden éjszaka', summary: 'Látogass meg valakit. Ha egy Halált látogatsz, az egész csapat gyilkossága elmarad.', detail: 'Ha az általad meglátogatott személy aktív Halál, a frakció gyilkossági kerete 0 lesz. Ha a meglátogatottat a Halál öli meg, vele halsz; ha bomba éri, téged is elér a robbanás.' },
    TRAVELING_AGENT: { name: 'Utazó ügynök', when: 'Minden éjszaka', summary: 'Kézbesíts egy rejtélyes terméket. Csak hangulat — és névjegy.', detail: 'A címzett hajnalban megtudja, hogy egy Utazó ügynök járt nála. A terméknek nincs hatása, de maga a látogatás információ, amit mindketten felhasználhattok.' },
    TERRORIST: { name: 'Terrorista', when: 'Minden éjszaka', summary: 'Helyezz bombát egy ajtó elé. Fele-fele eséllyel robban.', detail: 'A szerver feldob egy érmét. IGEN esetén a célpont meghal, és az őt látogató Szajha is a robbanás áldozata lesz. Az Őrző nem állítja meg a bombát; az Őrangyal, a Boszorkány áldása és az ideiglenes feltámasztás igen.' },
    MIMIC: { name: 'Utánzó', when: 'Csak az 1. éjszaka (kötelező)', summary: 'Az 1. éjszakán végleg lemásolod valaki más szerepét.', detail: 'Átveszed a célpont szerepét és hovatartozását, friss használatokkal. A másolt képességek a 2. éjszakától működnek; a lemásolt Halál a 2. éjszakától csatlakozik a csapathoz. Ha Utánzót másolsz — vagy nem választasz —, a meccs végéig erőtlen Utánzó maradsz.' },
    DOUBLE_AGENT: { name: 'Kettős ügynök', when: 'Csak az 1. éjszaka (kötelező)', summary: 'Az 1. éjszakán titokban eldöntöd, melyik oldalon állsz a játék végéig.', detail: 'Válaszd a HALÁL vagy a NEM HALÁL oldalt. Ha a Halált választod, az 1. éjszaka végén átállsz; a 2. éjszakától a Halál-csapat szobájában vagy, és osztoztok az egyetlen gyilkosságon. Ha nem választasz, a nem-Halál oldalon maradsz.' },
    DIPLOMAT: { name: 'Diplomata', when: 'Egyszer játékonként, nappal (jelölések előtt)', summary: 'Egyszer: egy napra mentességet hirdethetsz az ítélet alól.', detail: 'A reggeli ablakban, nyilvánosan jelented be. Aznap nem jelölhetnek. Az éjszakai gyilkosság, a bomba, az Önbíráskodó és a Bűnbak ellen nem véd.' },
    SCAPEGOAT: { name: 'Bűnbak', when: 'Passzív, nappal', summary: 'Ha egy nap úgy ér véget, hogy senkit sem ítéltek el, helyette te halsz meg.', detail: 'Döntetlen, jelölés hiánya, szavazat hiánya, a Többségi szabály kudarca vagy a Szerencsejátékos érvénytelenítése mind „nincs ítélet”-nek számít. Ez gyilkosság, nem ítélet. Naponta csak egy Bűnbak (a legalacsonyabb székszámú) hal meg.' },
    NECROMANCER: { name: 'Nekromanta', when: 'Egyszer játékonként, éjjel', summary: 'Egyszer: feltámaszthatsz egy kiesett játékost egy napra és egy éjszakára.', detail: 'A visszatérő megtartja a szerepét és hovatartozását, a feltámasztás alatt semmi sem ölheti meg, és a következő éjszaka után távozik. A rituáléhoz túl kell élned az éjszakát. Mindenkit csak egyszer lehet feltámasztani.' },
    CONSPIRATOR: { name: 'Összeesküvő', when: 'Passzív nappali szavazat, éjszakai csevegés', summary: 'A szavazatod +1-gyel többet ér. Éjjel privát suttogást nyithatsz egy játékossal.', detail: 'A szavazatod egy plusz súlyt kap ugyanarra a jelöltre. Minden éjjel nyithatsz egy rövid, kétszemélyes szöveges csatornát egy élő játékossal; ez önmagában nem fed fel szerepet.' },
    MAGISTRATE: { name: 'Bíró', when: 'Passzív, nappal', summary: 'A szavazatod kettőt ér (Paranoiánál hármat).', detail: 'Egy szavazat, egy jelölt, dupla súly. A Pszichopata „Nincs szavazat” hatása nullára csökkenti.' },
    ORACLE: { name: 'Orákulum', when: 'Egyszer játékonként, éjjel', summary: 'Egyszer: tippeld meg, kire sújt le ma éjjel a Halál. Ha eltalálod, életben marad.', detail: 'Ha a jóslatod benne van a Halál frakció megerősített célpontjai között, az a játékos egy Halál-gyilkosság ellen védett. Rossz tipp vagy Halál-passz esetén nincs hatás.' },
    GAMBLER: { name: 'Szerencsejátékos', when: 'Egyszer játékonként, éjjel', summary: 'Egyszer: fogadj a holnapi első jelöltre. Ha nyersz, senkit sem akasztanak.', detail: 'Ha a következő nap első hivatalos jelölése egyezik a fogadásoddal, aznap az ítélet elmarad a számlálás előtt. Az ebből fakadó „nincs ítélet” miatt a Bűnbak még meghalhat.' },
    VIGILANTE: { name: 'Önbíráskodó', when: 'Egyszer játékonként, nappal (jelölések előtt)', summary: 'Egyszer: reggel lelőhetsz egy játékost, szavazás nélkül.', detail: 'Szerep általi gyilkosság, nem ítélet. A Diplomata mentessége nem állítja meg. Utána azonnal ellenőrizzük a győzelmet.' },
    JESTER: { name: 'Bolond', when: 'Független', summary: 'Egyedül nyersz — de csak ha a város megszavazza az elítélésedet.', detail: 'Ha más módon halsz meg (éjszakai gyilkosság, bomba, Önbíráskodó, Bűnbak), az nem számít. A túlélés a végéig sem győzelem. A Halál többségének számításakor „egyéb” játékosnak számítasz.' },
    BODYGUARD: { name: 'Testőr', when: 'Minden éjszaka', summary: 'Állj valaki mellé. Ha a Halál érte jön, te kapod a pengét.', detail: 'Ha a védenced a Halál gyilkosságától halna meg, és semmi más nem mentené meg, te halsz meg helyette. Magadat nem őrizheted, bombát és összekötött halált nem állítasz meg, éjszakánként legfeljebb egy gyilkosságot fogsz fel.' },
    BARD: { name: 'Bárd', when: 'Egyszer játékonként, éjjel', summary: 'Egyszer: elcsendesíted az éjszakát. Minden szerepképesség kudarcot vall, a Halálé is.', detail: 'Aznap éjjel minden aktív szerepképesség elnémul. Az Álmok, a lejáratok és a szabálykártyák továbbra is érvényesek. Ha a Bárdon Alvási bénulás van, a csend elmarad.' },
    WITCH: { name: 'Boszorkány', when: 'Minden éjszaka', summary: 'Áldd meg a játékost a bajjal szemben, vagy átkozd meg, hogy következő akciója kudarcot valljon.', detail: 'Áldás: ma éjjel véd az ártó szerepakciók és a bombák ellen (az összekötött sorsok ellen nem). Átok: a célpont következő célzott szerepakciója hatástalan; egy aktív Halál megátkozása blokkolja a frakció gyilkosságát. Magadra soha.' },
  },
  dreams: {
    SLEEP_PARALYSIS: { name: 'Alvási bénulás', text: 'Nem használhatod az éjszakai szerepakciódat. Ha aktív Halál vagy, az egész frakció gyilkossága elmarad.' },
    PREMONITION: { name: 'Előérzet', text: 'Hajnalban megtudod egy élő, a Halál oldalán álló játékos nevét.' },
    WHISPERS: { name: 'A múlt suttogásai', text: 'Hajnalban megtudod egy véletlenszerű kiesett játékos pontos szerepét.' },
    SLEEPWALKING: { name: 'Alvajárás', text: 'A közvetlenül előtted ülő játékoshoz vagy kötve. Ha ő ma éjjel meghal, te is meghalsz az éjszaka végén.' },
    DREAM_SNATCHER: { name: 'Álomrabló', text: 'Mielőtt az akciók megnyílnak, Álomkártyát cserélhetsz egy másik élő játékossal.' },
    NIGHT_SHIFT: { name: 'Éjszakai műszak', text: 'Egy ismételhető éjszakai képességet egy második célpontra is használhatsz. A Halálnak: a csapat kerete 2 lesz.' },
    SHARED_NIGHTMARE: { name: 'Közös rémálom', text: 'Válassz álomtársat. Ha ő ma éjjel meghal, vele halsz.' },
    INSOMNIA: { name: 'Álmatlanság', text: 'Hajnalban teljes, időrendi jelentést kapsz az éjszaka eseményeiről — ha túléled.' },
    GUARDIAN_ANGEL: { name: 'Őrangyal', text: 'Ma éjjel nem árthat neked a Halál, a Pszichopata, bomba, a Boszorkány átka és az összekötött halál sem.' },
  },
  mcards: {
    REGULAR: { name: "Szokásos küldetés", text: "Nincs különleges hatása." },
    LANTERN: { name: "Lámpáshordozó", text: "A Vezetőnek a csapatban kell lennie." },
    FRESH_FACES: { name: "Új arcok", text: "A csapat legalább fele (felfelé kerekítve) nem lehetett az előző küldetésen." },
    EXTRA_HAND: { name: "Plusz kéz", text: "A csapat eggyel nagyobb." },
    SKELETON_CREW: { name: "Csontváz-legénység", text: "A csapat eggyel kisebb." },
    MASKED_VOTE: { name: "Rejtett szavazás", text: "A csapatszavazásnál csak az összesítés látszik, az nem, hogy ki hogyan szavazott." },
    SHORT_PATIENCE: { name: "Fogyó türelem", text: "A harmadik javaslat a szavazástól függetlenül indul." },
    WARD: { name: "Oltalom", text: "A csapattal együtt a Vezető megnevez egy tagot, akinek a kártyája kötelezően Siker." },
    STEADFAST: { name: "Rendíthetetlen", text: "A kudarchoz eggyel több Szabotázs kell a szokásosnál." },
    BRITTLE: { name: "Törékeny", text: "Egyetlen Szabotázs is elbuktatja, pedig ez a küldetés általában kettőt kíván." },
    SMOKE: { name: "Füst", text: "Csak az eredmény látszik, az nem, hány Szabotázs-kártyát játszottak ki." },
    GRAND: { name: "Nagy küldetés", text: "Az eredmény duplán számít a sávon." },
    TRAIL: { name: "Nyomvonal", text: "Ha sikerül, a csapat egy véletlenszerű élő tagja éjjel nyomot talál." },
    WITNESS: { name: "Tanú", text: "Éjjel a csapat Vezetője titokban megnézi egy másik tag kártyáját." },
    HAUNTED_ROAD: { name: "Kísértetjárta út", text: "Ha elbukik, a Kaszás kiválasztja egy tagját, akinek ki kell hagynia a következő küldetést." },
  },
  missionStory: {
    steps: [
      ["Megtalálni a szakadt térképet", "Követni a hamis nyomot", "Átásni a csalikon", "Kinyitni a páncélt", "Kihozni az aranyat"],
      ["Megtalálni az órát", "Ellopni a kulcsokat", "Feltörni az első zárat", "Lerázni a riasztókat", "Elérni az utolsó ajtót"],
      ["Összegyűjteni a gyertyákat", "Megrajzolni a kört", "Kimondani a tiltott szavakat", "Táplálni az oltárt", "Bezárni a kört"],
      ["Megvizsgálni a holttestet", "Kikérdezni a komornyikot", "Megtalálni a fegyvert", "Megdönteni az alibit", "Megnevezni a gyilkost"],
      ["Elolvasni a vészjeleket", "Megtalálni a forrást", "Elvágni a jó drótot", "Kitartani", "Meghúzni az utolsó kart"],
      ["Megtalálni az átkozott tárgyat", "Kideríteni a valódi nevét", "Felbosszantani a szellemet", "Sóval megkötni", "Megtörni az átkot"],
      ["Beszállni a játékba", "Számolni a lapokat", "Lebuktatni a csalót", "Mindent feltenni", "Megnyerni az utolsó leosztást"],
      ["Megtalálni az örököst", "Elrejteni az örököst", "Túlélni a vacsorát", "Átverni a merénylőket", "Megkoronázni az örököst"],
      ["Kiolvasni a csillagokból", "Átkelni a sötétségen", "Megvesztegetni a révészt", "Megmászni az utolsó dombot", "Kinyitni a bejárati ajtót"],
      ["Elfogni egy levelet", "Követni a lépteket", "Csapdát állítani", "Rácsukni a csapdát", "Leleplezni az árulót"],
      ["Elbarikádozni az ajtókat", "Beosztani a gyertyákat", "Ügyet sem vetni a kopogásra", "Kitartani éjfél után", "Köszönteni a hajnalt"],
      ["Szagot fogni", "Megtalálni az orgazdát", "Feltörni a széfet", "Becserélni a hamisítványt", "Visszaadni az ereklyét"],
      ["Megkongatni a régi harangot", "Kideríteni, ki énekelte az altatót", "Lefőzni a keserű kávét", "Felébreszteni a polgármestert", "Megtörni a varázst"],
      ["Megtalálni az első oldalt", "Megfejteni a jeleket", "Megtalálni a hiányzó kulcsot", "Olvasni a sorok között", "Elolvasni az utolsó szót"],
      ["Elégetni a naplót", "Elhallgattatni a papagájt", "Megvesztegetni a tanút", "Lerázni a nyomozót", "Magával vinni a sírba"],
    ],
    scenes: [
      ["A bálterem megdől, de a zenekar nem hajlandó abbahagyni.", "A kapitány kabinjában bokáig ér a víz – és emelkedik.", "A mentőcsónakokat kétszer is megszámolták. Nincs elég.", "Az elárasztott gépházban még ketyeg valami.", "A fedélzet már szinte függőleges. Kapaszkodjatok valamibe. Bármibe."],
      ["A körhinta magától elindul, amint megérkeztek.", "A tükörlabirintus eggyel több embert mutat, mint ahányan vagytok.", "A szellemvasútnál sor áll. Senki sem lélegzik benne.", "Az óriáskerék megáll – veletek a legtetején.", "Minden bohócszobor felétek fordult."],
      ["Az ajtó sziszegve záródik mögöttetek. A fény vibrál.", "A rádió sercegve szól egy hangon, amely ismeri a neveteket.", "A fejadagokon az áll: „Ne nyisd ki!” Valaki kinyitotta.", "A mínusz négyes szint egyetlen tervrajzon sincs rajta.", "Húsz percnyi levegő maradt. Nagyjából."],
      ["A portrék a szemükkel követnek – és a lábukkal is.", "A vacsorához pontosan eggyel több terítéket tettek, mint ahányan vagytok.", "A titkos ajtó amögött a könyv mögött van, amit épp megérintettél.", "A padlásfeljáró szavakat nyikorog.", "A ház már nem tetteti, hogy üres."],
      ["A hó olyan gyorsan eszi a lábnyomaitokat, ahogy hagyjátok őket.", "A szánhúzó kutyák egy lépést sem hajlandók tovább menni.", "Valami nagy egész nap a nyomotokban jár.", "A tó jege énekelni kezdett.", "A hóvihar bezárul. Már a saját kezeteket sem látjátok."],
      ["A lámpa forog, pedig évek óta senki sem járt fent.", "A ködkürt olyan kérdésekre felel, amelyeket senki sem tett fel.", "Az őr naplója mondat közepén ér véget.", "Lent a sziklák tele vannak hajókkal, amelyek megbíztak ebben a fényben.", "Odafent kialszik a lámpa. Valami lélegzik a sötétben."],
      ["A gravitáció a legtöbb helyiségben működik. A legtöbben.", "Az állomás MI-je jó reggelt kíván. Nincs reggel.", "A hidropónia tele van olyan növényekkel, amelyeket senki sem ültetett.", "A zsilipnapló szerint valaki kiment. Senki sem hiányzik.", "A pálya bomlik. Mindenki tartsa vissza a lélegzetét."],
      ["A kalauz kilyukasztja a jegyedet, és odasúgja: rossz vonat.", "Az étkezőkocsiban lakomához terítettek, de a szakács eltűnt.", "Alagút. Amikor visszajön a fény, az egyik utas már valaki más.", "A vonat átkel egy hídon, amely tegnap még nem volt ott.", "A fékek felmondták a szolgálatot. A hegy nem."],
      ["A főhajóban eveztek, miközben az orgona a víz alatt szól.", "A gyertyák a víz alatt égnek. Ez nem lehetséges.", "Az ólomüveg szentjei mind rátok mutatnak.", "A kripta víz alatt van, és a koporsók lebegnek.", "A harang a víz alatt kondul, lassan és nagyon közel."],
      ["A rózsák felétek hajolnak. Egyelőre udvariasan.", "Az üvegház fülledt, és valami zümmög benne.", "Egy húsevő növény megette a térképet. És a kertészt.", "A sövénylabirintus minden pislogásnál átrendeződik.", "A középső nagy fa kinyitja egyik álmos szemét."],
      ["A recepción megvan a foglalásotok. Sosem foglaltatok.", "A medence tele van homokkal, és az úszómester még szolgálatban van.", "A 313-as szoba éjjel zümmög. 312-es szoba nincs.", "Egy homokvihar minden ablakot rozsdaszínűre fest.", "Az oázis szívében lévő kút suttogni kezdett."],
      ["A szerzetesek hallgatási fogadalmat tettek, és hangosan megszegik.", "A harangok tizenhármat ütnek.", "A másolóteremben van egy könyv, amely önmagát írja.", "A sziklaösvény csúszós, a kecskék pedig ítélkeznek felettetek.", "A kriptában vár az apát. 1611-ben halt meg."],
      ["A szüreti hold olyan alacsonyan lóg, hogy beleharaphatnál.", "A pince hordóiban valami érlelődik, ami nem bor.", "A madárijesztő egy perce még a másik irányba nézett.", "A kóstolóterem szilva, füst és rossz döntések illatú.", "A szőlő egy éjszaka alatt megfeketedett. Hallgatózik."],
      ["A 9-es műterem ki van világítva, és forog a felvétel. Senki sincs a kamera mögött.", "A kellékesektől pontosan egy igazi kés hiányzik.", "A külső díszletben egy kartonváros valódi árnyékot vet.", "A rendezői széken a neved áll – elírva.", "Az utolsó tekercs a vetítőben van. Indítsátok el, és meglátjátok, hogyan végződik."],
      ["A teremben minden óra más időt mutat, és mind késik.", "A sakkozó automata visszavágót követel.", "Egy gépmadár elénekli a riasztást, a riasztó pedig visszaénekel.", "A nagy bolygógép magától forogni kezdett.", "Éjfélt üt az óra, és minden kiállítási tárgy elfordítja a fejét."],
    ],
    genericSteps: ["Az első lépés", "Mélyebbre", "A visszafordíthatatlan pont", "A legnehezebb rész", "Az út vége"],
    genericScenes: ["Az expedíció útnak indul. Senki sem néz vissza.", "Az ösvény szűkül – és vele a bizalom is.", "Félúton. Valaki számolja a lépéseket.", "Minden döntéssel hidegebb lesz a levegő.", "Az utolsó szakasz. Ami itt vár, rátok várt."],
  },
  sideMissions: {"GO_TWICE": "Menj el legalább két küldetésre.", "GO_THRICE": "Menj el legalább három küldetésre.", "STAY_BEHIND": "Legfeljebb egy küldetésre menj el.", "EARLY_BIRD": "Menj el az 1. vagy a 2. küldetésre.", "LATE_ARRIVAL": "Ne menj el se az 1., se a 2. küldetésre.", "LANTERN_LEADS": "Vezess egy csapatot, amely útnak indul.", "NO_LANTERN": "Soha ne vezess olyan csapatot, amely útnak indul.", "GOOD_COMPANY": "Légy egy sikeres küldetés csapatában.", "BAD_LUCK": "Légy egy elbukott küldetés csapatában.", "CLEAN_RECORD": "Soha ne légy elbukott küldetés csapatában.", "NAYSAYER": "Szavazz legalább háromszor Elutasításra.", "OPEN_HEART": "Soha ne szavazz Elutasításra.", "LONE_VOICE": "Utasíts el egy csapatot, amelyet az asztal elfogad.", "LOST_CAUSE": "Fogadj el egy csapatot, amelyet az asztal elutasít.", "CONTRARIAN": "Kétszer légy a vesztes oldalon egy csapatszavazáson.", "CROWD": "Mindig a többséggel szavazz.", "FIRST_TRUST": "Fogadd el két különböző küldetés első javaslatát.", "POPULAR": "Legalább három javasolt csapatban szerepelj.", "SELF_STARTER": "Tedd magad egy általad javasolt csapatba.", "HUMBLE": "Soha ne tedd magad egy általad javasolt csapatba.", "NEIGHBOURS": "Menj küldetésre a tőled balra ülő játékossal együtt.", "CANDLE_BEARER": "Egyszer legyen nálad a Gyertya.", "STEADY_EYE": "Soha ne változtass a Gyanúdon (és legalább kettőt adj le).", "RESTLESS": "Három különböző játékosra tippelj a Gyanúiddal."},
  rules: {
    OPEN_BALLOT: { name: "Nyílt szavazás", text: "Minden szavazat nyilvános: mindenki látja, ki kire szavaz, ahogy a voksok beérkeznek.", enforcement: "A szavazatok a lezárásig még módosíthatók. A szellemek szavazatai is nyilvánosak." },
    FOG_OF_WAR: { name: 'A háború köde', text: 'A vita alatt csak a közvetlenül melletted ülő játékosokkal beszélhetsz.', enforcement: 'Személyesen becsületbeli szabály. Távoli játékban az asztali csevegést szomszédsuttogás váltja fel.' },
    DOUBLE_JEOPARDY: { name: 'Kettős veszély', text: 'A Halál frakció éjszakánként legfeljebb két játékost ölhet meg (felső határ: 2).', enforcement: 'A blokkolások, például a Szajha látogatása vagy a bénulás, továbbra is 0-ra csökkentik.' },
    PARANOIA: { name: 'Paranoia', text: 'Minden élő szavazat +1 súlyt kap. A Bíró hármat ér; az Összeesküvő még +1-et ad.', enforcement: 'A szellemszavazatok súlya 1 marad.' },
    UNRELIABLE_POWER: { name: 'Megbízhatatlan erő', text: 'Minden éjszakai szerepakció dob egy hatoldalú kockával: 1–3 kudarc, 4–6 siker. A Halál egyszer dob a csapatért.', enforcement: 'A kudarcot vallott egyszeri képesség is elhasználódik.' },
    POWER_SURGE: { name: 'Erőhullám', text: 'Minden éjjel egy véletlen, jogosult ismételhető képesség plusz használatot kap. A Halál egy bejegyzésnek számít.', enforcement: 'Senki sem kaphat kettőnél több használatot; a Halál kerete legfeljebb 2.' },
    EQUAL_EXCHANGE: { name: 'Egyenlő csere', text: 'A szavazással elítélt, a Halál oldalán álló játékos magával vihet egy élő, nem-Halál játékost.', enforcement: 'Az éjszakai gyilkosság, az Önbíráskodó lövése és az összekötött halál nem váltja ki.' },
    CURSED_SILENCE: { name: 'Átkozott csend', text: 'A vita alatt csak akkor szólalhatsz meg, ha közvetlenül hozzád szólnak.', enforcement: 'Becsületbeli szabály. A jelölésekre és a szavazásra nincs hatással.' },
    MAJORITY_RULE: { name: 'Többségi szabály', text: 'Az ítélethez az összes jogosult élő szavazó súlyának több mint fele kell egy jelöltre.', enforcement: 'A tartózkodók és a nem szavazók is beszámítanak a nevezőbe. A szellemszavazatok sosem számítanak.' },
    HIDDEN_ROLES: { name: 'Rejtett szerepek', text: 'A kiesett játékosok szerepét a játék végéig senki sem látja nyilvánosan.', enforcement: 'Ez amúgy is az alapbeállítás; ez a kártya rögzíti.' },
    VENGEFUL_GHOSTS: { name: 'Bosszúálló szellemek', text: 'Minden kiesett játékos naponta egy 1 súlyú szellemszavazatot adhat le.', enforcement: 'A szellemek nem jelölhetnek, nem használhatnak képességet, és nem befolyásolják a Többségi szabályt.' },
  },
  presets: {
    missions: { name: "Dead Set: Küldetések", blurb: "Csapatok, szavazások és szabotázs. Senki sem hal meg: vezessetek küldetéseket, olvassátok a szavazatokat, és találjátok meg a Halált, mielőtt ő a Médiumot." },
    standard: { name: 'Alap', blurb: 'Az igazi Dead Set-élmény. Tíz kiegészítő szerep 7 játékostól, mindenkinek Álom minden éjjel, 1–3 szabálykártya.' },
    classic: { name: 'Klasszikus / Tanuló', blurb: 'Tanításhoz. Csak alapszerepek — a kiegészítő helyekre Ártatlanok kerülnek. Álmok alapból kikapcsolva, legfeljebb egy egyszerű szabály.' },
    full: { name: 'Teljes pakli / Káosz', blurb: 'Mind a 17 kiegészítő szerep, köztük a Bolond, a Bárd és a Boszorkány. Nagy véletlenszerűség, csak tapasztalt társaságoknak.' },
    doomsday: { name: 'Világvége', blurb: 'Alap mód, az óra ellen. Ha az utolsó nap végéig senki sem nyert, a Halál győz.' },
    custom: { name: 'Egyéni', blurb: 'Te választod a kiegészítő készletet, az Álmokat, a szabályokat és az órát — vagy beírod a pontos paklit. Figyelmeztet a kiegyensúlyozatlan beállításokra.' },
  },
  scenario: {
    WHO: ['Időutazók', 'Űrfelfedezők', 'Mitikus lények', 'Történelmi alakok szellemei', 'Mutánsok', 'Titkos társaság tagjai', 'Eltévedt turisták', 'Mesterséges intelligenciák', 'Középkori falusiak', 'Hírességek hasonmásai', "Nyugalmazott cirkuszi artisták", "Világítótorony-őrök", "Rivális szakácsok", "Száműzött nemesek", "Éjszakás ápolók", "Mélytengeri búvárok", "Esküvői vendégek", "Rekedt csillagászok", "Álarcosbál táncosai", "Hallgatag szerzetesek"],
    WHERE: ['Süllyedő hajó', 'Elhagyatott vidámpark', 'Földalatti bunker', 'Kísértetjárta kúria', 'Hóborította tundra', "Ködbe burkolt világítótorony", "Elhagyatott űrállomás", "Éjszakai vonat a hegyek között", "Elárasztott katedrális", "Elvadult botanikus kert", "Sivatagi oázisszálló", "Félreeső kolostor", "Holdfényes szőlőskert", "Elhagyatott filmstúdió", "Óraműmúzeum"],
    WHY: ['Egy rejtett kincs megtalálása', 'Menekülés, mielőtt lejár az idő', 'Egy rituálé befejezése', 'Egy gyilkosság felderítése', 'Egy közelgő katasztrófa megállítása', "Egy ősi átok megtörése", "Vagyon nyerése kártyán", "Egy királyi örökös védelme", "A hazavezető út megtalálása", "Egy áruló leleplezése", "Túlélni napkeltéig", "Egy ellopott ereklye visszaszerzése", "Az alvó város felébresztése", "Egy utolsó üzenet megfejtése", "Egy szörnyű titok megőrzése"],
  },
  products: ['egy rézkulcs, amely egyetlen zárba sem illik', 'egy befőttesüveg meleg homok', 'egy jegy egy vonatra, amely tegnap elment', 'egyetlen fekete toll', 'egy visszafelé járó zsebóra', 'egy lepecsételt levél, neked címezve', 'egy fiola szürke parfüm', 'egy pakli kártya, amelyből hiányzik a dáma', 'egy esőillatú gyertya', 'egy fénykép egy üres szobáról', 'egy bársonnyal bélelt doboz (üres)', 'egy iránytű, amely rád mutat'],
  whispers: [
    'Bo holtan került elő. Senki sem látta a Szajhát távozni.',
    'A város felakasztotta a Bolondot. Ő csak nevetett.',
    'A Mentalista tudta. Senki sem hitt neki.',
    'Két szavazat hiányzott. A Bűnbak fizetett.',
    'Fay megesküdött, hogy ő az Őrző. Gus is.',
    'A Nekromanta a rossz barátot támasztotta fel.',
    'Bomba az ajtó előtt. Egy feldobott érme.',
    'Mindenki felébredt. Valahogy ez volt a legrosszabb.',
    'A Halál a várossal szavazott. Hát persze.',
  ],
  guide: {
    missionsH: "Dead Set: Küldetések",
    missions: `<p>Egy második mód 5–12 játékosnak, a váróban választható. Senki sem hal meg: a Halál beférkőzött az expedícióba, és az asztalnak meg kell találnia.</p>
<ol>
<li><b>A küldetéskártya.</b> Minden küldetés egy kártya húzásával kezdődik, még a csapat kiválasztása előtt. A legtöbb <i>Szokásos küldetés</i>; néha egy kártya megváltoztatja a csapatot, a szavazást vagy a felfedést. Az egész küldetésre érvényes.</li>
<li><b>A javaslat.</b> A Küldetésvezető (a lámpás) a megadott méretű csapatot választ.</li>
<li><b>A csapatszavazás.</b> Mindenki titokban elfogad vagy elutasít; a szavazatok egyszerre, nevekkel derülnek ki. Többség esetén a csapat elindul. Különben a balra következő játékos javasol. Az ötödik javaslat a szavazástól függetlenül indul.</li>
<li><b>A küldetés.</b> Minden csapattag titokban kijátszik egy kártyát. Az Élők csak Sikert játszhatnak; a Halál Sikert vagy Szabotázst. Egy Szabotázs elbuktatja a küldetést (7 játékostól a 4. küldetésnél kettő). A kártyákat megkeverik, és egyenként fordítják fel.</li>
<li><b>Az éjszakai szünet.</b> Mindenki választ egy titkos Gyanút. A 2., 3. és 4. küldetés után a Gyertya birtokosa megtudja egy játékos oldalát, és a Gyertya hozzá kerül. Hajnalban nyomok érkezhetnek.</li>
</ol>
<p><b>A vég.</b> Három siker: a Halál leleplezi magát, és a Kaszás megnevezi a Médiumot. Ha eltalálja, a Halál győz; ha nem, az Élők. Három kudarc: az Utolsó Esély. Mindenki megnevez egy játékost. Ha az egy Élő, a Halál győz; ha elkapjátok a Halált, a Kaszás akkor is megkapja az Elszámolást.</p>`,
    missionCardsH: "Küldetéskártyák",
    sidesH: "Más oldalak és fordulatok",
    sides: `<p>Választhatók, a váróban kapcsolhatók be (vagy egyéni játékban a szerepszámlálókkal adhatók hozzá). A város csak akkor győz, ha a Halál, a Szekta és a Hasfelmetsző is eltűnt.</p>
<ul>
<li><b>Szerelmesek:</b> két véletlenszerű játékos, bármelyik oldalról, egymásba szeret. Mindketten megtudják a másik nevét. Ha az egyik meghal, a másik belehal a szívfájdalomba. Ha ők ketten maradnak utolsóként, együtt győznek.</li>
<li><b>A Szekta:</b> a Szektavezér minden éjjel beszervez egy játékost. A beszervezettek megtartják szerepüket, de a Szektával győznek, amely akkor nyer, ha többen vannak, mint mindenki más. A Halál, a Hasfelmetsző és a védett játékosok nem szervezhetők be.</li>
<li><b>A Hasfelmetsző:</b> magányos gyilkos, aki minden éjjel lecsap. A Halál éjjel nem ölheti meg (kivéve Vérholdkor). Akkor győz, ha utolsóként marad állva, vagy egyedül marad egy olyan játékossal, aki nem gyilkos.</li>
<li><b>Nyomok</b> (alapból bekapcsolva, ritkák): néhány hajnalon egy-két, a Halál csapatán kívüli játékos igaz nyomot kap, például „A és B közül az egyik a Halállal jár”.</li>
<li><b>Pénzfeldobás döntetlennél</b> (választható): az élen kialakult döntetlent pénzfeldobás dönti el, ahelyett hogy mindenki megmenekülne.</li>
<li><b>Nyílt szavazás</b> (szabálykártya): minden szavazat azonnal nyilvános.</li>
</ul>`,
    kicker: 'A szabályok, v1.0',
    title: 'Hogyan<br><i>játssz.</i>',
    intro: 'A legtöbben túl akartok élni. Néhányan közületek a Halál. Senki sem tudja, ki kicsoda — kivéve a Halált, aki ismeri a társait.',
    toc: ['Alapok', 'Egy kör', 'Győzelem', 'Alapszerepek', 'Kiegészítő szerepek', 'Teljes pakli', 'Álmok', 'Szabálykártyák', 'Módok', 'Éjszakai sorrend', 'Telefonok'],
    basicsH: 'Az alapok',
    basics: `<p>A Dead Set társasági dedukciós partijáték 5–13 játékosnak. Mindenki a saját telefonjáról lép be ugyanabba a szobába, és titkos <b>szerepet</b> kap. A legtöbb szerep a <b>nem-Halál</b> frakcióhoz tartozik; egy vagy több játékos titokban a <b>Halál</b>.</p>
<ul>
<li>A <b>szerepek</b> az egész meccsre szólnak: a hovatartozásod és a képességed.</li>
<li>Az <b>Álmok</b> egyéjszakás hatások: az 1. éjszakától minden élő játékos titokban húz egyet minden éjjel.</li>
<li>A <b>szabálykártyák</b> (1–3, a beállításkor húzva) az egész meccset meghajlítják — dupla gyilkosság, súlyozott szavazatok, szavazó szellemek.</li>
<li>A <b>történet</b> (KI / HOL / MIÉRT) tiszta mesélés. Soha nem változtat a szabályokon.</li>
</ul>
<p>Mondhatsz igazat a szerepedről, hazudhatsz, vagy hallgathatsz. Soha ne mutasd meg a képernyődet. Az alkalmazás a mesélő: senkinek sem kell kimaradnia, és a házigazda sem lát több titkot, mint bárki más.</p>`,
    roundH: 'Egy kör',
    round: `<ol>
<li><b>0. éjszaka — a felfedés.</b> Fordítsd meg a szerepkártyádat, olvasd el, koppints a <em>Értem</em> gombra. Más nem történik: nincs gyilkosság, Álom vagy képesség. A Halál-játékosok látják a társaikat.</li>
<li><b>Reggel.</b> Elhangzanak a hajnali hírek: ki halt meg az éjjel (soha nem az, hogyan, és soha nem a szerepe). Amit privát módon megtudtál, az a <em>Csak te tudod</em> alatt jelenik meg. A Diplomata itt hirdethet mentességet; az Önbíráskodó itt lőhet.</li>
<li><b>Vita és jelölések.</b> Beszélgessetek. Minden élő játékos naponta <b>egy hivatalos jelölést</b> tehet. Egy már jelölt játékos újbóli jelölése csak megerősíti azt.</li>
<li><b>Védekezés.</b> Minden jelölt, a jelölés sorrendjében, szót kap.</li>
<li><b>Titkos szavazás.</b> Minden jogosult élő játékos a saját telefonján szavaz egy jelöltre, vagy tartózkodik. A szavazatodat addig módosíthatod, amíg a házigazda le nem zárja. Csak az összesítés nyilvános.</li>
<li><b>Ítélet.</b> Az egyetlen legmagasabb összesítésű játékost elítélik (kiesik). <b>Holtverseny az élen: senkit sem ítélnek el.</b> Naponta legfeljebb egy embert ítélnek el.</li>
<li><b>Éjszaka.</b> A képernyők elsötétülnek. Álmokkal az alkony tizenöt másodpercig tart (nélkülük ötig): mindenki felfordítja az Álmát, és az Álomrablók cserélhetnek. Akinek az álmát ellopták, látja is. Aztán az éjszakai akciók maguktól megnyílnak. Akinek éjszakai képessége van, titokban leadja; a Halál megegyezik a gyilkosságban. Amikor mindenki alszik — vagy lejár az idő —, a szerver egyszerre feldolgoz minden akciót, és felvirrad a következő nap.</li>
</ol>
<p class="small">Amit egy ablak bezárásáig nem adsz le, az passz (vagy tartózkodás) lesz. A kapcsolatot vesztett telefon megtartja a helyét és a titkait.</p>`,
    winH: 'Győzelem',
    win: `<ul>
<li>A <b>nem-Halál oldal nyer</b>, amint egyetlen Halál-oldali játékos sem él.</li>
<li>A <b>Halál nyer</b>, amint az élő Halál-oldali játékosok <b>szigorúan többen vannak</b>, mint az összes többi élő játékos. Az egyenlőség nem elég.</li>
<li>A <b>Bolond</b> (csak Teljes paklinál) egyedül és azonnal nyer, ha a város szavazással elítéli.</li>
<li>Ha egy éjszaka után senki sem marad életben, a meccs <b>döntetlen</b>.</li>
<li>A <b>Világvége-órával</b> a Halál akkor is nyer, ha az utolsó nap végéig senki sem győzött.</li>
<li><b>Vérhold</b> (alapból bekapcsolva): két egymást követő halál nélküli éjszaka után a következő éjjel semmilyen védelem nem tart, és semmi sem akadályozhatja meg a Halál gyilkosságát. Ez feloldja az olyan patthelyzeteket, mint amikor egy magányos Őrző újra és újra magát védi egy magányos Halállal szemben.</li>
<li><b>A Halál nyer az utolsó kettő között</b> (választható): ha az utolsó két élő között van Halál, a Halál azonnal nyer.</li>
</ul>
<p>A győzelmet minden teljes feldolgozás után ellenőrizzük — soha nem egy éjszaka közepén.</p>`,
    coreH: 'Alapszerepek',
    coreP: 'Mindig játékban vannak.',
    killH: 'Hogyan öl a Halál-csapat',
    kill: 'Minden élő Halál-társ egy szobán osztozik. Mindenki célpontokat javasol; a gyilkosság csak akkor történik meg, ha <b>mindannyian pontosan ugyanazt a célpontot erősítik meg</b>. Bármilyen nézeteltérés vagy egy hiányzó megerősítés, és a Halál passzol. A csapat éjszakánként <b>egy</b> játékost öl meg, akárhány Halál is van — kettőt Kettős veszéllyel, Éjszakai műszakkal vagy Erőhullámmal, de soha nem többet kettőnél.',
    extH: 'Kiegészítő szerepek — Alap',
    extP: '7 játékostól a plusz helyeket ebből a készletből töltjük fel (titokban húzva). 7 játékos → 1 kiegészítő hely, 10 → 2, 11+ → 3.',
    fullH: 'A Teljes pakli kiegészítései',
    fullP: 'Csak Teljes pakli / Káosz vagy Egyéni módban. Tapasztalt társaságoknak.',
    dreamsH: 'Álmok',
    dreamsP: 'Az 1. éjszakától minden élő játékos minden éjjel véletlenszerűen húz egy Álomkártyát (ismétlődhet). Csak arra az éjszakára szól. Elmondhatod, mit álmodtál — igazat vagy sem.',
    dreamsNote: `Egyes Álmok ritkábbak, mint mások, és az Álmatlanság egy meccsen legfeljebb kétszer fordul elő; Egyéni módban minden Álom gyakorisága állítható. Az Álomrablók cseréi az alkony alatt történnek, mielőtt az akciók megnyílnak, ülésrendben, mindenkinél egyszer. Az a kártya számít, amelyik végül nálad van.`,
    rulesH: 'Szabálykártyák',
    rulesP: 'A beállításkor 1–3 kártyát húzunk (vagy választunk), és ezek az egész meccs alatt érvényesek. Egyesek csak becsületbeli szabályként működnek, ha egy szobában játszotok.',
    modesH: 'Módok',
    modesTh: ['Mód', 'Játékosok', 'Mi változik'],
    countsH: 'Szerepek száma',
    countsTh: ['Játékosok', 'Halál', 'Ártatlan', 'Őrző · Mentalista · Pszichopata', 'Kiegészítő'],
    modesNote: 'A Klasszikus / Tanuló mód a kiegészítő helyeket Ártatlanokkal tölti fel. Az, hogy egy szobában vagy távolról játszotok, csak a lebonyolítás módja, nem másik játék: távoli módban asztali csevegés is van (és A háború ködénél szomszédsuttogás).',
    orderH: 'Ki kit győz le éjjel',
    order: `<p>Mindenki egyszerre adja le az akcióját; a szerver aztán rögzített sorrendben dolgozza fel őket, így az eredmény sosem függ attól, ki koppintott előbb.</p>
<ol>
<li><b>Elfojtás.</b> A Bárd csendje minden szerepképességet semmissé tesz. Az Alvási bénulás megállítja a viselőjét — és ha egy aktív Halálnál van, az egész gyilkosságot. A Megbízhatatlan erő itt dob.</li>
<li><b>Átkok és látogatások.</b> A Boszorkány átka hatástalanítja a célpont akcióját (vagy az egész Halál-gyilkosságot). Ha a Szajha bármelyik aktív Halált meglátogatja, a gyilkosság nullára csökken.</li>
<li><b>Átváltozások.</b> Először a Kettős ügynök fogadalma, aztán az Utánzó másolása. Ma éjjel már számítanak a Mentalistának, de az új Halál-tagok csak a következő éjjeltől vesznek részt a gyilkosságban.</li>
<li><b>A Halál gyilkossága.</b> A célpont túléli, ha ebben a sorrendben van neki: ideiglenes feltámasztás, Őrangyal, Boszorkány áldása, Őrző pajzsa, helyes Orákulum-jóslat. Ha nincs, egy Testőr kapja a pengét — ha az sincs, meghal.</li>
<li><b>Pszichopata.</b> A jel megmarad, kivéve ha a célpont halott vagy védett (feltámasztás, Őrangyal, áldás, Őrző).</li>
<li><b>Bombák és a többi.</b> A bomba tiszta érmedobás; az Őrző nem állítja meg. A látogató Szajhák is a robbanás áldozatai. Olvasások, kézbesítések, fogadások.</li>
<li>A <b>Nekromanta</b> feltámasztja a halottat — de csak ha ő maga túlélte az éjszakát.</li>
<li><b>Összekötött sorsok.</b> A Szajhák meghalnak a meglátogatott Halál-áldozattal; a Közös rémálom és az Alvajárás viselői a társukkal halnak. Összekötött halált csak a feltámasztás vagy az Őrangyal akadályoz meg. Ezután lejár a kölcsönidő.</li>
<li><b>Hajnal.</b> A túlélők megkapják a privát jelentéseiket. A nyilvánosság csak azt tudja meg, ki halt meg.</li>
</ol>`,
    phonesH: 'Játék telefonon',
    phones: `<ul>
<li>A házigazda létrehoz egy szobát, és megosztja a hatkarakteres kódot vagy a QR-kódot. Mindenki más megnyitja a linket, beírja a nevét, és a <em>Kész</em> gombra koppint.</li>
<li>A helyed a böngésződhöz kötődik. Ha lemerül egy telefon, a házigazda a vezérlőiből egyszer használatos <b>visszaállítási kódot</b> adhat; ha ezt egy új eszközön beírod, a helyed átkerül oda, a régi eszköz pedig kijelentkezik.</li>
<li>A házigazda telefonja egy átlagos játékostelefon néhány extra gombbal: fázis léptetése, +30 másodperc, meccs vége. A házigazda nem látja a szerepeket, az Álmokat és a szavazatokat.</li>
<li>Egy <b>nyilvános tábla</b> (titkok nélkül) TV-n is megjeleníthető: nyisd meg a <span class="mono">/board/KÓD</span> címet.</li>
<li>Ha valaki vezetné az asztalt és mindent látna, hozd létre a szobát <b>megbízható moderátorként</b>. Ő nem kaphat helyet, és erről mindenki tud.</li>
<li>Mindenki maga választja a nyelvét a nyelvi gombbal a kezdőképernyőn, a meghívón vagy a szoba menüjében. Az asztal alapértelmezett nyelvét a házigazda állítja be az előtérben.</li>
<li>A NÉMA, A háború köde és az Átkozott csend személyesen becsületbeli szabályok. Távoli játékban a csevegés kikényszeríti őket.</li>
</ul>`,
  },
};
