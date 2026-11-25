// Čeština: herní obsah (role, sny, karty pravidel, režimy, scénářové karty, návod).
export default {
  and: 'a',
  numbers: ['žádný', 'jeden', 'dva', 'tři', 'čtyři', 'pět', 'šest', 'sedm', 'osm', 'devět', 'deset'],
  roles: {
    G_UNDERTAKER: { name: "Hrobník", when: "Vždy", summary: "Máš pohřební rejstřík. Dej své partě jedno slovo a jedno číslo.", detail: "Jen ty a druhý Hrobník víte, co leží pod každým kamenem. Tvé slovo má spojit tolik hrobů tvé party a vést daleko od hrobu Smrti." },
    G_DIGGER: { name: "Kopáč hrobů", when: "Vždy", summary: "Čti Hrobníkovo znamení a vykopávej relikvie své party.", detail: "Domluvte se a pak hlasuj pro hrob na telefonu. Vaše relikvie: kopejte dál. Prázdný hrob nebo relikvie druhé party: tah přechází. Hrob Smrti: vaše parta prohrává." },
    O_SEER: { name: "Věštec", when: "Vždy", summary: "Tipni, kde se kolo zastaví, a otoč ho, když se to vyplatí.", detail: "Každé kolo tajně tipni Život, Smrt nebo Znovuzrození a rozhodni, zda kolo otočíš o krok (stojí to jeden z pěti Vlivů). Všechna otočení se sečtou. Správný tip má 3 body; nevyužitý Vliv má na konci po jednom bodu." },
    W_READER: { name: "Čtenář", when: "Vždy", summary: "Odpověz na dilema za sebe a tipni odpověď přítele.", detail: "Každé kolo odpovíš na vymyšlené dilema a tipneš odpověď hráče, kterého čteš. Správný tip má 2 body; tvoje odpověď nic, takže překvapit svého čtenáře je fér." },
    Q_MIMIC: { name: "Napodobitel", when: "Vždy", summary: "Nosíš tvář přítele. Nevíš, kde jsi.", detail: "Všichni ostatní jsou na jednom místě. Poslouchej otázky, odpovídej, jako bys tam patřil, a zjisti místo. Kdykoli se můžeš odhalit a pojmenovat ho, abys vyhrál; odsouzený Napodobitel má ještě poslední tip." },
    Q_LIVING: { name: "Živý", when: "Vždy", summary: "Znáš místo. Dokaž to, ale neprozraď ho.", detail: "Ptej se a odpovídej o místě: dost přesně, aby bylo jasné, že jsi tam byl, a dost mlhavě, aby to Napodobitel neuhodl. Jednou za hru můžeš obvinit; odsuzuje jen jednomyslný stůl." },
    S_GHOST: { name: "Duch", when: "Vždy", summary: "Zavraždili tě. Víš kdo, kde a proč, ale nemůžeš mluvit.", detail: "Pošli každému čtenáři vizi k jeho řadě. Studeným místem zamraz vizi, která není tvoje." },
    S_MEDIUM: { name: "Médium", when: "Vždy", summary: "Čti vize a zapal svíčky na pravdu.", detail: "Každé kolo čteš jednu řadu: kdo, kde nebo proč. Vyřešte všechny tři, než svíčky dohoří, a pak jmenujte Lháře." },
    S_DECEIVER: { name: "Lhář", when: "Vždy", summary: "Druhý duch v živém těle. Znáš pravdu a lžeš.", detail: "Vypadáš přesně jako Médium. Několikrát za hru vyměníš vizi Ducha jinému čtenáři za svou. Vyhraješ, pokud svíčky dohoří, nebo pokud stůl jmenuje špatného hráče." },
    N_SLEEPER: { name: "Spáč", when: "Vždy", summary: "Jedna noc, jedno hlasování. Tvoje karta může změnit majitele, zatímco spíš.", detail: "Jednou se podívej na kartu, jednej, když tě telefon vzbudí, pak se hádej a ukaž. Jsi tou kartou, která před tebou leží za úsvitu." },
    N_TWIN: { name: "Dvojče", when: "V noci", summary: "Probudíš se se svým dvojčetem a uvidíte se.", detail: "Dvojčata chodí v páru. Pokud tvé dvojče není mezi hráči, druhá karta leží na stole." },
    N_INSOMNIAC: { name: "Nespavec", when: "V noci, poslední", summary: "Probudíš se poslední a podíváš se na vlastní kartu.", detail: "Uvidíš, jestli ti v noci někdo vzal kartu, a čím jsi za úsvitu." },
    K_GUEST: { name: "Maskovaný host", when: "Vždy", summary: "Tancuj, nahlížej a hlas masky, abys sbíral Duše. 13 Duší vyhrává.", detail: "Tvoje maska je karta postavy, kterou jsi jednou viděl. Vyměň nebo předstírej, abys ji skryl; nahlédni, abys ji poznal; ohlas masku, abys použil její schopnost. Kdo si myslí, že je jeho, tě může vyzvat." },
    C_DIGGER: { name: "Hrobník", when: "Vždy", summary: "Zakopej své rakve, řekni, kolik jich dokážeš otevřít, a kopej. Dvě čisté vykopávky vyhrávají.", detail: "Tvoje Kletba je tvůj blaf: zakopej ji, ať na ni narazí ostatní. Když vyhraješ dražbu, otevíráš nejdřív vlastní hrob." },
    X_LIVING: { name: "Živý", when: "Vždy", summary: "V křišťálové kouli vidíš heslo. Řekni slovo, které dokáže, že ho znáš, ale nedej ho Démonovi.", detail: "Příliš jasné, a Démon heslo zjistí. Příliš nejasné, a stůl podezírá tebe. Pak označte Démona." },
    X_DEMON: { name: "Démon", when: "Vždy", summary: "Vidíš jen kategorii. Splyň s ostatními: řekni slovo, jako bys heslo znal.", detail: "Poslouchej ostatní a rozlušti heslo. Když stůl označí někoho jiného, vyhráváš. Když tě chytí, jeden správný pokus stejně vyhraje." },
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
    PSYCHO: { name: 'Psychopat', when: 'V noci (ve výchozím stavu jednou za hru)', summary: 'Jednou: umlč někoho nebo mu na další den vezmi hlas.', detail: 'NĚMÝ: nesmí mluvit v diskusi, ale může nominovat a hlasovat. BEZ HLASU: může mluvit, ale nehlasuje. Strážce, Anděl strážný a Požehnání čarodějnice to zablokují. Náboj se spotřebuje i při zablokování. Jak často, určuje stůl: ve výchozím stavu jednou za hru; hostitel může povolit jedno Umlčení a jedno Bez hlasu, nebo jedno označení každou noc.' },
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
      ["Najít starou účetní knihu", "Vypátrat věřitele", "Sehnat, co je dlužno", "Schůzka na rozcestí", "Zaplatit do haléře"],
      ["Najít staré milostné dopisy", "Zjistit, kam odešla", "Získat si její přátele", "Zařídit náhodné setkání", "Konečně to říct"],
      ["Spočítat, co zůstalo", "Setřít otisky prstů", "Spálit účtenky", "Ukrýt zbraň", "Nezanechat stopu"],
      ["Prohlédnout pokladnici", "Podplatit strážce", "Vyříznout sklo", "Vyměnit korunu", "Odejít s úsměvem"],
      ["Najít svědka", "Zjistit, co viděl", "Přestřihnout telefonní kabel", "Vylákat ho pryč", "Udržet ho v tichosti do úsvitu"],
      ["Najít závěť", "Dokázat, kdo jsi", "Přečkat ostatní dědice", "Otevřít rodinnou hrobku", "Vzít si, co je tvoje"],
      ["Navštívit jeho hrob", "Zjistit, kdo ho zradil", "Najít jejich úkryt", "Obrátit jejich přátele", "Vyrovnat účty"],
      ["Přihlásit se do soutěže", "Projít prvním kolem", "Přechytračit favorita", "Přežít finále", "Zvednout cenu"],
      ["Přečíst rozsudek", "Najít pravé alibi", "Vypátrat skutečného viníka", "Přesvědčit soudce", "Otevřít dveře cely"],
      ["Potají se sbalit", "Ukrást klíče od kočáru", "Proklouznout kolem otce", "Dostat se do kaple", "Říct ano před východem slunce"],
      ["Vykopat starou truhlu", "Přečíst, co v ní stojí", "Zjistit, kdo ještě ví", "Spálit poslední kopii", "Zakopat to hlouběji"],
      ["Prozkoumat příznaky", "Najít vzácnou bylinu", "Uvařit lék", "Vyzkoušet ho na sobě", "Zachránit pacienta"],
      ["Zapálit černé svíčky", "Vyslovit jeho jméno", "Otevřít kruh", "Položit otázku", "Poslat ho zpět"],
      ["Najít pravou pečeť", "Shromáždit starou gardu", "Zaútočit na brány", "Postavit se uzurpátorovi", "Usednout na trůn"],
      ["Najít ztracené skici", "Namíchat zakázaný pigment", "Malovat celou noc", "Ukrýt ho před kritiky", "Podepsat plátno"],
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
      ["Kostelní věž je jediná cesta na druhou stranu.", "Lucerny svítí v oknech pod vodou.", "Kolem propluje loďka, nikdo nevesluje.", "Vesnický zvon zvoní zpod hladiny.", "Voda stoupá a domy se plní hlasy."],
      ["Orchestr ladí. Hudebníci tu nejsou.", "Lóže pět je vždy rezervovaná. Dnes v ní někdo sedí.", "Lustr se houpe, ačkoli netáhne.", "Primadona zazpívá tón, který rozbije zrcadla.", "Opona se zvedá k poslednímu jednání. Jste v něm."],
      ["Brána se otevře dřív, než se jí dotknete.", "Čerstvý hrob a na kameni vaše iniciály.", "Vrány vás počítají.", "Někdo o tyto hroby pečuje. Každou noc.", "Země si povzdechne a pohne se."],
      ["Dalekohled už na něco míří.", "Na hvězdné mapě je o hvězdu víc.", "Kupole se nezavře a Měsíc nahlíží dovnitř.", "Poznámky astronoma končí slovy: blíží se to.", "Začíná zatmění, o dvanáct let dřív."],
      ["Orchestr hraje valčík, jehož kroky nikdo nezná.", "Každý tanečník nosí masku a nikdo z nich nemá tvář.", "Šampaňské nikdy nedojde. To je ten problém.", "Zrcadla ukazují ples před sto lety.", "Hudba ztichne. Všichni se otočí k vám."],
      ["Led je tak průzračný, že pod ním vidíte tváře.", "Stopy bruslí krouží kolem díry, která tu předtím nebyla.", "Rybářské boudy jsou prázdné, vlasce ještě napnuté.", "Prasklina se k vám plíží, pomalu a záměrně.", "Pod vašima nohama něco klepe, abyste to pustili ven."],
      ["Cirkusový stan stojí přes noc a nikdo ho nepostavil.", "Věštkyně už zná vaše jména.", "Lví klec je otevřená. Lev chybí.", "Principál ohlásí číslo, se kterým jste nikdy nesouhlasili.", "Cirkus se kolem vás balí. Teď jste součástí představení."],
      ["Knihy jsou suché, ačkoli voda sahá po pás.", "Katalogový lístek uvádí knihu o vás.", "Knihovnice vás zpod hladiny utišuje.", "Stránky se v proudu otáčejí samy.", "Na nejhlubší polici je jediný výtisk. Voda stoupá."],
      ["Perník lákavě voní. Tak vás dostane.", "Kotlík bublá, ačkoli nikdo nezapálil oheň.", "Černá kočka vám ukazuje cestu. Nevěřte jí.", "Sklenice na polici mají štítky s vašimi jmény.", "Čarodějnice se vrátí dřív."],
      ["Králové leží v řadě. Jedna rakev je otevřená.", "Pochodně se zapalují samy, když procházíte.", "Nápis varuje: projde jen královská krev.", "Socha královny otočila hlavu.", "Kamenné dveře se za vámi se skřípěním zavřou."],
      ["Z útesů bliká lucerna. Nikdo neodpovídá.", "Jeskyně je plná beden, na každé lebka.", "Příliv přichází rychleji, než uvádějí mapy.", "Celníci na pláži a pašerák mezi vámi.", "Poslední loď odplouvá o půlnoci, s vámi, nebo bez vás."],
      ["Stánky otevírají o půlnoci a prodávají, co jste ztratili.", "Kupec nabízí výhodný obchod. Cenou je vzpomínka.", "Mince v kapsách se proměnily v listí.", "Někdo prodává mapu místa, kam jdete.", "Za úsvitu celý trh zmizí. Pospěšte si."],
      ["Lopatky se točí, ačkoli vítr utichl.", "Z mlýna se valí kouř, ale nic neshoří.", "Mlynář stále mele mouku uprostřed ohně.", "Nahoru vede jen žebřík a už doutná.", "Velké kolo se zřítí ve spršce jisker."],
      ["Pacienti všichni spí a všichni se usmívají.", "Lékařovy spisy jsou psané vaším písmem.", "Lanovka jezdí jen dolů.", "Pokoj 9 je studený, ačkoli radiátor žhne.", "Lavina zatarasí cestu. Teď už nikdo neodejde."],
      ["Za každou zatáčkou vidíte o kousek horší verzi sebe.", "Jeden odraz se o chvilku opožďuje.", "Někdo v zrcadlech nosí masku s vaší tváří.", "Šipka východu ukazuje všemi směry.", "Zrcadla prasknou a vaše odrazy vykročí ven."],
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
    graverobbers: { name: "Dead Set: Vykradači hrobů", blurb: "Dvě party vykradačů hrobů, Měsíc a Slunce, překopávají hřbitov slov nebo ikon pro relikvie svého božstva. Co leží pod zemí, vědí jen Hrobníci. Jeden hrob patří Smrti." },
    omen: { name: "Dead Set: Znamení", blurb: "Okultní kolo ukazuje na Život, Smrt nebo Znovuzrození. Kdokoli ho může tajně otočit; tipni, kde se zastaví." },
    mirror: { name: "Dead Set: Zrcadlo", blurb: "Strašidelné zrcadlo ukazuje, co si přátelé myslí, že uděláš. Odpověz na dilema a čti toho, koho máš naproti." },
    mimic: { name: "Dead Set: Napodobitel", blurb: "Všichni vědí, kde jste, kromě toho, kdo nosí tvář přítele. Ptej se, odpovídej, obviňuj; Napodobitel naslouchá, kde to je." },
    seance: { name: "Dead Set: Seance", blurb: "Němý zavražděný Duch posílá vize; Média z nich luští kdo, kde a proč. Lhář mezi nimi vyměňuje vize za lži." },
    midnight: { name: "Dead Set: Půlnoc", blurb: "Jedna noc, jedno hlasování. Karty ve tmě mění majitele; za úsvitu jsi tím, co leží před tebou. Najdi Smrt, nebo jí buď." },
    carnival: { name: "Dead Set: Karneval", blurb: "Maškarní ples blafování a paměti. Každý nosí kartu postavy jako masku, míchanou, dokud si nikdo není jistý. Hlas masky a sbírej Duše; 13 vyhrává." },
    coffins: { name: "Dead Set: Rakve", blurb: "Rychlá blafovací hra. Zakopej zlato a jednu kletbu, nabídni, kolik rakví dokážeš otevřít, a kopej. Dvě čisté vykopávky vyhrávají." },
    exorcism: { name: "Dead Set: Exorcismus", blurb: "Slovní hra plná blafování. V křišťálové kouli všichni vidí heslo, kromě Démona. Každý jedno slovo, pak odhalte Démona." },
    missions: { name: "Dead Set: Mise", blurb: "Týmy, hlasování a sabotáž. Nikdo neumírá: veďte mise, čtěte hlasy a najděte Smrt dřív, než ona najde Médium." },
    standard: { name: 'Standard', blurb: 'Zamýšlený zážitek z Dead Set. Deset rozšířených rolí od 7 hráčů, Sen pro každého každou noc, 1–3 karty pravidel.' },
    classic: { name: 'Klasika / Učení', blurb: 'Na učení. Jen základní role — rozšířená místa obsadí Nevinní. Sny ve výchozím stavu vypnuté, nejvýš jedno jednoduché pravidlo.' },
    full: { name: 'Celý balík / Chaos', blurb: 'Všech 17 rozšířených rolí včetně Šaška, Barda a Čarodějnice. Hodně náhody, jen pro zkušené skupiny.' },
    doomsday: { name: 'Soudný den', blurb: 'Standard proti času. Nevyhraje-li nikdo do konce posledního dne, vyhrává Smrt.' },
    custom: { name: 'Vlastní', blurb: 'Vyber si rozšířený zásobník, Sny, pravidla i hodiny sám — nebo napiš přesný balík. Upozorní na nevyvážené sestavy.' },
  },
  scenario: {
    WHO: ['Cestovatelé v čase', 'Vesmírní průzkumníci', 'Mýtické bytosti', 'Duchové historických osobností', 'Mutanti', 'Členové tajného spolku', 'Ztracení turisté', 'Umělé inteligence', 'Středověcí vesničané', 'Dvojníci celebrit', "Cirkusáci v důchodu", "Strážci majáků", "Soupeřící kuchaři", "Vyhnaní šlechtici", "Noční zdravotní sestry", "Hlubinní potápěči", "Svatební hosté", "Uvízlí astronomové", "Tanečníci maškarního plesu", "Mlčenliví mniši", "Půlnoční zahradníci", "Hodináři", "Pašeráci", "Operní pěvci", "Vykradači hrobů", "Královská garda", "Rybáři", "Alchymisté", "Bankéři", "Průvodčí vlaků", "Věštkyně", "Horští vůdci", "Lampáři", "Loutkáři", "Pozorovatelé ptáků", "Pohřebníci", "Karetní podvodníci", "Lovci", "Polykači ohně", "Zaklínači hadů"],
    WHERE: ['Potápějící se loď', 'Opuštěný zábavní park', 'Podzemní bunkr', 'Strašidelné sídlo', 'Zasněžená tundra', "Maják zahalený mlhou", "Opuštěná vesmírná stanice", "Noční vlak přes hory", "Zatopená katedrála", "Zarostlá botanická zahrada", "Hotel v pouštní oáze", "Odlehlý klášter", "Vinice v měsíčním světle", "Opuštěné filmové studio", "Muzeum hodinových strojků", "Zatopená vesnice", "Opera při svíčkách", "Zapomenutý hřbitov", "Lunární observatoř", "Pozlacený taneční sál", "Zamrzlé jezero", "Kočovný cirkus", "Potopená knihovna", "Chaloupka čarodějnice", "Královská krypta", "Pašerácká zátoka", "Půlnoční trh", "Hořící větrný mlýn", "Alpské sanatorium", "Zrcadlové bludiště"],
    WHY: ['Najít ukrytý poklad', 'Uniknout, než vyprší čas', 'Dokončit rituál', 'Vyřešit vraždu', 'Zastavit hrozící katastrofu', "Zlomit prastarou kletbu", "Vyhrát jmění v kartách", "Ochránit královského dědice", "Najít cestu domů", "Odhalit zrádce", "Přežít do svítání", "Získat zpět ukradenou relikvii", "Probudit spící město", "Rozluštit poslední zprávu", "Uchovat strašné tajemství", "Vyrovnat starý dluh", "Získat zpět ztracenou lásku", "Zahladit důkazy", "Ukrást korunovační klenoty", "Umlčet svědka", "Získat dědictví", "Pomstít bratra", "Vyhrát hlavní cenu", "Dokázat svou nevinu", "Utéct před úsvitem", "Pohřbít minulost", "Vyléčit podivnou nemoc", "Přivolat ducha", "Získat zpět ukradený trůn", "Dokončit mistrovské dílo"],
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
  // The Mirror: dilemmas by stable id, [prompt, A, B, C] (see public/dilemmas.js).
  dilemmas: {
    d001: ["O půlnoci klepe cizinec, promočený bouří, a prosí, aby mohl dovnitř.", "Pustíš ho dovnitř", "Mluvíš s ním přes dveře", "Děláš, že nikdo není doma", "Půlnoční návštěvník"],
    d002: ["Na půdě nového domu najdeš zamčený deník.", "Vylomíš zámek a přečteš ho", "Vrátíš ho starým majitelům", "Spálíš ho nepřečtený", "Zamčený deník"],
    d003: ["Věštkyně ti nabídne, že ti řekne den tvé smrti.", "Vyslechneš ji", "Zdvořile odmítneš", "Zeptáš se raději na někoho jiného", "Věštkyně"],
    d004: ["Na večírku zhasnou světla a ozve se výkřik.", "Běžíš za výkřikem", "Nejdřív hledáš svíčku", "Zůstaneš úplně bez hnutí", "Večeře ve tmě"],
    d005: ["Duch ti nabídne, že týden bude strašit kohokoli, koho určíš.", "Určíš rivala", "Určíš přítele, pro legraci", "Odmítneš", "Vypůjčený duch"],
    d006: ["Zdědíš rozpadající se hrad i s rodinnou kletbou.", "Stejně se nastěhuješ", "Hned ho prodáš", "Uděláš z něj hotel", "Prokletý hrad"],
    d007: ["Na parapet ti každou noc ve tři usedne havran.", "Nakrmíš ho", "Povídáš si s ním", "Zatáhneš závěsy", "Havran ve tři ráno"],
    d008: ["Můžeš strávit noc zamčený na slavném strašidelném místě.", "V hradní kobce", "V opuštěném blázinci", "Na lodi duchů na moři", "Noc mezi duchy"],
    d009: ["Tvůj odraz mrkne o okamžik později než ty.", "Zíráš na něj, dokud neuhne", "Zakryješ všechna zrcadla", "Zamáváš a uvidíš, co se stane", "Opožděný odraz"],
    d010: ["Seance se pokazí a duch tě žádá o laskavost.", "Vyslechneš ho", "Seanci okamžitě ukončíš", "Nejdřív si něco vyjednáš", "Prosba ducha"],
    d011: ["Poslední vlak domů je prázdný, až na jednoho mlčenlivého cestujícího.", "Sedneš si vedle něj", "Sedneš si co nejdál", "Počkáš na další vlak", "Poslední vlak"],
    d012: ["Do posmrtného života si můžeš vzít jeden předmět.", "Fotografii", "Dobrou knihu", "Balíček karet", "Zavazadlo na onen svět"],
    d013: ["Prokletá mince přináší štěstí, ale každý den tě stojí jednu vzpomínku.", "Necháš si ji", "Dáš ji někomu dál", "Hodíš ji do řeky", "Prokletá mince"],
    d014: ["Za soumraku zabloudíš v mlžném lese.", "Jdeš za vzdálenými světly", "Vylezeš na strom a čekáš", "Vrátíš se cestou, kterou jsi přišel", "Mlžný les"],
    d015: ["Na maškarním plese má někdo jako masku tvou tvář.", "Postavíš se mu", "Potichu ho sleduješ", "Vyměníš si masky a odejdeš", "Vypůjčená tvář"],
    d016: ["O každém u tohoto stolu se můžeš dozvědět jedno tajemství.", "Jeho největší strach", "Jeho největší lež", "Jeho tajný talent", "Tajemství stolu"],
    d017: ["Cestou na důležitou schůzku ti přeběhne přes cestu černá kočka.", "Pokračuješ", "Vydáš se jinou cestou", "Zastavíš se a pohladíš ji", "Černá kočka"],
    d018: ["Ve tvém domě straší přátelský, ale velmi hlučný duch.", "Naučíš se s ním žít", "Zavoláš exorcistu", "Budeš vybírat vstupné od turistů", "Hlučný duch"],
    d019: ["Probudíš se jako upír.", "Přijmeš noční život", "Hledáš lék", "Utajíš to a žiješ dál", "Čerstvý upír"],
    d020: ["Záhadný dopis tě zve do sídla na čtení závěti.", "Jdeš sám", "Jdeš s přítelem", "Nevšímáš si ho", "Čtení závěti"],
    d021: ["Ve starém hostinci jsi poslední host vzhůru a vrzají schody.", "Jdeš to prozkoumat", "Zamkneš dveře", "Předstíráš spánek", "Vrzající schody"],
    d022: ["Čarodějnice ti dá jeden lektvar zdarma.", "Nápoj lásky", "Nápoj pravdy", "Nápoj neviditelnosti", "Lektvar zdarma"],
    d023: ["Můžeš žít v kterémkoli století, bez cesty zpět.", "V minulosti", "Tady a teď", "V daleké budoucnosti", "Století bez návratu"],
    d024: ["Mluvící portrét nabízí rady výměnou za drby.", "Vyměníš drby", "Nevšímáš si ho", "Otočíš ho ke zdi", "Mluvící portrét"],
    d025: ["Tvoje skupina uvízla na chatě a zítra dojde jídlo.", "Povedeš útěk", "Rozdělíte zásoby a počkáte", "Prohledáš sklep", "Zapadlá chata"],
    d026: ["Z lesa slyšíš vlastní hlas, jak tě volá jménem.", "Odpovíš", "Jdeš za ním", "Utečeš na druhou stranu", "Hlas v lese"],
    d027: ["Džin splní jedno přání, ale musí být zformulované dokonale.", "Přeješ si bohatství", "Přeješ si více přání", "Přeješ si džinovu svobodu", "Džinovo přání"],
    d028: ["Stará hrací skříňka každou noc hraje sama od sebe.", "Natáhneš ji sám", "Vyndáš z ní mechanismus", "Nahraješ ji jako důkaz", "Hrací skříňka"],
    d029: ["Do konce života můžeš jíst jen jedno jídlo.", "Velkou hostinu", "Obyčejný chléb a polévku", "Něco sladkého", "Jediné jídlo"],
    d030: ["Najdeš mapu vlastní zahrady s vyznačeným X.", "Kopeš ještě dnes v noci", "Kopeš za denního světla s přáteli", "Necháš to zakopané", "Zakopaný křížek"],
    d031: ["Přítel se ti přizná, že je tajně vlkodlak.", "Pomůžeš mu to utajit", "Za úplňku ho zamkneš", "Požádáš ho, ať ti ukáže proměnu", "Přítel vlkodlak"],
    d032: ["Na jeden den si můžeš vyměnit život s kýmkoli u tohoto stolu.", "S někým nebojácným", "S někým bohatým", "S někým tajemným", "Vypůjčený život"],
    d033: ["Hrobník ti nabízí slevu, když si pohřeb naplánuješ předem.", "Velkolepý průvod", "Tichý obřad", "Večírek s tancem", "Předčasný pohřeb"],
    d034: ["Ve tvém domě jdou hodiny pozpátku.", "Opravíš je", "Necháš je být", "Pokusíš se je využít", "Zpětné hodiny"],
    d035: ["Ve městě je cirkus a klaun ti strčí lístek na tajné představení.", "Jdeš", "Lístek někomu daruješ", "Roztrháš ho", "Tajné představení"],
    d036: ["Můžeš mluvit s jedním druhem zvířat.", "S kočkami", "S vránami", "Se psy", "Zvířecí řeč"],
    d037: ["Bouře tě na noc uvězní v majáku se strážcem, který nikdy nespí.", "Zůstaneš vzhůru a povídáš si", "Spíš s jedním okem otevřeným", "Vzdoruješ bouři", "Strážce, který nespí"],
    d038: ["Tvůj stín se začne pohybovat sám od sebe.", "Jdeš za ním", "Držíš se světla", "Spřátelíš se s ním", "Neklidný stín"],
    d039: ["Nabízejí ti nesmrtelnost, ale toto město už nikdy neopustíš.", "Přijmeš", "Odmítneš", "Řekneš si o větší město", "Město navždy"],
    d040: ["Jednoho rána je zapečetěná hrobka na hřbitově otevřená.", "Nahlédneš dovnitř", "Řekneš to faráři", "Zavřeš ji a mlčíš", "Otevřená krypta"],
    d041: ["Jednu z těchto věcí si můžeš nechat navždy.", "Klíč, který otevře každé dveře", "Svíčku, která nikdy nezhasne", "Kompas, který ukazuje domů", "Památka"],
    d042: ["Na aukci se levně prodává prokletý obraz.", "Přihodíš", "Varuješ ostatní dražitele", "Odejdeš", "Levný obraz"],
    d043: ["Vesnice tě požádá, abys hlídal most v noci, kdy přes něj něco přejde.", "Budeš hlídat", "Nastražíš past", "Najdeš důvod, proč být pryč", "Hlídka na mostě"],
    d044: ["Otevřeš sušenku štěstí a v ní stojí: Nevěř tomu, kdo sedí nalevo od tebe.", "Uvěříš", "Zasměješ se", "Ukážeš mu to", "Sušenka štěstí"],
    d045: ["Můžeš znovu prožít jeden den svého života.", "Svůj nejšťastnější den", "Den, kdy napravíš chybu", "Obyčejný, líný den", "Ten den znovu"],
    d046: ["Zrcadlo ve starožitnictví tě ukazuje o deset let staršího.", "Koupíš ho", "Zeptáš se, co ukazuje", "Rychle odejdeš", "Zrcadlo budoucnosti"],
    d047: ["Na celý život ti přidělí ducha strážce.", "Rytíře", "Babičku", "Uličnické dítě", "Duch strážce"],
    d048: ["Hostitel večírku zamkl všechny dveře zvenku.", "Hledáš jiný východ", "Bavíš se dál", "Žádáš vysvětlení", "Zamčený večírek"],
    d049: ["Můžou si tě pamatovat jen pro jednu věc.", "Pro laskavost", "Pro odvahu", "Pro humor", "Jediná vzpomínka"],
    d050: ["Na prahu se ti objeví kniha kouzel.", "Vyzkoušíš jedno kouzlo", "Přečteš ji, ale nic nečaruješ", "Odneseš ji do knihovny", "Kniha kouzel"],
    d051: ["Nabídnou ti místo na lodi, která se ze svých plaveb ještě nikdy nevrátila.", "Vyplouváš", "Zůstaneš na břehu", "Nejdřív se zeptáš posádky", "Loď bez návratu"],
    d052: ["Zjistíš, že v sousední vesnici žije tvůj dvojník.", "Setkáš se s ním", "Sleduješ ho zdálky", "Odstěhuješ se", "Dvojník z vesnice"],
    d053: ["U večeře všechny svíčky najednou zmodrají.", "Jíš dál", "Sfoukneš je", "Zeptáš se místnosti, kdo tu je", "Modré svíčky"],
    d054: ["Jednou můžeš na hodinu zastavit čas.", "Využiješ to ještě dnes", "Schováš si to na nouzi", "Prospíš to", "Zastavená hodina"],
    d055: ["Chrlič na katedrále po tobě chce hádanku.", "Řekneš mu jednu", "Řekneš si o hádanku od něj", "Děláš, že neslyšíš", "Chrličova hádanka"],
    d056: ["Na tvém vlastním pohřbu hraje tvoje oblíbená píseň. Která?", "Něco smutného", "Něco veselého", "Něco, co nikdo nečeká", "Píseň na pohřeb"],
    d057: ["Ve strašidelném městě můžeš mít jediné zaměstnání.", "Hrobník", "Hostinský", "Noční hlídka", "Řemeslo ve strašidelném městě"],
    d058: ["Přítel si půjčí tvůj kabát a vrátí ho s dopisem od cizince v kapse.", "Přečteš dopis", "Vrátíš mu ho", "Najdeš cizince", "Dopis od cizince"],
    d059: ["Vychází úplněk a všichni psi ve městě začnou výt.", "Zamkneš dveře", "Jdeš se ven podívat", "Vyješ s nimi", "Vytí na měsíc"],
    d060: ["Můžeš se vzdát jednoho smyslu, aby se ostatní zostřily.", "Chuti", "Čichu", "Nikdy, ani jednoho", "Vyměněný smysl"],
    d061: ["Před tebou zastaví kočár bez kočího.", "Nastoupíš", "Hledáš kočího", "Jdeš dál", "Kočár bez kočího"],
    d062: ["Můžeš přesně vědět, co si o tobě doopravdy myslí jeden člověk.", "Tvůj nejlepší přítel", "Tvůj rival", "Nikdo, děkuji", "Pravý názor"],
    d063: ["Přižene se hustá mlha a městský zvon odbije třináct.", "Spočítáš to znovu", "Schováš se uvnitř", "Jdeš do zvonice", "Třináctý úder"],
    d064: ["Zjistíš, že tvůj dům má skrytou místnost.", "Hned ji otevřeš", "Počkáš na denní světlo", "Přetapetuješ ji", "Skrytý pokoj"],
    d065: ["Potulný obchodník prodává štěstí v lahvích.", "Koupíš si lahev", "Koupíš celou bednu", "Vyženeš ho z města", "Podomní obchodník"],
    d066: ["Musíš strávit rok sám v horském klášteře.", "Vezmeš hromadu knih", "Vezmeš hudební nástroj", "Vezmeš deník", "Rok v horách"],
    d067: ["Čajové lístky vytvoří jméno, které neznáš.", "Hledáš toho člověka", "Vypiješ další šálek", "Nikomu nic neřekneš", "Čajové lístky"],
    d068: ["Jako host můžeš navštívit kterýkoli večírek v dějinách.", "Královskou korunovaci", "Divoký maškarní ples", "Legendární koncert", "Večírek v dějinách"],
    d069: ["Umírající muž ti podá klíč a zašeptá: Nikdy ho neotvírej.", "Otevřeš ho", "Necháš si ho navždy", "Zahodíš ho", "Zakázaný klíč"],
    d070: ["Stůl musí vybrat, kdo první prozkoumá kryptu.", "Přihlásíš se", "Navrhneš někoho jiného", "Navrhneš tahat sirky", "První do krypty"],
    d071: ["Nabídnou ti místo u Smrtina stolu na večeři.", "Zdvořile přijmeš", "Doneseš dárek", "Vymluvíš se", "Večeře se Smrtí"],
    d072: ["Stará fotografie tě ukazuje na večírku před sto lety.", "Pátráš po tom", "Zarámuješ ji", "Schováš ji", "Stará fotografie"],
    d073: ["Podle libosti se můžeš proměnit v jedno stvoření.", "V netopýra", "Ve vlka", "V kočku", "Měňavec"],
    d074: ["Někdo ti každou noc nechává květiny na prahu.", "Zůstaneš vzhůru, abys viděl kdo", "Necháš děkovný lístek", "Přestaneš otvírat dveře", "Květiny za dveřmi"],
    d075: ["Během hororu kvůli bouři vypadne proud.", "Vyprávíš strašidelné příběhy", "Jdeš spát", "Při svíčkách sehraješ konec", "Výpadek proudu"],
    d076: ["Můžeš vrátit zpět jeden vynález v dějinách.", "Budíky", "Mobilní telefony", "Nic, ať je všechno tak", "Zrušený vynález"],
    d077: ["O půlnoci na křižovatce ti cizinec nabídne, že naladí tvou kytaru.", "Podáš mu ji", "Nejdřív se zeptáš na cenu", "Odejdeš i s kytarou", "Cizinec na rozcestí"],
    d078: ["Na jediný rozhovor můžeš někoho přivést zpět.", "Příbuzného", "Slavnou osobnost", "Kamaráda z dětství", "Poslední rozhovor"],
    d079: ["Přes noc se v kuchyňské podlaze objeví padací dveře.", "Slezeš dolů", "Zatlučeš je", "Hodíš dovnitř minci a posloucháš", "Padací dvířka"],
    d080: ["Dohořívá poslední svíčka a držet ji může jen jeden z vás.", "Vezmeš si ji", "Nabídneš ji někomu jinému", "Společně ji sfouknete", "Poslední svíčka"],
  },
  guide: {
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
    title: 'Jak se<br><i>hraje.</i>',
    toc: ['Základy', 'Jedno kolo', 'Vítězství', 'Základní role', 'Rozšířené role', 'Celý balík', 'Sny', 'Karty pravidel', 'Režimy', 'Noční pořadí', 'Telefony'],
    basicsH: 'Základy',
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
<li><b>Klidný první den</b> (ve výchozím stavu zapnutý): první den se jen mluví. Nikoho nelze nominovat a nehlasuje se; první rozsudek může padnout druhý den.</li>
<li><b>Psychopat</b>: jak často smí Psychopat někoho označit. Jednou za hru (výchozí); jednou Umlčení a jednou Bez hlasu, v libovolném pořadí; nebo jednou každou noc.</li>
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
    kicker: "Kniha pravidel",
    intro: "Dead Set je rodina společenských her pro jednu místnost. Každý hraje na vlastním telefonu; televize, pokud ji máte, je společné jeviště. Vyberte si hru, přečtěte si její kapitolu a hrajte.",
    aboutH: "Co je Dead Set",
    about: `<p>Dead Set je sbírka společenských her (skryté role, blafování, slovní hry, předpovědi), které sdílejí jeden stůl. Každá hra funguje stejně: <b>telefon každého hráče je soukromá obrazovka</b>, která ukazuje jen to, co smí vědět, a aplikace je vypravěč, takže nikdo nemusí vynechat, aby hru řídil.</p>
<ul>
<li><b>Bez instalace.</b> Běží v prohlížeči. Připojíte se šestimístným kódem, odkazem nebo QR kódem.</li>
<li><b>3 až 25 hráčů</b>, podle hry. Každá kapitola uvádí počet hráčů a délku.</li>
<li><b>Televize je volitelná, ale nejlepší.</b> Ukazuje stůl, scény, body a hraje hudbu. Nikdy neukáže tajemství.</li>
<li><b>Sedm jazyků.</b> Každý si vybere svůj; slovní hry používají na všech telefonech jazyk stolu, aby se slova shodovala.</li>
<li><b>Jeden stůl, mnoho her.</b> Mezi koly můžete v lobby změnit hru; v rámci zápasu se body přenášejí.</li>
</ul>`,
    tableH: "Otevření stolu",
    table: `<ol>
<li><b>Otevřít stůl.</b> Hostitel klepne na <em>Otevřít stůl</em>, zadá jméno a dostane šestimístný kód místnosti.</li>
<li><b>Pozvání.</b> Pošlete kód, odkaz nebo QR kód. Ostatní klepnou na <em>Přidat se ke stolu</em> (nebo otevřou odkaz), zadají jméno a vyberou si portrét.</li>
<li><b>Zapněte televizi.</b> Klepněte v lobby na <em>TV tabule</em>, nebo otevřete místnost v prohlížeči televize a zvolte <em>Otevřít stůl na TV</em>. Stůl může najednou ukazovat více obrazovek.</li>
<li><b>Místa.</b> Hráči sedí kolem stolu v pořadí, v jakém se připojili. Hostitel může klepnout na místo a hráče přesunout nebo odebrat.</li>
</ol>
<p>Tvoje místo je vázané na tvůj prohlížeč. Pokud telefon selže, hostitel ti v menu místnosti dá jednorázový kód pro obnovení; na novém telefonu zvol <em>Obnovit mé místo</em>, zadej ho a tvoje místo (i s tajemstvími) se přesune. Telefon, který vypadne, si místo ponechá a po návratu dožene ostatní.</p>
<p>Pokud chce někdo hru řídit a vidět všechno, otevřete místnost s <b>důvěryhodným moderátorem</b>. Moderátor nemá místo u stolu a všichni jsou o tom informováni.</p>`,
    setupH: "Nastavení hry",
    setup: `<p>Lobby provede hostitele u každé hry stejnými očíslovanými kroky. Hosté vidí tytéž kroky, jen ke čtení.</p>
<ol>
<li><b>Hra.</b> Vyberte si jednu, seřazené podle rodin: Skryté věrnosti, Karty z ruky do ruky, Čtení lidí, Znamení a hádanky, Blaf a sázka.</li>
<li><b>Jak to funguje.</b> Čtyři nebo pět ilustrovaných kroků: celá hra na první pohled.</li>
<li><b>Balíček.</b> Co se při tomto počtu hráčů rozdá: role, masky, karty nebo místa. Mění se, jak se hráči připojují.</li>
<li><b>Pravidla.</b> Vlastní přepínače hry. Výchozí nastavení dají dobrou první hru.</li>
<li><b>Stůl.</b> Jazyk stolu, hudba a její styl, pozadí a (kde to něco mění) zda hrajete v jedné místnosti, nebo na dálku s chatem.</li>
<li><b>Časovače.</b> Jak dlouho trvá každý krok. Sbalené; výchozí hodnoty vyhovují většině stolů.</li>
</ol>
<p>Když si nastavení přečtou, všichni klepnou na <b>Připraven</b> a hostitel hru spustí. Problém s nastavením (například málo hráčů na nějakou roli) se zobrazí jako poznámka pod kroky.</p>`,
    playH: "Jak se hraje každá hra",
    play: `<ul>
<li><b>Nikdy neukazuj svou obrazovku.</b> Tvůj telefon ukazuje tvou roli, karty a volby. Všechno ostatní se říká nahlas, nebo ukazuje v televizi.</li>
<li><b>Společné scény.</b> Velké chvíle (odhalení, sčítání hlasů, noc) běží na všech telefonech i v televizi najednou a stejně dlouho. Nedají se přeskočit a během nich neběží časovač.</li>
<li><b>Výběr hráče:</b> klepni na jeho místo v kruhu stolu. Místo, které můžeš vybrat, pulzuje; tvoje volba zbělá jako pergamen.</li>
<li><b>Potvrzení:</b> soukromá volba (hlas, karta zahraná lícem dolů, předpověď) je <b>klepnutí</b> a dá se změnit do konce kroku. <b>Podržení</b> je jen pro veřejné tahy, které nejde vzít zpět, a tlačítko to vždy říká: drž prst, dokud se zlatá výplň nedokončí.</li>
<li><b>Záhlaví</b> ukazuje aktuální krok hry a jeho číslo (Noc II, Mise 3, Kolo 4…) se zbývajícím časem.</li>
<li><b>Pod stolem:</b> <em>Moje karta</em> (tvoje role, kdykoli), přehled hry, tvoje soukromé <em>Poznámky</em> a <em>Příběh</em>, pokud je hra má.</li>
<li><b>Časovače.</b> Když vyprší čas, hra jedná za každého, kdo ještě nejednal: většinou pas nebo zdržení se, ale některé hry volí za tebe (Rakve například zakopou náhodnou rakev). Hostitel může v menu místnosti přidat 30 sekund, pokračovat nebo hru ukončit.</li>
<li><b>Upozornění</b> na to, co právě udělali ostatní, se na chvíli objeví v záhlaví.</li>
<li><b>Čestná pravidla.</b> Některá pravidla (mlčení, umlčení hráči) dokáže dodržet jen samotný stůl. Při hře na dálku je vynutí chat.</li>
</ul>`,
    afterH: "Po hře",
    after: `<p>Závěrečná obrazovka vyhlásí vítěze, odhalí každé tajemství a ve většině her přehraje, co se doopravdy stalo. Projdi si rekapitulaci vlastním tempem.</p>
<p>Mnoho her se hraje jako <b>zápas</b> z 1, 3 nebo 5 her: body se přenášejí a stůl se vrátí do stejné lobby se stejným nastavením, všichni připraveni na další hru. V lobby může hostitel přepnout i na jinou hru; stůl, místa i portréty zůstávají.</p>`,
    hSetup: "Příprava",
    hCast: "Postavy",
    hLoop: "Průběh hry",
    hWin: "Vítězství a body",
    hOpts: "Možnosti v lobby",
    classicP: "Původní Dead Set: skryté role, noční vraždy a tajné hlasování ve dne. Většina z vás chce přežít. Několik z vás je Smrt. Nikdo neví, kdo je kdo — kromě Smrti, která zná své spoluhráče.",
    presetsH: "Varianty",
    modesTh: ['Varianta', 'Hráči', 'Co se mění'],
    classicSetup: `<p>5–13 hráčů (s vlastním balíčkem až 25). Každý dostane tajnou <b>roli</b>. Většina rolí patří na stranu <b>ne-Smrti</b>; jeden nebo více hráčů je tajně <b>Smrt</b> a hráči Smrti se navzájem znají. Noc a den se střídají, dokud jedna strana nevyhraje.</p>
<ul>
<li><b>Role</b> jsou to, kým jsi celou hru: tvoje strana a tvoje schopnost.</li>
<li><b>Sny</b> jsou účinky na jednu noc: od 1. noci si každý živý hráč každou noc tajně táhne jeden.</li>
<li><b>Karty pravidel</b> (1–3, tažené při nastavení) ohýbají celou hru: dvojité vraždy, vážené hlasy, duchové, kteří hlasují.</li>
<li><b>Příběh</b> (KDO / KDE / PROČ) je čisté vyprávění. Nikdy nemění pravidlo.</li>
</ul>
<p>O své roli můžeš mluvit pravdu, lhát, nebo mlčet. Hostitel hraje jako ostatní a nevidí víc tajemství.</p>`,
    missionsSetup: `<p>5–12 hráčů. Nikdo neumírá: Smrt se vetřela do výpravy a stůl ji musí najít dřív, než ona najde Médium. Každý dostane tajnou roli. Hráči Smrti se vidí (kromě Tuláka); Živí znají jen sebe a Médium vycítí, kdo je Smrt.</p>
<p>Stůl hraje pět misí. Každá mise potřebuje tým dané velikosti (v lobby a v televizi); od 7 hráčů potřebuje 4. mise k nezdaru dvě Sabotáže.</p>`,
    missionsLoop: `<ol>
<li><b>Karta mise.</b> Každá mise začíná kartou. Většina je běžných; občas některá změní tým, hlasování nebo odhalení této mise.</li>
<li><b>Návrh.</b> Vůdce mise (drží lucernu) klepe na hráče v kruhu a sestavuje tým.</li>
<li><b>Hlasování o týmu.</b> Všichni tajně klepnou na Schválit nebo Zamítnout. Hlasy se otočí najednou, se jmény. Většina tým vyšle; jinak lucerna přejde na dalšího hráče. Pátý návrh mise platí bez ohledu na hlasování.</li>
<li><b>Mise.</b> Každý člen týmu zahraje kartu lícem dolů. Živí mohou hrát jen Úspěch; Smrt může hrát Úspěch nebo Sabotáž. Karty se zamíchají a otáčejí po jedné: jedna Sabotáž misi zmaří.</li>
<li><b>Noční mezihra.</b> Každý si zaznamená tajné Podezření, kdo je Smrt. Po 2., 3. a 4. misi se držitel Svíčky dozví stranu jednoho hráče a Svíčka přejde k němu. Se Stopami může za úsvitu přijít pravdivá nápověda.</li>
</ol>`,
    missionsWin: `<ul>
<li><b>Tři úspěchy:</b> Smrt se odhalí a Ženec určí, koho považuje za Médium (Smrt se může nejdřív poradit). Správně: vyhrává Smrt. Špatně: vyhrávají Živí.</li>
<li><b>Tři nezdary:</b> Poslední vzdor. Každý označí jednoho hráče. Pokud stůl označí Živého, vyhrává Smrt; pokud chytí Smrt, Ženec stejně dostane Zúčtování: najde Médium a Smrt ukradne vítězství.</li>
<li><b>Vedlejší mise</b> mění váhu tvého hlasu v Posledním vzdoru: dvojnásobnou, pokud jsi svou splnil, poloviční, pokud ne.</li>
<li>Šašek, je-li ve hře, vyhraje sám, pokud ho označí v Posledním vzdoru nebo Ženec.</li>
</ul>`,
    missionsOpts: `<ul>
<li><b>Role:</b> zapnout nebo vypnout Věřícího, Šarlatána, Zahaleného, Tuláka, Hrobníka a Šaška, a přidat Dvojčata.</li>
<li><b>Vedlejší mise:</b> tajný osobní cíl pro každého.</li>
<li><b>Další vůdce mise:</b> další v pořadí, nebo ho vybere poslední vůdce.</li>
<li><b>Karty misí:</b> vypnuté, zřídka nebo občas.</li>
<li><b>Stopy:</b> zřídka, občas nebo často.</li>
<li><b>Příběh:</b> náhodné KDO / KDE / PROČ, nebo váš vlastní.</li>
</ul>`,
    exorcismSetup: `<p>3–12 hráčů, 5–10 minut na kolo. Živí znají tajné heslo, které by vyhnalo Démona skrytého mezi nimi; Démon ho nezná. Všichni vidí kategorii. Slova se na všech telefonech zobrazují v jazyce stolu, aby se shodovala.</p>`,
    exorcismLoop: `<ol>
<li><b>Křišťálová koule.</b> Klepni na ni a podívej se dovnitř: kategorie a (jsi-li Živý) heslo. Démon vidí jen kategorii a musí blafovat.</li>
<li><b>Losování.</b> Los určí, kdo mluví první; pak jde tah kolem stolu podle pořadí míst.</li>
<li><b>Každý jedno slovo.</b> Ve svém tahu řekni jedno slovo spojené s heslem a pak podrž tlačítko na telefonu. Dokaž, že ho znáš, aniž bys ho prozradil Démonovi. Podle lobby jdou slova kolem jednou nebo vícekrát a mohou se i psát a ukazovat v televizi.</li>
<li><b>Označte Démona.</b> Poraďte se a pak všichni hlasují pro jednoho hráče.</li>
<li><b>Poslední pokus.</b> Chycený Démon může říct heslo, z mřížky slov nebo napsané.</li>
</ol>`,
    exorcismWin: `<ul>
<li>Hlasování označí Živého nebo skončí nerozhodně (pokud nerozhoduje mince): <b>vyhrává Démon</b>.</li>
<li>Hlasování označí Démona: <b>vyhrávají Živí</b>, pokud pak Démon neuhodne heslo a neukradne vítězství.</li>
<li>Body se sbírají kolo za kolem: každý Živý +1 za výhru, každý Démon +2.</li>
</ul>`,
    exorcismOpts: `<ul>
<li><b>Démoni:</b> jeden, nebo od 7 hráčů dva; dva Démoni se mohou, ale nemusí znát.</li>
<li><b>Poslední pokus:</b> zapnutý, nebo vypnutý.</li>
<li><b>Nerozhodné hlasování:</b> Démon unikne, nebo rozhodne mince.</li>
<li><b>Mřížka slov:</b> 16 slov v televizi i na telefonech; heslo je jedno z nich.</li>
<li><b>Kola:</b> kolikrát jdou slova kolem stolu. <b>Psát slova:</b> zobrazí se v televizi.</li>
<li><b>Kategorie:</b> z kterých seznamů slov se táhne.</li>
</ul>`,
    coffinsSetup: `<p>3–10 hráčů, rychlá hra. Každý hraje sám za sebe a má čtyři rakve: tři Zlaté a jednu Kletbu (v delší možnosti pět: čtyři Zlaté, jedna Kletba). Tvoje rakve jsou před ostatními skryté.</p>`,
    coffinsLoop: `<ol>
<li><b>Pohřbívání.</b> Všichni najednou tajně zakopou jednu rakev: klepni na rakev a pak na Zakopat. Tvůj hrob je hromádka, nejnovější navrchu.</li>
<li><b>Zakopat, nebo vyzvat.</b> Od prvního hráče kola ve svém tahu buď zakopeš další rakev navrch své hromádky, nebo vyzveš: „Otevřu N“, nejvýš tolik, kolik je celkem zakopáno.</li>
<li><b>Přihazování.</b> Dokola se číslo zvyšuje, nebo se pasuje. Pas platí na celé kolo. Poslední, kdo zůstane, je Kopáč.</li>
<li><b>Kopání.</b> Kopáč nejdřív otevírá vlastní rakve shora dolů, pak vybírá jiné hroby, vždy vrchní rakev, dokud není otevřeno N rakví. Každá rakev se otočí v televizi.</li>
<li><b>Výsledek.</b> Samé Zlato: čisté kopání a tvůj náhrobek se pozlatí. Kletba ve vlastním hrobě: vybereš rakev, o kterou přijdeš. Kletba někoho jiného: naslepo si táhne jednu z tvých rakví a ta zmizí; majitel Kletby začíná další kolo.</li>
</ol>`,
    coffinsWin: `<ul>
<li>Vyhraješ dvěma čistými kopáními (v lobby 1 nebo 3), nebo jako poslední hráč s rakvemi.</li>
<li>V zápase: vítěz +3, každé čisté kopání +1, každé vstání z mrtvých +1.</li>
</ul>`,
    coffinsOpts: `<ul>
<li><b>Rakev Smrti</b> (výchozí zapnuto): v každém kole ji drží skrytý hráč místo jedné Zlaté. Pokud ji vykopeš, kopání selže; její držitel ti ukradne rakev, která se změní ve Zlatou.</li>
<li><b>Sázky duchů a Navrátilci</b> (výchozí zapnuto): hráči bez rakví při každém kopání sází na Zlato nebo Kletbu; třikrát správně a vstanou s jednou Zlatou rakví.</li>
<li><b>Relikvie</b> (výchozí vypnuto): tajná Lucerna (nahlédnout do hrobu), Klíč (otevřít jiný hrob před vlastním) nebo Ochrana (kletba nic nestojí), každá jednou.</li>
<li><b>Čistá kopání k výhře, rakve na hráče, her v zápase.</b></li>
</ul>`,
    carnivalSetup: `<p>4–12 hráčů. Každý hraje sám za sebe. Každá maska je známá role Dead Set a má schopnost. Každý začíná se 6 Dušemi; Oběť, talíř uprostřed stolu, je na začátku prázdná. Při 4–5 hráčích sedí dvě masky navíc na prázdných židlích: jsou na plese, ale nikdy nejednají.</p>
<p><b>Odmaskování:</b> na pár sekund je každá maska ukázaná lícem nahoru, v televizi i na každém telefonu. Zapamatujte si je; pak se otočí. Los vybere prvního tanečníka a pokračuje se po směru hodinových ručiček.</p>`,
    carnivalLoop: `<p>Ve svém tahu uděláš jedno ze tří:</p>
<ul>
<li><b>Vyměnit, nebo předstírat.</b> Vyber jinou masku (hráče nebo prázdnou židli) a podrž Vyměnit nebo Předstírání. Obě tlačítka vypadají stejně a nikdo, ani druhý hráč, se nedozví, co jsi zvolil.</li>
<li><b>Nahlédnout.</b> Na chvíli se podíváš na vlastní masku. Všichni vidí, že ses podíval.</li>
<li><b>Ohlásit.</b> Pojmenuješ masku, „Jsem Soudce“, a použiješ její schopnost.</li>
</ul>
<p><b>Výzvy.</b> Když někdo ohlásí masku, každý jiný telefon se zeptá: <em>Je to tvoje maska?</em> Pokud nikdo nevyzve, ohlášení platí a schopnost funguje, ať ohlašovatel nosí cokoli. Pokud někdo vyzve, ohlašovatel a všichni vyzyvatelé odhalí masky: kdo ji opravdu nosí, použije schopnost, ostatní odhalení zaplatí Duši (nebo víc, podle lobby) do Oběti.</p>
<p><b>Úvodní tanec.</b> První tah každého hráče (dva, pokud hostitel chce) musí být Vyměnit, nebo předstírat, aby byly masky pochybné dřív, než kdo něco ohlásí.</p>`,
    carnivalWin: `<ul>
<li><b>Plný měšec:</b> 13 Duší (nebo číslo z lobby) a hned vyhráváš.</li>
<li><b>Žeň Smrti:</b> vyhraje, kdo ohlášeními Smrti sklidil 6 Duší.</li>
<li><b>Krach:</b> jakmile někdo klesne na 0 Duší, vyhrává nejbohatší (při rovnosti vyšší žeň).</li>
<li>V zápase: vítěz +3, všichni ostatní +1 za každou Duši nad 6.</li>
</ul>`,
    carnivalOpts: `<ul>
<li><b>Masky:</b> doporučená sada roste se stolem; nebo si sestavte vlastní, jednu masku na místo (Smrt je povinná; opakovat se smí jen Nevinný).</li>
<li><b>Plný měšec, Žeň Smrti, trest za chybné ohlášení, úvodní tanec, her v zápase.</b></li>
<li><b>Poznámky (deník z plesu):</b> výchozí vypnuto, abyste si viděné pamatovali v hlavě.</li>
</ul>
<p>Kdykoli klepni na <em>Masky na plese</em>: každá maska ve hře a její schopnost, nakreslená jako řada znamení.</p>`,
    midnightSetup: `<p>4–12 hráčů, asi 10 minut. Jedna noc, jedno hlasování, žádná druhá šance. Balíček má jednu kartu na hráče a tři lícem dolů na stole (prázdné židle). Balíček je veřejný; kdo co drží, ne. Každý vidí svou kartu jednou, při rozdávání.</p>
<p>Karty ve tmě mění majitele. <b>Za úsvitu jsi tou kartou, která leží před tebou</b>, ne tou, kterou jsi dostal.</p>`,
    midnightLoop: `<ol>
<li><b>Rozdávání.</b> Jednou se podíváš na svou kartu.</li>
<li><b>Noc.</b> Telefony budí role postupně: Napodobitel, Smrt, Spiklenec, Dvojčata, Mentalista, Dvojitý agent, Čarodějnice, Hazardní hráč, Nespavec. Každý krok trvá stejně, 10 sekund, a běží i tehdy, když jeho karta leží na stole, aby noc nic neprozradila. Ovládání dostane jen ten, kdo tu kartu dostal; každý jiný telefon říká, ať máš zavřené oči. Hazardní hráč, který nic neudělá, se vymění s náhodnou kartou ze stolu.</li>
<li><b>Den.</b> Jedna diskuse (výchozí 5 minut): tvrďte, obviňujte, lžete. Karty se mohly přesunout; nevěřte nikomu, ani sobě. Hostitel může hlasování otevřít dřív.</li>
<li><b>Hlasování.</b> Všichni najednou ukážou na jiného hráče. Kdo má nejvíc hlasů, umírá, pokud jsou to aspoň dva; při rovnosti na vrcholu umírají všichni shodní. Pokud zemře Mstitel, zemře i ten, na koho ukázal.</li>
</ol>`,
    midnightWin: `<ul>
<li>Strany se určují podle karet za úsvitu (Napodobitel se počítá jako role, kterou zkopíroval).</li>
<li><b>Živí</b> vyhrávají, pokud zemře aspoň jedna Smrt; pokud mezi hráči Smrt není, když nezemře nikdo.</li>
<li><b>Smrt a Spiklenec</b> vyhrávají, pokud nezemře žádná Smrt (a nezemřel Šašek).</li>
<li><b>Šašek</b> vyhraje sám, když ho vyhlasují. Víc stran může vyhrát spolu.</li>
<li>V zápase: každý vítěz +1, Šašek +2. Závěrečná obrazovka ukáže každou kartu, jak byla rozdána i za úsvitu, a přehraje noc.</li>
</ul>`,
    midnightOpts: `<ul>
<li><b>Karty:</b> doporučený balíček roste se stolem; nebo si je vyberte sami (Smrt 1–2, Dvojčata 0 nebo 2, Nevinný 0–4, ostatní 0–1; celkem hráči + 3).</li>
<li><b>Osamělá Smrt nahlédne:</b> Smrt, která se probudí sama, se může podívat na jednu kartu ze stolu.</li>
<li><b>Délka diskuse, her v zápase.</b></li>
</ul>`,
    seanceSetup: `<p>4–10 hráčů, asi 30 minut. Kooperativní vražedná záhada se zrádcem. Jeden hráč je Duch: ví, kdo ho zabil, kde a proč, a nemůže mluvit. Všichni ostatní jsou Média, která čtou jeho vize. Od pěti hráčů se mezi Médii může skrývat Lhář: druhý duch, který zná pravdu a pracuje proti stolu.</p>
<p><b>Tabule:</b> tři řady karet příběhu, KDO, KDE a PROČ. V každé řadě je jedna karta pravda. Seance se ptá postupně: nejdřív kdo, pak kde, nakonec proč.</p>`,
    seanceLoop: `<ol>
<li><b>Vize.</b> Duch pošle každému Médiu jednu vizi k otázce: kartu se dvěma nebo třemi rytými motivy. V ruce má vždy několik, které sedí na odpověď; zbytek je štěstí balíčku. Mezitím si každé Médium tajně označí <b>podezření</b>: koho podezírá.</li>
<li><b>Lhářova výměna.</b> Několikrát za hru Lhář tajně vymění vizi jiného Média za jednu svou, která ukazuje na špatnou kartu.</li>
<li><b>Ruce.</b> Vize se otočí a zůstanou na stole, dokud otázka nemá odpověď. Proberte to. Duch mlčí, ale může vizi zamrazit studeným místem: <em>tahle není moje</em>. Pak každé Médium položí ruku na jednu kartu.</li>
<li><b>Duch odpovídá.</b> Karta pod nejvíce rukama jde před ducha; při remíze, nebo když nikdo ruku nepoložil, vybere ukazatel náhodně. Ano: jde se na další otázku. Ne: karta se škrtne.</li>
<li><b>Hodiny.</b> Každé kolo shoří jedna ze sedmi svíček, ať je odpověď jakákoli.</li>
</ol>`,
    seanceWin: `<ul>
<li>Odpovězte na všechny tři otázky dřív, než svíčky dohoří, a pak pojmenujte Lháře (vaše poslední podezření je označené). Správně: <b>úplné vítězství</b>. Špatně: <b>prázdné vítězství</b>, společné se Lhářem.</li>
<li>Když hodiny dohoří, vyhraje Lhář (bez Lháře stůl prohraje). Hádat naslepo nestačí: sedm svíček na tři odpovědi, po šesti kartách v řadě.</li>
<li>V zápase: úplné vítězství +2 pro Ducha a každé Médium; prázdné +1 pro každého a +1 pro Lháře; vítězství Lháře +3.</li>
<li>Závěrečná obrazovka přehraje každé kolo: skutečné vize, výměny, ruce a podezření.</li>
</ul>`,
    seanceOpts: `<ul>
<li><b>Obtížnost:</b> kolik karet je v řadě, kolik Duchových vizí sedí na odpověď a kolik svíček hoří na hodinách.</li>
<li><b>Lháři:</b> žádný, jeden nebo dva, a zda se dva znají; kolik výměn dostanou.</li>
<li><b>Duchova studená místa:</b> kolik vizí smí zamrazit.</li>
<li><b>Duch:</b> losem, nebo ho vybere hostitel. <b>Her v zápase.</b></li>
</ul>`,
    graveSetup: `<p>4–12 hráčů, asi 15 minut. Dvě party vykradačů hrobů, Měsíc a Slunce, kopou na hřbitově s 25 náhrobky relikvie, které přivolají jejich božstvo. Mince určí partu, která kope první: ta má v zemi 9 relikvií, druhá 8. Sedm hrobů je prázdných a jeden patří Smrti.</p>
<p>Každá parta má <b>Hrobníka</b>, jediného hráče, který vidí pohřební rejstřík: co leží pod každým kamenem. Všichni ostatní kopou. Náhrobky ukazují slova v jazyce stolu nebo tužkové ikony.</p>`,
    graveLoop: `<ol>
<li><b>Znamení.</b> V tahu své party dá Hrobník jedno slovo a jedno číslo, „Oceán · 3“: slovo, které spojuje několik hrobů jeho party, a kolik jich je. Slovo nesmí být na tabuli. Pak už nic neřekne.</li>
<li><b>Kopání.</b> Kopáči se poradí a hlasují na telefonech; hrob s nejvíce hlasy se vykope (při rovnosti rozhodne mince).</li>
<li><b>Co leží pod ním.</b> Relikvie vaší party: kopejte dál, až do čísla. Prázdný hrob nebo relikvie druhé party (teď patří jí): tah přechází dál. Hrob Smrti: vaše parta okamžitě prohrává.</li>
<li><b>Zastavení.</b> Parta může odhlasovat, že přestane. Kdo přestane před dosažením čísla, ponechá si jedno bonusové kopání na další tah (nikdy se nesčítá).</li>
</ol>
<p>Na telefonu přepínej mezi <em>Kameny</em> (slova nebo ikony) a <em>Mapa</em> (tabule na první pohled).</p>
<p><b>Tři party</b> (6–12 hráčů): Měsíc, Slunce a Hvězdy, každá třetina stolu. První parta skrývá 7 relikvií, ostatní po 6, s 5 prázdnými hroby. Hrob Smrti vyřadí partu ze hry; ostatní kopou dál, a když zůstane jedna parta, vyhrává.</p>`,
    graveWin: `<ul>
<li>Vyhrává první parta, které jsou vykopány všechny relikvie, i když některé omylem vykopala druhá parta.</li>
<li>Parta, která otevře hrob Smrti, okamžitě prohrává (při třech partách vypadává).</li>
<li>V zápase z 1, 3 nebo 5 her: každá výhra +1. Hrobníci se mezi hrami střídají.</li>
</ul>`,
    graveOpts: `<ul>
<li><b>Počet part:</b> dvě, nebo od 6 hráčů tři.</li>
<li><b>Na hrobech:</b> slova, nebo ikony; <b>slavná jména</b> (filmy, hrdinové, památky) zapnutá, nebo vypnutá.</li>
<li><b>Party:</b> podle míst (přesunem hráčů kolem stolu měníte partu), nebo náhodně. <b>Hrobníci:</b> střídaví, náhodní, nebo vybraní.</li>
<li><b>Znamení:</b> psaná (slovo se zobrazí na každé obrazovce), nebo vyslovená (nahlas, číslo se klepne). <b>Her v zápase.</b></li>
</ul>`,
    mimicSetup: `<p>4–12 hráčů, asi 8 minut na hru. Všichni sdílejí jedno tajné místo, kartu příběhu, a hrají tam postavu, kromě Napodobitele, který vidí jen šum a tabuli možných míst. Živí musí najít Napodobitele; Napodobitel musí přijít na místo.</p>`,
    mimicLoop: `<ol>
<li><b>Otázky.</b> Kdo drží lucernu, nahlas se někoho zeptá na místo a pak klepne na toho, koho se ptal; lucerna přejde k němu a ptá se další. Nikdy se neptej zpátky toho, kdo se právě ptal tebe. Odpovídej tak, aby tě Živí poznali, ale Napodobitel se nedozvěděl místo.</li>
<li><b>Obvinění.</b> Jednou za hru může každý obvinit hráče. Hodiny se zastaví; všichni ostatní hlasují Souhlasím, nebo Nesouhlasím. Odsoudí jen jednomyslný stůl; jinak hodiny běží dál.</li>
<li><b>Napodobitel se odhalí.</b> Kdykoli se Napodobitel může odhalit a říct místo.</li>
<li><b>Čas vypršel.</b> Když hodiny doběhnou (výchozí 8 minut), všichni ukážou na jednoho podezřelého. Kdo má nejvíc hlasů, je odsouzen; při rovnosti Napodobitel unikne.</li>
</ol>
<p>Během poslechu si na telefonu škrtej místa: tvoje poznámky jsou soukromé.</p>`,
    mimicWin: `<ul>
<li>Odsuďte Napodobitele: <b>vyhrávají Živí</b>, pokud chycený Napodobitel pak neřekne místo a neukradne vítězství.</li>
<li>Odsuďte Živého, nebo nechte Napodobitele uniknout: <b>vyhrává Napodobitel</b>.</li>
<li>Napodobitel řekne místo: správně, vyhrává; špatně, vyhrávají Živí.</li>
<li>V zápase (výchozí 3 hry): Živí po +1, kdo chytil Napodobitele, ještě +1; Napodobitel +2, nebo +3 za uhodnuté místo.</li>
</ul>`,
    mimicOpts: `<ul>
<li><b>Místa na tabuli:</b> víc míst Napodobiteli ztíží úkol.</li>
<li><b>Poslední tip:</b> chycený Napodobitel může ještě říct místo.</li>
<li><b>Pozadí v televizi se zaostřuje:</b> možnost pro důvěru. Televize ukazuje pravé místo silně rozmazané a s ubíhajícím časem se zaostřuje. Kdo otevře odkaz na TV, mohl by ho přečíst.</li>
<li><b>Čas na otázky, her v zápase.</b></li>
</ul>`,
    omenSetup: `<p>4–12 hráčů, asi 10 minut. Každý hraje sám za sebe; nejsou tu skryté strany. Okultní kolo ukazuje na jedno ze tří polí: Život, Smrt a Znovuzrození, v tomto pořadí po směru hodinových ručiček. Každý začíná s 5 Vlivy, viditelnými pro všechny.</p>`,
    omenLoop: `<p>Sedm kol, každé ve třech krocích:</p>
<ol>
<li><b>Kolo</b> ukáže, kde v tomto kole začíná.</li>
<li><b>Zapečetěný hlas.</b> Tajně předpověz, kde se kolo zastaví, a rozhodni se, zda ho otočíš o krok zpět, o krok vpřed, nebo ho necháš. Otočení stojí jeden Vliv; bez Vlivu ho můžeš jen nechat. Hlas můžeš měnit, dokud nejsou všichni hotovi.</li>
<li><b>Odhalení.</b> Všechna otočení se sečtou a kolo se pohne jednou, o součet (tři kroky stejným směrem ho vrátí). Pak se ukáže každá předpověď a každé otočení.</li>
</ol>
<p>Umění je číst stůl: kdo má ještě Vliv, kdo chce kolo kde a kdo jím otočí?</p>`,
    omenWin: `<ul>
<li>Správná předpověď dává 3 body. Chybějící hlas nic nepředpovídá a ničím neotáčí.</li>
<li>Na konci má každý nevyužitý Vliv hodnotu 1 bodu. Vyhrává nejvíc bodů; při rovnosti se vítězství dělí.</li>
</ul>`,
    omenOpts: `<p>Žádné přepínače: jen časovače pro každý krok.</p>`,
    mirrorSetup: `<p>4–12 hráčů, asi 15 minut. Každý hraje sám za sebe. Prokleté zrcadlo neukazuje tvůj odraz: ukazuje, co si tví přátelé myslí, že uděláš. Osm vymyšlených dilemat, každé se třemi odpověďmi, A, B a C, a žádná není správná.</p>
<p>V každém kole čteš jednoho jiného hráče. Dvojice se střídají, takže během hry každý čte každého a každého v každém kole čte právě jeden hráč.</p>`,
    mirrorLoop: `<ol>
<li><b>Poraďte se.</b> Dilema a kdo koho čte jsou veřejné. Ptejte se, škádlete se, mlžte.</li>
<li><b>Zapečetěný hlas.</b> Vyber svou odpověď a předpověz odpověď hráče, kterého čteš. Potřeba je obojí a můžeš to měnit, dokud nejsou všichni hotovi.</li>
<li><b>Zrcadlo ukáže všechno:</b> každou odpověď a každé čtení, správné i špatné.</li>
</ol>`,
    mirrorWin: `<ul>
<li>Správná předpověď dává 2 body; tvoje vlastní odpověď nic, takže překvapit svého čtenáře je fér.</li>
<li>Chybějící hlas se změní na náhodnou odpověď; její čtenář se podle ní stejně hodnotí.</li>
<li>Vyhrává nejlepší čtenář; při rovnosti se vítězství dělí.</li>
</ul>`,
    mirrorOpts: `<p>Kromě časovačů žádné přepínače. Až bude víc balíčků dilemat, lobby vám dovolí vybrat, ze kterých se osm táhne.</p>`,
  },
};
