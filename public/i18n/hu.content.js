// Magyar: játéktartalom (szerepek, álmok, szabálykártyák, módok, történetkártyák, útmutató).
export default {
  and: 'és',
  numbers: ['nulla', 'egy', 'két', 'három', 'négy', 'öt', 'hat', 'hét', 'nyolc', 'kilenc', 'tíz'],
  roles: {
    G_UNDERTAKER: { name: "Sírásó", when: "Mindig", summary: "Nálad van a temetési lajstrom. Adj a csapatodnak egy szót és egy számot.", detail: "Csak te és a másik Sírásó tudjátok, mi fekszik minden kő alatt. A szavad annyi sírt kössön össze a csapatodéból, és vezessen messze a Halál sírjától." },
    G_DIGGER: { name: "Sírrabló", when: "Mindig", summary: "Olvasd a Sírásó jelét, és ásd ki a csapatod ereklyéit.", detail: "Beszéljétek meg, aztán szavazz egy sírra a telefonodon. A ti ereklyétek: áss tovább. Üres sír vagy a másik csapat ereklyéje: a kör továbbmegy. A Halál sírja: a csapatod veszít." },
    O_SEER: { name: "Látó", when: "Mindig", summary: "Tippeld meg, hol áll meg a kerék, és forgasd, ha megéri.", detail: "Minden körben titokban tippelj: Élet, Halál vagy Újjászületés, és döntsd el, forgatsz-e egyet a keréken (ez öt Befolyásod egyikébe kerül). Minden forgatás összeadódik. A helyes tipp 3 pont; a fel nem használt Befolyás a végén egy-egy pont." },
    W_READER: { name: "Olvasó", when: "Mindig", summary: "Válaszolj a dilemmára magadért, és tippeld meg egy barátodét.", detail: "Minden körben válaszolsz egy kitalált dilemmára, és megtippeled annak a válaszát, akit olvasol. A helyes tipp 2 pont; a saját válaszod semmit sem ér, úgyhogy meglepni az olvasódat teljesen jogos." },
    Q_MIMIC: { name: "Utánzó", when: "Mindig", summary: "Egy barátod arcát viseled. Nem tudod, hol vagy.", detail: "Mindenki más ugyanazon a helyen van. Figyeld a kérdéseket, válaszolj úgy, mintha odatartoznál, és jöjj rá a helyre. Bármikor leleplezheted magad és megnevezheted, hogy nyerj; az elítélt Utánzónak még jár egy utolsó tipp." },
    Q_LIVING: { name: "Élő", when: "Mindig", summary: "Tudod a helyet. Bizonyítsd, de ne áruld el.", detail: "Kérdezz és válaszolj a helyről: elég pontosan, hogy kiderüljön, jártál ott, de elég homályosan, hogy az Utánzó ne jöjjön rá. Játékonként egyszer vádolhatsz; csak az egyhangú asztal ítél el." },
    S_GHOST: { name: "Szellem", when: "Mindig", summary: "Meggyilkoltak. Tudod, ki, hol és miért, de nem beszélhetsz.", detail: "Küldj minden olvasónak egy látomást a sorához. Egy hideg folttal jegeld be a látomást, ami nem a tiéd." },
    S_MEDIUM: { name: "Médium", when: "Mindig", summary: "Olvasd a látomásokat, és gyújts gyertyát az igazságra.", detail: "Minden körben egy sort olvasol: ki, hol vagy miért. Fejtsd meg mindhármat, mielőtt a gyertyák leégnek, aztán nevezd meg a Csalót." },
    S_DECEIVER: { name: "Csaló", when: "Mindig", summary: "Egy második szellem egy élő testben. Tudod az igazságot, és hazudsz.", detail: "Pontosan úgy nézel ki, mint egy Médium. Egy játékban néhányszor kicserélheted a Szellem látomását egy másik olvasónál a sajátodra. Nyersz, ha a gyertyák leégnek, vagy ha az asztal rossz játékost nevez meg." },
    N_SLEEPER: { name: "Alvó", when: "Mindig", summary: "Egy éjszaka, egy szavazás. A kártyád gazdát cserélhet, amíg alszol.", detail: "Egyszer nézd meg a kártyád, cselekedj, ha a telefon felébreszt, aztán vitázz és mutass. Az vagy, ami hajnalban előtted fekszik." },
    N_TWIN: { name: "Iker", when: "Éjjel", summary: "Az ikreddel ébredsz, és látjátok egymást.", detail: "Az Ikrek párban járnak. Ha az ikred nincs a játékosok között, a másik kártya az asztalon fekszik." },
    N_INSOMNIAC: { name: "Álmatlan", when: "Éjjel, utolsóként", summary: "Utolsóként ébredsz, és megnézed a saját kártyádat.", detail: "Látod, elvitte-e valaki a kártyádat az éjjel, és mi vagy hajnalban." },
    K_GUEST: { name: "Álarcos vendég", when: "Mindig", summary: "Táncolj, pillants be és állíts maszkokat, hogy Lelkeket gyűjts. 13 Lélek győz.", detail: "A maszkod egy szerepkártya, amit egyszer láttál. Cserélj vagy színlelj, hogy elrejtsd; pillants be, hogy megtudd; állíts egy maszkot, hogy használd a képességét. Aki azt hiszi, hogy az övé, kihívhat." },
    C_DIGGER: { name: "Sírásó", when: "Mindig", summary: "Temesd el a koporsóidat, licitálj, hányat tudsz kinyitni, és áss. Két tiszta ásás győz.", detail: "Az Átkod a blöfföd: temesd el, hogy mások belebotoljanak. Ha te nyered a licitet, a saját sírodat nyitod ki először." },
    X_LIVING: { name: "Élő", when: "Mindig", summary: "A kristálygömbben látod a jelszót. Mondj egy szót, ami bizonyítja, hogy tudod, de ne add a Démon kezébe.", detail: "Ha túl nyilvánvaló, a Démon megtudja a jelszót. Ha túl homályos, az asztal téged gyanúsít. Aztán nevezzétek meg a Démont." },
    X_DEMON: { name: "Démon", when: "Mindig", summary: "Csak a kategóriát látod. Olvadj be: mondj olyan szót, mintha tudnád a jelszót.", detail: "Figyeld a többieket, és fejtsd meg a jelszót. Ha az asztal mást nevez meg, nyersz. Ha elkapnak, egy jó tipp még így is győzelem." },
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
    PSYCHO: { name: 'Pszichopata', when: 'Éjjel (alapból egyszer játékonként)', summary: 'Egyszer: némítsd el valakit, vagy vedd el a szavazatát a következő napra.', detail: 'NÉMA: nem szólalhat meg a vitában, de jelölhet és szavazhat. NINCS SZAVAZAT: beszélhet, de nem adhat le szavazatot. Az Őrző, az Őrangyal és a Boszorkány áldása kivédi. A képesség blokkolva is elhasználódik. Hogy milyen gyakran, azt az asztal dönti el: alapból egyszer játékonként; a házigazda engedhet egy Némítást és egy Nincs szavazatot, vagy minden éjjel egy jelölést.' },
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
      ["Megtalálni a régi főkönyvet", "Felkutatni a hitelezőt", "Összeszedni a tartozást", "Találkozó a keresztútnál", "Mindent visszafizetni"],
      ["Megtalálni a régi szerelmes leveleket", "Kideríteni, hová lett", "Megnyerni a barátait", "Véletlen találkozót szervezni", "Végre kimondani"],
      ["Számba venni, mi maradt hátra", "Letörölni az ujjlenyomatokat", "Elégetni a nyugtákat", "Elrejteni a fegyvert", "Nem hagyni nyomot"],
      ["Kifürkészni a kincstárat", "Megvesztegetni egy őrt", "Kivágni az üveget", "Kicserélni a koronát", "Mosolyogva kisétálni"],
      ["Megtalálni a tanút", "Kideríteni, mit látott", "Elvágni a telefonzsinórt", "Elcsalni onnan", "Hajnalig csendben tartani"],
      ["Megtalálni a végrendeletet", "Bizonyítani, ki vagy", "Kibírni a többi örököst", "Kinyitni a családi kriptát", "Elvenni, ami a tiéd"],
      ["Felkeresni a sírját", "Kideríteni, ki árulta el", "Megtalálni a búvóhelyüket", "Átállítani a barátaikat", "Rendezni a számlát"],
      ["Benevezni a versenyre", "Túljutni az első fordulón", "Túljárni a favorit eszén", "Túlélni a döntőt", "Magasba emelni a díjat"],
      ["Elolvasni az ítéletet", "Megtalálni az igazi alibit", "A valódi tettes nyomába eredni", "Meggyőzni a bírót", "Kinyitni a cella ajtaját"],
      ["Titokban bepakolni", "Ellopni a hintó kulcsait", "Elsurranni az apa mellett", "Elérni a kápolnát", "Napfelkelte előtt igent mondani"],
      ["Kiásni a régi ládát", "Elolvasni, mi áll benne", "Kideríteni, ki tud még róla", "Elégetni az utolsó példányt", "Mélyebbre temetni"],
      ["Tanulmányozni a tüneteket", "Megtalálni a ritka füvet", "Elkészíteni az orvosságot", "Kipróbálni magadon", "Megmenteni a beteget"],
      ["Meggyújtani a fekete gyertyákat", "Kimondani a nevét", "Megnyitni a kört", "Feltenni a kérdést", "Visszaküldeni"],
      ["Megtalálni a jogos pecsétet", "Összehívni a régi gárdát", "Megrohamozni a kapukat", "Szembenézni a trónbitorlóval", "Elfoglalni a trónt"],
      ["Megtalálni az elveszett vázlatokat", "Kikeverni a tiltott festéket", "Egész éjjel festeni", "Elrejteni a kritikusok elől", "Aláírni a vásznat"],
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
      ["A templomtorony az egyetlen út át a vízen.", "Lámpások égnek a víz alatti ablakokban.", "Egy csónak sodródik el mellettetek, senki sem evez.", "A falu harangja a víz alól kondul.", "A víz emelkedik, és a házak megtelnek hangokkal."],
      ["A zenekar hangol. Zenészek nincsenek.", "Az ötös páholy mindig foglalt. Ma este ül is benne valaki.", "A csillár leng, pedig nincs huzat.", "A primadonna olyan hangot énekel, hogy megrepednek a tükrök.", "Felmegy a függöny az utolsó felvonásra. Ti is benne vagytok."],
      ["A kapu kinyílik, mielőtt hozzáérnétek.", "Friss sír, a kövön a ti monogramotok.", "A varjak számolnak titeket.", "Valaki gondozza ezeket a sírokat. Minden éjjel.", "A föld sóhajt, és megmozdul."],
      ["A távcső már rá van szegezve valamire.", "A csillagtérképen eggyel több csillag van.", "A kupola nem csukódik be, és a Hold benéz.", "A csillagász jegyzetei így végződnek: egyre közelebb jön.", "Napfogyatkozás kezdődik, tizenkét évvel korábban."],
      ["A zenekar egy keringőt játszik, amit senki sem tud lejteni.", "Minden táncos maszkot visel, és egyiknek sincs arca.", "A pezsgő sosem fogy el. Ez a baj.", "A tükrök a bált mutatják, ahogy száz éve volt.", "Elhallgat a zene. Mindenki felétek fordul."],
      ["A jég olyan tiszta, hogy arcokat láttok alatta.", "Korcsolyanyomok köröznek egy lék körül, ami eddig nem volt ott.", "A halászkunyhók üresek, a zsinórok még feszesek.", "Egy repedés kúszik felétek, lassan és szándékosan.", "A lábatok alatt valami kopog, hogy kiengedjétek."],
      ["A cirkuszsátor éjjel felállt, és senki sem állította fel.", "A jósnő már tudja a neveteket.", "Az oroszlán ketrece nyitva. Az oroszlán sehol.", "A porondmester egy számot jelent be, amibe sosem egyeztetek bele.", "A cirkusz összecsomagol körülöttetek. Már ti is a műsor részei vagytok."],
      ["A könyvek szárazak, pedig derékig ér a víz.", "Egy katalóguscédula egy rólatok szóló könyvet jelöl.", "A könyvtáros a víz alól pisszeg rátok.", "A lapok maguktól fordulnak az áramlatban.", "A legmélyebb polcon van az egyetlen példány. A víz emelkedik."],
      ["A mézeskalács ínycsiklandó illatú. Így kap el.", "Az üst rotyog, pedig senki sem gyújtott tüzet.", "A fekete macska mutatja az utat. Ne bízzatok benne.", "A polcon a befőttesüvegeken a ti neveitek állnak.", "A boszorkány korán hazaér."],
      ["A királyok sorban fekszenek. Az egyik koporsó nyitva.", "A fáklyák maguktól gyúlnak meg, ahogy elhaladtok.", "Egy felirat figyelmeztet: csak királyi vér léphet tovább.", "A királyné szobra elfordította a fejét.", "A kőajtó csikorogva bezárul mögöttetek."],
      ["Egy lámpás jeleket ad a sziklákról. Senki sem válaszol.", "A barlang tele ládákkal, mindegyiken koponya.", "A dagály gyorsabban jön, mint a térkép szerint kellene.", "Vámőrök a parton, és egy csempész köztetek.", "Az utolsó csónak éjfélkor indul, veletek vagy nélkületek."],
      ["A standok éjfélkor nyitnak, és azt árulják, amit elvesztettetek.", "Egy kereskedő alkut kínál. Az ár egy emlék.", "A zsebetekben az érmék falevelekké váltak.", "Valaki térképet árul oda, ahová tartotok.", "Hajnalban az egész vásár eltűnik. Siessetek."],
      ["A vitorlák forognak, pedig elállt a szél.", "Füst ömlik a malomból, de semmi sem ég el.", "A molnár még mindig őröl a tűz közepén.", "Csak a létrán lehet feljutni, és az már parázslik.", "A nagy kerék szikraesőben omlik össze."],
      ["A betegek mind alszanak, és mind mosolyognak.", "Az orvos aktái a ti kézírásotokkal íródtak.", "A libegő csak lefelé megy.", "A 9-es szoba hideg, pedig izzik a radiátor.", "Lavina zárja el az utat. Most már senki sem megy el."],
      ["Minden fordulónál önmagatok egy kicsit rosszabb változatát látjátok.", "Az egyik tükörkép egy pillanattal késik.", "Valaki a tükrökben a ti arcotokat viseli maszkként.", "A kijárat táblája minden irányba mutat.", "A tükrök megrepednek, és a tükörképeitek kilépnek belőlük."],
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
    graverobbers: { name: "Dead Set: Sírrablók", blurb: "Két sírrabló csapat, a Hold és a Nap, szavakból vagy ikonokból álló temetőt ás fel istenük ereklyéiért. Csak a Sírásók tudják, mi van alattuk. Az egyik sír a Halálé." },
    omen: { name: "Dead Set: Az Ómen", blurb: "Egy okkult kerék az Életre, a Halálra vagy az Újjászületésre mutat. Bárki titokban elforgathatja; tippeld meg, hol áll meg." },
    mirror: { name: "Dead Set: A Tükör", blurb: "A kísértetjárta tükör azt mutatja, amit a barátaid gondolnak, hogy tennél. Válaszolj a dilemmára, és olvass abban, akivel szemben állsz." },
    mimic: { name: "Dead Set: Utánzó", blurb: "Mindenki tudja, hol vagytok, kivéve azt, aki egy barátod arcát viseli. Kérdezz, válaszolj, vádolj; az Utánzó a helyre fülel." },
    seance: { name: "Dead Set: Szeánsz", blurb: "Egy néma, meggyilkolt Szellem látomásokat küld; a Médiumok ezekből fejtik meg, ki, hol és miért. Köztük egy Csaló a látomásokat hazugságra cseréli." },
    midnight: { name: "Dead Set: Éjfél", blurb: "Egy éjszaka, egy szavazás. A kártyák a sötétben cserélnek gazdát; hajnalban az vagy, ami előtted fekszik. Találj egy Halált, vagy légy az." },
    carnival: { name: "Dead Set: Karnevál", blurb: "Álarcosbál blöffel és emlékezettel. Mindenki egy szerepkártyát visel maszkként, addig keverve, míg senki sem biztos benne. Állíts maszkokat, gyűjts Lelkeket; 13 győz." },
    coffins: { name: "Dead Set: Koporsók", blurb: "Gyors blöffjáték. Temess el aranyat és egy átkot, licitálj, hány koporsót tudsz kinyitni, aztán áss. Két tiszta ásás győz." },
    exorcism: { name: "Dead Set: Ördögűzés", blurb: "Blöffölős szójáték. A kristálygömbben mindenki látja a jelszót, kivéve a Démont. Mindenki egy szót mond, aztán leleplezitek a Démont." },
    missions: { name: "Dead Set: Küldetések", blurb: "Csapatok, szavazások és szabotázs. Senki sem hal meg: vezessetek küldetéseket, olvassátok a szavazatokat, és találjátok meg a Halált, mielőtt ő a Médiumot." },
    standard: { name: 'Alap', blurb: 'Az igazi Dead Set-élmény. Tíz kiegészítő szerep 7 játékostól, mindenkinek Álom minden éjjel, 1–3 szabálykártya.' },
    classic: { name: 'Klasszikus / Tanuló', blurb: 'Tanításhoz. Csak alapszerepek — a kiegészítő helyekre Ártatlanok kerülnek. Álmok alapból kikapcsolva, legfeljebb egy egyszerű szabály.' },
    full: { name: 'Teljes pakli / Káosz', blurb: 'Mind a 17 kiegészítő szerep, köztük a Bolond, a Bárd és a Boszorkány. Nagy véletlenszerűség, csak tapasztalt társaságoknak.' },
    doomsday: { name: 'Világvége', blurb: 'Alap mód, az óra ellen. Ha az utolsó nap végéig senki sem nyert, a Halál győz.' },
    custom: { name: 'Egyéni', blurb: 'Te választod a kiegészítő készletet, az Álmokat, a szabályokat és az órát — vagy beírod a pontos paklit. Figyelmeztet a kiegyensúlyozatlan beállításokra.' },
  },
  scenario: {
    WHO: ['Időutazók', 'Űrfelfedezők', 'Mitikus lények', 'Történelmi alakok szellemei', 'Mutánsok', 'Titkos társaság tagjai', 'Eltévedt turisták', 'Mesterséges intelligenciák', 'Középkori falusiak', 'Hírességek hasonmásai', "Nyugalmazott cirkuszi artisták", "Világítótorony-őrök", "Rivális szakácsok", "Száműzött nemesek", "Éjszakás ápolók", "Mélytengeri búvárok", "Esküvői vendégek", "Rekedt csillagászok", "Álarcosbál táncosai", "Hallgatag szerzetesek", "Éjféli kertészek", "Órásmesterek", "Csempészek", "Operaénekesek", "Sírrablók", "Királyi testőrök", "Halászok", "Alkimisták", "Bankárok", "Vonatkalauzok", "Jósnők", "Hegyi vezetők", "Lámpagyújtogatók", "Bábosok", "Madármegfigyelők", "Temetkezési vállalkozók", "Kártyacsalók", "Vadászok", "Tűznyelők", "Kígyóbűvölők"],
    WHERE: ['Süllyedő hajó', 'Elhagyatott vidámpark', 'Földalatti bunker', 'Kísértetjárta kúria', 'Hóborította tundra', "Ködbe burkolt világítótorony", "Elhagyatott űrállomás", "Éjszakai vonat a hegyek között", "Elárasztott katedrális", "Elvadult botanikus kert", "Sivatagi oázisszálló", "Félreeső kolostor", "Holdfényes szőlőskert", "Elhagyatott filmstúdió", "Óraműmúzeum", "Elárasztott falu", "Gyertyafényes operaház", "Elfeledett temető", "Holdobszervatórium", "Aranyozott bálterem", "Befagyott tó", "Vándorcirkusz", "Elsüllyedt könyvtár", "Boszorkánykunyhó", "Királyi kripta", "Csempészöböl", "Éjféli vásár", "Égő szélmalom", "Alpesi szanatórium", "Tükörlabirintus"],
    WHY: ['Egy rejtett kincs megtalálása', 'Menekülés, mielőtt lejár az idő', 'Egy rituálé befejezése', 'Egy gyilkosság felderítése', 'Egy közelgő katasztrófa megállítása', "Egy ősi átok megtörése", "Vagyon nyerése kártyán", "Egy királyi örökös védelme", "A hazavezető út megtalálása", "Egy áruló leleplezése", "Túlélni napkeltéig", "Egy ellopott ereklye visszaszerzése", "Az alvó város felébresztése", "Egy utolsó üzenet megfejtése", "Egy szörnyű titok megőrzése", "Egy régi adósság rendezése", "Egy elveszett szerelem visszaszerzése", "A bizonyítékok eltüntetése", "A koronaékszerek ellopása", "Egy tanú elhallgattatása", "Egy örökség megszerzése", "Egy testvér megbosszulása", "A fődíj megnyerése", "Az ártatlanság bizonyítása", "Szökés hajnal előtt", "A múlt eltemetése", "Egy különös kór gyógyítása", "Egy szellem megidézése", "Egy elrabolt trón visszaszerzése", "A mestermű befejezése"],
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
  // The Mirror: dilemmas by stable id, [prompt, A, B, C] (see public/dilemmas.js).
  dilemmas: {
    d001: ["Éjfélkor egy idegen kopogtat, bőrig ázva a viharban, és bebocsátást kér.", "Beengeded", "Az ajtón keresztül beszélsz vele", "Úgy teszel, mintha senki sem lenne itthon", "Az éjféli látogató"],
    d002: ["Lezárt naplót találsz az új házad padlásán.", "Feltöröd és elolvasod", "Visszaadod a régi tulajdonosoknak", "Elégeted, olvasatlanul", "A lezárt napló"],
    d003: ["Egy jósnő felajánlja, hogy megmondja, melyik napon halsz meg.", "Meghallgatod", "Udvariasan nemet mondasz", "Inkább valaki másról kérdezel", "A jósnő"],
    d004: ["Egy vacsorán kialszanak a fények, és sikoly hasít a csendbe.", "A sikoly felé rohansz", "Előbb gyertyát keresel", "Mozdulatlanul maradsz", "A sötét vacsora"],
    d005: ["Egy szellem felajánlja, hogy egy hétig bárkit kísért, akit megnevezel.", "Egy riválist nevezel meg", "Egy barátot, a móka kedvéért", "Visszautasítod", "A kölcsönkért kísértet"],
    d006: ["Egy omladozó kastélyt örökölsz, családi átokkal együtt.", "Mégis beköltözöl", "Azonnal eladod", "Szállodát csinálsz belőle", "Az elátkozott kastély"],
    d007: ["Egy holló minden éjjel háromkor az ablakpárkányodra száll.", "Megeteted", "Beszélgetsz vele", "Behúzod a függönyt", "A hajnali három órás holló"],
    d008: ["Egy éjszakát tölthetsz bezárva egy híres kísértetjárta helyen.", "Egy várbörtönben", "Egy elhagyott elmegyógyintézetben", "Egy kísértethajón a tengeren", "A kísértetjárta éjszaka"],
    d009: ["A tükörképed egy pillanattal utánad pislog.", "Farkasszemet nézel vele", "Letakarsz minden tükröt", "Integetsz, és várod, mi lesz", "A késő tükörkép"],
    d010: ["Egy szeánsz balul sül el, és egy szellem szívességet kér.", "Meghallgatod", "Azonnal véget vetsz a szeánsznak", "Előbb alkudozol valamiért", "A szellem kérése"],
    d011: ["Az utolsó hazafelé tartó vonaton csak egy néma utas ül.", "Mellé ülsz", "A lehető legmesszebb ülsz", "Megvárod a következő vonatot", "Az utolsó vonat"],
    d012: ["Egy tárgyat vihetsz magaddal a túlvilágra.", "Egy fényképet", "Egy jó könyvet", "Egy pakli kártyát", "A túlvilági poggyász"],
    d013: ["Egy átkozott érme szerencsét hoz, de naponta egy emlékedbe kerül.", "Megtartod", "Továbbadod valakinek", "A folyóba dobod", "Az átkozott érme"],
    d014: ["Alkonyatkor eltévedsz egy ködös erdőben.", "A távoli fényeket követed", "Felmászol egy fára, és vársz", "Visszafelé indulsz, amerről jöttél", "A ködös erdő"],
    d015: ["Egy álarcosbálon valaki a te arcodat viseli álarcként.", "Kérdőre vonod", "Csendben követed", "Álarcot cserélsz, és távozol", "A kölcsönvett arc"],
    d016: ["Megtudhatsz egy titkot mindenkiről ennél az asztalnál.", "A legnagyobb félelmét", "A legnagyobb hazugságát", "A titkos tehetségét", "Az asztal titkai"],
    d017: ["Egy fekete macska keresztezi az utad egy fontos találkozó felé.", "Mész tovább", "Másik utat választasz", "Megállsz megsimogatni", "A fekete macska"],
    d018: ["Az otthonodban egy barátságos, de nagyon zajos szellem kísért.", "Megtanulsz együtt élni vele", "Ördögűzőt hívsz", "Belépőt szedsz a turistáktól", "A zajos kísértet"],
    d019: ["Vámpírként ébredsz.", "Átadod magad az éjszakai életnek", "Gyógymódot keresel", "Titokban tartod, és élsz tovább", "Az új vámpír"],
    d020: ["Rejtélyes levél hív egy kúriába egy végrendelet felolvasására.", "Egyedül mész", "Egy baráttal mész", "Nem foglalkozol vele", "A végrendelet felolvasása"],
    d021: ["Egy régi fogadóban te vagy az utolsó ébren lévő vendég, és nyikorog a lépcső.", "Utánajársz", "Bezárod az ajtót", "Alvást színlelsz", "A nyikorgó lépcső"],
    d022: ["Egy boszorkány ingyen ad egy bájitalt.", "Szerelmi bájitalt", "Igazságszérumot", "Láthatatlanná tevő bájitalt", "Az ingyen bájital"],
    d023: ["Bármelyik évszázadban élhetsz, visszaút nélkül.", "A múltban", "Itt és most", "A távoli jövőben", "A visszaút nélküli évszázad"],
    d024: ["Egy beszélő portré tanácsot ad pletykáért cserébe.", "Pletykát adsz", "Nem foglalkozol vele", "A fal felé fordítod", "A beszélő portré"],
    d025: ["A csapatod egy faházban rekedt, és holnap elfogy az élelem.", "Te vezeted a menekülést", "Beosztjátok és vártok", "Átkutatod a pincét", "A behavazott kunyhó"],
    d026: ["A saját hangodat hallod az erdőből, ahogy a neveden szólít.", "Válaszolsz", "Elindulsz felé", "Az ellenkező irányba futsz", "A hang az erdőben"],
    d027: ["Egy dzsinn teljesít egy kívánságot, de a megfogalmazásnak tökéletesnek kell lennie.", "Gazdagságot kívánsz", "Több kívánságot kívánsz", "A dzsinn szabadságát kívánod", "A dzsinn kívánsága"],
    d028: ["Egy régi zenélődoboz minden éjjel magától szól.", "Magad húzod fel", "Kiveszed a szerkezetét", "Felveszed bizonyítéknak", "A zenedoboz"],
    d029: ["Életed végéig csak egyféle ételt ehetsz.", "Egy nagy lakomát", "Egyszerű kenyeret és levest", "Valami édeset", "Az egyetlen étel"],
    d030: ["X-szel jelölt térképet találsz a saját kertedről.", "Még ma éjjel ásol", "Nappal ásol, barátokkal", "Hagyod elásva", "Az elásott X"],
    d031: ["Egy barátod bevallja, hogy titokban vérfarkas.", "Segítesz eltitkolni", "Telihold idején bezárod", "Megkéred, hogy mutassa meg az átváltozást", "A vérfarkas barát"],
    d032: ["Egy napra helyet cserélhetsz bárkivel ennél az asztalnál.", "Valakivel, aki rettenthetetlen", "Valakivel, aki gazdag", "Valakivel, aki rejtélyes", "A kölcsönvett élet"],
    d033: ["A temetkezési vállalkozó kedvezménnyel előre megszervezné a temetésedet.", "Fényes gyászmenet", "Csendes szertartás", "Buli tánccal", "A korai temetés"],
    d034: ["A házadban egy óra visszafelé jár.", "Megjavítod", "Békén hagyod", "Megpróbálod kihasználni", "A visszafelé járó óra"],
    d035: ["Megérkezik a cirkusz, és egy bohóc jegyet csúsztat a kezedbe egy titkos előadásra.", "Elmész", "Elajándékozod a jegyet", "Széttéped", "A titkos előadás"],
    d036: ["Egy állatfaj nyelvén beszélhetsz.", "A macskákén", "A varjakén", "A kutyákén", "Az állatok nyelve"],
    d037: ["Egy vihar egy éjszakára egy világítótoronyba zár egy őrrel, aki sosem alszik.", "Fennmaradsz beszélgetni", "Fél szemmel alszol", "Dacolsz a viharral", "Az álmatlan őr"],
    d038: ["Az árnyékod magától kezd mozogni.", "Követed", "A fényben maradsz", "Összebarátkozol vele", "A nyugtalan árnyék"],
    d039: ["Halhatatlanságot kínálnak, de sosem hagyhatod el ezt a várost.", "Elfogadod", "Visszautasítod", "Nagyobb várost kérsz", "Az örök város"],
    d040: ["Egy reggel nyitva áll a temető egyik lezárt kriptája.", "Benézel", "Szólsz a papnak", "Becsukod, és hallgatsz", "A nyitott kripta"],
    d041: ["Ezek közül egyet örökre megtarthatsz.", "Egy kulcsot, ami minden ajtót nyit", "Egy gyertyát, ami sosem alszik ki", "Egy iránytűt, ami hazafelé mutat", "Az emlék"],
    d042: ["Egy árverésen olcsón kel el egy átkozott festmény.", "Licitálsz rá", "Figyelmezteted a többi licitálót", "Elsétálsz", "Az olcsó festmény"],
    d043: ["A falu megkér, hogy őrizd a hidat azon az éjjelen, amikor valami átkel rajta.", "Őrt állsz", "Csapdát állítasz", "Kitalálsz valamit, hogy ne legyél ott", "Az őrség a hídon"],
    d044: ["A szerencsesütidben ez áll: Ne bízz a bal oldali szomszédodban.", "Elhiszed", "Kineveted", "Megmutatod neki", "A szerencsesüti"],
    d045: ["Újraélhetsz egy napot az életedből.", "A legboldogabb napodat", "Egy napot, hogy helyrehozz egy hibát", "Egy átlagos, lusta napot", "Az újra átélt nap"],
    d046: ["Egy régiségbolt tükre tíz évvel idősebbnek mutat.", "Megveszed", "Megkérdezed, mit mutat", "Gyorsan távozol", "Az öregítő tükör"],
    d047: ["Életed végéig egy szellem vigyáz rád.", "Egy lovag", "Egy nagymama", "Egy csintalan gyerek", "Az őrző kísértet"],
    d048: ["Egy buli házigazdája kívülről bezárta az összes ajtót.", "Más kiutat keresel", "Bulizol tovább", "Magyarázatot követelsz", "A bezárt buli"],
    d049: ["Csak egy dologról emlékezhetnek rád.", "A kedvességedről", "A bátorságodról", "A humorodról", "Az egyetlen emlék"],
    d050: ["Egy varázskönyv jelenik meg a küszöbödön.", "Kipróbálsz egy varázslatot", "Elolvasod, de nem varázsolsz", "Elviszed egy könyvtárba", "A varázskönyv"],
    d051: ["Helyet kínálnak egy hajón, amely még sosem tért vissza útjairól.", "Vízre szállsz", "A parton maradsz", "Előbb a legénységet kérdezed", "A visszatérés nélküli hajó"],
    d052: ["Rájössz, hogy a szomszéd faluban él a hasonmásod.", "Találkozol vele", "Messziről figyeled", "Elköltözöl", "A falubeli hasonmás"],
    d053: ["Vacsora közben minden gyertya egyszerre kékre vált.", "Eszel tovább", "Elfújod őket", "Megkérdezed, ki van a szobában", "A kék gyertyák"],
    d054: ["Egyszer egy órára megállíthatod az időt.", "Még ma felhasználod", "Vészhelyzetre tartogatod", "Átalszod", "A megállított óra"],
    d055: ["A katedrális egyik vízköpője találós kérdést kér tőled.", "Mondasz egyet", "Inkább te kérsz egyet", "Úgy teszel, mintha nem hallanád", "A vízköpő találós kérdése"],
    d056: ["A kedvenc dalod szól a saját temetéseden. Melyik az?", "Valami szomorú", "Valami vidám", "Valami, amire senki sem számít", "A temetési dal"],
    d057: ["Egyetlen foglalkozásod lehet egy kísértetjárta városban.", "Temetkezési vállalkozó", "Fogadós", "Éjjeliőr", "A kísértetjárta mesterség"],
    d058: ["Egy barátod kölcsönveszi a kabátodat, és egy idegen levelével a zsebében hozza vissza.", "Elolvasod a levelet", "Visszaadod neki", "Megkeresed az idegent", "Az idegen levele"],
    d059: ["Felkel a telihold, és a város összes kutyája vonyítani kezd.", "Bezárod az ajtókat", "Kimész megnézni", "Velük vonyítasz", "Az üvöltő hold"],
    d060: ["Feladhatsz egy érzéket, hogy a többi élesebb legyen.", "Az ízlelést", "A szaglást", "Soha, egyet sem", "A feláldozott érzék"],
    d061: ["Egy kocsis nélküli hintó áll meg előtted.", "Beszállsz", "Keresed a kocsist", "Továbbmész", "A kocsis nélküli hintó"],
    d062: ["Megtudhatod, mit gondol rólad valójában egy ember.", "A legjobb barátod", "A riválisod", "Senki, köszönöm", "Az igazi vélemény"],
    d063: ["Sűrű köd ereszkedik le, és a városi harang tizenhármat üt.", "Újra megszámolod", "Bebújsz a házba", "Felmész a harangtoronyba", "A tizenharmadik kongatás"],
    d064: ["Kiderül, hogy a házadban van egy rejtett szoba.", "Azonnal kinyitod", "Megvárod a nappalt", "Letapétázod", "A rejtett szoba"],
    d065: ["Egy vándorárus palackozott szerencsét árul.", "Veszel egy üveggel", "Megveszed az egész ládát", "Kikergeted a városból", "Az ügynök"],
    d066: ["Egy évet egyedül kell töltened egy hegyi kolostorban.", "Egy halom könyvet viszel", "Egy hangszert viszel", "Egy naplót viszel", "Az év a hegyen"],
    d067: ["A teafüvek egy nevet rajzolnak ki, amit nem ismersz.", "Megkeresed azt a személyt", "Iszol még egy csészével", "Senkinek sem szólsz", "A tealevelek"],
    d068: ["Vendégként elmehetsz a történelem bármelyik bulijára.", "Egy királyi koronázásra", "Egy vad álarcosbálra", "Egy legendás koncertre", "A történelmi buli"],
    d069: ["Egy haldokló egy kulcsot ad a kezedbe, és azt suttogja: Soha ne nyisd ki.", "Kinyitod", "Örökre megtartod", "Eldobod", "A tiltott kulcs"],
    d070: ["Az asztalnak ki kell választania, ki fedezi fel elsőként a kriptát.", "Jelentkezel", "Mást javasolsz", "Javaslod, hogy húzzatok szalmaszálat", "Az első a kriptában"],
    d071: ["Helyet kínálnak neked a Halál vacsoraasztalánál.", "Udvariasan elfogadod", "Ajándékot viszel", "Kifogást keresel", "A vacsora a Halállal"],
    d072: ["Egy régi fénykép téged mutat egy száz évvel ezelőtti bulin.", "Utánajársz", "Bekereteted", "Elrejted", "A régi fénykép"],
    d073: ["Kedved szerint átváltozhatsz egy lénnyé.", "Denevérré", "Farkassá", "Macskává", "Az alakváltó"],
    d074: ["Valaki minden éjjel virágot hagy a küszöbödön.", "Fennmaradsz, hogy lásd, ki az", "Köszönőcetlit hagysz", "Nem nyitsz többé ajtót", "A virágok a küszöbön"],
    d075: ["Egy vihar miatt elmegy az áram egy horrorfilm közben.", "Kísértettörténeteket mesélsz", "Lefekszel aludni", "Gyertyafénynél eljátszod a befejezést", "Az áramszünet"],
    d076: ["Visszacsinálhatsz egy találmányt a történelemből.", "Az ébresztőórát", "A mobiltelefont", "Semmit, maradjon minden", "A meg nem történt találmány"],
    d077: ["Éjfélkor egy keresztútnál egy idegen felajánlja, hogy behangolja a gitárodat.", "Odaadod", "Előbb megkérdezed az árát", "Elmész a gitároddal", "Az idegen a keresztútnál"],
    d078: ["Egyetlen beszélgetésre visszahozhatsz valakit.", "Egy rokont", "Egy híres személyt", "Egy gyerekkori barátot", "Az utolsó beszélgetés"],
    d079: ["Egyik éjjelről a másikra csapóajtó jelenik meg a konyha padlóján.", "Lemész", "Leszögezed", "Ledobsz egy érmét, és hallgatózol", "A csapóajtó"],
    d080: ["Az utolsó gyertya is csonkig ég, és csak egyikőtök tarthatja.", "Elveszed", "Felajánlod másnak", "Közösen elfújjátok", "Az utolsó gyertya"],
  },
  guide: {
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
    title: 'Hogyan<br><i>játssz.</i>',
    toc: ['Alapok', 'Egy kör', 'Győzelem', 'Alapszerepek', 'Kiegészítő szerepek', 'Teljes pakli', 'Álmok', 'Szabálykártyák', 'Módok', 'Éjszakai sorrend', 'Telefonok'],
    basicsH: 'Az alapok',
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
<li><b>Csendes első nap</b> (alapból bekapcsolva): az első napon csak beszélgetés van. Senkit sem lehet jelölni, és nincs szavazás; az első ítélet a második napon születhet.</li>
<li><b>A Pszichopata</b>: milyen gyakran jelölhet meg valakit a Pszichopata. Egyszer játékonként (alapértelmezés); egyszer Némítás és egyszer Nincs szavazat, tetszőleges sorrendben; vagy minden éjjel egyszer.</li>
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
    kicker: "A szabálykönyv",
    intro: "A Dead Set egy szobára szánt társasjáték-család. Mindenki a saját telefonján játszik; a tévé, ha van, a közös színpad. Válasszatok játékot, olvassátok el a fejezetét, és játsszatok.",
    aboutH: "Mi a Dead Set",
    about: `<p>A Dead Set társas játékok gyűjteménye (rejtett szerepek, blöff, szójátékok, jóslás), amelyek egy asztalon osztoznak. Minden játék ugyanúgy működik: mindenki <b>telefonja privát képernyő</b>, amely csak azt mutatja, amit az adott játékos tudhat, és az alkalmazás a mesélő, így senkinek sem kell kimaradnia, hogy vezesse a játékot.</p>
<ul>
<li><b>Nincs telepítés.</b> Böngészőben fut. Hatjegyű kóddal, linkkel vagy QR-kóddal lehet csatlakozni.</li>
<li><b>3–25 játékos</b>, a játéktól függően. Minden fejezet megadja a létszámot és a hosszt.</li>
<li><b>A tévé nem kötelező, de úgy a legjobb.</b> Mutatja az asztalt, a jeleneteket, a pontokat, és szól a zene. Titkot soha nem mutat.</li>
<li><b>Hét nyelv.</b> Mindenki a sajátját választja; a szójátékok minden telefonon az asztal nyelvét használják, hogy a szavak egyezzenek.</li>
<li><b>Egy asztal, sok játék.</b> A körök között a lobbyban válthattok játékot; egy meccsen belül a pontok megmaradnak.</li>
</ul>`,
    tableH: "Asztal nyitása",
    table: `<ol>
<li><b>Asztal nyitása.</b> A házigazda az <em>Asztal nyitása</em> gombra koppint, megad egy nevet, és kap egy hatjegyű szobakódot.</li>
<li><b>Meghívás.</b> Osszátok meg a kódot, a linket vagy a QR-kódot. A többiek a <em>Csatlakozás</em> gombra koppintanak (vagy megnyitják a linket), megadnak egy nevet, és választanak portrét.</li>
<li><b>Kapcsoljátok be a tévét.</b> Koppintsatok a <em>TV-tábla</em> gombra a lobbyban, vagy nyissátok meg a szobát a tévé böngészőjében, és válasszátok a <em>TV-asztal megnyitása</em> lehetőséget. Egyszerre több képernyő is mutathatja az asztalt.</li>
<li><b>Helyek.</b> A játékosok a csatlakozás sorrendjében ülnek körbe. A házigazda egy helyre koppintva áthelyezhet vagy eltávolíthat valakit.</li>
</ol>
<p>A helyed a böngésződhöz kötődik. Ha lemerül a telefon, a házigazda a szoba menüjéből egyszer használatos visszaállító kódot adhat; az új telefonon válaszd a <em>Helyem visszaállítása</em> lehetőséget, add meg a kódot, és a helyed (a titkaival együtt) átköltözik. A kiesett telefon megtartja a helyét, és visszatéréskor utoléri a többieket.</p>
<p>Ha valaki vezetni szeretné a játékot és mindent látni, nyissátok a szobát <b>megbízható moderátorral</b>. A moderátornak nincs helye az asztalnál, és erről mindenki értesül.</p>`,
    setupH: "Egy játék beállítása",
    setup: `<p>A lobby minden játéknál ugyanazokon a számozott lépéseken vezeti végig a házigazdát. A vendégek ugyanezeket a lépéseket látják, csak olvasásra.</p>
<ol>
<li><b>A játék.</b> Válasszatok egyet, családok szerint csoportosítva: Rejtett hűség, Gazdát cserélő kártyák, Emberismeret, Jelek és rejtvények, Blöff és tét.</li>
<li><b>Így működik.</b> Négy-öt képes lépés: az egész játék egy pillantásra.</li>
<li><b>A pakli.</b> Mit osztanak ennél a létszámnál: szerepeket, maszkokat, kártyákat vagy helyszíneket. Frissül, ahogy a játékosok csatlakoznak.</li>
<li><b>Szabályok.</b> A játék saját kapcsolói. Az alapbeállítások jó első játékot adnak.</li>
<li><b>Az asztal.</b> Az asztal nyelve, a zene és a stílusa, a hátterek, és (ahol számít) hogy egy szobában vagy távolról, csevegéssel játszotok.</li>
<li><b>Időzítők.</b> Mennyi ideig tart egy-egy lépés. Összecsukva; az alapértékek a legtöbb asztalnak megfelelnek.</li>
</ol>
<p>Mindenki a <b>Kész</b> gombra koppint, ha elolvasta a beállításokat, és a házigazda elindítja a játékot. A beállítások gondjai (például túl kevés játékos egy szerephez) megjegyzésként jelennek meg a lépések alatt.</p>`,
    playH: "Így megy minden játék",
    play: `<ul>
<li><b>Soha ne mutasd a képernyődet.</b> A telefonod a szerepedet, a kártyáidat és a döntéseidet mutatja. Minden mást hangosan mondunk, vagy a tévén látszik.</li>
<li><b>Közös jelenetek.</b> A nagy pillanatok (egy leleplezés, a szavazatszámlálás, az éjszaka) minden telefonon és a tévén ugyanakkor, ugyanannyi ideig futnak. Nem lehet átugrani őket, és közben nem jár az időzítő.</li>
<li><b>Játékos választása:</b> koppints a helyére az asztal körén. A választható hely lüktet; a választásod pergamenszínű lesz.</li>
<li><b>Megerősítés:</b> egy titkos döntés (egy szavazat, egy képpel lefelé kijátszott kártya, egy jóslat) egy <b>koppintás</b>, és a lépés végéig módosítható. <b>Nyomva tartás</b> csak a vissza nem vonható, nyilvános lépésekhez kell, és a gomb mindig kiírja: tartsd rajta az ujjad, amíg az arany sáv megtelik.</li>
<li><b>A fejléc</b> megnevezi a játék aktuális lépését és sorszámát (II. éjszaka, 3. küldetés, 4. kör…), a hátralévő idővel.</li>
<li><b>Az asztal alatt:</b> <em>A kártyám</em> (a szereped, bármikor), a játék összefoglaló lapja, a privát <em>Jegyzetek</em> és a <em>Történet</em>, ahol a játékban van ilyen.</li>
<li><b>Időzítők.</b> Ha lejár az idő, a játék dönt helyetted, ha még nem léptél: többnyire passz vagy tartózkodás, de egyes játékok választanak helyetted (a Koporsók például véletlenszerű koporsót temetnek el). A házigazda a szoba menüjében hozzáadhat 30 másodpercet, továbbléphet vagy befejezheti a játékot.</li>
<li><b>Értesítések</b> arról, mit tettek épp a többiek, egy pillanatra a fejlécben jelennek meg.</li>
<li><b>Becsületszabályok.</b> Néhány szabályt (hallgatás, elnémított játékosok) csak maga az asztal tud betartani. Távoli játékban a csevegés tartatja be őket.</li>
</ul>`,
    afterH: "Egy játék után",
    after: `<p>A záróképernyő megnevezi a győzteseket, felfed minden titkot, és a legtöbb játékban visszajátssza, mi történt valójában. Lapozd végig a visszatekintést a saját tempódban.</p>
<p>Sok játékot <b>meccsként</b> játszotok, 1, 3 vagy 5 játékból: a pontok megmaradnak, és az asztal ugyanazokkal a beállításokkal visszatér ugyanabba a lobbyba, mindenki készen a következőre. A lobbyban a házigazda másik játékra is válthat; az asztal, a helyek és a portrék maradnak.</p>`,
    hSetup: "Előkészítés",
    hCast: "A szereplők",
    hLoop: "Egy játék menete",
    hWin: "Győzelem és pontok",
    hOpts: "Beállítások a lobbyban",
    classicP: "Az eredeti Dead Set: rejtett szerepek, éjszakai gyilkosságok és titkos szavazás nappal. Legtöbben túl akartok élni. Néhányan a Halál vagytok. Senki sem tudja, ki kicsoda — kivéve a Halált, aki ismeri a társait.",
    presetsH: "Változatok",
    modesTh: ['Változat', 'Játékosok', 'Mi változik'],
    classicSetup: `<p>5–13 játékos (saját paklival 25-ig). Mindenki kap egy titkos <b>szerepet</b>. A legtöbb szerep a <b>nem-Halál</b> oldalhoz tartozik; egy vagy több játékos titokban a <b>Halál</b>, és a Halál játékosai ismerik egymást. Éjszaka és nappal váltakozik, amíg az egyik oldal nem nyer.</p>
<ul>
<li><b>Szerepek:</b> ki vagy az egész játék alatt: az oldalad és a képességed.</li>
<li><b>Álmok:</b> egy éjszakára szóló hatások: az 1. éjszakától minden élő játékos titokban húz egyet minden éjjel.</li>
<li><b>Szabálykártyák</b> (1–3, a beállításkor húzva) az egész játékot hajlítják: dupla gyilkosság, súlyozott szavazatok, szavazó szellemek.</li>
<li><b>A történet</b> (KI / HOL / MIÉRT) csak mesélés. Soha nem változtat szabályon.</li>
</ul>
<p>Mondhatsz igazat a szerepedről, hazudhatsz, vagy hallgathatsz. A házigazda ugyanúgy játszik, mint bárki, és nem lát több titkot.</p>`,
    missionsSetup: `<p>5–12 játékos. Senki sem hal meg: a Halál beférkőzött az expedícióba, és az asztalnak meg kell találnia, mielőtt ő megtalálja a Médiumot. Mindenki titkos szerepet kap. A Halál játékosai látják egymást (kivéve a Kóborlót); az Élők csak magukat ismerik, a Médium pedig megérzi, ki a Halál.</p>
<p>Az asztal öt küldetést játszik. Minden küldetéshez adott méretű csapat kell (a lobbyban és a tévén látható); 7 játékostól a 4. küldetéshez két Szabotázs kell a kudarchoz.</p>`,
    missionsLoop: `<ol>
<li><b>A küldetéskártya.</b> Minden küldetés egy kártyával kezdődik. A legtöbb szokványos; néha egy megváltoztatja a csapatot, a szavazást vagy a felfedést erre a küldetésre.</li>
<li><b>A javaslat.</b> A Küldetésvezető (nála van a lámpás) a körön játékosokra koppintva tölti fel a csapatot.</li>
<li><b>A csapatszavazás.</b> Mindenki titokban az Elfogad vagy az Elutasít gombra koppint. A szavazatok egyszerre fordulnak meg, névvel. Többség esetén a csapat indul; különben a lámpás a következő játékoshoz kerül. Egy küldetés ötödik javaslata a szavazástól függetlenül indul.</li>
<li><b>A küldetés.</b> Minden csapattag képpel lefelé kijátszik egy kártyát. Az Élők csak Sikert játszhatnak; a Halál Sikert vagy Szabotázst. A kártyákat megkeverik és egyenként felfordítják: egy Szabotázs elbuktatja a küldetést.</li>
<li><b>Az éjszakai közjáték.</b> Mindenki rögzít egy titkos Gyanút arról, ki a Halál. A 2., 3. és 4. küldetés után a Gyertya birtokosa megtudja egy játékos oldalát, és a Gyertya hozzá kerül. Bekapcsolt Nyomokkal hajnalban igaz utalás érkezhet.</li>
</ol>`,
    missionsWin: `<ul>
<li><b>Három siker:</b> a Halál leleplezi magát, és a Kaszás megnevezi, kit tart Médiumnak (a Halál előtte tanakodhat). Ha eltalálja, a Halál nyer; ha nem, az Élők.</li>
<li><b>Három kudarc:</b> az Utolsó Esély. Mindenki megnevez egy játékost. Ha az asztal egy Élőt nevez meg, a Halál nyer; ha elkapja a Halált, a Kaszás akkor is megkapja az Elszámolást: ha megtalálja a Médiumot, a Halál ellopja a győzelmet.</li>
<li><b>A Mellékküldetések</b> az Utolsó Esélyben leadott szavazatod súlyát módosítják: dupla, ha teljesítetted, fele, ha elbuktad.</li>
<li>A Bolond, ha játékban van, egyedül nyer, ha az Utolsó Esélyben vagy a Kaszás őt nevezi meg.</li>
</ul>`,
    missionsOpts: `<ul>
<li><b>Szerepek:</b> a Hívő, a Sarlatán, a Fátylas, a Kóborló, a Sírásó és a Bolond be- vagy kikapcsolása, és az Ikrek hozzáadása.</li>
<li><b>Mellékküldetések:</b> mindenkinek egy titkos személyes cél.</li>
<li><b>A következő Küldetésvezető:</b> a sorban következő, vagy akit az előző vezető választ.</li>
<li><b>Küldetéskártyák:</b> ki, ritkán vagy néha.</li>
<li><b>Nyomok:</b> ritkán, időnként vagy gyakran.</li>
<li><b>Történet:</b> véletlen KI / HOL / MIÉRT, vagy a sajátotok.</li>
</ul>`,
    exorcismSetup: `<p>3–12 játékos, körönként 5–10 perc. Az Élők ismerik a titkos jelszót, amely kiűzné a köztük rejtőző Démont; a Démon nem ismeri. Mindenki látja a kategóriát. A szavak minden telefonon az asztal nyelvén jelennek meg, hogy egyezzenek.</p>`,
    exorcismLoop: `<ol>
<li><b>A kristálygömb.</b> Koppints rá, hogy belenézz: a kategória és (ha Élő vagy) a jelszó. A Démon csak a kategóriát látja, és blöffölnie kell.</li>
<li><b>A sorsolás.</b> Sorsolás dönti el, ki kezd; aztán ülésrendben megy körbe.</li>
<li><b>Mindenki egy szót.</b> A körödben mondj egy szót, amely a jelszóhoz kapcsolódik, aztán tartsd nyomva a gombot a telefonodon. Bizonyítsd, hogy ismered, anélkül hogy a Démon kezére játszanád. A lobbytól függően a szavak egyszer vagy többször mennek körbe, és be is gépelhetők, ekkor a tévén is látszanak.</li>
<li><b>Nevezzétek meg a Démont.</b> Beszéljétek meg, aztán mindenki egy játékosra szavaz.</li>
<li><b>Egy utolsó tipp.</b> Az elkapott Démon megnevezheti a jelszót, a szórácsból vagy begépelve.</li>
</ol>`,
    exorcismWin: `<ul>
<li>A szavazás egy Élőt nevez meg, vagy döntetlen (hacsak nem érme dönt): <b>a Démon nyer</b>.</li>
<li>A szavazás a Démont nevezi meg: <b>az Élők nyernek</b>, hacsak a Démon ezután ki nem találja a jelszót, és el nem lopja a győzelmet.</li>
<li>A pontok körről körre gyűlnek: minden Élő +1 győzelemért, minden Démon +2.</li>
</ul>`,
    exorcismOpts: `<ul>
<li><b>Démonok:</b> egy, vagy 7 játékostól kettő; két Démon ismerheti egymást, vagy nem.</li>
<li><b>Egy utolsó tipp:</b> be vagy ki.</li>
<li><b>Döntetlen szavazás:</b> a Démon megmenekül, vagy érme dönt.</li>
<li><b>Szórács:</b> 16 szó a tévén és a telefonokon; a jelszó az egyik.</li>
<li><b>Körök:</b> hányszor mennek körbe a szavak. <b>Szavak begépelése:</b> a tévén is látszanak.</li>
<li><b>Kategóriák:</b> mely szólistákból húzzon.</li>
</ul>`,
    coffinsSetup: `<p>3–10 játékos, gyors játék. Mindenki magáért játszik, és négy koporsója van: három Arany és egy Átok (a hosszabb változatban öt: négy Arany, egy Átok). A koporsóid mindenki más elől rejtve vannak.</p>`,
    coffinsLoop: `<ol>
<li><b>A temetés.</b> Mindenki egyszerre, titokban eltemet egy koporsót: koppints egy koporsóra, aztán az Eltemetem gombra. A sírod egy halom, a legújabb felül.</li>
<li><b>Temetés vagy kihívás.</b> A kör első játékosától kezdve a körödben vagy újabb koporsót temetsz a halmod tetejére, vagy kihívást teszel: „Ki tudok nyitni N-et”, legfeljebb annyit, ahány koporsó összesen el van temetve.</li>
<li><b>A licit.</b> Körben mindenki emel vagy passzol. A passz az egész körre szól. Az utolsó licitáló lesz az Ásó.</li>
<li><b>Az ásás.</b> Az Ásó előbb a saját koporsóit nyitja ki, felülről lefelé, aztán más sírokat választ, mindig a legfelső koporsót, amíg N koporsó nyitva nincs. Minden koporsó a tévén fordul meg.</li>
<li><b>Az eredmény.</b> Csupa Arany: tiszta ásás, és a sírköved aranyozott lesz. Átok a saját sírodban: választasz egy koporsót, amelyet elveszítesz. Más Átka: vakon húz egyet a koporsóid közül, és az elvész; az Átok gazdája kezdi a következő kört.</li>
</ol>`,
    coffinsWin: `<ul>
<li>Nyersz két tiszta ásással (a lobbyban 1 vagy 3), vagy ha te maradsz az utolsó, akinek van koporsója.</li>
<li>Egy meccsen: a győztes +3, minden tiszta ásás +1, minden feltámadás +1.</li>
</ul>`,
    coffinsOpts: `<ul>
<li><b>A Halál koporsója</b> (alapból be): minden körben egy rejtett játékosnál van egy Arany helyett. Ha kiásod, az ásás elbukik; a gazdája ellopja egy koporsódat, amely Arannyá válik.</li>
<li><b>Szellemfogadások és Visszajárók</b> (alapból be): a koporsó nélküli játékosok minden ásásra Aranyra vagy Átokra fogadnak; háromszor eltalálják, és egy Arany koporsóval feltámadnak.</li>
<li><b>Ereklyék</b> (alapból ki): titkos Lámpás (bepillantás egy sírba), Kulcs (más sírt nyithatsz a sajátod előtt) vagy Oltalom (egy átok semmibe sem kerül), mindegyik egyszer használható.</li>
<li><b>Tiszta ásások a győzelemhez, koporsók játékosonként, játék meccsenként.</b></li>
</ul>`,
    carnivalSetup: `<p>4–12 játékos. Mindenki magáért játszik. Minden maszk egy ismert Dead Set-szerep, mindegyiknek képessége van. Mindenki 6 Lélekkel kezd; a Persely, a tál az asztal közepén, kezdetben üres. 4–5 játékosnál két plusz maszk üres székeken ül: részt vesznek a bálban, de soha nem cselekszenek.</p>
<p><b>A leleplezés:</b> néhány másodpercig minden maszk felfordítva látszik a tévén és minden telefonon. Jegyezzétek meg őket; aztán lefordulnak. Sorsolás választja ki az első táncost, és óramutató szerint megy tovább.</p>`,
    carnivalLoop: `<p>A körödben a három dolog egyikét teszed:</p>
<ul>
<li><b>Csere vagy színlelés.</b> Válassz egy másik maszkot (játékost vagy üres széket), aztán tartsd nyomva a Csere vagy a Színlelés gombot. A két gomb ugyanúgy néz ki, és senki, még a másik játékos sem tudja meg, melyiket választottad.</li>
<li><b>Bepillantás.</b> Egy pillanatra megnézed a saját maszkodat. Mindenki látja, hogy belenéztél.</li>
<li><b>Állítás.</b> Megnevezel egy maszkot, „Én vagyok a Bíró”, és használod a képességét.</li>
</ul>
<p><b>Kihívások.</b> Ha valaki állít, minden más telefon megkérdezi: <em>Ez a te maszkod?</em> Ha senki sem hív ki, az állítás áll, és a képesség működik, bármit visel is valójában az állító. Ha valaki kihív, az állító és minden kihívó felemeli a maszkját: aki tényleg viseli, használja a képességet, a többi lelepleződött egy Lelket (vagy a lobby szerint többet) fizet a Perselybe.</p>
<p><b>A nyitótánc.</b> Minden játékos első köre (vagy kettő, ha a házigazda így dönt) Csere vagy színlelés kell legyen, így a maszkok már kétségesek, mielőtt bárki állítana.</p>`,
    carnivalWin: `<ul>
<li><b>Teli erszény:</b> 13 Lélek (vagy a lobby száma), és azonnal nyersz.</li>
<li><b>A Halál aratása:</b> aki Halál-állításokkal 6 Lelket aratott, nyer.</li>
<li><b>Csőd:</b> amint valaki 0 Lélekre csökken, a leggazdagabb nyer (egyenlőségnél a nagyobb aratás).</li>
<li>Egy meccsen: a győztes +3, mindenki más +1 minden 6 feletti Lélekért.</li>
</ul>`,
    carnivalOpts: `<ul>
<li><b>Maszkok:</b> az ajánlott készlet nő az asztallal; vagy állítsátok össze magatok, helyenként egy maszkot (a Halál kötelező; csak az Ártatlan ismétlődhet).</li>
<li><b>Teli erszény, a Halál aratása, büntetés téves állításért, a nyitótánc, játék meccsenként.</b></li>
<li><b>Jegyzetek (a báli napló):</b> alapból ki, hogy fejben tartsátok, amit láttatok.</li>
</ul>
<p>Bármikor koppints a <em>Maszkok a bálban</em> gombra: minden játékban lévő maszk és a képessége, jelek soraként megrajzolva.</p>`,
    midnightSetup: `<p>4–12 játékos, kb. 10 perc. Egy éjszaka, egy szavazás, nincs második esély. A pakliban játékosonként egy kártya van, plusz három képpel lefelé az asztalon (az üres székek). A pakli nyilvános; hogy kinél mi van, az nem. Mindenki egyszer, az osztáskor látja a saját kártyáját.</p>
<p>A kártyák a sötétben gazdát cserélnek. <b>Hajnalban az vagy, ami előtted fekszik</b>, nem az, amit kaptál.</p>`,
    midnightLoop: `<ol>
<li><b>Az osztás.</b> Egyszer megnézed a kártyádat.</li>
<li><b>Az éjszaka.</b> A telefonok sorban felébresztik a szerepeket: Utánzó, Halál, Összeesküvő, Ikrek, Mentalista, Kettős ügynök, Boszorkány, Szerencsejátékos, Álmatlan. Minden lépés ugyanannyi, 10 másodperc, és akkor is lefut, ha a kártyája az asztalon fekszik, így az éjszaka semmit sem árul el. Csak az kap vezérlőket, aki azt a kártyát kapta; minden más telefon azt mondja, maradjon csukva a szemed. A Szerencsejátékos, ha nem tesz semmit, egy véletlen asztali kártyával cserél.</li>
<li><b>A nappal.</b> Egy vita (alapból 5 perc): állíts, vádolj, hazudj. A kártyák vándorolhattak; ne bízz senkiben, még magadban sem. A házigazda korábban is megnyithatja a szavazást.</li>
<li><b>A szavazás.</b> Mindenki egyszerre mutat egy másik játékosra. A legtöbb szavazatot kapott meghal, ha az legalább kettő; holtversenynél minden holtversenyes meghal. Ha az Önbíráskodó hal meg, az is meghal, akire mutatott.</li>
</ol>`,
    midnightWin: `<ul>
<li>Az oldalakat a hajnali kártyák döntik el (az Utánzó a lemásolt szerepnek számít).</li>
<li><b>Az Élők</b> nyernek, ha legalább egy Halál meghal; ha nincs Halál a játékosok között, akkor ha senki sem hal meg.</li>
<li><b>A Halál és az Összeesküvő</b> nyer, ha egy Halál sem hal meg (és a Bolond sem halt meg).</li>
<li><b>A Bolond</b> egyedül nyer, ha kiszavazzák. Több oldal is nyerhet együtt.</li>
<li>Egy meccsen: minden győztes +1, a Bolond +2. A záróképernyő minden kártyát megmutat osztáskor és hajnalban, és visszajátssza az éjszakát.</li>
</ul>`,
    midnightOpts: `<ul>
<li><b>Kártyák:</b> az ajánlott pakli nő az asztallal; vagy válasszátok ki magatok (Halál 1–2, Ikrek 0 vagy 2, Ártatlan 0–4, a többi 0–1; összesen játékosok + 3).</li>
<li><b>A magányos Halál belenéz:</b> az egyedül ébredő Halál megnézhet egy asztali kártyát.</li>
<li><b>A vita hossza, játék meccsenként.</b></li>
</ul>`,
    seanceSetup: `<p>4–10 játékos, kb. 30 perc. Kooperatív gyilkossági rejtély egy árulóval. Az egyik játékos a Szellem: tudja, ki ölte meg, hol és miért, de nem tud beszélni. Mindenki más Médium, aki a látomásait olvassa. Öt játékostól egy Csaló is rejtőzhet a Médiumok között: egy második szellem, amely ismeri az igazságot, és az asztal ellen dolgozik.</p>
<p><b>A tábla:</b> három sor történetkártya, KI, HOL és MIÉRT. Minden sorban egy kártya az igazság. A szeánsz egyenként kérdez: előbb ki, aztán hol, végül miért.</p>`,
    seanceLoop: `<ol>
<li><b>Látomások.</b> A Szellem minden Médiumnak küld egy látomást a kérdéshez: egy kártyát két-három rajzolt motívummal. A kezében mindig van néhány, ami illik a válaszhoz; a többi a pakli szerencséje. Közben minden Médium titokban megjelöli a <b>gyanúját</b>: kit gyanúsít.</li>
<li><b>A Csaló cseréje.</b> Játékonként néhányszor a Csaló titokban kicseréli egy másik Médium látomását egy sajátjára, amely egy rossz kártya felé mutat.</li>
<li><b>Kezek.</b> A látomások felfordulnak, és az asztalon maradnak, amíg a kérdésre nincs válasz. Beszéljétek meg. A Szellem hallgat, de egy hideg folttal bejegelhet egy látomást: <em>ez nem az enyém</em>. Aztán minden Médium egy kártyára teszi a kezét.</li>
<li><b>A szellem válaszol.</b> A legtöbb kéz alatti kártya kerül a szellem elé; döntetlennél, vagy ha senki nem tette le a kezét, a mutató véletlenszerűen választ. Igen: jön a következő kérdés. Nem: a kártya kihúzva.</li>
<li><b>Az óra.</b> Minden kör elégeti a hét gyertya egyikét, bármi a válasz.</li>
</ol>`,
    seanceWin: `<ul>
<li>Válaszoljatok mindhárom kérdésre, mielőtt a gyertyák leégnek, aztán nevezzétek meg a Csalót (az utolsó gyanúd meg van jelölve). Jó: <b>teljes győzelem</b>. Rossz: <b>üres győzelem</b>, a Csalóval közösen.</li>
<li>Ha az óra leég, a Csaló nyer (Csaló nélkül az asztal veszít). A vaktában tippelés nem elég: hét gyertya három válaszra, soronként hat kártyából.</li>
<li>Egy meccsen: teljes győzelem +2 a Szellemnek és minden Médiumnak; üres győzelem +1 mindenkinek és +1 a Csalónak; a Csaló győzelme +3.</li>
<li>A záróképernyő minden kört visszajátszik: az igazi látomásokat, a cseréket, a kezeket és a gyanúkat.</li>
</ul>`,
    seanceOpts: `<ul>
<li><b>Nehézség:</b> hány kártya van egy sorban, a Szellem látomásai közül hány illik a válaszhoz, és hány gyertya ég az órán.</li>
<li><b>Csalók:</b> nincs, egy vagy kettő, és hogy a kettő ismeri-e egymást; hány cserét kapnak.</li>
<li><b>A Szellem hideg foltjai:</b> hány látomást jegelhet be.</li>
<li><b>A Szellem:</b> sorsolással, vagy a házigazda választja. <b>Játék meccsenként.</b></li>
</ul>`,
    graveSetup: `<p>4–12 játékos, kb. 15 perc. Két sírrabló csapat, a Hold és a Nap, egy 25 sírkőből álló temetőben ássa ki az ereklyéket, amelyek megidézik istenségüket. Érme dönti el, melyik csapat ás először: annak 9 ereklyéje van a földben, a másiknak 8. Hét sír üres, egy pedig a Halálé.</p>
<p>Minden csapatnak van egy <b>Sírásója</b>, az egyetlen játékos, aki látja a temetési jegyzéket: mi fekszik minden kő alatt. Mindenki más ásó. A sírköveken az asztal nyelvén szavak vagy ceruzarajzos ikonok vannak.</p>`,
    graveLoop: `<ol>
<li><b>A jel.</b> A csapata körében a Sírásó egy szót és egy számot ad, „Óceán · 3”: egy szót, amely a csapata több sírját összeköti, és hogy hányat. A szó nem lehet a táblán. Utána semmit sem mond.</li>
<li><b>Az ásás.</b> Az ásók megbeszélik, és a telefonjukon szavaznak; a legtöbb szavazatot kapott sírt ássák ki (holtversenynél érme dönt).</li>
<li><b>Ami alatta van.</b> A csapatod ereklyéje: áshattok tovább, a számig. Üres sír vagy a másik csapat ereklyéje (most már az övék): a kör továbbmegy. A Halál sírja: a csapatod azonnal veszít.</li>
<li><b>Megállás.</b> A csapat megszavazhatja, hogy megáll. Aki a szám elérése előtt megáll, megtart egy bónuszásást a következő körre (nem halmozódik).</li>
</ol>
<p>A telefonodon válts a <em>Kövek</em> (szavak vagy ikonok) és a <em>Térkép</em> (a tábla egy pillantásra) között.</p>
<p><b>Három csapat</b> (6–12 játékos): a Hold, a Nap és a Csillagok, mindegyik az asztal harmada. Az első csapat 7 ereklyét rejt, a többiek 6-6-ot, 5 üres sírral. A Halál sírja kiejti a csapatot a játékból; a többiek tovább ásnak, és ha egy csapat marad, az nyer.</p>`,
    graveWin: `<ul>
<li>Az a csapat nyer, amelynek először ásták ki az összes ereklyéjét, akkor is, ha néhányat a másik csapat ásott ki tévedésből.</li>
<li>Amelyik csapat a Halál sírját nyitja ki, azonnal veszít (három csapatnál kiesik).</li>
<li>Egy 1, 3 vagy 5 játékos meccsen: minden győzelem +1. A Sírásók játékonként cserélődnek.</li>
</ul>`,
    graveOpts: `<ul>
<li><b>Csapatok száma:</b> kettő, vagy 6 játékostól három.</li>
<li><b>A sírokon:</b> szavak vagy ikonok; <b>híres nevek</b> (filmek, hősök, nevezetességek) be vagy ki.</li>
<li><b>Csapatok:</b> ülés szerint (a játékosok áthelyezésével vált csapatot) vagy véletlenszerűen. <b>Sírásók:</b> körbejáró, véletlen vagy választott.</li>
<li><b>Jelek:</b> begépelve (a szó minden képernyőn megjelenik) vagy kimondva (hangosan, a számot koppintva). <b>Játék meccsenként.</b></li>
</ul>`,
    mimicSetup: `<p>4–12 játékos, játékonként kb. 8 perc. Mindenki egy titkos helyszínen osztozik, egy történetkártyán, és ott egy szereplőt alakít, kivéve az Utánzót, aki csak zajt és a lehetséges helyszínek tábláját látja. Az Élőknek meg kell találniuk az Utánzót; az Utánzónak ki kell találnia a helyszínt.</p>`,
    mimicLoop: `<ol>
<li><b>Kérdések.</b> Akinél a lámpás van, hangosan kérdez valakit a helyszínről, aztán rákoppint, kit kérdezett; a lámpás hozzá kerül, és ő kérdez következőnek. Soha ne kérdezd vissza azt, aki épp téged kérdezett. Úgy válaszolj, hogy az Élők felismerjenek, de az Utánzó ne tudja meg a helyszínt.</li>
<li><b>Vádolás.</b> Játékonként mindenki egyszer megvádolhat egy játékost. Az óra megáll; mindenki más az Egyetértek vagy a Nem értek egyet gombbal szavaz. Csak egyhangú asztal ítél el; különben fut tovább az óra.</li>
<li><b>Az Utánzó leleplezi magát.</b> Az Utánzó bármikor felfedheti magát, és megnevezheti a helyszínt.</li>
<li><b>Lejárt az idő.</b> Ha lejár az óra (alapból 8 perc), mindenki egy gyanúsítottra mutat. A legtöbb szavazatot kapott elítélik; holtversenynél az Utánzó kereket old.</li>
</ol>
<p>Hallgatás közben húzd ki a helyszíneket a telefonodon: a jegyzeteid privátak.</p>`,
    mimicWin: `<ul>
<li>Ítéljétek el az Utánzót: <b>az Élők nyernek</b>, hacsak az elkapott Utánzó ezután meg nem nevezi a helyszínt, és el nem lopja a győzelmet.</li>
<li>Ítéljetek el egy Élőt, vagy hagyjátok kereket oldani az Utánzót: <b>az Utánzó nyer</b>.</li>
<li>Az Utánzó megnevezi a helyszínt: ha eltalálja, nyer; ha nem, az Élők nyernek.</li>
<li>Egy meccsen (alapból 3 játék): az Élők +1-et kapnak, aki elkapta az Utánzót, még +1-et; az Utánzó +2-t, vagy +3-at a helyszín megnevezéséért.</li>
</ul>`,
    mimicOpts: `<ul>
<li><b>Helyek a táblán:</b> több helyszín nehezebbé teszi az Utánzó dolgát.</li>
<li><b>Utolsó tipp:</b> az elkapott Utánzó még megnevezheti a helyszínt.</li>
<li><b>A tévé háttere élesedik:</b> bizalmi beállítás. A tévé erősen elmosva mutatja a valódi helyszínt, amely az idő múlásával élesedik. Aki megnyitja a TV-linket, elolvashatja.</li>
<li><b>Kérdezési idő, játék meccsenként.</b></li>
</ul>`,
    omenSetup: `<p>4–12 játékos, kb. 10 perc. Mindenki magáért játszik; nincsenek rejtett oldalak. Egy okkult kerék a három mező egyikére mutat: Élet, Halál és Újjászületés, ebben a sorrendben, óramutató szerint. Mindenki 5 Befolyással kezd, mindenki számára láthatóan.</p>`,
    omenLoop: `<p>Hét kör, mindegyik három lépésben:</p>
<ol>
<li><b>A kerék</b> megmutatja, honnan indul ebben a körben.</li>
<li><b>A lepecsételt szavazat.</b> Titokban jósold meg, hol áll meg a kerék, és döntsd el, egy lépéssel vissza vagy előre forgatod, vagy hagyod. Egy forgatás egy Befolyásba kerül; ha nincs több, csak hagyhatod. A szavazatodat módosíthatod, amíg mindenki le nem adta.</li>
<li><b>A felfedés.</b> Minden forgatást összeadnak, és a kerék egyszer mozdul, az összeggel (három lépés ugyanarra visszahozza). Utána minden jóslat és minden forgatás látható.</li>
</ol>
<p>A tudomány az asztal olvasása: kinek van még Befolyása, ki hová akarja a kereket, és ki fogja megforgatni?</p>`,
    omenWin: `<ul>
<li>Egy helyes jóslat 3 pontot ér. A hiányzó szavazat semmit sem jósol és semmit sem forgat.</li>
<li>A végén minden fel nem használt Befolyás 1 pontot ér. A legtöbb pont nyer; egyenlőségnél osztoznak a győzelmen.</li>
</ul>`,
    omenOpts: `<p>Nincsenek kapcsolók: csak az egyes lépések időzítői.</p>`,
    mirrorSetup: `<p>4–12 játékos, kb. 15 perc. Mindenki magáért játszik. Egy elátkozott tükör nem a tükörképedet mutatja: azt mutatja, mit gondolnak a barátaid, mit tennél. Nyolc kitalált dilemma, mindegyik három válasszal, A, B és C, és egyik sem helyes.</p>
<p>Minden körben egy másik játékost olvasol. A párok váltakoznak, így a játék során mindenki mindenkit olvas, és minden körben mindenkit pontosan egy játékos olvas.</p>`,
    mirrorLoop: `<ol>
<li><b>Beszéljétek meg.</b> A dilemma és hogy ki kit olvas, nyilvános. Kérdezzetek, ugrassátok egymást, vezessétek félre.</li>
<li><b>A lepecsételt szavazat.</b> Válaszd ki a saját válaszodat, és jósold meg annak a válaszát, akit olvasol. Mindkettő kell, és módosíthatod, amíg mindenki le nem adta.</li>
<li><b>A tükör mindent megmutat:</b> minden választ és minden olvasatot, helyeset vagy tévest.</li>
</ol>`,
    mirrorWin: `<ul>
<li>Egy helyes jóslat 2 pontot ér; a saját válaszod semmit, így szabad meglepni az olvasódat.</li>
<li>A hiányzó szavazat véletlen válasszá válik; az olvasóját ehhez mérik.</li>
<li>A legjobb olvasó nyer; egyenlőségnél osztoznak a győzelmen.</li>
</ul>`,
    mirrorOpts: `<p>Az időzítőkön kívül nincsenek kapcsolók. Ha több dilemmacsomag lesz, a lobbyban választhattok, melyikből húzza a nyolcat.</p>`,
  },
};
