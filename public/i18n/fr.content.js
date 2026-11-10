// Français : contenu du jeu (rôles, rêves, cartes de règle, modes, cartes de scénario, guide).
export default {
  and: 'et',
  numbers: ['aucun', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix'],
  roles: {
    M_JESTER: { name: "Bouffon", when: "Toujours", summary: "Tu gagnes seul si la table te désigne au Dernier Carré, ou si le Faucheur te désigne lors du Jugement.", detail: "Tu n'es ni Vivant ni de la Mort : le Médium ne te voit pas, la Bougie te montre Vivant. En mission, tu peux jouer Réussite ou Sabotage. Aie l'air coupable, mais pas trop." },
    TWIN: { name: "Jumeau", when: "Toujours", summary: "Il y a deux Jumeaux. Vous vous connaissez et vous êtes tous deux Vivants.", detail: "Tu ne peux jouer que Succès. Fais confiance à ton jumeau, mais attention : à trop vous porter garants l'un de l'autre, vous montrez à la Mort où chercher." },
    UNDERTAKER: { name: "Croque-mort", when: "Après une mission ratée", summary: "Quand une mission échoue, tu apprends combien de joueurs de la Mort étaient dans cette équipe.", detail: "Le compte inclut tous les joueurs de la Mort, le Voilé et l'Égaré aussi, quelle que soit leur carte. Toi seul l'entends. Tu ne peux jouer que Succès." },
    MEDIUM: { name: "Médium", when: "Toujours", summary: "Tu vois chaque joueur de la Mort, sauf le Voilé. Guide l'expédition sans te trahir.", detail: "Si les Vivants gagnent trois missions, ou prennent un joueur de la Mort au Dernier Carré, la Mort a un essai pour deviner qui tu es. Si elle te désigne, la Mort gagne." },
    BELIEVER: { name: "Croyant", when: "Toujours", summary: "Tu vois deux bougies : le Médium et le Charlatan. Tu ne sais pas qui est qui.", detail: "Découvre quelle bougie est le vrai Médium et protège-le, souvent en te faisant passer toi-même pour le Médium. Sans Charlatan en jeu, ta seule bougie est le Médium." },
    COMPANION: { name: "Compagnon", when: "Toujours", summary: "Tu ne sais rien d'autre que ce que dit ton cœur. Observe les votes et les missions.", detail: "Tu ne peux jouer que Réussite. Lis qui propose qui, qui approuve quelle équipe, et quelles missions échouent." },
    REAPER: { name: "Faucheur", when: "Toujours", summary: "Tu mènes la Mort. Au Jugement, tu décides qui est le Médium.", detail: "Tu vois le reste de la Mort (sauf l'Égaré). En mission, tu peux jouer Réussite ou Sabotage. Ton équipe peut suggérer des noms au Jugement ; ton choix compte." },
    CHARLATAN: { name: "Charlatan", when: "Toujours", summary: "Pour le Croyant, tu ressembles exactement au Médium. Profites-en.", detail: "Tu vois le reste de la Mort (sauf l'Égaré). En mission, tu peux jouer Réussite ou Sabotage." },
    VEILED: { name: "Voilé", when: "Toujours", summary: "Le Médium ne peut pas te voir.", detail: "Tu vois le reste de la Mort (sauf l'Égaré). En mission, tu peux jouer Réussite ou Sabotage." },
    STRAY: { name: "Égaré", when: "Toujours", summary: "Tu sers la Mort seul : tu ne connais pas les autres, et ils ne te connaissent pas.", detail: "Le Médium te voit quand même. En mission, tu peux jouer Réussite ou Sabotage. Au Jugement, la Mort se démasque et tu rejoins les autres." },
    SHADE: { name: "Ombre", when: "Toujours", summary: "Tu marches avec la Mort et connais tes coéquipiers.", detail: "Tu vois le reste de la Mort (sauf l'Égaré). En mission, tu peux jouer Réussite ou Sabotage." },
    CULT_LEADER: { name: "Gourou", when: "Chaque nuit", summary: "Chaque nuit, recrute un joueur dans la Secte. La Secte gagne quand elle est plus nombreuse que tous les autres.", detail: "Une recrue garde son rôle et ses pouvoirs mais gagne désormais avec la Secte, et apprend qui en sont les autres membres. Les joueurs du camp de la Mort, l'Éventreur et les joueurs protégés ne peuvent pas être recrutés. Si le Gourou meurt, plus personne ne peut recruter." },
    RIPPER: { name: "L'Éventreur", when: "Chaque nuit", summary: "Tue un joueur chaque nuit, seul. Tu gagnes si tu es le dernier debout, ou seul avec un autre joueur qui n'est pas un tueur.", detail: "Ton meurtre est arrêté par les mêmes protections que celui de la Mort (Gardien, Ange gardien, Bénédiction de la Sorcière, résurrection temporaire). La Mort ne peut pas te tuer la nuit, sauf sous une Lune de sang. Tu apparais comme N'APPARTENANT PAS AU CAMP DE LA MORT." },
    DEATH: { name: 'La Mort', when: 'Chaque nuit', summary: 'Mettez-vous d’accord avec tous vos coéquipiers Mort vivants sur un seul meurtre commun chaque nuit.', detail: 'Tous les joueurs Mort actifs doivent confirmer exactement les mêmes cibles, sinon la faction passe. La capacité de base est d’un meurtre ; Double Péril, Équipe de nuit ou Surcharge peuvent la porter à deux au maximum — jamais un meurtre par joueur Mort.' },
    INNOCENT: { name: 'Innocent', when: 'Jour', summary: 'Aucun pouvoir. Ta voix et ton vote sont tes armes.', detail: 'Argumente, accuse et vote. Tu reçois quand même un Rêve chaque nuit et peux subir des états.' },
    MENTALIST: { name: 'Mentaliste', when: 'Chaque nuit', summary: 'Lis un autre joueur : est-il du côté de la Mort ou non ?', detail: 'Tu apprends seulement l’allégeance actuelle de la cible (DU CÔTÉ DE LA MORT / PAS DU CÔTÉ DE LA MORT), jamais son rôle exact. Une lecture bloquée ne donne rien.' },
    GUARDIAN: { name: 'Gardien', when: 'Chaque nuit', summary: 'Protège un joueur (toi compris) de la Mort et du Psychopathe.', detail: 'N’arrête que le meurtre de la faction Mort et l’état du Psychopathe. Pas les bombes, le Justicier, le Bouc émissaire, les destins liés ni l’expiration. Tu peux protéger la même cible plusieurs fois.' },
    PSYCHO: { name: 'Psychopathe', when: 'Une fois par partie, la nuit', summary: 'Une fois : rends quelqu’un muet ou retire-lui son vote pour le jour suivant.', detail: 'MUET : ne peut pas parler pendant la discussion, mais peut nommer et voter. SANS VOTE : peut parler mais pas voter. Le Gardien, l’Ange gardien et la Bénédiction de la Sorcière l’empêchent. La charge est utilisée même si elle est bloquée.' },
    WHORE: { name: 'Catin', alias: 'Courtisane', when: 'Chaque nuit', summary: 'Rends visite à quelqu’un. Si tu visites la Mort, le meurtre de toute l’équipe échoue.', detail: 'Si la personne visitée est une Mort active, la capacité de meurtre de la faction tombe à 0. Si la personne visitée est tuée par la Mort, tu meurs avec elle ; si elle explose, tu es prise dans le souffle.' },
    TRAVELING_AGENT: { name: 'Représentant', when: 'Chaque nuit', summary: 'Livre un produit mystérieux. Pure ambiance — et une carte de visite.', detail: 'Le destinataire apprend à l’aube qu’un Représentant lui a rendu visite. Le produit n’a aucun effet, mais la visite elle-même est une information que vous pouvez exploiter tous les deux.' },
    TERRORIST: { name: 'Terroriste', when: 'Chaque nuit', summary: 'Pose une bombe devant une porte. Une chance sur deux qu’elle explose.', detail: 'Le serveur lance une pièce équitable. Sur OUI, la cible meurt, et toute Catin qui lui rend visite meurt dans l’explosion. Le Gardien n’arrête pas une bombe ; l’Ange gardien, la Bénédiction et la résurrection temporaire, si.' },
    MIMIC: { name: 'Imitateur', when: 'Nuit 1 uniquement (obligatoire)', summary: 'La nuit 1, deviens une copie permanente du rôle de quelqu’un d’autre.', detail: 'Tu prends le rôle et l’allégeance de la cible avec des charges neuves. Les pouvoirs copiés s’activent dès la nuit 2 ; une Mort copiée rejoint l’équipe dès la nuit 2. Copier un Imitateur — ou ne pas choisir — te laisse Imitateur sans pouvoir jusqu’à la fin.' },
    DOUBLE_AGENT: { name: 'Agent double', when: 'Nuit 1 uniquement (obligatoire)', summary: 'La nuit 1, choisis secrètement ton camp pour le reste de la partie.', detail: 'Choisis MORT ou NON-MORT. Si tu choisis la Mort, tu bascules à la fin de la nuit 1 ; dès la nuit 2 tu rejoins la salle de l’équipe Mort et partages son unique meurtre. Sans choix, tu restes non-Mort.' },
    DIPLOMAT: { name: 'Diplomate', when: 'Une fois par partie, le jour (avant les nominations)', summary: 'Une fois : déclare-toi immunisé contre la condamnation pendant un jour.', detail: 'Déclaré publiquement pendant la fenêtre du matin. Ce jour-là, personne ne peut te nommer. Ne protège pas des meurtres nocturnes, des bombes, du Justicier ni du Bouc émissaire.' },
    SCAPEGOAT: { name: 'Bouc émissaire', when: 'Passif, jour', summary: 'Si un jour se termine sans condamnation, tu meurs à la place.', detail: 'Égalité, aucune nomination, aucun vote, Règle de la majorité non atteinte ou annulation du Parieur : tout compte comme « aucune condamnation ». C’est un meurtre, pas une condamnation. Un seul Bouc émissaire (le plus petit siège) meurt par jour.' },
    NECROMANCER: { name: 'Nécromancien', when: 'Une fois par partie, la nuit', summary: 'Une fois : ramène un joueur éliminé pour un jour et une nuit.', detail: 'Le revenant garde son rôle et son allégeance, est immunisé contre tout meurtre pendant sa résurrection et disparaît après la nuit suivante. Tu dois survivre à la nuit pour que le rituel marche. Chacun ne peut être ramené qu’une fois.' },
    CONSPIRATOR: { name: 'Conspirateur', when: 'Vote de jour passif, chat de nuit', summary: 'Ton vote compte +1. La nuit, ouvre un murmure privé avec un joueur.', detail: 'Ton bulletin porte un poids supplémentaire sur le même candidat. Chaque nuit, tu peux ouvrir un court canal texte à deux avec un joueur vivant ; il ne révèle aucun rôle en soi.' },
    MAGISTRATE: { name: 'Magistrat', when: 'Passif, jour', summary: 'Ton vote pèse 2 (3 avec Paranoïa).', detail: 'Un bulletin, un candidat, double poids. Un « Sans vote » du Psychopathe le réduit à zéro.' },
    ORACLE: { name: 'Oracle', when: 'Une fois par partie, la nuit', summary: 'Une fois : devine qui la Mort frappera cette nuit. Si tu as raison, la personne vit.', detail: 'Si ta prédiction fait partie des cibles confirmées par la faction Mort, ce joueur est protégé d’un meurtre de la Mort. Une erreur ou un passage de la Mort ne donne rien.' },
    GAMBLER: { name: 'Parieur', when: 'Une fois par partie, la nuit', summary: 'Une fois : parie sur le premier nommé de demain. Si tu gagnes, personne n’est pendu.', detail: 'Si la première nomination officielle du jour suivant correspond à ton pari, la condamnation de ce jour est annulée avant le décompte. Un Bouc émissaire peut quand même mourir de l’absence de condamnation.' },
    VIGILANTE: { name: 'Justicier', when: 'Une fois par partie, le jour (avant les nominations)', summary: 'Une fois : abats un joueur le matin, sans vote.', detail: 'Un meurtre de rôle, pas une condamnation. L’immunité du Diplomate ne l’arrête pas. La victoire est vérifiée immédiatement après.' },
    JESTER: { name: 'Bouffon', when: 'Indépendant', summary: 'Tu gagnes seul — uniquement si la ville vote ta condamnation.', detail: 'Mourir autrement (meurtre nocturne, bombe, Justicier, Bouc émissaire) ne compte pas. Survivre jusqu’au bout ne fait pas gagner non plus. Tu comptes comme un « autre » joueur face à la majorité de la Mort.' },
    BODYGUARD: { name: 'Garde du corps', when: 'Chaque nuit', summary: 'Reste auprès de quelqu’un. Si la Mort vient pour lui, tu prends la lame.', detail: 'Si ton protégé devait mourir du meurtre de la Mort et que rien d’autre ne le sauve, tu meurs à sa place. Tu ne peux pas te protéger toi-même, ni arrêter les bombes ou les morts liées, et tu interceptes au plus un meurtre par nuit.' },
    BARD: { name: 'Barde', when: 'Une fois par partie, la nuit', summary: 'Une fois : fais taire la nuit. Tous les pouvoirs échouent, celui de la Mort aussi.', detail: 'Toutes les capacités de rôle actives cette nuit-là sont supprimées. Les Rêves, les expirations et les règles de la partie s’appliquent toujours. Une Paralysie du sommeil sur le Barde empêche le silence.' },
    WITCH: { name: 'Sorcière', when: 'Chaque nuit', summary: 'Bénis un joueur contre le mal, ou maudis sa prochaine action pour qu’elle échoue.', detail: 'Bénédiction : protège cette nuit des actions de rôle nuisibles et des bombes (pas des destins liés). Malédiction : la prochaine action ciblée de la cible échoue ; maudire une Mort active bloque le meurtre de la faction. Jamais sur toi-même.' },
  },
  dreams: {
    SLEEP_PARALYSIS: { name: 'Paralysie du sommeil', text: 'Tu ne peux pas utiliser ton action de rôle nocturne. Si tu es une Mort active, tout le meurtre de la faction est bloqué.' },
    PREMONITION: { name: 'Prémonition', text: 'À l’aube, tu apprends le nom d’un joueur vivant du côté de la Mort.' },
    WHISPERS: { name: 'Murmures du passé', text: 'À l’aube, tu apprends le rôle exact d’un joueur éliminé au hasard.' },
    SLEEPWALKING: { name: 'Somnambulisme', text: 'Tu es lié au joueur assis juste avant toi. S’il meurt cette nuit, tu meurs à la fin de la nuit.' },
    DREAM_SNATCHER: { name: 'Voleur de rêves', text: 'Avant l’ouverture des actions, tu peux échanger tes cartes Rêve avec un autre joueur vivant.' },
    NIGHT_SHIFT: { name: 'Équipe de nuit', text: 'Une utilisation supplémentaire d’un pouvoir nocturne répétable, sur une deuxième cible. Pour la Mort : la capacité de l’équipe passe à 2.' },
    SHARED_NIGHTMARE: { name: 'Cauchemar partagé', text: 'Choisis un partenaire de rêve. S’il meurt cette nuit, tu meurs avec lui.' },
    INSOMNIA: { name: 'Insomnie', text: 'À l’aube, tu reçois le compte rendu chronologique complet des actions de la nuit — si tu survis.' },
    GUARDIAN_ANGEL: { name: 'Ange gardien', text: 'Cette nuit, tu es immunisé contre la Mort, le Psychopathe, les bombes, la Malédiction et les morts liées.' },
  },
  mcards: {
    REGULAR: { name: "Mission ordinaire", text: "Aucun effet particulier." },
    LANTERN: { name: "Porte-lanterne", text: "Le Meneur doit faire partie de l'équipe." },
    FRESH_FACES: { name: "Nouvelles têtes", text: "Au moins la moitié de l'équipe (arrondie au-dessus) ne doit pas avoir participé à la mission précédente." },
    EXTRA_HAND: { name: "Renfort", text: "L'équipe compte un joueur de plus." },
    SKELETON_CREW: { name: "Équipage réduit", text: "L'équipe compte un joueur de moins." },
    MASKED_VOTE: { name: "Vote masqué", text: "Les votes d'équipe ne montrent que les totaux, pas qui a voté quoi." },
    SHORT_PATIENCE: { name: "Patience courte", text: "La troisième proposition part quel que soit le vote." },
    WARD: { name: "Protection", text: "Avec l'équipe, le Meneur désigne un membre dont la carte sera forcément Réussite." },
    STEADFAST: { name: "Inébranlable", text: "Il faut un Sabotage de plus que d'habitude pour échouer." },
    BRITTLE: { name: "Fragile", text: "Un seul Sabotage la fait échouer, même si cette mission en exige normalement deux." },
    SMOKE: { name: "Fumée", text: "Seul le résultat est montré, pas le nombre de cartes Sabotage jouées." },
    GRAND: { name: "Grande mission", text: "Le résultat compte double sur la piste." },
    TRAIL: { name: "Piste", text: "Si elle réussit, un membre vivant de l'équipe tiré au hasard trouve un indice la nuit." },
    WITNESS: { name: "Témoin", text: "La nuit, le Meneur de l'équipe voit en secret la carte d'un autre membre." },
    HAUNTED_ROAD: { name: "Route hantée", text: "Si elle échoue, le Faucheur choisit l'un de ses membres, qui doit sauter la prochaine mission." },
  },
  missionStory: {
    steps: [
      ["Trouver la carte déchirée", "Suivre la fausse piste", "Creuser au-delà des leurres", "Ouvrir le coffre", "Sortir l'or"],
      ["Trouver l'horloge", "Voler les clés", "Forcer la première serrure", "Semer les alarmes", "Atteindre la dernière porte"],
      ["Rassembler les bougies", "Tracer le cercle", "Prononcer les mots interdits", "Nourrir l'autel", "Refermer le cercle"],
      ["Examiner le corps", "Interroger le majordome", "Trouver l'arme", "Briser l'alibi", "Nommer l'assassin"],
      ["Lire les signes d'alerte", "Trouver la source", "Couper le bon fil", "Tenir la ligne", "Tirer le dernier levier"],
      ["Trouver l'objet maudit", "Apprendre son vrai nom", "Agacer l'esprit", "L'enfermer dans le sel", "Briser la malédiction"],
      ["Entrer dans la partie", "Compter les cartes", "Repérer le tricheur", "Tout miser", "Gagner la dernière main"],
      ["Trouver l'héritier", "Cacher l'héritier", "Survivre au dîner", "Duper les assassins", "Couronner l'héritier"],
      ["Lire les étoiles", "Traverser l'obscurité", "Soudoyer le passeur", "Gravir la dernière colline", "Ouvrir la porte d'entrée"],
      ["Intercepter une lettre", "Suivre les pas", "Tendre un piège", "Refermer le piège", "Démasquer le traître"],
      ["Barricader les portes", "Rationner les bougies", "Ignorer les coups à la porte", "Tenir après minuit", "Saluer l'aube"],
      ["Flairer la piste", "Trouver le receleur", "Forcer le coffre-fort", "Glisser la copie", "Rendre la relique"],
      ["Sonner la vieille cloche", "Trouver qui a chanté la berceuse", "Préparer le café amer", "Réveiller le maire", "Briser le sortilège"],
      ["Trouver la première page", "Déchiffrer les symboles", "Trouver la clé manquante", "Lire entre les lignes", "Lire le dernier mot"],
      ["Brûler le journal intime", "Faire taire le perroquet", "Soudoyer le témoin", "Semer le détective", "L'emporter dans la tombe"],
    ],
    scenes: [
      ["La salle de bal penche, mais l'orchestre refuse de s'arrêter.", "L'eau monte jusqu'aux chevilles dans la cabine du capitaine. Et elle monte encore.", "Les canots ont été comptés deux fois. Il n’y en a pas assez.", "Dans la salle des machines inondée, quelque chose fait encore tic-tac.", "Le pont est presque à la verticale. Accrochez-vous à quelque chose. N’importe quoi."],
      ["Le carrousel démarre tout seul dès votre arrivée.", "Le palais des glaces montre un de vous de trop.", "Il y a la queue au train fantôme. Personne dedans ne respire.", "La grande roue s’arrête avec vous tout en haut.", "Chaque statue de clown s’est tournée vers vous."],
      ["La porte se scelle derrière vous dans un sifflement. La lumière vacille.", "La radio grésille d’une voix qui connaît vos noms.", "Sur les rations : « Ne pas ouvrir ». Quelqu’un les a ouvertes.", "Le niveau moins quatre ne figure sur aucun plan.", "Vingt minutes d’air. Probablement."],
      ["Les portraits vous suivent des yeux, et aussi des pieds.", "Le dîner est servi pour exactement un invité de plus que vous.", "La porte secrète est derrière le livre que tu viens de toucher.", "L’escalier du grenier grince en formant des mots.", "La maison a cessé de faire semblant d’être vide."],
      ["La neige avale vos traces aussi vite que vous les faites.", "Les chiens de traîneau refusent de faire un pas de plus.", "Quelque chose de gros suit vos traces depuis ce matin.", "La glace du lac s’est mise à chanter.", "Le blizzard se referme. Vous ne voyez plus vos propres mains."],
      ["La lampe tourne, mais personne n’a monté l’escalier depuis des années.", "La corne de brume répond à des questions que personne n’a posées.", "Le journal du gardien s’arrête au milieu d’une phrase.", "Les rochers en bas sont pleins de navires qui ont fait confiance à cette lumière.", "En haut, la lampe s’éteint. Quelque chose respire dans le noir."],
      ["La gravité fonctionne dans la plupart des pièces. La plupart.", "L’IA de la station vous souhaite le bonjour. Ce n’est pas le matin.", "La serre hydroponique est pleine de plantes que personne n’a plantées.", "Le journal du sas dit que quelqu’un est sorti. Personne ne manque.", "L’orbite se dégrade. Tout le monde retient son souffle."],
      ["Le contrôleur poinçonne ton billet et murmure : mauvais train.", "Le wagon-restaurant est dressé pour un festin, mais le chef a disparu.", "Un tunnel. Quand la lumière revient, un passager n’est plus le même.", "Le train franchit un pont qui n’existait pas hier.", "Les freins ont lâché. La montagne, non."],
      ["Vous ramez dans la nef pendant que l’orgue joue sous l’eau.", "Les bougies brûlent sous la surface. Ça ne devrait pas être possible.", "Les saints des vitraux vous montrent tous du doigt.", "La crypte est inondée, et les cercueils flottent.", "La cloche sonne sous l’eau, lentement, tout près."],
      ["Les roses se penchent vers vous. Poliment, pour l’instant.", "La serre est moite, et quelque chose y bourdonne.", "Une plante carnivore a mangé la carte. Et le jardinier.", "Le labyrinthe de haies se réarrange à chaque clignement d’yeux.", "Le grand arbre au centre ouvre un œil ensommeillé."],
      ["La réception a votre réservation. Vous n’en avez jamais fait.", "La piscine est pleine de sable, et le maître-nageur est toujours en service.", "La chambre 313 bourdonne la nuit. Il n’y a pas de chambre 312.", "Une tempête de sable teinte chaque fenêtre couleur rouille.", "Le puits au cœur de l’oasis s’est mis à chuchoter."],
      ["Les moines ont fait vœu de silence et le rompent bruyamment.", "Les cloches sonnent treize coups.", "Le scriptorium abrite un livre qui s’écrit tout seul.", "Le sentier de la falaise glisse, et les chèvres vous jugent.", "Dans la crypte, l’abbé attend. Il est mort en 1611."],
      ["La lune des vendanges est si basse qu’on pourrait la croquer.", "Les fûts de la cave font vieillir quelque chose qui n’est pas du vin.", "L’épouvantail regardait de l’autre côté il y a une minute.", "La salle de dégustation sent la prune, la fumée et les mauvaises décisions.", "Les raisins ont noirci en une nuit. Ils écoutent."],
      ["Le plateau 9 est éclairé et tourne. Personne derrière la caméra.", "Il manque exactement un vrai couteau aux accessoires.", "Sur le terrain de tournage, une ville en carton projette de vraies ombres.", "La chaise du réalisateur porte ton nom, mal orthographié.", "La dernière bobine est dans le projecteur. Lancez-la et voyez comment ça finit."],
      ["Chaque horloge de la salle donne une heure différente, et toutes retardent.", "L'automate joueur d'échecs exige une revanche.", "Un oiseau mécanique chante l'alarme, et l'alarme lui répond.", "Le grand planétaire mécanique s’est mis à tourner tout seul.", "Minuit sonne, et chaque pièce exposée tourne la tête."],
    ],
    genericSteps: ["Le premier pas", "Plus loin", "Le point de non-retour", "Le plus dur", "Le bout du chemin"],
    genericScenes: ["L'expédition se met en route. Personne ne se retourne.", "Le chemin se resserre, et la confiance aussi.", "À mi-chemin. Quelqu'un compte les pas.", "L'air se refroidit à chaque choix.", "La dernière ligne droite. Ce qui attend ici vous attendait."],
  },
  sideMissions: {"GO_TWICE": "Pars en mission au moins deux fois.", "GO_THRICE": "Pars en mission au moins trois fois.", "STAY_BEHIND": "Ne pars pas en mission plus d'une fois.", "EARLY_BIRD": "Pars sur la mission 1 ou la mission 2.", "LATE_ARRIVAL": "Ne pars ni sur la mission 1 ni sur la mission 2.", "LANTERN_LEADS": "Mène une équipe qui part en mission.", "NO_LANTERN": "Ne mène jamais une équipe qui part en mission.", "GOOD_COMPANY": "Sois sur une mission réussie.", "BAD_LUCK": "Sois sur une mission ratée.", "CLEAN_RECORD": "Ne sois jamais sur une mission ratée.", "NAYSAYER": "Vote Rejeter au moins trois fois.", "OPEN_HEART": "Ne vote jamais Rejeter.", "LONE_VOICE": "Rejette une équipe que la table approuve.", "LOST_CAUSE": "Approuve une équipe que la table rejette.", "CONTRARIAN": "Sois deux fois du côté perdant d'un vote d'équipe.", "CROWD": "Vote toujours avec la majorité.", "FIRST_TRUST": "Approuve la première proposition de deux missions différentes.", "POPULAR": "Figure dans au moins trois équipes proposées.", "SELF_STARTER": "Mets-toi dans une équipe que tu proposes.", "HUMBLE": "Ne te mets jamais dans une équipe que tu proposes.", "NEIGHBOURS": "Pars en mission avec le joueur à ta gauche.", "CANDLE_BEARER": "Tiens la Bougie à un moment.", "STEADY_EYE": "Ne change jamais de Soupçon (et donnes-en au moins deux).", "RESTLESS": "Soupçonne trois joueurs différents avec tes Soupçons."},
  rules: {
    OPEN_BALLOT: { name: "Vote à découvert", text: "Chaque vote est public : tout le monde voit qui vote pour qui à mesure que les bulletins arrivent.", enforcement: "Les votes peuvent encore changer jusqu'au verrouillage. Les votes des fantômes sont publics aussi." },
    FOG_OF_WAR: { name: 'Brouillard de guerre', text: 'Pendant la discussion, tu ne peux parler directement qu’aux joueurs assis juste à côté de toi.', enforcement: 'Sur l’honneur en présentiel. À distance, le chat de table est remplacé par des murmures entre voisins.' },
    DOUBLE_JEOPARDY: { name: 'Double Péril', text: 'La faction Mort peut tuer jusqu’à deux joueurs chaque nuit (plafond strict : 2).', enforcement: 'Les blocages comme la visite d’une Catin ou la paralysie la ramènent toujours à 0.' },
    PARANOIA: { name: 'Paranoïa', text: 'Chaque bulletin vivant gagne +1 de poids. Le Magistrat pèse 3 ; le Conspirateur ajoute encore +1.', enforcement: 'Les bulletins fantômes restent à 1.' },
    UNRELIABLE_POWER: { name: 'Pouvoir instable', text: 'Chaque action de rôle nocturne lance un d6 : 1–3 échoue, 4–6 réussit. La Mort lance une fois pour l’équipe.', enforcement: 'Un pouvoir unique raté est quand même consommé.' },
    POWER_SURGE: { name: 'Surcharge', text: 'Chaque nuit, un pouvoir répétable éligible tiré au hasard gagne une utilisation supplémentaire. La Mort compte pour une entrée.', enforcement: 'Jamais plus de deux utilisations pour quiconque ; la capacité de la Mort plafonne à 2.' },
    EQUAL_EXCHANGE: { name: 'Échange équitable', text: 'Un joueur du côté de la Mort condamné par vote peut emporter avec lui un joueur non-Mort vivant.', enforcement: 'Les meurtres nocturnes, les tirs du Justicier et les morts liées ne le déclenchent pas.' },
    CURSED_SILENCE: { name: 'Silence maudit', text: 'Pendant la discussion, tu ne peux parler que si l’on s’adresse directement à toi.', enforcement: 'Sur l’honneur. Les nominations et les votes ne sont pas affectés.' },
    MAJORITY_RULE: { name: 'Règle de la majorité', text: 'Une condamnation exige plus de la moitié du poids de tous les votants vivants éligibles sur un même nommé.', enforcement: 'Les abstentions et les non-votants comptent dans le dénominateur. Les bulletins fantômes ne comptent jamais.' },
    HIDDEN_ROLES: { name: 'Rôles cachés', text: 'Les rôles des joueurs éliminés ne sont jamais révélés publiquement avant la fin de la partie.', enforcement: 'C’est déjà le réglage par défaut ; cette carte le verrouille.' },
    VENGEFUL_GHOSTS: { name: 'Fantômes vengeurs', text: 'Chaque joueur éliminé peut déposer un bulletin fantôme de poids 1 par jour.', enforcement: 'Les fantômes ne peuvent pas nommer, utiliser de pouvoirs ni influencer la Règle de la majorité.' },
  },
  presets: {
    missions: { name: "Dead Set : Missions", blurb: "Équipes, votes et sabotage. Personne ne meurt : menez des missions, lisez les votes, et trouvez la Mort avant qu'elle ne trouve le Médium." },
    standard: { name: 'Standard', blurb: 'L’expérience Dead Set telle que prévue. Dix rôles étendus dès 7 joueurs, un Rêve pour tous chaque nuit, 1–3 cartes de règle.' },
    classic: { name: 'Classique / Apprentissage', blurb: 'Pour apprendre. Rôles de base seulement — les sièges étendus sont des Innocents. Rêves désactivés par défaut, au plus une règle simple.' },
    full: { name: 'Jeu complet / Chaos', blurb: 'Les 17 rôles étendus, dont le Bouffon, le Barde et la Sorcière. Beaucoup de hasard, groupes expérimentés uniquement.' },
    doomsday: { name: 'Apocalypse', blurb: 'Standard, contre la montre. Si personne n’a gagné à la fin du dernier jour, la Mort gagne.' },
    custom: { name: 'Personnalisé', blurb: 'Choisis toi-même la réserve étendue, les Rêves, les règles et l’horloge — ou tape le paquet exact. Prévient en cas de configuration déséquilibrée.' },
  },
  scenario: {
    WHO: ['Voyageurs temporels', 'Explorateurs spatiaux', 'Créatures mythiques', 'Fantômes de personnages historiques', 'Mutants', 'Membres d’une société secrète', 'Touristes égarés', 'Intelligences artificielles', 'Villageois médiévaux', 'Sosies de célébrités', "Artistes de cirque à la retraite", "Gardiens de phare", "Chefs rivaux", "Nobles en exil", "Infirmières de nuit", "Plongeurs des abysses", "Invités d’un mariage", "Astronomes échoués", "Danseurs d’un bal masqué", "Moines silencieux"],
    WHERE: ['Un navire qui sombre', 'Un parc d’attractions abandonné', 'Un bunker souterrain', 'Un manoir hanté', 'Une toundra enneigée', "Un phare dans le brouillard", "Une station spatiale abandonnée", "Un train de nuit dans les montagnes", "Une cathédrale inondée", "Un jardin botanique envahi", "Un hôtel dans une oasis", "Un monastère isolé", "Un vignoble au clair de lune", "Un studio de cinéma abandonné", "Un musée d’automates"],
    WHY: ['Trouver un trésor caché', 'S’échapper avant la fin du temps', 'Achever un rituel', 'Résoudre un meurtre', 'Empêcher une catastrophe imminente', "Briser une malédiction ancienne", "Gagner une fortune aux cartes", "Protéger un héritier royal", "Retrouver le chemin de la maison", "Démasquer un traître", "Survivre jusqu’à l’aube", "Récupérer une relique volée", "Réveiller la ville endormie", "Déchiffrer un dernier message", "Garder un terrible secret"],
  },
  products: ['une clé en laiton qui n’ouvre aucune serrure', 'un bocal de sable chaud', 'un billet pour un train parti hier', 'une seule plume noire', 'une montre à gousset qui tourne à l’envers', 'une lettre cachetée à ton nom', 'une fiole de parfum gris', 'un jeu de cartes sans la dame', 'une bougie qui sent la pluie', 'la photo d’une pièce vide', 'une boîte doublée de velours (vide)', 'une boussole qui pointe vers toi'],
  whispers: [
    'Bo a été retrouvé mort. Personne n’a vu la Catin partir.',
    'La ville a pendu le Bouffon. Il a ri.',
    'La Mentaliste savait. Personne ne l’a crue.',
    'Deux voix de moins. Le Bouc émissaire a payé.',
    'Fay jurait être le Gardien. Gus aussi.',
    'Le Nécromancien a ramené le mauvais ami.',
    'Une bombe devant la porte. Une pièce, lancée.',
    'Tout le monde s’est réveillé. C’était pire, d’une certaine façon.',
    'La Mort a voté avec la ville. Évidemment.',
  ],
  guide: {
    missionsH: "Dead Set : Missions",
    missions: `<p>Un second mode pour 5 à 12 joueurs, à choisir dans le salon. Personne ne meurt : la Mort s'est glissée dans l'expédition, et la table doit la trouver.</p>
<ol>
<li><b>La carte de mission.</b> Chaque mission commence par une carte tirée, avant le choix de l'équipe. La plupart sont des <i>Missions ordinaires</i> ; de temps en temps, une carte change l'équipe, le vote ou la révélation. Elle vaut pour toute la mission.</li>
<li><b>La proposition.</b> Le Meneur de mission (la lanterne) choisit une équipe de la taille indiquée.</li>
<li><b>Le vote d'équipe.</b> Chacun approuve ou rejette en secret ; les votes sont révélés tous ensemble, avec les noms. Une majorité envoie l'équipe. Sinon, le joueur suivant à gauche propose. La cinquième proposition part quel que soit le vote.</li>
<li><b>La mission.</b> Chaque membre de l'équipe joue une carte en secret. Les Vivants ne peuvent jouer que Réussite ; la Mort peut jouer Réussite ou Sabotage. Un Sabotage fait échouer la mission (deux pour la mission 4 à partir de 7 joueurs). Les cartes sont mélangées et retournées une à une.</li>
<li><b>L'interlude nocturne.</b> Chacun choisit un Soupçon secret. Après les missions 2, 3 et 4, le porteur de la Bougie apprend le camp d'un joueur, et la Bougie lui revient. Des indices peuvent arriver à l'aube.</li>
</ol>
<p><b>La fin.</b> Trois réussites : la Mort se démasque et le Faucheur désigne le Médium. Juste, la Mort gagne ; faux, les Vivants gagnent. Trois échecs : le Dernier Carré. Chacun désigne un joueur. Si c'est un Vivant, la Mort gagne ; si vous prenez la Mort, le Faucheur a quand même droit au Jugement.</p>`,
    missionCardsH: "Cartes de mission",
    sidesH: "Autres camps et rebondissements",
    sides: `<p>Optionnels, à activer dans le salon (ou à ajouter avec les compteurs de rôles en partie personnalisée). La ville ne gagne qu'une fois la Mort, la Secte et l'Éventreur tous éliminés.</p>
<ul>
<li><b>Amoureux :</b> deux joueurs au hasard, de n'importe quel camp, tombent amoureux. Chacun apprend le nom de l'autre. Si l'un meurt, l'autre meurt de chagrin. S'ils sont les deux derniers vivants, ils gagnent ensemble.</li>
<li><b>La Secte :</b> un Gourou recrute un joueur chaque nuit. Les recrues gardent leur rôle mais gagnent avec la Secte, qui gagne quand elle est plus nombreuse que tous les autres. La Mort, l'Éventreur et les joueurs protégés ne peuvent pas être recrutés.</li>
<li><b>L'Éventreur :</b> un tueur solitaire qui frappe chaque nuit. La Mort ne peut pas le tuer la nuit (sauf sous une Lune de sang). Il gagne s'il est le dernier debout, ou seul avec un joueur qui n'est pas un tueur.</li>
<li><b>Indices</b> (activés par défaut, rares) : certaines aubes, un ou deux joueurs hors de l'équipe de la Mort reçoivent un indice véridique, comme « A ou B marche avec la Mort ».</li>
<li><b>Pile ou face en cas d'égalité</b> (optionnel) : une égalité en tête est tranchée à pile ou face au lieu d'épargner tout le monde.</li>
<li><b>Vote à découvert</b> (une carte de règle) : chaque vote est public dès qu'il est déposé.</li>
</ul>`,
    kicker: 'Les règles, v1.0',
    title: 'Comment<br><i>jouer.</i>',
    intro: 'La plupart d’entre vous veulent survivre. Quelques-uns sont la Mort. Personne ne sait qui est qui — sauf la Mort, qui connaît les siens.',
    toc: ['Bases', 'Un tour', 'Victoire', 'Rôles de base', 'Rôles étendus', 'Jeu complet', 'Rêves', 'Cartes de règle', 'Modes', 'Ordre de nuit', 'Téléphones'],
    basicsH: 'Les bases',
    basics: `<p>Dead Set est un jeu d’ambiance et de déduction sociale pour 5 à 13 joueurs. Chacun rejoint la même salle depuis son propre téléphone et reçoit un <b>rôle</b> secret. La plupart des rôles appartiennent à la faction <b>non-Mort</b> ; un ou plusieurs joueurs sont secrètement <b>la Mort</b>.</p>
<ul>
<li>Les <b>rôles</b> durent toute la partie : ton allégeance et ton pouvoir.</li>
<li>Les <b>Rêves</b> sont des effets d’une nuit : dès la nuit 1, chaque joueur vivant en tire un en secret chaque nuit.</li>
<li>Les <b>cartes de règle</b> (1 à 3, tirées à la mise en place) tordent toute la partie — doubles meurtres, votes pondérés, fantômes qui votent.</li>
<li>Le <b>scénario</b> (QUI / OÙ / POURQUOI) n’est que de la narration. Il ne change jamais une règle.</li>
</ul>
<p>Tu peux dire la vérité sur ton rôle, mentir ou te taire. Ne montre jamais ton écran. L’appli est le narrateur : personne n’a à rester sur la touche, et l’hôte ne voit pas plus de secrets que les autres.</p>`,
    roundH: 'Un tour',
    round: `<ol>
<li><b>Nuit 0 — la révélation.</b> Retourne ta carte de rôle, lis-la, touche <em>Compris</em>. Rien d’autre ne se passe : pas de meurtre, pas de Rêve, pas de pouvoir. Les joueurs Mort voient leurs coéquipiers.</li>
<li><b>Matin.</b> Les nouvelles de l’aube sont lues : qui est mort dans la nuit (jamais comment, jamais son rôle). Ce que tu as appris en privé apparaît sous <em>Toi seul le sais</em>. Un Diplomate peut déclarer son immunité ici ; un Justicier peut tirer.</li>
<li><b>Discussion et nominations.</b> Parlez. Chaque joueur vivant peut faire <b>une nomination officielle</b> par jour. Nommer quelqu’un de déjà nommé ne fait qu’appuyer la nomination.</li>
<li><b>Défense.</b> Chaque nommé, dans l’ordre des nominations, prend la parole.</li>
<li><b>Vote secret.</b> Chaque joueur vivant éligible vote pour un nommé ou s’abstient, sur son propre téléphone. Tu peux changer ton vote jusqu’à ce que l’hôte le verrouille. Seuls les totaux sont publiés.</li>
<li><b>Condamnation.</b> Le seul total le plus élevé est condamné (éliminé). <b>Une égalité en tête ne condamne personne.</b> Au plus une personne est condamnée par jour.</li>
<li><b>Nuit.</b> Les écrans s’assombrissent. Avec les Rêves, la tombée de la nuit dure quinze secondes (cinq sans) : chacun retourne son Rêve et les Voleurs de rêves peuvent échanger. Celui dont le Rêve a été volé le voit. Puis les actions de nuit s’ouvrent d’elles-mêmes. Chacun soumet son pouvoir nocturne en secret ; la Mort s’accorde sur son meurtre. Quand tout le monde dort — ou que le temps est écoulé —, le serveur résout toutes les actions d’un coup et le jour suivant se lève.</li>
</ol>
<p class="small">Ce que tu ne soumets pas avant la fermeture d’une fenêtre devient un passage (ou une abstention). Un téléphone déconnecté garde sa place et ses secrets.</p>`,
    winH: 'Victoire',
    win: `<ul>
<li>Les <b>non-Mort gagnent</b> dès qu’aucun joueur du côté de la Mort n’est en vie.</li>
<li><b>La Mort gagne</b> dès que les joueurs vivants du côté de la Mort sont <b>strictement plus nombreux</b> que tous les autres vivants. L’égalité ne suffit pas.</li>
<li>Le <b>Bouffon</b> (Jeu complet uniquement) gagne seul, immédiatement, si la ville le condamne par vote.</li>
<li>Si une nuit ne laisse personne en vie, la partie est <b>nulle</b>.</li>
<li>Avec l’<b>Horloge de l’Apocalypse</b>, la Mort gagne aussi si personne n’a gagné à la fin du dernier jour.</li>
<li><b>Lune de sang</b> (activée par défaut) : après deux nuits de suite sans mort, la nuit suivante aucune protection ne tient et rien ne peut bloquer le meurtre de la Mort. Elle met fin aux impasses, comme un Gardien seul qui se protège sans cesse face à une Mort seule.</li>
<li><b>La Mort gagne dans les deux derniers</b> (option) : si une Mort fait partie des deux derniers vivants, la Mort gagne aussitôt.</li>
</ul>
<p>La victoire est vérifiée après chaque résolution complète — jamais au milieu d’une nuit.</p>`,
    coreH: 'Rôles de base',
    coreP: 'Toujours en jeu.',
    killH: 'Comment l’équipe de la Mort tue',
    kill: 'Tous les coéquipiers Mort vivants partagent une salle. Chacun propose des cibles ; le meurtre n’a lieu que si <b>tous confirment exactement la même sélection</b>. Au moindre désaccord ou à la moindre confirmation manquante, la Mort passe. L’équipe tue <b>un</b> joueur par nuit, quel que soit le nombre de Morts — deux avec Double Péril, Équipe de nuit ou Surcharge, jamais plus de deux.',
    extH: 'Rôles étendus — Standard',
    extP: 'Dès 7 joueurs, des sièges supplémentaires sont pourvus depuis cette réserve (tirés en secret). 7 joueurs → 1 siège étendu, 10 → 2, 11+ → 3.',
    fullH: 'Ajouts du Jeu complet',
    fullP: 'Uniquement en Jeu complet / Chaos ou Personnalisé. Groupes expérimentés.',
    dreamsH: 'Rêves',
    dreamsP: 'Dès la nuit 1, chaque joueur vivant tire au hasard une carte Rêve chaque nuit (doublons possibles). Elle ne vaut que pour cette nuit. Tu peux décrire le tien — sincèrement ou non.',
    dreamsNote: `Certains Rêves sont plus rares que d’autres, et l’Insomnie n’apparaît jamais plus de deux fois par partie ; une partie Personnalisée peut régler la fréquence de chacun. Les échanges des Voleurs de rêves ont lieu pendant la tombée de la nuit, avant l’ouverture des actions, dans l’ordre des sièges, une fois chacun. C’est la carte que tu tiens à la fin qui compte.`,
    rulesH: 'Cartes de règle',
    rulesP: '1 à 3 sont tirées (ou choisies) à la mise en place et restent en vigueur toute la partie. Certaines ne peuvent être respectées que sur l’honneur quand vous jouez dans la même pièce.',
    modesH: 'Modes',
    modesTh: ['Mode', 'Joueurs', 'Ce qui change'],
    countsH: 'Nombre de rôles',
    countsTh: ['Joueurs', 'Mort', 'Innocent', 'Gardien · Mentaliste · Psychopathe', 'Étendus'],
    modesNote: 'Classique / Apprentissage remplit les sièges étendus avec des Innocents. Jouer dans la même pièce ou à distance n’est qu’un choix de transmission, pas un autre jeu : à distance, un chat de table s’ajoute (et des murmures entre voisins avec le Brouillard de guerre).',
    orderH: 'Qui l’emporte la nuit',
    order: `<p>Tout le monde soumet en même temps ; le serveur résout ensuite dans un ordre fixe, pour que le résultat ne dépende jamais de qui a touché l’écran en premier.</p>
<ol>
<li><b>Suppression.</b> Le silence du Barde annule tous les pouvoirs de rôle. La Paralysie du sommeil arrête son porteur — et une Mort active qui la porte arrête tout le meurtre. Le Pouvoir instable lance ses dés.</li>
<li><b>Malédictions et visites.</b> La Malédiction d’une Sorcière fait échouer l’action de la cible (ou tout le meurtre de la Mort). Une Catin qui visite une Mort active ramène le meurtre à zéro.</li>
<li><b>Conversions.</b> D’abord le serment de l’Agent double, puis la copie de l’Imitateur. Ils comptent dès cette nuit pour le Mentaliste, mais les nouveaux membres de la Mort ne tuent qu’à partir de la nuit suivante.</li>
<li><b>Le meurtre de la Mort.</b> Une cible survit si elle a, dans l’ordre : résurrection temporaire, Ange gardien, Bénédiction, bouclier du Gardien, une prédiction juste de l’Oracle. Sinon un Garde du corps prend la lame — sinon elle meurt.</li>
<li><b>Psychopathe.</b> La marque prend, sauf si la cible est morte ou protégée (résurrection, Ange, Bénédiction, Gardien).</li>
<li><b>Bombes et le reste.</b> Une bombe est un pile ou face équitable ; le Gardien ne l’arrête pas. Les Catins en visite sont prises dans l’explosion. Lectures, livraisons, paris.</li>
<li>Le <b>Nécromancien</b> ramène les morts — seulement s’il a lui-même survécu à la nuit.</li>
<li><b>Destins liés.</b> Les Catins meurent avec une victime de la Mort qu’elles visitaient ; les porteurs de Cauchemar partagé et de Somnambulisme meurent avec leur partenaire. Seule la résurrection ou l’Ange gardien empêche une mort liée. Puis le temps emprunté expire.</li>
<li><b>Aube.</b> Les survivants reçoivent leurs rapports privés. Le public apprend seulement qui est mort.</li>
</ol>`,
    phonesH: 'Jouer sur téléphone',
    phones: `<ul>
<li>L’hôte crée une salle et partage le code à six caractères ou le QR code. Les autres ouvrent le lien, saisissent un nom et touchent <em>Prêt</em>.</li>
<li>Ta place est liée à ton navigateur. Si un téléphone s’éteint, l’hôte peut émettre un <b>code de récupération</b> à usage unique depuis ses commandes ; en le saisissant sur un nouvel appareil, ta place y est transférée et l’ancien appareil est déconnecté.</li>
<li>Le téléphone de l’hôte est un téléphone de joueur ordinaire avec quelques boutons en plus : avancer la phase, ajouter 30 secondes, terminer la partie. L’hôte ne voit ni les rôles, ni les Rêves, ni les votes.</li>
<li>Un <b>tableau public</b> (sans secrets) peut s’afficher sur une télé : ouvre <span class="mono">/board/CODE</span>.</li>
<li>Si quelqu’un veut mener la table et tout voir, crée la salle en tant que <b>modérateur de confiance</b>. Il ne peut pas occuper de siège, et tout le monde en est informé.</li>
<li>Chacun choisit sa langue avec le bouton de langue sur l’écran d’accueil, l’invitation ou le menu de la salle. L’hôte règle la langue par défaut de la table dans le salon.</li>
<li>MUET, Brouillard de guerre et Silence maudit sont des règles d’honneur en présentiel. À distance, le chat les applique.</li>
</ul>`,
  },
};
