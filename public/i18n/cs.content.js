// Čeština: herní obsah (role, sny, karty pravidel, režimy, scénářové karty, návod).
export default {
  and: 'a',
  numbers: ['žádný', 'jeden', 'dva', 'tři', 'čtyři', 'pět', 'šest', 'sedm', 'osm', 'devět', 'deset'],
  roles: {
    M_JESTER: { name: "Šašek", when: "Vždy", summary: "Vyhráváš sám, když tě stůl označí v Posledním vzdoru nebo tě Ženec určí v Zúčtování.", detail: "Nejsi Živý ani ze Smrti: Médium tě nevidí a Svíčka tě ukáže jako Živého. Na misi můžeš hrát Úspěch i Sabotáž. Působ podezřele, ale ne moc." },
    TWIN: { name: "Dvojče", when: "Vždy", summary: "Dvojčata jsou dvě. Znáte se a oba patříte k Živým.", detail: "Můžeš hrát jen Úspěch. Věř svému dvojčeti, ale pozor: když se za sebe budete zaručovat moc nahlas, Smrt bude vědět, kam se dívat." },
    UNDERTAKER: { name: "Hrobník", when: "Po neúspěšné misi", summary: "Když mise selže, dozvíš se, kolik hráčů Smrti bylo v tom týmu.", detail: "Počítají se všichni hráči Smrti, i Zahalený a Tulák, ať zahráli jakoukoli kartu. Slyšíš to jen ty. Můžeš hrát jen Úspěch." },
    MEDIUM: { name: "Médium", when: "Vždy", summary: "Vidíš každého hráče Smrti kromě Zahaleného. Řiď výpravu tak, aby ses neprozradil.", detail: "Pokud Živí vyhrají tři mise nebo v Posledním vzdoru chytí hráče Smrti, má Smrt jeden pokus uhodnout, kdo jsi. Pokud označí tebe, vyhrává Smrt." },
    BELIEVER: { name: "Věřící", when: "Vždy", summary: "Vidíš dvě svíčky: Médium a Šarlatána. Nevíš, kdo je kdo.", detail: "Zjisti, která svíčka je skutečné Médium, a chraň ho – často tak, že se sám chováš jako Médium. Bez Šarlatána ve hře je tvou jedinou svíčkou Médium." },
    COMPANION: { name: "Společník", when: "Vždy", summary: "Nevíš nic kromě toho, co ti říká srdce. Sleduj hlasování a mise.", detail: "Můžeš hrát jen Úspěch. Čti, kdo koho navrhuje, kdo schvaluje který tým a které mise selhávají." },
    REAPER: { name: "Ženec", when: "Vždy", summary: "Vedeš Smrt. Při Zúčtování rozhodneš, kdo je Médium.", detail: "Vidíš zbytek Smrti (kromě Tuláka). Na misi můžeš hrát Úspěch nebo Sabotáž. Tvůj tým může při Zúčtování navrhovat jména; platí tvá volba." },
    CHARLATAN: { name: "Šarlatán", when: "Vždy", summary: "Pro Věřícího vypadáš přesně jako Médium. Využij toho.", detail: "Vidíš zbytek Smrti (kromě Tuláka). Na misi můžeš hrát Úspěch nebo Sabotáž." },
    VEILED: { name: "Zahalený", when: "Vždy", summary: "Médium tě nevidí.", detail: "Vidíš zbytek Smrti (kromě Tuláka). Na misi můžeš hrát Úspěch nebo Sabotáž." },
    STRAY: { name: "Tulák", when: "Vždy", summary: "Sloužíš Smrti sám: neznáš ostatní a oni neznají tebe.", detail: "Médium tě přesto vidí. Na misi můžeš hrát Úspěch nebo Sabotáž. Při Zúčtování se Smrt odhalí a přidáš se k ostatním." },
    SHADE: { name: "Stín", when: "Vždy", summary: "Kráčíš se Smrtí a znáš své spoluhráče.", detail: "Vidíš zbytek Smrti (kromě Tuláka). Na misi můžeš hrát Úspěch nebo Sabotáž." },
    CULT_LEADER: { name: "Vůdce sekty", when: "Každou noc", summary: "Každou noc naverbuj jednoho hráče do Sekty. Sekta vyhrává, když přečíslí všechny ostatní.", detail: "Naverbovaný si ponechá roli i schopnosti, ale nyní vyhrává se Sektou a dozví se, kdo jsou ostatní členové. Hráče na straně Smrti, Rozparovače a chráněné hráče naverbovat nelze. Pokud Vůdce zemře, nikdo jiný už verbovat nemůže." },
    RIPPER: { name: "Rozparovač", when: "Každou noc", summary: "Každou noc sám zabij jednoho hráče. Vyhraješ, pokud zůstaneš poslední na nohou, nebo sám s jedním hráčem, který není vrah.", detail: "Tvou vraždu zastaví stejné ochrany jako vraždu Smrti (Strážce, Anděl strážný, Požehnání čarodějnice, dočasné oživení). Smrt tě v noci nemůže zabít, s výjimkou Krvavého měsíce. Jevíš se jako NE NA STRANĚ SMRTI." },
    DEATH: { name: 'Smrt', when: 'Každou noc', summary: 'Každou noc se dohodněte se všemi živými spoluhráči Smrti na jedné společné vraždě.', detail: 'Všichni aktivní hráči Smrti musí potvrdit přesně stejný výběr cílů, jinak frakce pasuje. Základní kapacita je jedna vražda; Dvojí nebezpečí, Noční směna nebo Nápor síly ji mohou zvýšit nejvýš na dvě — nikdy ne jedna vražda na každého hráče Smrti.' },
    INNOCENT: { name: 'Nevinný', when: 'Den', summary: 'Žádná schopnost. Tvou zbraní je hlas a hlasování.', detail: 'Argumentuj, obviňuj a hlasuj. I ty každou noc dostáváš Sen a mohou na tebe působit stavy.' },
    MENTALIST: { name: 'Mentalista', when: 'Každou noc', summary: 'Přečti jiného hráče: stojí na straně Smrti, nebo ne?', detail: 'Zjistíš jen aktuální příslušnost cíle (NA STRANĚ SMRTI / NE NA STRANĚ SMRTI), nikdy jeho přesnou roli. Zablokované čtení nic nepřinese.' },
    GUARDIAN: { name: 'Strážce', when: 'Každou noc', summary: 'Ochraň jednoho hráče (i sebe) před Smrtí a Psychopatem.', detail: 'Zastaví jen vraždu frakce Smrti a stav od Psychopata. Ne bomby, Mstitele, Obětního beránka, propojené osudy ani vypršení. Stejný cíl můžeš chránit opakovaně.' },
    PSYCHO: { name: 'Psychopat', when: 'Jednou za hru, v noci', summary: 'Jednou: umlč někoho nebo mu na další den vezmi hlas.', detail: 'NĚMÝ: nesmí mluvit v diskusi, ale může nominovat a hlasovat. BEZ HLASU: může mluvit, ale nehlasuje. Strážce, Anděl strážný a Požehnání čarodějnice to zablokují. Náboj se spotřebuje i při zablokování.' },
    WHORE: { name: 'Děvka', alias: 'Společnice', when: 'Každou noc', summary: 'Navštiv někoho. Navštívíš-li Smrt, vražda celého týmu selže.', detail: 'Je-li navštívená osoba aktivní Smrt, kapacita vraždy frakce klesne na 0. Zabije-li navštívenou osobu Smrt, zemřeš s ní; zasáhne-li ji bomba, zasáhne i tebe.' },
    TRAVELING_AGENT: { name: 'Obchodní cestující', when: 'Každou noc', summary: 'Doruč záhadné zboží. Čistá atmosféra — a vizitka.', detail: 'Příjemce se za úsvitu dozví, že ho navštívil Obchodní cestující. Zboží nemá žádný účinek, ale samotná návštěva je informace, kterou můžete oba využít.' },
    TERRORIST: { name: 'Terorista', when: 'Každou noc', summary: 'Polož bombu ke dveřím. Padesát na padesát, že vybuchne.', detail: 'Server hodí férovou mincí. Při ANO cíl zemře a zemře i každá Děvka, která ho navštívila. Strážce bombu nezastaví; Anděl strážný, Požehnání a dočasné vzkříšení ano.' },
    MIMIC: { name: 'Napodobitel', when: 'Jen noc 1 (povinné)', summary: 'V noci 1 se natrvalo staň kopií role někoho jiného.', detail: 'Převezmeš roli a příslušnost cíle s novými náboji. Zkopírované schopnosti fungují od noci 2; zkopírovaná Smrt se k týmu přidá od noci 2. Zkopíruješ-li Napodobitele — nebo nevybereš —, zůstaneš do konce hry Napodobitelem bez moci.' },
    DOUBLE_AGENT: { name: 'Dvojitý agent', when: 'Jen noc 1 (povinné)', summary: 'V noci 1 si tajně vyber stranu na zbytek hry.', detail: 'Vyber SMRT nebo NE-SMRT. Vybereš-li Smrt, na konci noci 1 přestoupíš; od noci 2 jsi v místnosti týmu Smrti a sdílíte jedinou vraždu. Bez volby zůstaneš na straně Ne-Smrti.' },
    DIPLOMAT: { name: 'Diplomat', when: 'Jednou za hru, ve dne (před nominacemi)', summary: 'Jednou: vyhlas imunitu vůči odsouzení na jeden den.', detail: 'Vyhlašuje se veřejně během ranního okna. Ten den tě nikdo nemůže nominovat. Nechrání před nočními vraždami, bombami, Mstitelem ani Obětním beránkem.' },
    SCAPEGOAT: { name: 'Obětní beránek', when: 'Pasivně, den', summary: 'Skončí-li den bez odsouzení, zemřeš místo toho ty.', detail: 'Remíza, žádné nominace, žádné hlasy, nesplněné Pravidlo většiny nebo zrušení Hazardním hráčem — vše se počítá jako „bez odsouzení“. Je to vražda, ne odsouzení. Za den zemře jen jeden Obětní beránek (s nejnižším místem).' },
    NECROMANCER: { name: 'Nekromant', when: 'Jednou za hru, v noci', summary: 'Jednou: vzkřis vyřazeného hráče na jeden den a jednu noc.', detail: 'Navrátilec si ponechá roli i příslušnost, během vzkříšení je imunní vůči každé vraždě a po následující noci odejde. Aby rituál fungoval, musíš noc přežít. Každého lze vzkřísit jen jednou.' },
    CONSPIRATOR: { name: 'Spiklenec', when: 'Pasivní hlas ve dne, noční chat', summary: 'Tvůj hlas má +1. V noci otevřeš soukromý šepot s jedním hráčem.', detail: 'Tvůj hlas nese jednu váhu navíc na stejného kandidáta. Každou noc můžeš otevřít krátký textový kanál pro dva s živým hráčem; sám o sobě neprozrazuje role.' },
    MAGISTRATE: { name: 'Soudce', when: 'Pasivně, den', summary: 'Tvůj hlas váží 2 (při Paranoie 3).', detail: 'Jeden hlas, jeden kandidát, dvojitá váha. „Bez hlasu“ od Psychopata ho sníží na nulu.' },
    ORACLE: { name: 'Orákulum', when: 'Jednou za hru, v noci', summary: 'Jednou: uhádni, koho dnes v noci zasáhne Smrt. Trefíš-li se, přežije.', detail: 'Je-li tvá předpověď mezi potvrzenými cíli frakce Smrti, je tento hráč chráněn před jednou vraždou Smrti. Špatný tip nebo pas Smrti nepřinese nic.' },
    GAMBLER: { name: 'Hazardní hráč', when: 'Jednou za hru, v noci', summary: 'Jednou: vsaď na zítřejšího prvního nominovaného. Vyhraješ-li, nikdo nevisí.', detail: 'Shoduje-li se první oficiální nominace následujícího dne s tvou sázkou, odsouzení toho dne se před sečtením zruší. Obětní beránek může kvůli chybějícímu odsouzení přesto zemřít.' },
    VIGILANTE: { name: 'Mstitel', when: 'Jednou za hru, ve dne (před nominacemi)', summary: 'Jednou: ráno zastřel hráče, bez hlasování.', detail: 'Vražda rolí, ne odsouzení. Imunita Diplomata ji nezastaví. Vítězství se kontroluje hned poté.' },
    JESTER: { name: 'Šašek', when: 'Nezávislý', summary: 'Vyhraješ sám — ale jen když tě město odsoudí hlasováním.', detail: 'Jiná smrt (noční vražda, bomba, Mstitel, Obětní beránek) se nepočítá. Ani přežití do konce není výhra. Vůči většině Smrti se počítáš jako „jiný“ hráč.' },
    BODYGUARD: { name: 'Osobní strážce', when: 'Každou noc', summary: 'Postav se k někomu. Přijde-li pro něj Smrt, čepel schytáš ty.', detail: 'Zemřel-li by tvůj chráněnec na vraždu Smrti a nic jiného ho nezachrání, zemřeš místo něj. Sebe hlídat nemůžeš, bomby ani propojené smrti nezastavíš a za noc zachytíš nejvýš jednu vraždu.' },
    BARD: { name: 'Bard', when: 'Jednou za hru, v noci', summary: 'Jednou: umlč noc. Každá schopnost selže, i schopnost Smrti.', detail: 'Všechny aktivní schopnosti rolí té noci jsou potlačeny. Sny, vypršení a pravidla hry platí dál. Spánková paralýza na Bardovi ticho zruší.' },
    WITCH: { name: 'Čarodějnice', when: 'Každou noc', summary: 'Požehnej hráči proti újmě, nebo proklej jeho další akci, aby selhala.', detail: 'Požehnání: dnes v noci chrání před škodlivými akcemi rolí a bombami (ne před propojenými osudy). Kletba: další cílená akce cíle selže; prokletí aktivní Smrti zablokuje vraždu frakce. Nikdy ne na sebe.' },
  },
  dreams: {
    SLEEP_PARALYSIS: { name: 'Spánková paralýza', text: 'Nemůžeš použít svou noční akci role. Jsi-li aktivní Smrt, je celá vražda frakce zablokována.' },
    PREMONITION: { name: 'Předtucha', text: 'Za úsvitu se dozvíš jméno jednoho živého hráče na straně Smrti.' },
    WHISPERS: { name: 'Šepot minulosti', text: 'Za úsvitu se dozvíš přesnou roli náhodného vyřazeného hráče.' },
    SLEEPWALKING: { name: 'Náměsíčnost', text: 'Jsi vázán na hráče, který sedí těsně před tebou. Zemře-li dnes v noci, zemřeš na konci noci.' },
    DREAM_SNATCHER: { name: 'Zloděj snů', text: 'Před otevřením akcí si můžeš vyměnit karty Snů s jiným živým hráčem.' },
    NIGHT_SHIFT: { name: 'Noční směna', text: 'Jedno použití opakovatelné noční schopnosti navíc, na druhý cíl. Pro Smrt: kapacita týmu je 2.' },
    SHARED_NIGHTMARE: { name: 'Sdílená noční můra', text: 'Vyber si partnera snu. Zemře-li dnes v noci, zemřeš s ním.' },
    INSOMNIA: { name: 'Nespavost', text: 'Za úsvitu dostaneš úplnou chronologickou zprávu o akcích této noci — pokud přežiješ.' },
    GUARDIAN_ANGEL: { name: 'Anděl strážný', text: 'Dnes v noci jsi imunní vůči Smrti, Psychopatovi, bombám, Kletbě čarodějnice i propojeným smrtím.' },
  },
  mcards: {
    REGULAR: { name: "Běžná mise", text: "Žádný zvláštní účinek." },
    LANTERN: { name: "Nosič lucerny", text: "Vůdce musí být v týmu." },
    FRESH_FACES: { name: "Nové tváře", text: "Aspoň polovina týmu (zaokrouhleno nahoru) nesmí být z předchozí mise." },
    EXTRA_HAND: { name: "Ruka navíc", text: "Tým je o jednoho hráče větší." },
    SKELETON_CREW: { name: "Minimální posádka", text: "Tým je o jednoho hráče menší." },
    MASKED_VOTE: { name: "Skryté hlasování", text: "Hlasování o týmu ukazuje jen součty, ne kdo jak hlasoval." },
    SHORT_PATIENCE: { name: "Krátká trpělivost", text: "Třetí návrh vyráží bez ohledu na hlasování." },
    WARD: { name: "Ochrana", text: "Spolu s týmem Vůdce označí člena, jehož karta bude nuceně Úspěch." },
    STEADFAST: { name: "Neochvějná", text: "K selhání je potřeba o jednu Sabotáž víc než obvykle." },
    BRITTLE: { name: "Křehká", text: "Selže už s jedinou Sabotáží, ačkoli tato mise obvykle potřebuje dvě." },
    SMOKE: { name: "Kouř", text: "Ukáže se jen výsledek, ne kolik karet Sabotáže bylo zahráno." },
    GRAND: { name: "Velká mise", text: "Výsledek se na stupnici počítá dvakrát." },
    TRAIL: { name: "Stopa", text: "Pokud uspěje, náhodný živý člen týmu v noci najde stopu." },
    WITNESS: { name: "Svědek", text: "V noci Vůdce týmu tajně uvidí kartu jiného člena." },
    HAUNTED_ROAD: { name: "Strašidelná cesta", text: "Pokud selže, Ženec vybere jednoho z jejích členů, který musí vynechat další misi." },
  },
  missionStory: {
    steps: [
      ["Najít roztrženou mapu", "Jít po falešné stopě", "Prokopat se přes návnady", "Otevřít trezor", "Vynést zlato"],
      ["Najít hodiny", "Ukrást klíče", "Prolomit první zámek", "Utéct alarmům", "Dostat se k posledním dveřím"],
      ["Posbírat svíčky", "Nakreslit kruh", "Vyslovit zakázaná slova", "Nakrmit oltář", "Uzavřít kruh"],
      ["Prohlédnout tělo", "Vyslechnout komorníka", "Najít zbraň", "Rozbít alibi", "Označit vraha"],
      ["Přečíst varovná znamení", "Najít zdroj", "Přestřihnout správný drát", "Udržet linii", "Zatáhnout za poslední páku"],
      ["Najít prokletý předmět", "Zjistit jeho pravé jméno", "Naštvat ducha", "Spoutat ho solí", "Zlomit kletbu"],
      ["Přidat se ke hře", "Počítat karty", "Odhalit podvodníka", "Vsadit všechno", "Vyhrát poslední partii"],
      ["Najít dědice", "Ukrýt dědice", "Přežít večeři", "Oklamat vrahy", "Korunovat dědice"],
      ["Číst hvězdy", "Projít tmou", "Podplatit převozníka", "Vylézt na poslední kopec", "Otevřít domovní dveře"],
      ["Zachytit dopis", "Sledovat kroky", "Nastražit past", "Sklapnout past", "Odhalit zrádce"],
      ["Zabarikádovat dveře", "Rozdělit svíčky", "Ignorovat klepání", "Vydržet po půlnoci", "Přivítat úsvit"],
      ["Zachytit pach", "Najít překupníka", "Otevřít sejf", "Podstrčit padělek", "Vrátit relikvii"],
      ["Zazvonit na starý zvon", "Zjistit, kdo zpíval ukolébavku", "Uvařit hořkou kávu", "Vzbudit starostu", "Zlomit kouzlo"],
      ["Najít první stránku", "Rozluštit symboly", "Najít chybějící klíč", "Číst mezi řádky", "Přečíst poslední slovo"],
      ["Spálit deník", "Umlčet papouška", "Podplatit svědka", "Setřást detektiva", "Vzít to do hrobu"],
    ],
    scenes: [
      ["Taneční sál se naklání, ale kapela odmítá přestat hrát.", "V kapitánově kajutě je voda po kotníky – a stoupá.", "Záchranné čluny spočítali dvakrát. Nestačí.", "V zatopené strojovně ještě něco tiká.", "Paluba je skoro svislá. Držte se něčeho. Čehokoli."],
      ["Kolotoč se rozjede sám, jakmile přijdete.", "Zrcadlové bludiště ukazuje o jednoho z vás víc.", "Před strašidelným vláčkem stojí fronta. Nikdo v ní nedýchá.", "Ruské kolo se zastaví – s vámi úplně nahoře.", "Každá socha klauna se otočila k vám."],
      ["Dveře se za vámi se syčením zapečetí. Světlo bliká.", "Vysílačka praská hlasem, který zná vaše jména.", "Na dávkách jídla stojí „Neotvírat“. Někdo je otevřel.", "Podlaží minus čtyři není na žádném plánu.", "Vzduchu zbývá na dvacet minut. Asi."],
      ["Portréty vás sledují očima – a taky nohama.", "Večeře je prostřená přesně pro jednoho hosta navíc.", "Tajné dveře jsou za knihou, které ses právě dotkl.", "Schody na půdu vržou ve slovech.", "Dům už nepředstírá, že je prázdný."],
      ["Sníh požírá vaše stopy tak rychle, jak je děláte.", "Psi u saní odmítají udělat jediný krok.", "Něco velkého jde po vašich stopách celý den.", "Led na jezeře začal zpívat.", "Vánice se zavírá. Už nevidíte ani vlastní ruce."],
      ["Lampa se otáčí, přestože po schodech už léta nikdo nešel.", "Mlhový roh odpovídá na otázky, které nikdo nepoložil.", "Strážcův deník končí uprostřed věty.", "Skály dole jsou plné lodí, které tomuhle světlu věřily.", "Nahoře lampa zhasne. Ve tmě něco dýchá."],
      ["Gravitace funguje ve většině místností. Ve většině.", "Umělá inteligence stanice přeje dobré ráno. Není ráno.", "Hydroponie je plná rostlin, které nikdo nezasadil.", "Podle záznamu přechodové komory někdo vyšel. Nikdo nechybí.", "Oběžná dráha se rozpadá. Všichni zadržte dech."],
      ["Průvodčí ti označí jízdenku a zašeptá: špatný vlak.", "Jídelní vůz je prostřený k hostině, ale kuchař zmizel.", "Tunel. Když se vrátí světlo, jeden cestující je jiný.", "Vlak přejíždí most, který tu včera nebyl.", "Brzdy přestaly fungovat. Hora ne."],
      ["Veslujete hlavní lodí, zatímco varhany hrají pod vodou.", "Svíčky hoří pod hladinou. To by nemělo být možné.", "Svatí ve vitrážích všichni ukazují na vás.", "Krypta je zatopená a rakve plavou.", "Zvon zvoní pod vodou, pomalu a velmi blízko."],
      ["Růže se k vám sklánějí. Zatím zdvořile.", "Ve skleníku je dusno a něco v něm bzučí.", "Masožravá rostlina snědla mapu. A zahradníka.", "Živý plot bludiště se při každém mrknutí přeskupí.", "Velký strom uprostřed otevře jedno ospalé oko."],
      ["Na recepci mají vaši rezervaci. Nikdy jste žádnou nedělali.", "Bazén je plný písku a plavčík je pořád ve službě.", "Pokoj 313 v noci bzučí. Pokoj 312 neexistuje.", "Písečná bouře zbarví každé okno do rezava.", "Studna v srdci oázy začala šeptat."],
      ["Mniši složili slib mlčení a nahlas ho porušují.", "Zvony odbijí třináctkrát.", "V písárně je kniha, která se píše sama.", "Stezka nad útesem je kluzká a kozy vás soudí.", "V kryptě čeká opat. Zemřel v roce 1611."],
      ["Měsíc nad vinobraním visí tak nízko, že by se dal kousnout.", "V sudech ve sklepě zraje něco, co není víno.", "Strašák se před minutou díval na druhou stranu.", "Ochutnávková místnost voní švestkami, kouřem a špatnými rozhodnutími.", "Hrozny přes noc zčernaly. Poslouchají."],
      ["Ateliér 9 svítí a natáčí se. Za kamerou nikdo není.", "V rekvizitárně chybí přesně jeden skutečný nůž.", "Na exteriéru vrhá kartonové městečko skutečné stíny.", "Na režisérské židli je tvé jméno – špatně napsané.", "Poslední kotouč je v projektoru. Pusťte ho a uvidíte, jak to skončí."],
      ["Každé hodiny v sále ukazují jiný čas a všechny se zpožďují.", "Šachový automat žádá odvetu.", "Mechanický pták zpívá poplach a poplach mu odpovídá.", "Velké planetárium se začalo samo točit.", "Odbije půlnoc a každý exponát otočí hlavu."],
    ],
    genericSteps: ["První krok", "Hlouběji", "Bod, odkud není návratu", "Nejtěžší část", "Konec cesty"],
    genericScenes: ["Výprava vyráží. Nikdo se neohlíží.", "Cesta se zužuje – a s ní i důvěra.", "V polovině cesty. Někdo počítá kroky.", "S každou volbou je vzduch chladnější.", "Poslední úsek. Co tu čeká, čekalo na vás."],
  },
  sideMissions: {"GO_TWICE": "Jdi aspoň na dvě mise.", "GO_THRICE": "Jdi aspoň na tři mise.", "STAY_BEHIND": "Jdi nejvýš na jednu misi.", "EARLY_BIRD": "Jdi na misi 1 nebo 2.", "LATE_ARRIVAL": "Nejdi na misi 1 ani 2.", "LANTERN_LEADS": "Veď tým, který se vydá na misi.", "NO_LANTERN": "Nikdy neveď tým, který se vydá na misi.", "GOOD_COMPANY": "Buď na misi, která uspěje.", "BAD_LUCK": "Buď na misi, která selže.", "CLEAN_RECORD": "Nikdy nebuď na misi, která selže.", "NAYSAYER": "Hlasuj aspoň třikrát pro Zamítnutí.", "OPEN_HEART": "Nikdy nehlasuj pro Zamítnutí.", "LONE_VOICE": "Zamítni tým, který stůl schválí.", "LOST_CAUSE": "Schval tým, který stůl zamítne.", "CONTRARIAN": "Dvakrát skonči na prohrané straně hlasování o týmu.", "CROWD": "Vždy hlasuj s většinou.", "FIRST_TRUST": "Schval první návrh dvou různých misí.", "POPULAR": "Buď aspoň ve třech navržených týmech.", "SELF_STARTER": "Dej se do týmu, který sám navrhneš.", "HUMBLE": "Nikdy se nedávej do týmu, který sám navrhneš.", "NEIGHBOURS": "Jdi na misi spolu s hráčem po své levici.", "CANDLE_BEARER": "Někdy drž Svíčku.", "STEADY_EYE": "Nikdy neměň své Podezření (a dej aspoň dvě).", "RESTLESS": "Svými Podezřeními označ tři různé hráče."},
  rules: {
    OPEN_BALLOT: { name: "Veřejné hlasování", text: "Každý hlas je veřejný: všichni vidí, kdo hlasuje pro koho, jakmile hlasy přicházejí.", enforcement: "Hlasy lze měnit až do uzamčení. I hlasy duchů jsou veřejné." },
    FOG_OF_WAR: { name: 'Mlha války', text: 'Během diskuse smíš přímo mluvit jen s hráči na místech hned vedle tebe.', enforcement: 'Naživo na čestné slovo. Na dálku nahradí stolní chat šepot se sousedy.' },
    DOUBLE_JEOPARDY: { name: 'Dvojí nebezpečí', text: 'Frakce Smrti může každou noc zabít až dva hráče (pevný strop 2).', enforcement: 'Blokace jako návštěva Děvky nebo paralýza ji stále sníží na 0.' },
    PARANOIA: { name: 'Paranoia', text: 'Každý živý hlas získá +1 váhu. Soudce váží 3; Spiklenec přidává další +1.', enforcement: 'Hlasy duchů zůstávají s váhou 1.' },
    UNRELIABLE_POWER: { name: 'Nespolehlivá moc', text: 'Každá noční akce role hází k6: 1–3 selže, 4–6 funguje. Smrt hází jednou za tým.', enforcement: 'Neúspěšná jednorázová schopnost se i tak spotřebuje.' },
    POWER_SURGE: { name: 'Nápor síly', text: 'Každou noc získá jedna náhodná oprávněná opakovatelná schopnost použití navíc. Smrt se počítá jako jeden záznam.', enforcement: 'Nikdo nikdy víc než dvě použití; kapacita Smrti má strop 2.' },
    EQUAL_EXCHANGE: { name: 'Rovná výměna', text: 'Hráč na straně Smrti odsouzený hlasováním si může vzít s sebou jednoho živého hráče Ne-Smrti.', enforcement: 'Noční vraždy, výstřely Mstitele a propojené smrti ji nespouštějí.' },
    CURSED_SILENCE: { name: 'Prokleté ticho', text: 'Během diskuse smíš mluvit, jen když tě někdo přímo osloví.', enforcement: 'Na čestné slovo. Nominace a hlasování to neovlivní.' },
    MAJORITY_RULE: { name: 'Pravidlo většiny', text: 'Odsouzení vyžaduje víc než polovinu váhy všech oprávněných živých voličů na jednom nominovaném.', enforcement: 'Zdržení a nehlasující se započítávají do jmenovatele. Hlasy duchů se nepočítají nikdy.' },
    HIDDEN_ROLES: { name: 'Skryté role', text: 'Role vyřazených hráčů se až do konce hry nikdy veřejně neukážou.', enforcement: 'Je to stejně výchozí; tato karta to uzamkne.' },
    VENGEFUL_GHOSTS: { name: 'Mstiví duchové', text: 'Každý vyřazený hráč může každý den odevzdat jeden hlas ducha s váhou 1.', enforcement: 'Duchové nemohou nominovat, používat schopnosti ani ovlivnit Pravidlo většiny.' },
  },
  presets: {
    missions: { name: "Dead Set: Mise", blurb: "Týmy, hlasování a sabotáž. Nikdo neumírá: veďte mise, čtěte hlasy a najděte Smrt dřív, než ona najde Médium." },
    standard: { name: 'Standard', blurb: 'Zamýšlený zážitek z Dead Set. Deset rozšířených rolí od 7 hráčů, Sen pro každého každou noc, 1–3 karty pravidel.' },
    classic: { name: 'Klasika / Učení', blurb: 'Na učení. Jen základní role — rozšířená místa obsadí Nevinní. Sny ve výchozím stavu vypnuté, nejvýš jedno jednoduché pravidlo.' },
    full: { name: 'Celý balík / Chaos', blurb: 'Všech 17 rozšířených rolí včetně Šaška, Barda a Čarodějnice. Hodně náhody, jen pro zkušené skupiny.' },
    doomsday: { name: 'Soudný den', blurb: 'Standard proti času. Nevyhraje-li nikdo do konce posledního dne, vyhrává Smrt.' },
    custom: { name: 'Vlastní', blurb: 'Vyber si rozšířený zásobník, Sny, pravidla i hodiny sám — nebo napiš přesný balík. Upozorní na nevyvážené sestavy.' },
  },
  scenario: {
    WHO: ['Cestovatelé v čase', 'Vesmírní průzkumníci', 'Mýtické bytosti', 'Duchové historických osobností', 'Mutanti', 'Členové tajného spolku', 'Ztracení turisté', 'Umělé inteligence', 'Středověcí vesničané', 'Dvojníci celebrit', "Cirkusáci v důchodu", "Strážci majáků", "Soupeřící kuchaři", "Vyhnaní šlechtici", "Noční zdravotní sestry", "Hlubinní potápěči", "Svatební hosté", "Uvízlí astronomové", "Tanečníci maškarního plesu", "Mlčenliví mniši"],
    WHERE: ['Potápějící se loď', 'Opuštěný zábavní park', 'Podzemní bunkr', 'Strašidelné sídlo', 'Zasněžená tundra', "Maják zahalený mlhou", "Opuštěná vesmírná stanice", "Noční vlak přes hory", "Zatopená katedrála", "Zarostlá botanická zahrada", "Hotel v pouštní oáze", "Odlehlý klášter", "Vinice v měsíčním světle", "Opuštěné filmové studio", "Muzeum hodinových strojků"],
    WHY: ['Najít ukrytý poklad', 'Uniknout, než vyprší čas', 'Dokončit rituál', 'Vyřešit vraždu', 'Zastavit hrozící katastrofu', "Zlomit prastarou kletbu", "Vyhrát jmění v kartách", "Ochránit královského dědice", "Najít cestu domů", "Odhalit zrádce", "Přežít do svítání", "Získat zpět ukradenou relikvii", "Probudit spící město", "Rozluštit poslední zprávu", "Uchovat strašné tajemství"],
  },
  products: ['mosazný klíč, který nepasuje do žádného zámku', 'sklenici teplého písku', 'jízdenku na vlak, který odjel včera', 'jediné černé pírko', 'kapesní hodinky jdoucí pozpátku', 'zapečetěný dopis adresovaný tobě', 'lahvičku šedého parfému', 'balíček karet bez dámy', 'svíčku, která voní deštěm', 'fotografii prázdného pokoje', 'sametem vystlanou krabičku (prázdnou)', 'kompas, který ukazuje na tebe'],
  whispers: [
    'Bo našli mrtvého. Nikdo neviděl Děvku odcházet.',
    'Město oběsilo Šaška. Smál se.',
    'Mentalistka to věděla. Nikdo jí nevěřil.',
    'Chyběly dva hlasy. Zaplatil Obětní beránek.',
    'Fay přísahala, že je Strážce. Gus taky.',
    'Nekromant vzkřísil špatného přítele.',
    'Bomba u dveří. Mince ve vzduchu.',
    'Všichni se probudili. Nějak to bylo horší.',
    'Smrt hlasovala s městem. Samozřejmě.',
  ],
  guide: {
    missionsH: "Dead Set: Mise",
    missions: `<p>Druhý režim pro 5–12 hráčů, který se vybírá v lobby. Nikdo neumírá: Smrt se vloudila do výpravy a stůl ji musí najít.</p>
<ol>
<li><b>Karta mise.</b> Každá mise začíná tahem karty, ještě před výběrem týmu. Většina jsou <i>Běžné mise</i>; občas karta změní tým, hlasování nebo odhalení. Platí pro celou misi.</li>
<li><b>Návrh.</b> Vůdce mise (lucerna) vybere tým uvedené velikosti.</li>
<li><b>Hlasování o týmu.</b> Všichni tajně schválí nebo zamítnou; hlasy se odhalí najednou, se jmény. Většina pošle tým na misi. Jinak navrhuje další hráč vlevo. Pátý návrh vyráží bez ohledu na hlasování.</li>
<li><b>Mise.</b> Každý člen týmu tajně zahraje kartu. Živí mohou hrát jen Úspěch; Smrt může hrát Úspěch nebo Sabotáž. Jedna Sabotáž misi zmaří (na misi 4 od 7 hráčů dvě). Karty se zamíchají a otáčejí jedna po druhé.</li>
<li><b>Noční přestávka.</b> Každý si vybere tajné Podezření. Po misích 2, 3 a 4 zjistí držitel Svíčky stranu jednoho hráče a Svíčka přejde k němu. Za úsvitu mohou přijít stopy.</li>
</ol>
<p><b>Konec.</b> Tři úspěchy: Smrt se odhalí a Ženec označí Médium. Pokud trefí, vyhrává Smrt; pokud ne, vyhrávají Živí. Tři selhání: Poslední vzdor. Každý označí jednoho hráče. Pokud je to Živý, vyhrává Smrt; pokud chytíte Smrt, Ženec stejně dostane Zúčtování.</p>`,
    missionCardsH: "Karty misí",
    sidesH: "Další strany a zvraty",
    sides: `<p>Volitelné, zapínají se v lobby (nebo se přidávají počítadly rolí ve vlastních hrách). Město vyhraje, až zmizí Smrt, Sekta i Rozparovač.</p>
<ul>
<li><b>Milenci:</b> dva náhodní hráči z jakékoli strany se do sebe zamilují. Každý se dozví jméno toho druhého. Pokud jeden zemře, druhý zemře žalem. Pokud zůstanou dva poslední živí, vyhrají spolu.</li>
<li><b>Sekta:</b> Vůdce sekty každou noc naverbuje jednoho hráče. Naverbovaní si ponechají roli, ale vyhrávají se Sektou, která vyhraje, když přečíslí všechny ostatní. Smrt, Rozparovače a chráněné hráče naverbovat nelze.</li>
<li><b>Rozparovač:</b> osamělý vrah, který udeří každou noc. Smrt ho v noci nemůže zabít (kromě Krvavého měsíce). Vyhraje, pokud zůstane poslední na nohou, nebo sám s hráčem, který není vrah.</li>
<li><b>Stopy</b> (výchozí zapnuté, vzácné): za některých úsvitů dostane jeden či dva hráči mimo tým Smrti pravdivou stopu, například „jeden z A a B kráčí se Smrtí“.</li>
<li><b>Hod mincí při rovnosti</b> (volitelné): rovnost na čele rozhodne hod mincí, místo aby byli všichni ušetřeni.</li>
<li><b>Veřejné hlasování</b> (karta pravidla): každý hlas je veřejný, jakmile je odevzdán.</li>
</ul>`,
    kicker: 'Pravidla, v1.0',
    title: 'Jak se<br><i>hraje.</i>',
    intro: 'Většina z vás chce přežít. Několik z vás je Smrt. Nikdo neví, kdo je kdo — kromě Smrti, která zná své.',
    toc: ['Základy', 'Jedno kolo', 'Vítězství', 'Základní role', 'Rozšířené role', 'Celý balík', 'Sny', 'Karty pravidel', 'Režimy', 'Noční pořadí', 'Telefony'],
    basicsH: 'Základy',
    basics: `<p>Dead Set je párty hra sociální dedukce pro 5–13 hráčů. Každý se připojí do stejné místnosti ze svého telefonu a dostane tajnou <b>roli</b>. Většina rolí patří k frakci <b>Ne-Smrti</b>; jeden nebo více hráčů je tajně <b>Smrt</b>.</p>
<ul>
<li><b>Role</b> platí celou hru: tvá příslušnost a tvá schopnost.</li>
<li><b>Sny</b> jsou účinky na jednu noc: od noci 1 si každý živý hráč každou noc tajně táhne jeden.</li>
<li><b>Karty pravidel</b> (1–3, tažené při přípravě) ohýbají celou hru — dvojité vraždy, vážené hlasy, hlasující duchové.</li>
<li><b>Scénář</b> (KDO / KDE / PROČ) je čisté vyprávění. Nikdy nemění pravidla.</li>
</ul>
<p>O své roli můžeš mluvit pravdu, lhát nebo mlčet. Nikdy neukazuj obrazovku. Aplikace je vypravěč: nikdo nemusí stát stranou a hostitel nevidí víc tajemství než ostatní.</p>`,
    roundH: 'Jedno kolo',
    round: `<ol>
<li><b>Noc 0 — odhalení.</b> Otoč kartu role, přečti ji, klepni na <em>Rozumím</em>. Nic jiného se neděje: žádné vraždy, Sny ani schopnosti. Hráči Smrti vidí své spoluhráče.</li>
<li><b>Ráno.</b> Přečtou se zprávy z úsvitu: kdo v noci zemřel (nikdy jak, nikdy jeho role). Co ses dozvěděl soukromě, najdeš pod <em>Víš to jen ty</em>. Diplomat tu může vyhlásit imunitu; Mstitel může vystřelit.</li>
<li><b>Diskuse a nominace.</b> Mluvte spolu. Každý živý hráč může za den udělat <b>jednu oficiální nominaci</b>. Nominovat už nominovaného znamená nominaci jen podpořit.</li>
<li><b>Obhajoba.</b> Každý nominovaný dostane slovo v pořadí nominací.</li>
<li><b>Tajné hlasování.</b> Každý oprávněný živý hráč hlasuje na svém telefonu pro jednoho nominovaného, nebo se zdrží. Hlas můžeš měnit, dokud ho hostitel nezamkne. Zveřejňují se jen součty.</li>
<li><b>Odsouzení.</b> Jediný nejvyšší součet je odsouzen (vyřazen). <b>Remíza v čele neodsoudí nikoho.</b> Za den je odsouzen nejvýš jeden člověk.</li>
<li><b>Noc.</b> Obrazovky ztmavnou. Se Sny trvá soumrak patnáct sekund (bez nich pět): každý otočí svůj Sen a Zloději snů mohou měnit. Komu sen ukradli, uvidí to. Pak se noční akce otevřou samy. Kdo má noční schopnost, tajně ji odešle; Smrt se dohodne na vraždě. Když všichni spí — nebo vyprší čas —, server vyhodnotí všechny akce naráz a rozední se další den.</li>
</ol>
<p class="small">Co neodešleš, než se okno zavře, se změní na pas (nebo zdržení). Odpojený telefon si ponechá místo i tajemství.</p>`,
    winH: 'Vítězství',
    win: `<ul>
<li><b>Ne-Smrt vyhrává</b>, jakmile nežije žádný hráč na straně Smrti.</li>
<li><b>Smrt vyhrává</b>, jakmile živí hráči na straně Smrti <b>přečíslí</b> všechny ostatní živé. Rovnost nestačí.</li>
<li><b>Šašek</b> (jen Celý balík) vyhraje sám a okamžitě, odsoudí-li ho město hlasováním.</li>
<li>Nezůstane-li po noci nikdo naživu, hra končí <b>remízou</b>.</li>
<li>S <b>Hodinami soudného dne</b> Smrt vyhraje i tehdy, nevyhrál-li nikdo do konce posledního dne.</li>
<li><b>Krvavý měsíc</b> (ve výchozím stavu zapnutý): po dvou nocích za sebou bez smrti následující noc nevydrží žádná ochrana a nic nezablokuje vraždu Smrti. Ukončí to patové situace, třeba osamělého Strážce, který se pořád chrání před osamělou Smrtí.</li>
<li><b>Smrt vyhraje mezi posledními dvěma</b> (volitelné): je-li mezi posledními dvěma živými Smrt, Smrt okamžitě vyhrává.</li>
</ul>
<p>Vítězství se kontroluje po každém úplném vyhodnocení — nikdy uprostřed noci.</p>`,
    coreH: 'Základní role',
    coreP: 'Vždy ve hře.',
    killH: 'Jak zabíjí tým Smrti',
    kill: 'Všichni živí spoluhráči Smrti sdílejí jednu místnost. Každý navrhuje cíle; vražda proběhne, jen když <b>všichni potvrdí přesně stejný výběr</b>. Při jakémkoli nesouhlasu nebo chybějícím potvrzení Smrt pasuje. Tým zabije <b>jednoho</b> hráče za noc bez ohledu na počet Smrtí — dva s Dvojím nebezpečím, Noční směnou nebo Náporem síly, nikdy víc než dva.',
    extH: 'Rozšířené role — Standard',
    extP: 'Od 7 hráčů se další místa obsadí z tohoto zásobníku (tajně tažené). 7 hráčů → 1 rozšířené místo, 10 → 2, 11+ → 3.',
    fullH: 'Doplňky Celého balíku',
    fullP: 'Jen v režimu Celý balík / Chaos nebo Vlastní. Pro zkušené skupiny.',
    dreamsH: 'Sny',
    dreamsP: 'Od noci 1 si každý živý hráč každou noc náhodně táhne kartu Snu (mohou se opakovat). Platí jen tu noc. Svůj sen můžeš popsat — pravdivě, nebo ne.',
    dreamsNote: `Některé Sny jsou vzácnější než jiné a Nespavost se ve hře objeví nejvýš dvakrát; v režimu Vlastní lze četnost každého Snu nastavit. Výměny Zlodějů snů proběhnou během soumraku, před otevřením akcí, v pořadí míst, každý jednou. Platí karta, kterou držíš nakonec.`,
    rulesH: 'Karty pravidel',
    rulesP: '1–3 se při přípravě táhnou (nebo vyberou) a platí celou hru. Některé lze dodržovat jen na čestné slovo, když hrajete v jedné místnosti.',
    modesH: 'Režimy',
    modesTh: ['Režim', 'Hráči', 'Co se mění'],
    countsH: 'Počty rolí',
    countsTh: ['Hráči', 'Smrt', 'Nevinný', 'Strážce · Mentalista · Psychopat', 'Rozšířené'],
    modesNote: 'Klasika / Učení obsadí rozšířená místa Nevinnými. Hra v jedné místnosti, nebo na dálku je jen otázka přenosu, ne jiná hra: na dálku přibude stolní chat (a při Mlze války šepot se sousedy).',
    orderH: 'Kdo koho porazí v noci',
    order: `<p>Všichni odesílají naráz; server pak vyhodnocuje v pevném pořadí, takže výsledek nikdy nezávisí na tom, kdo klepl dřív.</p>
<ol>
<li><b>Potlačení.</b> Bardovo ticho zruší všechny schopnosti rolí. Spánková paralýza zastaví svého držitele — a aktivní Smrt s ní zastaví celou vraždu. Nespolehlivá moc hází kostkami.</li>
<li><b>Kletby a návštěvy.</b> Kletba čarodějnice zmaří akci cíle (nebo celou vraždu Smrti). Děvka, která navštíví aktivní Smrt, sníží vraždu na nulu.</li>
<li><b>Přeměny.</b> Nejdřív přísaha Dvojitého agenta, pak kopie Napodobitele. Pro Mentalistu platí už dnes, noví členové Smrti ale zabíjejí až od další noci.</li>
<li><b>Vražda Smrti.</b> Cíl přežije, má-li v tomto pořadí: dočasné vzkříšení, Anděla strážného, Požehnání, štít Strážce, správnou předpověď Orákula. Jinak čepel schytá Osobní strážce — jinak cíl zemře.</li>
<li><b>Psychopat.</b> Značka platí, ledaže je cíl mrtvý nebo chráněný (vzkříšení, Anděl, Požehnání, Strážce).</li>
<li><b>Bomby a zbytek.</b> Bomba je férový hod mincí; Strážce ji nezastaví. Navštěvující Děvky zasáhne výbuch. Čtení, doručení, sázky.</li>
<li><b>Nekromant</b> vzkřísí mrtvé — jen pokud sám noc přežil.</li>
<li><b>Propojené osudy.</b> Děvky zemřou s navštívenou obětí Smrti; držitelé Sdílené noční můry a Náměsíčnosti zemřou se svým partnerem. Propojené smrti zabrání jen vzkříšení nebo Anděl strážný. Pak vyprší vypůjčený čas.</li>
<li><b>Úsvit.</b> Přeživší dostanou soukromé zprávy. Veřejnost se dozví jen to, kdo zemřel.</li>
</ol>`,
    phonesH: 'Hra na telefonech',
    phones: `<ul>
<li>Hostitel vytvoří místnost a sdílí šestiznakový kód nebo QR kód. Ostatní otevřou odkaz, zadají jméno a klepnou na <em>Připraven</em>.</li>
<li>Tvé místo je vázané na prohlížeč. Vybije-li se telefon, hostitel může ve svých ovládacích prvcích vydat jednorázový <b>kód pro obnovení</b>; po jeho zadání na novém zařízení se tvé místo přesune tam a staré zařízení se odhlásí.</li>
<li>Telefon hostitele je běžný hráčský telefon s pár tlačítky navíc: posunout fázi, přidat 30 sekund, ukončit hru. Hostitel nevidí role, Sny ani hlasy.</li>
<li><b>Veřejnou tabuli</b> (bez tajemství) můžeš zobrazit na televizi: otevři <span class="mono">/board/KÓD</span>.</li>
<li>Chce-li někdo vést stůl a vidět vše, vytvoř místnost jako <b>důvěryhodný moderátor</b>. Nemůže mít místo a všichni o tom vědí.</li>
<li>Každý si jazyk volí sám tlačítkem jazyka na úvodní obrazovce, v pozvánce nebo v menu místnosti. Výchozí jazyk stolu nastavuje hostitel v předsíni.</li>
<li>NĚMÝ, Mlha války a Prokleté ticho jsou naživo pravidla na čestné slovo. Na dálku je vynutí chat.</li>
</ul>`,
  },
};
