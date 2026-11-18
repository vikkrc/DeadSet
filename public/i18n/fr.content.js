// Français : contenu du jeu (rôles, rêves, cartes de règle, modes, cartes de scénario, guide).
export default {
  and: 'et',
  numbers: ['aucun', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix'],
  roles: {
    G_UNDERTAKER: { name: "Croque-mort", when: "Toujours", summary: "Tu tiens le registre des sépultures. Donne à ta bande un mot et un nombre.", detail: "Seuls toi et l’autre Croque-mort savez ce qui repose sous chaque pierre. Ton mot doit relier autant de tombes de ta bande, et mener loin de la tombe de la Mort." },
    G_DIGGER: { name: "Fossoyeur", when: "Toujours", summary: "Lis le signe de ton Croque-mort et déterre les reliques de ta bande.", detail: "Discutez, puis vote pour une tombe sur ton téléphone. Votre relique : creusez encore. Une tombe vide ou une relique de l’autre bande : le tour passe. La tombe de la Mort : votre bande perd." },
    O_SEER: { name: "Voyant", when: "Toujours", summary: "Prédis où la roue s’arrêtera, et tourne-la quand ça paie.", detail: "À chaque tour, prédis en secret la Vie, la Mort ou la Renaissance, et décide si tu tournes la roue d’un cran (cela coûte une de tes cinq Influences). Tous les tours s’additionnent. Une prédiction juste rapporte 3 ; l’Influence inutilisée vaut 1 chacune à la fin." },
    W_READER: { name: "Lecteur", when: "Toujours", summary: "Réponds au dilemme pour toi, et prédis un ami.", detail: "À chaque tour, tu réponds à un dilemme imaginaire et tu prédis la réponse de la personne que tu lis. Une prédiction juste rapporte 2 ; ta propre réponse, rien : surprendre ton lecteur est de bonne guerre." },
    Q_MIMIC: { name: "Imitateur", when: "Toujours", summary: "Tu portes le visage d’un ami. Tu ne sais pas où tu es.", detail: "Tous les autres partagent un même lieu. Écoute les questions, réponds comme si tu y étais, et devine le lieu. Démasque-toi à tout moment et nomme-le pour gagner ; un Imitateur condamné a encore un dernier essai." },
    Q_LIVING: { name: "Vivant", when: "Toujours", summary: "Tu connais le lieu. Prouve-le sans le trahir.", detail: "Pose et réponds à des questions sur le lieu : assez précis pour montrer que tu y es, assez vague pour que l’Imitateur ne le devine pas. Accuse une fois par partie ; seule une table unanime condamne." },
    S_GHOST: { name: "Fantôme", when: "Toujours", summary: "On t’a assassiné. Tu sais qui, où et pourquoi, et tu ne peux pas parler.", detail: "Envoie à chaque lecteur une vision pour sa rangée. D’une tache froide, givre une vision qui n’est pas la tienne." },
    S_MEDIUM: { name: "Médium", when: "Toujours", summary: "Lis les visions et allume des bougies sur la vérité.", detail: "À chaque manche tu lis une rangée : qui, où ou pourquoi. Résolvez les trois avant que les bougies ne s’éteignent, puis nommez l’Imposteur." },
    S_DECEIVER: { name: "Imposteur", when: "Toujours", summary: "Un second esprit dans un corps vivant. Tu connais la vérité, et tu mens.", detail: "Tu ressembles en tout point à un Médium. Quelques fois par partie, tu échanges la vision du Fantôme d’un autre lecteur contre une des tiennes. Tu gagnes si les bougies s’éteignent, ou si la table nomme le mauvais joueur." },
    N_SLEEPER: { name: "Dormeur", when: "Toujours", summary: "Une nuit, un vote. Ta carte peut changer de mains pendant ton sommeil.", detail: "Regarde ta carte une fois, agis quand ton téléphone te réveille, puis débattez et désignez. Tu es la carte posée devant toi à l’aube." },
    N_TWIN: { name: "Jumeau", when: "La nuit", summary: "Tu te réveilles avec ton jumeau et vous vous voyez.", detail: "Les Jumeaux vont par paire. Si ton jumeau n’est pas à la table, l’autre carte est au centre." },
    N_INSOMNIAC: { name: "Insomniaque", when: "La nuit, en dernier", summary: "Tu te réveilles en dernier et regardes ta propre carte.", detail: "Tu vois si quelqu’un t’a pris ta carte pendant la nuit, et ce que tu es à l’aube." },
    K_GUEST: { name: "Invité masqué", when: "Toujours", summary: "Danse, jette un œil et revendique des masques pour amasser des Âmes. 13 Âmes gagnent.", detail: "Ton masque est une carte de rôle que tu as vue une fois. Échange ou fais semblant pour le cacher ; jette un œil pour le connaître ; revendique un masque pour user de son pouvoir. Qui croit qu'il est à lui peut te défier." },
    C_DIGGER: { name: "Fossoyeur", when: "Toujours", summary: "Enterre tes cercueils, annonce combien tu peux en ouvrir, et creuse. Deux fouilles propres gagnent.", detail: "Ta Malédiction est ton bluff : enterre-la pour que les autres tombent dessus. Si tu remportes l'enchère, tu ouvres d'abord ta propre tombe." },
    X_LIVING: { name: "Vivant", when: "Toujours", summary: "Tu vois le mot de passe dans la boule de cristal. Donne un mot qui prouve que tu le connais, sans le livrer au Démon.", detail: "Trop évident, et le Démon apprend le mot de passe. Trop obscur, et la table te soupçonne. Puis désignez le Démon." },
    X_DEMON: { name: "Démon", when: "Toujours", summary: "Tu ne vois que la catégorie. Fonds-toi dans la masse : dis un mot comme si tu connaissais le mot de passe.", detail: "Écoute les autres et perce le mot de passe. Si la table désigne quelqu'un d'autre, tu gagnes. Si on te démasque, un bon essai gagne quand même." },
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
      ["Retrouver le vieux registre", "Pister le créancier", "Réunir ce qui est dû", "Rendez-vous au carrefour", "Tout rembourser"],
      ["Retrouver les vieilles lettres d’amour", "Découvrir où elle est partie", "Gagner ses amis", "Arranger une rencontre fortuite", "Le dire enfin"],
      ["Compter ce qui est resté", "Effacer les empreintes", "Brûler les reçus", "Cacher l’arme", "Ne laisser aucune trace"],
      ["Repérer le trésor", "Soudoyer un garde", "Découper la vitre", "Échanger la couronne", "Sortir en souriant"],
      ["Trouver le témoin", "Apprendre ce qu’il a vu", "Couper le fil du téléphone", "L’attirer à l’écart", "Le faire taire jusqu’à l’aube"],
      ["Trouver le testament", "Prouver qui tu es", "Tenir plus longtemps que les autres héritiers", "Ouvrir le caveau de famille", "Prendre ce qui te revient"],
      ["Se recueillir sur sa tombe", "Découvrir qui l’a trahi", "Trouver leur repaire", "Retourner leurs amis", "Régler les comptes"],
      ["S’inscrire au concours", "Passer le premier tour", "Déjouer le favori", "Survivre à la finale", "Brandir le prix"],
      ["Lire le verdict", "Trouver le véritable alibi", "Pister le vrai coupable", "Convaincre le juge", "Ouvrir la porte de la cellule"],
      ["Faire ses bagages en secret", "Voler les clés de la calèche", "Passer devant le père sans bruit", "Gagner la chapelle", "Dire oui avant l’aube"],
      ["Déterrer la vieille boîte", "Lire ce qu’elle contient", "Découvrir qui d’autre sait", "Brûler la dernière copie", "L’enterrer plus profond"],
      ["Étudier les symptômes", "Trouver l’herbe rare", "Préparer le remède", "L’essayer sur soi", "Sauver le patient"],
      ["Allumer les bougies noires", "Prononcer son nom", "Ouvrir le cercle", "Poser la question", "Le renvoyer"],
      ["Trouver le sceau légitime", "Rallier la vieille garde", "Prendre les portes d’assaut", "Affronter l’usurpateur", "Monter sur le trône"],
      ["Retrouver les esquisses perdues", "Mélanger le pigment interdit", "Peindre toute la nuit", "Le cacher aux critiques", "Signer la toile"],
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
      ["Le clocher est le seul passage.", "Des lanternes brillent aux fenêtres sous l’eau.", "Une barque passe à la dérive, personne aux rames.", "La cloche du village sonne sous la surface.", "L’eau monte, et les maisons se remplissent de voix."],
      ["L’orchestre s’accorde. Il n’y a pas de musiciens.", "La loge cinq est toujours réservée. Ce soir, elle est occupée.", "Le lustre se balance sans le moindre courant d’air.", "La diva lance une note qui fêle les miroirs.", "Le rideau se lève sur le dernier acte. Vous y jouez."],
      ["La grille s’ouvre avant que vous la touchiez.", "Une tombe fraîche, et vos initiales sur la pierre.", "Les corbeaux vous comptent.", "Quelqu’un entretient ces tombes. Chaque nuit.", "Le sol soupire, et la terre se met à bouger."],
      ["Le télescope vise déjà quelque chose.", "Les cartes du ciel montrent une étoile de trop.", "La coupole ne se ferme pas, et la lune regarde dedans.", "Les notes de l’astronome finissent par : ça se rapproche.", "Une éclipse commence, douze ans trop tôt."],
      ["L’orchestre joue une valse dont personne ne connaît les pas.", "Chaque danseur porte un masque, et aucun n’a de visage.", "Le champagne ne s’épuise jamais. C’est bien le problème.", "Les miroirs montrent le bal tel qu’il était il y a un siècle.", "La musique s’arrête. Tout le monde se tourne vers vous."],
      ["La glace est si claire qu’on voit des visages dessous.", "Des traces de patins tournent autour d’un trou qui n’était pas là.", "Les cabanes de pêche sont vides, les lignes encore tendues.", "Une fissure avance vers vous, lente et délibérée.", "Sous vos pieds, quelque chose frappe pour qu’on le laisse sortir."],
      ["Le chapiteau s’est dressé dans la nuit, sans que personne le monte.", "La diseuse de bonne aventure connaît déjà vos noms.", "La cage du lion est ouverte. Le lion a disparu.", "Le Monsieur Loyal annonce un numéro auquel vous n’avez jamais consenti.", "Le cirque plie bagage autour de vous. Vous faites partie du spectacle."],
      ["Les livres sont secs, alors que l’eau monte à la taille.", "Une fiche du catalogue mentionne un livre sur vous.", "La bibliothécaire vous fait chut sous la surface.", "Les pages se tournent toutes seules dans le courant.", "Le rayon le plus profond garde le seul exemplaire. L’eau monte."],
      ["Le pain d’épice sent délicieusement bon. C’est ainsi qu’elle vous attrape.", "Le chaudron bouillonne, et personne n’a allumé le feu.", "Le chat noir vous montre le chemin. Ne lui faites pas confiance.", "Les bocaux de l’étagère portent vos noms.", "La sorcière rentre plus tôt."],
      ["Les rois reposent en rang. Un cercueil est ouvert.", "Les torches s’allument d’elles-mêmes à votre passage.", "Une inscription prévient : seul le sang royal peut passer.", "Le gisant de la reine a tourné la tête.", "La porte de pierre se referme en grinçant derrière vous."],
      ["Une lanterne fait des signaux depuis les falaises. Personne ne répond.", "La grotte est pleine de caisses, chacune marquée d’un crâne.", "La marée monte plus vite que ne le disent les cartes.", "Des douaniers sur la plage, et un contrebandier parmi vous.", "Le dernier bateau part à minuit, avec ou sans vous."],
      ["Les étals ouvrent à minuit et vendent ce que vous avez perdu.", "Un marchand vous propose une affaire. Le prix est un souvenir.", "Les pièces de vos poches se sont changées en feuilles.", "Quelqu’un vend une carte de l’endroit où vous allez.", "Aux premières lueurs, tout le marché disparaîtra. Vite."],
      ["Les ailes tournent, alors que le vent est tombé.", "La fumée sort du moulin, mais rien ne se consume.", "Le meunier moud encore sa farine au milieu des flammes.", "Seule l’échelle mène en haut, et elle couve déjà.", "La grande roue s’effondre dans une gerbe d’étincelles."],
      ["Les patients dorment tous, et tous sourient.", "Les dossiers du médecin sont écrits de votre main.", "Le téléphérique ne fait que descendre.", "La chambre 9 est glaciale, radiateur brûlant ou non.", "Une avalanche bloque la route. Plus personne ne part."],
      ["À chaque détour, une version de vous un peu pire.", "Un reflet a un instant de retard.", "Quelqu’un dans les miroirs porte un masque à votre visage.", "Le panneau de sortie indique toutes les directions.", "Les miroirs se fendent, et vos reflets en sortent."],
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
    graverobbers: { name: "Dead Set : Pilleurs de tombes", blurb: "Deux bandes de pilleurs, la Lune et le Soleil, fouillent un cimetière de mots ou d’icônes pour les reliques de leur divinité. Seuls les croque-morts savent ce qui gît dessous. Une tombe appartient à la Mort." },
    omen: { name: "Dead Set : Le Présage", blurb: "Une roue occulte indique la Vie, la Mort ou la Renaissance. Chacun peut la tourner en secret ; prédis où elle s’arrête." },
    mirror: { name: "Dead Set : Le Miroir", blurb: "Le miroir hanté montre ce que tes amis pensent que tu ferais. Réponds au dilemme, et lis la personne en face de toi." },
    mimic: { name: "Dead Set : Imitateur", blurb: "Tout le monde sait où vous êtes, sauf la chose qui porte le visage d’un ami. Demandez, répondez, accusez ; l’Imitateur tend l’oreille pour trouver le lieu." },
    seance: { name: "Dead Set : Séance", blurb: "Un Fantôme assassiné et muet envoie des visions ; les Médiums y lisent qui, où et pourquoi. Un Imposteur parmi eux remplace des visions par des mensonges." },
    midnight: { name: "Dead Set : Minuit", blurb: "Une nuit, un vote. Les cartes changent de mains dans le noir ; à l’aube, tu es ce qui est posé devant toi. Trouve la Mort, ou sois-la." },
    carnival: { name: "Dead Set : Carnaval", blurb: "Un bal masqué de bluff et de mémoire. Chacun porte une carte de rôle en guise de masque, mélangée jusqu'à ce que nul n'en soit sûr. Revendique des masques et amasse des Âmes ; 13 gagnent." },
    coffins: { name: "Dead Set : Cercueils", blurb: "Un jeu de bluff rapide. Enterre de l'or et une malédiction, annonce combien de cercueils tu peux ouvrir, puis creuse. Deux fouilles propres gagnent." },
    exorcism: { name: "Dead Set : Exorcisme", blurb: "Un jeu de mots et de bluff. Tout le monde voit le mot de passe dans la boule de cristal, sauf le Démon. Un mot chacun, puis démasquez le Démon." },
    missions: { name: "Dead Set : Missions", blurb: "Équipes, votes et sabotage. Personne ne meurt : menez des missions, lisez les votes, et trouvez la Mort avant qu'elle ne trouve le Médium." },
    standard: { name: 'Standard', blurb: 'L’expérience Dead Set telle que prévue. Dix rôles étendus dès 7 joueurs, un Rêve pour tous chaque nuit, 1–3 cartes de règle.' },
    classic: { name: 'Classique / Apprentissage', blurb: 'Pour apprendre. Rôles de base seulement — les sièges étendus sont des Innocents. Rêves désactivés par défaut, au plus une règle simple.' },
    full: { name: 'Jeu complet / Chaos', blurb: 'Les 17 rôles étendus, dont le Bouffon, le Barde et la Sorcière. Beaucoup de hasard, groupes expérimentés uniquement.' },
    doomsday: { name: 'Apocalypse', blurb: 'Standard, contre la montre. Si personne n’a gagné à la fin du dernier jour, la Mort gagne.' },
    custom: { name: 'Personnalisé', blurb: 'Choisis toi-même la réserve étendue, les Rêves, les règles et l’horloge — ou tape le paquet exact. Prévient en cas de configuration déséquilibrée.' },
  },
  scenario: {
    WHO: ['Voyageurs temporels', 'Explorateurs spatiaux', 'Créatures mythiques', 'Fantômes de personnages historiques', 'Mutants', 'Membres d’une société secrète', 'Touristes égarés', 'Intelligences artificielles', 'Villageois médiévaux', 'Sosies de célébrités', "Artistes de cirque à la retraite", "Gardiens de phare", "Chefs rivaux", "Nobles en exil", "Infirmières de nuit", "Plongeurs des abysses", "Invités d’un mariage", "Astronomes échoués", "Danseurs d’un bal masqué", "Moines silencieux", "Jardiniers de minuit", "Horlogers", "Contrebandiers", "Chanteurs d’opéra", "Pilleurs de tombes", "Gardes royaux", "Pêcheurs", "Alchimistes", "Banquiers", "Contrôleurs de train", "Diseuses de bonne aventure", "Guides de montagne", "Allumeurs de réverbères", "Marionnettistes", "Ornithologues", "Croque-morts", "Tricheurs aux cartes", "Chasseurs", "Cracheurs de feu", "Charmeurs de serpents"],
    WHERE: ['Un navire qui sombre', 'Un parc d’attractions abandonné', 'Un bunker souterrain', 'Un manoir hanté', 'Une toundra enneigée', "Un phare dans le brouillard", "Une station spatiale abandonnée", "Un train de nuit dans les montagnes", "Une cathédrale inondée", "Un jardin botanique envahi", "Un hôtel dans une oasis", "Un monastère isolé", "Un vignoble au clair de lune", "Un studio de cinéma abandonné", "Un musée d’automates", "Un village englouti", "Un opéra aux chandelles", "Un cimetière oublié", "Un observatoire lunaire", "Une salle de bal dorée", "Un lac gelé", "Un cirque ambulant", "Une bibliothèque engloutie", "La chaumière d’une sorcière", "Une crypte royale", "Une crique de contrebandiers", "Un marché de minuit", "Un moulin en flammes", "Un sanatorium alpin", "Un labyrinthe de miroirs"],
    WHY: ['Trouver un trésor caché', 'S’échapper avant la fin du temps', 'Achever un rituel', 'Résoudre un meurtre', 'Empêcher une catastrophe imminente', "Briser une malédiction ancienne", "Gagner une fortune aux cartes", "Protéger un héritier royal", "Retrouver le chemin de la maison", "Démasquer un traître", "Survivre jusqu’à l’aube", "Récupérer une relique volée", "Réveiller la ville endormie", "Déchiffrer un dernier message", "Garder un terrible secret", "Régler une vieille dette", "Reconquérir un amour perdu", "Cacher les preuves", "Voler les joyaux de la couronne", "Faire taire un témoin", "Toucher un héritage", "Venger un frère", "Gagner le grand prix", "Prouver son innocence", "S’enfuir avant l’aube", "Enterrer le passé", "Guérir une étrange maladie", "Invoquer un esprit", "Reprendre un trône volé", "Achever le chef-d’œuvre"],
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
  // The Mirror: dilemmas by stable id, [prompt, A, B, C] (see public/dilemmas.js).
  dilemmas: {
    d001: ["À minuit, un inconnu trempé par l’orage frappe et demande à entrer.", "Le faire entrer", "Parler à travers la porte", "Faire comme si personne n’était là"],
    d002: ["Tu trouves un journal intime verrouillé dans le grenier de ta nouvelle maison.", "Forcer le cadenas et le lire", "Le rendre aux anciens propriétaires", "Le brûler sans le lire"],
    d003: ["Une diseuse de bonne aventure propose de te dire le jour de ta mort.", "Écouter", "Refuser poliment", "Demander plutôt pour quelqu’un d’autre"],
    d004: ["Lors d’un dîner, la lumière s’éteint et un cri retentit.", "Courir vers le cri", "Chercher d’abord une bougie", "Rester parfaitement immobile"],
    d005: ["Un fantôme propose de hanter qui tu veux pendant une semaine.", "Nommer un rival", "Nommer un ami, pour rire", "Refuser"],
    d006: ["Tu hérites d’un château en ruine, malédiction familiale comprise.", "Y emménager quand même", "Le vendre aussitôt", "En faire un hôtel"],
    d007: ["Chaque nuit à trois heures, un corbeau se pose sur ton rebord de fenêtre.", "Le nourrir", "Lui parler", "Tirer les rideaux"],
    d008: ["Tu peux passer une nuit enfermé dans un célèbre lieu hanté.", "Un cachot de château", "Un asile abandonné", "Un vaisseau fantôme en mer"],
    d009: ["Ton reflet cligne des yeux un instant après toi.", "Le fixer jusqu’à ce qu’il cède", "Couvrir tous les miroirs", "Lui faire coucou pour voir"],
    d010: ["Une séance tourne mal et un esprit demande un service.", "L’écouter", "Arrêter la séance aussitôt", "Négocier quelque chose d’abord"],
    d011: ["Le dernier train est vide, à part un passager silencieux.", "S’asseoir à côté de lui", "S’asseoir le plus loin possible", "Attendre le train suivant"],
    d012: ["Tu peux emporter un seul objet dans l’au-delà.", "Une photographie", "Un bon livre", "Un jeu de cartes"],
    d013: ["Une pièce maudite porte chance mais te coûte un souvenir par jour.", "La garder", "La passer à quelqu’un", "La jeter dans la rivière"],
    d014: ["Tu te perds au crépuscule dans une forêt brumeuse.", "Suivre les lumières au loin", "Grimper à un arbre et attendre", "Rebrousser chemin"],
    d015: ["À un bal masqué, quelqu’un porte ton visage en guise de masque.", "L’affronter", "Le suivre discrètement", "Échanger les masques et partir"],
    d016: ["Tu peux apprendre un secret sur chaque personne à cette table.", "Sa pire peur", "Son plus gros mensonge", "Son talent caché"],
    d017: ["Un chat noir croise ton chemin avant un rendez-vous important.", "Continuer", "Prendre une autre route", "S’arrêter pour le caresser"],
    d018: ["Ta maison est hantée par un fantôme sympathique mais très bruyant.", "Apprendre à vivre avec", "Appeler un exorciste", "Faire payer les touristes"],
    d019: ["Tu te réveilles vampire.", "Embrasser la vie nocturne", "Chercher un remède", "Le garder secret et continuer"],
    d020: ["Une lettre mystérieuse t’invite dans un manoir pour la lecture d’un testament.", "Y aller seul", "Y aller avec un ami", "L’ignorer"],
    d021: ["Tu es le dernier client éveillé d’une vieille auberge, et l’escalier grince.", "Aller voir", "Fermer ta porte à clé", "Faire semblant de dormir"],
    d022: ["Une sorcière t’offre une potion.", "Un philtre d’amour", "Un sérum de vérité", "Une potion d’invisibilité"],
    d023: ["Tu peux vivre dans n’importe quel siècle, sans retour possible.", "Le passé", "Ici et maintenant", "Le futur lointain"],
    d024: ["Un portrait qui parle offre des conseils en échange de ragots.", "Échanger des ragots", "L’ignorer", "Le retourner contre le mur"],
    d025: ["Ton groupe est coincé dans un chalet et la nourriture manque demain.", "Mener l’évasion", "Rationner et attendre", "Fouiller la cave"],
    d026: ["Tu entends ta propre voix t’appeler depuis les bois.", "Répondre", "Marcher vers elle", "Fuir dans l’autre sens"],
    d027: ["Un génie exauce un vœu, mais la formulation doit être parfaite.", "Souhaiter la richesse", "Souhaiter plus de vœux", "Libérer le génie"],
    d028: ["Une vieille boîte à musique joue toute seule chaque nuit.", "La remonter toi-même", "Retirer le mécanisme", "L’enregistrer comme preuve"],
    d029: ["Tu ne peux manger qu’un seul repas pour le reste de ta vie.", "Un grand festin", "Du pain et de la soupe", "Quelque chose de sucré"],
    d030: ["Tu trouves une carte de ton propre jardin, marquée d’une croix.", "Creuser cette nuit", "Creuser de jour avec des amis", "Laisser ça enterré"],
    d031: ["Un ami t’avoue être secrètement un loup-garou.", "L’aider à le cacher", "L’enfermer à la pleine lune", "Demander à voir la transformation"],
    d032: ["Tu peux échanger ta vie un jour avec quelqu’un de cette table.", "Quelqu’un d’intrépide", "Quelqu’un de riche", "Quelqu’un de mystérieux"],
    d033: ["Le croque-mort propose d’organiser tes funérailles à l’avance, à prix réduit.", "Un grand cortège", "Une cérémonie discrète", "Une fête avec danse"],
    d034: ["Chez toi, une horloge tourne à l’envers.", "La réparer", "La laisser tranquille", "Essayer de t’en servir"],
    d035: ["Le cirque est en ville, et un clown te glisse un billet pour un spectacle secret.", "Y aller", "Donner le billet", "Le déchirer"],
    d036: ["Tu peux parler à une seule espèce animale.", "Les chats", "Les corbeaux", "Les chiens"],
    d037: ["Une tempête te bloque une nuit dans un phare avec un gardien qui ne dort jamais.", "Rester éveillé à discuter", "Dormir d’un œil", "Braver la tempête"],
    d038: ["Ton ombre se met à bouger toute seule.", "La suivre", "Rester dans la lumière", "Devenir amis"],
    d039: ["On t’offre l’immortalité, mais tu ne pourras jamais quitter cette ville.", "Accepter", "Refuser", "Demander une plus grande ville"],
    d040: ["Un matin, une crypte scellée du cimetière est ouverte.", "Regarder dedans", "Prévenir le curé", "La refermer sans rien dire"],
    d041: ["Tu peux garder l’un de ces objets pour toujours.", "Une clé qui ouvre toutes les portes", "Une bougie qui ne s’éteint jamais", "Une boussole qui indique la maison"],
    d042: ["Aux enchères, un tableau maudit part pour presque rien.", "Enchérir", "Prévenir les autres enchérisseurs", "Partir"],
    d043: ["Le village te demande de garder le pont la nuit où quelque chose le traverse.", "Monter la garde", "Tendre un piège", "Trouver une raison d’être ailleurs"],
    d044: ["Ton biscuit chinois dit : Ne fais pas confiance à ta voisine de gauche.", "Y croire", "En rire", "Le lui montrer"],
    d045: ["Tu peux revivre un jour de ta vie.", "Ton plus beau jour", "Un jour pour réparer une erreur", "Un jour ordinaire et paresseux"],
    d046: ["Un miroir chez un antiquaire te montre dix ans plus vieux.", "L’acheter", "Demander ce qu’il montre", "Partir vite"],
    d047: ["Un fantôme te protégera toute ta vie.", "Un chevalier", "Une grand-mère", "Un enfant espiègle"],
    d048: ["L’hôte d’une soirée a verrouillé toutes les portes de l’extérieur.", "Chercher une autre sortie", "Continuer la fête", "Exiger une explication"],
    d049: ["On ne se souviendra de toi que pour une seule chose.", "Ta gentillesse", "Ton courage", "Ton humour"],
    d050: ["Un grimoire apparaît sur ton paillasson.", "Essayer un sort", "Le lire sans rien lancer", "L’apporter à une bibliothèque"],
    d051: ["On t’offre une place sur un navire qui n’est jamais revenu de ses voyages.", "Embarquer", "Rester à terre", "Interroger l’équipage d’abord"],
    d052: ["Tu découvres ton sosie dans le village voisin.", "Le rencontrer", "L’observer de loin", "Déménager"],
    d053: ["Au dîner, toutes les bougies deviennent bleues en même temps.", "Continuer à manger", "Les souffler", "Demander à la pièce qui est là"],
    d054: ["Tu peux arrêter le temps une heure, une seule fois.", "L’utiliser aujourd’hui", "La garder pour une urgence", "Dormir pendant cette heure"],
    d055: ["Une gargouille de la cathédrale te réclame une devinette.", "Lui en dire une", "Lui en demander une", "Faire semblant de ne pas entendre"],
    d056: ["Ta chanson préférée passe à tes propres funérailles. Laquelle ?", "Quelque chose de triste", "Quelque chose d’entraînant", "Quelque chose d’inattendu"],
    d057: ["Tu peux exercer un seul métier dans une ville hantée.", "Croque-mort", "Aubergiste", "Veilleur de nuit"],
    d058: ["Un ami emprunte ton manteau et le rend avec la lettre d’un inconnu dans la poche.", "Lire la lettre", "La lui rendre", "Chercher l’inconnu"],
    d059: ["La pleine lune se lève et tous les chiens de la ville se mettent à hurler.", "Fermer les portes à clé", "Sortir voir", "Hurler avec eux"],
    d060: ["Tu peux renoncer à un sens pour aiguiser les autres.", "Le goût", "L’odorat", "Jamais, aucun"],
    d061: ["Une calèche sans cocher s’arrête devant toi.", "Monter", "Chercher le cocher", "Passer ton chemin"],
    d062: ["Tu peux savoir ce qu’une personne pense vraiment de toi.", "Ton meilleur ami", "Ton rival", "Personne, merci"],
    d063: ["Un épais brouillard tombe et la cloche de la ville sonne treize coups.", "Recompter", "Te cacher à l’intérieur", "Aller au clocher"],
    d064: ["Tu découvres que ta maison cache une pièce secrète.", "L’ouvrir tout de suite", "Attendre le jour", "La tapisser"],
    d065: ["Un colporteur vend de la chance en bouteille.", "Acheter une bouteille", "Acheter toute la caisse", "Le chasser de la ville"],
    d066: ["Tu dois passer un an seul dans un monastère de montagne.", "Une pile de livres", "Un instrument de musique", "Un journal"],
    d067: ["Tes feuilles de thé dessinent un nom que tu ne connais pas.", "Chercher cette personne", "Boire une autre tasse", "N’en parler à personne"],
    d068: ["Tu peux assister en invité à n’importe quelle fête de l’histoire.", "Un couronnement royal", "Un bal masqué endiablé", "Un concert légendaire"],
    d069: ["Un mourant te tend une clé et murmure : Ne l’ouvre jamais.", "L’ouvrir", "La garder pour toujours", "La jeter"],
    d070: ["La table doit choisir qui explore la crypte en premier.", "Se porter volontaire", "Proposer quelqu’un d’autre", "Proposer de tirer à la courte paille"],
    d071: ["On t’offre une place à la table de la Mort.", "Accepter poliment", "Apporter un cadeau", "Trouver une excuse"],
    d072: ["Une vieille photo te montre à une fête il y a cent ans.", "Enquêter", "L’encadrer", "La cacher"],
    d073: ["Tu peux te changer à volonté en une créature.", "Une chauve-souris", "Un loup", "Un chat"],
    d074: ["Quelqu’un dépose des fleurs devant ta porte chaque nuit.", "Veiller pour voir qui", "Laisser un mot de remerciement", "Ne plus ouvrir la porte"],
    d075: ["Un orage coupe le courant pendant un film d’horreur.", "Raconter des histoires de fantômes", "Aller se coucher", "Jouer la fin à la bougie"],
    d076: ["Tu peux effacer une invention de l’histoire.", "Les réveils", "Les téléphones portables", "Rien, on garde tout"],
    d077: ["À un carrefour à minuit, un inconnu propose d’accorder ta guitare.", "La lui confier", "Demander le prix d’abord", "Repartir avec ta guitare"],
    d078: ["Tu peux faire revenir quelqu’un le temps d’une conversation.", "Un proche", "Une personnalité célèbre", "Un ami d’enfance"],
    d079: ["Une trappe apparaît dans le sol de la cuisine pendant la nuit.", "Descendre", "La clouer", "Jeter une pièce et écouter"],
    d080: ["La dernière bougie se consume, et un seul d’entre vous peut la tenir.", "La prendre", "L’offrir à quelqu’un d’autre", "La souffler ensemble"],
  },
  guide: {
    mimicH: "Dead Set : Imitateur",
    mimic: `<p>Un jeu de questions pour 4 à 12 joueurs, environ 8 minutes par partie. Tout le monde partage un même <b>lieu</b> (une carte d’histoire) et y tient un <b>personnage</b>, sauf l’<b>Imitateur</b>, qui ne voit que de la neige et le tableau des lieux possibles.</p>
<ol>
<li><b>Questions.</b> Qui tient la lanterne pose à voix haute une question sur le lieu à n’importe qui, puis touche la personne interrogée ; la lanterne passe à elle. Ne réinterroge jamais la personne qui vient de t’interroger.</li>
<li><b>Accuser.</b> Une fois par partie chacun. L’horloge s’arrête et tous les autres votent ; seule une table unanime condamne. Si un Vivant est condamné, l’Imitateur gagne.</li>
<li><b>L’Imitateur</b> peut se démasquer à tout moment et nommer le lieu : juste, il gagne ; faux, les Vivants gagnent. Un Imitateur démasqué a encore un dernier essai.</li>
<li><b>Le temps est écoulé :</b> chacun désigne un suspect. Le plus désigné est condamné ; en cas d’égalité, l’Imitateur s’échappe.</li>
</ol>
<p>Barre des lieux sur ton propre téléphone en écoutant : tes notes sont privées. Scores : les Vivants +1 chacun (celui qui a démasqué l’Imitateur +1 de plus) ; l’Imitateur +2, ou +3 s’il nomme le lieu.</p>`,
    omenH: "Dead Set : Le Présage",
    omen: `<p>Un jeu de prédiction pour 4 à 12 joueurs, environ 10 minutes. Une roue indique la <b>Vie</b>, la <b>Mort</b> ou la <b>Renaissance</b>, dans cet ordre, en cercle. Sept tours ; chacun a cinq <b>Influences</b>.</p>
<ol>
<li><b>La roue</b> montre d’où elle part.</li>
<li><b>En secret</b>, tu prédis où elle s’arrête, et tu peux la tourner d’un cran dans un sens ou dans l’autre (pour une Influence).</li>
<li><b>Tous les tours s’additionnent</b>, et la roue bouge une seule fois. Une prédiction juste rapporte 3.</li>
</ol>
<p>À la fin, chaque Influence inutilisée vaut un point. Le plus de points gagne ; les égalités se partagent.</p>`,
    mirrorH: "Dead Set : Le Miroir",
    mirror: `<p>Un jeu pour lire les autres, de 4 à 12 joueurs, environ 15 minutes. Huit <b>dilemmes</b> imaginaires à trois réponses ; aucune n’est la bonne.</p>
<ol>
<li><b>La discussion.</b> Tu vois qui tu lis ce tour-ci. Demande, taquine, brouille les pistes.</li>
<li><b>Le bulletin scellé.</b> Tu réponds pour toi et tu prédis la réponse de la personne que tu lis.</li>
<li><b>Le miroir</b> montre tout : une prédiction juste rapporte 2, ta propre réponse rien.</li>
</ol>
<p>Les paires tournent à chaque tour : chacun lit tout le monde. Le meilleur lecteur gagne.</p>`,
    graveH: "Dead Set : Pilleurs de tombes",
    grave: `<p>Un jeu d’équipe avec des mots (ou des icônes) pour 4 à 12 joueurs, environ 15 minutes. Deux bandes de pilleurs, la <b>Lune</b> et le <b>Soleil</b>, fouillent un cimetière de 25 pierres tombales pour trouver les reliques qui invoqueront leur divinité. La bande qui gagne le tirage à pile ou face a 9 reliques en terre, l’autre 8 ; 7 tombes sont vides, et une appartient à la <b>Mort</b>.</p>
<ol>
<li><b>Les Croque-morts.</b> Un par bande. Eux seuls voient le registre des sépultures : ce qui repose sous chaque pierre.</li>
<li><b>Le signe.</b> À son tour, le Croque-mort donne un mot et un nombre : <i>« Océan · 3 »</i>. Le mot ne peut pas être sur le plateau. Ensuite, il ne dit plus rien.</li>
<li><b>La fouille.</b> Les fossoyeurs discutent et votent sur leurs téléphones. Le plus de voix creuse ; en cas d’égalité, la pièce décide. Votre relique : creusez encore, jusqu’au nombre. Une tombe vide, ou une relique de l’autre bande (désormais à eux) : le tour passe. La tombe de la Mort : votre bande perd aussitôt.</li>
<li><b>S’arrêter.</b> La bande peut voter pour s’arrêter. Si elle s’arrête avant d’atteindre le nombre, elle garde une fouille bonus pour le tour suivant (elle ne se cumule pas).</li>
</ol>
<p>La première bande dont toutes les reliques sont déterrées gagne. Sur le téléphone, passe des <b>Pierres</b> (mots ou icônes) à la <b>Carte</b> (le plateau d’un coup d’œil). Dans le salon : mots ou icônes, noms célèbres ou non, bandes et croque-morts au hasard ou choisis, signes tapés ou dits.</p>`,
    seanceH: "Dead Set : Séance",
    seance: `<p>Un mystère de meurtre coopératif avec un traître. 4 à 10 joueurs, environ 30 minutes. Un joueur est le <b>Fantôme</b> : il sait qui l’a tué, où et pourquoi, et ne peut pas parler. Tous les autres sont des lecteurs.</p>
<ol>
<li><b>Le plateau.</b> Trois rangées de cartes d’histoire : qui, où et pourquoi. Dans chaque rangée, une carte est la vérité.</li>
<li><b>Visions.</b> À chaque manche, chaque lecteur reçoit une rangée, et le Fantôme lui envoie une vision sans mots : deux ou trois motifs gravés sur une carte.</li>
<li><b>Discussion.</b> Les visions se révèlent à tous. Décrivez-les, débattez, convainquez. Le Fantôme se tait, mais peut givrer une vision d’une <b>tache froide</b> : celle-ci n’est pas de moi.</li>
<li><b>Bougies.</b> Chaque lecteur allume une bougie sur une carte de sa rangée, ou la garde. La carte qui a le plus de bougies est soumise à l’esprit. Juste : la rangée est résolue. Faux : la carte est barrée. Chaque manche consume une bougie de l’horloge de la séance.</li>
</ol>
<p>À partir de cinq joueurs, un <b>Imposteur</b> se cache parmi les lecteurs. Il connaît la vérité et, quelques fois par partie, remplace la vision d’un autre lecteur par un mensonge. Résolvez les trois rangées avant que les bougies ne s’éteignent, puis nommez l’Imposteur : juste, c’est une victoire complète ; faux, une victoire creuse que l’Imposteur partage. Si l’horloge s’éteint, l’Imposteur gagne (s’il reste une rangée, il y a d’abord un <b>dernier souffle</b>). L’écran de fin rejoue chaque manche : les vraies visions, les échanges et les bougies.</p>`,
    midnightH: "Dead Set : Minuit",
    midnight: `<p>Une nuit, un vote, pas de seconde chance. 4 à 12 joueurs, environ 10 minutes. Le paquet contient une carte par joueur et trois de plus face cachée sur la table.</p>
<ol>
<li><b>Un regard.</b> Chacun regarde sa propre carte une fois.</li>
<li><b>Une nuit.</b> Les téléphones réveillent les rôles tour à tour : Imitateur, La Mort, Conspirateur, Jumeaux, Mentaliste, Agent double, Sorcière, Parieur, Insomniaque. Chaque étape dure le même temps et a lieu même si sa carte est sur la table, pour que la nuit ne trahisse rien. Les cartes sont regardées et échangées dans le noir.</li>
<li><b>Un débat.</b> À l’aube, tu es la carte posée devant toi, pas celle qu’on t’a distribuée. Discutez-en.</li>
<li><b>Un vote.</b> Tout le monde désigne en même temps. Le plus désigné meurt s’il a au moins deux voix (en cas d’égalité, tous). Si le Justicier meurt, celui qu’il a désigné meurt aussi.</li>
</ol>
<p>Les Vivants gagnent si une Mort meurt (ou, si aucun joueur n’est la Mort, si personne ne meurt). La Mort et le Conspirateur gagnent si aucune Mort ne meurt. Le Bouffon gagne seul s’il est éliminé. <b>Cartes en jeu</b> montre l’étape de nuit de chaque carte. À la fin, vous voyez chaque carte, distribuée et à l’aube, et toute la nuit en récit.</p>`,
    carnivalH: "Dead Set : Carnaval",
    carnival: `<p>Un bal masqué de bluff et de mémoire pour 4 à 12 joueurs, à choisir dans le salon. Chaque masque est une carte de rôle familière.</p>
<ol>
<li><b>Le démasquage.</b> Chacun reçoit un masque (à 4–5 joueurs, les masques en trop vont sur des chaises vides). Pendant dix secondes, tous les masques sont montrés sur la TV et sur chaque téléphone. Retiens-les ; puis ils se retournent face cachée.</li>
<li><b>Ton tour : un des trois.</b> <i>Échanger ou feindre</i> : choisis un autre masque et maintiens Échanger ou Feindre. Les deux boutons se ressemblent et personne, pas même l'autre joueur, ne sait lequel tu as choisi. <i>Jeter un œil</i> : regarde ton propre masque un instant ; tout le monde voit que tu as regardé. <i>Revendiquer</i> : nomme un masque et use de son pouvoir.</li>
<li><b>Les défis.</b> Quand quelqu'un revendique, chaque autre téléphone demande : <i>Est-ce ton masque ?</i> Si personne ne défie, la revendication tient : le pouvoir fonctionne, quoi qu'il porte vraiment. Si quelqu'un défie, le revendicateur et les défieurs lèvent leur masque : celui qui le porte vraiment use du pouvoir, les autres révélés paient une Âme à l'Offrande.</li>
<li><b>La danse d'ouverture.</b> Le premier tour de chaque joueur (deux, si l'hôte le veut) doit être Échanger ou feindre.</li>
<li><b>Victoire</b> avec une bourse pleine (13 Âmes), avec la moisson de la Mort (6 Âmes fauchées par des revendications de la Mort) ou, dès que quelqu'un tombe à 0, en étant le plus riche.</li>
</ol>
<p>Touche <b>Masques au bal</b> à tout moment : chaque masque en jeu avec son pouvoir, écrit en toutes lettres et dessiné en une ligne de signes (la pièce pour les Âmes, le cadeau pour l'Offrande, la faux pour la Moisson, un œil pour un regard, des flèches croisées pour un échange). <b>Le journal du bal</b> (notes) est désactivé par défaut : ce que tu as vu, tu le gardes en tête. L'hôte peut l'activer dans le salon.</p>
<p>Les scores se cumulent d'une partie à l'autre : le vainqueur +3, les autres +1 par Âme au-delà de 6.</p>`,
    coffinsH: "Dead Set : Cercueils",
    coffins: `<p>Un jeu de bluff rapide pour 3 à 10 joueurs, à choisir dans le salon. Chacun tient 3 cercueils d'Or et une Malédiction (4 et une avec l'option longue).</p>
<ol>
<li><b>L'enterrement.</b> Tout le monde enterre en secret un cercueil en même temps : touche-le, puis touche L'enterrer. Ensuite, à partir du premier joueur de la manche, à ton tour tu enterres un autre cercueil sur ta pile, ou tu lances un défi : <i>« Je peux en ouvrir N »</i>, au plus le nombre total enterré.</li>
<li><b>L'enchère.</b> À tour de rôle, chacun surenchérit ou passe. Passer vaut pour toute la manche. Le dernier encore en lice devient le Fossoyeur.</li>
<li><b>La fouille.</b> Le Fossoyeur ouvre d'abord ses propres cercueils de haut en bas, puis choisit d'autres tombes, toujours le cercueil du dessus, jusqu'à en avoir ouvert N.</li>
<li><b>Propre ou maudit.</b> Que de l'Or : une fouille propre, et la stèle se dore. Une malédiction dans ta tombe : tu choisis le cercueil que tu perds. Celle d'un autre : il tire à l'aveugle un de tes cercueils, qui disparaît. Le propriétaire de la malédiction commence la manche suivante.</li>
<li><b>Gagne</b> avec tes fouilles propres (2 par défaut ; 1 ou 3 dans le salon), ou en étant le dernier à avoir des cercueils.</li>
</ol>
<p><b>Le cercueil de la Mort</b> (activé par défaut) : à chaque manche, un joueur caché le tient à la place d'un cercueil d'Or. Déterre-le et la fouille échoue ; son détenteur te vole un cercueil, qui devient de l'Or. <b>Paris des fantômes</b> (activés par défaut) : les joueurs sans cercueil parient Or ou Malédiction sur chaque fouille ; après trois bons paris, ils se relèvent en Revenant avec un cercueil d'Or. <b>Reliques</b> (désactivées par défaut) : une Lanterne secrète (jeter un œil dans une tombe), une Clé (ouvrir une autre tombe avant la tienne) ou une Protection (une malédiction ne coûte rien), chacune utilisable une fois.</p>
<p>Les scores se cumulent d'une partie à l'autre : le vainqueur +3, chaque fouille propre +1, chaque résurrection +1.</p>`,
    exorcismH: "Dead Set : Exorcisme",
    exorcism: `<p>Un jeu de mots et de bluff pour 3 à 12 joueurs, à choisir dans le salon. La langue de la table s'impose sur chaque téléphone, pour que les mots correspondent.</p>
<ol>
<li><b>La boule de cristal.</b> Tout le monde voit la catégorie. Les Vivants voient aussi le mot de passe ; le Démon (un, ou deux dès 7 joueurs) non, tout au plus un vague murmure si l'hôte le permet.</li>
<li><b>Le tirage au sort.</b> Un tirage désigne qui commence ; puis on fait le tour de la table dans l'ordre des places.</li>
<li><b>Un mot chacun.</b> À ton tour, dis un mot lié au mot de passe, puis maintiens le bouton sur ton téléphone. Prouve que tu le connais sans le livrer au Démon. En option, les mots sont tapés et affichés sur la télé.</li>
<li><b>Désignez le Démon.</b> Discutez, puis tout le monde vote. Désignez un Vivant (ou une égalité, sauf avec la pièce) et le Démon gagne.</li>
<li><b>Un dernier essai.</b> Un Démon démasqué a droit à un essai sur le mot de passe, dans la grille de 4×4 mots ou en le tapant. S'il trouve, il gagne quand même.</li>
</ol>
<p>La manche se termine dans le même salon avec les mêmes réglages, et les scores continuent : Vivants +1 par victoire, Démons +2.</p>`,
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
