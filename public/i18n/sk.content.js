// Slovenčina: herný obsah (roly, sny, karty pravidiel, režimy, scenárové karty, návod).
export default {
  and: 'a',
  numbers: ['žiadny', 'jeden', 'dvaja', 'traja', 'štyria', 'piati', 'šiesti', 'siedmi', 'ôsmi', 'deviati', 'desiati'],
  roles: {
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
    PSYCHO: { name: 'Psychopat', when: 'Raz za hru, v noci', summary: 'Raz: umlč niekoho alebo mu na ďalší deň vezmi hlas.', detail: 'NEMÝ: nesmie hovoriť v diskusii, ale môže nominovať a hlasovať. BEZ HLASU: môže hovoriť, ale nehlasuje. Strážca, Anjel strážny a Požehnanie čarodejnice to zablokujú. Náboj sa minie aj pri zablokovaní.' },
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
    missions: { name: "Dead Set: Misie", blurb: "Tímy, hlasovania a sabotáž. Nikto neumiera: veďte misie, čítajte hlasy a nájdite Smrť skôr, než ona nájde Médium." },
    standard: { name: 'Štandard', blurb: 'Zamýšľaný zážitok z Dead Set. Desať rozšírených rol od 7 hráčov, Sen pre každého každú noc, 1–3 karty pravidiel.' },
    classic: { name: 'Klasika / Učenie', blurb: 'Na učenie. Iba základné roly — rozšírené miesta obsadia Nevinní. Sny predvolene vypnuté, najviac jedno jednoduché pravidlo.' },
    full: { name: 'Celý balík / Chaos', blurb: 'Všetkých 17 rozšírených rol vrátane Šaša, Barda a Čarodejnice. Veľa náhody, len pre skúsené skupiny.' },
    doomsday: { name: 'Súdny deň', blurb: 'Štandard proti času. Ak do konca posledného dňa nikto nevyhrá, vyhráva Smrť.' },
    custom: { name: 'Vlastné', blurb: 'Vyber si rozšírený zásobník, Sny, pravidlá aj hodiny sám — alebo napíš presný balík. Upozorní na nevyvážené zostavy.' },
  },
  scenario: {
    WHO: ['Cestovatelia v čase', 'Vesmírni prieskumníci', 'Mýtické bytosti', 'Duchovia historických osobností', 'Mutanti', 'Členovia tajného spolku', 'Stratení turisti', 'Umelé inteligencie', 'Stredovekí dedinčania', 'Dvojníci celebrít', "Cirkusanti na dôchodku", "Strážcovia majákov", "Súperiaci kuchári", "Vyhnaní šľachtici", "Nočné zdravotné sestry", "Hlbinní potápači", "Svadobní hostia", "Uviaznutí astronómovia", "Tanečníci maškarného plesu", "Mlčanliví mnísi"],
    WHERE: ['Potápajúca sa loď', 'Opustený zábavný park', 'Podzemný bunker', 'Strašidelné sídlo', 'Zasnežená tundra', "Maják zahalený hmlou", "Opustená vesmírna stanica", "Nočný vlak cez hory", "Zatopená katedrála", "Zarastená botanická záhrada", "Hotel v púštnej oáze", "Odľahlý kláštor", "Vinica v mesačnom svite", "Opustené filmové štúdio", "Múzeum hodinových strojčekov"],
    WHY: ['Nájsť ukrytý poklad', 'Uniknúť, kým nevyprší čas', 'Dokončiť rituál', 'Vyriešiť vraždu', 'Zastaviť hroziacu katastrofu', "Zlomiť prastarú kliatbu", "Vyhrať majetok v kartách", "Ochrániť kráľovského dediča", "Nájsť cestu domov", "Odhaliť zradcu", "Prežiť do svitania", "Získať späť ukradnutú relikviu", "Zobudiť spiace mesto", "Rozlúštiť poslednú správu", "Uchovať strašné tajomstvo"],
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
  guide: {
    missionsH: "Dead Set: Misie",
    missions: `<p>Druhý režim pre 5–10 hráčov, ktorý sa vyberá v lobby. Nikto neumiera: Smrť sa vkradla do výpravy a stôl ju musí nájsť.</p>
<ol>
<li><b>Karta misie.</b> Každá misia začína ťahom karty, ešte pred výberom tímu. Väčšina sú <i>Bežné misie</i>; občas karta zmení tím, hlasovanie alebo odhalenie. Platí pre celú misiu.</li>
<li><b>Návrh.</b> Vodca misie (lampáš) vyberie tím uvedenej veľkosti.</li>
<li><b>Hlasovanie o tíme.</b> Všetci tajne schvália alebo zamietnu; hlasy sa odhalia naraz, s menami. Väčšina pošle tím na misiu. Inak navrhuje ďalší hráč vľavo. Piaty návrh vyráža bez ohľadu na hlasovanie.</li>
<li><b>Misia.</b> Každý člen tímu tajne zahrá kartu. Živí môžu hrať iba Úspech; Smrť môže hrať Úspech alebo Sabotáž. Jedna Sabotáž misiu zmarí (na misii 4 od 7 hráčov dve). Karty sa zamiešajú a otáčajú jedna po druhej.</li>
<li><b>Nočná prestávka.</b> Každý si vyberie tajné Podozrenie. Po misiách 2, 3 a 4 zistí držiteľ Sviečky stranu jedného hráča a Sviečka prejde k nemu. Za úsvitu môžu prísť stopy.</li>
</ol>
<p><b>Koniec.</b> Tri úspechy: Smrť sa odhalí a Žnec označí Médium. Ak trafí, vyhráva Smrť; ak nie, vyhrávajú Živí. Tri zlyhania: Posledný odpor. Každý označí jedného hráča. Ak je to Živý, vyhráva Smrť; ak chytíte Smrť, Žnec aj tak dostane Zúčtovanie.</p>`,
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
    kicker: 'Pravidlá, v1.0',
    title: 'Ako sa<br><i>hrá.</i>',
    intro: 'Väčšina z vás chce prežiť. Niekoľkí z vás sú Smrť. Nikto nevie, kto je kto — okrem Smrti, ktorá pozná svojich.',
    toc: ['Základy', 'Jedno kolo', 'Víťazstvo', 'Základné roly', 'Rozšírené roly', 'Celý balík', 'Sny', 'Karty pravidiel', 'Režimy', 'Nočné poradie', 'Telefóny'],
    basicsH: 'Základy',
    basics: `<p>Dead Set je párty hra sociálnej dedukcie pre 5–13 hráčov. Každý sa pripojí do tej istej miestnosti zo svojho telefónu a dostane tajnú <b>rolu</b>. Väčšina rol patrí k frakcii <b>Nie-Smrti</b>; jeden alebo viac hráčov je tajne <b>Smrť</b>.</p>
<ul>
<li><b>Roly</b> platia celú hru: tvoja príslušnosť a tvoja schopnosť.</li>
<li><b>Sny</b> sú účinky na jednu noc: od noci 1 si každý živý hráč každú noc tajne potiahne jeden.</li>
<li><b>Karty pravidiel</b> (1–3, ťahané pri príprave) ohýbajú celú hru — dvojité vraždy, vážené hlasy, hlasujúci duchovia.</li>
<li><b>Scenár</b> (KTO / KDE / PREČO) je čisté rozprávanie. Nikdy nemení pravidlá.</li>
</ul>
<p>O svojej role môžeš hovoriť pravdu, klamať alebo mlčať. Nikdy neukazuj obrazovku. Aplikácia je rozprávač: nikto nemusí stáť bokom a hostiteľ nevidí viac tajomstiev ako ostatní.</p>`,
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
    modesH: 'Režimy',
    modesTh: ['Režim', 'Hráči', 'Čo sa mení'],
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
    phonesH: 'Hra na telefónoch',
    phones: `<ul>
<li>Hostiteľ vytvorí miestnosť a zdieľa šesťznakový kód alebo QR kód. Ostatní otvoria odkaz, zadajú meno a ťuknú na <em>Pripravený</em>.</li>
<li>Tvoje miesto je viazané na prehliadač. Ak sa telefón vybije, hostiteľ môže vo svojich ovládačoch vydať jednorazový <b>kód na obnovenie</b>; po jeho zadaní na novom zariadení sa tvoje miesto presunie tam a staré zariadenie sa odhlási.</li>
<li>Telefón hostiteľa je bežný hráčsky telefón s pár tlačidlami navyše: posunúť fázu, pridať 30 sekúnd, ukončiť hru. Hostiteľ nevidí roly, Sny ani hlasy.</li>
<li><b>Verejnú tabuľu</b> (bez tajomstiev) môžeš zobraziť na televízore: otvor <span class="mono">/board/KÓD</span>.</li>
<li>Ak chce niekto viesť stôl a vidieť všetko, vytvor miestnosť ako <b>dôveryhodný moderátor</b>. Nemôže mať miesto a všetci o tom vedia.</li>
<li>Každý si jazyk vyberá sám tlačidlom jazyka na úvodnej obrazovke, v pozvánke alebo v menu miestnosti. Predvolený jazyk stola nastavuje hostiteľ v predsieni.</li>
<li>NEMÝ, Hmla vojny a Prekliate ticho sú naživo pravidlá na čestné slovo. Na diaľku ich vynúti chat.</li>
</ul>`,
  },
};
