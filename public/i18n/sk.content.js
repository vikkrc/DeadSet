// Slovenčina: herný obsah (roly, sny, karty pravidiel, režimy, scenárové karty, návod).
export default {
  and: 'a',
  numbers: ['žiadny', 'jeden', 'dvaja', 'traja', 'štyria', 'piati', 'šiesti', 'siedmi', 'ôsmi', 'deviati', 'desiati'],
  roles: {
    G_UNDERTAKER: { name: "Hrobár", when: "Vždy", summary: "Máš pohrebný register. Daj svojej partii jedno slovo a jedno číslo.", detail: "Len ty a druhý Hrobár viete, čo leží pod každým kameňom. Tvoje slovo má spojiť toľko hrobov tvojej partie a viesť ďaleko od hrobu Smrti." },
    G_DIGGER: { name: "Kopáč hrobov", when: "Vždy", summary: "Čítaj Hrobárovo znamenie a vykopávaj relikvie svojej partie.", detail: "Dohodnite sa a potom hlasuj za hrob na telefóne. Vaša relikvia: kopte ďalej. Prázdny hrob alebo relikvia druhej partie: ťah prechádza. Hrob Smrti: vaša partia prehráva." },
    O_SEER: { name: "Veštec", when: "Vždy", summary: "Tipni, kde koleso zastaví, a otoč ho, keď sa to oplatí.", detail: "Každé kolo tajne tipni Život, Smrť alebo Znovuzrodenie a rozhodni, či koleso otočíš o krok (stojí to jeden z piatich Vplyvov). Všetky otočenia sa sčítajú. Správny tip má 3 body; nepoužitý Vplyv má na konci po jednom bode." },
    W_READER: { name: "Čitateľ", when: "Vždy", summary: "Odpovedz na dilemu za seba a tipni odpoveď priateľa.", detail: "Každé kolo odpovieš na vymyslenú dilemu a tipneš odpoveď hráča, ktorého čítaš. Správny tip má 2 body; tvoja odpoveď nič, takže prekvapiť svojho čitateľa je fér." },
    Q_MIMIC: { name: "Napodobňovač", when: "Vždy", summary: "Nosíš tvár priateľa. Nevieš, kde si.", detail: "Všetci ostatní sú na jednom mieste. Počúvaj otázky, odpovedaj, akoby si tam patril, a zisti miesto. Kedykoľvek sa môžeš odhaliť a pomenovať ho, aby si vyhral; odsúdený Napodobňovač má ešte posledný tip." },
    Q_LIVING: { name: "Živý", when: "Vždy", summary: "Poznáš miesto. Dokáž to, ale neprezraď ho.", detail: "Pýtaj sa a odpovedaj o mieste: dosť presne, aby bolo jasné, že si tam bol, a dosť hmlisto, aby to Napodobňovač neuhádol. Raz za hru môžeš obviniť; odsudzuje len jednomyseľný stôl." },
    S_GHOST: { name: "Duch", when: "Vždy", summary: "Zavraždili ťa. Vieš kto, kde a prečo, ale nemôžeš hovoriť.", detail: "Pošli každému čitateľovi víziu k jeho radu. Studeným miestom zamraz víziu, ktorá nie je tvoja." },
    S_MEDIUM: { name: "Médium", when: "Vždy", summary: "Čítaj vízie a zapáľ sviečky na pravdu.", detail: "Každé kolo čítaš jeden rad: kto, kde alebo prečo. Rozlúštite všetky tri, kým sviečky dohoria, a potom pomenujte Klamára." },
    S_DECEIVER: { name: "Klamár", when: "Vždy", summary: "Druhý duch v živom tele. Poznáš pravdu a klameš.", detail: "Vyzeráš presne ako Médium. Niekoľkokrát za hru vymeníš víziu Ducha inému čitateľovi za svoju. Vyhráš, ak sviečky dohoria, alebo ak stôl pomenuje nesprávneho hráča." },
    N_SLEEPER: { name: "Spáč", when: "Vždy", summary: "Jedna noc, jedno hlasovanie. Tvoja karta môže zmeniť majiteľa, kým spíš.", detail: "Raz si pozri kartu, konaj, keď ťa telefón zobudí, potom sa hádaj a ukáž. Si tou kartou, ktorá pred tebou leží za úsvitu." },
    N_TWIN: { name: "Dvojča", when: "V noci", summary: "Zobudíš sa so svojím dvojčaťom a uvidíte sa.", detail: "Dvojčatá chodia v páre. Ak tvoje dvojča nie je medzi hráčmi, druhá karta leží na stole." },
    N_INSOMNIAC: { name: "Nespavec", when: "V noci, posledný", summary: "Zobudíš sa posledný a pozrieš si vlastnú kartu.", detail: "Uvidíš, či ti v noci niekto vzal kartu, a čím si za úsvitu." },
    K_GUEST: { name: "Maskovaný hosť", when: "Vždy", summary: "Tancuj, nazeraj a hlás masky, aby si zbieral Duše. 13 Duší vyhráva.", detail: "Tvoja maska je karta postavy, ktorú si raz videl. Vymeň alebo predstieraj, aby si ju skryl; nazri, aby si ju spoznal; ohlás masku, aby si použil jej schopnosť. Kto si myslí, že je jeho, ťa môže vyzvať." },
    C_DIGGER: { name: "Hrobár", when: "Vždy", summary: "Zakop svoje rakvy, povedz, koľko ich dokážeš otvoriť, a kopaj. Dve čisté vykopávky vyhrávajú.", detail: "Tvoja Kliatba je tvoj blaf: zakop ju, nech na ňu narazia iní. Ak vyhráš dražbu, otváraš najprv vlastný hrob." },
    X_LIVING: { name: "Živý", when: "Vždy", summary: "V krištáľovej guli vidíš heslo. Povedz slovo, ktoré dokáže, že ho poznáš, ale nedaj ho Démonovi.", detail: "Príliš jasné, a Démon heslo zistí. Príliš nejasné, a stôl podozrieva teba. Potom označte Démona." },
    X_DEMON: { name: "Démon", when: "Vždy", summary: "Vidíš len kategóriu. Splyň s ostatnými: povedz slovo, akoby si heslo poznal.", detail: "Počúvaj ostatných a rozlúšti heslo. Ak stôl označí niekoho iného, vyhrávaš. Ak ťa chytia, jeden správny pokus aj tak vyhrá." },
    M_JESTER: { name: "Šašo", when: "Vždy", summary: "Vyhrávaš sám, ak ťa stôl označí v Poslednom odpore alebo ťa Žnec určí v Zúčtovaní.", detail: "Nie si Živý ani zo Smrti: Médium ťa nevidí a Sviečka ťa ukáže ako Živého. Na misii môžeš hrať Úspech aj Sabotáž. Pôsob podozrivo, ale nie príliš." },
    TWIN: { name: "Dvojča", when: "Vždy", summary: "Dvojčatá sú dve. Poznáte sa a obaja patríte k Živým.", detail: "Môžeš hrať iba Úspech. Ver svojmu dvojčaťu, ale pozor: ak sa za seba budete zaručovať príliš nahlas, Smrť bude vedieť, kam sa pozrieť." },
    UNDERTAKER: { name: "Hrobár", when: "Po neúspešnej misii", summary: "Keď misia zlyhá, dozvieš sa, koľko hráčov Smrti bolo v tom tíme.", detail: "Počítajú sa všetci hráči Smrti, aj Zahalený a Tulák, nech zahrali akúkoľvek kartu. Počuješ to len ty. Môžeš hrať iba Úspech." },
    MEDIUM: { name: "Médium", when: "Vždy", summary: "Vidíš každého hráča Smrti okrem Zahaleného. Riaď výpravu tak, aby si sa neprezradil.", detail: "Ak Živí vyhrajú tri misie alebo v Poslednom odpore chytia hráča Smrti, Smrť má jeden pokus uhádnuť, kto si. Ak označí teba, vyhráva Smrť." },
    BELIEVER: { name: "Veriaci", when: "Vždy", summary: "Vidíš dve sviečky: Médium a Šarlatána. Nevieš, kto je kto.", detail: "Zisti, ktorá sviečka je skutočné Médium, a chráň ho – často tak, že sa sám správaš ako Médium. Bez Šarlatána v hre je tvojou jedinou sviečkou Médium." },
    COMPANION: { name: "Spoločník", when: "Vždy", summary: "Nevieš nič okrem toho, čo ti hovorí srdce. Sleduj hlasovania a misie.", detail: "Môžeš hrať iba Úspech. Čítaj, kto koho navrhuje, kto schvaľuje ktorý tím a ktoré misie zlyhávajú." },
    REAPER: { name: "Žnec", when: "Vždy", summary: "Vedieš Smrť. Na Zúčtovaní rozhodneš, kto je Médium.", detail: "Vidíš zvyšok Smrti (okrem Tuláka). Na misii môžeš hrať Úspech alebo Sabotáž. Tvoj tím môže na Zúčtovaní navrhovať mená; platí tvoja voľba." },
    CHARLATAN: { name: "Šarlatán", when: "Vždy", summary: "Pre Veriaceho vyzeráš presne ako Médium. Využi to.", detail: "Vidíš zvyšok Smrti (okrem Tuláka). Na misii môžeš hrať Úspech alebo Sabotáž." },
    VEILED: { name: "Zahalený", when: "Vždy", summary: "Médium ťa nevidí.", detail: "Vidíš zvyšok Smrti (okrem Tuláka). Na misii môžeš hrať Úspech alebo Sabotáž." },
    STRAY: { name: "Tulák", when: "Vždy", summary: "Slúžiš Smrti sám: nepoznáš ostatných a oni nepoznajú teba.", detail: "Médium ťa aj tak vidí. Na misii môžeš hrať Úspech alebo Sabotáž. Na Zúčtovaní sa Smrť odhalí a pridáš sa k ostatným." },
    SHADE: { name: "Tieň", when: "Vždy", summary: "Kráčaš so Smrťou a poznáš svojich spoluhráčov.", detail: "Vidíš zvyšok Smrti (okrem Tuláka). Na misii môžeš hrať Úspech alebo Sabotáž." },
    CULT_LEADER: { name: "Vodca sekty", when: "Každú noc", summary: "Každú noc naverbuj jedného hráča do Sekty. Sekta vyhráva, keď prečísli všetkých ostatných.", detail: "Naverbovaný si ponechá rolu aj schopnosti, ale odteraz vyhráva so Sektou a dozvie sa, kto sú ostatní členovia. Hráčov na strane Smrti, Rozparovača a chránených hráčov naverbovať nemožno. Ak Vodca zomrie, nikto iný už verbovať nemôže." },
    RIPPER: { name: "Rozparovač", when: "Každú noc", summary: "Každú noc sám zabi jedného hráča. Vyhráš, ak zostaneš posledný na nohách, alebo sám s jedným hráčom, ktorý nie je vrah.", detail: "Tvoju vraždu zastavia rovnaké ochrany ako vraždu Smrti (Strážca, Anjel strážny, Požehnanie čarodejnice, dočasné oživenie). Smrť ťa v noci nemôže zabiť, s výnimkou Krvavého mesiaca. Javíš sa ako NIE NA STRANE SMRTI." },
    DEATH: { name: 'Smrť', when: 'Každú noc', summary: 'Každú noc sa dohodnite so všetkými živými spoluhráčmi Smrti na jednej spoločnej vražde.', detail: 'Všetci aktívni hráči Smrti musia potvrdiť presne rovnaký výber cieľov, inak frakcia pasuje. Základná kapacita je jedna vražda; Dvojité nebezpečenstvo, Nočná zmena alebo Nápor sily ju môžu zvýšiť najviac na dve — nikdy nie jedna vražda na každého hráča Smrti.' },
    INNOCENT: { name: 'Nevinný', when: 'Deň', summary: 'Žiadna schopnosť. Tvojou zbraňou je hlas a hlasovanie.', detail: 'Argumentuj, obviňuj a hlasuj. Aj ty dostávaš každú noc Sen a môžu na teba pôsobiť stavy.' },
    MENTALIST: { name: 'Mentalista', when: 'Každú noc', summary: 'Prečítaj iného hráča: stojí na strane Smrti, alebo nie?', detail: 'Zistíš len aktuálnu príslušnosť cieľa (NA STRANE SMRTI / NIE NA STRANE SMRTI), nikdy jeho presnú rolu. Zablokované čítanie nič neprinesie.' },
    GUARDIAN: { name: 'Strážca', when: 'Každú noc', summary: 'Ochráň jedného hráča (aj seba) pred Smrťou a Psychopatom.', detail: 'Zastaví iba vraždu frakcie Smrti a stav od Psychopata. Nie bomby, Mstiteľa, Obetného baránka, prepojené osudy ani vypršanie. Ten istý cieľ môžeš chrániť opakovane.' },
    PSYCHO: { name: 'Psychopat', when: 'V noci (predvolene raz za hru)', summary: 'Raz: umlč niekoho alebo mu na ďalší deň vezmi hlas.', detail: 'NEMÝ: nesmie hovoriť v diskusii, ale môže nominovať a hlasovať. BEZ HLASU: môže hovoriť, ale nehlasuje. Strážca, Anjel strážny a Požehnanie čarodejnice to zablokujú. Náboj sa minie aj pri zablokovaní. Ako často, určuje stôl: predvolene raz za hru; hostiteľ môže povoliť jedno Umlčanie a jedno Bez hlasu, alebo jedno označenie každú noc.' },
    WHORE: { name: 'Pobehlica', alias: 'Spoločníčka', when: 'Každú noc', summary: 'Navštív niekoho. Ak navštíviš Smrť, vražda celého tímu zlyhá.', detail: 'Ak je navštívená osoba aktívna Smrť, kapacita vraždy frakcie klesne na 0. Ak navštívenú osobu zabije Smrť, zomrieš s ňou; ak ju zasiahne bomba, zasiahne aj teba.' },
    TRAVELING_AGENT: { name: 'Obchodný cestujúci', when: 'Každú noc', summary: 'Doruč záhadný tovar. Čistá atmosféra — a vizitka.', detail: 'Príjemca sa na úsvite dozvie, že ho navštívil Obchodný cestujúci. Tovar nemá žiadny účinok, no samotná návšteva je informácia, ktorú môžete obaja využiť.' },
    TERRORIST: { name: 'Terorista', when: 'Každú noc', summary: 'Polož bombu pred dvere. Päťdesiat na päťdesiat, že vybuchne.', detail: 'Server hodí férovou mincou. Pri ÁNO cieľ zomrie a zomrie aj každá Pobehlica, ktorá ho navštívila. Strážca bombu nezastaví; Anjel strážny, Požehnanie a dočasné vzkriesenie áno.' },
    MIMIC: { name: 'Napodobňovač', when: 'Len noc 1 (povinné)', summary: 'V noci 1 sa natrvalo staň kópiou roly niekoho iného.', detail: 'Preberieš rolu a príslušnosť cieľa s novými nábojmi. Skopírované schopnosti fungujú od noci 2; skopírovaná Smrť sa pridá k tímu od noci 2. Ak skopíruješ Napodobňovača — alebo nevyberieš —, ostaneš do konca hry Napodobňovačom bez moci.' },
    DOUBLE_AGENT: { name: 'Dvojitý agent', when: 'Len noc 1 (povinné)', summary: 'V noci 1 si tajne vyber stranu na zvyšok hry.', detail: 'Vyber SMRŤ alebo NIE-SMRŤ. Ak si vyberieš Smrť, na konci noci 1 prestúpiš; od noci 2 si v miestnosti tímu Smrti a zdieľate jedinú vraždu. Bez výberu ostaneš na strane Nie-Smrti.' },
    DIPLOMAT: { name: 'Diplomat', when: 'Raz za hru, cez deň (pred nomináciami)', summary: 'Raz: vyhlás imunitu voči odsúdeniu na jeden deň.', detail: 'Vyhlasuje sa verejne počas ranného okna. V ten deň ťa nikto nemôže nominovať. Nechráni pred nočnými vraždami, bombami, Mstiteľom ani Obetným baránkom.' },
    SCAPEGOAT: { name: 'Obetný baránok', when: 'Pasívne, deň', summary: 'Ak sa deň skončí bez odsúdenia, zomrieš namiesto toho ty.', detail: 'Remíza, žiadne nominácie, žiadne hlasy, nesplnené Pravidlo väčšiny alebo zrušenie Hazardným hráčom — všetko sa počíta ako „bez odsúdenia“. Je to vražda, nie odsúdenie. Za deň zomrie len jeden Obetný baránok (s najnižším miestom).' },
    NECROMANCER: { name: 'Nekromant', when: 'Raz za hru, v noci', summary: 'Raz: vzkries vyradeného hráča na jeden deň a jednu noc.', detail: 'Navrátilec si ponechá rolu aj príslušnosť, počas vzkriesenia je imúnny voči každej vražde a po nasledujúcej noci odíde. Aby rituál fungoval, musíš noc prežiť. Každého možno vzkriesiť iba raz.' },
    CONSPIRATOR: { name: 'Sprisahanec', when: 'Pasívny hlas cez deň, nočný chat', summary: 'Tvoj hlas má +1. V noci otvoríš súkromný šepot s jedným hráčom.', detail: 'Tvoj hlas nesie jednu váhu navyše na toho istého kandidáta. Každú noc môžeš otvoriť krátky textový kanál pre dvoch so živým hráčom; sám o sebe neprezrádza roly.' },
    MAGISTRATE: { name: 'Sudca', when: 'Pasívne, deň', summary: 'Tvoj hlas váži 2 (pri Paranoji 3).', detail: 'Jeden hlas, jeden kandidát, dvojitá váha. „Bez hlasu“ od Psychopata ho zníži na nulu.' },
    ORACLE: { name: 'Orákulum', when: 'Raz za hru, v noci', summary: 'Raz: uhádni, koho dnes v noci zasiahne Smrť. Ak sa trafíš, prežije.', detail: 'Ak je tvoja predpoveď medzi potvrdenými cieľmi frakcie Smrti, tento hráč je chránený pred jednou vraždou Smrti. Zlý tip alebo pas Smrti neprinesie nič.' },
    GAMBLER: { name: 'Hazardný hráč', when: 'Raz za hru, v noci', summary: 'Raz: stav na zajtrajšieho prvého nominovaného. Ak vyhráš, nikto nevisí.', detail: 'Ak sa prvá oficiálna nominácia nasledujúceho dňa zhoduje s tvojou stávkou, odsúdenie v ten deň sa pred sčítaním zruší. Obetný baránok môže pre chýbajúce odsúdenie aj tak zomrieť.' },
    VIGILANTE: { name: 'Mstiteľ', when: 'Raz za hru, cez deň (pred nomináciami)', summary: 'Raz: ráno zastreľ hráča, bez hlasovania.', detail: 'Vražda rolou, nie odsúdenie. Imunita Diplomata ju nezastaví. Víťazstvo sa kontroluje hneď potom.' },
    JESTER: { name: 'Šašo', when: 'Nezávislý', summary: 'Vyhráš sám — ale len ak ťa mesto odsúdi hlasovaním.', detail: 'Iná smrť (nočná vražda, bomba, Mstiteľ, Obetný baránok) sa nepočíta. Ani prežitie do konca nie je výhra. Voči väčšine Smrti sa počítaš ako „iný“ hráč.' },
    BODYGUARD: { name: 'Osobný strážca', when: 'Každú noc', summary: 'Postav sa k niekomu. Ak preň príde Smrť, čepeľ schytáš ty.', detail: 'Ak by tvoj chránenec zomrel na vraždu Smrti a nič iné ho nezachráni, zomrieš namiesto neho. Seba strážiť nemôžeš, bomby ani prepojené smrti nezastavíš a za noc zachytíš najviac jednu vraždu.' },
    BARD: { name: 'Bard', when: 'Raz za hru, v noci', summary: 'Raz: umlč noc. Každá schopnosť zlyhá, aj schopnosť Smrti.', detail: 'Všetky aktívne schopnosti rol v tú noc sú potlačené. Sny, vypršania a pravidlá hry platia ďalej. Spánková paralýza na Bardovi ticho zruší.' },
    WITCH: { name: 'Čarodejnica', when: 'Každú noc', summary: 'Požehnaj hráča proti ujme, alebo prekľaj jeho ďalšiu akciu, aby zlyhala.', detail: 'Požehnanie: dnes v noci chráni pred škodlivými akciami rol a bombami (nie pred prepojenými osudmi). Kliatba: ďalšia cielená akcia cieľa zlyhá; prekliatie aktívnej Smrti zablokuje vraždu frakcie. Nikdy nie na seba.' },
  },
  dreams: {
    SLEEP_PARALYSIS: { name: 'Spánková paralýza', text: 'Nemôžeš použiť svoju nočnú akciu roly. Ak si aktívna Smrť, celá vražda frakcie je zablokovaná.' },
    PREMONITION: { name: 'Predtucha', text: 'Na úsvite sa dozvieš meno jedného živého hráča na strane Smrti.' },
    WHISPERS: { name: 'Šepot minulosti', text: 'Na úsvite sa dozvieš presnú rolu náhodného vyradeného hráča.' },
    SLEEPWALKING: { name: 'Námesačnosť', text: 'Si viazaný na hráča, ktorý sedí tesne pred tebou. Ak dnes v noci zomrie, zomrieš na konci noci.' },
    DREAM_SNATCHER: { name: 'Zlodej snov', text: 'Pred otvorením akcií si môžeš vymeniť karty Snov s iným živým hráčom.' },
    NIGHT_SHIFT: { name: 'Nočná zmena', text: 'Jedno použitie opakovateľnej nočnej schopnosti navyše, na druhý cieľ. Pre Smrť: kapacita tímu je 2.' },
    SHARED_NIGHTMARE: { name: 'Spoločná nočná mora', text: 'Vyber si partnera sna. Ak dnes v noci zomrie, zomrieš s ním.' },
    INSOMNIA: { name: 'Nespavosť', text: 'Na úsvite dostaneš úplnú chronologickú správu o akciách tejto noci — ak prežiješ.' },
    GUARDIAN_ANGEL: { name: 'Anjel strážny', text: 'Dnes v noci si imúnny voči Smrti, Psychopatovi, bombám, Kliatbe čarodejnice aj prepojeným smrtiam.' },
  },
  mcards: {
    REGULAR: { name: "Bežná misia", text: "Žiadny zvláštny účinok." },
    LANTERN: { name: "Nosič lampáša", text: "Vodca musí byť v tíme." },
    FRESH_FACES: { name: "Nové tváre", text: "Aspoň polovica tímu (zaokrúhlene nahor) nesmie byť z predchádzajúcej misie." },
    EXTRA_HAND: { name: "Ruka navyše", text: "Tím je o jedného hráča väčší." },
    SKELETON_CREW: { name: "Minimálna posádka", text: "Tím je o jedného hráča menší." },
    MASKED_VOTE: { name: "Skryté hlasovanie", text: "Hlasovania o tíme ukazujú iba súčty, nie kto ako hlasoval." },
    SHORT_PATIENCE: { name: "Krátka trpezlivosť", text: "Tretí návrh vyráža bez ohľadu na hlasovanie." },
    WARD: { name: "Ochrana", text: "Spolu s tímom Vodca označí člena, ktorého karta bude nútene Úspech." },
    STEADFAST: { name: "Neochvejná", text: "Na zlyhanie treba o jednu Sabotáž viac než zvyčajne." },
    BRITTLE: { name: "Krehká", text: "Zlyhá už s jedinou Sabotážou, hoci táto misia zvyčajne potrebuje dve." },
    SMOKE: { name: "Dym", text: "Ukáže sa iba výsledok, nie koľko kariet Sabotáže sa zahralo." },
    GRAND: { name: "Veľká misia", text: "Výsledok sa na stupnici počíta dvakrát." },
    TRAIL: { name: "Stopa", text: "Ak uspeje, náhodný živý člen tímu v noci nájde stopu." },
    WITNESS: { name: "Svedok", text: "V noci Vodca tímu tajne uvidí kartu iného člena." },
    HAUNTED_ROAD: { name: "Strašidelná cesta", text: "Ak zlyhá, Žnec vyberie jedného z jej členov, ktorý musí vynechať ďalšiu misiu." },
  },
  missionStory: {
    steps: [
      ["Nájsť roztrhanú mapu", "Ísť po falošnej stope", "Prekopať sa cez návnady", "Otvoriť trezor", "Vyniesť zlato"],
      ["Nájsť hodiny", "Ukradnúť kľúče", "Prelomiť prvý zámok", "Utiecť alarmom", "Dostať sa k posledným dverám"],
      ["Pozbierať sviečky", "Nakresliť kruh", "Vysloviť zakázané slová", "Nakŕmiť oltár", "Uzavrieť kruh"],
      ["Prezrieť telo", "Vypočuť komorníka", "Nájsť zbraň", "Rozbiť alibi", "Označiť vraha"],
      ["Prečítať varovné znamenia", "Nájsť zdroj", "Prestrihnúť správny drôt", "Udržať líniu", "Potiahnuť poslednú páku"],
      ["Nájsť prekliaty predmet", "Zistiť jeho pravé meno", "Naštvať ducha", "Spútať ho soľou", "Zlomiť kliatbu"],
      ["Pridať sa k hre", "Počítať karty", "Odhaliť podvodníka", "Staviť všetko", "Vyhrať poslednú partiu"],
      ["Nájsť dediča", "Ukryť dediča", "Prežiť večeru", "Oklamať vrahov", "Korunovať dediča"],
      ["Čítať hviezdy", "Prejsť tmou", "Podplatiť prievozníka", "Vyliezť na posledný kopec", "Otvoriť domové dvere"],
      ["Zachytiť list", "Sledovať kroky", "Nastražiť pascu", "Zaklapnúť pascu", "Odhaliť zradcu"],
      ["Zabarikádovať dvere", "Rozdeliť sviečky", "Ignorovať klopanie", "Vydržať po polnoci", "Privítať úsvit"],
      ["Zachytiť pach", "Nájsť prekupníka", "Otvoriť sejf", "Podstrčiť falzifikát", "Vrátiť relikviu"],
      ["Zazvoniť na starý zvon", "Zistiť, kto spieval uspávanku", "Uvariť horkú kávu", "Zobudiť starostu", "Zlomiť kúzlo"],
      ["Nájsť prvú stranu", "Rozlúštiť symboly", "Nájsť chýbajúci kľúč", "Čítať medzi riadkami", "Prečítať posledné slovo"],
      ["Spáliť denník", "Umlčať papagája", "Podplatiť svedka", "Striasť detektíva", "Vziať to do hrobu"],
      ["Nájsť starú účtovnú knihu", "Vypátrať veriteľa", "Zohnať, čo je dlžné", "Stretnutie na rázcestí", "Zaplatiť do haliera"],
      ["Nájsť staré ľúbostné listy", "Zistiť, kam odišla", "Získať si jej priateľov", "Zariadiť náhodné stretnutie", "Konečne to povedať"],
      ["Spočítať, čo zostalo", "Zotrieť odtlačky prstov", "Spáliť účtenky", "Ukryť zbraň", "Nezanechať stopu"],
      ["Obhliadnuť pokladnicu", "Podplatiť strážcu", "Vyrezať sklo", "Vymeniť korunu", "Odísť s úsmevom"],
      ["Nájsť svedka", "Zistiť, čo videl", "Prerezať telefónny kábel", "Vylákať ho preč", "Udržať ho v tichosti do úsvitu"],
      ["Nájsť závet", "Dokázať, kto si", "Prečkať ostatných dedičov", "Otvoriť rodinnú hrobku", "Vziať si, čo je tvoje"],
      ["Navštíviť jeho hrob", "Zistiť, kto ho zradil", "Nájsť ich úkryt", "Obrátiť ich priateľov", "Vyrovnať účty"],
      ["Prihlásiť sa do súťaže", "Prejsť prvým kolom", "Prekabátiť favorita", "Prežiť finále", "Zdvihnúť cenu"],
      ["Prečítať rozsudok", "Nájsť pravé alibi", "Vypátrať skutočného vinníka", "Presvedčiť sudcu", "Otvoriť dvere cely"],
      ["Potajomky sa zbaliť", "Ukradnúť kľúče od koča", "Prekĺznuť popri otcovi", "Dostať sa do kaplnky", "Povedať áno pred východom slnka"],
      ["Vykopať starú truhlicu", "Prečítať, čo v nej stojí", "Zistiť, kto ešte vie", "Spáliť poslednú kópiu", "Zakopať to hlbšie"],
      ["Preskúmať príznaky", "Nájsť vzácnu bylinu", "Uvariť liek", "Vyskúšať ho na sebe", "Zachrániť pacienta"],
      ["Zapáliť čierne sviečky", "Vysloviť jeho meno", "Otvoriť kruh", "Položiť otázku", "Poslať ho späť"],
      ["Nájsť pravú pečať", "Zhromaždiť starú gardu", "Zaútočiť na brány", "Postaviť sa uzurpátorovi", "Usadiť sa na tróne"],
      ["Nájsť stratené skice", "Namiešať zakázaný pigment", "Maľovať celú noc", "Ukryť ho pred kritikmi", "Podpísať plátno"],
    ],
    scenes: [
      ["Tanečná sála sa nakláňa, ale kapela odmieta prestať hrať.", "V kapitánovej kajute je voda po členky – a stúpa.", "Záchranné člny spočítali dvakrát. Nestačia.", "V zaplavenej strojovni ešte niečo tiká.", "Paluba je takmer zvislá. Držte sa niečoho. Čohokoľvek."],
      ["Kolotoč sa rozbehne sám, len čo prídete.", "Zrkadlové bludisko ukazuje o jedného z vás viac.", "Pred strašidelným vláčikom stojí rad. Nikto v ňom nedýcha.", "Ruské koleso zastane – s vami úplne hore.", "Každá socha klauna sa otočila k vám."],
      ["Dvere sa za vami so syčaním zapečatia. Svetlo bliká.", "Vysielačka praská hlasom, ktorý pozná vaše mená.", "Na dávkach jedla stojí „Neotvárať“. Niekto ich otvoril.", "Podlažie mínus štyri nie je na žiadnom pláne.", "Vzduchu zostáva na dvadsať minút. Asi."],
      ["Portréty vás sledujú očami – a aj nohami.", "Večera je prestretá presne pre jedného hosťa navyše.", "Tajné dvere sú za knihou, ktorej si sa práve dotkol.", "Schody na povalu vŕzgajú v slovách.", "Dom už nepredstiera, že je prázdny."],
      ["Sneh zjedá vaše stopy tak rýchlo, ako ich robíte.", "Psy pri saniach odmietajú urobiť čo i len krok.", "Niečo veľké ide po vašich stopách celý deň.", "Ľad na jazere začal spievať.", "Fujavica sa zatvára. Už nevidíte ani vlastné ruky."],
      ["Lampa sa otáča, hoci po schodoch už roky nikto nevyšiel.", "Hmlový roh odpovedá na otázky, ktoré nikto nepoložil.", "Strážcov denník končí v polovici vety.", "Skaly dole sú plné lodí, ktoré tomuto svetlu verili.", "Hore lampa zhasne. V tme niečo dýcha."],
      ["Gravitácia funguje vo väčšine miestností. Vo väčšine.", "Umelá inteligencia stanice praje dobré ráno. Nie je ráno.", "Hydroponika je plná rastlín, ktoré nikto nezasadil.", "Podľa záznamu prechodovej komory niekto vyšiel. Nikto nechýba.", "Obežná dráha sa rozpadá. Všetci zadržte dych."],
      ["Sprievodca ti označí lístok a zašepká: zlý vlak.", "Jedálenský vozeň je prestretý na hostinu, ale kuchár zmizol.", "Tunel. Keď sa vráti svetlo, jeden cestujúci je iný.", "Vlak prechádza cez most, ktorý tu včera nebol.", "Brzdy prestali fungovať. Hora nie."],
      ["Veslujete hlavnou loďou, kým organ hrá pod vodou.", "Sviečky horia pod hladinou. To by nemalo byť možné.", "Svätci vo vitrážach všetci ukazujú na vás.", "Krypta je zaplavená a rakvy plávajú.", "Zvon zvoní pod vodou, pomaly a veľmi blízko."],
      ["Ruže sa k vám skláňajú. Zatiaľ zdvorilo.", "V skleníku je dusno a niečo v ňom bzučí.", "Mäsožravá rastlina zjedla mapu. A záhradníka.", "Živý plot bludiska sa pri každom žmurknutí preusporiada.", "Veľký strom v strede otvorí jedno ospalé oko."],
      ["Na recepcii majú vašu rezerváciu. Nikdy ste žiadnu nerobili.", "Bazén je plný piesku a plavčík je stále v službe.", "Izba 313 v noci bzučí. Izba 312 neexistuje.", "Piesočná búrka sfarbí každé okno do hrdzava.", "Studňa v srdci oázy začala šepkať."],
      ["Mnísi zložili sľub mlčania a nahlas ho porušujú.", "Zvony odbijú trinásťkrát.", "V pisárni je kniha, ktorá sa píše sama.", "Chodník nad útesom je klzký a kozy vás súdia.", "V krypte čaká opát. Zomrel v roku 1611."],
      ["Mesiac nad vinobraním visí tak nízko, že by sa dal ohryznúť.", "V pivničných sudoch zreje niečo, čo nie je víno.", "Strašiak sa pred minútou pozeral na druhú stranu.", "Ochutnávková miestnosť vonia slivkami, dymom a zlými rozhodnutiami.", "Hrozno cez noc sčernelo. Počúva."],
      ["Ateliér 9 svieti a natáča sa. Za kamerou nikto nie je.", "V rekvizitárni chýba presne jeden skutočný nôž.", "Na exteriéri vrhá kartónové mestečko skutočné tiene.", "Na režisérskej stoličke je tvoje meno – zle napísané.", "Posledný kotúč je v projektore. Spustite ho a uvidíte, ako sa to skončí."],
      ["Každé hodiny v sále ukazujú iný čas a všetky meškajú.", "Šachový automat žiada odvetu.", "Mechanický vták spieva poplach a poplach mu odpovedá.", "Veľké planetárium sa začalo samo točiť.", "Odbije polnoc a každý exponát otočí hlavu."],
      ["Kostolná veža je jediná cesta na druhú stranu.", "Lampáše svietia v oknách pod vodou.", "Okolo sa prepláva čln, nikto nevesluje.", "Dedinský zvon zvoní spod hladiny.", "Voda stúpa a domy sa plnia hlasmi."],
      ["Orchester ladí. Hudobníci tu nie sú.", "Lóža päť je vždy rezervovaná. Dnes v nej niekto sedí.", "Luster sa kýve, hoci nefúka.", "Primadona zaspieva tón, ktorý rozbije zrkadlá.", "Opona sa dvíha k poslednému dejstvu. Ste v ňom."],
      ["Brána sa otvorí skôr, než sa jej dotknete.", "Čerstvý hrob a na kameni vaše iniciály.", "Vrany vás počítajú.", "Niekto sa o tieto hroby stará. Každú noc.", "Zem si vzdychne a pohne sa."],
      ["Ďalekohľad už na niečo mieri.", "Na hviezdnej mape je o hviezdu viac.", "Kupola sa nezavrie a Mesiac nazerá dnu.", "Poznámky astronóma končia slovami: približuje sa to.", "Začína zatmenie, o dvanásť rokov skôr."],
      ["Orchester hrá valčík, ktorého kroky nikto nepozná.", "Každý tanečník má masku a nikto z nich nemá tvár.", "Šampanské nikdy nedôjde. To je ten problém.", "Zrkadlá ukazujú bál spred sto rokov.", "Hudba stíchne. Všetci sa otočia k vám."],
      ["Ľad je taký číry, že pod ním vidno tváre.", "Stopy korčúľ krúžia okolo diery, ktorá tu predtým nebola.", "Rybárske búdy sú prázdne, vlasce ešte napnuté.", "Prasklina sa k vám plazí, pomaly a zámerne.", "Pod vašimi nohami niečo klope, aby ste to pustili von."],
      ["Cirkusový stan stojí cez noc a nikto ho nestaval.", "Veštica už pozná vaše mená.", "Klietka leva je otvorená. Lev chýba.", "Principál ohlási číslo, s ktorým ste nikdy nesúhlasili.", "Cirkus sa okolo vás balí. Teraz ste súčasťou predstavenia."],
      ["Knihy sú suché, hoci voda siaha po pás.", "Katalógový lístok uvádza knihu o vás.", "Knihovníčka vás spod hladiny utišuje.", "Stránky sa v prúde otáčajú samy.", "Na najhlbšej polici je jediný výtlačok. Voda stúpa."],
      ["Medovník lákavo vonia. Tak vás dostane.", "Kotlík bublá, hoci nikto nezapálil oheň.", "Čierna mačka vám ukazuje cestu. Neverte jej.", "Poháre na polici majú štítky s vašimi menami.", "Čarodejnica sa vráti skôr."],
      ["Králi ležia v rade. Jedna rakva je otvorená.", "Fakle sa zapaľujú samy, keď prechádzate.", "Nápis varuje: prejde len kráľovská krv.", "Socha kráľovnej otočila hlavu.", "Kamenné dvere sa za vami so škrípotom zatvoria."],
      ["Z útesov bliká lampáš. Nikto neodpovedá.", "Jaskyňa je plná debien, na každej lebka.", "Príliv prichádza rýchlejšie, než uvádzajú mapy.", "Colníci na pláži a pašerák medzi vami.", "Posledný čln odchádza o polnoci, s vami či bez vás."],
      ["Stánky otvárajú o polnoci a predávajú, čo ste stratili.", "Kupec ponúka výhodný obchod. Cenou je spomienka.", "Mince vo vreckách sa zmenili na lístie.", "Niekto predáva mapu miesta, kam idete.", "Za úsvitu celý trh zmizne. Ponáhľajte sa."],
      ["Krídla sa točia, hoci vietor utíchol.", "Z mlyna sa valí dym, no nič nezhorí.", "Mlynár stále melie múku uprostred ohňa.", "Hore vedie len rebrík a už tlie.", "Veľké koleso sa zrúti v spŕške iskier."],
      ["Pacienti všetci spia a všetci sa usmievajú.", "Lekárove spisy sú písané vaším písmom.", "Lanovka jazdí len dolu.", "Izba 9 je studená, hoci radiátor žiari.", "Lavína zatarasí cestu. Teraz už nikto neodíde."],
      ["Za každou zákrutou vidíte trochu horšiu verziu seba.", "Jeden odraz o chvíľu mešká.", "Niekto v zrkadlách nosí masku s vašou tvárou.", "Šípka východu ukazuje všetkými smermi.", "Zrkadlá prasknú a vaše odrazy vykročia von."],
    ],
    genericSteps: ["Prvý krok", "Hlbšie", "Bod, odkiaľ niet návratu", "Najťažšia časť", "Koniec cesty"],
    genericScenes: ["Výprava vyráža. Nikto sa neobzerá.", "Cesta sa zužuje – a s ňou aj dôvera.", "V polovici cesty. Niekto počíta kroky.", "S každou voľbou je vzduch chladnejší.", "Posledný úsek. Čo tu čaká, čakalo na vás."],
  },
  sideMissions: {"GO_TWICE": "Choď aspoň na dve misie.", "GO_THRICE": "Choď aspoň na tri misie.", "STAY_BEHIND": "Choď najviac na jednu misiu.", "EARLY_BIRD": "Choď na misiu 1 alebo 2.", "LATE_ARRIVAL": "Nechoď na misiu 1 ani 2.", "LANTERN_LEADS": "Veď tím, ktorý sa vydá na misiu.", "NO_LANTERN": "Nikdy neveď tím, ktorý sa vydá na misiu.", "GOOD_COMPANY": "Buď na misii, ktorá uspeje.", "BAD_LUCK": "Buď na misii, ktorá zlyhá.", "CLEAN_RECORD": "Nikdy nebuď na misii, ktorá zlyhá.", "NAYSAYER": "Hlasuj aspoň trikrát za Zamietnutie.", "OPEN_HEART": "Nikdy nehlasuj za Zamietnutie.", "LONE_VOICE": "Zamietni tím, ktorý stôl schváli.", "LOST_CAUSE": "Schváľ tím, ktorý stôl zamietne.", "CONTRARIAN": "Dvakrát skonči na prehratej strane hlasovania o tíme.", "CROWD": "Vždy hlasuj s väčšinou.", "FIRST_TRUST": "Schváľ prvý návrh dvoch rôznych misií.", "POPULAR": "Buď aspoň v troch navrhnutých tímoch.", "SELF_STARTER": "Daj sa do tímu, ktorý sám navrhneš.", "HUMBLE": "Nikdy sa nedaj do tímu, ktorý sám navrhneš.", "NEIGHBOURS": "Choď na misiu spolu s hráčom po tvojej ľavici.", "CANDLE_BEARER": "Niekedy drž Sviečku.", "STEADY_EYE": "Nikdy nemeň svoje Podozrenie (a daj aspoň dve).", "RESTLESS": "Svojimi Podozreniami označ troch rôznych hráčov."},
  rules: {
    OPEN_BALLOT: { name: "Verejné hlasovanie", text: "Každý hlas je verejný: všetci vidia, kto hlasuje za koho, hneď ako hlasy prichádzajú.", enforcement: "Hlasy sa dajú meniť až do uzamknutia. Aj hlasy duchov sú verejné." },
    FOG_OF_WAR: { name: 'Hmla vojny', text: 'Počas diskusie môžeš priamo hovoriť len s hráčmi na miestach hneď vedľa teba.', enforcement: 'Naživo na čestné slovo. Na diaľku nahradí stolový chat šepot so susedmi.' },
    DOUBLE_JEOPARDY: { name: 'Dvojité nebezpečenstvo', text: 'Frakcia Smrti môže každú noc zabiť až dvoch hráčov (pevný strop 2).', enforcement: 'Blokovania ako návšteva Pobehlice alebo paralýza ju stále znížia na 0.' },
    PARANOIA: { name: 'Paranoja', text: 'Každý živý hlas získa +1 váhu. Sudca váži 3; Sprisahanec pridáva ďalšiu +1.', enforcement: 'Hlasy duchov ostávajú s váhou 1.' },
    UNRELIABLE_POWER: { name: 'Nespoľahlivá moc', text: 'Každá nočná akcia roly hádže k6: 1–3 zlyhá, 4–6 funguje. Smrť hádže raz za tím.', enforcement: 'Neúspešná jednorazová schopnosť sa aj tak minie.' },
    POWER_SURGE: { name: 'Nápor sily', text: 'Každú noc získa jedna náhodná oprávnená opakovateľná schopnosť použitie navyše. Smrť sa počíta ako jeden záznam.', enforcement: 'Nikto nikdy viac ako dve použitia; kapacita Smrti má strop 2.' },
    EQUAL_EXCHANGE: { name: 'Rovnaká výmena', text: 'Hráč na strane Smrti odsúdený hlasovaním si môže so sebou vziať jedného živého hráča Nie-Smrti.', enforcement: 'Nočné vraždy, výstrely Mstiteľa a prepojené smrti ju nespúšťajú.' },
    CURSED_SILENCE: { name: 'Prekliate ticho', text: 'Počas diskusie smieš hovoriť, len keď ťa niekto priamo osloví.', enforcement: 'Na čestné slovo. Nominácie a hlasovanie to neovplyvňuje.' },
    MAJORITY_RULE: { name: 'Pravidlo väčšiny', text: 'Odsúdenie potrebuje viac ako polovicu váhy všetkých oprávnených živých voličov na jednom nominovanom.', enforcement: 'Zdržania a nehlasujúci sa započítavajú do menovateľa. Hlasy duchov sa nepočítajú nikdy.' },
    HIDDEN_ROLES: { name: 'Skryté roly', text: 'Roly vyradených hráčov sa až do konca hry nikdy verejne neukážu.', enforcement: 'Je to aj tak predvolené; táto karta to uzamkne.' },
    VENGEFUL_GHOSTS: { name: 'Pomstychtiví duchovia', text: 'Každý vyradený hráč môže každý deň odovzdať jeden hlas ducha s váhou 1.', enforcement: 'Duchovia nemôžu nominovať, používať schopnosti ani ovplyvniť Pravidlo väčšiny.' },
  },
  presets: {
    graverobbers: { name: "Dead Set: Vykrádači hrobov", blurb: "Dve partie vykrádačov hrobov, Mesiac a Slnko, prekopávajú cintorín slov alebo ikon pre relikvie svojho božstva. Čo leží pod zemou, vedia len Hrobári. Jeden hrob patrí Smrti." },
    omen: { name: "Dead Set: Znamenie", blurb: "Okultné koleso ukazuje na Život, Smrť alebo Znovuzrodenie. Ktokoľvek ho môže tajne otočiť; tipni, kde zastaví." },
    mirror: { name: "Dead Set: Zrkadlo", blurb: "Strašidelné zrkadlo ukazuje, čo si priatelia myslia, že urobíš. Odpovedz na dilemu a čítaj toho, koho máš oproti." },
    mimic: { name: "Dead Set: Napodobňovač", blurb: "Všetci vedia, kde ste, okrem toho, kto nosí tvár priateľa. Pýtaj sa, odpovedaj, obviňuj; Napodobňovač načúva, kde to je." },
    seance: { name: "Dead Set: Seansa", blurb: "Nemý zavraždený Duch posiela vízie; Médiá z nich lúštia kto, kde a prečo. Klamár medzi nimi vymieňa vízie za lži." },
    midnight: { name: "Dead Set: Polnoc", blurb: "Jedna noc, jedno hlasovanie. Karty v tme menia majiteľov; za úsvitu si tým, čo leží pred tebou. Nájdi Smrť, alebo ňou buď." },
    carnival: { name: "Dead Set: Karneval", blurb: "Maškarný bál blafovania a pamäti. Každý nosí kartu postavy ako masku, miešanú, kým si nikto nie je istý. Hlás masky a zbieraj Duše; 13 vyhráva." },
    coffins: { name: "Dead Set: Rakvy", blurb: "Rýchla blafovacia hra. Zakop zlato a jednu kliatbu, ponúkni, koľko rakiev dokážeš otvoriť, a kopaj. Dve čisté vykopávky vyhrávajú." },
    exorcism: { name: "Dead Set: Exorcizmus", blurb: "Slovná hra plná blafovania. V krištáľovej guli všetci vidia heslo, okrem Démona. Každý jedno slovo, potom odhaľte Démona." },
    missions: { name: "Dead Set: Misie", blurb: "Tímy, hlasovania a sabotáž. Nikto neumiera: veďte misie, čítajte hlasy a nájdite Smrť skôr, než ona nájde Médium." },
    standard: { name: 'Štandard', blurb: 'Zamýšľaný zážitok z Dead Set. Desať rozšírených rol od 7 hráčov, Sen pre každého každú noc, 1–3 karty pravidiel.' },
    classic: { name: 'Klasika / Učenie', blurb: 'Na učenie. Iba základné roly — rozšírené miesta obsadia Nevinní. Sny predvolene vypnuté, najviac jedno jednoduché pravidlo.' },
    full: { name: 'Celý balík / Chaos', blurb: 'Všetkých 17 rozšírených rol vrátane Šaša, Barda a Čarodejnice. Veľa náhody, len pre skúsené skupiny.' },
    doomsday: { name: 'Súdny deň', blurb: 'Štandard proti času. Ak do konca posledného dňa nikto nevyhrá, vyhráva Smrť.' },
    custom: { name: 'Vlastné', blurb: 'Vyber si rozšírený zásobník, Sny, pravidlá aj hodiny sám — alebo napíš presný balík. Upozorní na nevyvážené zostavy.' },
  },
  scenario: {
    WHO: ['Cestovatelia v čase', 'Vesmírni prieskumníci', 'Mýtické bytosti', 'Duchovia historických osobností', 'Mutanti', 'Členovia tajného spolku', 'Stratení turisti', 'Umelé inteligencie', 'Stredovekí dedinčania', 'Dvojníci celebrít', "Cirkusanti na dôchodku", "Strážcovia majákov", "Súperiaci kuchári", "Vyhnaní šľachtici", "Nočné zdravotné sestry", "Hlbinní potápači", "Svadobní hostia", "Uviaznutí astronómovia", "Tanečníci maškarného plesu", "Mlčanliví mnísi", "Polnoční záhradníci", "Hodinári", "Pašeráci", "Operní speváci", "Vykrádači hrobov", "Kráľovskí strážcovia", "Rybári", "Alchymisti", "Bankári", "Sprievodcovia vlakov", "Veštice", "Horskí vodcovia", "Lampári", "Bábkari", "Pozorovatelia vtákov", "Pohrebníci", "Karetní podvodníci", "Lovci", "Hltači ohňa", "Zaklínači hadov"],
    WHERE: ['Potápajúca sa loď', 'Opustený zábavný park', 'Podzemný bunker', 'Strašidelné sídlo', 'Zasnežená tundra', "Maják zahalený hmlou", "Opustená vesmírna stanica", "Nočný vlak cez hory", "Zatopená katedrála", "Zarastená botanická záhrada", "Hotel v púštnej oáze", "Odľahlý kláštor", "Vinica v mesačnom svite", "Opustené filmové štúdio", "Múzeum hodinových strojčekov", "Zatopená dedina", "Opera pri sviečkach", "Zabudnutý cintorín", "Lunárne observatórium", "Pozlátená tanečná sála", "Zamrznuté jazero", "Putovný cirkus", "Potopená knižnica", "Chalúpka čarodejnice", "Kráľovská krypta", "Pašerácka zátoka", "Polnočný trh", "Horiaci veterný mlyn", "Alpské sanatórium", "Zrkadlové bludisko"],
    WHY: ['Nájsť ukrytý poklad', 'Uniknúť, kým nevyprší čas', 'Dokončiť rituál', 'Vyriešiť vraždu', 'Zastaviť hroziacu katastrofu', "Zlomiť prastarú kliatbu", "Vyhrať majetok v kartách", "Ochrániť kráľovského dediča", "Nájsť cestu domov", "Odhaliť zradcu", "Prežiť do svitania", "Získať späť ukradnutú relikviu", "Zobudiť spiace mesto", "Rozlúštiť poslednú správu", "Uchovať strašné tajomstvo", "Vyrovnať starý dlh", "Získať späť stratenú lásku", "Zahladiť dôkazy", "Ukradnúť korunovačné klenoty", "Umlčať svedka", "Získať dedičstvo", "Pomstiť brata", "Vyhrať hlavnú cenu", "Dokázať svoju nevinu", "Ujsť pred úsvitom", "Pochovať minulosť", "Vyliečiť zvláštnu chorobu", "Privolať ducha", "Získať späť ukradnutý trón", "Dokončiť majstrovské dielo"],
  },
  products: ['mosadzný kľúč, ktorý nepasuje do žiadneho zámku', 'pohár teplého piesku', 'lístok na vlak, ktorý odišiel včera', 'jediné čierne pierko', 'vreckové hodinky idúce dozadu', 'zapečatený list adresovaný tebe', 'fľaštičku sivého parfumu', 'balíček kariet bez dámy', 'sviečku, ktorá vonia dažďom', 'fotografiu prázdnej izby', 'zamatom vystlanú škatuľku (prázdnu)', 'kompas, ktorý ukazuje na teba'],
  whispers: [
    'Bo našli mŕtveho. Nikto nevidel Pobehlicu odchádzať.',
    'Mesto obesilo Šaša. Smial sa.',
    'Mentalistka to vedela. Nikto jej neveril.',
    'Chýbali dva hlasy. Zaplatil Obetný baránok.',
    'Fay prisahala, že je Strážca. Gus tiež.',
    'Nekromant vzkriesil nesprávneho priateľa.',
    'Bomba pri dverách. Minca vo vzduchu.',
    'Všetci sa zobudili. Nejako to bolo horšie.',
    'Smrť hlasovala s mestom. Samozrejme.',
  ],
  // The Mirror: dilemmas by stable id, [prompt, A, B, C] (see public/dilemmas.js).
  dilemmas: {
    d001: ["O polnoci klope cudzinec, premočený búrkou, a prosí, aby mohol vojsť.", "Pustíš ho dnu", "Rozprávaš sa s ním cez dvere", "Tváriš sa, že nikto nie je doma", "Polnočný návštevník"],
    d002: ["Na povale nového domu nájdeš zamknutý denník.", "Vylomíš zámok a prečítaš ho", "Vrátiš ho starým majiteľom", "Spáliš ho neprečítaný", "Zamknutý denník"],
    d003: ["Veštkyňa ti ponúkne, že ti povie deň tvojej smrti.", "Vypočuješ si ju", "Zdvorilo odmietneš", "Spýtaš sa radšej na niekoho iného", "Veštkyňa"],
    d004: ["Na večierku zhasnú svetlá a ozve sa výkrik.", "Bežíš za výkrikom", "Najprv hľadáš sviečku", "Ostaneš úplne bez pohybu", "Večera v tme"],
    d005: ["Duch ti ponúkne, že týždeň bude strašiť kohokoľvek, koho určíš.", "Určíš rivala", "Určíš priateľa, pre zábavu", "Odmietneš", "Požičaný duch"],
    d006: ["Zdedíš rozpadávajúci sa hrad aj s rodinnou kliatbou.", "Aj tak sa nasťahuješ", "Hneď ho predáš", "Urobíš z neho hotel", "Prekliaty hrad"],
    d007: ["Na parapet ti každú noc o tretej sadne havran.", "Nakŕmiš ho", "Rozprávaš sa s ním", "Zatiahneš závesy", "Havran o tretej ráno"],
    d008: ["Môžeš stráviť noc zamknutý na slávnom strašidelnom mieste.", "V hradnej kobke", "V opustenom blázinci", "Na lodi duchov na mori", "Noc medzi duchmi"],
    d009: ["Tvoj odraz žmurkne o okamih po tebe.", "Zízaš naň, kým neuhne", "Zakryješ všetky zrkadlá", "Zamávaš a uvidíš, čo sa stane", "Oneskorený odraz"],
    d010: ["Seansa sa pokazí a duch ťa prosí o láskavosť.", "Vypočuješ ho", "Seansu okamžite ukončíš", "Najprv si niečo vyjednáš", "Prosba ducha"],
    d011: ["Posledný vlak domov je prázdny, až na jedného mlčanlivého cestujúceho.", "Sadneš si vedľa neho", "Sadneš si čo najďalej", "Počkáš na ďalší vlak", "Posledný vlak"],
    d012: ["Do posmrtného života si môžeš vziať jeden predmet.", "Fotografiu", "Dobrú knihu", "Balíček kariet", "Batožina na druhý svet"],
    d013: ["Prekliata minca prináša šťastie, ale každý deň ťa stojí jednu spomienku.", "Necháš si ju", "Dáš ju niekomu ďalej", "Hodíš ju do rieky", "Prekliata minca"],
    d014: ["Za súmraku zablúdiš v hmlistom lese.", "Ideš za vzdialenými svetlami", "Vylezieš na strom a čakáš", "Vrátiš sa cestou, ktorou si prišiel", "Hmlistý les"],
    d015: ["Na maškarnom bále má niekto ako masku tvoju tvár.", "Postavíš sa mu", "Potichu ho sleduješ", "Vymeníš si masky a odídeš", "Požičaná tvár"],
    d016: ["O každom pri tomto stole sa môžeš dozvedieť jedno tajomstvo.", "Jeho najväčší strach", "Jeho najväčšiu lož", "Jeho tajný talent", "Tajomstvá stola"],
    d017: ["Cestou na dôležité stretnutie ti skríži cestu čierna mačka.", "Pokračuješ", "Vyberieš sa inou cestou", "Zastavíš sa a pohladkáš ju", "Čierna mačka"],
    d018: ["V tvojom dome straší priateľský, ale veľmi hlučný duch.", "Naučíš sa s ním žiť", "Zavoláš exorcistu", "Budeš vyberať vstupné od turistov", "Hlučný duch"],
    d019: ["Zobudíš sa ako upír.", "Prijmeš nočný život", "Hľadáš liek", "Utajíš to a žiješ ďalej", "Čerstvý upír"],
    d020: ["Záhadný list ťa pozýva do kaštieľa na čítanie závetu.", "Ideš sám", "Ideš s priateľom", "Ignoruješ ho", "Čítanie závetu"],
    d021: ["V starom hostinci si posledný hosť, ktorý ešte nespí, a škrípu schody.", "Ideš to preskúmať", "Zamkneš si dvere", "Predstieraš, že spíš", "Vŕzgajúce schody"],
    d022: ["Čarodejnica ti dá jeden elixír zadarmo.", "Elixír lásky", "Elixír pravdy", "Elixír neviditeľnosti", "Elixír zadarmo"],
    d023: ["Môžeš žiť v ktoromkoľvek storočí, bez cesty späť.", "V minulosti", "Tu a teraz", "V ďalekej budúcnosti", "Storočie bez návratu"],
    d024: ["Hovoriaci portrét ponúka rady výmenou za klebety.", "Vymeníš klebety", "Ignoruješ ho", "Otočíš ho k stene", "Hovoriaci portrét"],
    d025: ["Tvoja skupina uviazla v chate a zajtra dôjde jedlo.", "Povedieš útek", "Rozdelíte zásoby a počkáte", "Prehľadáš pivnicu", "Zapadnutá chata"],
    d026: ["Z lesa počuješ vlastný hlas, ako ťa volá menom.", "Odpovieš", "Ideš za ním", "Utečieš na druhú stranu", "Hlas v lese"],
    d027: ["Džin splní jedno želanie, ale musí byť sformulované dokonale.", "Želáš si bohatstvo", "Želáš si viac želaní", "Želáš si džinovu slobodu", "Džinovo želanie"],
    d028: ["Stará hracia skrinka každú noc hrá sama od seba.", "Natiahneš ju sám", "Vyberieš z nej mechanizmus", "Nahráš ju ako dôkaz", "Hracia skrinka"],
    d029: ["Do konca života môžeš jesť iba jedno jedlo.", "Veľkú hostinu", "Obyčajný chlieb a polievku", "Niečo sladké", "Jediné jedlo"],
    d030: ["Nájdeš mapu svojej vlastnej záhrady s vyznačeným X.", "Kopeš ešte dnes v noci", "Kopeš za denného svetla s priateľmi", "Necháš to zakopané", "Zakopaný krížik"],
    d031: ["Priateľ sa ti prizná, že je tajne vlkolak.", "Pomôžeš mu to utajiť", "Za splnu ho zamkneš", "Požiadaš ho, nech ti ukáže premenu", "Priateľ vlkolak"],
    d032: ["Na jeden deň si môžeš vymeniť život s kýmkoľvek pri tomto stole.", "S niekým nebojácnym", "S niekým bohatým", "S niekým záhadným", "Požičaný život"],
    d033: ["Pohrebník ti ponúka zľavu, ak si pohreb naplánuješ vopred.", "Veľkolepý sprievod", "Tichý obrad", "Večierok s tancom", "Predčasný pohreb"],
    d034: ["V tvojom dome ide hodiny dozadu.", "Opravíš ich", "Necháš ich tak", "Pokúsiš sa ich využiť", "Spätné hodiny"],
    d035: ["V meste je cirkus a klaun ti strčí lístok na tajné predstavenie.", "Ideš", "Lístok niekomu daruješ", "Roztrháš ho", "Tajné predstavenie"],
    d036: ["Môžeš hovoriť s jedným druhom zvierat.", "S mačkami", "S vranami", "So psami", "Zvieracia reč"],
    d037: ["Búrka ťa na noc uväzní v majáku so strážcom, ktorý nikdy nespí.", "Ostaneš hore a rozprávaš sa", "Spíš s jedným okom otvoreným", "Vzdoruješ búrke", "Strážca, ktorý nespí"],
    d038: ["Tvoj tieň sa začne hýbať sám od seba.", "Ideš za ním", "Držíš sa svetla", "Spriateliš sa s ním", "Nepokojný tieň"],
    d039: ["Ponúkajú ti nesmrteľnosť, ale toto mesto už nikdy neopustíš.", "Prijmeš", "Odmietneš", "Vypýtaš si väčšie mesto", "Mesto navždy"],
    d040: ["Jedného rána je zapečatená hrobka na cintoríne otvorená.", "Nazrieš dnu", "Povieš to farárovi", "Zatvoríš ju a mlčíš", "Otvorená krypta"],
    d041: ["Jednu z týchto vecí si môžeš nechať navždy.", "Kľúč, ktorý otvorí každé dvere", "Sviečku, ktorá nikdy nezhasne", "Kompas, ktorý ukazuje domov", "Pamiatka"],
    d042: ["Na aukcii sa lacno predáva prekliaty obraz.", "Prihodíš", "Varuješ ostatných dražiteľov", "Odídeš", "Lacný obraz"],
    d043: ["Dedina ťa požiada, aby si strážil most v noci, keď cezeň niečo prejde.", "Budeš strážiť", "Nastražíš pascu", "Nájdeš dôvod, prečo byť preč", "Hliadka na moste"],
    d044: ["Otvoríš koláčik šťastia a v ňom stojí: Never tomu, kto sedí naľavo od teba.", "Uveríš", "Zasmeješ sa", "Ukážeš mu to", "Koláčik šťastia"],
    d045: ["Môžeš znova prežiť jeden deň svojho života.", "Svoj najšťastnejší deň", "Deň, keď napravíš chybu", "Obyčajný, lenivý deň", "Ten deň znova"],
    d046: ["Zrkadlo v starožitníctve ťa ukazuje o desať rokov staršieho.", "Kúpiš ho", "Spýtaš sa, čo ukazuje", "Rýchlo odídeš", "Zrkadlo budúcnosti"],
    d047: ["Na celý život ti pridelia ducha strážcu.", "Rytiera", "Babičku", "Huncútske dieťa", "Duch strážca"],
    d048: ["Hostiteľ večierka zamkol všetky dvere zvonka.", "Hľadáš iný východ", "Bavíš sa ďalej", "Žiadaš vysvetlenie", "Zamknutá párty"],
    d049: ["Môžu si ťa pamätať len pre jednu vec.", "Pre láskavosť", "Pre odvahu", "Pre humor", "Jediná spomienka"],
    d050: ["Na prahu sa ti objaví kniha kúziel.", "Vyskúšaš jedno kúzlo", "Prečítaš ju, ale nič nezačaruješ", "Odnesieš ju do knižnice", "Kniha kúziel"],
    d051: ["Ponúknu ti miesto na lodi, ktorá sa zo svojich plavieb ešte nikdy nevrátila.", "Vyplávaš", "Ostaneš na brehu", "Najprv sa spýtaš posádky", "Loď bez návratu"],
    d052: ["Zistíš, že v susednej dedine žije tvoj dvojník.", "Stretneš sa s ním", "Sleduješ ho z diaľky", "Odsťahuješ sa", "Dvojník z dediny"],
    d053: ["Pri večeri všetky sviečky naraz zmodrejú.", "Ješ ďalej", "Sfúkneš ich", "Spýtaš sa miestnosti, kto je tam", "Modré sviečky"],
    d054: ["Raz môžeš na hodinu zastaviť čas.", "Využiješ to ešte dnes", "Odložíš si to na núdzu", "Prespíš to", "Zastavená hodina"],
    d055: ["Chrlič na katedrále od teba chce hádanku.", "Povieš mu jednu", "Vypýtaš si hádanku od neho", "Tváriš sa, že nepočuješ", "Chrličova hádanka"],
    d056: ["Na tvojom vlastnom pohrebe hrá tvoja obľúbená pieseň. Ktorá?", "Niečo smutné", "Niečo veselé", "Niečo, čo nikto nečaká", "Pieseň na pohreb"],
    d057: ["V strašidelnom meste môžeš mať jediné zamestnanie.", "Pohrebník", "Hostinský", "Nočná hliadka", "Remeslo v strašidelnom meste"],
    d058: ["Priateľ si požičia tvoj kabát a vráti ho s listom od cudzinca vo vrecku.", "Prečítaš list", "Vrátiš mu ho", "Nájdeš cudzinca", "List od cudzinca"],
    d059: ["Vychádza spln a všetky psy v meste začnú zavýjať.", "Zamkneš dvere", "Ideš sa von pozrieť", "Zavýjaš s nimi", "Vytie na mesiac"],
    d060: ["Môžeš sa vzdať jedného zmyslu, aby sa ostatné zostrili.", "Chuti", "Čuchu", "Nikdy, ani jedného", "Vymenený zmysel"],
    d061: ["Pred tebou zastaví koč bez kočiša.", "Nastúpiš", "Hľadáš kočiša", "Ideš ďalej", "Koč bez kočiša"],
    d062: ["Môžeš presne vedieť, čo si o tebe naozaj myslí jeden človek.", "Tvoj najlepší priateľ", "Tvoj rival", "Nikto, ďakujem", "Skutočný názor"],
    d063: ["Priženie sa hustá hmla a mestský zvon odbije trinásť.", "Spočítaš to znova", "Skryješ sa dnu", "Ideš do zvonice", "Trinásty úder"],
    d064: ["Zistíš, že tvoj dom má skrytú miestnosť.", "Hneď ju otvoríš", "Počkáš na denné svetlo", "Prelepíš ju tapetou", "Skrytá izba"],
    d065: ["Potulný obchodník predáva šťastie vo fľašiach.", "Kúpiš si fľašu", "Kúpiš celú debnu", "Vyženieš ho z mesta", "Podomový obchodník"],
    d066: ["Musíš stráviť rok sám v horskom kláštore.", "Vezmeš kopu kníh", "Vezmeš hudobný nástroj", "Vezmeš denník", "Rok v horách"],
    d067: ["Čajové lístky vytvoria meno, ktoré nepoznáš.", "Hľadáš toho človeka", "Vypiješ ďalšiu šálku", "Nikomu nič nepovieš", "Čajové lístky"],
    d068: ["Ako hosť môžeš navštíviť ktorýkoľvek večierok v dejinách.", "Kráľovskú korunováciu", "Divoký maškarný bál", "Legendárny koncert", "Večierok v dejinách"],
    d069: ["Umierajúci muž ti podá kľúč a zašepká: Nikdy ho neotváraj.", "Otvoríš ho", "Necháš si ho navždy", "Zahodíš ho", "Zakázaný kľúč"],
    d070: ["Stôl musí vybrať, kto prvý preskúma kryptu.", "Prihlásiš sa", "Navrhneš niekoho iného", "Navrhneš ťahať slamky", "Prvý do krypty"],
    d071: ["Ponúknu ti miesto pri Smrtinom stole na večeru.", "Zdvorilo prijmeš", "Prinesieš dar", "Vyhovoríš sa", "Večera so Smrťou"],
    d072: ["Stará fotografia ťa ukazuje na večierku spred sto rokov.", "Pátraš po tom", "Zarámuješ ju", "Schováš ju", "Stará fotografia"],
    d073: ["Podľa vôle sa môžeš premeniť na jedno stvorenie.", "Na netopiera", "Na vlka", "Na mačku", "Meňavec"],
    d074: ["Niekto ti každú noc nechá kvety na prahu.", "Ostaneš hore, aby si zistil kto", "Necháš ďakovný lístok", "Prestaneš otvárať dvere", "Kvety pred dverami"],
    d075: ["Počas hororu vypadne kvôli búrke elektrina.", "Rozprávaš strašidelné príbehy", "Ideš spať", "Pri sviečkach zahráš koniec", "Výpadok prúdu"],
    d076: ["Môžeš vrátiť späť jeden vynález v dejinách.", "Budíky", "Mobilné telefóny", "Nič, nech je všetko tak", "Zrušený vynález"],
    d077: ["O polnoci na rázcestí ti cudzinec ponúkne, že naladí tvoju gitaru.", "Podáš mu ju", "Najprv sa spýtaš na cenu", "Odídeš aj s gitarou", "Cudzinec na rázcestí"],
    d078: ["Na jediný rozhovor môžeš niekoho vrátiť.", "Príbuzného", "Slávnu osobnosť", "Priateľa z detstva", "Posledný rozhovor"],
    d079: ["Cez noc sa v kuchynskej podlahe objavia padacie dvere.", "Zídeš dolu", "Zatlčieš ich", "Hodíš dnu mincu a počúvaš", "Padacie dvierka"],
    d080: ["Dohára posledná sviečka a držať ju môže iba jeden z vás.", "Vezmeš si ju", "Ponúkneš ju niekomu inému", "Spoločne ju sfúknete", "Posledná sviečka"],
  },
  guide: {
    missionCardsH: "Karty misií",
    sidesH: "Ďalšie strany a zvraty",
    sides: `<p>Voliteľné, zapínajú sa v lobby (alebo sa pridávajú počítadlami rolí vo vlastných hrách). Mesto vyhrá, až keď zmizne Smrť, Sekta aj Rozparovač.</p>
<ul>
<li><b>Milenci:</b> dvaja náhodní hráči z akejkoľvek strany sa do seba zamilujú. Každý sa dozvie meno toho druhého. Ak jeden zomrie, druhý zomrie od žiaľu. Ak zostanú dvaja poslední živí, vyhrajú spolu.</li>
<li><b>Sekta:</b> Vodca sekty každú noc naverbuje jedného hráča. Naverbovaní si ponechajú rolu, ale vyhrávajú so Sektou, ktorá vyhrá, keď prečísli všetkých ostatných. Smrť, Rozparovača a chránených hráčov naverbovať nemožno.</li>
<li><b>Rozparovač:</b> osamelý vrah, ktorý udrie každú noc. Smrť ho v noci nemôže zabiť (okrem Krvavého mesiaca). Vyhrá, ak zostane posledný na nohách, alebo sám s hráčom, ktorý nie je vrah.</li>
<li><b>Stopy</b> (predvolene zapnuté, zriedkavé): za niektorých úsvitov dostane jeden či dvaja hráči mimo tímu Smrti pravdivú stopu, napríklad „jeden z A a B kráča so Smrťou“.</li>
<li><b>Hod mincou pri rovnosti</b> (voliteľné): rovnosť na čele rozhodne hod mincou namiesto toho, aby boli všetci ušetrení.</li>
<li><b>Verejné hlasovanie</b> (karta pravidla): každý hlas je verejný hneď, ako je odovzdaný.</li>
</ul>`,
    title: 'Ako sa<br><i>hrá.</i>',
    toc: ['Základy', 'Jedno kolo', 'Víťazstvo', 'Základné roly', 'Rozšírené roly', 'Celý balík', 'Sny', 'Karty pravidiel', 'Režimy', 'Nočné poradie', 'Telefóny'],
    basicsH: 'Základy',
    roundH: 'Jedno kolo',
    round: `<ol>
<li><b>Noc 0 — odhalenie.</b> Otoč kartu roly, prečítaj ju, ťukni na <em>Rozumiem</em>. Nič iné sa nedeje: žiadne vraždy, Sny ani schopnosti. Hráči Smrti vidia svojich spoluhráčov.</li>
<li><b>Ráno.</b> Prečítajú sa správy z úsvitu: kto v noci zomrel (nikdy ako, nikdy jeho rola). Čo si sa dozvedel súkromne, nájdeš pod <em>Vieš to len ty</em>. Diplomat tu môže vyhlásiť imunitu; Mstiteľ môže vystreliť.</li>
<li><b>Diskusia a nominácie.</b> Rozprávajte sa. Každý živý hráč môže urobiť <b>jednu oficiálnu nomináciu</b> za deň. Nominovať už nominovaného znamená nomináciu len podporiť.</li>
<li><b>Obhajoba.</b> Každý nominovaný dostane slovo v poradí nominácií.</li>
<li><b>Tajné hlasovanie.</b> Každý oprávnený živý hráč hlasuje na svojom telefóne za jedného nominovaného alebo sa zdrží. Hlas môžeš meniť, kým ho hostiteľ neuzamkne. Zverejňujú sa len súčty.</li>
<li><b>Odsúdenie.</b> Jediný najvyšší súčet je odsúdený (vyradený). <b>Remíza na čele neodsúdi nikoho.</b> Za deň je odsúdený najviac jeden človek.</li>
<li><b>Noc.</b> Obrazovky stmavnú. So Snami trvá súmrak pätnásť sekúnd (bez nich päť): každý otočí svoj Sen a Zlodeji snov môžu meniť. Kto prišiel o sen, uvidí to. Potom sa nočné akcie otvoria samy. Kto má nočnú schopnosť, tajne ju odošle; Smrť sa dohodne na vražde. Keď všetci spia — alebo vyprší čas —, server vyhodnotí všetky akcie naraz a svitne ďalší deň.</li>
</ol>
<p class="small">Čo neodošleš, kým sa okno nezavrie, sa zmení na pas (alebo zdržanie). Odpojený telefón si ponechá miesto aj tajomstvá.</p>`,
    winH: 'Víťazstvo',
    win: `<ul>
<li><b>Nie-Smrť vyhráva</b>, keď nežije žiadny hráč na strane Smrti.</li>
<li><b>Smrť vyhráva</b>, keď živí hráči na strane Smrti <b>prečíslia</b> všetkých ostatných živých. Rovnosť nestačí.</li>
<li><b>Šašo</b> (len Celý balík) vyhrá sám a okamžite, ak ho mesto odsúdi hlasovaním.</li>
<li>Ak po noci nikto neostane nažive, hra končí <b>remízou</b>.</li>
<li>S <b>Hodinami súdneho dňa</b> Smrť vyhrá aj vtedy, ak do konca posledného dňa nikto nevyhral.</li>
<li><b>Krvavý mesiac</b> (predvolene zapnutý): po dvoch nociach za sebou bez smrti nasledujúcu noc nevydrží žiadna ochrana a nič nezablokuje vraždu Smrti. Ukončí to patové situácie, napríklad osamelého Strážcu, ktorý sa stále chráni pred osamelou Smrťou.</li>
<li><b>Pokojný prvý deň</b> (predvolene zapnutý): prvý deň sa len rozpráva. Nikoho nemožno nominovať a nehlasuje sa; prvý rozsudok môže padnúť druhý deň.</li>
<li><b>Psychopat</b>: ako často smie Psychopat niekoho označiť. Raz za hru (predvolené); raz Umlčanie a raz Bez hlasu, v ľubovoľnom poradí; alebo raz každú noc.</li>
<li><b>Smrť vyhrá medzi poslednými dvoma</b> (voliteľné): ak je medzi poslednými dvoma živými Smrť, Smrť okamžite vyhrá.</li>
</ul>
<p>Víťazstvo sa kontroluje po každom úplnom vyhodnotení — nikdy uprostred noci.</p>`,
    coreH: 'Základné roly',
    coreP: 'Vždy v hre.',
    killH: 'Ako zabíja tím Smrti',
    kill: 'Všetci živí spoluhráči Smrti zdieľajú jednu miestnosť. Každý navrhuje ciele; vražda sa stane, len ak <b>všetci potvrdia presne rovnaký výber</b>. Pri akomkoľvek nesúhlase alebo chýbajúcom potvrdení Smrť pasuje. Tím zabije <b>jedného</b> hráča za noc bez ohľadu na počet Smrtí — dvoch s Dvojitým nebezpečenstvom, Nočnou zmenou alebo Náporom sily, nikdy viac ako dvoch.',
    extH: 'Rozšírené roly — Štandard',
    extP: 'Od 7 hráčov sa ďalšie miesta obsadia z tohto zásobníka (tajne ťahané). 7 hráčov → 1 rozšírené miesto, 10 → 2, 11+ → 3.',
    fullH: 'Doplnky Celého balíka',
    fullP: 'Len v režime Celý balík / Chaos alebo Vlastné. Pre skúsené skupiny.',
    dreamsH: 'Sny',
    dreamsP: 'Od noci 1 si každý živý hráč každú noc náhodne potiahne kartu Snu (môžu sa opakovať). Platí len tú noc. Svoj sen môžeš opísať — pravdivo alebo nie.',
    dreamsNote: `Niektoré Sny sú zriedkavejšie ako iné a Nespavosť sa v hre objaví najviac dvakrát; v režime Vlastné sa dá častosť každého Snu nastaviť. Výmeny Zlodejov snov prebehnú počas súmraku, pred otvorením akcií, v poradí miest, každý raz. Platí karta, ktorú držíš nakoniec.`,
    rulesH: 'Karty pravidiel',
    rulesP: '1–3 sa pri príprave ťahajú (alebo vyberú) a platia celú hru. Niektoré sa dajú dodržiavať len na čestné slovo, keď hráte v jednej miestnosti.',
    countsH: 'Počty rol',
    countsTh: ['Hráči', 'Smrť', 'Nevinný', 'Strážca · Mentalista · Psychopat', 'Rozšírené'],
    modesNote: 'Klasika / Učenie obsadí rozšírené miesta Nevinnými. Hra v jednej miestnosti či na diaľku je len otázka prenosu, nie iná hra: na diaľku pribudne stolový chat (a pri Hmle vojny šepot so susedmi).',
    orderH: 'Kto koho porazí v noci',
    order: `<p>Všetci odosielajú naraz; server potom vyhodnocuje v pevnom poradí, takže výsledok nikdy nezávisí od toho, kto ťukol skôr.</p>
<ol>
<li><b>Potlačenie.</b> Bardovo ticho zruší všetky schopnosti rol. Spánková paralýza zastaví svojho držiteľa — a aktívna Smrť s ňou zastaví celú vraždu. Nespoľahlivá moc hádže kockami.</li>
<li><b>Kliatby a návštevy.</b> Kliatba čarodejnice zmarí akciu cieľa (alebo celú vraždu Smrti). Pobehlica, ktorá navštívi aktívnu Smrť, zníži vraždu na nulu.</li>
<li><b>Premeny.</b> Najprv prísaha Dvojitého agenta, potom kópia Napodobňovača. Pre Mentalistu platia už dnes, no noví členovia Smrti zabíjajú až od ďalšej noci.</li>
<li><b>Vražda Smrti.</b> Cieľ prežije, ak má v tomto poradí: dočasné vzkriesenie, Anjela strážneho, Požehnanie, štít Strážcu, správnu predpoveď Orákula. Inak čepeľ schytá Osobný strážca — inak cieľ zomrie.</li>
<li><b>Psychopat.</b> Značka platí, okrem prípadu, že je cieľ mŕtvy alebo chránený (vzkriesenie, Anjel, Požehnanie, Strážca).</li>
<li><b>Bomby a zvyšok.</b> Bomba je férový hod mincou; Strážca ju nezastaví. Navštevujúce Pobehlice zasiahne výbuch. Čítania, doručenia, stávky.</li>
<li><b>Nekromant</b> vzkriesi mŕtvych — len ak sám noc prežil.</li>
<li><b>Prepojené osudy.</b> Pobehlice zomrú s navštívenou obeťou Smrti; držitelia Spoločnej nočnej mory a Námesačnosti zomrú s partnerom. Prepojenej smrti zabráni len vzkriesenie alebo Anjel strážny. Potom vyprší požičaný čas.</li>
<li><b>Úsvit.</b> Preživší dostanú súkromné správy. Verejnosť sa dozvie len to, kto zomrel.</li>
</ol>`,
    kicker: "Kniha pravidiel",
    intro: "Dead Set je rodina spoločenských hier pre jednu miestnosť. Každý hrá na vlastnom telefóne; televízor, ak ho máte, je spoločné javisko. Vyberte si hru, prečítajte si jej kapitolu a hrajte.",
    aboutH: "Čo je Dead Set",
    about: `<p>Dead Set je zbierka spoločenských hier (skryté roly, blafovanie, slovné hry, predpovede), ktoré zdieľajú jeden stôl. Každá hra funguje rovnako: <b>telefón každého hráča je súkromná obrazovka</b>, ktorá ukazuje len to, čo smie vedieť, a aplikácia je rozprávač, takže nikto nemusí vynechať, aby hru viedol.</p>
<ul>
<li><b>Bez inštalácie.</b> Beží v prehliadači. Pripojíte sa šesťmiestnym kódom, odkazom alebo QR kódom.</li>
<li><b>3 až 25 hráčov</b>, podľa hry. Každá kapitola uvádza počet hráčov a dĺžku.</li>
<li><b>Televízor je voliteľný, ale najlepší.</b> Ukazuje stôl, scény, body a hrá hudbu. Nikdy neukáže tajomstvo.</li>
<li><b>Sedem jazykov.</b> Každý si vyberie svoj; slovné hry používajú na všetkých telefónoch jazyk stola, aby sa slová zhodovali.</li>
<li><b>Jeden stôl, veľa hier.</b> Medzi kolami môžete v lobby zmeniť hru; v rámci zápasu sa body prenášajú.</li>
</ul>`,
    tableH: "Otvorenie stola",
    table: `<ol>
<li><b>Otvoriť stôl.</b> Hostiteľ ťukne na <em>Otvoriť stôl</em>, zadá meno a dostane šesťmiestny kód miestnosti.</li>
<li><b>Pozvanie.</b> Pošlite kód, odkaz alebo QR kód. Ostatní ťuknú na <em>Pridať sa k stolu</em> (alebo otvoria odkaz), zadajú meno a vyberú si portrét.</li>
<li><b>Zapnite televízor.</b> Ťuknite v lobby na <em>TV tabuľa</em>, alebo otvorte miestnosť v prehliadači televízora a zvoľte <em>Otvoriť stôl na TV</em>. Stôl môže naraz ukazovať viac obrazoviek.</li>
<li><b>Miesta.</b> Hráči sedia okolo stola v poradí, v akom sa pripojili. Hostiteľ môže ťuknúť na miesto a hráča presunúť alebo odstrániť.</li>
</ol>
<p>Tvoje miesto je viazané na tvoj prehliadač. Ak telefón zlyhá, hostiteľ ti v menu miestnosti dá jednorazový kód na obnovenie; na novom telefóne zvoľ <em>Obnoviť moje miesto</em>, zadaj ho a tvoje miesto (aj s tajomstvami) sa presunie. Telefón, ktorý vypadne, si miesto ponechá a po návrate dobehne ostatných.</p>
<p>Ak chce niekto hru viesť a vidieť všetko, otvorte miestnosť s <b>dôveryhodným moderátorom</b>. Moderátor nemá miesto pri stole a všetci sú o tom informovaní.</p>`,
    setupH: "Nastavenie hry",
    setup: `<p>Lobby prevedie hostiteľa pri každej hre rovnakými očíslovanými krokmi. Hostia vidia tie isté kroky, len na čítanie.</p>
<ol>
<li><b>Hra.</b> Vyberte si jednu, zoradené podľa rodín: Skryté vernosti, Karty z ruky do ruky, Čítanie ľudí, Znamenia a hádanky, Blaf a stávka.</li>
<li><b>Ako to funguje.</b> Štyri alebo päť ilustrovaných krokov: celá hra na prvý pohľad.</li>
<li><b>Balík.</b> Čo sa pri tomto počte hráčov rozdá: roly, masky, karty alebo miesta. Mení sa, keď sa hráči pripájajú.</li>
<li><b>Pravidlá.</b> Vlastné prepínače hry. Predvolené nastavenia dajú dobrú prvú hru.</li>
<li><b>Stôl.</b> Jazyk stola, hudba a jej štýl, pozadia a (kde to niečo mení) či hráte v jednej miestnosti, alebo na diaľku s chatom.</li>
<li><b>Časovače.</b> Ako dlho trvá každý krok. Zbalené; predvolené hodnoty vyhovujú väčšine stolov.</li>
</ol>
<p>Keď si nastavenie prečítajú, všetci ťuknú na <b>Pripravený</b> a hostiteľ hru spustí. Problém s nastavením (napríklad málo hráčov na nejakú rolu) sa zobrazí ako poznámka pod krokmi.</p>`,
    playH: "Ako sa hrá každá hra",
    play: `<ul>
<li><b>Nikdy neukazuj svoju obrazovku.</b> Tvoj telefón ukazuje tvoju rolu, karty a voľby. Všetko ostatné sa hovorí nahlas alebo ukazuje na televízore.</li>
<li><b>Spoločné scény.</b> Veľké chvíle (odhalenie, sčítanie hlasov, noc) bežia na všetkých telefónoch aj na televízore naraz a rovnako dlho. Nedajú sa preskočiť a počas nich nebeží časovač.</li>
<li><b>Výber hráča:</b> ťukni na jeho miesto v kruhu stola. Miesto, ktoré môžeš vybrať, pulzuje; tvoja voľba zbelie ako pergamen.</li>
<li><b>Potvrdenie:</b> súkromná voľba (hlas, karta zahraná lícom dolu, predpoveď) je <b>ťuknutie</b> a dá sa zmeniť do konca kroku. <b>Podržanie</b> je len pre verejné ťahy, ktoré sa nedajú vziať späť, a tlačidlo to vždy povie: drž prst, kým sa zlatá výplň nedokončí.</li>
<li><b>Hlavička</b> ukazuje aktuálny krok hry a jeho číslo (Noc II, Misia 3, Kolo 4…) so zostávajúcim časom.</li>
<li><b>Pod stolom:</b> <em>Moja karta</em> (tvoja rola, kedykoľvek), prehľad hry, tvoje súkromné <em>Poznámky</em> a <em>Príbeh</em>, ak ich hra má.</li>
<li><b>Časovače.</b> Keď vyprší čas, hra koná za každého, kto ešte nekonal: väčšinou pas alebo zdržanie sa, ale niektoré hry volia za teba (Rakvy napríklad zakopú náhodnú rakvu). Hostiteľ môže v menu miestnosti pridať 30 sekúnd, pokračovať alebo hru ukončiť.</li>
<li><b>Upozornenia</b> na to, čo práve urobili ostatní, sa na chvíľu zobrazia v hlavičke.</li>
<li><b>Čestné pravidlá.</b> Niektoré pravidlá (mlčanie, umlčaní hráči) vie dodržať len samotný stôl. Pri hre na diaľku ich vynúti chat.</li>
</ul>`,
    afterH: "Po hre",
    after: `<p>Záverečná obrazovka vyhlási víťazov, odhalí každé tajomstvo a vo väčšine hier prehrá, čo sa naozaj stalo. Prelistuj si rekapituláciu vlastným tempom.</p>
<p>Mnohé hry sa hrajú ako <b>zápas</b> z 1, 3 alebo 5 hier: body sa prenášajú a stôl sa vráti do tej istej lobby s rovnakým nastavením, všetci pripravení na ďalšiu hru. V lobby môže hostiteľ prepnúť aj na inú hru; stôl, miesta aj portréty zostávajú.</p>`,
    hSetup: "Príprava",
    hCast: "Postavy",
    hLoop: "Priebeh hry",
    hWin: "Víťazstvo a body",
    hOpts: "Možnosti v lobby",
    classicP: "Pôvodný Dead Set: skryté roly, nočné vraždy a tajné hlasovanie cez deň. Väčšina z vás chce prežiť. Niekoľkí z vás sú Smrť. Nikto nevie, kto je kto — okrem Smrti, ktorá pozná svojich spoluhráčov.",
    presetsH: "Varianty",
    modesTh: ['Variant', 'Hráči', 'Čo sa mení'],
    classicSetup: `<p>5–13 hráčov (s vlastným balíkom až 25). Každý dostane tajnú <b>rolu</b>. Väčšina rol patrí na stranu <b>ne-Smrti</b>; jeden alebo viac hráčov je tajne <b>Smrť</b> a hráči Smrti sa navzájom poznajú. Noc a deň sa striedajú, kým jedna strana nevyhrá.</p>
<ul>
<li><b>Roly</b> sú to, kým si celú hru: tvoja strana a tvoja schopnosť.</li>
<li><b>Sny</b> sú účinky na jednu noc: od 1. noci si každý živý hráč každú noc tajne potiahne jeden.</li>
<li><b>Karty pravidiel</b> (1–3, ťahané pri nastavení) ohýbajú celú hru: dvojité vraždy, vážené hlasy, duchovia, ktorí hlasujú.</li>
<li><b>Príbeh</b> (KTO / KDE / PREČO) je čisté rozprávanie. Nikdy nemení pravidlo.</li>
</ul>
<p>O svojej role môžeš hovoriť pravdu, klamať alebo mlčať. Hostiteľ hrá ako ostatní a nevidí viac tajomstiev.</p>`,
    missionsSetup: `<p>5–12 hráčov. Nikto nezomiera: Smrť sa votrela do výpravy a stôl ju musí nájsť skôr, než ona nájde Médium. Každý dostane tajnú rolu. Hráči Smrti sa vidia (okrem Tuláka); Živí poznajú len seba a Médium vycíti, kto je Smrť.</p>
<p>Stôl hrá päť misií. Každá misia potrebuje tím danej veľkosti (v lobby a na televízore); od 7 hráčov potrebuje 4. misia na neúspech dve Sabotáže.</p>`,
    missionsLoop: `<ol>
<li><b>Karta misie.</b> Každá misia začína kartou. Väčšina je bežných; občas niektorá zmení tím, hlasovanie alebo odhalenie tejto misie.</li>
<li><b>Návrh.</b> Vodca misie (drží lampáš) ťuká na hráčov v kruhu a zostavuje tím.</li>
<li><b>Hlasovanie o tíme.</b> Všetci tajne ťuknú na Schváliť alebo Zamietnuť. Hlasy sa otočia naraz, s menami. Väčšina tím vyšle; inak lampáš prejde na ďalšieho hráča. Piaty návrh misie platí bez ohľadu na hlasovanie.</li>
<li><b>Misia.</b> Každý člen tímu zahrá kartu lícom dolu. Živí môžu hrať len Úspech; Smrť môže hrať Úspech alebo Sabotáž. Karty sa zamiešajú a otáčajú po jednej: jedna Sabotáž misiu zmarí.</li>
<li><b>Nočná medzihra.</b> Každý si zaznamená tajné Podozrenie, kto je Smrť. Po 2., 3. a 4. misii sa držiteľ Sviečky dozvie stranu jedného hráča a Sviečka prejde k nemu. So Stopami môže na úsvite prísť pravdivá nápoveda.</li>
</ol>`,
    missionsWin: `<ul>
<li><b>Tri úspechy:</b> Smrť sa odhalí a Žnec určí, koho považuje za Médium (Smrť sa môže najprv poradiť). Správne: vyhráva Smrť. Nesprávne: vyhrávajú Živí.</li>
<li><b>Tri neúspechy:</b> Posledný odpor. Každý označí jedného hráča. Ak stôl označí Živého, vyhráva Smrť; ak chytí Smrť, Žnec aj tak dostane Zúčtovanie: nájde Médium a Smrť ukradne víťazstvo.</li>
<li><b>Vedľajšie misie</b> menia váhu tvojho hlasu v Poslednom odpore: dvojnásobnú, ak si svoju splnil, polovičnú, ak nie.</li>
<li>Šašo, ak je v hre, vyhrá sám, ak ho označia v Poslednom odpore alebo Žnec.</li>
</ul>`,
    missionsOpts: `<ul>
<li><b>Roly:</b> zapnúť alebo vypnúť Veriaceho, Šarlatána, Zahaleného, Tuláka, Hrobára a Šaša, a pridať Dvojčatá.</li>
<li><b>Vedľajšie misie:</b> tajný osobný cieľ pre každého.</li>
<li><b>Ďalší vodca misie:</b> ďalší v poradí, alebo ho vyberie posledný vodca.</li>
<li><b>Karty misií:</b> vypnuté, zriedka alebo niekedy.</li>
<li><b>Stopy:</b> zriedka, občas alebo často.</li>
<li><b>Príbeh:</b> náhodné KTO / KDE / PREČO, alebo váš vlastný.</li>
</ul>`,
    exorcismSetup: `<p>3–12 hráčov, 5–10 minút na kolo. Živí poznajú tajné heslo, ktoré by vyhnalo Démona skrytého medzi nimi; Démon ho nepozná. Všetci vidia kategóriu. Slová sa na všetkých telefónoch zobrazujú v jazyku stola, aby sa zhodovali.</p>`,
    exorcismLoop: `<ol>
<li><b>Krištáľová guľa.</b> Ťukni na ňu a pozri sa dnu: kategória a (ak si Živý) heslo. Démon vidí len kategóriu a musí blafovať.</li>
<li><b>Losovanie.</b> Žreb určí, kto hovorí prvý; potom ide ťah okolo stola podľa poradia miest.</li>
<li><b>Každý jedno slovo.</b> Vo svojom ťahu povedz jedno slovo spojené s heslom a potom podrž tlačidlo na telefóne. Dokáž, že ho poznáš, bez toho, aby si ho prezradil Démonovi. Podľa lobby idú slová dookola raz alebo viackrát a môžu sa aj písať a ukazovať na televízore.</li>
<li><b>Označte Démona.</b> Poraďte sa a potom všetci hlasujú za jedného hráča.</li>
<li><b>Posledný pokus.</b> Chytený Démon môže povedať heslo, z mriežky slov alebo napísané.</li>
</ol>`,
    exorcismWin: `<ul>
<li>Hlasovanie označí Živého alebo skončí nerozhodne (ak nerozhoduje minca): <b>vyhráva Démon</b>.</li>
<li>Hlasovanie označí Démona: <b>vyhrávajú Živí</b>, pokiaľ potom Démon neuhádne heslo a neukradne víťazstvo.</li>
<li>Body sa zbierajú kolo za kolom: každý Živý +1 za výhru, každý Démon +2.</li>
</ul>`,
    exorcismOpts: `<ul>
<li><b>Démoni:</b> jeden, alebo od 7 hráčov dvaja; dvaja Démoni sa môžu, ale nemusia poznať.</li>
<li><b>Posledný pokus:</b> zapnutý alebo vypnutý.</li>
<li><b>Nerozhodné hlasovanie:</b> Démon unikne, alebo rozhodne minca.</li>
<li><b>Mriežka slov:</b> 16 slov na televízore aj telefónoch; heslo je jedno z nich.</li>
<li><b>Kolá:</b> koľkokrát idú slová okolo stola. <b>Písať slová:</b> zobrazia sa na televízore.</li>
<li><b>Kategórie:</b> z ktorých zoznamov slov sa ťahá.</li>
</ul>`,
    coffinsSetup: `<p>3–10 hráčov, rýchla hra. Každý hrá sám za seba a má štyri rakvy: tri Zlaté a jednu Kliatbu (v dlhšej možnosti päť: štyri Zlaté, jedna Kliatba). Tvoje rakvy sú pred ostatnými skryté.</p>`,
    coffinsLoop: `<ol>
<li><b>Pochovávanie.</b> Všetci naraz tajne zakopú jednu rakvu: ťukni na rakvu a potom na Zakopať. Tvoj hrob je kôpka, najnovšia navrchu.</li>
<li><b>Zakopať, alebo vyzvať.</b> Od prvého hráča kola vo svojom ťahu buď zakopeš ďalšiu rakvu navrch svojej kôpky, alebo vyzveš: „Otvorím N“, najviac toľko, koľko je spolu zakopaných.</li>
<li><b>Prihadzovanie.</b> Dookola sa číslo zvyšuje, alebo sa pasuje. Pas platí na celé kolo. Posledný, kto zostane, je Kopáč.</li>
<li><b>Kopanie.</b> Kopáč najprv otvára vlastné rakvy zhora nadol, potom vyberá iné hroby, vždy vrchnú rakvu, kým nie je otvorených N rakiev. Každá rakva sa otočí na televízore.</li>
<li><b>Výsledok.</b> Samé Zlato: čisté kopanie a tvoj náhrobok sa pozlatí. Kliatba vo vlastnom hrobe: vyberieš rakvu, o ktorú prídeš. Kliatba niekoho iného: naslepo si potiahne jednu z tvojich rakiev a tá zmizne; majiteľ Kliatby začína ďalšie kolo.</li>
</ol>`,
    coffinsWin: `<ul>
<li>Vyhráš dvoma čistými kopaniami (v lobby 1 alebo 3), alebo ako posledný hráč s rakvami.</li>
<li>V zápase: víťaz +3, každé čisté kopanie +1, každé vstanie z mŕtvych +1.</li>
</ul>`,
    coffinsOpts: `<ul>
<li><b>Rakva Smrti</b> (predvolene zapnutá): v každom kole ju drží skrytý hráč namiesto jednej Zlatej. Ak ju vykopeš, kopanie zlyhá; jej držiteľ ti ukradne rakvu, ktorá sa zmení na Zlatú.</li>
<li><b>Stávky duchov a Navrátilci</b> (predvolene zapnuté): hráči bez rakiev pri každom kopaní stavia na Zlato alebo Kliatbu; trikrát správne a vstanú s jednou Zlatou rakvou.</li>
<li><b>Relikvie</b> (predvolene vypnuté): tajný Lampáš (nazrieť do hrobu), Kľúč (otvoriť iný hrob pred vlastným) alebo Ochrana (kliatba nič nestojí), každá raz.</li>
<li><b>Čisté kopania na výhru, rakvy na hráča, hier v zápase.</b></li>
</ul>`,
    carnivalSetup: `<p>4–12 hráčov. Každý hrá sám za seba. Každá maska je známa rola Dead Set a má schopnosť. Každý začína so 6 Dušami; Obeta, tanier uprostred stola, je na začiatku prázdna. Pri 4–5 hráčoch sedia dve masky navyše na prázdnych stoličkách: sú na bále, ale nikdy nekonajú.</p>
<p><b>Odmaskovanie:</b> na pár sekúnd je každá maska ukázaná lícom hore, na televízore aj na každom telefóne. Zapamätajte si ich; potom sa otočia. Žreb vyberie prvého tanečníka a pokračuje sa v smere hodinových ručičiek.</p>`,
    carnivalLoop: `<p>Vo svojom ťahu urobíš jedno z troch:</p>
<ul>
<li><b>Vymeniť alebo predstierať.</b> Vyber inú masku (hráča alebo prázdnu stoličku) a podrž Vymeniť alebo Predstieranie. Obe tlačidlá vyzerajú rovnako a nikto, ani druhý hráč, sa nedozvie, čo si zvolil.</li>
<li><b>Nazrieť.</b> Na chvíľu sa pozrieš na vlastnú masku. Všetci vidia, že si sa pozrel.</li>
<li><b>Ohlásiť.</b> Pomenuješ masku, „Som Sudca“, a použiješ jej schopnosť.</li>
</ul>
<p><b>Výzvy.</b> Keď niekto ohlási masku, každý iný telefón sa spýta: <em>Je to tvoja maska?</em> Ak nikto nevyzve, ohlásenie platí a schopnosť funguje, nech ohlasovateľ nosí čokoľvek. Ak niekto vyzve, ohlasovateľ a všetci vyzývatelia odhalia masky: kto ju naozaj nosí, použije schopnosť, ostatní odhalení zaplatia Dušu (alebo viac, podľa lobby) do Obety.</p>
<p><b>Úvodný tanec.</b> Prvý ťah každého hráča (dva, ak hostiteľ chce) musí byť Vymeniť alebo predstierať, aby boli masky pochybné skôr, než niekto niečo ohlási.</p>`,
    carnivalWin: `<ul>
<li><b>Plný mešec:</b> 13 Duší (alebo číslo z lobby) a hneď vyhrávaš.</li>
<li><b>Žatva Smrti:</b> vyhrá, kto ohláseniami Smrti zožal 6 Duší.</li>
<li><b>Krach:</b> keď niekto klesne na 0 Duší, vyhráva najbohatší (pri rovnosti vyššia žatva).</li>
<li>V zápase: víťaz +3, všetci ostatní +1 za každú Dušu nad 6.</li>
</ul>`,
    carnivalOpts: `<ul>
<li><b>Masky:</b> odporúčaná sada rastie so stolom; alebo si zostavte vlastnú, jednu masku na miesto (Smrť je povinná; opakovať sa môže len Nevinný).</li>
<li><b>Plný mešec, Žatva Smrti, trest za chybné ohlásenie, úvodný tanec, hier v zápase.</b></li>
<li><b>Poznámky (denník z bálu):</b> predvolene vypnuté, aby ste si videné pamätali v hlave.</li>
</ul>
<p>Kedykoľvek ťukni na <em>Masky na bále</em>: každá maska v hre a jej schopnosť, nakreslená ako rad znamení.</p>`,
    midnightSetup: `<p>4–12 hráčov, asi 10 minút. Jedna noc, jedno hlasovanie, žiadna druhá šanca. Balík má jednu kartu na hráča a tri lícom dolu na stole (prázdne stoličky). Balík je verejný; kto čo drží, nie. Každý vidí svoju kartu raz, pri rozdávaní.</p>
<p>Karty v tme menia majiteľov. <b>Na úsvite si tou kartou, ktorá leží pred tebou</b>, nie tou, ktorú si dostal.</p>`,
    midnightLoop: `<ol>
<li><b>Rozdávanie.</b> Raz sa pozrieš na svoju kartu.</li>
<li><b>Noc.</b> Telefóny budia roly postupne: Napodobňovač, Smrť, Sprisahanec, Dvojčatá, Mentalista, Dvojitý agent, Čarodejnica, Hazardný hráč, Nespavec. Každý krok trvá rovnako, 10 sekúnd, a beží aj vtedy, keď jeho karta leží na stole, aby noc nič neprezradila. Ovládanie dostane len ten, kto tú kartu dostal; každý iný telefón hovorí, nech máš zavreté oči. Hazardný hráč, ktorý nič neurobí, sa vymení s náhodnou kartou zo stola.</li>
<li><b>Deň.</b> Jedna diskusia (predvolene 5 minút): tvrďte, obviňujte, klamte. Karty sa mohli presunúť; neverte nikomu, ani sebe. Hostiteľ môže hlasovanie otvoriť skôr.</li>
<li><b>Hlasovanie.</b> Všetci naraz ukážu na iného hráča. Kto má najviac hlasov, zomiera, ak sú to aspoň dva; pri rovnosti na vrchole zomrú všetci zhodní. Ak zomrie Mstiteľ, zomrie aj ten, na koho ukázal.</li>
</ol>`,
    midnightWin: `<ul>
<li>Strany sa určujú podľa kariet na úsvite (Napodobňovač sa počíta ako rola, ktorú skopíroval).</li>
<li><b>Živí</b> vyhrávajú, ak zomrie aspoň jedna Smrť; ak medzi hráčmi nie je Smrť, ak nezomrie nikto.</li>
<li><b>Smrť a Sprisahanec</b> vyhrávajú, ak nezomrie žiadna Smrť (a nezomrel Šašo).</li>
<li><b>Šašo</b> vyhrá sám, ak ho vyhlasujú. Viac strán môže vyhrať spolu.</li>
<li>V zápase: každý víťaz +1, Šašo +2. Záverečná obrazovka ukáže každú kartu, ako bola rozdaná aj na úsvite, a prehrá noc.</li>
</ul>`,
    midnightOpts: `<ul>
<li><b>Karty:</b> odporúčaný balík rastie so stolom; alebo si ich vyberte sami (Smrť 1–2, Dvojčatá 0 alebo 2, Nevinný 0–4, ostatné 0–1; spolu hráči + 3).</li>
<li><b>Osamelá Smrť nazrie:</b> Smrť, ktorá sa zobudí sama, môže pozrieť jednu kartu zo stola.</li>
<li><b>Dĺžka diskusie, hier v zápase.</b></li>
</ul>`,
    seanceSetup: `<p>4–10 hráčov, asi 30 minút. Kooperatívna vražedná záhada so zradcom. Jeden hráč je Duch: vie, kto ho zabil, kde a prečo, a nemôže hovoriť. Všetci ostatní sú Médiá, ktoré čítajú jeho vízie. Od piatich hráčov sa medzi Médiami môže skrývať Klamár: druhý duch, ktorý pozná pravdu a pracuje proti stolu.</p>
<p><b>Tabuľa:</b> tri rady kariet príbehu, KTO, KDE a PREČO. V každom rade je jedna karta pravda.</p>`,
    seanceLoop: `<ol>
<li><b>Vízie.</b> V každom kole dostane každé Médium jeden rad. Duch mu zo svojej ruky vyberie víziu: kartu s dvoma alebo tromi rytými motívmi, ktorá má ukázať na pravdu v tom rade.</li>
<li><b>Odhalenie.</b> Vízie sa otočia pre všetkých. Opíšte ich, hádajte sa, presviedčajte. Duch mlčí, ale môže víziu zamraziť studeným miestom: <em>táto nie je moja</em>.</li>
<li><b>Klamárova výmena.</b> Niekoľkokrát za hru Klamár tajne vymení víziu iného Média za jednu zo svojich lží.</li>
<li><b>Sviečky.</b> Každé Médium zapáli sviečku na karte vo svojom rade, alebo ju podrží. Karta s najviac sviečkami ide pred ducha. Správne: rad je vyriešený. Nesprávne: karta sa preškrtne.</li>
<li><b>Hodiny.</b> Každé kolo zhorí jedna sviečka hodín seansy (sedem pri štandardnej obtiažnosti).</li>
</ol>`,
    seanceWin: `<ul>
<li>Vyriešte všetky tri rady, kým sviečky nedohoria, a potom označte Klamára. Správne: <b>úplné víťazstvo</b>. Nesprávne: <b>prázdne víťazstvo</b>, o ktoré sa delí aj Klamár.</li>
<li>Ak hodiny dohoria, vyhráva Klamár (bez Klamára stôl prehráva). Ak zostal jeden rad, najprv na ňom každý zapáli sviečku posledného výdychu.</li>
<li>V zápase: úplné víťazstvo +2 pre Ducha a každé Médium; prázdne +1 pre každého a +1 pre Klamára; výhra Klamára +3.</li>
<li>Záverečná obrazovka prehrá každé kolo: pravé vízie, výmeny a sviečky.</li>
</ul>`,
    seanceOpts: `<ul>
<li><b>Obtiažnosť:</b> koľko kariet v rade, vízií na Médium a sviečok na hodinách.</li>
<li><b>Klamári:</b> žiadny, jeden alebo dvaja, a či sa dvaja poznajú; koľko výmen majú.</li>
<li><b>Studené miesta Ducha:</b> koľko vízií smie zamraziť.</li>
<li><b>Posledný výdych:</b> zapnutý alebo vypnutý. <b>Duch:</b> žrebom, alebo ho vyberie hostiteľ. <b>Hier v zápase.</b></li>
</ul>`,
    graveSetup: `<p>4–12 hráčov, asi 15 minút. Dve partie vykrádačov hrobov, Mesiac a Slnko, kopú na cintoríne s 25 náhrobkami relikvie, ktoré privolajú ich božstvo. Minca určí partiu, ktorá kope prvá: tá má v zemi 9 relikvií, druhá 8. Sedem hrobov je prázdnych a jeden patrí Smrti.</p>
<p>Každá partia má <b>Hrobára</b>, jediného hráča, ktorý vidí pohrebný register: čo leží pod každým kameňom. Všetci ostatní kopú. Náhrobky ukazujú slová v jazyku stola alebo ceruzkové ikony.</p>`,
    graveLoop: `<ol>
<li><b>Znamenie.</b> V ťahu svojej partie dá Hrobár jedno slovo a jedno číslo, „Oceán · 3“: slovo, ktoré spája niekoľko hrobov jeho partie, a koľko ich je. Slovo nesmie byť na tabuli. Potom už nič nepovie.</li>
<li><b>Kopanie.</b> Kopáči sa poradia a hlasujú na telefónoch; hrob s najviac hlasmi sa vykope (pri rovnosti rozhodne minca).</li>
<li><b>Čo leží pod ním.</b> Relikvia vašej partie: kopte ďalej, až po číslo. Prázdny hrob alebo relikvia druhej partie (teraz patrí jej): ťah prechádza ďalej. Hrob Smrti: vaša partia okamžite prehráva.</li>
<li><b>Zastavenie.</b> Partia môže odhlasovať, že prestane. Kto prestane pred dosiahnutím čísla, ponechá si jedno bonusové kopanie na ďalší ťah (nikdy sa nesčítava).</li>
</ol>
<p>Na telefóne prepínaj medzi <em>Kamene</em> (slová alebo ikony) a <em>Mapa</em> (tabuľa na prvý pohľad).</p>
<p><b>Tri partie</b> (6–12 hráčov): Mesiac, Slnko a Hviezdy, každá tretina stola. Prvá partia skrýva 7 relikvií, ostatné po 6, s 5 prázdnymi hrobmi. Hrob Smrti vyradí partiu z hry; ostatné kopú ďalej, a keď zostane jedna partia, vyhráva.</p>`,
    graveWin: `<ul>
<li>Vyhráva prvá partia, ktorej sú vykopané všetky relikvie, aj keď niektoré omylom vykopala druhá partia.</li>
<li>Partia, ktorá otvorí hrob Smrti, okamžite prehráva (pri troch partiách vypadáva).</li>
<li>V zápase z 1, 3 alebo 5 hier: každá výhra +1. Hrobári sa medzi hrami striedajú.</li>
</ul>`,
    graveOpts: `<ul>
<li><b>Počet partií:</b> dve, alebo od 6 hráčov tri.</li>
<li><b>Na hroboch:</b> slová alebo ikony; <b>slávne mená</b> (filmy, hrdinovia, pamiatky) zapnuté alebo vypnuté.</li>
<li><b>Partie:</b> podľa miest (presunom hráčov okolo stola meníte partiu) alebo náhodne. <b>Hrobári:</b> striedaví, náhodní alebo vybraní.</li>
<li><b>Znamenia:</b> písané (slovo sa zobrazí na každej obrazovke) alebo vyslovené (nahlas, číslo sa ťukne). <b>Hier v zápase.</b></li>
</ul>`,
    mimicSetup: `<p>4–12 hráčov, asi 8 minút na hru. Všetci zdieľajú jedno tajné miesto, kartu príbehu, a hrajú tam postavu, okrem Napodobňovača, ktorý vidí len šum a tabuľu možných miest. Živí musia nájsť Napodobňovača; Napodobňovač musí prísť na miesto.</p>`,
    mimicLoop: `<ol>
<li><b>Otázky.</b> Kto drží lampáš, nahlas sa niekoho spýta na miesto a potom ťukne na toho, koho sa pýtal; lampáš prejde k nemu a on sa pýta ďalší. Nikdy sa nepýtaj späť toho, kto sa práve pýtal teba. Odpovedaj tak, aby ťa Živí spoznali, ale Napodobňovač sa nedozvedel miesto.</li>
<li><b>Obvinenie.</b> Raz za hru môže každý obviniť hráča. Hodiny sa zastavia; všetci ostatní hlasujú Súhlasím alebo Nesúhlasím. Odsúdi len jednomyseľný stôl; inak hodiny bežia ďalej.</li>
<li><b>Napodobňovač sa odhalí.</b> Kedykoľvek sa Napodobňovač môže odhaliť a povedať miesto.</li>
<li><b>Čas vypršal.</b> Keď hodiny dobehnú (predvolene 8 minút), všetci ukážu na jedného podozrivého. Kto má najviac hlasov, je odsúdený; pri rovnosti Napodobňovač unikne.</li>
</ol>
<p>Počas počúvania si na telefóne škrtaj miesta: tvoje poznámky sú súkromné.</p>`,
    mimicWin: `<ul>
<li>Odsúďte Napodobňovača: <b>vyhrávajú Živí</b>, pokiaľ chytený Napodobňovač potom nepovie miesto a neukradne víťazstvo.</li>
<li>Odsúďte Živého, alebo nechajte Napodobňovača uniknúť: <b>vyhráva Napodobňovač</b>.</li>
<li>Napodobňovač povie miesto: správne, vyhráva; nesprávne, vyhrávajú Živí.</li>
<li>V zápase (predvolene 3 hry): Živí po +1, kto chytil Napodobňovača, ešte +1; Napodobňovač +2, alebo +3 za uhádnuté miesto.</li>
</ul>`,
    mimicOpts: `<ul>
<li><b>Miesta na tabuli:</b> viac miest Napodobňovačovi sťaží úlohu.</li>
<li><b>Posledný tip:</b> chytený Napodobňovač môže ešte povedať miesto.</li>
<li><b>Pozadie na televízore sa zaostruje:</b> možnosť pre dôveru. Televízor ukazuje pravé miesto silno rozmazané a s ubiehajúcim časom sa zaostruje. Kto otvorí odkaz na TV, mohol by ho prečítať.</li>
<li><b>Čas na otázky, hier v zápase.</b></li>
</ul>`,
    omenSetup: `<p>4–12 hráčov, asi 10 minút. Každý hrá sám za seba; nie sú tu skryté strany. Okultné koleso ukazuje na jedno z troch polí: Život, Smrť a Znovuzrodenie, v tomto poradí v smere hodinových ručičiek. Každý začína s 5 Vplyvmi, viditeľnými pre všetkých.</p>`,
    omenLoop: `<p>Sedem kôl, každé v troch krokoch:</p>
<ol>
<li><b>Koleso</b> ukáže, kde v tomto kole začína.</li>
<li><b>Zapečatený hlas.</b> Tajne predpovedz, kde sa koleso zastaví, a rozhodni sa, či ho otočíš o krok späť, o krok dopredu, alebo ho necháš. Otočenie stojí jeden Vplyv; bez Vplyvu ho môžeš len nechať. Hlas môžeš meniť, kým nie sú všetci hotoví.</li>
<li><b>Odhalenie.</b> Všetky otočenia sa sčítajú a koleso sa pohne raz, o súčet (tri kroky rovnakým smerom ho vrátia). Potom sa ukáže každá predpoveď a každé otočenie.</li>
</ol>
<p>Umenie je čítať stôl: kto má ešte Vplyv, kto chce koleso kde a kto ním otočí?</p>`,
    omenWin: `<ul>
<li>Správna predpoveď dáva 3 body. Chýbajúci hlas nič nepredpovedá a ničím neotáča.</li>
<li>Na konci má každý nevyužitý Vplyv hodnotu 1 bodu. Vyhráva najviac bodov; pri rovnosti sa víťazstvo delí.</li>
</ul>`,
    omenOpts: `<p>Žiadne prepínače: len časovače pre každý krok.</p>`,
    mirrorSetup: `<p>4–12 hráčov, asi 15 minút. Každý hrá sám za seba. Prekliate zrkadlo neukazuje tvoj odraz: ukazuje, čo si tvoji priatelia myslia, že urobíš. Osem vymyslených dilem, každá s tromi odpoveďami, A, B a C, a žiadna nie je správna.</p>
<p>V každom kole čítaš jedného iného hráča. Dvojice sa striedajú, takže počas hry každý číta každého a každého v každom kole číta práve jeden hráč.</p>`,
    mirrorLoop: `<ol>
<li><b>Poraďte sa.</b> Dilema a kto koho číta sú verejné. Pýtajte sa, doberajte sa, zavádzajte.</li>
<li><b>Zapečatený hlas.</b> Vyber svoju odpoveď a predpovedz odpoveď hráča, ktorého čítaš. Potrebné je oboje a môžeš to meniť, kým nie sú všetci hotoví.</li>
<li><b>Zrkadlo ukáže všetko:</b> každú odpoveď a každé čítanie, správne či nesprávne.</li>
</ol>`,
    mirrorWin: `<ul>
<li>Správna predpoveď dáva 2 body; tvoja vlastná odpoveď nič, takže prekvapiť svojho čitateľa je fér.</li>
<li>Chýbajúci hlas sa zmení na náhodnú odpoveď; jej čitateľ sa aj tak hodnotí podľa nej.</li>
<li>Vyhráva najlepší čitateľ; pri rovnosti sa víťazstvo delí.</li>
</ul>`,
    mirrorOpts: `<p>Okrem časovačov žiadne prepínače. Keď bude viac balíkov dilem, lobby vám dovolí vybrať, z ktorých sa osem ťahá.</p>`,
  },
};
