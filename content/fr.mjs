// Coco Surf School — design-06 multipage — FRENCH content
const CARDS = [
  { img: 'real-deluxe-group.jpg', alt: 'Petit groupe de surfeurs sur la plage', title: 'Cours collectif deluxe', from: 'dès 44 €', p: 'Un cours de 2 à 6 personnes : la formule entre collectif et privé pour progresser plus vite. Plus de temps avec le coach.', chips: ['Petit groupe · max 6', '±2h total', 'Matériel inclus'] },
  { img: 'real-lesson-kids.jpg', alt: 'Élèves qui apprennent à surfer dans la mousse', title: 'Cours collectif', from: 'dès 38 €', p: 'Un cours en groupe de qualité de 7 à 8 personnes avec un moniteur. L’ambiance et la bonne humeur en plus.', chips: ['Grand groupe · 7–8', '±2h total', 'Matériel inclus'] },
  { img: 'lesson-prive.jpg', alt: 'Une surfeuse sur une belle vague verte', title: 'Cours privé', from: 'dès 130 €', p: 'Un cours rien que pour vous, en couple, en famille ou entre amis. Un moniteur entièrement dédié à votre progression.', chips: ['Votre propre groupe · 1–7', '±2h total', 'Sur mesure'] },
  { img: 'lesson-team.jpg', alt: 'Des collègues rejoignent l’océan avec leurs planches', title: 'Entreprises & team building', from: 'sur demande', p: 'Une sortie sportive entre collègues ! Esprit d’équipe, anti-stress, sourires et fun au rendez-vous.', chips: ['Sur demande', 'Cohésion'] },
];
export default {
  waText: 'Bonjour Coco Surf School, j’aimerais réserver un cours de surf.',
  ui: {
    nav: { lessons: 'Cours &amp; tarifs', coach: 'Coach', stay: 'Hébergement', rental: 'Location', srilanka: 'Sri Lanka', contact: 'Contact', learn: 'Apprendre à surfer', faq: 'Questions fréquentes', legal: 'Mentions légales', privacy: 'Confidentialité' },
    navLabel: 'Navigation principale', book: 'Réserver', langLabel: 'Choix de la langue', menuOpen: 'Ouvrir le menu',
    crumbHome: 'Accueil', footTagline: 'École de surf à Seignosse &amp; Hossegor. La qualité avant la quantité — des cours en petits groupes avec Annelies.', footNav: 'Naviguer', langWord: 'Langue',
  },
  pages: {
    home: {
      title: 'Coco Surf School — Cours de surf à Hossegor &amp; Seignosse',
      desc: 'École de surf à Seignosse &amp; Hossegor, France. Des cours en petits groupes de max 6 personnes, tout en douceur, planche et combinaison incluses.',
      jsonld: { '@context': 'https://schema.org', '@type': 'SportsActivityLocation', name: 'Coco Surf School', description: 'École de surf à Seignosse et Hossegor (Landes, France), cours en petits groupes de maximum 6 personnes.', url: 'https://www.coco-surfschool.com/fr/', telephone: '+33647454265', email: 'cocobosurfschool@gmail.com', priceRange: '€40–€310', areaServed: ['Seignosse', 'Hossegor', 'Capbreton', 'Les Landes'], address: { '@type': 'PostalAddress', addressLocality: 'Seignosse', addressRegion: 'Landes', postalCode: '40510', addressCountry: 'FR' } },
      hero: { eyebrow: 'École de surf mobile · Landes, France', h1: 'Votre école de surf à <em>Seignosse, Hossegor &amp; Capbreton</em>', lead: 'Cours, stages et coaching pour tous les âges, des enfants aux adultes — du débutant au surfeur confirmé, en petit groupe, en privé ou en collectif. Encadrement par des coachs diplômées, planche et combinaison incluses. Envie de vraiment maîtriser le surf ? Réservez un stage de 5 jours !', cta1: 'Réserver un cours', cta2: 'Voir les tarifs', cta3: 'Réserver un stage', facts: [{ b: '6', s: 'max / groupe' }, { b: '±2h', s: 'par cours (1h30 dans l’eau)' }, { b: '5 jours', s: 'stage · 5 × 2h' }, { b: '38€', s: 'dès, par pers.' }], imgAlt: 'Élèves de Coco Surf School face à l’océan à Seignosse', badge1: 'Stages de surf', badge2: 'petit groupe · privé ou collectif' },
      trust: [{ ic: '👥', b: 'Petits groupes', s: 'Max 6 en cours deluxe · plus grand groupe possible' }, { ic: '🏄‍♀️', b: 'Coachs diplômées', s: 'Monitrices ISA &amp; FR' }, { ic: '🩱', b: 'Matériel inclus', s: 'Planche &amp; combinaison fournies' }, { ic: '📍', b: 'École mobile', s: 'Le meilleur spot selon votre niveau' }],
      philosophy: { eyebrow: 'Notre philosophie', title: 'Une école qui prend le temps de bien faire', lead: 'La qualité avant la quantité. Petits groupes, coachs expérimentées qui partagent volontiers leur passion et beaucoup de temps dans l’eau — pour progresser plus vite et prendre plus de plaisir. Good vibes garantis !', points: [{ h: 'La qualité avant la quantité', p: 'Maximum 6 par groupe en cours deluxe, pour plus de coaching et une progression plus rapide. Plus grand groupe possible.' }, { h: 'Progresser dans la bonne humeur', p: 'Apprendre le surf doit être fun — bonne humeur garantie, de ta première vague à ton premier green.' }, { h: 'Le bon spot, chaque jour', p: 'École mobile entre Seignosse, Hossegor et Capbreton : on choisit le meilleur spot au plus près de chez vous.' }] },
      surfReport: { eyebrow: 'En direct · Les Bourdaines, Seignosse', title: 'Surf report', today: 'Aujourd’hui', tomorrow: 'Demain', air: 'Air', wave: 'Houle', water: 'Eau', wind: 'Vent', uv: 'UV', tide: 'Marée', high: 'Haute', low: 'Basse', sunrise: 'Lever', sunset: 'Coucher', unavailable: 'Conditions indisponibles pour le moment.' },
      lessonsT: { eyebrow: 'Les formules', title: 'Choisissez le cours qui vous ressemble', lead: 'Tous les cours durent 1h30 dans l’eau — comptez ±2h au total (déplacement et change compris). Planche et combinaison incluses. Les horaires dépendent de la marée, des conditions de l’océan et de votre niveau.', cards: CARDS, more: 'Voir tous les cours &amp; tarifs' },
      spots: { eyebrow: 'Où l’on surfe', title: 'Deux des plus beaux spots des Landes', lead: 'Une école mobile entre Seignosse, Hossegor et Capbreton — on choisit le meilleur spot selon votre niveau et les conditions du jour.', hossegor: { alt: 'Les plages de surf de Hossegor', h: 'Surf à Hossegor', p: 'Des beach breaks réputés, une ville surf et des cours pour tous les niveaux.' }, seignosse: { alt: 'La plage des Bourdaines à Seignosse', h: 'Surf à Seignosse', p: 'Notre camp d’été aux Bourdaines — des vagues douces, parfaites pour débuter.' } },
      reviews: { eyebrow: 'Avis', title: 'Ils ont surfé avec nous', sub: '5,0 · Avis Google vérifiés', cta: 'Voir sur Google' },
      coachT: { alt: 'Annelies, coach de Coco Surf School, sur une vague', eyebrow: 'Votre coach', title: 'Annelies, dite « Bo »', quote: '« Le surf, c’est une des plus belles découvertes de ma vie. »', p: 'Monitrice de surf diplômée ISA & FR, professeure de sport et sportive de toujours. Après dix ans à voyager et surfer, Annelies a posé ses valises à Seignosse pour ouvrir une école douce, à taille humaine. Progresser dans une ambiance sympa — bonne humeur garantie !', cta: 'Rencontrer Annelies' },
      sriT: { alt: 'La famille sri-lankaise sur la côte sud', eyebrow: 'Surf camp · Sri Lanka', title: 'Sri Lanka, en famille', p: 'Passez l’hiver sur la côte sud, chez notre famille sri-lankaise, à 100 m de la plage de Midigama. Cuisine maison, jardin-jungle et vagues douces — le vrai Sri Lanka.', cta: 'Découvrir le camp' },
      cta: { h: 'Envie de surfer avec nous ?', p: 'Petits groupes, tous niveaux, planche & combinaison incluses. Écrivez-nous — on vous répond avec plaisir.', b1: 'Réserver un cours', b2: 'Nous écrire sur WhatsApp' },
    },
    lessons: {
      title: 'Cours de surf &amp; tarifs — Coco Surf School Hossegor &amp; Seignosse', desc: 'Cours de surf dans les Landes : collectif deluxe (max 6) dès 44 €, collectif dès 38 €, privé dès 130 €. Planche & combinaison incluses, 1h30.', h1: 'Cours de surf', crumb: 'Cours & tarifs',
      eyebrow: 'Les formules &amp; tarifs', h1html: 'Choisissez le cours qui vous <em>ressemble</em>', lead: 'Tous les cours durent 1h30 dans l’eau — comptez ±2h au total (déplacement et change compris). Planche et combinaison incluses. Les horaires dépendent de la marée, des conditions de l’océan et de votre niveau.', cta1: 'Réserver un cours', cta2: 'Nous écrire sur WhatsApp',
      cards: CARDS, note: '<strong>Bon à savoir —</strong> planche et combinaison sont toujours incluses. Durée : 1h30 par session — comptez ±2h au total (déplacement et change compris).',
      rates: { eyebrow: 'Tarifs', title: 'Des prix clairs, tout inclus', lead: 'Planche et combinaison incluses · ±2h par cours (1h30 dans l’eau) · « pp » = par personne.', cards: [
        { featured: true, h: 'Collectif deluxe', flag: 'Le plus populaire', sub: 'Un moniteur pour 6 personnes max (min. 2).', lines: [['1 cours', '52 € pp'], ['Petit surf trip (3 cours)', '138 € pp'], ['Stage 5 jours (5 cours)', '220 € pp'], ['Réduction famille (3 inscriptions)', '215 € pp']], incl: '2 ou 4 cours aussi possibles · Planche &amp; combinaison incluses · ±2h (1h30 dans l’eau)' },
        { h: 'Collectif', sub: 'Plus grands groupes — un moniteur pour 8 max (min. 3 pour ouvrir le cours).', lines: [['1 cours', '40 € pp'], ['Petit surf trip (3 cours)', '115 € pp'], ['Stage 5 jours (5 cours)', '180 € pp']], incl: '2 ou 4 cours aussi possibles · Planche &amp; combinaison incluses · ±2h (1h30 dans l’eau)' },
        { h: 'Cours privés', sub: 'Planche &amp; combinaison incluses · ±2h au total (~1h15 de coaching dans l’eau).', lines: [['1 personne', '130 € <small>juil.–août : 180 €</small>'], ['2 personnes', '170 € <small>juil.–août : 220 €</small>'], ['3 personnes', '240 € <small>juil.–août : 260 €</small>'], ['4 personnes', '290 €'], ['5 à 7 personnes', '310 €']], incl: 'Un moniteur entièrement pour vous' },
      ], extra: [{ h: 'Surf guiding', p: 'Découvrez d’autres plages de Seignosse, Hossegor ou Capbreton — comptez 5 à 6 h (2 sessions). Tarifs sur demande.' }, { h: 'Réservation &amp; paiement', p: 'Un acompte de 30 % est demandé à la réservation. Paiement par virement bancaire ou en espèces.' }] },
    },
    coach: {
      title: 'Votre coach Annelies — Coco Surf School Hossegor', desc: 'Rencontrez Annelies (« Bo »), monitrice de surf diplômée ISA & FR et fondatrice de Coco Surf School à Hossegor/Seignosse.', h1: 'Votre coach', crumb: 'Coach', imgAlt: 'Annelies, coach et fondatrice de Coco Surf School, portrait souriant', eyebrow: 'Votre coach',
      quote: '« Le surf, c’est une des plus belles découvertes de ma vie. Le sport et le coaching, c’est ma vie. »',
      body: ['Annelies est là pour vous apprendre le surf ou vous perfectionner ! Passionnée de surf et de bien d’autres sports, née en Belgique où elle pratique le trampoline à haut niveau, elle découvre le surf à 16 ans lors d’un voyage en famille à Soustons.', 'Après un Master en Éducation Physique, elle suit son rêve et part surfer, faire du snowboard et travailler autour du monde : Australie, Nouvelle-Zélande, États-Unis, Indonésie, Sri Lanka, Fiji, Maroc… « Après ma vie de compétitrice, c’était tellement logique de devenir professeure de sport, de surf et de snowboard. »', 'Après 10 ans de voyages, l’océan l’a rappelée et elle s’installe à Seignosse. « J’ai eu l’honneur de travailler avec le Hossegor Surf Club ; aujourd’hui je suis ravie de vous accueillir dans ma propre école. Coco Surf School se concentre sur la qualité et non la quantité. C’est pourquoi nous proposons la formule deluxe : des cours en petits groupes de maximum 6 personnes par moniteur. »'],
      dipTitle: 'Diplômes &amp; certifications', diplomas: [['2000', 'Initiateur Snowboard (VSSF)'], ['2003', 'Master en Éducation Physique, KU Leuven'], ['2003', 'Diplôme d’enseignement, KU Leuven'], ['2003', 'Trainer A fitness &amp; personal trainer, VTS'], ['2006', 'Level 2 Snowboard, ASI (US)'], ['2009', 'Level 1 ISA Surf Coach &amp; Lifeguard'], ['2013', 'Carte pro. Éducateur Sportif Surf (FR)'], ['2020', 'International Surf Judge, ISA'], ['2021', 'PSE1 Secourisme, Hossegor']], cta: 'Réserver un cours avec Annelies',
    },
    stay: {
      title: 'Où dormir — Hébergements près de Coco Surf School, Seignosse', desc: 'Adresses où dormir près de Coco Surf School à Seignosse & Hossegor : Maison Irene, Villa & Maison de la Dune, Board & Breakfast et campings.', h1: 'Où dormir', crumb: 'Hébergement',
      eyebrow: 'Où dormir', h1html: 'Des hébergements tout <em>près</em> de l’école', lead: 'Quelques adresses de confiance pour poser vos valises à deux pas de l’océan.',
      cards: [
        { pin: 'Seignosse · Les Bourdaines', h: 'Maison Irene', p: '8 personnes, 3 chambres + canapé-lit, 2 salles de bain, grande terrasse avec jacuzzi. À 100 m de la plage et de l’école. Annonce Airbnb disponible.', href: 'mailto:tudela_sire@hotmail.com', link: 'Contacter Irene' },
        { pin: 'Seignosse', h: 'Villa de la Dune', p: 'Grande villa de vacances à Seignosse, à deux pas des plages et de l’école.', href: 'https://villadeladune-seignosse.fr', link: 'villadeladune-seignosse.fr' },
        { pin: 'Seignosse', h: 'Maison de la Dune', p: 'Maison de vacances pleine de charme à Seignosse, proche des spots et du centre.', href: 'https://maisondeladune-seignosse.fr', link: 'maisondeladune-seignosse.fr' },
        { pin: 'Labenne Océan', h: 'Board &amp; Breakfast', p: 'Anton vous accueille dans sa belle maison avec piscine — location complète jusqu’à 20 personnes ou chambres façon surf camp.', href: 'https://boardnbreakfast.com', link: 'boardnbreakfast.com' },
        { pin: 'Seignosse', h: 'Campings', p: 'Plusieurs campings à proximité, parfaits l’été : Natureo, Les Maritimes et Les Oyats.', href: 'https://seignosse-tourisme.com', link: 'Voir les campings' },
        { pin: 'Office de tourisme de Seignosse', h: 'Plus d’options', p: 'Retrouvez d’autres hébergements et bons plans via l’office de tourisme de Seignosse.', href: 'https://seignosse-tourisme.com', link: 'seignosse-tourisme.com' },
      ],
    },
    // Unused: no PAGES entry, so no page is emitted from this block. Kept as
    // translated copy in case the Sri Lanka trip comes back. The four images it
    // referenced were deleted; restore them before re-enabling.
    srilanka: {
      title: 'Surf camp Sri Lanka — Midigama avec Coco Surf School', desc: 'Rejoignez Coco Surf School sur la côte sud du Sri Lanka. Maison familiale à 100 m de la plage de Midigama — Lazy Left & Rams.', h1: 'Surf camp Sri Lanka', crumb: 'Sri Lanka', bannerAlt: 'Coucher de soleil sur la côte sud du Sri Lanka', eyebrow: 'Surf camp',
      h1: 'Sri Lanka, en famille',
      body: ['Votre séjour en famille sur la magnifique côte sud du Sri Lanka ! Nous passons nos hivers chez Budhika, Manori et Passandi, devenus notre famille sri-lankaise. Depuis que Budhika a perdu sa jambe dans un accident de bus, la famille vit entièrement des revenus de la guesthouse ; nous les aidons à développer leur activité. Vous pouvez y séjourner toute l’année !', 'La maison se trouve à 100 m de la plage de Midigama — « Lazy Left » et « Rams » sont vos spots. Vous vivrez le vrai Sri Lanka : petit-déjeuner maison dans le jardin-jungle, entre écureuils, paons, singes et cocotiers. Manori est réputée pour sa cuisine — rotti à la noix de coco et egg hoppers le matin, riz &amp; curry le soir. Massage ayurvédique sur demande.'],
      cta: 'En savoir plus sur le camp', g1: 'Surf sur une vague à Midigama, Sri Lanka', g2: 'Budhika, Manori et Passandi, la famille sri-lankaise', g3: 'Un paon sur le toit de la maison au Sri Lanka',
    },
    rental: {
      title: 'Location — planches de surf &amp; combinaisons | Coco Surf School', desc: 'Louez une planche de surf ou une combinaison chez Coco Surf School à Seignosse &amp; Hossegor — de 2 heures à une semaine.', h1: 'Location', crumb: 'Location',
      eyebrow: 'Location', h1html: 'Louer du <em>matériel</em>', lead: 'Louez votre planche ou votre combinaison chez nous — de 2 heures à une semaine complète. Retrait sur place.',
      board: 'Surf (planche seule)', wetsuit: 'Combinaison',
      cols1: ['Tarif', '2H', '½ J', '1 J', '2 J'], cols2: ['Tarif', '3 jours', '4 jours', '5 jours', '6 jours', '1 semaine'],
      rows1: { board: ['15 €', '20 €', '30 €', '50 €'], wetsuit: ['10 €', '10 €', '15 €', '25 €'] },
      rows2: { board: ['70 €', '80 €', '90 €', '100 €', '110 €'], wetsuit: ['35 €', '45 €', '55 €', '65 €', '70 €'] },
      note: '<strong>Bon à savoir —</strong> location sur place. Demandez-nous lors de votre réservation ou via WhatsApp.', cta: 'Réservez votre matériel',
    },
    contact: {
      title: 'Contact &amp; réservation — Coco Surf School Hossegor &amp; Seignosse', desc: 'Réservez votre cours de surf à Coco Surf School. Téléphone +33 6 47 45 42 65, email cocobosurfschool@gmail.com. Acompte de 30 %.', h1: 'Contact', crumb: 'Contact',
      eyebrow: 'Contact', lead: 'L’école vous accueille à Seignosse, Hossegor et Capbreton. Écrivez-nous pour réserver votre cours ou poser vos questions — on vous répond avec plaisir.',
      phone: 'Téléphone', where: 'Où', deposit: 'Un acompte de 30 % est demandé à la réservation. Paiement par virement bancaire ou en espèces.', fName: 'Nom', fEmail: 'Email', fMsg: 'Message', fPlaceholder: 'Quel cours vous intéresse ? Combien de personnes ? Quelles dates ?', send: 'Envoyer', fSending: 'Envoi…', fOk: 'Merci ! Nous vous répondrons très vite.', fErr: 'Une erreur est survenue. Écrivez-nous directement à cocobosurfschool@gmail.com.', faqTitle: 'Questions fréquentes',
      fConsent: 'Je souhaite recevoir de temps en temps des nouvelles de l’école (nouvelles dates, offres). Facultatif.',
      fPrivacy: 'Votre nom, votre email et votre message servent à répondre à votre demande et sont conservés deux ans. Détails :',
      faqMore: 'Voir toutes les questions fréquentes',
      h1: 'Venez surfer avec Coco Surf School',
      faq: [
        { q: 'Où ont lieu les cours de surf ?', a: 'Coco Surf School est une école mobile entre Hossegor et Seignosse : le meilleur spot est choisi selon votre niveau et les conditions. En été, l’école est basée à Seignosse, Les Bourdaines.' },
        { q: 'Combien de personnes par cours ?', a: 'La qualité avant la quantité : maximum 6 personnes par moniteur (8 sur demande), pour plus de coaching et une progression plus rapide.' },
        { q: 'Le matériel est-il inclus ?', a: 'Oui, la planche et la combinaison sont incluses dans tous les cours. Chaque cours dure 1h30.' },
        { q: 'Comment réserver et payer ?', a: 'Un acompte de 30 % est demandé à la réservation. Le paiement se fait par virement bancaire ou en espèces.' },
        { q: 'Faut-il déjà savoir surfer ?', a: 'Non. Annelies accueille les débutants comme les surfeurs qui veulent se perfectionner.' },
      ],
    },
    hossegor: {
      title: 'Cours de surf à Hossegor — Coco Surf School | Tous niveaux', desc: 'Cours de surf à Hossegor avec Coco Surf School. Petits groupes (max 6), planche & combinaison incluses, coach diplômée ISA.', h1: 'Cours de surf à Hossegor', crumb: 'Surf à Hossegor', ogImage: 'owner-hossegor-page.jpg',
      eyebrow: 'Landes · France', h1html: 'Cours de surf à <em>Hossegor</em>', lead: 'Venez surfer avec nous à Hossegor ! Apprenez à surfer dans l’une des villes de surf les plus réputées d’Europe. Petits groupes de 6 maximum en formule deluxe, planche et combinaison incluses, avec des coachs diplômées.', cta1: 'Réserver un cours', cta2: 'Voir les tarifs', img: 'owner-hossegor-page.jpg', imgAlt: 'Surfeurs sur une plage de Hossegor',
      body: '<p class="lead">Hossegor est le cœur du surf dans les Landes, une référence des beach breaks en Europe. Coco Surf School est une école mobile entre Hossegor et Seignosse : on choisit le meilleur spot selon votre niveau et les conditions du jour.</p><h2>Pourquoi apprendre à Hossegor ?</h2><ul class="ticks"><li>Des beach breaks atlantiques adaptés à tous les niveaux, de la mousse pour débuter aux pics plus toniques.</li><li>Une ville tournée vers le surf, idéale pour un séjour les pieds dans l’eau.</li><li>De larges plages de sable à deux pas de l’océan.</li></ul><h2>Des cours pour tous les niveaux</h2><p>Jamais surfé, ou envie de vous perfectionner ? Chaque session s’adapte à vous. Les cours durent 1h30, planche et combinaison incluses, en groupes de 6 maximum (8 sur demande).</p><h2>Bon à savoir</h2><p>Le meilleur spot — Hossegor, Seignosse ou Capbreton — est choisi selon la marée et les conditions de vagues. En été, l’école est basée à Seignosse, Les Bourdaines.</p>',
      aside: { h: 'Réserver à Hossegor', p: 'Petits groupes · tous niveaux · matériel inclus.', b1: 'Réserver un cours', b2: 'WhatsApp' },
    },
    seignosse: {
      title: 'Cours de surf à Seignosse — Coco Surf School | Les Bourdaines', desc: 'Cours de surf à Seignosse (Les Bourdaines) avec Coco Surf School. Vagues douces pour débuter, petits groupes (max 6), matériel inclus.', h1: 'Cours de surf à Seignosse', crumb: 'Surf à Seignosse', ogImage: 'a29fce_571dd78100a24c038429f1bfaf22b936.jpg',
      eyebrow: 'Landes · France', h1html: 'Cours de surf à <em>Seignosse</em>', lead: 'Notre camp d’été aux Bourdaines : des beach breaks sympas, doux et sableux, parfaits pour apprendre. Petits groupes de 6 maximum, planche et combinaison incluses.', cta1: 'Réserver un cours', cta2: 'Voir les tarifs', img: 'a29fce_571dd78100a24c038429f1bfaf22b936.jpg', imgAlt: 'La plage des Bourdaines à Seignosse',
      body: '<p class="lead">Seignosse, juste au nord de Hossegor, offre certaines des plages les plus accueillantes des Landes. En été, Coco Surf School est basée aux Bourdaines — une large plage de sable où la mousse est idéale pour vos premières vagues.</p><h2>Pourquoi apprendre à Seignosse ?</h2><ul class="ticks"><li>Des beach breaks sableux aux Bourdaines, doux pour débutants et intermédiaires.</li><li>Un cadre plus calme et naturel que les plages de ville.</li><li>Le camp d’été de l’école : cours faciles à organiser.</li></ul><h2>Des cours pour tous les niveaux</h2><p>De vos premières vagues en mousse à vos premiers take-off sur la vague verte, chaque session s’adapte à vous. Les cours durent 1h30, planche et combinaison incluses, en petits groupes de 6 maximum. On peut aussi surfer en plus grand groupe.</p><h2>Bon à savoir</h2><p>École mobile entre Seignosse, Hossegor et Capbreton : on choisit le meilleur spot selon votre niveau et les conditions du jour.</p>',
      aside: { h: 'Réserver à Seignosse', p: 'Petits groupes · tous niveaux · matériel inclus.', b1: 'Réserver un cours', b2: 'WhatsApp' },
    },
    team: {
      title: 'Team building surf dans les Landes — Coco Surf School', desc: 'Team building surf à Hossegor & Seignosse. Une sortie entre collègues : esprit d’équipe, anti-stress et sourires garantis. Tarifs sur demande.', h1: 'Team building', crumb: 'Team building', ogImage: 'owner-team-new.jpg',
      eyebrow: 'Entreprises · Landes', h1html: 'Surf <em>team building</em>', lead: 'Allez surfer avec vos collègues ! Esprit d’équipe, anti-stress, sourires et fun au rendez-vous — une journée sportive dans l’océan à Seignosse, Hossegor ou Capbreton.', cta1: 'Demander un devis', cta2: 'Voir les tarifs', img: 'owner-team-new.jpg', imgAlt: 'Des collègues rejoignent l’océan avec leurs planches',
      body: '<p class="lead">Envie d’une activité d’équipe différente dans les Landes ? Emmenez votre équipe surfer. Un défi partagé dans l’océan, c’est l’une des plus belles façons de créer du lien — et tout le monde ressort de l’eau le sourire aux lèvres.</p><h2>Pourquoi surfer en équipe ?</h2><ul class="ticks"><li><strong>Esprit d’équipe</strong> — une première expérience partagée où l’on s’encourage.</li><li><strong>Anti-stress</strong> — rien ne remet les idées en place comme l’océan et le grand air.</li><li><strong>Accessible à tous</strong> — aucune expérience requise, fun garanti.</li></ul><h2>Comment ça se passe</h2><p>Les sessions sont encadrées par Annelies, coach diplômée, planche et combinaison incluses. Nous pouvons encadrer de grands groupes jusqu’à 32 personnes à la fois. On adapte le format à votre groupe et on choisit la meilleure plage entre Seignosse, Hossegor et Capbreton. Tarifs sur demande.</p>',
      aside: { h: 'Organisez votre journée', p: 'Dites-nous la taille du groupe et vos dates — devis sur mesure.', b1: 'Demander un devis', b2: 'WhatsApp' },
    },
    learn: {
      title: 'Apprendre à surfer — Cours débutants à Hossegor &amp; Seignosse', desc: 'Jamais surfé ? Apprenez à surfer avec Coco Surf School. Comment se déroule votre premier cours, ce qui est inclus et comment vous progressez en petits groupes de 6.', h1: 'Apprendre à surfer', crumb: 'Apprendre à surfer', ogImage: 'a29fce_4b942950b2834ef2ad4e3191df3d547a.jpg',
      eyebrow: 'Pour débutants', h1html: 'Apprendre à <em>surfer</em>', lead: 'Jamais surfé ? Aucun souci. Voici exactement comment se déroule votre premier cours, ce qui est inclus et à quelle vitesse vous progressez.', cta1: 'Réserver votre premier cours', cta2: 'Voir les tarifs', img: 'a29fce_4b942950b2834ef2ad4e3191df3d547a.jpg', imgAlt: 'Élèves qui apprennent à surfer dans la mousse',
      body: '<p class="lead">Le surf, c’est l’une des plus belles sensations qui soient — et pas besoin d’expérience pour commencer. Chez Coco Surf School, vous apprenez en petit groupe de 6 maximum, pour que le coach vous accompagne dès votre première vague.</p><h2>Votre premier cours, étape par étape</h2><p>Un cours dure 1h30 dans l’eau — comptez ±2h au total. On démarre sur la plage par un échauffement et les bases — s’allonger sur la planche, ramer, se redresser. Puis on entre dans la mousse (les vagues déjà cassées, près du bord), l’endroit le plus sûr et le plus facile pour vos premières glisses. La plupart des débutants se mettent debout dès les premiers cours.</p><h2>Ce qui est inclus</h2><ul class="ticks"><li>Planche et combinaison — toujours incluses.</li><li>Une coach diplômée, en groupe de 6 maximum (8 sur demande).</li><li>La plage la plus adaptée aux débutants, choisie selon les conditions du jour.</li></ul><h2>À prévoir</h2><p>Un maillot sous la combinaison, une serviette, de la crème solaire et de l’eau. On s’occupe du reste.</p><h2>À quelle vitesse progresse-t-on ?</h2><p>Les petits groupes = plus de coaching et une progression plus rapide. Un <strong>petit surf trip (3 cours)</strong> ou un <strong>stage 5 jours</strong> vous aide à vraiment décoller.</p>',
      aside: { h: 'Votre premier cours', p: 'Petits groupes · tous niveaux · matériel inclus · 1h30.', b1: 'Réserver un cours', b2: 'WhatsApp' },
    },
    faq: {
      title: 'Questions fréquentes sur le surf débutant — Coco Surf School', desc: 'Faut-il savoir nager ? À partir de quel âge ? Combien de cours ? Annelies répond aux questions que se posent les débutants avant leur premier cours de surf.', h1: 'Questions fréquentes', crumb: 'Questions fréquentes',
      eyebrow: 'Vous vous demandez…', h1html: 'Les questions que <em>tout le monde</em> se pose', lead: 'Les réponses viennent d’Annelies, telles qu’elle les donne au téléphone. Si votre question n’est pas là, écrivez-nous — on répond avec plaisir.',
      cta1: 'Réserver un cours', cta2: 'Voir les tarifs',
      outro: 'Une autre question ? Écrivez-nous, on vous répond toujours.',
      faq: [
        { g: 'Avant de commencer', q: 'Faut-il savoir nager pour prendre un cours de surf ?', a: 'Pour les adultes, oui : il faut savoir nager. Pour les tout-petits, de 5 à 9 ans, ce n’est pas nécessaire — à cet âge nous restons dans la mousse près du bord et nous n’allons de toute façon pas en eau profonde.' },
        { g: 'Avant de commencer', q: 'À partir de quel âge les enfants peuvent-ils surfer ?', a: 'À partir de 5 ou 6 ans, selon l’envie de l’enfant de se lancer et selon son développement. Chaque enfant est différent.' },
        { g: 'Avant de commencer', q: 'Suis-je trop vieux pour apprendre à surfer ?', a: 'On n’est jamais trop vieux pour apprendre à surfer. Beaucoup de mes élèves commencent après 40 ou 50 ans et passent le meilleur moment de leur vie. Il ne faut pas hésiter : bien accompagné, on s’amuse énormément. L’idée n’est pas d’être le meilleur, elle est de prendre du plaisir — comme on dit, the best surfer is the one having the most fun. Surfeurs de 5 à 120 ans bienvenus.' },
        { g: 'Avant de commencer', q: 'Comment me préparer avant mes cours de surf ?', a: 'Plus vous êtes en forme, plus l’apprentissage est facile. Vous pouvez préparer vos cours en vous entraînant en salle avec un coach personnel, ou tout simplement en allant nager régulièrement avant votre séjour.' },
        { g: 'Votre cours', q: 'Combien de cours faut-il pour tenir debout sur une vague ?', a: 'Nous conseillons au minimum 3 cours pour se lever régulièrement dans la mousse, et un stage de 5 jours si vous voulez vraiment maîtriser — avec, en fin de stage, la possibilité de surfer votre première vague non déferlée.' },
        { g: 'Votre cours', q: 'Que faut-il apporter à un cours de surf ?', a: 'Votre maillot de bain, de la crème solaire, de l’eau et vos good vibes. La planche et la combinaison sont fournies.' },
        { g: 'Votre cours', q: 'Que se passe-t-il s’il fait mauvais ou si la mer est trop agitée ?', a: 'Par mauvais temps les cours ont lieu : de toute façon on est mouillé, et la pluie n’est pas un problème. En revanche, si les vagues sont trop grosses — drapeau rouge — le cours est reporté, et remboursé si aucun report n’est possible.' },
        { g: 'Où et quand surfer', q: 'Quelle est la meilleure période pour apprendre à surfer dans les Landes ?', a: 'Les mois d’été sont les plus chauds, avec de petites vagues sympas et une eau agréable. Mai, juin et septembre sont eux aussi très bons. En avril et en novembre on peut tout à fait surfer, mais l’eau est plus fraîche et les températures sont moins prévisibles.' },
        { g: 'Où et quand surfer', q: 'Quand l’école est-elle ouverte ?', a: 'Nous donnons des cours d’avril à novembre, tous les jours de la semaine. Les horaires dépendent de la marée, des conditions de l’océan et de votre niveau : ils sont convenus avec vous au moment de la réservation.' },
        { g: 'Où et quand surfer', q: 'Pourquoi Les Bourdaines, à Seignosse, convient-elle si bien aux débutants ?', a: 'Les Bourdaines est une plage au banc de sable doux, avec de longues vagues de mousse — exactement ce qu’il faut pour apprendre à surfer en toute sécurité. Pour vos premières vagues, vous n’allez pas plus loin que la hauteur des hanches, et il n’y a aucun rocher. C’est aussi une excellente plage pour les surfeurs confirmés : il y en a pour tous les niveaux.' },
        { g: 'Où et quand surfer', q: 'Quelle différence entre Hossegor et Seignosse quand on débute ?', a: 'Seignosse compte davantage de plages, on y a donc souvent plus de place pour surfer. Hossegor est excellent les jours où les vagues sont trop grosses à Seignosse : une de ses plages reçoit alors des vagues plus petites, et ces jours-là nous donnons rendez-vous à Hossegor. C’est tout l’avantage d’être une école de surf mobile.' },
      ],
    },
    legal: {
      title: 'Mentions légales — Coco Surf School', desc: 'Mentions légales du site coco-surfschool.com : éditeur, SIRET, hébergeur et conditions d’utilisation.', h1: 'Mentions légales', crumb: 'Mentions légales',
      eyebrow: 'Informations légales', h1html: 'Mentions <em>légales</em>', lead: 'Qui édite ce site, et comment nous joindre.',
      idTitle: 'Éditeur du site',
      rowLabels: { publisher: 'Éditeur', status: 'Forme juridique', address: 'Adresse', siret: 'SIRET', ape: 'Code APE / NAF', vat: 'TVA', registered: 'Immatriculation', director: 'Directrice de la publication', phone: 'Téléphone', email: 'Email', host: 'Hébergeur' },
      statusText: 'Entreprise individuelle — auto-entrepreneur, profession libérale',
      apeText: 'Enseignement de disciplines sportives et d’activités de loisirs',
      vatText: 'TVA non applicable, article 293 B du Code général des impôts',
      body: `<h2>Activité réglementée</h2>
<p>L’enseignement du surf contre rémunération est une activité réglementée en France. Annelies Debo exerce sous carte professionnelle d’éducateur sportif (surf) et détient le PSE1, ainsi qu’un master en éducation physique et une qualification ISA de coach de surf. Le détail figure sur la page <a href="{coach}">Coach</a>.</p>
<h2>Propriété intellectuelle</h2>
<p>L’ensemble du contenu de ce site — textes, photographies, logo et éléments graphiques — appartient à Coco Surf School, sauf mention contraire. Toute reproduction ou réutilisation, totale ou partielle, sans autorisation écrite préalable est interdite.</p>
<h2>Données personnelles</h2>
<p>Les données que vous nous transmettez via le formulaire de contact sont traitées comme décrit dans notre <a href="{privacy}">politique de confidentialité</a>.</p>
<h2>Réclamations</h2>
<p>En cas de difficulté, écrivez-nous d’abord : nous cherchons toujours une solution à l’amiable. Vous pouvez nous joindre par email ou par téléphone via la page <a href="{contact}">Contact</a>.</p>
<h2>Crédits</h2>
<p>Horaires de marée : Stormglass. Conditions météo et houle : Open-Meteo. Photographies : Coco Surf School.</p>`,
      updated: 'Dernière mise à jour : 21 août 2026.',
    },
    privacy: {
      title: 'Politique de confidentialité — Coco Surf School', desc: 'Ce que devient votre message : données collectées, durée de conservation, prestataires et vos droits. Ce site ne dépose aucun cookie.', h1: 'Politique de confidentialité', crumb: 'Confidentialité',
      eyebrow: 'Vos données', h1html: 'Politique de <em>confidentialité</em>', lead: 'Ce site ne dépose aucun cookie et ne vous suit pas. Voici, en clair, ce qu’il advient de ce que vous nous écrivez.',
      body: `<h2>Qui est responsable de vos données ?</h2>
<p>Annelies Debo, sous l’enseigne Coco Surf School, 47 E avenue de la Marquèze, 40510 Seignosse, France. Pour toute question : <a href="mailto:cocobosurfschool@gmail.com">cocobosurfschool@gmail.com</a>. Les mentions complètes figurent sur la page <a href="{legal}">Mentions légales</a>.</p>
<h2>Quelles données collectons-nous ?</h2>
<p>Uniquement ce que vous écrivez vous-même dans le formulaire de contact : votre nom, votre adresse email et votre message. Rien d’autre. Il n’y a sur ce site ni compte, ni profil, ni suivi publicitaire.</p>
<h2>Pourquoi, et sur quelle base légale ?</h2>
<ul class="ticks">
<li><strong>Pour répondre à votre demande</strong> et préparer votre réservation — base légale : les mesures précontractuelles prises à votre demande (RGPD art. 6.1.b).</li>
<li><strong>Pour vous envoyer occasionnellement des nouvelles de l’école</strong>, comme de nouvelles dates ou une offre — uniquement si vous avez coché la case prévue à cet effet. Base légale : votre consentement (RGPD art. 6.1.a). Vous pouvez le retirer à tout moment, simplement en répondant à l’un de nos emails.</li>
</ul>
<h2>Combien de temps les conservons-nous ?</h2>
<p><strong>Deux ans</strong> à compter de notre dernier échange. Passé ce délai, votre message et vos coordonnées sont supprimés. Si vous vous êtes inscrit à nos nouvelles, nous conservons votre adresse tant que vous ne vous désinscrivez pas.</p>
<h2>Qui d’autre y a accès ?</h2>
<p>Deux prestataires techniques, et personne d’autre. Vos données ne sont ni vendues, ni louées, ni échangées.</p>
<ul class="ticks">
<li><strong>Resend</strong> achemine le message du formulaire jusqu’à notre boîte mail. Ce prestataire est établi aux États-Unis ; le transfert est encadré par les clauses contractuelles types de la Commission européenne.</li>
<li><strong>Cloudflare</strong> héberge le site et en assure la diffusion. Votre adresse IP est traitée par Cloudflare pour la sécurité du site et la protection contre les abus.</li>
</ul>
<h2>Le surf report de la page d’accueil</h2>
<p>La page d’accueil affiche les conditions du jour aux Bourdaines. Ces données sont demandées par votre navigateur directement à <strong>Open-Meteo</strong>, ce qui transmet votre adresse IP à ce service. Open-Meteo ne dépose aucun cookie et ne constitue pas de profil de visiteur. Les horaires de marée, eux, sont préchargés sur notre propre serveur et n’entraînent aucun appel extérieur.</p>
<h2>Cookies</h2>
<p>Ce site ne dépose <strong>aucun cookie</strong>, n’utilise aucun stockage local et n’intègre ni outil de mesure d’audience, ni pixel publicitaire, ni contenu tiers embarqué. C’est la raison pour laquelle aucune bannière de consentement ne vous est présentée.</p>
<h2>Vos droits</h2>
<p>Vous disposez d’un droit d’accès, de rectification, d’effacement, de limitation, d’opposition et de portabilité, ainsi que du droit de retirer votre consentement à tout moment. Écrivez-nous à <a href="mailto:cocobosurfschool@gmail.com">cocobosurfschool@gmail.com</a> : nous répondons dans un délai d’un mois.</p>
<p>Si notre réponse ne vous satisfait pas, vous pouvez adresser une réclamation à la CNIL, 3 place de Fontenoy, TSA 80715, 75334 Paris Cedex 07 — <a href="https://www.cnil.fr" target="_blank" rel="noopener">cnil.fr</a>.</p>`,
      updated: 'Dernière mise à jour : 21 août 2026.',
    },
    book: {
      title: 'Réserver un cours de surf — Coco Surf School', desc: 'Réservez votre cours de surf en ligne chez Coco Surf School : choisissez une session, votre nombre de personnes et votre formule.', h1: 'Réserver un cours', crumb: 'Réserver',
      eyebrow: 'Réservation en ligne', h1html: 'Réservez votre <em>cours de surf</em>', lead: 'Choisissez une session ci-dessous, puis complétez vos coordonnées. Un acompte de 30 % est demandé pour confirmer votre réservation.',
      fSessionH: 'Choisissez une session', fParty: 'Nombre de personnes', fPack: 'Nombre de cours', fName: 'Nom complet', fEmail: 'Email', fPhone: 'Téléphone', fLang: 'Langue préférée',
      fConsent: 'J’accepte de recevoir des informations sur mes cours et offres par email', fRemarks: 'Remarques (facultatif)', fSubmit: 'Réserver', fSending: 'Envoi…',
      fOk: 'Merci ! Votre réservation est enregistrée.', fErr: 'Une erreur est survenue. Merci de réessayer ou de nous contacter directement.', fEmpty: 'Aucune session disponible pour le moment.',
      deposit: 'Un acompte de 30 % est demandé à la réservation. Paiement par virement bancaire ou en espèces.',
    },
  },
};
