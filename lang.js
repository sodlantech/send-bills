// Multi-language translation system for Send-Bills.com
// Supports: English, Spanish, French, Arabic, Dutch

const translations = {
  en: {
    nav: { free: "100% Free", signin: "Sign in", signout: "Sign out", history: "History" },
    form: {
      template: "Template", simple: "Simple", detailed: "Detailed", goods: "Goods", minimal: "Minimal", corporate: "Corporate",
      accentColor: "Accent Color", footerColor: "Footer Color", invoiceDetails: "Invoice Details",
      docType: "Document Type", currency: "Currency", number: "Number", invoiceDate: "Invoice Date", dueDate: "Due Date",
      recurring: "Make this a recurring invoice", repeatEvery: "Repeat Every", autoSend: "Auto-Send to Client?",
      from: "From", logo: "Logo (optional)", uploadLogo: "+ Upload logo", businessName: "Business Name", email: "Email", address: "Address",
      billTo: "Bill To", selectClient: "Select saved client...", saveClient: "+ Save Client", clientName: "Client Name",
      items: "Items", addSavedItems: "+ Add from Saved Items", saveItems: "Save Current Items",
      itemName: "Item name", description: "Description (optional)", qty: "Qty", price: "Price", total: "Total", discount: "Disc.",
      itemImage: "Image (optional)", addItem: "+ Add Item", subtotal: "Subtotal", tax: "Tax", grandTotal: "Total",
      notes: "Notes", notesPlaceholder: "Payment terms, bank details, thank you message...",
      terms: "Terms & Conditions", termsPlaceholder: "Late payment penalties, warranty terms...",
      signature: "Authorized Signature", uploadSig: "+ Upload signature image", sigName: "Signatory Name",
      sigTitle: "Designation", sigSize: "Signature Size", removeSig: "Remove signature",
      salesPerson: "Sales Person", showOnPdf: "Show on PDF", downloadPdf: "Download PDF", invoiceTotal: "Invoice Total"
    },
    modal: {
      ready: "Your invoice is ready!", signInDesc: "Sign in with Google to unlock all features — completely free, forever.",
      sendEmail: "Send invoices directly to client's email", saveClients: "Save clients & items for instant reuse",
      recurringReminders: "Recurring invoices & auto reminders", acceptPayments: "Accept payments via Stripe & PayPal",
      fullHistory: "Full invoice history & status tracking", signInGoogle: "Sign in with Google — It's Free",
      justDownload: "Just download the PDF", signedIn: "You're signed in!",
      savedToAccount: "Invoice saved to your account. What would you like to do?",
      sendToClient: "Send invoice to your client's email", downloadPdf: "Download PDF", viewHistory: "View Invoice History"
    },
    hero: {
      title: "The Easiest Way to Create, Send & Get Paid on Invoices",
      subtitle: "No sign up needed. Create professional invoices in seconds, email them to clients, accept payments via Stripe & PayPal — all completely free, forever."
    },
    features: { title: "Everything You Need to Get Paid Faster", subtitle: "From creating your first invoice to accepting online payments — we've got every step covered.",
      f1t: "Instant Invoice Creation", f1d: "Open the page and start creating. No account, no setup, no waiting.",
      f2t: "Professional PDF Download", f2d: "Download clean, well-formatted PDF invoices with your logo and terms.",
      f3t: "Email Invoices to Clients", f3d: "Send invoices directly to your client's inbox with a single click.",
      f4t: "Accept Online Payments", f4d: "Connect your own Stripe or PayPal. Clients pay online — money goes directly to you.",
      f5t: "5 Document Types", f5d: "Create Invoices, Bills, Receipts, Estimates, or Quotations.",
      f6t: "49+ Currencies Worldwide", f6d: "Bill clients anywhere in the world in their local currency.",
      f7t: "Google Sign-In & History", f7d: "Save every invoice automatically. View and manage your complete history.",
      f8t: "Shareable Invoice Links", f8d: "Every invoice gets a unique link. Clients can view details and pay online.",
      f9t: "Invoice Status Tracking", f9d: "Track every invoice as Draft, Sent, Paid, Voided, or Cancelled.",
      f10t: "Recurring Invoices", f10d: "Auto-generate invoices weekly, monthly, or quarterly for repeat clients.",
      f11t: "Auto Payment Reminders", f11d: "Automatic escalating email reminders when invoices go overdue.",
      f12t: "Saved Clients & Items", f12d: "Save your clients and services for instant reuse."
    },
    howItWorks: { title: "How It Works — 4 Simple Steps", subtitle: "From zero to getting paid in under 2 minutes.",
      s1t: "Fill In Details", s1d: "Enter your business info, client details, and add your items.",
      s2t: "Download PDF", s2d: "Hit download to get a clean, professional PDF invoice.",
      s3t: "Send to Client", s3d: "Email the invoice or share the unique invoice link.",
      s4t: "Get Paid Online", s4d: "Clients pay via Stripe or PayPal directly from the invoice."
    },
    trust: { title: "Your Data, Your Privacy, Your Peace of Mind", subtitle: "We built Send-Bills.com with your trust as the top priority.",
      t1: "100% Client-Side Processing", t1d: "Invoice data never leaves your browser",
      t2: "No Data Collection", t2d: "We don't store or sell your information",
      t3: "Your Money, Direct to You", t3d: "Payments go straight to your Stripe/PayPal",
      t4: "No Account Required", t4d: "Create and download without signing up"
    },
    review: { label: "Trusted by businesses worldwide" },
    infra: { label: "Built on enterprise-grade infrastructure" },
    free: { title: "Free Forever. No Catches.", subtitle: "We believe invoicing should be free for everyone. Send-Bills.com will never charge you a subscription, lock features behind a paywall, or limit how many invoices you create.",
      unlimited: "Unlimited invoices", downloads: "Unlimited downloads", clients: "Unlimited clients",
      currencies: "All currencies", docTypes: "All document types", emailSend: "Email sending",
      payments: "Payment collection", history: "Invoice history", recurring: "Recurring invoices",
      reminders: "Auto reminders", savedClients: "Saved clients"
    },
    faq: { title: "Frequently Asked Questions" },
    footer: { rights: "All rights reserved.", tagline: "Create free invoices, download PDF invoices, invoice maker for freelancers & small businesses.",
      invoiceGen: "Invoice Generator", invoiceHistory: "Invoice History", paymentSettings: "Payment Settings",
      aboutUs: "About Us", privacyPolicy: "Privacy Policy", termsOfService: "Terms of Service", contactUs: "Contact Us"
    },
    founder: {
      title: "Why We Built This — And Why It's Free",
      quote: "I spent weeks searching for a simple invoicing tool that didn't force me to sign up, didn't charge me monthly, and didn't hide basic features behind a paywall. I couldn't find one. So I built it.",
      p1: "Hi, I'm Pushpender Sodlan, the founder of Send-Bills.com. This platform started from a real frustration I faced while running my own business. I needed to send a single invoice to a client. That's it. One invoice. But every tool I found wanted me to create an account, enter my credit card, start a \"14-day free trial,\" or pay $15-50/month for features I'd never use.",
      p2: "That experience hit hard — not just the inconvenience, but the realization that something as basic as sending an invoice was gatekept behind paywalls and forced sign-ups. It was slowing my business down. I lost time, I lost momentum, and I knew millions of freelancers, contractors, and small business owners were facing the exact same pain every single day.",
      p3: "That frustration became my mission. I built Send-Bills.com to be the tool I wished existed — one where you can create a professional invoice in 60 seconds, download it as a PDF, email it to your client, accept online payments, set up recurring billing, and manage your entire invoicing workflow — all without ever creating an account or paying a single cent.",
      p4: "We believe invoicing is a basic business need, not a luxury. It should be as free and accessible as email. That's not a marketing line — it's the founding principle I built this entire platform on.",
      signature: "Pushpender Sodlan",
      role: "Founder, Send-Bills.com",
      modelTitle: "How We Keep Everything Free",
      m1t: "Non-intrusive Ads", m1d: "Tasteful advertisements from trusted partners help cover our infrastructure costs. We never interrupt your workflow.",
      m2t: "Efficient Architecture", m2d: "Invoice creation happens in your browser — not on our servers. This keeps our costs extremely low.",
      m3t: "Community-Driven Growth", m3d: "When you share Send-Bills.com with a colleague, that's our marketing. Happy users are our best advocates.",
      m4t: "No VC Pressure", m4d: "We're not backed by venture capital that demands aggressive monetization. We built this to solve a problem."
    },
    liveBar: { suffix: "invoices sent in the last 30 days — join businesses getting paid faster" },
    socialProof: { label: "businesses worldwide trust Send-Bills.com" },
    badge: { noSignUp: "No Sign Up Required", freeForever: "100% Free Forever", currencies: "49+ Currencies", stripe: "Stripe & PayPal", docTypes: "5 Document Types" },
    scroll: { discover: "Discover everything Send-Bills.com can do for your business" }
  },

  es: {
    nav: { free: "100% Gratis", signin: "Iniciar sesión", signout: "Cerrar sesión", history: "Historial" },
    form: {
      template: "Plantilla", simple: "Simple", detailed: "Detallada", goods: "Mercancía", minimal: "Mínima", corporate: "Corporativa",
      accentColor: "Color de acento", footerColor: "Color de pie de página", invoiceDetails: "Detalles de factura",
      docType: "Tipo de documento", currency: "Moneda", number: "Número", invoiceDate: "Fecha de factura", dueDate: "Fecha de vencimiento",
      recurring: "Hacer factura recurrente", repeatEvery: "Repetir cada", autoSend: "¿Enviar automáticamente?",
      from: "De", logo: "Logo (opcional)", uploadLogo: "+ Subir logo", businessName: "Nombre de empresa", email: "Correo", address: "Dirección",
      billTo: "Facturar a", selectClient: "Seleccionar cliente guardado...", saveClient: "+ Guardar cliente", clientName: "Nombre del cliente",
      items: "Artículos", addSavedItems: "+ Agregar artículos guardados", saveItems: "Guardar artículos actuales",
      itemName: "Nombre del artículo", description: "Descripción (opcional)", qty: "Cant.", price: "Precio", total: "Total", discount: "Desc.",
      itemImage: "Imagen (opcional)", addItem: "+ Agregar artículo", subtotal: "Subtotal", tax: "Impuesto", grandTotal: "Total",
      notes: "Notas", notesPlaceholder: "Condiciones de pago, datos bancarios, mensaje de agradecimiento...",
      terms: "Términos y condiciones", termsPlaceholder: "Penalidades por pago tardío, garantías...",
      signature: "Firma autorizada", uploadSig: "+ Subir imagen de firma", sigName: "Nombre del firmante",
      sigTitle: "Cargo", sigSize: "Tamaño de firma", removeSig: "Eliminar firma",
      salesPerson: "Vendedor", showOnPdf: "Mostrar en PDF", downloadPdf: "Descargar PDF", invoiceTotal: "Total de factura"
    },
    modal: {
      ready: "¡Tu factura está lista!", signInDesc: "Inicia sesión con Google para desbloquear todas las funciones — completamente gratis, para siempre.",
      sendEmail: "Enviar facturas al correo del cliente", saveClients: "Guardar clientes y artículos para reutilizar",
      recurringReminders: "Facturas recurrentes y recordatorios automáticos", acceptPayments: "Aceptar pagos con Stripe y PayPal",
      fullHistory: "Historial completo y seguimiento de estado", signInGoogle: "Iniciar sesión con Google — Es gratis",
      justDownload: "Solo descargar el PDF", signedIn: "¡Has iniciado sesión!",
      savedToAccount: "Factura guardada en tu cuenta. ¿Qué deseas hacer?",
      sendToClient: "Enviar factura al correo de tu cliente", downloadPdf: "Descargar PDF", viewHistory: "Ver historial de facturas"
    },
    hero: {
      title: "La forma más fácil de crear, enviar y cobrar facturas",
      subtitle: "Sin registro necesario. Crea facturas profesionales en segundos, envíalas a tus clientes, acepta pagos con Stripe y PayPal — todo completamente gratis, para siempre."
    },
    features: { title: "Todo lo que necesitas para cobrar más rápido", subtitle: "Desde crear tu primera factura hasta aceptar pagos en línea — cubrimos cada paso.",
      f1t:"Creación instantánea",f1d:"Abre la página y empieza. Sin cuenta, sin esperas.",f2t:"Descarga PDF profesional",f2d:"Descarga facturas PDF limpias con tu logo.",f3t:"Envía facturas por email",f3d:"Envía facturas directamente al correo de tu cliente.",f4t:"Acepta pagos en línea",f4d:"Conecta tu Stripe o PayPal. El dinero va directo a ti.",f5t:"5 tipos de documento",f5d:"Facturas, recibos, presupuestos, cotizaciones y más.",f6t:"49+ monedas",f6d:"Factura a clientes en todo el mundo en su moneda local.",f7t:"Historial con Google",f7d:"Guarda cada factura automáticamente.",f8t:"Enlaces compartibles",f8d:"Cada factura tiene un enlace único para compartir.",f9t:"Seguimiento de estado",f9d:"Borrador, Enviada, Pagada, Anulada o Cancelada.",f10t:"Facturas recurrentes",f10d:"Auto-genera facturas semanal, mensual o trimestral.",f11t:"Recordatorios automáticos",f11d:"Emails automáticos cuando las facturas vencen.",f12t:"Clientes guardados",f12d:"Guarda clientes y servicios para reutilizar."
    },
    howItWorks: { title: "Cómo funciona — 4 pasos simples", subtitle: "De cero a cobrar en menos de 2 minutos.",s1t:"Completa datos",s1d:"Ingresa tu información y agrega artículos.",s2t:"Descarga PDF",s2d:"Obtén una factura PDF profesional.",s3t:"Envía al cliente",s3d:"Envía por email o comparte el enlace.",s4t:"Cobra en línea",s4d:"Los clientes pagan con Stripe o PayPal." },
    trust: { title: "Tus datos, tu privacidad, tu tranquilidad", subtitle: "Construimos Send-Bills.com con tu confianza como prioridad.",t1:"Procesamiento 100% local",t1d:"Los datos nunca salen de tu navegador",t2:"Sin recopilación de datos",t2d:"No almacenamos ni vendemos tu información",t3:"Tu dinero, directo a ti",t3d:"Los pagos van a tu Stripe/PayPal",t4:"Sin cuenta requerida",t4d:"Crea y descarga sin registrarte" },
    review: { label: "Confianza de empresas en todo el mundo" },
    infra: { label: "Construido con infraestructura empresarial" },
    free: { title: "Gratis para siempre. Sin trampas.", subtitle: "Creemos que la facturación debe ser gratuita para todos.",unlimited:"Facturas ilimitadas",downloads:"Descargas ilimitadas",clients:"Clientes ilimitados",currencies:"Todas las monedas",docTypes:"Todos los tipos",emailSend:"Envío de emails",payments:"Cobro de pagos",history:"Historial",recurring:"Recurrentes",reminders:"Recordatorios",savedClients:"Clientes guardados" },
    faq: { title: "Preguntas frecuentes" },
    footer: { rights: "Todos los derechos reservados.", tagline: "Crea facturas gratis, descarga facturas PDF, herramienta para autónomos.",invoiceGen:"Generador de facturas",invoiceHistory:"Historial",paymentSettings:"Configuración de pagos",aboutUs:"Sobre nosotros",privacyPolicy:"Política de privacidad",termsOfService:"Términos de servicio",contactUs:"Contáctanos" },
    founder: {
      title: "Por qué lo construimos — y por qué es gratis",
      quote: "Pasé semanas buscando una herramienta de facturación simple que no me obligara a registrarme, no me cobrara mensualmente y no ocultara funciones básicas detrás de un muro de pago. No encontré ninguna. Así que la construí.",
      p1: "Hola, soy Pushpender Sodlan, fundador de Send-Bills.com. Esta plataforma nació de una frustración real que enfrenté mientras dirigía mi propio negocio. Necesitaba enviar una sola factura a un cliente. Eso es todo. Una factura. Pero todas las herramientas que encontré querían que creara una cuenta, ingresara mi tarjeta de crédito, iniciara una \"prueba gratuita de 14 días\" o pagara $15-50/mes por funciones que nunca usaría.",
      p2: "Esa experiencia me golpeó fuerte — no solo por la inconveniencia, sino por darme cuenta de que algo tan básico como enviar una factura estaba bloqueado detrás de muros de pago y registros obligatorios. Estaba ralentizando mi negocio. Perdí tiempo, perdí impulso, y sé que millones de autónomos, contratistas y propietarios de pequeños negocios enfrentan el mismo dolor cada día.",
      p3: "Esa frustración se convirtió en mi misión. Construí Send-Bills.com para ser la herramienta que deseaba que existiera — una donde puedas crear una factura profesional en 60 segundos, descargarla como PDF, enviarla a tu cliente, aceptar pagos en línea, configurar facturación recurrente y gestionar todo tu flujo de trabajo de facturación — sin crear nunca una cuenta o pagar un solo centavo.",
      p4: "Creemos que la facturación es una necesidad básica del negocio, no un lujo. Debería ser tan libre y accesible como el correo electrónico. Eso no es una línea de marketing — es el principio fundacional sobre el que construí toda esta plataforma.",
      signature: "Pushpender Sodlan",
      role: "Fundador, Send-Bills.com",
      modelTitle: "Cómo mantenemos todo gratis",
      m1t: "Anuncios no intrusivos", m1d: "Anuncios selectos de socios confiables ayudan a cubrir nuestros costos de infraestructura. Nunca interrumpimos tu flujo de trabajo.",
      m2t: "Arquitectura eficiente", m2d: "La creación de facturas ocurre en tu navegador — no en nuestros servidores. Esto mantiene nuestros costos muy bajos.",
      m3t: "Crecimiento impulsado por la comunidad", m3d: "Cuando compartes Send-Bills.com con un colega, ese es nuestro marketing. Los usuarios felices son nuestros mejores defensores.",
      m4t: "Sin presión de inversores", m4d: "No estamos respaldados por capital de riesgo que exija monetización agresiva. Construimos esto para resolver un problema."
    },
    liveBar: { suffix: "facturas enviadas en los últimos 30 días — únete a negocios que cobran más rápido" },
    socialProof: { label: "empresas de todo el mundo confían en Send-Bills.com" },
    badge: { noSignUp: "Sin registro requerido", freeForever: "100% gratis para siempre", currencies: "49+ monedas", stripe: "Stripe y PayPal", docTypes: "5 tipos de documento" },
    scroll: { discover: "Descubre todo lo que Send-Bills.com puede hacer por tu negocio" }
  },

  fr: {
    nav: { free: "100% Gratuit", signin: "Se connecter", signout: "Se déconnecter", history: "Historique" },
    form: {
      template: "Modèle", simple: "Simple", detailed: "Détaillé", goods: "Marchandises", minimal: "Minimaliste", corporate: "Entreprise",
      accentColor: "Couleur d'accent", footerColor: "Couleur du pied de page", invoiceDetails: "Détails de la facture",
      docType: "Type de document", currency: "Devise", number: "Numéro", invoiceDate: "Date de facture", dueDate: "Date d'échéance",
      recurring: "Facturation récurrente", repeatEvery: "Répéter tous les", autoSend: "Envoi automatique ?",
      from: "De", logo: "Logo (facultatif)", uploadLogo: "+ Télécharger le logo", businessName: "Nom de l'entreprise", email: "E-mail", address: "Adresse",
      billTo: "Facturer à", selectClient: "Sélectionner un client enregistré...", saveClient: "+ Enregistrer le client", clientName: "Nom du client",
      items: "Articles", addSavedItems: "+ Ajouter des articles enregistrés", saveItems: "Enregistrer les articles actuels",
      itemName: "Nom de l'article", description: "Description (facultatif)", qty: "Qté", price: "Prix", total: "Total", discount: "Remise",
      itemImage: "Image (facultatif)", addItem: "+ Ajouter un article", subtotal: "Sous-total", tax: "Taxe", grandTotal: "Total",
      notes: "Notes", notesPlaceholder: "Conditions de paiement, coordonnées bancaires, message de remerciement...",
      terms: "Conditions générales", termsPlaceholder: "Pénalités de retard, garanties...",
      signature: "Signature autorisée", uploadSig: "+ Télécharger l'image de signature", sigName: "Nom du signataire",
      sigTitle: "Fonction", sigSize: "Taille de la signature", removeSig: "Supprimer la signature",
      salesPerson: "Commercial", showOnPdf: "Afficher sur PDF", downloadPdf: "Télécharger PDF", invoiceTotal: "Total de la facture"
    },
    modal: {
      ready: "Votre facture est prête !", signInDesc: "Connectez-vous avec Google pour débloquer toutes les fonctionnalités — entièrement gratuit, pour toujours.",
      sendEmail: "Envoyer les factures par e-mail au client", saveClients: "Enregistrer les clients et articles pour réutilisation",
      recurringReminders: "Factures récurrentes et rappels automatiques", acceptPayments: "Accepter les paiements via Stripe et PayPal",
      fullHistory: "Historique complet et suivi de statut", signInGoogle: "Se connecter avec Google — C'est gratuit",
      justDownload: "Télécharger le PDF uniquement", signedIn: "Vous êtes connecté !",
      savedToAccount: "Facture enregistrée dans votre compte. Que souhaitez-vous faire ?",
      sendToClient: "Envoyer la facture à votre client", downloadPdf: "Télécharger PDF", viewHistory: "Voir l'historique des factures"
    },
    hero: {
      title: "La façon la plus simple de créer, envoyer et encaisser vos factures",
      subtitle: "Aucune inscription nécessaire. Créez des factures professionnelles en quelques secondes, envoyez-les à vos clients, acceptez les paiements via Stripe et PayPal — entièrement gratuit, pour toujours."
    },
    features: { title: "Tout ce qu'il vous faut pour être payé plus vite", subtitle: "De la création à l'encaissement — nous couvrons chaque étape.",
      f1t:"Création instantanée",f1d:"Ouvrez la page et commencez. Pas de compte, pas d'attente.",f2t:"Téléchargement PDF professionnel",f2d:"PDF propres avec votre logo et conditions.",f3t:"Envoyez par e-mail",f3d:"Envoyez les factures directement au client.",f4t:"Acceptez les paiements",f4d:"Connectez Stripe ou PayPal. L'argent va directement à vous.",f5t:"5 types de documents",f5d:"Factures, devis, reçus, estimations et plus.",f6t:"49+ devises",f6d:"Facturez dans la devise locale de vos clients.",f7t:"Historique avec Google",f7d:"Sauvegardez chaque facture automatiquement.",f8t:"Liens partageables",f8d:"Chaque facture a un lien unique.",f9t:"Suivi de statut",f9d:"Brouillon, Envoyé, Payé, Annulé.",f10t:"Factures récurrentes",f10d:"Auto-génération hebdomadaire, mensuelle ou trimestrielle.",f11t:"Rappels automatiques",f11d:"E-mails automatiques pour les factures en retard.",f12t:"Clients enregistrés",f12d:"Enregistrez clients et services pour réutiliser."
    },
    howItWorks: { title: "Comment ça marche — 4 étapes simples", subtitle: "De zéro à être payé en moins de 2 minutes.",s1t:"Remplissez",s1d:"Entrez vos informations et ajoutez vos articles.",s2t:"Téléchargez",s2d:"Obtenez un PDF professionnel.",s3t:"Envoyez",s3d:"Par e-mail ou lien partageable.",s4t:"Encaissez",s4d:"Vos clients paient via Stripe ou PayPal." },
    trust: { title: "Vos données, votre vie privée, votre sérénité", subtitle: "Send-Bills.com est conçu avec votre confiance comme priorité.",t1:"Traitement 100% local",t1d:"Les données ne quittent jamais votre navigateur",t2:"Aucune collecte de données",t2d:"Nous ne stockons ni ne vendons vos informations",t3:"Votre argent, directement à vous",t3d:"Les paiements vont à votre Stripe/PayPal",t4:"Pas de compte requis",t4d:"Créez et téléchargez sans inscription" },
    review: { label: "Approuvé par des entreprises du monde entier" },
    infra: { label: "Construit sur une infrastructure professionnelle" },
    free: { title: "Gratuit pour toujours. Sans piège.", subtitle: "Nous pensons que la facturation devrait être gratuite pour tous.",unlimited:"Factures illimitées",downloads:"Téléchargements illimités",clients:"Clients illimités",currencies:"Toutes les devises",docTypes:"Tous les types",emailSend:"Envoi d'e-mails",payments:"Encaissement",history:"Historique",recurring:"Récurrentes",reminders:"Rappels auto",savedClients:"Clients enregistrés" },
    faq: { title: "Questions fréquentes" },
    footer: { rights: "Tous droits réservés.", tagline: "Créez des factures gratuites, téléchargez des PDF, outil pour indépendants.",invoiceGen:"Générateur de factures",invoiceHistory:"Historique",paymentSettings:"Paramètres de paiement",aboutUs:"À propos",privacyPolicy:"Confidentialité",termsOfService:"Conditions",contactUs:"Contact" },
    founder: {
      title: "Pourquoi nous l'avons créé — et pourquoi c'est gratuit",
      quote: "J'ai passé des semaines à chercher un outil de facturation simple qui ne m'oblige pas à m'inscrire, ne me facture pas mensuellement et ne cache pas les fonctionnalités de base derrière un mur payant. Je n'en ai pas trouvé. Alors je l'ai créé.",
      p1: "Bonjour, je suis Pushpender Sodlan, fondateur de Send-Bills.com. Cette plateforme est née d'une réelle frustration que j'ai éprouvée en gérant ma propre entreprise. J'avais besoin d'envoyer une seule facture à un client. C'est tout. Une facture. Mais tous les outils que j'ai trouvés voulaient que je crée un compte, que j'entre ma carte de crédit, que je commence un \"essai gratuit de 14 jours\" ou que je paie 15-50 $/mois pour des fonctionnalités que je n'utiliserais jamais.",
      p2: "Cette expérience a été difficile — non seulement par la gêne occasionnée, mais par la réalisation que quelque chose d'aussi basique que l'envoi d'une facture était enfermé derrière des murs de paiement et des inscriptions obligatoires. Cela ralentissait mon entreprise. J'ai perdu du temps, j'ai perdu mon élan, et je savais que des millions de travailleurs indépendants, d'entrepreneurs et de propriétaires de petites entreprises éprouvaient la même douleur chaque jour.",
      p3: "Cette frustration est devenue ma mission. J'ai créé Send-Bills.com pour être l'outil que j'aurais aimé voir exister — un outil où vous pouvez créer une facture professionnelle en 60 secondes, la télécharger en PDF, l'envoyer à votre client, accepter les paiements en ligne, configurer une facturation récurrente et gérer l'ensemble de votre flux de travail de facturation — sans jamais créer de compte ni payer un seul centime.",
      p4: "Nous croyons que la facturation est un besoin commercial fondamental, pas un luxe. Elle devrait être aussi gratuite et accessible que le courrier électronique. Ce n'est pas une phrase de marketing — c'est le principe fondateur sur lequel j'ai construit toute cette plateforme.",
      signature: "Pushpender Sodlan",
      role: "Fondateur, Send-Bills.com",
      modelTitle: "Comment nous gardons tout gratuit",
      m1t: "Publicités non-intrusives", m1d: "Des publicités de qualité provenant de partenaires de confiance aident à couvrir nos frais d'infrastructure. Nous n'interrompons jamais votre flux de travail.",
      m2t: "Architecture efficace", m2d: "La création de factures se fait dans votre navigateur — pas sur nos serveurs. Cela maintient nos coûts extrêmement bas.",
      m3t: "Croissance impulsée par la communauté", m3d: "Lorsque vous partagez Send-Bills.com avec un collègue, c'est notre marketing. Les utilisateurs satisfaits sont nos meilleurs ambassadeurs.",
      m4t: "Aucune pression du capital-risque", m4d: "Nous ne sommes pas soutenus par du capital-risque qui exige une monétisation agressive. Nous avons créé cela pour résoudre un problème."
    },
    liveBar: { suffix: "factures envoyées au cours des 30 derniers jours — rejoignez les entreprises qui sont payées plus rapidement" },
    socialProof: { label: "entreprises du monde entier font confiance à Send-Bills.com" },
    badge: { noSignUp: "Aucune inscription requise", freeForever: "100% gratuit à jamais", currencies: "49+ devises", stripe: "Stripe et PayPal", docTypes: "5 types de documents" },
    scroll: { discover: "Découvrez tout ce que Send-Bills.com peut faire pour votre entreprise" }
  },

  ar: {
    nav: { free: "مجاني 100%", signin: "تسجيل الدخول", signout: "تسجيل الخروج", history: "السجل" },
    form: {
      template: "القالب", simple: "بسيط", detailed: "مفصّل", goods: "بضائع", minimal: "حد أدنى", corporate: "مؤسسي",
      accentColor: "لون التمييز", footerColor: "لون التذييل", invoiceDetails: "تفاصيل الفاتورة",
      docType: "نوع المستند", currency: "العملة", number: "الرقم", invoiceDate: "تاريخ الفاتورة", dueDate: "تاريخ الاستحقاق",
      recurring: "جعل هذه فاتورة متكررة", repeatEvery: "التكرار كل", autoSend: "إرسال تلقائي للعميل؟",
      from: "من", logo: "الشعار (اختياري)", uploadLogo: "+ رفع الشعار", businessName: "اسم الشركة", email: "البريد الإلكتروني", address: "العنوان",
      billTo: "فاتورة إلى", selectClient: "اختر عميل محفوظ...", saveClient: "+ حفظ العميل", clientName: "اسم العميل",
      items: "البنود", addSavedItems: "+ إضافة بنود محفوظة", saveItems: "حفظ البنود الحالية",
      itemName: "اسم البند", description: "الوصف (اختياري)", qty: "الكمية", price: "السعر", total: "المجموع", discount: "خصم",
      itemImage: "صورة (اختياري)", addItem: "+ إضافة بند", subtotal: "المجموع الفرعي", tax: "الضريبة", grandTotal: "الإجمالي",
      notes: "ملاحظات", notesPlaceholder: "شروط الدفع، تفاصيل بنكية، رسالة شكر...",
      terms: "الشروط والأحكام", termsPlaceholder: "غرامات التأخير، شروط الضمان...",
      signature: "التوقيع المعتمد", uploadSig: "+ رفع صورة التوقيع", sigName: "اسم الموقّع",
      sigTitle: "المنصب", sigSize: "حجم التوقيع", removeSig: "إزالة التوقيع",
      salesPerson: "مندوب المبيعات", showOnPdf: "إظهار في PDF", downloadPdf: "تحميل PDF", invoiceTotal: "إجمالي الفاتورة"
    },
    modal: {
      ready: "فاتورتك جاهزة!", signInDesc: "سجّل الدخول بحساب Google لفتح جميع الميزات — مجاناً تماماً، إلى الأبد.",
      sendEmail: "إرسال الفواتير إلى بريد العميل", saveClients: "حفظ العملاء والبنود للاستخدام المتكرر",
      recurringReminders: "فواتير متكررة وتذكيرات تلقائية", acceptPayments: "قبول المدفوعات عبر Stripe و PayPal",
      fullHistory: "سجل كامل للفواتير وتتبع الحالة", signInGoogle: "تسجيل الدخول بحساب Google — مجاني",
      justDownload: "تحميل PDF فقط", signedIn: "!تم تسجيل الدخول",
      savedToAccount: "تم حفظ الفاتورة في حسابك. ماذا تريد أن تفعل؟",
      sendToClient: "إرسال الفاتورة إلى بريد العميل", downloadPdf: "تحميل PDF", viewHistory: "عرض سجل الفواتير"
    },
    hero: {
      title: "أسهل طريقة لإنشاء وإرسال وتحصيل الفواتير",
      subtitle: "لا حاجة للتسجيل. أنشئ فواتير احترافية في ثوانٍ، أرسلها لعملائك، واقبل المدفوعات عبر Stripe و PayPal — مجاناً تماماً، إلى الأبد."
    },
    features: { title: "كل ما تحتاجه لتحصيل أموالك أسرع", subtitle: "من إنشاء أول فاتورة إلى قبول المدفوعات — نغطي كل خطوة.",
      f1t:"إنشاء فوري",f1d:"افتح الصفحة وابدأ فوراً. بدون حساب أو انتظار.",f2t:"تحميل PDF احترافي",f2d:"فواتير PDF نظيفة مع شعارك وشروطك.",f3t:"إرسال بالبريد",f3d:"أرسل الفواتير مباشرة لبريد العميل.",f4t:"قبول المدفوعات",f4d:"اربط Stripe أو PayPal. المال يصل إليك مباشرة.",f5t:"5 أنواع مستندات",f5d:"فواتير، إيصالات، عروض أسعار والمزيد.",f6t:"49+ عملة",f6d:"فوتر بالعملة المحلية لعملائك.",f7t:"سجل مع Google",f7d:"احفظ كل فاتورة تلقائياً.",f8t:"روابط مشاركة",f8d:"كل فاتورة لها رابط فريد.",f9t:"تتبع الحالة",f9d:"مسودة، مرسلة، مدفوعة، ملغاة.",f10t:"فواتير متكررة",f10d:"إنشاء تلقائي أسبوعي أو شهري.",f11t:"تذكيرات تلقائية",f11d:"رسائل تلقائية للفواتير المتأخرة.",f12t:"عملاء محفوظون",f12d:"احفظ العملاء والخدمات لإعادة الاستخدام."
    },
    howItWorks: { title: "كيف يعمل — 4 خطوات بسيطة", subtitle: "من الصفر إلى تحصيل أموالك في أقل من دقيقتين.",s1t:"أدخل البيانات",s1d:"أدخل معلوماتك وأضف بنودك.",s2t:"حمّل PDF",s2d:"احصل على فاتورة PDF احترافية.",s3t:"أرسل للعميل",s3d:"عبر البريد أو رابط المشاركة.",s4t:"احصل على المال",s4d:"يدفع العملاء عبر Stripe أو PayPal." },
    trust: { title: "بياناتك، خصوصيتك، راحة بالك", subtitle: "بنينا Send-Bills.com مع ثقتك كأولوية.",t1:"معالجة محلية 100%",t1d:"البيانات لا تغادر متصفحك",t2:"بدون جمع بيانات",t2d:"لا نخزن أو نبيع معلوماتك",t3:"أموالك مباشرة إليك",t3d:"المدفوعات تذهب لحسابك",t4:"بدون حساب مطلوب",t4d:"أنشئ وحمّل بدون تسجيل" },
    review: { label: "موثوق من شركات حول العالم" },
    infra: { label: "مبني على بنية تحتية مؤسسية" },
    free: { title: "مجاني إلى الأبد. بدون خدع.", subtitle: "نؤمن أن الفوترة يجب أن تكون مجانية للجميع.",unlimited:"فواتير غير محدودة",downloads:"تحميلات غير محدودة",clients:"عملاء غير محدودين",currencies:"جميع العملات",docTypes:"جميع الأنواع",emailSend:"إرسال بريد",payments:"تحصيل مدفوعات",history:"سجل الفواتير",recurring:"متكررة",reminders:"تذكيرات",savedClients:"عملاء محفوظون" },
    faq: { title: "الأسئلة الشائعة" },
    footer: { rights: "جميع الحقوق محفوظة.", tagline: "أنشئ فواتير مجانية، حمّل PDF، أداة فوترة للمستقلين.",invoiceGen:"مولد الفواتير",invoiceHistory:"السجل",paymentSettings:"إعدادات الدفع",aboutUs:"من نحن",privacyPolicy:"الخصوصية",termsOfService:"الشروط",contactUs:"اتصل بنا" },
    founder: {
      title: "لماذا أنشأنا هذا — ولماذا هو مجاني",
      quote: "قضيت أسابيع في البحث عن أداة فوترة بسيطة لا تجبرني على التسجيل، لا تفرض عليّ رسوماً شهرية، ولا تخفي الميزات الأساسية خلف جدار الدفع. لم أجد واحدة. فقررت بناء واحدة.",
      p1: "مرحباً، أنا بوشبندر سودلان، مؤسس Send-Bills.com. انبثقت هذه المنصة من إحباط حقيقي واجهته أثناء إدارة عملي الخاص. كنت أحتاج فقط لإرسال فاتورة واحدة إلى عميل. مجرد فاتورة واحدة. لكن كل أداة وجدتها كانت تريد مني إنشاء حساب، إدخال بطاقتي الائتمانية، بدء \"تجربة مجانية لمدة 14 يوماً\"، أو دفع 15-50 دولاراً شهرياً لميزات لن أستخدمها أبداً.",
      p2: "كانت هذه التجربة مؤلمة — ليس فقط بسبب الإزعاج، بل لأدراكي أن شيئاً بسيطاً مثل إرسال فاتورة كان محبوساً خلف أسوار الدفع والتسجيلات الإجبارية. كان يبطئ عملي. أضعت الوقت، أضعت الزخم، وأنا أعلم أن ملايين العاملين بالعمل الحر والمقاولين وأصحاب الأعمال الصغيرة يواجهون نفس الألم يومياً.",
      p3: "تحول هذا الإحباط إلى مهمتي. بنيت Send-Bills.com لتكون الأداة التي تمنيت أن تكون موجودة — أداة يمكنك من خلالها إنشاء فاتورة احترافية في 60 ثانية، تحميلها كملف PDF، إرسالها لعميلك، قبول الدفع عبر الإنترنت، إعداد الفوترة المتكررة، وإدارة سير عمل الفوترة بالكامل — دون إنشاء حساب أو دفع فلس واحد.",
      p4: "نؤمن بأن الفوترة حاجة أساسية في العمل، ليست رفاهية. يجب أن تكون مجانية وسهلة الوصول مثل البريد الإلكتروني. ليس هذا من قبيل الترويج — إنه المبدأ الأساسي الذي بنيت عليه كل هذه المنصة.",
      signature: "بوشبندر سودلان",
      role: "مؤسس، Send-Bills.com",
      modelTitle: "كيف نحافظ على كل شيء مجاني",
      m1t: "إعلانات غير مقتحمة", m1d: "الإعلانات الحذرة من الشركاء الموثوقين تساعد في تغطية تكاليف البنية التحتية لدينا. لا نقاطع سير عملك أبداً.",
      m2t: "معمارية فعالة", m2d: "إنشاء الفواتير يحدث في متصفحك — وليس على خوادمنا. هذا يحافظ على تكاليفنا منخفضة جداً.",
      m3t: "نمو يقوده المجتمع", m3d: "عندما تشارك Send-Bills.com مع زميل، هذا هو تسويقنا. المستخدمون الراضون هم أفضل دعاة لنا.",
      m4t: "بدون ضغط من رأس المال الاستثماري", m4d: "نحن لا نحصل على دعم من رأس المال الاستثماري الذي يطالب بتسييل عدواني. بنينا هذا لحل مشكلة."
    },
    liveBar: { suffix: "فاتورة تم إرسالها في آخر 30 يوماً — انضم للشركات التي تتقاضى أسرع" },
    socialProof: { label: "تثق الشركات في جميع أنحاء العالم في Send-Bills.com" },
    badge: { noSignUp: "لا يتطلب التسجيل", freeForever: "مجاني 100% للأبد", currencies: "49+ عملة", stripe: "Stripe و PayPal", docTypes: "5 أنواع مستندات" },
    scroll: { discover: "اكتشف كل ما يمكن أن يقدمه Send-Bills.com لعملك" }
  },

  nl: {
    nav: { free: "100% Gratis", signin: "Inloggen", signout: "Uitloggen", history: "Geschiedenis" },
    form: {
      template: "Sjabloon", simple: "Eenvoudig", detailed: "Gedetailleerd", goods: "Goederen", minimal: "Minimaal", corporate: "Zakelijk",
      accentColor: "Accentkleur", footerColor: "Voettekstkleur", invoiceDetails: "Factuurgegevens",
      docType: "Documenttype", currency: "Valuta", number: "Nummer", invoiceDate: "Factuurdatum", dueDate: "Vervaldatum",
      recurring: "Maak dit een terugkerende factuur", repeatEvery: "Herhaal elke", autoSend: "Automatisch verzenden?",
      from: "Van", logo: "Logo (optioneel)", uploadLogo: "+ Logo uploaden", businessName: "Bedrijfsnaam", email: "E-mail", address: "Adres",
      billTo: "Factureren aan", selectClient: "Opgeslagen klant selecteren...", saveClient: "+ Klant opslaan", clientName: "Klantnaam",
      items: "Artikelen", addSavedItems: "+ Opgeslagen artikelen toevoegen", saveItems: "Huidige artikelen opslaan",
      itemName: "Artikelnaam", description: "Beschrijving (optioneel)", qty: "Aantal", price: "Prijs", total: "Totaal", discount: "Kort.",
      itemImage: "Afbeelding (optioneel)", addItem: "+ Artikel toevoegen", subtotal: "Subtotaal", tax: "BTW", grandTotal: "Totaal",
      notes: "Opmerkingen", notesPlaceholder: "Betalingsvoorwaarden, bankgegevens, bedankbericht...",
      terms: "Algemene voorwaarden", termsPlaceholder: "Boetes bij late betaling, garantievoorwaarden...",
      signature: "Geautoriseerde handtekening", uploadSig: "+ Handtekeningafbeelding uploaden", sigName: "Naam ondertekenaar",
      sigTitle: "Functie", sigSize: "Handtekeninggrootte", removeSig: "Handtekening verwijderen",
      salesPerson: "Verkoper", showOnPdf: "Tonen op PDF", downloadPdf: "PDF downloaden", invoiceTotal: "Factuurtotaal"
    },
    modal: {
      ready: "Uw factuur is klaar!", signInDesc: "Log in met Google om alle functies te ontgrendelen — volledig gratis, voor altijd.",
      sendEmail: "Facturen direct naar de e-mail van de klant sturen", saveClients: "Klanten en artikelen opslaan voor hergebruik",
      recurringReminders: "Terugkerende facturen en automatische herinneringen", acceptPayments: "Betalingen accepteren via Stripe en PayPal",
      fullHistory: "Volledige factuurgeschiedenis en statusopvolging", signInGoogle: "Inloggen met Google — Het is gratis",
      justDownload: "Alleen de PDF downloaden", signedIn: "U bent ingelogd!",
      savedToAccount: "Factuur opgeslagen in uw account. Wat wilt u doen?",
      sendToClient: "Factuur naar uw klant e-mailen", downloadPdf: "PDF downloaden", viewHistory: "Factuurgeschiedenis bekijken"
    },
    hero: {
      title: "De makkelijkste manier om facturen te maken, verzenden en betaald te krijgen",
      subtitle: "Geen registratie nodig. Maak professionele facturen in seconden, stuur ze naar klanten, accepteer betalingen via Stripe en PayPal — volledig gratis, voor altijd."
    },
    features: { title: "Alles wat u nodig heeft om sneller betaald te worden", subtitle: "Van het maken tot het accepteren van betalingen — wij dekken elke stap.",
      f1t:"Direct aanmaken",f1d:"Open de pagina en begin. Geen account nodig.",f2t:"Professionele PDF",f2d:"Download nette PDF-facturen met uw logo.",f3t:"E-mail naar klant",f3d:"Stuur facturen direct naar de inbox van uw klant.",f4t:"Online betalingen",f4d:"Verbind Stripe of PayPal. Geld gaat direct naar u.",f5t:"5 documenttypes",f5d:"Facturen, bonnen, offertes en meer.",f6t:"49+ valuta",f6d:"Factureer klanten overal ter wereld.",f7t:"Geschiedenis met Google",f7d:"Sla elke factuur automatisch op.",f8t:"Deelbare links",f8d:"Elke factuur heeft een unieke link.",f9t:"Statusopvolging",f9d:"Concept, Verzonden, Betaald, Geannuleerd.",f10t:"Terugkerende facturen",f10d:"Auto-genereer wekelijks, maandelijks of per kwartaal.",f11t:"Auto herinneringen",f11d:"Automatische e-mails voor achterstallige facturen.",f12t:"Opgeslagen klanten",f12d:"Sla klanten en diensten op voor hergebruik."
    },
    howItWorks: { title: "Hoe het werkt — 4 eenvoudige stappen", subtitle: "Van nul tot betaald in minder dan 2 minuten.",s1t:"Vul in",s1d:"Voer uw gegevens in en voeg artikelen toe.",s2t:"Download PDF",s2d:"Ontvang een professionele PDF-factuur.",s3t:"Verstuur",s3d:"Per e-mail of deelbare link.",s4t:"Word betaald",s4d:"Klanten betalen via Stripe of PayPal." },
    trust: { title: "Uw gegevens, uw privacy, uw gemoedsrust", subtitle: "Send-Bills.com is gebouwd met uw vertrouwen als prioriteit.",t1:"100% lokale verwerking",t1d:"Gegevens verlaten nooit uw browser",t2:"Geen dataverzameling",t2d:"Wij slaan niets op of verkopen niets",t3:"Uw geld, direct naar u",t3d:"Betalingen gaan naar uw Stripe/PayPal",t4:"Geen account vereist",t4d:"Maak en download zonder registratie" },
    review: { label: "Vertrouwd door bedrijven wereldwijd" },
    infra: { label: "Gebouwd op professionele infrastructuur" },
    free: { title: "Voor altijd gratis. Geen addertjes.", subtitle: "Wij geloven dat factureren gratis moet zijn voor iedereen.",unlimited:"Onbeperkte facturen",downloads:"Onbeperkte downloads",clients:"Onbeperkte klanten",currencies:"Alle valuta",docTypes:"Alle types",emailSend:"E-mail verzenden",payments:"Betalingen",history:"Geschiedenis",recurring:"Terugkerend",reminders:"Herinneringen",savedClients:"Opgeslagen klanten" },
    faq: { title: "Veelgestelde vragen" },
    footer: { rights: "Alle rechten voorbehouden.", tagline: "Maak gratis facturen, download PDF, tool voor freelancers.",invoiceGen:"Factuurgenerator",invoiceHistory:"Geschiedenis",paymentSettings:"Betalingsinstellingen",aboutUs:"Over ons",privacyPolicy:"Privacy",termsOfService:"Voorwaarden",contactUs:"Contact" },
    founder: {
      title: "Waarom we dit bouwden — en waarom het gratis is",
      quote: "Ik heb weken gezocht naar een eenvoudige factureringstool die me niet dwong in te schrijven, me niet maandelijks in rekening bracht en basisfuncties niet achter een betaalmuur verstopte. Ik vond er geen. Dus bouwde ik er een.",
      p1: "Hallo, ik ben Pushpender Sodlan, oprichter van Send-Bills.com. Dit platform ontstond uit echte frustratie die ik ervaarde tijdens het runnen van mijn eigen bedrijf. Ik moest één factuur naar een klant sturen. Dat was het. Één factuur. Maar elke tool die ik vond wilde dat ik een account aanmaakte, mijn creditcard invoerde, een \"14-dagen gratis proefperiode\" zou starten, of $15-50/maand zou betalen voor functies die ik nooit zou gebruiken.",
      p2: "Die ervaring deed veel pijn — niet alleen omdat het onhandig was, maar omdat ik realiseerde dat iets zo basisch als het verzenden van een factuur achter betalingsmuren en verplichte inschrijvingen zat opgesloten. Het vertraagde mijn bedrijf. Ik verloor tijd, ik verloor momentum, en ik weet dat miljoenen freelancers, aannemers en eigenaren van kleine bedrijven elke dag dezelfde pijn voelen.",
      p3: "Die frustratie werd mijn missie. Ik bouwde Send-Bills.com om het gereedschap te zijn dat ik wilde dat het bestond — een tool waar je in 60 seconden een professionele factuur kunt maken, deze als PDF downloaden, naar je klant e-mailen, onlinebetalingen accepteren, terugkerende facturering instellen en je complete factuurwerkstroom beheren — zonder ooit een account aan te maken of een cent te betalen.",
      p4: "Wij geloven dat facturering een basisnoodzaak in het bedrijfsleven is, geen luxe. Het moet net zo gratis en toegankelijk zijn als e-mail. Dit is geen marketinglijn — het is het fundamentele principe waarop ik dit hele platform heb gebouwd.",
      signature: "Pushpender Sodlan",
      role: "Oprichter, Send-Bills.com",
      modelTitle: "Hoe wij alles gratis houden",
      m1t: "Niet-opdringerige advertenties", m1d: "Voorzichtige advertenties van vertrouwde partners helpen onze infrastructuurkosten te dekken. We onderbreken uw werkstroom nooit.",
      m2t: "Efficiënte architectuur", m2d: "Facturen maken gebeurt in uw browser — niet op onze servers. Dit houdt onze kosten extreem laag.",
      m3t: "Door gemeenschap aangedreven groei", m3d: "Wanneer u Send-Bills.com met een collega deelt, dat is ons marketing. Gelukkige gebruikers zijn onze beste voorvechters.",
      m4t: "Geen VC-druk", m4d: "We worden niet ondersteund door durfkapitaal dat agressieve commercialisering eist. We bouwden dit om een probleem op te lossen."
    },
    liveBar: { suffix: "facturen verzonden in de afgelopen 30 dagen — sluit u aan bij bedrijven die sneller betaald worden" },
    socialProof: { label: "bedrijven wereldwijd vertrouwen Send-Bills.com" },
    badge: { noSignUp: "Geen registratie vereist", freeForever: "100% gratis voor altijd", currencies: "49+ valuta", stripe: "Stripe en PayPal", docTypes: "5 documenttypen" },
    scroll: { discover: "Ontdek alles wat Send-Bills.com voor uw bedrijf kan doen" }
  }
};

// Current language
let currentLangCode = 'en';

// Get nested value from object using dot notation
function getNestedValue(obj, path) {
  return path.split('.').reduce((o, k) => (o && o[k] !== undefined) ? o[k] : null, obj);
}

// Translate function
function t(key) {
  const val = getNestedValue(translations[currentLangCode], key);
  if (val) return val;
  // Fallback to English
  const fallback = getNestedValue(translations['en'], key);
  return fallback || key;
}

// Set language
function setLang(code, onRender) {
  if (!translations[code]) code = 'en';
  currentLangCode = code;
  try { localStorage.setItem('sb_lang', code); } catch(e) {}

  // RTL for Arabic
  if (code === 'ar') {
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = 'ar';
  } else {
    document.documentElement.dir = 'ltr';
    document.documentElement.lang = code;
  }

  if (typeof onRender === 'function') onRender();
  window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: code } }));
}

// Get current language
function getCurrentLang() {
  return currentLangCode;
}

// Country code → language mapping
const countryToLang = {
  // Spanish-speaking
  ES:'es',MX:'es',AR:'es',CO:'es',CL:'es',PE:'es',VE:'es',EC:'es',GT:'es',CU:'es',BO:'es',DO:'es',HN:'es',PY:'es',SV:'es',NI:'es',CR:'es',PA:'es',UY:'es',
  // French-speaking
  FR:'fr',BE:'fr',CH:'fr',CA:'fr',SN:'fr',CI:'fr',ML:'fr',BF:'fr',NE:'fr',TD:'fr',GN:'fr',RW:'fr',CD:'fr',CM:'fr',MG:'fr',
  // Arabic-speaking
  SA:'ar',AE:'ar',EG:'ar',IQ:'ar',MA:'ar',DZ:'ar',SD:'ar',SY:'ar',TN:'ar',JO:'ar',LB:'ar',LY:'ar',YE:'ar',OM:'ar',KW:'ar',QA:'ar',BH:'ar',PS:'ar',
  // Dutch-speaking
  NL:'nl',SR:'nl',
};

// Auto-detect on load
(function() {
  // 1. Check localStorage (user's explicit choice)
  let saved = null;
  try { saved = localStorage.getItem('sb_lang'); } catch(e) {}
  if (saved && translations[saved]) {
    currentLangCode = saved;
    applyDir();
    return;
  }

  // 2. Try IP-based geolocation (free API, no key needed)
  try {
    fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(3000) })
      .then(r => r.json())
      .then(data => {
        if (data && data.country_code) {
          const detected = countryToLang[data.country_code.toUpperCase()];
          if (detected && translations[detected]) {
            currentLangCode = detected;
            applyDir();
            // Update dropdowns and apply translations
            syncLangUI();
            return;
          }
        }
        // 3. Fallback: browser language
        detectFromBrowser();
      })
      .catch(() => detectFromBrowser());
  } catch(e) {
    detectFromBrowser();
  }

  function detectFromBrowser() {
    const browserLang = (navigator.language || navigator.userLanguage || 'en').slice(0, 2).toLowerCase();
    if (translations[browserLang]) {
      currentLangCode = browserLang;
      applyDir();
      syncLangUI();
    }
  }

  function applyDir() {
    if (currentLangCode === 'ar') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = currentLangCode;
    }
  }

  function syncLangUI() {
    // Sync dropdown selectors if they exist
    ['headerLangSelect','footerLangSelect'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = currentLangCode;
    });
    // Apply translations to all data-i18n elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const val = getNestedValue(translations[currentLangCode], el.dataset.i18n);
      if (val) el.textContent = val;
    });
  }

  applyDir();
})();
