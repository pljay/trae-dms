export default {
  // Configuration commune
  common: {
    logout: 'Déconnexion',
    loading: 'Chargement...',
    success: 'Opération réussie',
    error: 'Échec de l\'opération',
    confirm: 'Confirmer',
    cancel: 'Annuler',
    back: 'Retour',
    next: 'Suivant',
    noMoreData: 'Plus de données',
    noData: 'Aucune donnée',
    search: {
      title: 'Recherche',
      placeholder: 'Veuillez entrer un mot-clé de recherche',
      error: 'Recherche échouée, veuillez réessayer',
      success: 'Recherche réussie',
      noResults: 'Aucun résultat correspondant trouvé'
    },
    placeholder: {
      trackNo: 'Veuillez entrer le numéro de suivi',
      batchNo: 'Veuillez entrer le numéro de lot',
    },
    welcome: 'Bienvenue',
    chinese: 'Chinois',
    english: 'Anglais',
    french: 'Français',
    german: 'Allemand',
    lightTheme: 'Thème clair',
    darkTheme: 'Thème sombre',
    userProfile: 'Profil utilisateur',
    settings: 'Paramètres',
    help: 'Aide'
  },
  
  // Configuration des statuts
  status: {
    // Statut du colis
    package: {
      inStock: 'En stock',
      pending: 'En attente',
      pendingIntercept: 'Bloqué en attente',
      intercepted: 'Bloqué',
      outOfStock: 'Pas de stock',
      unknown: 'Inconnu'
    },
    // Statut du lot d'entrée
    inboundBatch: {
      pending: 'En attente d\'entrée',
      inProgress: 'Entrée en cours',
      completed: 'Entrée terminée',
      outboundInProgress: 'Sortie en cours',
      outboundCompleted: 'Sortie terminée',
      unknown: 'Inconnu'
    },
    // Statut du lot de sortie
    outboundBatch: {
      inProgress: 'Sortie en cours',
      completed: 'Sortie terminée'
    }
  },
  
  // Configuration des erreurs API
  api: {
    error: {
      badRequest: 'Mauvaise requête',
      unauthorized: 'Non autorisé',
      forbidden: 'Interdit',
      notFound: 'Non trouvé',
      serverError: 'Erreur serveur',
      networkError: 'Erreur réseau',
      requestError: 'Erreur de requête',
      unknownError: 'Erreur inconnue'
    }
  },
  
  // Configuration du scan
  scan: {
    title: 'Scanner',
    barcode: 'Numéro de suivi',
    pointCamera: 'Placez le code QR/barre dans le cadre pour scanner automatiquement',
    help: 'Prend en charge les codes QR et les codes à barres',
    lightOn: 'Allumer la lampe',
    lightOff: 'Éteindre la lampe',
    album: 'Sélectionner depuis l\'album',
    manualInput: 'Saisie manuelle',
    enterCode: 'Veuillez entrer le code',
    scanSuccess: 'Scan réussi',
    scanFailed: 'Échec du scan',
    camera: 'Scanner le numéro de suivi',
    errorReason: 'Raison de l\'échec du scan',
    unknownError: 'Erreur inconnue',
    cameraPermissionDenied: 'Permission de caméra refusée',
    flashlightError: 'Échec de l\'opération de lampe',
    albumNotSupported: 'Scan d\'album non pris en charge',
    scanTimeout: 'Délai de scan dépassé, veuillez réessayer',
    cameraStarted: 'Caméra démarrée',
    cameraNotSupported: 'Le navigateur ne prend pas en charge la caméra',
    cameraNotFound: 'Aucune caméra trouvée',
    cameraInUse: 'Caméra en cours d\'utilisation',
    message: {
      scanFailed: 'Erreur',
      scanSuccess: 'Success',
      notForecast: 'Erreur',
      duplicateInbound: 'Déjà entrée',
      intercept: 'Colis bloqué',
      duplicateIntercepted: 'Déjà Bloqué',
      duplicateOutbound: 'Déjà sorti',
      notInbound: 'Pas de stock',
      channelErrorOutbound: 'Destination erreur',
      notInBatch: 'Colis non dans le lot actuel',
      invalidParams: 'Paramètres invalides',
      invalidStatus: 'Statut invalide'
    }
  },
  
  // Configuration des paramètres vocaux
  voiceSetting: {
    title: 'Paramètres vocaux',
    volume: 'Volume',
    pitch: 'Hauteur',
    rate: 'Vitesse',
    voice: 'Voix',
    defaultVoice: 'Voix par défaut',
    test: 'Test vocal',
    testText: 'Ceci est un message de test vocal',
    testFailed: 'Échec du test vocal'
  },
  
  // Configuration des fichiers de vue
  
  // LoginView.vue
  loginView: {
    title: 'Entrepôt',
    subtitle: 'Bienvenue dans le système de gestion d\'entrepôt',
    username: 'Nom d\'utilisateur',
    password: 'Mot de passe',
    remember: 'Se souvenir de moi',
    submit: 'Connexion',
    required: 'Veuillez entrer {field}',
    loginSuccess: 'Connexion réussie',
    loginFailed: 'Échec de la connexion, veuillez vérifier le nom d\'utilisateur et le mot de passe'
  },
  
  // HomeView.vue
  homeView: {
    title: 'Entrepôt',
    modules: {
      inboundOperate: 'Scanner l\'entrée',
      inboundOperateDesc: 'Scannez le numéro de suivi pour entrée',
      packageList: 'Liste des colis',
      packageListDesc: 'Consultez tous les détails des colis',
      outboundOperate: 'Scanner la sortie',
      outboundOperateDesc: 'Scannez le numéro de suivi pour sortie',
      outboundList: 'Enregistrements de sortie',
      outboundListDesc: 'Gérez tous les lots de sortie',
      inboundList: 'Lots d\'entrée',
      inboundListDesc: 'Gérez tous les lots d\'entrée'
    },
   stats: {
      title: 'Statistiques',
      inbound: 'En attente d\'entrée',
      inStock: 'En stock',
      pendingIntercept: 'Bloqué en attente',
      holding: 'En attente'
    }
  },
  
  // PackageListView.vue
  packageListView: {
    title: 'Liste des colis',
    filter: {
      all: 'Tous',
      inStock: 'En stock',
      pending: 'En attente',
      pendingIntercept: 'Bloqué en attente',
      intercepted: 'Déjà Bloqué',
      outOfStock: 'Pas de stock',
      hold: 'En attente'
    },
    table: {
      trackNo: 'Numéro de suivi',
      weight: 'Poids(kg)',
      dimensions: 'Dimensions(cm)',
      status: 'Statut',
      channel: 'Destination ',
      country: 'Pays',
      createdAt: 'Créé le',
      updatedAt: 'Mis à jour le'
    }
  },
  
  // InboundBatchListView.vue
  inboundBatchListView: {
    title: 'Liste des lots d\'entrée',
    filter: {
      all: 'Tous',
      inProgress: 'En cours',
      completed: 'Terminé'
    },
    table: {
      trackNo: 'Numéro de suivi',
      weight: 'Poids(kg)',
      dimensions: 'Dimensions(cm)',
      status: 'Statut',
      channel: 'Destination',
      country: 'Pays',
      createdAt: 'Créé le',
      updatedAt: 'Mis à jour le'
    },
    batchDetail: 'Détail du lot d\'entrée',
    batchNo: 'Numéro de lot',
    status: 'Statut',
    createdAt: 'Créé le',
    inboundProgress: 'Statut d’entrée',
    outboundProgress: 'Statut de sortie',
    channelProgress: 'Statut du Destination ',
    packageRecords: 'Enregistrements de colis',
    noChannelInfo: 'Aucune information sur le destination',
    noPackageRecords: 'Aucun enregistrement de colis',
    inboundProgressText: 'Statut d’entrée: {current}/{total}',
    pendingBatches: 'Lots en attente',
    inProgressBatches: 'Lots en cours',
    completedBatches: 'Lots terminés',
    outboundInProgressBatches: 'Lots de sortie en cours',
    outboundCompletedBatches: 'Lots de sortie terminés',
    noPendingBatches: 'Aucun lot en attente',
    noInProgressBatches: 'Aucun lot en cours',
    noCompletedBatches: 'Aucun lot terminé',
    noOutboundInProgressBatches: 'Aucun lot de sortie en cours',
    noOutboundCompletedBatches: 'Aucun lot de sortie terminé',
    labels: {
      batchNo: 'Numéro de lot:',
      status: 'Statut:',
      createdAt: 'Créé le:',
      inboundProgress: 'Statut d’entrée:'
    }
  },
  
  // InboundBatchDetailView.vue
  inboundBatchDetailView: {
    title: 'Détail du lot d\'entrée',
    batchInfo: 'Informations sur le lot',
    packageRecords: 'Enregistrements de colis',
    batchNo: 'Numéro de lot',
    status: 'Statut',
    createdAt: 'Créé le',
    inboundProgress: 'Statut d’entrée',
    channelProgress: 'Statut du Destination',
    noPackageRecords: 'Aucun enregistrement de colis',
    noChannelInfo: 'Aucune information sur le destination ',
    trackNo: 'Numéro de suivi',
    scanSuccess: 'Scan réussi',
    scanFailed: 'Échec du scan',
    labels: {
      batchNo: 'Numéro de lot:',
      status: 'Statut:',
      createdAt: 'Créé le:',
      inboundProgress: 'Statut d’entrée:'
    },
  },
  
  // InboundOperateView.vue
  inboundOperateView: {
    title: 'Opération d\'entrée',
    batchInfo: 'Informations sur le lot',
    scan: 'Scanner l\'entrée',
    batchNo: 'Numéro de lot',
    trackNo: 'Numéro de suivi',
    status: 'Statut',
    channel: 'Destination ',
    quantity: 'Quantité',
    weight: 'Poids(kg)',
    dimensions: 'Dimensions(cm)',
    manualInput: 'Saisie manuelle du numéro de suivi',
    scannedCount: 'Scanné: {count}',
    scanSuccess: 'Scan réussi',
    scanFailed: 'Échec du scan',
    notInBatch: 'Numéro de suivi non dans le lot',
    notForecast: 'Colis non prévu',
    alreadyInStock: 'Déjà en stock',
    pendingIntercept: 'Bloqué ',
    alreadyIntercepted: 'Déjà Bloqué ',
    invalidParams: 'Paramètres invalides',
    invalidStatus: 'Statut {status}, entrée interdite'
  },
  
  // OutboundBatchListView.vue
  outboundBatchListView: {
    title: 'Liste des lots de sortie',
    addBatch: 'Ajouter un lot de sortie',
    filter: {
      all: 'Tous',
      inProgress: 'En cours',
      completed: 'Terminé'
    },
    table: {
      serialNumber: 'Numéro de série',
      channel: 'Destination ',
      expectedQuantity: 'Quantité prévue',
      actualQuantity: 'Quantité réelle',
      quantity: 'Quantité',
      status: 'Statut',
      createdAt: 'Créé le',
      updatedAt: 'Mis à jour le',
      action: 'Action'
    },
    actions: {
      continue: 'Continuer ',
      completed: 'Terminé',
      scanOut: 'Sortie',
      ship: 'Expédier'
    },
    shipSuccess: 'Expédition réussie'
  },
  
  // OutboundOperateView.vue
  outboundOperateView: {
    title: 'Opération de sortie',
    batchInfo: 'Informations sur le lot',
    scan: 'Scanner la sortie',
    serialNumber: 'Numéro de série',
    channel: 'Destination ',
    quantity: 'Quantité',
    scannedCount: 'Scanné: {count}',
    scanSuccess: 'Scan réussi',
    scanFailed: 'Échec du scan',
    alreadyOutStock: 'Déjà sortie',
    notInOutStock: 'Pas de stock, sortie interdite',
    channelErrorOutStock: 'Erreur de Destination, sortie interdite',
    invalidParams: 'Paramètres invalides',
    invalidStatus: 'Statut {status}, sortie interdite'
  },

  // OutboundOperateDetailView.vue
  outboundOperateDetailView: {
    title: 'Opération de sortie',
    batchInfo: 'Informations sur le lot',
    serialNumber: 'Numéro de série de sortie',
    channel: 'Destination',
    quantity: 'Quantité',
    scannedCount: 'Scanné',
    complete: 'Expédier',
    confirmComplate: 'Êtes-vous sûr de vouloir expédier ?',
    batchNotFound: 'Lot non trouvé',
    confirmManualInput: 'Êtes-vous sûr de vouloir saisir manuellement la sortie ?',
    sacn: {
      scanSuccess: 'Scan réussi',
      scanFailed: 'Échec du scan',
      alreadyOutStock: 'Déjà  sortie ',
      notInOutStock: 'Pas de stock, sortie interdite',
      channelErrorOutStock: 'Erreur de Destination, sortie interdite',
      invalidParams: 'Paramètres invalides',
      invalidStatus: 'Statut {status}, sortie interdite'
    }

  },

  // OutboundOperateListView.vue
  outboundOperateListView: {
    title: 'Liste des opérations de sortie',
    list: {
      serialNumber: 'Numéro de série de sortie',
      channel: 'Canal',
      actualQuantity: 'Quantité réelle',
      status: 'Statut',
      createdAt: 'Créé le',
      updatedAt: 'Mis à jour le',
      action: 'Action'
    },
    action: {
      add: 'Ajouter un lot de sortie',
      continue: 'Continuer la sortie',
      completed: 'Terminé',
      scanOut: 'Sortie',
      complate: 'Expédier'
    },
    confirmComplate: 'Êtes-vous sûr de vouloir expédier ?',
    form: {
      title: 'Ajouter un lot de sortie',
      step1: {
        title: 'Étape 1 : Entrez le numéro de lot de sortie',
        serialNumber: 'Veuillez entrer le numéro de lot de sortie'
      },
      step2: {
        title: 'Étape 2 : Sélectionnez le Destination',
        selectChannel: 'Veuillez sélectionner le Destination'
      }
    },
    filter: {
      all: 'Tous',
      inProgress: 'En cours',
      completed: 'Terminé'
    }
  },
  
  // ScanView.vue
  scanView: {
    title: 'Scanner',
    scanBarcode: 'Scanner le code barre',
    manualInput: 'Saisie manuelle',
    pleaseInputBarcode: 'Veuillez entrer le code barre',
    cameraScan: 'Scan caméra',
    confirm: 'Confirmer',
    cancel: 'Annuler',
    cameraInitFailed: 'Échec de l\'initialisation de la caméra',
    cameraInUse: 'Caméra en cours d\'utilisation',
    cameraStarted: 'Caméra démarrée',
    cameraPermissionDenied: 'Permission de caméra refusée',
    cameraNotFound: 'Aucune caméra trouvée',
    cameraNotSupported: 'Le navigateur ne prend pas en charge la caméra'
  },
  
  // VoiceSettingView.vue
  voiceSettingView: {
    title: 'Paramètres vocaux',
    volume: 'Volume',
    pitch: 'Hauteur',
    rate: 'Vitesse',
    test: 'Test vocal',
    testText: 'Ceci est un message de test vocal',
    testFailed: 'Échec du test vocal'
  }
};