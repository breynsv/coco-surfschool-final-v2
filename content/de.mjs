// Coco Surf School — design-06 multipage — DEUTSCH content (machine-translated, needs native proofreading)
const CARDS = [
  { img: 'real-deluxe-group.jpg', alt: 'Eine kleine Gruppe Surfer am Strand', title: 'Deluxe-Gruppenkurs', from: 'ab 44 €', p: 'Ein Kurs mit 2 bis max. 6 Personen pro Coach: die Formel zwischen Gruppe und Privat, um schneller Fortschritte zu machen. Mehr Zeit mit dem Coach.', chips: ['Kleine Gruppe · max. 6', '±2 Std. gesamt', 'Material inklusive'] },
  { img: 'real-lesson-kids.jpg', alt: 'Schüler lernen surfen im Weißwasser', title: 'Gruppenkurs', from: 'ab 38 €', p: 'Ein hochwertiger Kurs mit 7 bis max. 8 Personen und einem Coach. Gute Stimmung und Spaß inklusive.', chips: ['Größte Gruppe · 7–8', '±2 Std. gesamt', 'Material inklusive'] },
  { img: 'lesson-prive.jpg', alt: 'Eine Surferin auf einer schönen grünen Welle', title: 'Privatkurs', from: 'ab 130 €', p: 'Ein Kurs nur für dich, zu zweit, mit der Familie oder mit Freunden. Ein Coach, der sich voll auf deinen Fortschritt konzentriert.', chips: ['Deine eigene Gruppe · 1–7', '±2 Std. gesamt', 'Maßgeschneidert'] },
  { img: 'lesson-team.jpg', alt: 'Kollegen gehen mit ihren Boards zum Ozean', title: 'Firmen &amp; Teambuilding', from: 'auf Anfrage', p: 'Ein sportlicher Ausflug mit den Kollegen! Teamgeist, Stressabbau, Lächeln und Spaß garantiert.', chips: ['Auf Anfrage', 'Zusammenhalt'] },
];
export default {
  waText: 'Hallo Coco Surf School, ich möchte gerne einen Surfkurs buchen.',
  ui: {
    nav: { lessons: 'Kurse &amp; Preise', coach: 'Coach', stay: 'Unterkunft', rental: 'Verleih', contact: 'Kontakt', learn: 'Surfen lernen', faq: 'Häufige Fragen', legal: 'Impressum', privacy: 'Datenschutz' },
    navLabel: 'Hauptnavigation', book: 'Buchen', langLabel: 'Sprachauswahl', menuOpen: 'Menü öffnen',
    crumbHome: 'Start', footTagline: 'Surfschule in Seignosse &amp; Hossegor. Qualität vor Quantität — Kurse in kleinen Gruppen mit Annelies.', footNav: 'Entdecken', langWord: 'Sprache',
  },
  pages: {
    home: {
      title: 'Coco Surf School — Surfen lernen in Hossegor &amp; Seignosse',
      desc: 'Surfschule in Seignosse &amp; Hossegor, Frankreich. Kurse in kleinen Gruppen von max. 6 Personen, ruhig und individuell, Board und Neoprenanzug inklusive.',
      jsonld: { '@context': 'https://schema.org', '@type': 'SportsActivityLocation', name: 'Coco Surf School', description: 'Surfschule in Seignosse und Hossegor (Landes, Frankreich), Kurse in kleinen Gruppen von maximal 6 Personen.', url: 'https://www.coco-surfschool.com/de/', telephone: '+33647454265', email: 'cocobosurfschool@gmail.com', priceRange: '€40–€310', areaServed: ['Seignosse', 'Hossegor', 'Capbreton', 'Les Landes'], address: { '@type': 'PostalAddress', addressLocality: 'Seignosse', addressRegion: 'Landes', postalCode: '40510', addressCountry: 'FR' } },
      hero: { eyebrow: 'Mobile Surfschule · Landes, Frankreich', h1: 'Deine Surfschule in <em>Seignosse, Hossegor &amp; Capbreton</em>', lead: 'Kurse, Camps und Coaching für jedes Alter, von Kindern bis Erwachsenen — vom Anfänger bis zum Fortgeschrittenen, in der kleinen Gruppe, privat oder im Gruppenkurs. Begleitet von diplomierten Coaches, Board und Neoprenanzug inklusive. Willst du das Surfen wirklich lernen? Buch ein 5-Tage-Surfcamp!', cta1: 'Kurs buchen', cta2: 'Preise ansehen', cta3: 'Surfcamp buchen', facts: [{ b: '6', s: 'max. / Gruppe' }, { b: '±2 Std.', s: 'pro Kurs (1,5 Std. im Wasser)' }, { b: '5 Tage', s: 'Camp · 5 × 2 Std.' }, { b: '38 €', s: 'ab, pro Person' }], imgAlt: 'Schüler der Coco Surf School blicken auf den Ozean bei Seignosse', badge1: 'Surfcamps', badge2: 'kleine Gruppe · privat oder Gruppe' },
      trust: [{ ic: '👥', b: 'Kleine Gruppen', s: 'Max. 6 im Deluxe-Kurs · größere Gruppe möglich' }, { ic: '🏄‍♀️', b: 'Diplomierte Coaches', s: 'ISA- &amp; FR-zertifizierte Coaches' }, { ic: '🩱', b: 'Material inklusive', s: 'Board &amp; Neoprenanzug gestellt' }, { ic: '📍', b: 'Mobile Schule', s: 'Der beste Spot für dein Niveau' }],
      philosophy: { eyebrow: 'Unsere Philosophie', title: 'Eine kleine Schule, die sich Zeit nimmt, es richtig zu machen', lead: 'Qualität vor Quantität. Kleine Gruppen, erfahrene Coaches, die ihre Leidenschaft gerne mit dir teilen, und viel Zeit im Wasser — damit du schneller Fortschritte machst und mehr Spaß hast. Good Vibes garantiert!', points: [{ h: 'Qualität vor Quantität', p: 'Maximal 6 pro Gruppe im Deluxe-Kurs, für mehr Coaching und schnelleren Fortschritt. Größere Gruppe möglich.' }, { h: 'Fortschritt in toller Stimmung', p: 'Surfen lernen soll Spaß machen — gute Laune garantiert, von deiner ersten Welle bis zur ersten grünen Welle.' }, { h: 'Der richtige Spot, jeden Tag', p: 'Mobile Schule zwischen Seignosse, Hossegor und Capbreton: Wir wählen den besten Spot so nah wie möglich bei dir.' }] },
      surfReport: { eyebrow: 'Live · Les Bourdaines, Seignosse', title: 'Surf-Report', today: 'Heute', tomorrow: 'Morgen', air: 'Luft', wave: 'Welle', water: 'Wasser', wind: 'Wind', uv: 'UV', tide: 'Gezeiten', high: 'Hoch', low: 'Niedrig', sunrise: 'Auf', sunset: 'Unter', unavailable: 'Bedingungen derzeit nicht verfügbar.' },
      lessonsT: { eyebrow: 'Die Formeln', title: 'Wähle den Kurs, der zu dir passt', lead: 'Alle Kurse dauern 1,5 Std. im Wasser — rechne mit ±2 Std. gesamt (An-/Abfahrt und Umziehen). Board und Neoprenanzug inklusive. Die Kurszeiten hängen von den Gezeiten, den Ozeanbedingungen und deinem Niveau ab.', cards: CARDS, more: 'Alle Kurse &amp; Preise ansehen' },
      spots: { eyebrow: 'Wo wir surfen', title: 'Zwei der schönsten Spots der Landes', lead: 'Eine mobile Schule zwischen Seignosse, Hossegor und Capbreton — wir wählen den besten Spot je nach deinem Niveau und den Bedingungen des Tages.', hossegor: { alt: 'Die Surfstrände von Hossegor', h: 'Surfen in Hossegor', p: 'Bekannte Beach Breaks, eine Surfstadt und Kurse für jedes Niveau.' }, seignosse: { alt: 'Der Strand Les Bourdaines in Seignosse', h: 'Surfen in Seignosse', p: 'Unser Sommercamp an Les Bourdaines — sanfte Wellen, perfekt zum Einsteigen.' } },
      reviews: { eyebrow: 'Bewertungen', title: 'Das sagen Surfer', sub: '5,0 · Google-Bewertungen', cta: 'Auf Google ansehen' },
      coachT: { alt: 'Annelies, Coach der Coco Surf School, auf einer Welle', eyebrow: 'Deine Coach', title: 'Annelies, alias „Bo“', quote: '„Surfen ist eine der schönsten Entdeckungen meines Lebens.“', p: 'Diplomierte Surflehrerin (ISA &amp; FR), Sportlehrerin und schon immer sportlich. Nach zehn Jahren Reisen und Surfen ließ sich Annelies in Seignosse nieder, um eine ruhige Surfschule auf menschlichem Maß zu eröffnen. Fortschritte machen in toller Stimmung — gute Laune garantiert!', cta: 'Annelies kennenlernen' },
      cta: { h: 'Lust, mit uns zu surfen?', p: 'Kleine Gruppen, alle Niveaus, Board &amp; Neoprenanzug inklusive. Schreib uns — wir antworten dir gerne.', b1: 'Kurs buchen', b2: 'Schreib uns auf WhatsApp' },
    },
    lessons: {
      title: 'Surfkurse &amp; Preise — Coco Surf School Hossegor &amp; Seignosse', desc: 'Surfkurse in den Landes: Deluxe-Gruppe (max. 6) ab 44 €, Gruppe ab 38 €, Privat ab 130 €. Board &amp; Neoprenanzug inklusive, 1,5 Std.', h1: 'Surfkurse', crumb: 'Kurse &amp; Preise',
      eyebrow: 'Die Formeln &amp; Preise', h1html: 'Wähle den Kurs, der zu dir <em>passt</em>', lead: 'Alle Kurse dauern 1,5 Std. im Wasser — rechne mit ±2 Std. gesamt (An-/Abfahrt und Umziehen). Board und Neoprenanzug inklusive. Die Kurszeiten hängen von den Gezeiten, den Ozeanbedingungen und deinem Niveau ab.', cta1: 'Kurs buchen', cta2: 'Schreib uns auf WhatsApp',
      cards: CARDS, note: '<strong>Gut zu wissen —</strong> Board und Neoprenanzug sind immer inklusive. Dauer: 1,5 Std. pro Session — rechne mit ±2 Std. gesamt (An-/Abfahrt und Umziehen).',
      rates: { eyebrow: 'Preise', title: 'Klare Preise, alles inklusive', lead: 'Board und Neoprenanzug inklusive · ±2 Std. pro Kurs (1,5 Std. im Wasser) · „p.P.“ = pro Person.', cards: [
        { featured: true, h: 'Deluxe-Gruppe', flag: 'Am beliebtesten', sub: 'Ein Coach für max. 6 Personen (min. 2).', lines: [['1 Kurs', '52 € p.P.'], ['Kleiner Surftrip (3 Kurse)', '138 € p.P.'], ['5-Tage-Camp (5 Kurse)', '220 € p.P.'], ['Familienrabatt (3 Anmeldungen)', '215 € p.P.']], incl: '2 oder 4 Kurse ebenfalls möglich · Board &amp; Neoprenanzug inklusive · ±2 Std. (1,5 Std. im Wasser)' },
        { h: 'Gruppe', sub: 'Größere Gruppen — ein Coach für max. 8 (min. 3, um einen Kurs zu starten).', lines: [['1 Kurs', '40 € p.P.'], ['Kleiner Surftrip (3 Kurse)', '115 € p.P.'], ['5-Tage-Camp (5 Kurse)', '180 € p.P.']], incl: '2 oder 4 Kurse ebenfalls möglich · Board &amp; Neoprenanzug inklusive · ±2 Std. (1,5 Std. im Wasser)' },
        { h: 'Privatkurse', sub: 'Board &amp; Neoprenanzug inklusive · ±2 Std. gesamt (~1,25 Std. Coaching im Wasser).', lines: [['1 Person', '130 € <small>Juli–Aug.: 180 €</small>'], ['2 Personen', '170 € <small>Juli–Aug.: 220 €</small>'], ['3 Personen', '240 € <small>Juli–Aug.: 260 €</small>'], ['4 Personen', '290 €'], ['5 bis 7 Personen', '310 €']], incl: 'Ein Privatcoach nur für dich' },
      ], extra: [{ h: 'Surf-Guiding', p: 'Entdecke andere Strände von Seignosse, Hossegor oder Capbreton — rechne mit 5 bis 6 Std. (2 Surfsessions). Preise auf Anfrage.' }, { h: 'Reservierung &amp; Zahlung', p: 'Bei der Reservierung wird eine Anzahlung von 30 % verlangt. Zahlung per Überweisung oder bar.' }] },
    },
    coach: {
      title: 'Deine Coach Annelies — Coco Surf School Hossegor', desc: 'Lerne Annelies („Bo“) kennen, diplomierte Surflehrerin (ISA &amp; FR) und Gründerin der Coco Surf School in Hossegor/Seignosse.', h1: 'Deine Coach', crumb: 'Coach', imgAlt: 'Annelies, Coach und Gründerin der Coco Surf School', eyebrow: 'Deine Coach',
      quote: '„Surfen ist so eine wunderbare Entdeckung; Sport und Coaching sind ein großer Teil meines Lebens.“',
      body: ['Deine Surfcoach. Annelies ist in Belgien geboren und aufgewachsen; von klein auf liebt sie Sport und erreicht ein gutes Niveau im Trampolinturnen. Das Surfen entdeckt sie mit 16 während einer Familienreise in Soustons — und ist sofort süchtig!', 'Nach ihrem Master in Leibeserziehung (KU Leuven) folgt sie ihrem Traum: Surfen, Wettkampf-Snowboarden und Arbeiten im Ausland: Australien, Neuseeland, USA, Indonesien, Sri Lanka, Fidschi, Marokko… „Nach meinem Leben als Wettkämpferin war es so logisch, Sport-, Surf- und Snowboardlehrerin zu werden.“', 'Nach 10 Jahren Reisen fehlte ihr der Ozean zu sehr und sie ließ sich in Seignosse nieder. „Ich bin dankbar, dass ich einige Jahre für den Surfclub von Hossegor arbeiten durfte; jetzt freue ich mich sehr, euch in meiner eigenen kleinen Schule willkommen zu heißen. Coco Surf School setzt auf Qualität statt Quantität. Deshalb bieten wir die Deluxe-Formel: Kurse in kleinen Gruppen von maximal 6 Personen pro Lehrer.“'],
      dipTitle: 'Diplome &amp; Zertifikate', diplomas: [['2000', 'Initiator Snowboard (VSSF)'], ['2003', 'Master Leibeserziehung, KU Leuven'], ['2003', 'Lehrdiplom, KU Leuven'], ['2003', 'Trainer A Fitness &amp; Personal Trainer, VTS'], ['2006', 'Level 2 Snowboard, ASI (US)'], ['2009', 'Level 1 ISA Surf Coach &amp; Lifeguard'], ['2013', 'Carte professionnelle Éducateur Sportif Surf (FR)'], ['2020', 'International Surf Judge, ISA'], ['2021', 'PSE1 Erste Hilfe, Hossegor']], cta: 'Kurs bei Annelies buchen',
    },
    stay: {
      title: 'Wo übernachten — Unterkünfte nahe der Coco Surf School, Seignosse', desc: 'Adressen zum Übernachten nahe der Coco Surf School in Seignosse &amp; Hossegor: Maison Irene, Villa &amp; Maison de la Dune, Board &amp; Breakfast und Campingplätze.', h1: 'Wo übernachten', crumb: 'Unterkunft',
      eyebrow: 'Wo übernachten', h1html: 'Unterkünfte ganz <em>in der Nähe</em> der Schule', lead: 'Einige vertrauenswürdige Adressen, um dein Gepäck einen Steinwurf vom Ozean entfernt abzustellen.',
      cards: [
        { pin: 'Seignosse · Les Bourdaines', h: 'Maison Irene', p: '8 Personen, 3 Schlafzimmer + Schlafsofa, 2 Badezimmer, große Terrasse mit Jacuzzi. 100 m vom Strand und der Surfschule. Airbnb-Inserat verfügbar.', href: 'mailto:tudela_sire@hotmail.com', link: 'Irene kontaktieren' },
        { pin: 'Seignosse', h: 'Villa de la Dune', p: 'Geräumige Ferienvilla in Seignosse, nur einen Steinwurf von den Stränden und der Schule entfernt.', href: 'https://villadeladune-seignosse.fr', link: 'villadeladune-seignosse.fr' },
        { pin: 'Seignosse', h: 'Maison de la Dune', p: 'Stimmungsvolles Ferienhaus in Seignosse, nahe den Spots und dem Zentrum.', href: 'https://maisondeladune-seignosse.fr', link: 'maisondeladune-seignosse.fr' },
        { pin: 'Labenne Océan', h: 'Board &amp; Breakfast', p: 'Gastgeber Anton empfängt dich in seinem schönen Haus mit Pool — komplett mietbar für bis zu 20 Personen oder Gästezimmer im Surfcamp-Stil.', href: 'https://boardnbreakfast.com', link: 'boardnbreakfast.com' },
        { pin: 'Seignosse', h: 'Campingplätze', p: 'Mehrere Campingplätze in der Nähe, ideal im Sommer: Natureo, Les Maritimes und Les Oyats.', href: 'https://seignosse-tourisme.com', link: 'Campingplätze ansehen' },
        { pin: 'Tourismusbüro Seignosse', h: 'Weitere Optionen', p: 'Finde weitere Unterkünfte und Tipps über das Tourismusbüro von Seignosse.', href: 'https://seignosse-tourisme.com', link: 'seignosse-tourisme.com' },
      ],
    },
    rental: {
      title: 'Verleih — Surfbretter &amp; Neoprenanzüge | Coco Surf School', desc: 'Leih ein Surfbrett oder einen Neoprenanzug bei Coco Surf School in Seignosse &amp; Hossegor — von 2 Stunden bis eine Woche.', h1: 'Verleih', crumb: 'Verleih',
      eyebrow: 'Verleih', h1html: 'Material <em>leihen</em>', lead: 'Leih dein Surfbrett oder deinen Neoprenanzug bei uns — von 2 Stunden bis zu einer ganzen Woche. Abholung vor Ort.',
      board: 'Surf (nur Brett)', wetsuit: 'Neoprenanzug',
      cols1: ['Tarif', '2 Std.', '½ Tag', '1 Tag', '2 Tage'], cols2: ['Tarif', '3 Tage', '4 Tage', '5 Tage', '6 Tage', '1 Woche'],
      rows1: { board: ['15 €', '20 €', '30 €', '50 €'], wetsuit: ['10 €', '10 €', '15 €', '25 €'] },
      rows2: { board: ['70 €', '80 €', '90 €', '100 €', '110 €'], wetsuit: ['35 €', '45 €', '55 €', '65 €', '70 €'] },
      note: '<strong>Gut zu wissen —</strong> Verleih vor Ort. Frag einfach bei deiner Buchung oder per WhatsApp.', cta: 'Material reservieren',
    },
    contact: {
      title: 'Kontakt &amp; Reservierung — Coco Surf School Hossegor &amp; Seignosse', desc: 'Buche deinen Surfkurs bei Coco Surf School. Telefon +33 6 47 45 42 65, E-Mail cocobosurfschool@gmail.com. 30 % Anzahlung.', h1: 'Kontakt', crumb: 'Kontakt',
      eyebrow: 'Kontakt', lead: 'Die Schule empfängt dich in Seignosse, Hossegor und Capbreton. Schreib uns, um deinen Kurs zu buchen oder eine Frage zu stellen — wir antworten dir gerne.',
      phone: 'Telefon', where: 'Wo', deposit: 'Bei der Reservierung wird eine Anzahlung von 30 % verlangt. Zahlung per Überweisung oder bar.', fName: 'Name', fEmail: 'E-Mail', fMsg: 'Nachricht', fPlaceholder: 'Welcher Kurs interessiert dich? Mit wie vielen Personen? Welche Daten?', send: 'Senden', fSending: 'Senden…', fOk: 'Danke! Wir melden uns bald bei dir.', fErr: 'Etwas ist schiefgelaufen. Schreib uns direkt an cocobosurfschool@gmail.com.', faqTitle: 'Häufige Fragen',
      fConsent: 'Ich möchte gelegentlich Neuigkeiten der Surfschule erhalten (neue Termine, Angebote). Optional.',
      fPrivacy: 'Name, E-Mail und Nachricht nutzen wir zur Beantwortung deiner Anfrage und speichern sie zwei Jahre. Mehr dazu:',
      faqMore: 'Alle häufigen Fragen ansehen',
      h1: 'Komm surfen mit Coco Surf School',
      faq: [
        { q: 'Wo finden die Surfkurse statt?', a: 'Coco Surf School ist eine mobile Schule zwischen Hossegor und Seignosse: Der beste Spot für dein Niveau wird je nach Bedingungen gewählt. Im Sommer ist die Schule in Seignosse, Les Bourdaines.' },
        { q: 'Mit wie vielen Personen findet ein Kurs statt?', a: 'Qualität vor Quantität: maximal 6 Personen pro Coach (8 auf Anfrage), für mehr Coaching und schnelleren Fortschritt.' },
        { q: 'Ist das Material inklusive?', a: 'Ja, Board und Neoprenanzug sind in jedem Kurs inklusive. Jeder Kurs dauert 1,5 Std.' },
        { q: 'Wie reserviere und zahle ich?', a: 'Bei der Reservierung wird eine Anzahlung von 30 % verlangt. Die Zahlung erfolgt per Überweisung oder bar.' },
        { q: 'Muss ich schon surfen können?', a: 'Nein. Annelies empfängt sowohl Anfänger als auch Surfer, die sich verbessern möchten.' },
      ],
    },
    hossegor: {
      title: 'Surfkurse in Hossegor — Coco Surf School | Alle Niveaus', desc: 'Surfkurse in Hossegor mit Coco Surf School. Kleine Gruppen (max. 6), Board &amp; Neoprenanzug inklusive, diplomierte Coaches.', h1: 'Surfkurse in Hossegor', crumb: 'Surfen in Hossegor', ogImage: 'owner-hossegor.jpg',
      eyebrow: 'Landes · Frankreich', h1html: 'Surfkurse in <em>Hossegor</em>', lead: 'Komm mit uns in Hossegor surfen! Lerne surfen in einer der bekanntesten Surfstädte Europas. Kleine Gruppen von maximal 6 in der Deluxe-Formel, Board und Neoprenanzug inklusive, mit diplomierten Coaches.', cta1: 'Kurs buchen', cta2: 'Preise ansehen', img: 'owner-hossegor.jpg', imgAlt: 'Surfer an einem Strand von Hossegor',
      body: '<p class="lead">Hossegor ist das pulsierende Herz des Surfens in den Landes, eine europäische Referenz für Beach Breaks. Coco Surf School ist eine mobile Schule zwischen Hossegor und Seignosse: Wir wählen den besten Spot je nach deinem Niveau und den Bedingungen des Tages.</p><h2>Warum in Hossegor surfen lernen?</h2><ul class="ticks"><li>Atlantische Beach Breaks für jedes Niveau, vom sanften Weißwasser für Einsteiger bis zu kräftigeren Peaks.</li><li>Eine ganz auf Surfen ausgerichtete Stadt, ideal für einen Aufenthalt mit den Füßen im Wasser.</li><li>Breite Sandstrände einen Steinwurf vom Ozean entfernt.</li></ul><h2>Kurse für jedes Niveau</h2><p>Noch nie gesurft oder Lust, dich zu verbessern? Jede Session passt sich dir an. Die Kurse dauern 1,5 Std., Board und Neoprenanzug inklusive, in Gruppen von maximal 6 (8 auf Anfrage).</p><h2>Gut zu wissen</h2><p>Der beste Spot — Hossegor, Seignosse oder Capbreton — wird je nach Gezeiten und Wellenbedingungen gewählt. Im Sommer ist die Schule in Seignosse, Les Bourdaines.</p>',
      aside: { h: 'In Hossegor buchen', p: 'Kleine Gruppen · alle Niveaus · Material inklusive.', b1: 'Kurs buchen', b2: 'WhatsApp' },
    },
    seignosse: {
      title: 'Surfkurse in Seignosse — Coco Surf School | Les Bourdaines', desc: 'Surfkurse in Seignosse (Les Bourdaines) mit Coco Surf School. Sanfte Wellen zum Einsteigen, kleine Gruppen (max. 6), Material inklusive.', h1: 'Surfkurse in Seignosse', crumb: 'Surfen in Seignosse', ogImage: 'a29fce_571dd78100a24c038429f1bfaf22b936.jpg',
      eyebrow: 'Landes · Frankreich', h1html: 'Surfkurse in <em>Seignosse</em>', lead: 'Unser Sommercamp an Les Bourdaines: schöne, sanfte und sandige Beach Breaks, perfekt zum Lernen. Kleine Gruppen von maximal 6, Board und Neoprenanzug inklusive.', cta1: 'Kurs buchen', cta2: 'Preise ansehen', img: 'a29fce_571dd78100a24c038429f1bfaf22b936.jpg', imgAlt: 'Der Strand Les Bourdaines in Seignosse',
      body: '<p class="lead">Seignosse, direkt nördlich von Hossegor, bietet einige der einladendsten Strände der Landes. Im Sommer ist Coco Surf School an Les Bourdaines — ein breiter Sandstrand, an dem das Weißwasser ideal für deine ersten Wellen ist.</p><h2>Warum in Seignosse surfen lernen?</h2><ul class="ticks"><li>Sandige Beach Breaks an Les Bourdaines, sanft für Anfänger und Fortgeschrittene.</li><li>Eine ruhigere und natürlichere Umgebung als die Stadtstrände.</li><li>Das Sommercamp der Schule: Kurse leicht zu organisieren.</li></ul><h2>Kurse für jedes Niveau</h2><p>Von deinen ersten Wellen im Weißwasser bis zu deinen ersten Take-offs auf der grünen Welle passt sich jede Session dir an. Die Kurse dauern 1,5 Std., Board und Neoprenanzug inklusive, in kleinen Gruppen von maximal 6. Größere Gruppen sind natürlich auch möglich.</p><h2>Gut zu wissen</h2><p>Mobile Schule zwischen Seignosse, Hossegor und Capbreton: Wir wählen den besten Spot je nach deinem Niveau und den Bedingungen des Tages.</p>',
      aside: { h: 'In Seignosse buchen', p: 'Kleine Gruppen · alle Niveaus · Material inklusive.', b1: 'Kurs buchen', b2: 'WhatsApp' },
    },
    team: {
      title: 'Surf-Teambuilding in den Landes — Coco Surf School', desc: 'Surf-Teambuilding in Hossegor &amp; Seignosse. Ein Ausflug mit Kollegen: Teamgeist, Stressabbau und Lächeln garantiert. Preise auf Anfrage.', h1: 'Teambuilding', crumb: 'Teambuilding', ogImage: 'owner-team-new.jpg',
      eyebrow: 'Firmen · Landes', h1html: 'Surf-<em>Teambuilding</em>', lead: 'Geht surfen mit euren Kollegen! Teamgeist, Stressabbau, Lächeln und Spaß garantiert — ein sportlicher Tag im Ozean in Seignosse, Hossegor oder Capbreton.', cta1: 'Angebot anfragen', cta2: 'Preise ansehen', img: 'owner-team-new.jpg', imgAlt: 'Kollegen gehen mit ihren Boards zum Ozean',
      body: '<p class="lead">Lust auf eine andere Teamaktivität in den Landes? Nehmt euer Team mit zum Surfen. Eine gemeinsame Herausforderung im Ozean ist eine der schönsten Arten, Verbindung zu schaffen — und alle kommen mit einem Lächeln aus dem Wasser.</p><h2>Warum im Team surfen?</h2><ul class="ticks"><li><strong>Teamgeist</strong> — eine erste gemeinsame Erfahrung, bei der man sich gegenseitig anfeuert.</li><li><strong>Stressabbau</strong> — nichts befreit den Kopf so sehr wie der Ozean und die frische Luft.</li><li><strong>Für alle zugänglich</strong> — keine Erfahrung nötig, Spaß garantiert.</li></ul><h2>Wie es abläuft</h2><p>Die Sessions werden von Annelies, diplomierte Coach, begleitet, Board und Neoprenanzug inklusive. Wir können große Gruppen von bis zu 32 Personen gleichzeitig betreuen. Wir passen das Format an eure Gruppe an und wählen den besten Strand zwischen Seignosse, Hossegor und Capbreton. Preise auf Anfrage.</p>',
      aside: { h: 'Plant euren Tag', p: 'Sagt uns die Gruppengröße und eure Daten — maßgeschneidertes Angebot.', b1: 'Angebot anfragen', b2: 'WhatsApp' },
    },
    learn: {
      title: 'Surfen lernen — Anfängerkurse in Hossegor &amp; Seignosse', desc: 'Noch nie gesurft? Lerne surfen mit Coco Surf School. Wie dein erster Kurs abläuft, was inklusive ist und wie du Fortschritte machst.', h1: 'Surfen lernen', crumb: 'Surfen lernen', ogImage: 'a29fce_4b942950b2834ef2ad4e3191df3d547a.jpg',
      eyebrow: 'Für Anfänger', h1html: 'Surfen <em>lernen</em>', lead: 'Noch nie gesurft? Keine Sorge. Genau so läuft dein erster Kurs ab, das ist inklusive und so schnell machst du Fortschritte.', cta1: 'Deinen ersten Kurs buchen', cta2: 'Preise ansehen', img: 'a29fce_4b942950b2834ef2ad4e3191df3d547a.jpg', imgAlt: 'Schüler lernen surfen im Weißwasser',
      body: '<p class="lead">Surfen ist eines der schönsten Gefühle überhaupt — und du brauchst keine Erfahrung, um anzufangen. Bei Coco Surf School lernst du in einer kleinen Gruppe von maximal 6, damit dich der Coach ab deiner ersten Welle begleitet.</p><h2>Dein erster Kurs, Schritt für Schritt</h2><p>Ein Kurs dauert 1,5 Std. im Wasser — rechne mit ±2 Std. gesamt. Wir starten am Strand mit einem Aufwärmen und den Grundlagen — auf dem Board liegen, paddeln, aufstehen. Danach gehen wir ins Weißwasser (die bereits gebrochenen Wellen, nahe am Ufer), der sicherste und einfachste Ort für deine ersten Ritte. Die meisten Anfänger stehen schon in den ersten Kursen.</p><h2>Was inklusive ist</h2><ul class="ticks"><li>Board und Neoprenanzug — immer inklusive.</li><li>Eine diplomierte Coach, in einer Gruppe von maximal 6 (8 auf Anfrage).</li><li>Der für Anfänger am besten geeignete Strand, je nach den Bedingungen des Tages gewählt.</li></ul><h2>Was du mitbringst</h2><p>Eine Badehose/einen Badeanzug unter dem Neoprenanzug, ein Handtuch, Sonnencreme und Wasser. Um den Rest kümmern wir uns.</p><h2>Wie schnell macht man Fortschritte?</h2><p>Kleine Gruppen = mehr Coaching und schnellerer Fortschritt. Ein <strong>kleiner Surftrip (3 Kurse)</strong> oder ein <strong>5-Tage-Camp</strong> hilft dir wirklich, den Durchbruch zu schaffen.</p>',
      aside: { h: 'Dein erster Kurs', p: 'Kleine Gruppen · alle Niveaus · Material inklusive · 1,5 Std.', b1: 'Kurs buchen', b2: 'WhatsApp' },
    },
    faq: {
      title: 'Surfen lernen — häufige Fragen | Coco Surf School', desc: 'Muss man schwimmen können? Ab welchem Alter? Wie viele Kurse braucht man? Annelies beantwortet die Fragen, die Anfänger vor ihrer ersten Surfstunde stellen.', h1: 'Häufige Fragen', crumb: 'Häufige Fragen',
      eyebrow: 'Du fragst dich…', h1html: 'Die Fragen, die <em>alle</em> stellen', lead: 'Die Antworten kommen von Annelies selbst, so wie sie es am Telefon erklärt. Fehlt deine Frage? Schreib uns einfach.',
      cta1: 'Kurs buchen', cta2: 'Preise ansehen',
      outro: 'Noch eine Frage? Schreib uns — wir antworten immer.',
      faq: [
        { g: 'Bevor du anfängst', q: 'Muss man schwimmen können, um einen Surfkurs zu machen?', a: 'Als Erwachsener ja: Du solltest schwimmen können. Für ganz kleine Kinder von 5 bis 9 Jahren ist es nicht nötig — in dem Alter bleiben wir im Weißwasser nahe am Ufer und gehen ohnehin nie in tiefes Wasser.' },
        { g: 'Bevor du anfängst', q: 'Ab welchem Alter können Kinder mitmachen?', a: 'Ab etwa 5 oder 6 Jahren, je nachdem, wie gern das Kind mitmachen möchte und wie weit es entwickelt ist. Jedes Kind ist anders.' },
        { g: 'Bevor du anfängst', q: 'Bin ich zu alt, um noch surfen zu lernen?', a: 'Man ist nie zu alt, um surfen zu lernen. Viele meiner Schülerinnen und Schüler fangen nach 40 oder 50 an und erleben die schönste Zeit ihres Lebens. Also nicht zögern: mit guter Begleitung haben wir riesigen Spaß. Es geht nicht darum, der Beste zu sein, es geht ums Vergnügen — wie wir sagen: the best surfer is the one having the most fun. Surfer von 5 bis 120 Jahren sind willkommen.' },
        { g: 'Bevor du anfängst', q: 'Wie bereite ich mich auf meine Surfkurse vor?', a: 'Je fitter du bist, desto leichter fällt das Surfenlernen. Du kannst dich vorbereiten, indem du vorher im Fitnessstudio mit einem Personal Trainer trainierst oder einfach regelmäßig schwimmen gehst.' },
        { g: 'Dein Kurs', q: 'Wie viele Kurse braucht man, bis man auf einer Welle steht?', a: 'Wir empfehlen mindestens 3 Kurse, damit das Aufstehen im Weißwasser regelmäßig klappt, und einen 5-Tage-Kurs, wenn du es wirklich beherrschen willst — mit der Chance, am Ende des Kurses deine erste ungebrochene Welle zu surfen.' },
        { g: 'Dein Kurs', q: 'Was soll ich zum Surfkurs mitbringen?', a: 'Deine Badehose oder deinen Badeanzug, Sonnencreme, Wasser und deine good vibes. Board und Neoprenanzug bekommst du von uns.' },
        { g: 'Dein Kurs', q: 'Was passiert bei schlechtem Wetter oder zu rauer See?', a: 'Bei schlechtem Wetter finden die Kurse statt: nass wirst du sowieso, und Regen ist kein Problem. Sind die Wellen zu groß — rote Flagge —, wird der Kurs verschoben oder erstattet, falls kein Ersatztermin möglich ist.' },
        { g: 'Wo und wann', q: 'Wann ist die beste Zeit, um in den Landes surfen zu lernen?', a: 'Die Sommermonate sind die wärmsten, mit schönen kleinen Wellen und warmem Wasser. Auch Mai, Juni und September sind sehr gut. Im April und November kann man durchaus surfen, das Wasser ist dann aber kühler und die Temperaturen sind weniger verlässlich.' },
        { g: 'Wo und wann', q: 'Wann ist die Surfschule geöffnet?', a: 'Wir geben von April bis November Kurse, an jedem Tag der Woche. Die Uhrzeiten hängen von den Gezeiten, den Bedingungen im Meer und deinem Niveau ab — sie werden bei der Buchung mit dir abgesprochen.' },
        { g: 'Wo und wann', q: 'Warum ist Les Bourdaines in Seignosse so gut für Anfänger?', a: 'Les Bourdaines ist ein Strand mit einer sanften Sandbank und langen Weißwasserwellen — genau das, was man braucht, um sicher surfen zu lernen. Für deine ersten Wellen gehst du nicht tiefer als bis zur Hüfte, und es gibt keine Felsen. Auch für fortgeschrittene Surfer ist es ein hervorragender Strand: für jeden ist etwas dabei.' },
        { g: 'Wo und wann', q: 'Was ist der Unterschied zwischen Hossegor und Seignosse für Anfänger?', a: 'Seignosse hat mehr Strände, dort ist also oft mehr Platz zum Surfen. Hossegor ist ausgezeichnet an Tagen, an denen die Wellen in Seignosse zu groß sind: einer der Strände dort bekommt dann kleinere Wellen, und an solchen Tagen treffen wir uns in Hossegor. Das ist der Vorteil einer mobilen Surfschule.' },
      ],
    },
    legal: {
      title: 'Impressum — Coco Surf School', desc: 'Impressum von coco-surfschool.com: Herausgeberin, SIRET-Nummer, Hosting und Nutzungsbedingungen.', h1: 'Impressum', crumb: 'Impressum',
      eyebrow: 'Rechtliche Angaben', h1html: '<em>Impressum</em>', lead: 'Wer diese Website herausgibt und wie du uns erreichst.',
      idTitle: 'Herausgeberin der Website',
      rowLabels: { publisher: 'Herausgeberin', status: 'Rechtsform', address: 'Anschrift', siret: 'SIRET', ape: 'APE / NAF-Code', vat: 'Umsatzsteuer', registered: 'Eintragung', director: 'Verantwortlich für den Inhalt', phone: 'Telefon', email: 'E-Mail', host: 'Hosting' },
      statusText: 'Einzelunternehmen — auto-entrepreneur, freiberuflich (Frankreich)',
      apeText: 'Unterricht in Sport und Freizeitaktivitäten',
      vatText: 'Umsatzsteuer wird nicht ausgewiesen, Artikel 293 B des französischen Steuergesetzbuchs',
      body: `<h2>Reglementierte Tätigkeit</h2>
<p>Surfunterricht gegen Bezahlung ist in Frankreich eine reglementierte Tätigkeit. Annelies Debo arbeitet mit einer carte professionnelle d’éducateur sportif (Surf) und besitzt das Erste-Hilfe-Zertifikat PSE1 sowie einen Master in Sportwissenschaft und eine ISA-Qualifikation als Surfcoach. Die Details stehen auf der Seite <a href="{coach}">Coach</a>.</p>
<h2>Urheberrecht</h2>
<p>Alle Inhalte dieser Website — Texte, Fotos, Logo und grafische Elemente — gehören Coco Surf School, sofern nicht anders angegeben. Eine vollständige oder teilweise Vervielfältigung oder Weiterverwendung ohne vorherige schriftliche Zustimmung ist nicht gestattet.</p>
<h2>Personenbezogene Daten</h2>
<p>Was du uns über das Kontaktformular schickst, wird so verarbeitet, wie in unserer <a href="{privacy}">Datenschutzerklärung</a> beschrieben.</p>
<h2>Beschwerden</h2>
<p>Wenn etwas schiefläuft, schreib uns bitte zuerst — wir suchen immer eine gütliche Lösung. Du erreichst uns per E-Mail oder Telefon über die Seite <a href="{contact}">Kontakt</a>.</p>
<h2>Quellen</h2>
<p>Gezeiten: Stormglass. Wetter und Wellengang: Open-Meteo. Fotos: Coco Surf School.</p>`,
      updated: 'Zuletzt aktualisiert: 21. August 2026.',
    },
    privacy: {
      title: 'Datenschutzerklärung — Coco Surf School', desc: 'Was mit deiner Nachricht passiert: welche Daten wir erheben, wie lange wir sie speichern, welche Dienstleister beteiligt sind und welche Rechte du hast. Diese Website setzt keine Cookies.', h1: 'Datenschutzerklärung', crumb: 'Datenschutz',
      eyebrow: 'Deine Daten', h1html: '<em>Datenschutz</em>erklärung', lead: 'Diese Website setzt keine Cookies und verfolgt dich nicht. Hier steht in klarer Sprache, was mit dem passiert, was du uns schreibst.',
      body: `<h2>Wer ist für deine Daten verantwortlich?</h2>
<p>Annelies Debo, handelnd unter dem Namen Coco Surf School, 47 E avenue de la Marquèze, 40510 Seignosse, Frankreich. Fragen? <a href="mailto:cocobosurfschool@gmail.com">cocobosurfschool@gmail.com</a>. Die vollständigen Angaben stehen im <a href="{legal}">Impressum</a>.</p>
<h2>Welche Daten erheben wir?</h2>
<p>Nur das, was du selbst in das Kontaktformular einträgst: deinen Namen, deine E-Mail-Adresse und deine Nachricht. Sonst nichts. Es gibt auf dieser Website kein Konto, kein Profil und kein Werbe-Tracking.</p>
<h2>Wozu, und auf welcher Rechtsgrundlage?</h2>
<ul class="ticks">
<li><strong>Um deine Anfrage zu beantworten</strong> und deine Buchung vorzubereiten — Rechtsgrundlage: vorvertragliche Maßnahmen auf deine Anfrage hin (DSGVO Art. 6.1.b).</li>
<li><strong>Um dir gelegentlich Neuigkeiten der Surfschule zu schicken</strong>, etwa neue Termine oder ein Angebot — nur wenn du das entsprechende Kästchen angekreuzt hast. Rechtsgrundlage: deine Einwilligung (DSGVO Art. 6.1.a). Du kannst sie jederzeit widerrufen, indem du einfach auf eine unserer E-Mails antwortest.</li>
</ul>
<h2>Wie lange speichern wir sie?</h2>
<p><strong>Zwei Jahre</strong> nach unserem letzten Kontakt. Danach werden deine Nachricht und deine Daten gelöscht. Hast du dich für Neuigkeiten angemeldet, behalten wir deine Adresse, bis du dich abmeldest.</p>
<h2>Wer bekommt sie sonst noch zu sehen?</h2>
<p>Zwei technische Dienstleister, sonst niemand. Deine Daten werden weder verkauft noch vermietet oder getauscht.</p>
<ul class="ticks">
<li><strong>Resend</strong> stellt die Formularnachricht in unser Postfach zu. Der Anbieter sitzt in den USA; die Übermittlung stützt sich auf die Standardvertragsklauseln der Europäischen Kommission.</li>
<li><strong>Cloudflare</strong> hostet die Website und liefert sie aus. Cloudflare verarbeitet deine IP-Adresse zur Sicherheit der Website und zum Schutz vor Missbrauch.</li>
</ul>
<h2>Der Surfreport auf der Startseite</h2>
<p>Die Startseite zeigt die Bedingungen des Tages an Les Bourdaines. Diese Daten ruft dein Browser direkt bei <strong>Open-Meteo</strong> ab, wodurch deine IP-Adresse an diesen Dienst gelangt. Open-Meteo setzt keine Cookies und legt kein Besucherprofil an. Die Gezeitenzeiten liegen dagegen auf unserem eigenen Server bereit und erfordern keinerlei externen Aufruf.</p>
<h2>Cookies</h2>
<p>Diese Website setzt <strong>keine Cookies</strong>, verwendet keinen lokalen Speicher und bindet weder Analysewerkzeuge noch Werbepixel oder Inhalte Dritter ein. Deshalb bekommst du hier auch kein Einwilligungsbanner zu sehen.</p>
<h2>Deine Rechte</h2>
<p>Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung, Widerspruch und Datenübertragbarkeit sowie das Recht, deine Einwilligung jederzeit zu widerrufen. Schreib an <a href="mailto:cocobosurfschool@gmail.com">cocobosurfschool@gmail.com</a> — wir antworten innerhalb eines Monats.</p>
<p>Bist du mit unserer Antwort nicht zufrieden, kannst du dich bei der französischen Datenschutzbehörde CNIL beschweren, 3 place de Fontenoy, TSA 80715, 75334 Paris Cedex 07 — <a href="https://www.cnil.fr" target="_blank" rel="noopener">cnil.fr</a> — oder bei der Behörde deines eigenen Landes.</p>`,
      updated: 'Zuletzt aktualisiert: 21. August 2026.',
    },
    book: {
      title: 'Surfkurs buchen — Coco Surf School', desc: 'Buchen Sie Ihren Surfkurs online bei Coco Surf School: Session, Teilnehmerzahl und Formel auswählen.', h1: 'Kurs buchen', crumb: 'Buchen',
      eyebrow: 'Online buchen', h1html: 'Buchen Sie Ihren <em>Surfkurs</em>', lead: 'Wählen Sie unten eine Session aus und geben Sie Ihre Daten ein. Zur Bestätigung ist eine Anzahlung von 30 % erforderlich.',
      fSessionH: 'Session auswählen', fParty: 'Teilnehmerzahl', fPack: 'Anzahl der Kurse', fName: 'Vollständiger Name', fEmail: 'E-Mail', fPhone: 'Telefon', fLang: 'Bevorzugte Sprache',
      fConsent: 'Ich möchte Informationen zu meinen Kursen und Angeboten per E-Mail erhalten', fRemarks: 'Anmerkungen (optional)', fSubmit: 'Jetzt buchen', fSending: 'Wird gesendet…',
      fOk: 'Danke! Ihre Buchung ist bestätigt.', fErr: 'Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut oder kontaktieren Sie uns direkt.', fEmpty: 'Derzeit keine Sessions verfügbar.',
      deposit: 'Zur Bestätigung ist eine Anzahlung von 30 % erforderlich. Zahlung per Überweisung oder bar.',
    },
  },
};
