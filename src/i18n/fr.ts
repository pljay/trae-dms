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
    cameraNotSupported: 'Caméra non prise en charge'
  },

  // 包裹记录
  packageRecords: {
    title: 'Enregistrements de colis',
    filter: {
      all: 'Tous',
      inStock: 'En stock',
      pending: 'En attente',
      outOfStock: 'Hors stock'
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
    title: 'Lots entrants',
    batchDetail: 'Détails du lot entrant',
    batchNo: 'Numéro de lot',
    status: 'Statut',
    createdAt: 'Date de création',
    inboundProgress: 'Progression de l\'entrée',
    channelProgress: 'Progression du canal',
    packageRecords: 'Enregistrements de colis',
    noChannelInfo: 'Aucune information sur le canal',
    noPackageRecords: 'Aucun enregistrement de colis',
    inboundProgressText: 'Progression de l\'entrée: {current}/{total}',
    pendingBatches: 'Lots en attente',
    inProgressBatches: 'Lots en cours',
    noPendingBatches: 'Aucun lot en attente',
    noInProgressBatches: 'Aucun lot en cours',
    labels: {
      batchNo: 'Numéro de lot:',
      status: 'Statut:',
      createdAt: 'Date de création:',
      inboundProgress: 'Progression de l\'entrée:'
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
    inStock: 'En stock',
    pending: 'En attente',
    outOfStock: 'Hors stock',
    inProgress: 'En cours',
    completed: 'Terminé',
    notInbound: 'Non entré',
    unknown: 'Inconnu'
  }
};