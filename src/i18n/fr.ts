export default {
  // 登录页面
  login: {
    title: 'DMS',
    subtitle: 'Bienvenue dans le système de gestion de l\'entrepôt',
    username: 'Nom d\'utilisateur',
    password: 'Mot de passe',
    remember: 'Se souvenir du compte',
    submit: 'Se connecter',
    required: 'Veuillez entrer {field}',
    loginSuccess: 'Connexion réussie',
    loginFailed: 'Échec de la connexion, veuillez vérifier votre nom d\'utilisateur et votre mot de passe'
  },

  // 主页
  home: {
    title: 'DMS',
    modules: {
      scanIn: 'Scan entrant',
      scanInDesc: 'Scanner le numéro de suivi du colis pour effectuer une opération entrante',
      packageRecords: 'Enregistrements de colis',
      packageRecordsDesc: 'Voir les informations détaillées de tous les colis',
      scanOut: 'Scan sortant',
      scanOutDesc: 'Scanner le numéro de suivi du colis pour effectuer une opération sortante',
      outboundRecords: 'Enregistrements sortants',
      outboundRecordsDesc: 'Gérer tous les lots sortants',
      inboundRecords: 'Enregistrements entrants',
      inboundRecordsDesc: 'Voir tous les enregistrements entrants',
      inboundBatches: 'Lots entrants',
      inboundBatchesDesc: 'Gérer tous les lots entrants'
    },
    stats: {
      title: 'Statistiques de données',
      totalPackages: 'Total des colis',
      inStock: 'En stock',
      pending: 'En attente',
      totalBatches: 'Total des lots'
    }
  },

  // 扫描入库
  scanIn: {
    title: 'Scan entrant',
    scanBarcode: 'Scanner le code-barres',
    manualInput: 'Saisie manuelle',
    pleaseInputBarcode: 'Veuillez saisir le code-barres',
    cameraScan: 'Scan caméra',
    scanSuccess: 'Scan réussi',
    scanFailed: 'Échec du scan',
    intercepted: 'Intercepté',
    interceptMessage: 'Raison d\'interception',
    trackNo: 'Numéro de suivi',
    channel: 'Canal',
    country: 'Pays',
    confirm: 'Confirmer',
    cancel: 'Annuler',
    cameraInitFailed: 'Échec de l\'initialisation de la caméra',
    cameraInUse: 'Caméra en cours d\'utilisation',
    cameraStarted: 'Caméra démarrée',
    cameraPermissionDenied: 'Permission de caméra refusée',
    cameraNotFound: 'Caméra introuvable',
    cameraNotSupported: 'Caméra non prise en charge',
    notInBatch: 'Ce numéro de suivi n\'est pas dans le lot entrant, stockage interdit',
    notForecast: 'Colis non prévu, intercepté directement',
    alreadyInStock: 'Déjà en stock, stockage en double',
    pendingIntercept: 'Intercepté',
    alreadyIntercepted: 'Déjà intercepté, intercepté en double',
    invalidParams: 'Paramètres invalides',
    invalidStatus: 'Statut {status}, impossible à stocker à nouveau'
  },

  // 包裹记录
  packageRecords: {
    title: 'Enregistrements de colis',
    filter: {
      all: 'Tous',
      inStock: 'En stock',
      pending: 'En attente',
      pendingIntercept: 'Interception en attente',
      intercepted: 'Intercepté',
      outOfStock: 'Hors stock',
      hold: 'En attente de traitement'
    },
    table: {
      trackNo: 'Numéro de suivi',
      weight: 'Poids(kg)',
      dimensions: 'Dimensions(cm)',
      status: 'Statut',
      channel: 'Canal',
      country: 'Pays',
      createdAt: 'Date de création',
      updatedAt: 'Date de mise à jour'
    }
  },

  // 扫描出库
  scanOut: {
    title: 'Scan sortant',
    batchExists: 'Lot sortant déjà existant',
    batchCreated: 'Lot créé avec succès',
    createFailed: 'Échec de la création du lot',
    selectChannelPrompt: 'Veuillez sélectionner un canal',
    step1: {
      title: 'Étape 1: Entrez le numéro de lot sortant',
      serialNumber: 'Numéro de série sortant',
      createNew: 'Créer un nouveau lot',
      useExisting: 'Utiliser un lot existant'
    },
    step2: {
      title: 'Étape 2: Sélectionnez le canal d\'expédition',
      channel: 'Canal',
      selectChannel: 'Veuillez sélectionner un canal d\'expédition'
    },
    step3: {
      title: 'Étape 3: Scan sortant',
      scan: 'Scanner le colis',
      scannedCount: 'Scannés: {count}',
      totalCount: 'Total: {total}',
      complete: 'Terminer la sortie',
      noScanned: 'Aucun colis n\'a été scanné'
    },
    scanSuccess: 'Scan réussi',
    batchAutoLoaded: 'Informations sur le lot chargées automatiquement',
    batchNotFound: 'Lot non trouvé'
  },

  // 出库记录
  outboundRecords: {
    title: 'Enregistrements sortants',
    addBatch: 'Ajouter un lot sortant',
    filter: {
      all: 'Tous',
      inProgress: 'En cours',
      completed: 'Terminé'
    },
    table: {
      serialNumber: 'Numéro de série sortant',
      channel: 'Canal',
      expectedQuantity: 'Quantité attendue',
      actualQuantity: 'Quantité réelle',
      quantity: 'Quantité',
      status: 'Statut',
      createdAt: 'Date de création',
      updatedAt: 'Date de mise à jour',
      action: 'Action'
    },
    actions: {
      continue: 'Continuer la sortie',
      completed: 'Terminé',
      scanOut: 'Sortie',
      ship: 'Expédier'
    },
    shipSuccess: 'Expédition réussie'
  },

  // 通用
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
    search: 'Rechercher',
    searchPlaceholder: 'Veuillez entrer le numéro de suivi, le canal ou le pays pour rechercher',
    welcome: 'Bienvenue',
    chinese: 'Chinois',
    english: 'Anglais',
    french: 'Français',
    german: 'Allemand',
    lightTheme: 'Mode clair',
    darkTheme: 'Mode sombre',
    userProfile: 'Profil utilisateur',
    settings: 'Paramètres',
    help: 'Aide'
  },

  // 入库批次
  inboundRecords: {
    title: 'Enregistrements entrants',
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
      channel: 'Canal',
      country: 'Pays',
      createdAt: 'Date de création',
      updatedAt: 'Date de mise à jour'
    }
  },

  inboundBatches: {
    title: 'Lots de réception',
    batchDetail: 'Détails du lot de réception',
    batchNo: 'Numéro de lot',
    status: 'Statut',
    createdAt: 'Créé le',
    inboundProgress: 'Progression de réception',
    outboundProgress: 'Progression de sortie',
    channelProgress: 'Progression par canal',
    packageRecords: 'Enregistrements de colis',
    noChannelInfo: 'Aucune information sur le canal',
    noPackageRecords: 'Aucun enregistrement de colis',
    inboundProgressText: 'Progression de réception: {current}/{total}',
    pendingBatches: 'En attente',
    inProgressBatches: 'En cours',
    completedBatches: 'Terminé',
    outboundInProgressBatches: 'Sortie en cours',
    outboundCompletedBatches: 'Sortie terminée',
    noPendingBatches: 'Aucun lot en attente',
    noInProgressBatches: 'Aucun lot en cours',
    noCompletedBatches: 'Aucun lot terminé',
    noOutboundInProgressBatches: 'Aucun lot en cours de sortie',
    noOutboundCompletedBatches: 'Aucun lot avec sortie terminée',
    labels: {
      batchNo: 'Numéro de lot:',
      status: 'Statut:',
      createdAt: 'Créé le:',
      inboundProgress: 'Progression de réception:'
    }
  },

  // API 错误
  api: {
    error: {
      badRequest: 'Mauvaise requête',
      unauthorized: 'Accès non autorisé',
      forbidden: 'Accès interdit',
      notFound: 'Ressource non trouvée',
      serverError: 'Erreur interne du serveur',
      networkError: 'Erreur de connexion réseau',
      requestError: 'Erreur de configuration de la requête',
      unknownError: 'Erreur inconnue'
    }
  },

  // 状态
  status: {
    // 包裹状态
    package: {
      inStock: 'En stock',
      pending: 'En attente',
      pendingIntercept: 'Interception en attente',
      intercepted: 'Intercepté',
      outOfStock: 'Hors stock',
      unknown: 'Inconnu'
    },
    // 入仓批次状态
    inboundBatch: {
      pending: 'En attente',
      inProgress: 'En cours',
      completed: 'Terminé',
      outboundInProgress: 'Sortie en cours',
      outboundCompleted: 'Sortie terminée',
      unknown: 'Inconnu'
    },
    // 出库批次状态
    outboundBatch: {
      inProgress: 'En cours',
      completed: 'Terminé'
    }
  },
  
  // 扫码页面
  scan: {
    title: 'Scan',
    pointCamera: 'Placez le code QR/barcode dans le cadre pour scanner automatiquement',
    help: 'Prend en charge les codes QR et les barcodes',
    lightOn: 'Allumer la lampe torche',
    lightOff: 'Éteindre la lampe torche',
    album: 'Sélectionner depuis l\'album',
    manualInput: 'Saisie manuelle',
    enterCode: 'Veuillez entrer le code',
    scanSuccess: 'Scan réussi',
    scanFailed: 'Échec du scan',
    cameraPermissionDenied: 'Permission de caméra refusée',
    flashlightError: 'Échec de l\'opération de lampe torche',
    albumNotSupported: 'La numérisation depuis l\'album n\'est pas prise en charge pour le moment',
    scanTimeout: 'Délai de scan dépassé, veuillez réessayer'
  },

  // 语音设置
  voiceSetting: {
    title: 'Paramètres vocaux',
    volume: 'Volume',
    pitch: 'Hauteur',
    rate: 'Vitesse',
    test: 'Tester la voix',
    testText: 'Ceci est un message de test vocal',
    testFailed: 'Échec du test vocal'
  }
};