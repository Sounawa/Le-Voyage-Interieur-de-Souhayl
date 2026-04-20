import type { StoryPage } from '@/lib/story-types';

export const storyPages: Record<string, StoryPage> = {

  // ═══════════════════════════════════════════
  // PROLOGUE : LA VIE QUOTIDIENNE
  // ═══════════════════════════════════════════
  prologue: {
    id: 'prologue',
    chapter: 0,
    chapterTitle: 'La Vie Quotidienne',
    paragraphs: [
      `Dans un petit village niché entre les collines, là où le vent porte le parfum de la terre mouillée, vivait un garçon de dix ans qui portait un nom lumineux : Souhayl — l'étoile du soir, celle qui guide les voyageurs égarés.`,
      `Mais Souhayl ne se sentait pas du tout comme une étoile. Lui, c'était plutôt un petit garçon normal — un peu grand, un peu timide, avec des cheveux qui ne tenaient jamais en place et un sourire qu'il cachait dès que les choses devenaient sérieuses.`,
      `Ce jeudi allait être différent. Ce jeudi, tout allait changer.`,
    ],
    mood: 'prologue',
    next: 'prologue-school',
    isChapterStart: true,
  },

  'prologue-school': {
    id: 'prologue-school',
    chapter: 0,
    chapterTitle: 'La Vie Quotidienne',
    paragraphs: [
      `La cour de l'école bourdonnait comme une ruche. Souhayl était assis sur un banc, son cartable à ses pieds, quand Yassine — le plus grand de la classe — s'approcha avec son sourire de requin.`,
      `— « Eh, Souhayl ! Ton grand-père t'a appris à être le diseur de bonne aventure maintenant ? » Toute la classe rigola. Yassine venait encore de découvrir que Moulay était un ancien sage du village, et il s'en servait pour moquer Souhayl.`,
      `La colère monta comme de l'eau chaude dans la poitrine de Souhayl. Ses poings se serrèrent. Son cœur cognait.`,
    ],
    mood: 'prologue',
    next: 'prologue-choice-school',
  },

  // ─── CHOICE PROLOGUE 1: Réaction à la moquerie ───
  'prologue-choice-school': {
    id: 'prologue-choice-school',
    chapter: 0,
    chapterTitle: 'La Vie Quotidienne',
    paragraphs: [
      `Les rires de la classe résonnaient dans ses oreilles. Yassine le dévisageait, attendant une réaction. Le cœur de Souhayl battait si fort qu'il sentait ses tempes pulser. Que faire ?`,
    ],
    mood: 'prologue',
    choices: [
      {
        id: 'school-insult',
        text: 'Répondre avec une insulte — « Au moins MON grand-père sait quelque chose ! Le tien ne sait même pas écrire ! »',
        nextPage: 'prologue-a1-insult',
        tag: 'reactive',
        emoji: '😤',
      },
      {
        id: 'school-walk',
        text: "Se lever et partir sans rien dire — serrer les dents, baisser la tête, s'éloigner. Ne pas lui donner cette satisfaction.",
        nextPage: 'prologue-a2-walk',
        tag: 'avoidance',
        emoji: '🚶',
      },
      {
        id: 'school-teacher',
        text: 'Lever la main et appeler la maîtresse — « Madame ! Yassine me harcèle encore ! » Laisser les adultes régler le problème.',
        nextPage: 'prologue-a3-teacher',
        tag: 'seeking-help',
        emoji: '🙋',
      },
    ],
  },

  'prologue-a1-insult': {
    id: 'prologue-a1-insult',
    chapter: 0,
    chapterTitle: 'La Vie Quotidienne',
    paragraphs: [
      `Les mots sortirent plus vite que la pensée. Le visage d'Yassine changea — le sourire disparut. Il s'avança, les poings serrés. — « Qu'est-ce que tu as dit ? »`,
      `La maîtresse intervint juste à temps. Yassine et Souhayl furent punis ensemble — devant toute la classe. Assis au fond, Souhayl sentit une drôle de sensation : la colère était partie, remplacée par un mélange de honte et de... satisfaction ? Non. Juste honte.`,
      `Il y avait quelque chose d'étrange. Même après s'être défendu, il ne se sentait pas mieux.`,
    ],
    mood: 'prologue',
    next: 'prologue-home',
  },

  'prologue-a2-walk': {
    id: 'prologue-a2-walk',
    chapter: 0,
    chapterTitle: 'La Vie Quotidienne',
    paragraphs: [
      `Souhayl se leva, ramassa son cartable, et marcha. Derrière lui, les rires redoublèrent. — « Il s'enfuit ! Le sage s'enfuit ! » Sa mâchoire tremblait. Ses yeux piquaient.`,
      `Il s'assit derrière le bâtiment, seul, et fixa le sol. Pourquoi ça lui faisait si mal ? C'étaient juste des mots. Mais chaque mot était comme une petite flèche qui trouvait sa cible.`,
      `Au bout de quelques minutes, il remarqua un chaton gris blotti contre le mur. Il le caressa doucement. Le chaton ronronna. Et Souhayl, sans savoir pourquoi, se sentit un tout petit peu mieux.`,
    ],
    mood: 'prologue',
    next: 'prologue-home',
  },

  'prologue-a3-teacher': {
    id: 'prologue-a3-teacher',
    chapter: 0,
    chapterTitle: 'La Vie Quotidienne',
    paragraphs: [
      `La maîtresse intervint. Yassine fut sermonné — un air coupable qu'il cacha mal. Mais après la classe, deux garçons murmurèrent en passant près de Souhayl : « Rapporteur... »`,
      `Ce mot lui brûla les joues. Il avait fait ce qu'il fallait, non ? Il avait demandé de l'aide. Pourquoi est-ce que ça lui donnait l'impression d'avoir trahi quelqu'un ?`,
      `Souhayl rangea ses affaires lentement, partagé entre le soulagement et un malaise qu'il ne savait pas nommer.`,
    ],
    mood: 'prologue',
    next: 'prologue-home',
  },

  'prologue-home': {
    id: 'prologue-home',
    chapter: 0,
    chapterTitle: 'La Vie Quotidienne',
    paragraphs: [
      `En rentrant à la maison, l'odeur du tajine de sa mère l'accueillit. Sa petite sœur Amina courut vers lui, ses couettes volant. — « Souhayl ! Souhayl ! Regarde mon dessin ! »`,
      `Sa mère apparut dans l'encadrement de la porte, un essuie-vaisselle sur l'épaule. — « Souhayl, le Maghrib est dans vingt minutes. Ne rentre pas trop tard de chez tes copains, hein ? »`,
      `Mais Souhayl n'allait pas chez ses copains. Son ballon l'attendait dans la cour. Juste cinq minutes de dribble...`,
    ],
    mood: 'prologue',
    next: 'prologue-choice-prayer',
  },

  // ─── CHOICE PROLOGUE 2: La prière du Maghrib ───
  'prologue-choice-prayer': {
    id: 'prologue-choice-prayer',
    chapter: 0,
    chapterTitle: 'La Vie Quotidienne',
    paragraphs: [
      `Le ballon rebondissait contre le mur. Daam. Daam. Daam. Ça, c'était du vrai bonheur. Et puis sa mère cria depuis la cuisine : « Souhayl ! La prière ! » Son cœur se serra. Il avait promis... mais juste encore cinq minutes...`,
    ],
    mood: 'prologue',
    choices: [
      {
        id: 'prayer-obey',
        text: "Laisser tomber le ballon et aller prier — sa mère a raison, la prière d'abord. Le foot après.",
        nextPage: 'prologue-b1-obey',
        tag: 'obedience',
        emoji: '🕌',
      },
      {
        id: 'prayer-delay',
        text: 'Crier « Cinq minutes, maman ! » et continuer à jouer — juste cinq petites minutes de plus, ça ne peut pas faire de mal...',
        nextPage: 'prologue-b2-delay',
        tag: 'negotiation',
        emoji: '⚽',
      },
      {
        id: 'prayer-ignore',
        text: "Pretendre de ne pas avoir entendu — faire semblant d'être concentré sur le jeu. Peut-être qu'elle va oublier.",
        nextPage: 'prologue-b3-ignore',
        tag: 'avoidance',
        emoji: '🤫',
      },
    ],
  },

  'prologue-b1-obey': {
    id: 'prologue-b1-obey',
    chapter: 0,
    chapterTitle: 'La Vie Quotidienne',
    paragraphs: [
      `Souhayl lâcha le ballon. Il roula lentement vers le mur et s'arrêta. Un dernier regard... puis il entra. L'eau du woudou était fraîche sur ses bras et son visage. La sensation familière le calma.`,
      `Quand il se releva de la prière, il se sentait... différent. Plus léger. Comme si un petit poids avait disparu de ses épaules. Sa mère lui sourit depuis la cuisine.`,
      `— « Bien, mon cœur. Le ballon t'attendra toujours. Mais le temps de la prière, lui, ne repasse pas deux fois. »`,
    ],
    mood: 'peace',
    next: 'prologue-broken',
  },

  'prologue-b2-delay': {
    id: 'prologue-b2-delay',
    chapter: 0,
    chapterTitle: 'La Vie Quotidienne',
    paragraphs: [
      `— « Cinq minutes ! » cria-t-il. Sa mère soupira — un soupir qu'il connaissait bien. Les cinq minutes devinrent dix. Puis quinze. Quand il regarda sa montre, le temps de la prière était presque fini.`,
      `Il entra en courant, le cœur battant. Il fit sa prière à la va-vite, les pensées ailleurs. Quand il dit « Assalamu alaykum », il sentit... rien. Pas la paix d'habitude. Juste un vide.`,
      `— « La prière précipitée, dit doucement sa mère sans lever les yeux, c'est comme un aliment avalé sans mâcher. Ça remplit l'estomac mais pas le cœur. »`,
    ],
    mood: 'prologue',
    next: 'prologue-broken',
  },

  'prologue-b3-ignore': {
    id: 'prologue-b3-ignore',
    chapter: 0,
    chapterTitle: 'La Vie Quotidienne',
    paragraphs: [
      `Il fit semblant de ne pas entendre. Le ballon, le mur, le rebond — daam, daam, daam. Il se concentra si fort qu'il finit par presque y croire.`,
      `Mais au septième rebond, un bruit sec. Le ballon avait tapé le pot de fleurs de sa mère. Le pot se brisa. Les pétales rouges se répandirent sur le sol comme du sang. Souhayl se figea.`,
      `Sa mère apparut dans l'encadrement. Elle regarda le pot. Elle regarda Souhayl. Les mots n'avaient pas besoin d'être dits.`,
    ],
    mood: 'prologue',
    next: 'prologue-broken',
  },

  'prologue-broken': {
    id: 'prologue-broken',
    chapter: 0,
    chapterTitle: 'La Vie Quotidienne',
    paragraphs: [
      `Plus tard dans la soirée, Souhayl était dans le salon quand il entendit le bruit — le vase en céramique bleue de Moulay venait de se casser. C'était lui. Il l'avait heurté avec son coude en essayant d'attraper un jouet qui était tombé derrière l'étagère.`,
      `Le vase bleu — celui que Moulay avait rapporté de Fès, qu'il chérissait plus que n'importe quel objet de la maison. Des fragments bleus et blancs étaient éparpillés sur le tapis.`,
      `Et là, Amina — sa petite sœur de cinq ans — entra dans le salon. Elle vit les morceaux, puis regarda Souhayl avec ses grands yeux. — « C'est qui qui a cassé ? » murmura-t-elle. Le silence pesait.`,
    ],
    mood: 'prologue',
    next: 'prologue-choice-broken',
  },

  // ─── CHOICE PROLOGUE 3: Le vase cassé ───
  'prologue-choice-broken': {
    id: 'prologue-choice-broken',
    chapter: 0,
    chapterTitle: 'La Vie Quotidienne',
    paragraphs: [
      `Les yeux d'Amina étaient comme deux miroirs innocents. Si Souhayl disait la vérité, il serait puni. S'il mentait... Amina prendrait peut-être le blâme. Son petit cœur battait dans sa poitrine comme un oiseau captif.`,
    ],
    mood: 'prologue',
    choices: [
      {
        id: 'broken-blame',
        text: "Dire « C'est Amina ! Elle a joué trop près de l'étagère ! » — mentir pour se protéger. Amina est petite, on ne la punira pas trop...",
        nextPage: 'prologue-c1-blame',
        tag: 'deceit',
        emoji: '🤥',
      },
      {
        id: 'broken-silent',
        text: "Ne rien dire — ramasser les morceaux en silence et espérer que personne ne pose de questions. Peut-être que Moulay ne s'en rendra pas compte...",
        nextPage: 'prologue-c2-silent',
        tag: 'avoidance',
        emoji: '🤐',
      },
      {
        id: 'broken-confess',
        text: "Dire « C'est moi. Je l'ai cassé. Je suis désolé, Moulay. » Avouer, même si ça fait peur.",
        nextPage: 'prologue-c3-confess',
        tag: 'honesty',
        emoji: '💛',
      },
    ],
  },

  'prologue-c1-blame': {
    id: 'prologue-c1-blame',
    chapter: 0,
    chapterTitle: 'La Vie Quotidienne',
    paragraphs: [
      `— « C'est Amina ! Elle jouait trop près ! » Les mots sortirent tout seuls, comme un réflexe. Amina ouvrit grand les yeux. — « Non ! C'est pas moi ! » Sa voix tremblait.`,
      `Le visage de Moulay apparut dans l'encadrement de la porte. Il regarda Amina, puis Souhayl. Souhayl détourna le regard. Son estomac se noua. Il savait que Moulay savait.`,
      `— « Souhayl, dit Moulay doucement. Les objets se cassent. Mais la confiance, une fois brisée, se recolle beaucoup plus difficilement qu'un vase. » Les mots tombèrent comme des pierres dans un puits.`,
    ],
    mood: 'prologue',
    next: 'prologue-moulay',
  },

  'prologue-c2-silent': {
    id: 'prologue-c2-silent',
    chapter: 0,
    chapterTitle: 'La Vie Quotidienne',
    paragraphs: [
      `Souhayl s'agenouilla et commença à ramasser les morceaux. Ses doigts tremblaient. Amina le regarda, puis s'agenouilla à côté de lui et l'aida sans un mot.`,
      `Quand Moulay entra, il vit ses deux petits-enfants à genoux parmi les éclats bleus. Il ne dit rien pendant un long moment. Puis il s'agenouilla aussi et les aida.`,
      `— « Le silence, dit-il enfin, est parfois plus bruyant que les mots. Car il parle pour celui qui le garde. Et ce qu'il dit, c'est souvent la vérité. »`,
    ],
    mood: 'prologue',
    next: 'prologue-moulay',
  },

  'prologue-c3-confess': {
    id: 'prologue-c3-confess',
    chapter: 0,
    chapterTitle: 'La Vie Quotidienne',
    paragraphs: [
      `— « C'est moi, murmura Souhayl. Je l'ai cassé. Je suis désolé, Moulay. » Sa voix se brisa sur le dernier mot. Les larmes montèrent. Il essaya de les retenir — les garçons ne pleurent pas, non ?`,
      `Moulay s'agenouilla devant lui. Ses mains ridées ramassèrent un morceau de céramique bleue. — « Ce vase a voyagé, dit-il. De Fès à Marrakech, de Marrakech à ici. Il a vu des montagnes et des déserts. Tu sais ce qui lui donne de la valeur ? Pas la céramique — les voyages. »`,
      `— « Les erreurs aussi sont des voyages, Souhayl. Celle d'aujourd'hui t'a appris quelque chose. Et ça, aucun vase intact ne peut le faire. » Il lui sourit. Souhayl sentit quelque chose de chaud dans sa poitrine — pas la honte. Quelque chose de plus doux.`,
    ],
    mood: 'peace',
    next: 'prologue-moulay',
  },

  'prologue-moulay': {
    id: 'prologue-moulay',
    chapter: 0,
    chapterTitle: 'La Vie Quotidienne',
    paragraphs: [
      `Ce soir-là, Souhayl n'arrivait pas à dormir. Il pensait à Yassine, au ballon, au vase. À toutes ces choses qui s'étaient mal passées. Il descendit au salon et trouva Moulay assis dans son fauteuil, son chapelet entre les doigts, la lumière d'une seule bougie éclairant son visage.`,
      `— « Tu ne dors pas, mon étoile du soir ? » Souhayl s'assit par terre, à ses pieds. — « Moulay... est-ce que c'est normal d'avoir des voix dans sa tête qui se disputent tout le temps ? »`,
      `Moulay posa sa main sur la tête de Souhayl. — « Écoute-moi bien. Ces voix, c'est ton cœur. Et ton cœur est un palais immense — avec des salles de lumière et des salles sombres. Le Tassawuf, c'est l'art de nettoyer ce palais. Tu es prêt à le visiter ? »`,
    ],
    mood: 'wisdom',
    shaykhSpeaks: 'Le cœur de l\'enfant est comme un miroir neuf — il reflète tout avec une clarté que les adultes ont perdue.',
    next: 'prologue-book',
  },

  'prologue-book': {
    id: 'prologue-book',
    chapter: 0,
    chapterTitle: 'La Vie Quotidienne',
    paragraphs: [
      `Moulay se leva et marcha lentement vers un coffre en bois que Souhayl n'avait jamais vu ouvert. Il en sortit un livre — couverture de cuir noir, inscriptions dorées. Le livre pulsait doucement, comme un cœur.`,
      `— « Ce livre contient la carte de ton monde intérieur, dit Moulay. Il t'attendait. Mais Souhayl... une dernière chose. » Ses yeux brillèrent dans la lumière de la bougie.`,
      `— « Dans ce monde, tu rencontreras des ennemis. Le plus dangereux n'est pas un monstre — c'est toi-même. Ou plutôt, la partie de toi qui veut tout contrôler. On l'appelle le Nafs. Et il a un allié rusé : Shaytan. Souviens-t'en toujours. »`,
    ],
    mood: 'wonder',
    next: 'prologue-night',
  },

  'prologue-night': {
    id: 'prologue-night',
    chapter: 0,
    chapterTitle: 'La Vie Quotidienne',
    paragraphs: [
      `Souhayl remonta dans sa chambre avec le livre. Amina dormait déjà, ses couettes défaites sur l'oreiller. Dehors, la lune baignait le village d'une lumière argentée.`,
      `Il ouvrit le livre sous ses couvertures, avec une lampe de poche. La première page montrait une calligraphie dorée : « Celui qui connaît son âme connaît son Seigneur. » Et en dessous, écrit à la hâte : « Souhayl — le voyage commence quand tu fermes les yeux. »`,
      `Il ferma les yeux. Et l'odeur changea — plus de lavande, mais du sable chaud, de l'encens brûlé. Une voix intérieure murmura : « Souhayl... le voyage commence maintenant. »`,
    ],
    mood: 'wonder',
    next: 'ch1-start',
  },

  // ═══════════════════════════════════════════
  // CHAPTER 1: LA DÉCOUVERTE
  // ═══════════════════════════════════════════
  'ch1-start': {
    id: 'ch1-start',
    chapter: 1,
    chapterTitle: 'La Découverte',
    paragraphs: [
      `Quand Souhayl rouvrit les yeux, il se tenait debout sur un sol de terre rouge, sous un ciel changeant — rose, puis orange, puis violet. Devant lui, une porte immense, noire, ornée de symboles dorés pulsant comme un cœur vivant.`,
      `Au centre de la porte, un mot brillait : « قلب » — Qalb — Le Cœur. À ses pieds, une petite lampe à huile attendait, sa flamme vacillante. Et derrière lui, plus rien — son monde avait disparu.`,
      `— « Souhayl, murmura une voix ni jeune ni vieille, ni homme ni femme. Avec quoi veux-tu franchir cette porte ? »`,
    ],
    mood: 'wonder',
    next: 'ch1-choice-enter',
    isChapterStart: true,
  },

  // ─── CHOICE 1: Comment franchir la porte ───
  'ch1-choice-enter': {
    id: 'ch1-choice-enter',
    chapter: 1,
    chapterTitle: 'La Découverte',
    paragraphs: [
      `La porte pulsait doucement. Chaque battement résonnait dans sa poitrine, comme si la porte et son cœur battaient au même rythme. Souhayl sentit ses jambes trembler légèrement. Mais il n'allait pas reculer. Pas maintenant.`,
    ],
    mood: 'wonder',
    choices: [
      {
        id: 'enter-courage',
        text: 'Pousser la porte avec force — « Je n\'ai pas peur ! Mon cœur est brave et Allah est avec moi ! »',
        nextPage: 'ch1-a1-courage',
        tag: 'courage',
        emoji: '🦁',
      },
      {
        id: 'enter-humility',
        text: 'S\'agenouiller et prier — « Ya Allah, je ne suis rien sans Toi. Ouvre-moi cette porte, car seul Toi le peux. »',
        nextPage: 'ch1-a2-humility',
        tag: 'humility',
        emoji: '🤲',
      },
      {
        id: 'enter-wonder',
        text: 'Tendre la main et toucher la porte doucement — la caresser comme on caresse un animal sauvage, avec curiosité et respect.',
        nextPage: 'ch1-a3-wonder',
        tag: 'sensitivity',
        emoji: '✨',
      },
    ],
  },

  'ch1-a1-courage': {
    id: 'ch1-a1-courage',
    chapter: 1,
    chapterTitle: 'La Découverte',
    paragraphs: [
      `La porte s'ouvrit dans un grondement sourd. Un corridor aux murs de mosaïques scintillantes apparut. Souhayl marcha la tête haute, ses pas résonnant comme des tambours. Mais au loin, un grondement répondit au sien.`,
      `— « Le courage est une arme, murmura la voix. Mais toute arme peut se retourner contre celui qui la manie. Veille à ce que ta bravoure ne devienne pas de l'orgueil — car l'orgueil est le meilleur ami du Nafs. »`,
    ],
    mood: 'wonder',
    next: 'ch1-bazaar',
  },

  'ch1-a2-humility': {
    id: 'ch1-a2-humility',
    chapter: 1,
    chapterTitle: 'La Découverte',
    paragraphs: [
      `Souhayl s'agenouilla. Ses genoux touchèrent la terre rouge — tiède comme la peau de quelqu'un qui vient de s'endormir au soleil. — « Ya Allah... je ne suis rien... » Les mots sortirent naturellement, comme s'ils avaient toujours été là.`,
      `La porte se dissolut comme du sel dans l'eau. Derrière elle, une lumière dorée infiniment paisible l'accueillit. Des larmes coulèrent sur ses joues sans qu'il sache pourquoi.`,
      `— « L'humilité est la clé de toutes les portes du ciel, murmura la voix avec tendresse. Garde-la précieusement — beaucoup la perdent en chemin, surtout les plus forts. »`,
    ],
    mood: 'peace',
    next: 'ch1-bazaar',
  },

  'ch1-a3-wonder': {
    id: 'ch1-a3-wonder',
    chapter: 1,
    chapterTitle: 'La Découverte',
    paragraphs: [
      `Ses doigts frôlèrent la porte. Le métal était tiède et vivant — comme de la peau. La porte trembla, puis s'entrouvit doucement, comme une fleur qui s'épanouit au matin.`,
      `À l'intérieur, le monde était différent — le sol était translucide, révélant des océans et des forêts souterraines. Le plafond était un ciel en spirale de nébuleuses colorées. Et une odeur de rose et de pluie l'enveloppa.`,
      `— « La sensibilité est un don rare, murmura la voix. Le monde intérieur se révèle à ceux qui savent le toucher avec douceur. Ton cœur est doux, Souhayl. Ne laisse jamais le monde l'endurcir. »`,
    ],
    mood: 'wonder',
    next: 'ch1-bazaar',
  },

  'ch1-bazaar': {
    id: 'ch1-bazaar',
    chapter: 1,
    chapterTitle: 'La Découverte',
    paragraphs: [
      `Souhayl fit ses premiers pas. Le sol changeait sous ses pieds — herbe tendre, puis sable chaud, puis marbre froid. Et puis... il l'entendit. Un vacarme merveilleux.`,
      `Des voix criaient en toutes les langues. Des cloches tintaient. Des encens montaient en spirales colorées. Devant lui, un immense bazar s'étendait — des centaines de tentes aux couleurs éclatantes, des marchands hurleurs, des enfants courant entre les étals.`,
      `— « Bienvenue au Marché des Émotions ! cria une voix joyeuse. Ici, tout se vend et tout s'achète ! Mais attention... le prix n'est jamais celui que tu crois ! »`,
    ],
    mood: 'wonder',
    next: 'ch1-choice-stall',
  },

  // ─── CHOICE 2: Quel étal visiter en premier ───
  'ch1-choice-stall': {
    id: 'ch1-choice-stall',
    chapter: 1,
    chapterTitle: 'La Découverte',
    paragraphs: [
      `Le bazar grouillait de vie. À gauche, une tente rouge cracheur de flammes. Au centre, une tente bleue d'où s'échappent des sanglots mélodieux. À droite, une tente dorée d'où jaillissent des éclats de rire.`,
      `Chaque étal semblait l'appeler d'une voix différente. Lequel explorer en premier ?`,
    ],
    mood: 'wonder',
    choices: [
      {
        id: 'stall-anger',
        text: 'La tente rouge — des flammes en dansent à l\'entrée et un marchand au visage rouge brandit des gants de feu. Quelque chose de puissant l\'attire là-bas.',
        nextPage: 'ch1-d1-anger',
        tag: 'boldness',
        emoji: '🔥',
      },
      {
        id: 'stall-sadness',
        text: 'La tente bleue — une vieille femme au voile de larmes vend des bijoux faits de gouttes dorées. Son chant triste est d\'une beauté troublante.',
        nextPage: 'ch1-d2-sadness',
        tag: 'sensitivity',
        emoji: '💧',
      },
      {
        id: 'stall-joy',
        text: 'La tente dorée — un homme jonglant avec des éclats de soleil, entouré d\'enfants qui rient. C\'est l\'endroit le plus joyeux du marché.',
        nextPage: 'ch1-d3-joy',
        tag: 'joy',
        emoji: '☀️',
      },
    ],
  },

  'ch1-d1-anger': {
    id: 'ch1-d1-anger',
    chapter: 1,
    chapterTitle: 'La Découverte',
    paragraphs: [
      `— « Approche, jeune voyageur ! » Le marchand de colère était massif, sa barbe flamboyante, ses yeux injectés de sang. Sur son étal : des gants de feu, des casques de fureur, des boucliers d'indignation. — « La colère ! La plus vendeuse de toutes les émotions ! Donne-t-on de la force ! Donne-t-on du courage ! »`,
      `Un gant de feu pulsait doucement, appelant la main de Souhayl. — « Avec ça, personne ne te rirait plus au nez, chuchota le marchand. Tu serais le plus fort. Comme Yassine... mais en plus fort que lui. »`,
      `Le nom d'Yassine résonna comme une gifle. Souhayl sentit ses poings se serrer. Le marchand sourit — un sourire qui n'atteignait pas ses yeux.`,
    ],
    mood: 'danger',
    next: 'ch1-choice-anger',
  },

  'ch1-choice-anger': {
    id: 'ch1-choice-anger',
    chapter: 1,
    chapterTitle: 'La Découverte',
    paragraphs: [
      `Le gant de feu brillait. Le marchand tendait la main. — « Alors ? Tu la prends ou tu la laisses ? La colère attend toujours un client. »`,
    ],
    mood: 'danger',
    choices: [
      {
        id: 'anger-take',
        text: 'Prendre le gant — il a raison, avec ça personne ne le molesterait plus. La colère pourrait le protéger.',
        nextPage: 'ch1-e1-take',
        tag: 'impulse',
        emoji: '🧤',
      },
      {
        id: 'anger-refuse',
        text: 'Refuser fermement — « Non. La colère, c\'est ce qui m\'a fait me sentir mal tout à l\'heure. Je ne veux plus de ça. »',
        nextPage: 'ch1-e2-refuse',
        tag: 'discernment',
        emoji: '🙅',
      },
      {
        id: 'anger-ask',
        text: 'Demander au marchand — « Et si je prends la colère... qu\'est-ce que je perds ? Il y a toujours un prix, non ? »',
        nextPage: 'ch1-e3-ask',
        tag: 'wisdom',
        emoji: '🧐',
      },
    ],
  },

  'ch1-e1-take': {
    id: 'ch1-e1-take',
    chapter: 1,
    chapterTitle: 'La Découverte',
    paragraphs: [
      `Souhayl enfila le gant. Immédiatement, une chaleur explosive monta dans son bras. Il se sentit immense. Invincible. Plus fort que tout. — « OUI ! cria-t-il. Plus personne ne se moquera de moi ! »`,
      `Puis il regarda ses mains. Elles étaient en feu. Pas de douleur — mais les flammes consumaient quelque chose. Son reflet dans un miroir nearby montrait un garçon au visage tordu de rage. Pas lui. Quelqu'un d'autre.`,
      `Il arracha le gant et le jeta au sol. Les flammes s'éteignirent. — « Bien, murmura le marchand avec un rire sec. Tu as goûté. Maintenant tu sais. » Le gant redevint poussière.`,
    ],
    mood: 'danger',
    next: 'ch1-after-stalls',
  },

  'ch1-e2-refuse': {
    id: 'ch1-e2-refuse',
    chapter: 1,
    chapterTitle: 'La Découverte',
    paragraphs: [
      `Le marchand écarquilla les yeux. — « Tu refuses la colère ? C'est la première fois qu'un enfant dit non à mon meilleur produit. » Sa flamme faiblit un instant. — « Tu sais quoi ? Tu as raison de la refuser. La colère est une amie qui te trahit toujours. »`,
      `Le marchand baissa la voix. — « Mais ne crois pas que refuser suffit. Il faut aussi comprendre POURQUOI la colère vient. Elle vient quand on se sent blessé. Et comprendre sa blessure, c'est le début de la guérison. »`,
      `Il lui tendit un petit sac de graines rouges. — « Plante-les dans ton cœur. Elles donneront naissance au courage — le vrai, celui qui ne brûle pas les autres. »`,
    ],
    mood: 'wisdom',
    next: 'ch1-after-stalls',
  },

  'ch1-e3-ask': {
    id: 'ch1-e3-ask',
    chapter: 1,
    chapterTitle: 'La Découverte',
    paragraphs: [
      `Le marchand le regarda avec surprise. — « Tu demandes le prix ? » Il rit — un rire qui faisait trembler les flammes. — « Personne ne demande jamais le prix ! Tout le monde veut la colère gratuitement ! Eh bien, voilà le prix : tu perds la douceur. Tu perds le sommeil. Tu perds les amis. »`,
      `Il compta sur ses doigts en feu. — « La colère est une drogue, gamin. Elle te fait te sentir fort au début, et faible à la fin. Le Prophète ﷺ disait : 'Ne sois pas en colère.' Pas parce que c'est haram — parce que c'est un poison déguisé en médecine. »`,
      `Souhayl recula de l'étal. — « Non merci, dit-il. Je préfère rester moi-même. » Le marchand hocha la tête, presque fier.`,
    ],
    mood: 'wisdom',
    next: 'ch1-after-stalls',
  },

  'ch1-d2-sadness': {
    id: 'ch1-d2-sadness',
    chapter: 1,
    chapterTitle: 'La Découverte',
    paragraphs: [
      `La tente bleue sentait la pluie et la lavande. La vieille femme au voile de larmes leva les yeux — ses prunelles étaient deux océans. — « Tu viens chercher les larmes, petit voyageur ? »`,
      `Sur son étal : des colliers de gouttes dorées, des flacons de chagrin liquide, des miroirs ternis. — « La tristesse n'est pas un ennemi, dit-elle doucement. Elle est une messagère. Elle te dit que quelque chose compte pour toi. »`,
      `Elle essuya une larme de son voile. — « Mais attention... la tristesse qui reste trop longtemps devient de la prison. Il faut savoir la laisser partir quand son message est délivré. »`,
    ],
    mood: 'darkness',
    next: 'ch1-choice-sadness',
  },

  'ch1-choice-sadness': {
    id: 'ch1-choice-sadness',
    chapter: 1,
    chapterTitle: 'La Découverte',
    paragraphs: [
      `La vieille femme lui tendit un flacon de lumière bleue. — « Une goutte de tristesse peut nettoyer le cœur. Mais trop de gouttes le noient. Que veux-tu faire ? »`,
    ],
    mood: 'darkness',
    choices: [
      {
        id: 'sadness-accept',
        text: 'Accepter le flacon — « Si la tristesse peut nettoyer mon cœur, alors je l\'accepte. J\'ai besoin de comprendre ma douleur. »',
        nextPage: 'ch1-f1-accept',
        tag: 'vulnerability',
        emoji: '🧪',
      },
      {
        id: 'sadness-reject',
        text: 'Refuser — « Non merci. J\'ai déjà assez de tristesse dans ma vie. Je ne veux pas en ajouter. »',
        nextPage: 'ch1-f2-reject',
        tag: 'resilience',
        emoji: '🛡️',
      },
      {
        id: 'sadness-ask',
        text: 'Demander — « Pourquoi vous pleurez, madame ? Est-ce que la tristesse vous a piégée à vous aussi ? »',
        nextPage: 'ch1-f3-ask',
        tag: 'empathy',
        emoji: '💙',
      },
    ],
  },

  'ch1-f1-accept': {
    id: 'ch1-f1-accept',
    chapter: 1,
    chapterTitle: 'La Découverte',
    paragraphs: [
      `Souhayl prit le flacon. Une seule goutte tomba sur sa langue. Et soudain... il revit la scène du vase. La honte. Le regard de Moulay. Mais cette fois, il ne fuyait pas. Il la regardait en face.`,
      `Les larmes coulèrent. Pas de tristesse — de libération. Comme si un nœud se dénouait dans sa poitrine. Quand il rouvrit les yeux, la vieille femme souriait.`,
      `— « Tu as compris. La tristesse n'est pas à fuir — elle est à traverser. Comme un tunnel. Au bout, il y a toujours de la lumière. » Elle lui donna un mouchoir en soie bleue. « Garde-le. Tu en auras besoin. »`,
    ],
    mood: 'peace',
    next: 'ch1-after-stalls',
  },

  'ch1-f2-reject': {
    id: 'ch1-f2-reject',
    chapter: 1,
    chapterTitle: 'La Découverte',
    paragraphs: [
      `— « J'en ai assez, dit Souhayl fermement. De la tristesse, des regrets, de la honte. Je veux juste être heureux. » La vieille femme hocha lentement la tête.`,
      `— « Le bonheur sans la tristesse, c'est comme le jour sans la nuit — impossible à voir. Mais ton refus me dit quelque chose : tu es fatigué de souffrir. Et la fatigue, c'est le premier pas vers la guérison. »`,
      `Elle lui tendit quand même le mouchoir. — « Prends-le quand même. Pas pour la tristesse d'aujourd'hui. Pour celle de demain. Car elle viendra, comme le soleil se lève. »`,
    ],
    mood: 'wisdom',
    next: 'ch1-after-stalls',
  },

  'ch1-f3-ask': {
    id: 'ch1-f3-ask',
    chapter: 1,
    chapterTitle: 'La Découverte',
    paragraphs: [
      `La vieille femme le regarda, surprise. Personne ne lui posait cette question. — « Je pleure, dit-elle, parce que chaque larme que je vends est un morceau de mon propre cœur. Mais je ne m'en plains pas. Chaque larme que je donne nettoie le cœur de quelqu'un. Et c'est la plus belle des transactions. »`,
      `Elle prit les mains de Souhayl. — « Tu as demandé pourquoi je pleure au lieu de profiter de la situation. Ça, c'est la compassion. Et la compassion, petit voyageur, est la plus puissante des émotions. Plus forte que la colère. Plus forte que la joie. »`,
      `— « Car la compassion est la seule émotion qui grandit quand on la partage. Toutes les autres diminuent. »`,
    ],
    mood: 'wisdom',
    shaykhSpeaks: 'La compassion est le parfum du cœur. Quand tu la partages, elle ne diminue pas — elle parfume aussi le cœur de l\'autre.',
    next: 'ch1-after-stalls',
  },

  'ch1-d3-joy': {
    id: 'ch1-d3-joy',
    chapter: 1,
    chapterTitle: 'La Découverte',
    paragraphs: [
      `La tente dorée explosait de rires. Des enfants jouaient avec des éclats de soleil, des bulles de bonheur flottaient dans l'air, et au centre, un homme rieur jonglait avec des sourires.`,
      `— « Bienvenue au coin de la joie ! hurla-t-il. Ici, tout est gratuit ! Prends ce que tu veux ! Le bonheur n'a pas de prix ! » Il lança un éclat de soleil à Souhayl qui le rattrappa.`,
      `Mais au moment où il toucha l'éclat, une ombre passa. Un voleur — une silhouette grise — fondit sur la tente et arracha le panier de bonheur ! Les enfants crièrent. L'homme tomba à genoux.`,
    ],
    mood: 'wonder',
    next: 'ch1-choice-joy',
  },

  'ch1-choice-joy': {
    id: 'ch1-choice-joy',
    chapter: 1,
    chapterTitle: 'La Découverte',
    paragraphs: [
      `Le voleur gris filait entre les étals, le panier de soleil sous le bras. Les enfants pleuraient. Le marchand essayait de se relever. Souhayl devait agir vite !`,
    ],
    mood: 'wonder',
    choices: [
      {
        id: 'joy-chase',
        text: 'Courir après le voleur — il est rapide mais Souhayl aussi ! Rattraper le voleur et récupérer le panier par la force !',
        nextPage: 'ch1-g1-chase',
        tag: 'courage',
        emoji: '🏃',
      },
      {
        id: 'joy-help',
        text: 'Aider le marchand à se relever d\'abord — il est tombé et il a l\'air blessé. Le panier peut attendre.',
        nextPage: 'ch1-g2-help',
        tag: 'kindness',
        emoji: '🤝',
      },
      {
        id: 'joy-shout',
        text: 'Crier « AU VOLEUR ! » pour alerter les autres marchands — peut-être que quelqu\'un de plus rapide peut l\'attraper.',
        nextPage: 'ch1-g3-shout',
        tag: 'seeking-help',
        emoji: '📢',
      },
    ],
  },

  'ch1-g1-chase': {
    id: 'ch1-g1-chase',
    chapter: 1,
    chapterTitle: 'La Découverte',
    paragraphs: [
      `Souhayl sprinta entre les étals, esquivant les chameaux et les paniers. Le voleur était rapide, mais Souhayl avait couru après Yassine assez de fois pour savoir sprinter. Il l'attrapa par le bras !`,
      `Le voleur se retourna. Ce n'était pas un homme — c'était une créature grise aux yeux vides. — « Laisse-moi, murmura-t-il. J'ai besoin de cette joie... la mienne est vide. » Sa voix était triste comme un hiver sans neige.`,
      `Souhayl comprit. Le voleur ne volait pas par méchanceté — il volait parce qu'il avait faim de bonheur. — « Tu n'as pas besoin de voler, dit Souhayl. Viens. On va te trouver ta propre joie. » Le panier retourna à la tente dorée.`,
    ],
    mood: 'triumph',
    next: 'ch1-after-stalls',
  },

  'ch1-g2-help': {
    id: 'ch1-g2-help',
    chapter: 1,
    chapterTitle: 'La Découverte',
    paragraphs: [
      `Souhayl aida le marchand à se relever. — « Merci, mon garçon. Mais le panier... » — « D'autres s'en occuperont, dit Souhayl. Vous êtes blessé. » Le marchand regarda Souhayl avec des yeux brillants.`,
      `— « Tu as choisi de m'aider moi au lieu de courir après le bonheur volé ? » Il rit — un rire chaud comme du miel. — « Tu sais ce que ça prouve ? Que la vraie joie, ce n'est pas ce qu'on possède — c'est ce qu'on donne. »`,
      `Un autre marchand rapporta le panier — le voleur avait été attrapé. — « La joie perdue est toujours retrouvée, dit le marchand. Mais la bonté donnée ne revient jamais... elle reste dans le cœur de celui qui la reçoit. »`,
    ],
    mood: 'peace',
    next: 'ch1-after-stalls',
  },

  'ch1-g3-shout': {
    id: 'ch1-g3-shout',
    chapter: 1,
    chapterTitle: 'La Découverte',
    paragraphs: [
      `— « AU VOLEUR ! AU VOLEUR ! » Sa voix traversa le bazar. Deux marchands massifs interceptèrent le voleur. Le panier fut récupéré. Les enfants applaudirent.`,
      `Mais le marchand de la joie ne souriait pas. — « Tu as crié, dit-il doucement. Et le cri a fonctionné. Mais pose-toi cette question, Souhayl : est-ce que tu as crié pour aider... ou parce que crier te semblait plus facile que courir ? »`,
      `La question le percuta. Était-ce du courage ou de la paresse ? Les deux peut-être. Le marchand posa sa main sur son épaule. — « Ni l'un ni l'autre. Tu as utilisé ton intelligence. Mais l'intelligence sans action est une carte sans destination. »`,
    ],
    mood: 'wisdom',
    next: 'ch1-after-stalls',
  },

  'ch1-after-stalls': {
    id: 'ch1-after-stalls',
    chapter: 1,
    chapterTitle: 'La Découverte',
    paragraphs: [
      `Après le bazar, la voix revint : « Souhayl... tu as exploré les émotions. Maintenant, il est temps de voir ce que ton cœur contient vraiment. Le désert de ton âme t'attend. »`,
      `Le paysage se transforma. L'horizon s'ouvrit sur un désert immense aux dunes dorées, sous un ciel où deux lunes se croisaient. Le vent soufflait, chaud et chargé de mystère.`,
      `Les dunes n'étaient pas faites de sable — chaque grain était une pensée de Souhayl. Des millions de grains. Des milliards de pensées, certaines dorées et brillantes, d'autres sombres comme des cendres.`,
    ],
    mood: 'darkness',
    next: 'ch2-start',
  },

  // ═══════════════════════════════════════════
  // CHAPTER 2: LE DÉSERT DE L'ÂME
  // ═══════════════════════════════════════════
  'ch2-start': {
    id: 'ch2-start',
    chapter: 2,
    chapterTitle: 'Le Désert de l\'Âme',
    paragraphs: [
      `Le désert s'étendait à perte de vue. Sa lampe vacillait sous le souffle du vent. Et puis, il vit des traces — pas les siennes. Elles le suivaient, parallèles, invisibles. Souhayl accéléra — les traces accélérèrent.`,
      `Les traces s'arrêtèrent quand il s'arrêta. Elles l'imitaient. Quelque chose — ou quelqu'un — marchait juste à côté de lui, invisible. Son cœur battait si fort que le sable vibrait autour de ses pieds.`,
      `Et puis, un bruit. Pas un bruit de menace — un raclement. Comme un petit animal qui éternue.`,
    ],
    mood: 'darkness',
    next: 'ch2-choice-footsteps',
    isChapterStart: true,
  },

  // ─── CHOICE 3: Réaction aux pas mystérieux ───
  'ch2-choice-footsteps': {
    id: 'ch2-choice-footsteps',
    chapter: 2,
    chapterTitle: 'Le Désert de l\'Âme',
    paragraphs: [
      `Le raclement se rapprochait. Les traces invisibles s'arrêtèrent juste à côté de lui. Quelque chose de petit, de chaud, de tremblant se tenait dans le sable. Et il avait très peur — de Souhayl.`,
    ],
    mood: 'darkness',
    choices: [
      {
        id: 'call-out',
        text: 'Crier — « Montre-toi ! Qui es-tu ? Je n\'ai pas peur de toi ! »',
        nextPage: 'ch2-a1-call',
        tag: 'boldness',
        emoji: '📢',
      },
      {
        id: 'follow-traces',
        text: 'S\'accroupir doucement et tendre la main — inviter la chose à venir vers lui en douceur.',
        nextPage: 'ch2-a2-reach',
        tag: 'gentleness',
        emoji: '🤲',
      },
      {
        id: 'stand-still',
        text: 'S\'immobiliser complètement — ne pas bouger, ne pas parler. Attendre que ça vienne à lui.',
        nextPage: 'ch2-a3-still',
        tag: 'patience',
        emoji: '🧘',
      },
    ],
  },

  'ch2-a1-call': {
    id: 'ch2-a1-call',
    chapter: 2,
    chapterTitle: 'Le Désert de l\'Âme',
    paragraphs: [
      `— « MONTE-TOI ! » Sa voix déchira le silence du désert. Et la créature apparut — pas un ennemi, pas du tout. Un petit renard argenté, pas plus grand qu'un chat, avec des yeux dorés immenses et une queue en panache. Il tremblait comme une feuille.`,
      `— « Tu n'as pas besoin de CRIER, dit le renard d'une voix aigüe et pincée. Je suis déjà terrifié, merci bien. » Il s'assit dans le sable et se lécha la patte, essayant de paraître indifférent. Raté.`,
    ],
    mood: 'darkness',
    next: 'ch2-zaki-meet',
    zakiSpeaks: 'Un garçon qui crie sur un renard tremblant. Quelle preuve de bravoure. Tu dois être très fier de toi.',
  },

  'ch2-a2-reach': {
    id: 'ch2-a2-reach',
    chapter: 2,
    chapterTitle: 'Le Désert de l\'Âme',
    paragraphs: [
      `Souhayl s'accroupit lentement et tendit la main, paume ouverte. Le sable trembla. Et un petit museau argenté en sortit. Puis deux yeux dorés. Puis une touffe de fourrure.`,
      `Le renard le renifla longuement, puis se frotta contre sa main comme un chat. — « Hmm. Tu sens le grenier et les biscuits, dit-il. Je m'appelle Zaki. Et je vais te dire un secret : j'ai aussi peur du noir, alors on est deux. »`,
    ],
    mood: 'peace',
    next: 'ch2-zaki-meet',
    zakiSpeaks: 'Tu ne cries pas, tu ne cours pas, tu tends la main. Ce n\'est pas courant, ça, dans ce désert.',
  },

  'ch2-a3-still': {
    id: 'ch2-a3-still',
    chapter: 2,
    chapterTitle: 'Le Désert de l\'Âme',
    paragraphs: [
      `Souhayl s'immobilisa. Il ferma les yeux, tendit l'oreille. Le vent chuchotait des mots qu'il ne comprenait pas. Et puis, quelque chose de chaud et de doux se pressa contre sa jambe.`,
      `Il ouvrit les yeux. Un renard argenté était blotti contre lui, ses yeux dorés fixés sur les siens. — « Tu es le premier voyageur qui ne me court pas après, dit-il. Je m'appelle Zaki. Et j'ai décidé que tu serais mon guide. Pas le contraire — TOI tu me guides. D'accord ? »`,
    ],
    mood: 'peace',
    next: 'ch2-zaki-meet',
    zakiSpeaks: 'Le silence attire plus de choses que le bruit. Souviens-toi de ça. Et aussi : n\'oublie pas de me donner à manger plus tard.',
  },

  'ch2-zaki-meet': {
    id: 'ch2-zaki-meet',
    chapter: 2,
    chapterTitle: 'Le Désert de l\'Âme',
    paragraphs: [
      `Zaki se secoua, envoyant des grains de sable partout. — « Bon. Présentations. Je suis Zaki, renard de sagesse (auto-proclamé), guide officieux des voyageurs égarés, et expert en choses effrayantes que je fuis activement. »`,
      `Il pointa le museau vers une dune plus haute que les autres. — « Là-haut se trouve le Miroir de l'Âme. Et là-bas vit un vieux fou qu'on appelle le Gardien. Il va te poser des questions bizarres. Ne lui dis pas que je suis ici — il me déteste. »`,
      `Souhayl regarda le renard. Ce petit être ridicule, peureux et sarcastique, lui avait déjà redonné le sourire.`,
    ],
    mood: 'wisdom',
    next: 'ch2-choice-zaki',
  },

  // ─── CHOICE 4: Que faire de Zaki ───
  'ch2-choice-zaki': {
    id: 'ch2-choice-zaki',
    chapter: 2,
    chapterTitle: 'Le Désert de l\'Âme',
    paragraphs: [
      `Zaki attendait, la queue balayant le sable. — « Alors ? Tu me prends ou tu me laisses ? Attention, je ronfle la nuit et je mange beaucoup. Mais en échange, je suis excellent pour fuir les dangers et trouver les bons chemins. Enfin... presque toujours. »`,
    ],
    mood: 'wisdom',
    choices: [
      {
        id: 'zaki-accept',
        text: '« Viens avec moi, Zaki. On sera plus forts à deux. Et si tu as peur, je serai là pour toi aussi. »',
        nextPage: 'ch2-b1-accept',
        tag: 'generosity',
        emoji: '🦊',
      },
      {
        id: 'zaki-test',
        text: '« D\'abord, prouve que tu es utile. Quelle est la meilleure direction pour le Miroir de l\'Âme ? » Tester ses connaissances avant de faire confiance.',
        nextPage: 'ch2-b2-test',
        tag: 'discernment',
        emoji: '🧪',
      },
      {
        id: 'zaki-refuse',
        text: '« Non merci. C\'est MON voyage. Je dois le faire seul. Un renard qui a peur du noir ne m\'aidera pas. »',
        nextPage: 'ch2-b3-refuse',
        tag: 'independence',
        emoji: '❌',
      },
    ],
  },

  'ch2-b1-accept': {
    id: 'ch2-b1-accept',
    chapter: 2,
    chapterTitle: 'Le Désert de l\'Âme',
    paragraphs: [
      `Les yeux de Zaki s'illuminèrent — littéralement, ils brillèrent d'un éclat doré. — « Tu... tu me prends ? Vraiment ? Personne ne m'a jamais... je veux dire, bien sûr que tu me prends ! Qui refuserait un renard aussi charmant ? »`,
      `Il sauta sur l'épaule de Souhayl. — « Premier conseil gratuit : dans ce désert, ne fais jamais confiance à quelque chose qui te flatte. Le Nafs adore les compliments. »`,
      `— « Deuxième conseil : quand tu auras peur — et tu auras peur — regarde la flamme de ta lampe. Elle est connectée à ton cœur. Si ton cœur est sincère, elle ne s'éteindra jamais. »`,
    ],
    mood: 'peace',
    zakiSpeaks: 'Premier conseil : ne fais jamais confiance à quelqu\'un qui te flatte. Sauf moi. Moi je suis sincère. Presque toujours.',
    next: 'ch2-guardian',
  },

  'ch2-b2-test': {
    id: 'ch2-b2-test',
    chapter: 2,
    chapterTitle: 'Le Désert de l\'Âme',
    paragraphs: [
      `Zaki haussa les sourcils — ce qui, sur un renard, est assez impressionnant. — « Tu veux me tester ? D'accord. Le Miroir se trouve au nord-est, derrière les Trois Dunes de l'Oubli. Mais il y a un piège : un mirage qui montre ce que tu désires le plus. Si tu le suis, tu t'égares. »`,
      `— « Comment tu sais tout ça ? demanda Souhayl. » — « Parce que je me suis perdu trois fois en le suivant, répondit Zaki sans sourire. La quatrième fois, j'ai appris à fermer les yeux. Et la cinquième... j'ai rencontré TOI. Donc ça valait le coup de me perdre. »`,
      `Souhayl ne put s'empêcher de rire. — « D'accord, Zaki. Tu viens avec moi. »`,
    ],
    mood: 'wisdom',
    zakiSpeaks: 'Un garçon prudent. Rare. La prudence est la soeur de la sagesse. Mais ne sois pas TROP prudent — sinon tu ne bouges plus du tout.',
    next: 'ch2-guardian',
  },

  'ch2-b3-refuse': {
    id: 'ch2-b3-refuse',
    chapter: 2,
    chapterTitle: 'Le Désert de l\'Âme',
    paragraphs: [
      `Le visage de Zaki tomba. Puis il se redressa. — « D'accord. Je comprends. Tu veux être un héros solitaire. C'est honorable. Mais écoute... » Il s'approcha et murmura : « Le héros solitaire meurt seul. Le héros qui accepte l'aide... vit assez longtemps pour devenir sage. »`,
      `Souhayl hésita. — « D'accord, dit-il. Tu peux venir. Mais juste pour un peu. » Zaki bondit sur son épaule. — « Juste pour un peu ! C'est tout ce que je demande ! Et puis un peu plus. Et puis encore un peu. Et à la fin, tu ne pourras plus te passer de moi. C'est mon plan diabolique. »`,
    ],
    mood: 'wisdom',
    zakiSpeaks: 'Refuser l\'aide est la première erreur du voyageur. Accepter l\'aide est la première sagesse. Mais la plus difficile.',
    next: 'ch2-guardian',
  },

  'ch2-guardian': {
    id: 'ch2-guardian',
    chapter: 2,
    chapterTitle: 'Le Désert de l\'Âme',
    paragraphs: [
      `Le Gardien les attendait au sommet de la plus haute dune. Un vieil homme en haillons, assis sur le sable, les yeux brillants d'une lueur amusée. — « Zaki ! cria-t-il. Tu as encore effrayé un voyageur ? » — « Je ne l'ai PAS effrayé ! protesta Zaki. C'est lui qui a crié ! »`,
      `Le Gardien rit. — « Bon. Tu dois me dire quelque chose, Souhayl. Avant de voir ton Miroir. Quand tu te disputes avec ton frère ou ton ami, qu'est-ce qui te pousse à continuer ? Qu'est-ce qui ne veut pas lâcher ? »`,
    ],
    mood: 'darkness',
    next: 'ch2-choice-truth',
  },

  // ─── CHOICE 5: Dialogue avec le Gardien ───
  'ch2-choice-truth': {
    id: 'ch2-choice-truth',
    chapter: 2,
    chapterTitle: 'Le Désert de l\'Âme',
    paragraphs: [
      `Le Gardien attendait sa réponse. Le vent soufflait, soulevant des volutes de sable-pensées. Zaki, sur son épaule, ne disait rien pour une fois.`,
    ],
    mood: 'darkness',
    choices: [
      {
        id: 'truth-justice',
        text: '« C\'est parce que j\'ai raison ! L\'autre a tort et je veux qu\'il le reconnaisse ! C\'est une question de justice ! »',
        nextPage: 'ch2-c1-justice',
        tag: 'pride',
        emoji: '⚖️',
      },
      {
        id: 'truth-hurt',
        text: '« Parce que l\'autre m\'a blessé... et quand on me blesse, je veux que ça s\'arrête. Même si ça veut dire que je blesse aussi. »',
        nextPage: 'ch2-c2-hurt',
        tag: 'honesty',
        emoji: '💔',
      },
      {
        id: 'truth-dont-know',
        text: '« Je... je ne sais pas. Quelque chose prend le contrôle. Et après, je regrette toujours. »',
        nextPage: 'ch2-c3-dontknow',
        tag: 'awareness',
        emoji: '💭',
      },
    ],
  },

  'ch2-c1-justice': {
    id: 'ch2-c1-justice',
    chapter: 2,
    chapterTitle: 'Le Désert de l\'Âme',
    paragraphs: [
      `Le Gardien inclina la tête. — « La justice, oui... mais est-ce vraiment la justice ? Ou est-ce l'ego qui porte le masque de la justice ? L'ego adore se faire passer pour un justicier. C'est sa ruse la plus ancienne. »`,
      `Zaki murmura dans l'oreille de Souhayl : — « Quand tu te dis 'j'ai raison', essaie de te dire 'et si j'avais tort ?' Juste comme ça, pour voir. Souvent, le plus fort n'est pas celui qui a raison — c'est celui qui admet qu'il pourrait avoir tort. »`,
    ],
    mood: 'wisdom',
    zakiSpeaks: 'L\'ego est un avocat brillant. Il peut te faire croire n\'importe quoi. Même que tu as toujours raison.',
    next: 'ch2-mirror',
  },

  'ch2-c2-hurt': {
    id: 'ch2-c2-hurt',
    chapter: 2,
    chapterTitle: 'Le Désert de l\'Âme',
    paragraphs: [
      `Le Gardien posa sa main sur celle de Souhayl. — « La douleur parle, Souhayl. Et elle dit souvent la vérité. Mais répondre à la douleur par la douleur, c'est comme éteindre un feu avec du feu. Ça ne fait que grossir les flammes. »`,
      `— « Le Prophète ﷺ disait : 'Ne sois pas en colère.' Ce n'est pas un ordre de ne pas ressentir — c'est un conseil de ne pas agir sous le coup de l'émotion. La colère est un visiteur. Laisse-le entrer, mais ne lui donne pas les clés de la maison. » Zaki approuva : — « Les visiteurs qui s'installent, ce ne sont plus des visiteurs. Ce sont des squatteurs. »`,
    ],
    mood: 'wisdom',
    next: 'ch2-mirror',
  },

  'ch2-c3-dontknow': {
    id: 'ch2-c3-dontknow',
    chapter: 2,
    chapterTitle: 'Le Désert de l\'Âme',
    paragraphs: [
      `Le Gardien sourit, et cette fois son sourire illuminait tout le désert. — « Tu ne sais pas. Et c'est la réponse la plus vraie que tu puisses donner. Le 'je ne sais pas' est le début de toute connaissance. »`,
      `— « Ce qui prend le contrôle en toi, c'est le Nafs. Et le fait que tu le reconnaisses — que tu regrettes après — c'est la preuve que ta fitra, ta nature originelle, est intacte. » Zaki chuchota : — « Le Gardien ne dit jamais rien de bien aux gens qui disent qu'ils savent tout. Curieux, non ? »`,
    ],
    mood: 'wisdom',
    shaykhSpeaks: 'Celui qui reconnaît son ignorance est plus savant que celui qui croit tout savoir.',
    next: 'ch2-mirror',
  },

  'ch2-mirror': {
    id: 'ch2-mirror',
    chapter: 2,
    chapterTitle: 'Le Désert de l\'Âme',
    paragraphs: [
      `Au sommet de la dune, le Miroir de l'Âme l'attendait. Un rectangle de verre poli enchâssé dans le sable. Et ce qu'il montrait n'était pas le visage de Souhayl — mais son cœur, battant lentement, couvert de poussière.`,
      `Des ombres rampaient comme des serpents autour du cœur. Des couches de poussière voilaient sa lumière. Et au centre, une petite flamme dorée — la fitra — pulsait faiblement, comme une bougie dans une pièce sombre.`,
      `Zaki recula. — « C'est... c'est ton cœur. Regarde bien. Parce que ce qui va en sortir... » Il ne finit pas sa phrase.`,
    ],
    mood: 'darkness',
    next: 'ch2-nafs-appears',
  },

  'ch2-nafs-appears': {
    id: 'ch2-nafs-appears',
    chapter: 2,
    chapterTitle: 'Le Désert de l\'Âme',
    paragraphs: [
      `Une silhouette se détacha du miroir. Le Nafs — l'ego de Souhayl. Il avait ses traits, ses yeux, mais son expression était différente : un sourire narquois, des yeux brillants de malice.`,
      `— « Tu me regardes ? dit le Nafs. Regarde bien. Voilà ce que tu es vraiment. Couvert de poussière. Faible. Celui qui ment à son grand-père. Celui qui blame sa sœur. Tu ne pourras jamais me vaincre. »`,
      `Zaki siffla entre ses dents : — « Ne l'écoute PAS. C'est sa tactique favorite : te montrer tes pires moments pour que tu croies que c'est tout ce que tu es. Mais ce n'est pas vrai. Le miroir montre aussi la lumière — regarde la flamme au centre ! »`,
    ],
    mood: 'danger',
    next: 'ch2-choice-nafs',
    zakiSpeaks: 'Le Nafs est un menteur professionnel. Il ne montre que la moitié du miroir. Regarde l\'autre moitié, Souhayl. Regarde la lumière.',
  },

  // ─── CHOICE 6: Affronter le Nafs ───
  'ch2-choice-nafs': {
    id: 'ch2-choice-nafs',
    chapter: 2,
    chapterTitle: 'Le Désert de l\'Âme',
    paragraphs: [
      `Le Nafs se tenait entre Souhayl et le miroir. Zaki tremblait sur son épaule mais ne s'enfuyait pas. C'était l'épreuve de la première bataille intérieure.`,
    ],
    mood: 'danger',
    choices: [
      {
        id: 'nafs-confront',
        text: 'Le regarder droit dans les yeux et crier — « Tu n\'es qu\'une illusion ! Mon cœur appartient à Allah ! »',
        nextPage: 'ch2-d1-confront',
        tag: 'confrontation',
        emoji: '⚔️',
      },
      {
        id: 'nafs-ignore',
        text: 'Se détourner et fixer la flamme dorée dans le miroir — la fitra. Ignorer le Nafs complètement.',
        nextPage: 'ch2-d2-ignore',
        tag: 'detachment',
        emoji: '👁️',
      },
      {
        id: 'nafs-talk',
        text: 'Lui parler calmement — « Pourquoi tu me fais du mal ? Qu\'est-ce que tu veux vraiment ? » Comprendre pour mieux agir.',
        nextPage: 'ch2-d3-talk',
        tag: 'empathy',
        emoji: '🗣️',
      },
    ],
  },

  'ch2-d1-confront': {
    id: 'ch2-d1-confront',
    chapter: 2,
    chapterTitle: 'Le Désert de l\'Âme',
    paragraphs: [
      `Souhayl serra les poings et cria avec toute la force de son cœur. Le Nafs recula d'un pas, surpris. Mais les fissures dans le miroir se propagèrent — la confrontation avait aussi agité le cœur.`,
      `Le Nafs ricana. — « Tu cries fort... mais est-ce de la force ou de la peur ? » Zaki cria : — « Il a raison, Souhayl ! Le cri sans sagesse est du vent ! Regarde la flamme ! » Souhayl détourna les yeux du Nafs et fixa la flamme dorée. Elle grandit. Le Nafs diminua.`,
    ],
    mood: 'danger',
    next: 'ch2-after-nafs',
    zakiSpeaks: 'Le cri est un bon début. Mais c\'est le premier mouvement. Pas le dernier. Après le cri vient le calme.',
  },

  'ch2-d2-ignore': {
    id: 'ch2-d2-ignore',
    chapter: 2,
    chapterTitle: 'Le Désert de l\'Âme',
    paragraphs: [
      `Souhayl tourna le dos au Nafs. — « Je ne te regarde même pas. » Il fixa la petite flamme dorée et se concentra de tout son être. La flamme grandit, dévorant la poussière.`,
      `Le Nafs hurla de rage, puis sa voix faiblit, puis se tut. — « BRAVO ! cria Zaki en sautillant. Le plus grand combat contre l'ego est de ne pas lui donner ce qu'il veut : ton attention ! C'est comme un enfant qui fait des colères — si tu ne regardes pas, il arrête ! »`,
    ],
    mood: 'peace',
    next: 'ch2-after-nafs',
    zakiSpeaks: 'Le Nafs se nourrit d\'attention. Sans attention, il dépérit. C\'est sa seule faiblesse. Et la tienne aussi, d\'ailleurs — tu as besoin d\'attention, toi aussi. La différence, c\'est que tu choisis où la donner.',
  },

  'ch2-d3-talk': {
    id: 'ch2-d3-talk',
    chapter: 2,
    chapterTitle: 'Le Désert de l\'Âme',
    paragraphs: [
      `— « Pourquoi tu me fais du mal ? demanda Souhayl calmement. » Le Nafs fut déstabilisé. On ne lui avait jamais posé cette question. — « Je... je ne te fais pas de mal. Je te protège. Sans moi, tu n'oserais rien. »`,
      `Zaki murmura : — « Écoute-le. Il ment... mais à moitié seulement. L'ego n'est pas que mauvais. Au début, il protège. Il te donne de la confiance. Le problème, c'est quand il prend le contrôle. » Souhayl comprit : le Nafs était un outil devenu maître.`,
      `— « Merci de me protéger, dit Souhayl. Mais maintenant, je veux choisir moi-même. » Le Nafs vacilla, diminua, et s'assit en silence. Zaki siffla d'admiration : — « Personne n'avait jamais réussi ça... »`,
    ],
    mood: 'wisdom',
    shaykhSpeaks: 'Comprendre son ennemi, c\'est déjà le désarmer. Celui qui connaît son ego le maîtrise.',
    next: 'ch2-after-nafs',
  },

  'ch2-after-nafs': {
    id: 'ch2-after-nafs',
    chapter: 2,
    chapterTitle: 'Le Désert de l\'Âme',
    paragraphs: [
      `Zaki sauta sur le sable et se secoua. — « Bon. Premier Nafs : SURVÉCU. Pas mal pour un débutant. Mais attention, il reviendra. Toujours. Sous d'autres formes — en colère, en séducteur, en victime. L'ego a plus de costumes qu'un acteur. »`,
      `Le désert changea. La végétation apparut, puis les arbres immenses. — « La Forêt des Épreuves, murmura Zaki. C'est là que ça devient vraiment intéressant. Et par intéressant, je veux dire terrifiant. »`,
    ],
    mood: 'wisdom',
    zakiSpeaks: 'Tu as survécu à ton premier Nafs. Bravo. Mais rappelle-toi : la guerre du cœur dure jusqu\'au dernier souffle. Pas de vacances. Pas de trêve. Enfin... si. Le sommeil.',
    next: 'ch3-start',
  },

  // ═══════════════════════════════════════════
  // CHAPTER 3: LA FORÊT DES ÉPREUVES
  // ═══════════════════════════════════════════
  'ch3-start': {
    id: 'ch3-start',
    chapter: 3,
    chapterTitle: 'La Forêt des Épreuves',
    paragraphs: [
      `La forêt était immense. Des arbres plus hauts que des maisons, des troncs couverts d'une écorce qui ressemblait à de la peau humaine, des branches qui semblaient bouger quand il ne regardait pas. La lumière filtrait en rayons dorés entre les feuilles.`,
      `Zaki reniflait l'air nerveusement. — « Je déteste les forêts. Trop d'endroits pour se cacher. Trop d'ombres. Trop de... » Un bruit le fit sursauter. — « ...de choses qui font du bruit. »`,
      `Au bout de quelques minutes, un arbre énorme était tombé en travers du chemin. Impossible de passer directement.`,
    ],
    mood: 'darkness',
    next: 'ch3-choice-tree',
    isChapterStart: true,
    zakiSpeaks: 'Je déteste les forêts. Trop d\'endroits pour se cacher. Et je suis un expert en cache-cache, donc ça veut dire quelque chose.',
  },

  // ─── CHOICE 7: L'arbre tombé ───
  'ch3-choice-tree': {
    id: 'ch3-choice-tree',
    chapter: 3,
    chapterTitle: 'La Forêt des Épreuves',
    paragraphs: [
      `L'arbre tombé était massif. Mais les deux chemins de contournement semblaient différents. Celui de gauche sentait l'humidité et la mousse. Celui de droite était sec, couvert de feuilles mortes.`,
    ],
    mood: 'darkness',
    choices: [
      {
        id: 'tree-climb',
        text: 'Grimper sur l\'arbre et passer par-dessus — un obstacle n\'est pas un mur. Trouver un moyen de traverser.',
        nextPage: 'ch3-a1-climb',
        tag: 'perseverance',
        emoji: '🧗',
      },
      {
        id: 'tree-left',
        text: 'Prendre le chemin de gauche, humide et vert — plus long mais plus sûr. Ce qui pousse a plus de vie.',
        nextPage: 'ch3-a2-left',
        tag: 'caution',
        emoji: '🌿',
      },
      {
        id: 'tree-right',
        text: 'Prendre le chemin de droite, sec et direct — le plus court est souvent le meilleur.',
        nextPage: 'ch3-a3-right',
        tag: 'efficiency',
        emoji: '🍂',
      },
    ],
  },

  'ch3-a1-climb': {
    id: 'ch3-a1-climb',
    chapter: 3,
    chapterTitle: 'La Forêt des Épreuves',
    paragraphs: [
      `Souhayl grimpa. L'arbre gémit mais tint bon. Arrivé en haut, il découvrit une cache creusée dans le tronc, contenant un petit sachet en soie rouge avec une médaille : « La patience est la clé du Paradis. »`,
      `Zaki l'attendait en bas, la queue balayant le sol. — « Tu as trouvé un trésor ! Dans le Tassawuf, chaque difficulté surmontée porte un cadeau. Je te l'aurais dit avant mais... j'ai peur des hauteurs. Merci de ne pas m'avoir fait monter. »`,
    ],
    mood: 'wonder',
    next: 'ch3-creature',
    zakiSpeaks: 'Tu as trouvé un cadeau en surmontant un obstacle. C\'est comme ça que fonctionne le monde intérieur. Pas de récompense sans effort. Pas de lumière sans traverser l\'ombre.',
  },

  'ch3-a2-left': {
    id: 'ch3-a2-left',
    chapter: 3,
    chapterTitle: 'La Forêt des Épreuves',
    paragraphs: [
      `Le chemin de gauche était magnifique. Des fleurs lumineuses, des papillons dorés. Au milieu, une fontaine d'eau claire. Souhayl but — l'eau était douce et fraîche.`,
      `— « Le chemin le plus sûr n'est pas toujours le plus court, dit Zaki en sirotant l'eau (renards boivent aussi). Mais il donne souvent plus. La patience a son propre rythme — et ce rythme est toujours plus lent qu'on voudrait. »`,
    ],
    mood: 'peace',
    next: 'ch3-creature',
    zakiSpeaks: 'La patience a son propre rythme. Et ce rythme est toujours plus lent qu\'on voudrait. Comme les vacances. Ou l\'attente du Ramadan.',
  },

  'ch3-a3-right': {
    id: 'ch3-a3-right',
    chapter: 3,
    chapterTitle: 'La Forêt des Épreuves',
    paragraphs: [
      `Le chemin de droite était rapide mais rude. Des racines affleurantes, des branches basses. Souhayl arriva essoufflé, les genoux écorchés. Zaki était retourné à quatre pattes pour éviter les branches.`,
      `— « La vitesse a un prix, dit Zaki en se secouant. Celui qui court trop vite ne voit pas les panneaux sur la route. Prends le temps de regarder, même quand tu as envie de courir. » Il lui donna son propre mouchoir en soie pour les genoux.`,
    ],
    mood: 'darkness',
    next: 'ch3-creature',
    zakiSpeaks: 'La vitesse est utile. Mais la précipitation, c\'est différent. La précipitation, c\'est la vitesse sans regard. Et sans regard, on ne voit rien.',
  },

  'ch3-creature': {
    id: 'ch3-creature',
    chapter: 3,
    chapterTitle: 'La Forêt des Épreuves',
    paragraphs: [
      `Au détour d'un arbre, un petit être était assis sur le chemin, les jambes pendantes, la tête baissée. Pas un monstre — un enfant, avec des yeux trop grands et une peau d'un bleu pâle, presque transparent.`,
      `— « S'il te plaît... murmura l'être. Je suis perdu. Je cherche le chemin de la rivière de lumière. Peux-tu m'aider ? » Zaki flaira l'air et recula. — « C'est la Sadda. La tristesse incarnée. Elle n'est pas dangereuse... mais elle est lourde. Comme un manteau trempé. »`,
    ],
    mood: 'wonder',
    next: 'ch3-choice-help',
    zakiSpeaks: 'La Sadda. La tristesse incarnée. Elle n\'est pas dangereuse... mais elle est lourde. Comme un manteau trempé en hiver.',
  },

  // ─── CHOICE 8: Aider la créature ───
  'ch3-choice-help': {
    id: 'ch3-choice-help',
    chapter: 3,
    chapterTitle: 'La Forêt des Épreuves',
    paragraphs: [
      `L'être le regardait avec ses yeux immenses, remplis d'une tristesse ancienne. Zaki murmurait : — « Attention... si tu la prends sur tes épaules, tu porteras son poids. Mais si tu la laisses, elle mourra ici. »`,
    ],
    mood: 'wonder',
    choices: [
      {
        id: 'help-guide',
        text: '« Viens avec moi. On ira ensemble à la rivière. » La guider personnellement, même si ça le ralentit.',
        nextPage: 'ch3-b1-guide',
        tag: 'generosity',
        emoji: '🤝',
      },
      {
        id: 'help-directions',
        text: '« Continue tout droit, puis tourne à gauche au grand chêne. » Lui donner des indications sans s\'arrêter.',
        nextPage: 'ch3-b2-directions',
        tag: 'kindness',
        emoji: '🗺️',
      },
      {
        id: 'help-question',
        text: '« Qui es-tu ? D\'où tu viens ? Pourquoi tu cherches cette rivière ? » Comprendre avant d\'agir.',
        nextPage: 'ch3-b3-question',
        tag: 'wisdom',
        emoji: '❓',
      },
    ],
  },

  'ch3-b1-guide': {
    id: 'ch3-b1-guide',
    chapter: 3,
    chapterTitle: 'La Forêt des Épreuves',
    paragraphs: [
      `Ils marchèrent ensemble pendant des heures. La Sadda tremblait de froid — Souhayl lui donna sa lampe. Elle avait peur des bruits — Souhayl chanta. Zaki marchait devant, le nez au sol, cherchant le chemin.`,
      `Quand ils atteignirent la rivière, la Sadda se transforma. Sa peau bleue devint dorée. — « Merci, Souhayl. Chaque acte de bonté nettoie une couche de poussière sur ton cœur. » Zaki, les yeux brillants : — « Tu vois ? La tristesse... devient de la lumière. Si on la traite avec bonté. »`,
    ],
    mood: 'peace',
    next: 'ch3-bridge',
    zakiSpeaks: 'Tu vois ça ? La tristesse... devient de la lumière. Si on la traite avec bonté. C\'est la plus belle alchimie du monde.',
  },

  'ch3-b2-directions': {
    id: 'ch3-b2-directions',
    chapter: 3,
    chapterTitle: 'La Forêt des Épreuves',
    paragraphs: [
      `Souhayl donna les meilleures indications. La Sadda le remercia et s'éloigna en boitant. — « La bonté est une graine, dit Zaki. Tu en as planté une. Mais la générosité qui s'assied à côté de l'autre est plus forte que la bonté pressée. »`,
      `— « Ne sois pas avare de ton temps — c'est la monnaie la plus précieuse. La Sadda aurait eu besoin de compagnie, pas juste d'un plan. Mais tu as fait ce que tu pouvais, et c'est déjà bien. »`,
    ],
    mood: 'wisdom',
    next: 'ch3-bridge',
    zakiSpeaks: 'La bonté pressée, c\'est comme la prière pressée : elle existe, mais elle ne nourrit pas. Prends le temps de t\'asseoir à côté de ceux qui souffrent.',
  },

  'ch3-b3-question': {
    id: 'ch3-b3-question',
    chapter: 3,
    chapterTitle: 'La Forêt des Épreuves',
    paragraphs: [
      `— « Je suis la Sadda — la tristesse. Je nais quand quelqu'un fait du mal à un autre. Et je cherche la rivière parce que seule la lumière peut me transformer. » Souhayl comprit : la tristesse n'était pas un ennemi — elle cherchait la guérison.`,
      `— « On peut la chercher ensemble, dit-il. » Et c'est ensemble qu'ils la trouvèrent. Zaki, silencieux pour une fois, marchait derrière eux, la queue basse, comme s'il portait lui aussi un peu de tristesse.`,
    ],
    mood: 'peace',
    next: 'ch3-bridge',
  },

  // ═══ LE PONT DES SOUVENIRS ═══
  'ch3-bridge': {
    id: 'ch3-bridge',
    chapter: 3,
    chapterTitle: 'La Forêt des Épreuves',
    paragraphs: [
      `Après la rivière, le chemin mena à un pont. Pas un pont normal — un pont fait de miroirs brisés, suspendu au-dessus d'un gouffre sans fond. Chaque morceau de miroir montrait une image qui bougeait.`,
      `Souhayl s'approcha et reconnut les images : c'étaient des souvenirs. SA vie. Son école. Sa maison. Amina. Moulay. Et aussi... des moments qu'il préférait oublier.`,
      `Zaki se figea. — « Le Pont des Souvenirs. Il faut le traverser. Mais pour avancer, tu dois regarder chaque miroir et choisir comment y répondre. Les souvenirs que tu fuis te bloqueront le passage. »`,
    ],
    mood: 'darkness',
    next: 'ch3-choice-memory',
    zakiSpeaks: 'Le Pont des Souvenirs. Les souvenirs qu\'on fuit sont les plus lourds. Affronte-les ou reste coincé ici. Pour toujours. Pas de pression.',
  },

  // ─── CHOICE 9: Quel souvenir affronter ───
  'ch3-choice-memory': {
    id: 'ch3-choice-memory',
    chapter: 3,
    chapterTitle: 'La Forêt des Épreuves',
    paragraphs: [
      `Trois miroirs brillaient plus fort que les autres, bloquant le pont. Souhayl devait en choisir un pour commencer. Chacun montrait un souvenir douloureux.`,
    ],
    mood: 'darkness',
    choices: [
      {
        id: 'memory-lie',
        text: 'Le miroir qui montre le jour où il a menti à propos du vase — Amina avec ses grands yeux innocents.',
        nextPage: 'ch3-c1-lie',
        tag: 'honesty',
        emoji: '🤥',
      },
      {
        id: 'memory-bully',
        text: 'Le miroir qui montre Yassine qui le blesse — la rage dans sa poitrine, l\'insulte sur ses lèvres.',
        nextPage: 'ch3-c2-bully',
        tag: 'forgiveness',
        emoji: '😤',
      },
      {
        id: 'memory-sister',
        text: 'Le miroir qui montre Amina qui pleure parce qu\'il ne voulait pas jouer avec elle — son regard déçu.',
        nextPage: 'ch3-c3-sister',
        tag: 'family',
        emoji: '😢',
      },
    ],
  },

  'ch3-c1-lie': {
    id: 'ch3-c1-lie',
    chapter: 3,
    chapterTitle: 'La Forêt des Épreuves',
    paragraphs: [
      `Le miroir montra la scène en détail. Amina, cinq ans, ses couettes, ses yeux. Et Souhayl qui disait « C'est elle ! » Et le visage d'Amina qui se transformait — pas en colère, mais en tristesse. La tristesse d'être trahie par celui qu'elle aimait le plus.`,
      `Le miroir demanda : « Que veux-tu faire de ce souvenir ? » La voix n'était pas méchante — juste curieuse. Comme si le souvenir lui-même voulait savoir.`,
      `Zaki murmura : — « Tu ne peux pas changer le passé. Mais tu peux changer ce que ce passé signifie pour toi. »`,
    ],
    mood: 'darkness',
    next: 'ch3-choice-lie',
    zakiSpeaks: 'Tu ne peux pas effacer ce que tu as fait. Personne ne le peut. Mais tu peux choisir de devenir quelqu\'un qui ne le refera plus.',
  },

  'ch3-choice-lie': {
    id: 'ch3-choice-lie',
    chapter: 3,
    chapterTitle: 'La Forêt des Épreuves',
    paragraphs: [
      `Le miroir attendait. Les yeux d'Amina le fixaient à travers le verre brisé.`,
    ],
    mood: 'darkness',
    choices: [
      {
        id: 'lie-confess-now',
        text: 'Murmurer « Je suis désolé, Amina » au miroir — avouer sa faute, même si elle ne peut pas l\'entendre.',
        nextPage: 'ch3-d1-confess',
        tag: 'repentance',
        emoji: '💝',
      },
      {
        id: 'lie-promise',
        text: 'Promettre « Je ne mentirai plus jamais » et passer le miroir — tourner la page, avancer.',
        nextPage: 'ch3-d2-promise',
        tag: 'resolve',
        emoji: '🤞',
      },
      {
        id: 'lie-accept',
        text: 'Accepter le souvenir tel qu\'il est — « J\'ai menti. C\'est un fait. Je ne suis pas parfait. Mais je peux être meilleur demain. »',
        nextPage: 'ch3-d3-accept',
        tag: 'self-compassion',
        emoji: '🌟',
      },
    ],
  },

  'ch3-d1-confess': {
    id: 'ch3-d1-confess',
    chapter: 3,
    chapterTitle: 'La Forêt des Épreuves',
    paragraphs: [
      `— « Je suis désolé, Amina. » Les mots traversèrent le miroir. Et dans le reflet, quelque chose changea. Les yeux d'Amina se ridèrent — non pas de tristesse, mais d'un sourire. Comme si elle avait entendu.`,
      `Le miroir se fissura, puis se reconstitua. Cette fois, il montrait Souhayl assis à côté d'Amina, en train de jouer. Le souvenir avait été réparé. Pas effacé — transformé.`,
      `Zaki s'essuya les yeux avec sa queue. — « L'aveu est le premier acte de guérison. Même quand la personne ne peut pas t'entendre. L'aveu libère TOI, pas l'autre. » Le pont trembla — un morceau s'était dégagé.`,
    ],
    mood: 'peace',
    next: 'ch3-waswas',
  },

  'ch3-d2-promise': {
    id: 'ch3-d2-promise',
    chapter: 3,
    chapterTitle: 'La Forêt des Épreuves',
    paragraphs: [
      `— « Je ne mentirai plus jamais. » La promesse résonna. Le miroir trembla. Mais Zaki toussa poliment : — « Euh... 'plus jamais', c'est un peu absolu, non ? Le Nafs adore les promesses impossibles. Mieux vaut dire : 'Je ferai de mon mieux, et quand je vais échouer, je me relèverai.' »`,
      `Souhayl rectifia : — « Je ferai de mon mieux. Et quand je vais échouer, je me relèverai. » Le miroir acquiesça et un passage s'ouvrit. — « C'est mieux, dit Zaki. La perfection est un piège. L'effort est un chemin. »`,
    ],
    mood: 'wisdom',
    next: 'ch3-waswas',
  },

  'ch3-d3-accept': {
    id: 'ch3-d3-accept',
    chapter: 3,
    chapterTitle: 'La Forêt des Épreuves',
    paragraphs: [
      `— « J'ai menti. Je ne suis pas parfait. Mais je peux être meilleur demain. » Le miroir ne se brisa pas — il changea de couleur. De gris à doré. Comme si le souvenir lui-même avait accepté d'être regardé sans honte.`,
      `Zaki hocha la tête. — « La compassion envers soi-même est la plus difficile des compassions. On pardonne aux autres, mais on se pardonne rarement. Et pourtant... si Allah le Très Haut pardonne, qui es-tu pour ne pas te pardonner ? »`,
      `Le pont s'éclaira. Un passage s'ouvrit, plus large que les autres.`,
    ],
    mood: 'peace',
    next: 'ch3-waswas',
  },

  'ch3-c2-bully': {
    id: 'ch3-c2-bully',
    chapter: 3,
    chapterTitle: 'La Forêt des Épreuves',
    paragraphs: [
      `Le miroir montra Yassine. Son sourire de requin. Les rires de la classe. La honte de Souhayl. Mais cette fois, le miroir zooma aussi sur le visage de Yassine — et Souhayl vit quelque chose qu'il n'avait jamais remarqué.`,
      `Derrière le sourire de Yassine, il y avait de la peur. Des cernes sous les yeux. Un regard qui cherchait l'approbation de la classe. Yassine ne se moquait pas par force — il se moquait parce qu'il avait peur d'être celui qu'on moque.`,
      `Zaki souffla doucement : — « Le Nafs prend différentes formes. Parfois, c'est le Nafs de l'autre qui te blesse. Et le Nafs de l'autre est blessé lui aussi. Comprends ça, et la colère se transforme. »`,
    ],
    mood: 'wisdom',
    next: 'ch3-waswas',
    zakiSpeaks: 'Celui qui te blesse est souvent blessé lui-même. Ce n\'est pas une excuse. C\'est une explication. Et comprendre, ce n\'est pas excuser.',
  },

  'ch3-c3-sister': {
    id: 'ch3-c3-sister',
    chapter: 3,
    chapterTitle: 'La Forêt des Épreuves',
    paragraphs: [
      `Le miroir montra Amina, debout dans l'encadrement de sa porte. — « Souhayl, tu veux jouer avec moi ? » Et Souhayl, absorbé par son jeu vidéo, sans lever les yeux : — « Non. Laisse-moi. » Et le petit visage qui se décomposait.`,
      `Pas de colère. Pas de drame. Juste un petit cœur brisé par l'indifférence. Le miroir ne demandait rien — il montrait simplement. La douleur silencieuse est souvent la plus profonde.`,
      `Zaki se blottit contre la jambe de Souhayl. — « Les plus grandes blessures ne viennent pas des ennemis. Elles viennent de ceux qu'on aime. Et de nos propres distractions. »`,
    ],
    mood: 'darkness',
    next: 'ch3-waswas',
  },

  'ch3-waswas': {
    id: 'ch3-waswas',
    chapter: 3,
    chapterTitle: 'La Forêt des Épreuves',
    paragraphs: [
      `Après le pont, les arbres devinrent plus sombres. Les branches s'entremêlaient. Et dans les ténèbres, des ombres vivantes apparurent — les sbires de Shaytan.`,
      `Une silhouette se matérialisa. Jeune, beau, souriant. Des vêtements élégants, un parfum enivrant. — « Salam, Souhayl ! Je suis Waswās — le Chuchoteur. Je suis ton ami ! »`,
      `Derrière lui, un festin apparut — fruits, coussins, boissons dorées. Zaki grogna : — « C'est Shaytan. Ne le laisse PAS t'approcher. »`,
    ],
    mood: 'danger',
    next: 'ch3-choice-waswas',
    zakiSpeaks: 'ATTENTION ! C\'est Waswās, le Chuchoteur de Shaytan. Il ment. Toujours. Même quand il dit bonjour, c\'est un mensonge.',
  },

  // ─── CHOICE 10: Face à Waswās ───
  'ch3-choice-waswas': {
    id: 'ch3-choice-waswas',
    chapter: 3,
    chapterTitle: 'La Forêt des Épreuves',
    paragraphs: [
      `Waswās tendait sa main avec un sourire parfait. Les fruits sentaient divinement bons. Tout en Souhayl voulait dire oui. Mais au fond de son cœur, la flamme de la fitra pulsait faiblement, comme un rappel.`,
    ],
    mood: 'danger',
    choices: [
      {
        id: 'waswas-reject',
        text: 'Repousser la main — « Non ! Tes mensonges ne me tromperont pas ! »',
        nextPage: 'ch3-e1-reject',
        tag: 'firmness',
        emoji: '🛡️',
      },
      {
        id: 'waswas-question',
        text: 'Poser des questions — « Si tu es mon ami, pourquoi es-tu apparu dans l\'obscurité ? Que me caches-tu ? »',
        nextPage: 'ch3-e2-question',
        tag: 'discernment',
        emoji: '🧠',
      },
      {
        id: 'waswas-dhikr',
        text: 'Fermer les yeux et réciter « A\'udhu billahi min ash-shaytan ar-rajim » — la prière comme bouclier.',
        nextPage: 'ch3-e3-dhikr',
        tag: 'dhikr',
        emoji: '📿',
      },
    ],
  },

  'ch3-e1-reject': {
    id: 'ch3-e1-reject',
    chapter: 3,
    chapterTitle: 'La Forêt des Épreuves',
    paragraphs: [
      `Waswās grimça. Son sourire se brisa, révélant une rage froide. — « Tu vas le regretter. » L'illusion explosa — les fruits devinrent des cailloux, les coussins de la cendre.`,
      `Zaki s'ébroua : — « La force est utile. Mais n'oublie pas : la fermeté sans douceur peut devenir de la dureté du cœur. Le meilleur des boucliers est celui qui protège sans blesser. »`,
    ],
    mood: 'triumph',
    next: 'ch3-path-choice',
  },

  'ch3-e2-question': {
    id: 'ch3-e2-question',
    chapter: 3,
    chapterTitle: 'La Forêt des Épreuves',
    paragraphs: [
      `— « Le bonheur gratuit ? demanda Souhayl. Ça n'existe pas. Qui es-tu vraiment ? » Waswās bégaya. Son masque se fissura. — « Je... » L'illusion explosa.`,
      `Zaki fit un salut ironique. — « L'intelligence est l'arme la plus puissante contre le mensonge. Celui qui comprend le piège ne peut pas y tomber. Et toi, mon garçon, tu viens de comprendre le plus vieux piège du monde. »`,
    ],
    mood: 'wisdom',
    next: 'ch3-path-choice',
  },

  'ch3-e3-dhikr': {
    id: 'ch3-e3-dhikr',
    chapter: 3,
    chapterTitle: 'La Forêt des Épreuves',
    paragraphs: [
      `— « A'udhu billahi min ash-shaytan ar-rajim... » Sa voix tremblait puis grossit. « La ilaha illa Allah... » Une lumière jaillit de son cœur. Waswās et ses ombres se consumèrent comme du papier dans le feu.`,
      `Zaki avait les larmes aux yeux — de vraies larmes de renard. — « Le dhikr est le bouclier dont parle le Coran, Souhayl. Rappelle-toi d'Allah, et Il se souviendra de toi. C'est la promesse la plus sûre de l'univers. »`,
    ],
    mood: 'peace',
    shaykhSpeaks: 'Le dhikr est le remède des cœurs et la lumière des âmes. Plus tu te souviens d\'Allah, plus Il se souvient de toi.',
    next: 'ch3-path-choice',
  },

  'ch3-path-choice': {
    id: 'ch3-path-choice',
    chapter: 3,
    chapterTitle: 'La Forêt des Épreuves',
    paragraphs: [
      `La forêt s'ouvrit sur une clairière. Trois chemins partaient vers la montagne lointaine : un étroit et rocailleux, un large et verdoyant, un droit et ardent comme du feu.`,
      `Zaki regarda les trois chemins et secoua la tête. — « Le rocailleux est dur mais honnête. Le verdoyant est doux mais long. Le ardent est rapide mais consume. Je suis trop petit pour avoir une préférence... enfin, si. Le verdoyant. J'aime les fleurs. »`,
    ],
    mood: 'wonder',
    next: 'ch3-choice-path',
  },

  // ─── CHOICE 11: Le chemin de la montagne ───
  'ch3-choice-path': {
    id: 'ch3-choice-path',
    chapter: 3,
    chapterTitle: 'La Forêt des Épreuves',
    paragraphs: [
      `Chaque chemin avait une allure différente. Zaki attendait, la queue balayant l'herbe. Lequel choisir ?`,
    ],
    mood: 'wonder',
    choices: [
      {
        id: 'path-rock',
        text: 'Le rocailleux — difficile, exigeant, mais chaque pas est concret. Comme l\'effort dans la prière quand on n\'en a pas envie.',
        nextPage: 'ch3-f1-rock',
        tag: 'discipline',
        emoji: '⛰️',
      },
      {
        id: 'path-green',
        text: 'Le verdoyant — doux, bordé de fleurs et de ruisseaux. La miséricorde plutôt que la rigueur.',
        nextPage: 'ch3-f2-green',
        tag: 'mercy',
        emoji: '🌸',
      },
      {
        id: 'path-fire',
        text: 'L\'ardent — droit, puissant, brûlant. Le feu de l\'amour divin qui consume tout ce qui n\'est pas essentiel.',
        nextPage: 'ch3-f3-fire',
        tag: 'passion',
        emoji: '🔥',
      },
    ],
  },

  'ch3-f1-rock': {
    id: 'ch3-f1-rock',
    chapter: 3,
    chapterTitle: 'La Forêt des Épreuves',
    paragraphs: [
      `Chaque pas était un acte de volonté. Souhayl transpirait, ses muscles brûlaient, mais son esprit était étrangement clair. Zaki marchait silencieusement à côté de lui — même lui avait compris que ce chemin nécessitait du silence.`,
      `— « La discipline forge des âmes solides, dit Zaki à l'arrivée. Mais la rigidité sans compassion est un arbre sans feuilles — il survit mais ne donne rien de beau. »`,
    ],
    mood: 'triumph',
    next: 'ch4-start',
  },

  'ch3-f2-green': {
    id: 'ch3-f2-green',
    chapter: 3,
    chapterTitle: 'La Forêt des Épreuves',
    paragraphs: [
      `Sur le chemin verdoyant, ils croisèrent des créatures blessées. Et chaque fois, Souhayl s'arrêtait pour aider. Zaki l'aidait de son mieux — ce qui consistait surtout à tenir les pansements entre ses dents.`,
      `— « La miséricorde ouvre les cœurs, dit Zaki. Le tien et celui des autres. Mais la miséricorde sans justice est un océan sans rives — elle se perd dans l'infini. »`,
    ],
    mood: 'peace',
    next: 'ch4-start',
  },

  'ch3-f3-fire': {
    id: 'ch3-f3-fire',
    chapter: 3,
    chapterTitle: 'La Forêt des Épreuves',
    paragraphs: [
      `Le chemin de feu brûlait. Pas de douleur — de l'intensité pure. Chaque pas consumait une peur, un doute. Souhayl courait, poussé par un désir insatiable. Zaki sur son épaule, les poils hérissés mais déterminé.`,
      `— « Le feu de la passion est le plus beau et le plus dangereux des chemins, dit Zaki. Un feu sans contrôle consume celui qui le porte autant que ce qu'il espère atteindre. Mais toi... tu tiens bon. »`,
    ],
    mood: 'triumph',
    next: 'ch4-start',
  },

  // ═══════════════════════════════════════════
  // CHAPTER 4: LA MONTAGNE DE LA VÉRITÉ
  // ═══════════════════════════════════════════
  'ch4-start': {
    id: 'ch4-start',
    chapter: 4,
    chapterTitle: 'La Montagne de la Vérité',
    paragraphs: [
      `La Montagne de la Vérité se dressait comme un géant de pierre et de lumière, si haute que son sommet se perdait dans les nuages. Des centaines de sentiers la parcouraient, tracés par des voyageurs depuis des siècles.`,
      `Zaki s'arrêta. Ses pattes tremblaient — pas de froid cette fois, mais de quelque chose de plus profond. — « Souhayl... je ne peux pas monter plus haut. C'est trop pour moi. Ma place est ici, dans la vallée. »`,
      `Le petit renard leva les yeux dorés vers lui. — « Mais je t'attendrai. Ici. Toujours. Un renard de sagesse attend toujours son voyageur. » Sa voix se brisa légèrement.`,
    ],
    mood: 'wonder',
    next: 'ch4-farewell',
    isChapterStart: true,
    zakiSpeaks: 'Je ne peux pas monter plus haut. C\'est trop pour moi. Mais je t\'attendrai ici. Toujours. C\'est promis, Souhayl.',
  },

  'ch4-farewell': {
    id: 'ch4-farewell',
    chapter: 4,
    chapterTitle: 'La Montagne de la Vérité',
    paragraphs: [
      `Souhayl s'accroupit et prit Zaki dans ses bras. Le renard était chaud, doux, et tremblait un peu. — « Merci, Zaki. Pour tout. Pour les conseils, les blagues, et pour avoir eu peur avec moi. »`,
      `Zaki se moucha dans la manche de Souhayl. — « C'est rien. Enfin, ce n'est PAS rien. C'est beaucoup. Mais je ne vais pas le dire parce que j'ai une réputation à protéger. » Son petit corps trembla. — « Maintenant, monte. Et rappelle-toi : le courage, ce n'est pas l'absence de peur. C'est un petit renard qui tremble mais qui marche quand même à côté de toi. »`,
      `Souhayl le déposa doucement. Zaki s'assit, la queue enroulée autour de ses pattes, et le regarda monter. — « Souhayl ? » — « Oui ? » — « N'oublie pas de me donner à manger en redescendant. » Et il rit, malgré les larmes.`,
    ],
    mood: 'wisdom',
    next: 'ch4-climb',
  },

  'ch4-climb': {
    id: 'ch4-climb',
    chapter: 4,
    chapterTitle: 'La Montagne de la Vérité',
    paragraphs: [
      `La voix du Shaykh résonna : « Le dernier voyage t'appartient, Souhayl. Souviens-toi de tout ce que tu as appris. Et n'oublie pas : le Shaykh n'est pas une personne — c'est la sagesse qui vit en toi. »`,
      `À mi-chemin, le sentier se rétrécit dangereusement. D'un côté, une paroi rocheuse. De l'autre, un vide vertigineux. Un passage si étroit qu'un seul pied à la fois pouvait y avancer. Le vent soufflait.`,
    ],
    mood: 'danger',
    next: 'ch4-choice-cliff',
  },

  // ─── CHOICE 12: Le passage étroit ───
  'ch4-choice-cliff': {
    id: 'ch4-choice-cliff',
    chapter: 4,
    chapterTitle: 'La Montagne de la Vérité',
    paragraphs: [
      `Le passage était terrifiant. Pas de contournement possible. Le vent hurlait. Le vide l'appelait. Comment gérer cette peur ?`,
    ],
    mood: 'danger',
    choices: [
      {
        id: 'cliff-focus',
        text: 'Fixer un point au loin et avancer sans regarder en bas — une respiration après l\'autre. Contrôler sa peur.',
        nextPage: 'ch4-a1-focus',
        tag: 'tawakkul',
        emoji: '🎯',
      },
      {
        id: 'cliff-trust',
        text: 'Fermer les yeux et avancer à l\'aveugle — « Ya Allah, Tu es mon guide. Mène-moi. » Faire confiance totalement.',
        nextPage: 'ch4-a2-trust',
        tag: 'surrender',
        emoji: '🙈',
      },
      {
        id: 'cliff-back',
        text: 'Faire demi-tour et chercher un autre chemin — ça ne peut pas être le seul passage. Il doit y en avoir un autre.',
        nextPage: 'ch4-a3-back',
        tag: 'prudence',
        emoji: '↩️',
      },
    ],
  },

  'ch4-a1-focus': {
    id: 'ch4-a1-focus',
    chapter: 4,
    chapterTitle: 'La Montagne de la Vérité',
    paragraphs: [
      `Souhayl fixa le sommet. Un pas. Puis un autre. Sa peur était là mais ne le contrôlait plus. Il l'observait comme un orage au loin.`,
      `Quand il atteignit l'autre côté, il sentit quelque chose de nouveau : la maîtrise. Pas la disparition de la peur — la capacité de marcher malgré elle. — « Le vrai courage, murmura une voix, n'est pas l'absence de peur — c'est la décision d'avancer quand même. »`,
    ],
    mood: 'triumph',
    next: 'ch4-plateau',
  },

  'ch4-a2-trust': {
    id: 'ch4-a2-trust',
    chapter: 4,
    chapterTitle: 'La Montagne de la Vérité',
    paragraphs: [
      `Souhayl ferma les yeux. — « Ya Allah... » Ses pieds trouvèrent le passage seuls, guidés par une force invisible. Le vent s'apaisa. Il avançait dans une paix totale.`,
      `Quand il rouvrit les yeux, il était de l'autre côté. Le tawakkul — la confiance en Allah — l'avait porté. — « Celui qui fait confiance à Allah ne sera jamais déçu. Car la confiance, c'est la certitude qu'Allah fait ce qu'il y a de meilleur. »`,
    ],
    mood: 'peace',
    next: 'ch4-plateau',
  },

  'ch4-a3-back': {
    id: 'ch4-a3-back',
    chapter: 4,
    chapterTitle: 'La Montagne de la Vérité',
    paragraphs: [
      `Il chercha un autre chemin. Mais les sentiers s'effaçaient derrière lui. Bientôt, il n'y eut plus qu'un seul passage : le passage étroit. Il dut y retourner.`,
      `Il traversa — tremblant, pleurant, mais traversant. — « La prudence est bonne. Mais parfois, ce que nous fuyons est exactement ce dont nous avons besoin. »`,
    ],
    mood: 'darkness',
    next: 'ch4-plateau',
  },

  'ch4-plateau': {
    id: 'ch4-plateau',
    chapter: 4,
    chapterTitle: 'La Montagne de la Vérité',
    paragraphs: [
      `Au sommet, un plateau circulaire. Et là, le Nafs l'attendait — transformé, plus grand, en armure sombre.`,
      `— « Tu es de retour. J'ai grandi, Souhayl. Chaque fois que tu m'as nourri — par la colère, l'orgueil, l'envie — j'ai grandi. Et maintenant... je suis toi. »`,
      `Les ténèbres l'enveloppèrent. Le Nafs chargea. Souhayl s'effondra. Et au cœur de l'obscurité, une voix demanda : « Que vas-tu faire, Souhayl ? »`,
    ],
    mood: 'danger',
    next: 'ch4-choice-final',
  },

  // ─── CHOICE 13: Le choix ultime ───
  'ch4-choice-final': {
    id: 'ch4-choice-final',
    chapter: 4,
    chapterTitle: 'La Montagne de la Vérité',
    paragraphs: [
      `Au cœur de l'obscurité, quatre voies s'ouvrirent. Pas des chemins physiques — des réponses du cœur. Ce dernier choix définirait qui il était devenu.`,
    ],
    mood: 'wonder',
    choices: [
      {
        id: 'final-surrender',
        text: 'L\'abandon total — « Ya Allah, je me rends. Je ne suis rien et Tu es tout. Prends ce qui reste de moi. »',
        nextPage: 'ending-light',
        tag: 'surrender',
        emoji: '🤲',
      },
      {
        id: 'final-seek',
        text: 'La demande sincère — « Ya Allah, guide-moi encore. Je veux comprendre, pas seulement croire. »',
        nextPage: 'ending-wisdom',
        tag: 'guidance',
        emoji: '📖',
      },
      {
        id: 'final-struggle',
        text: 'Se relever et lutter — « Non. Je me battrai contre mon ego jusqu\'à mon dernier souffle. »',
        nextPage: 'ending-shadow',
        tag: 'independence',
        emoji: '🗡️',
      },
      {
        id: 'final-pure',
        text: 'L\'intégration — « J\'ai appris que le monde intérieur et le monde extérieur sont liés. Je veux retourner dans ma vie et appliquer ce que j\'ai compris. »',
        nextPage: 'ending-pure',
        tag: 'integration',
        emoji: '🌍',
      },
    ],
  },

  // ═══════════════════════════════════════════
  // ENDINGS
  // ═══════════════════════════════════════════

  'ending-light': {
    id: 'ending-light',
    chapter: 4,
    chapterTitle: 'La Montagne de la Vérité',
    paragraphs: [
      `Souhayl tomba à genoux. — « Ya Allah... je me rends. » Les ténèbres se transformèrent en lumière. L'armure du Nafs se brisa en étoiles. Son ego apparut, nu et vulnérable.`,
      `— « Je te pardonne, dit Souhayl. Car si Allah peut pardonner, qui suis-je pour refuser la même grâce ? » Le sommet s'ouvrit sur une lumière infinie.`,
      `— « L'abandon est la plus grande des forces. Celui qui se rend à Allah trouve la liberté. » Souhayl ferma les yeux et sentit la lumière l'envelopper.`,
    ],
    mood: 'ending',
    isEnding: true,
    endingType: 'light',
  },

  'ending-wisdom': {
    id: 'ending-wisdom',
    chapter: 4,
    chapterTitle: 'La Montagne de la Vérité',
    paragraphs: [
      `— « Ya Allah... guide-moi encore. Je veux comprendre. » Une lumière douce se fit. Le Nafs recula. Le Shaykh apparut, rayonnant : « Tu as choisi la sagesse, Souhayl. »`,
      `— « Retourne dans ton monde. Vis, fais des erreurs, apprends. Chaque jour est un pas vers Allah. Le Tassawuf n'a pas de fin — chaque réponse ouvre de nouvelles questions. Et c'est magnifique. »`,
      `Souhayl comprit que le voyage ne s'arrêtait jamais. Et c'était la plus belle des nouvelles.`,
    ],
    mood: 'ending',
    isEnding: true,
    endingType: 'wisdom',
  },

  'ending-shadow': {
    id: 'ending-shadow',
    chapter: 4,
    chapterTitle: 'La Montagne de la Vérité',
    paragraphs: [
      `Souhayl se releva. — « Je vais me battre ! » Mais plus il luttait, plus l'ego grandissait. Il s'effondra. Le Nafs se pencha sur lui et pleura.`,
      `— « Pourquoi ne demandes-tu pas de l'aide ? » murmura l'ego blessé. Le Shaykh apparut : « Tu n'as pas perdu. Tu as appris la leçon la plus difficile : la limite de soi-même. »`,
      `— « La vraie force n'est pas de se battre seul — c'est d'avoir l'humilité de demander de l'aide. Va en paix, Souhayl. Et reviens quand tu seras prêt. »`,
    ],
    mood: 'ending',
    isEnding: true,
    endingType: 'shadow',
  },

  'ending-pure': {
    id: 'ending-pure',
    chapter: 4,
    chapterTitle: 'La Montagne de la Vérité',
    paragraphs: [
      `— « J'ai appris quelque chose de plus important que la victoire ou la défaite : le monde intérieur et le monde extérieur sont UN. Les épreuves que j'ai traversées ici sont les mêmes que celles de ma vie quotidienne. »`,
      `La montagne trembla. Les deux mondes fusionnèrent. Souhayl se retrouva dans sa chambre, le livre ouvert sur ses genoux. Le premier rayon de soleil entrait par la fenêtre. Fajr. La prière de l'aube.`,
      `Amina dormait dans la chambre voisine. Moulay dormait en bas. Yassine... Yassine existait aussi, quelque part, avec ses propres batailles intérieures. Souhayl ferma le livre et sourit. Le vrai voyage ne commençait que maintenant — chaque jour, chaque choix, chaque interaction. Il descendit, fit sa prière de Fajr, et quand Amina se réveilla, il lui dit : « Viens, on joue ensemble. » Le voyage intérieur continue. Pour toujours. Fin du Tome 1.`,
    ],
    mood: 'ending',
    isEnding: true,
    endingType: 'pure',
  },

};

export const firstPageId = 'prologue';
export const totalChapters = 4;
export const totalEndings = 4;
