export default {
  // 登录页面
  login: {
    title: 'DMS',
    subtitle: 'Willkommen im Warenhausverwaltungssystem',
    username: 'Benutzername',
    password: 'Passwort',
    remember: 'Konto merken',
    submit: 'Anmelden',
    required: 'Bitte geben Sie {field} ein',
    loginSuccess: 'Anmeldung erfolgreich',
    loginFailed: 'Anmeldung fehlgeschlagen, bitte überprüfen Sie Benutzername und Passwort'
  },

  // 主页
  home: {
    title: 'DMS',
    modules: {
      scanIn: 'Einscannen',
      scanInDesc: 'Scannt die Sendungsnummer für den Eingang',
      packageRecords: 'Sendungsaufzeichnungen',
      packageRecordsDesc: 'Zeige detaillierte Informationen aller Sendungen',
      scanOut: 'Ausgangsscan',
      scanOutDesc: 'Scannt die Sendungsnummer für den Ausgang',
      outboundRecords: 'Ausgangsaufzeichnungen',
      outboundRecordsDesc: 'Verwalte alle Ausgangslots',
      inboundRecords: 'Eingangsaufzeichnungen',
      inboundRecordsDesc: 'Zeige alle Eingangsaufzeichnungen',
      inboundBatches: 'Eingangslots',
      inboundBatchesDesc: 'Verwalte alle Eingangslots'
    },
    stats: {
      title: 'Datenstatistiken',
      totalPackages: 'Gesamtanzahl der Sendungen',
      inStock: 'Auf Lager',
      pending: 'Ausstehend',
      totalBatches: 'Gesamtanzahl der Lots'
    }
  },

  // 扫描入库
  scanIn: {
    title: 'Einscannen',
    scanBarcode: 'Barcode scannen',
    manualInput: 'Manuelle Eingabe',
    pleaseInputBarcode: 'Bitte geben Sie den Barcode ein',
    cameraScan: 'Kamera-Scan',
    scanSuccess: 'Scan erfolgreich',
    scanFailed: 'Scan fehlgeschlagen',
    intercepted: 'Abgefangen',
    interceptMessage: 'Abfanggrund',
    trackNo: 'Sendungsnummer',
    channel: 'Kanal',
    country: 'Land',
    confirm: 'Bestätigen',
    cancel: 'Abbrechen',
    cameraInitFailed: 'Kamera-Initialisierung fehlgeschlagen',
    cameraInUse: 'Kamera wird bereits verwendet',
    cameraStarted: 'Kamera gestartet',
    cameraPermissionDenied: 'Kameraberechtigung verweigert',
    cameraNotFound: 'Kamera nicht gefunden',
    cameraNotSupported: 'Kamera nicht unterstützt'
  },

  // 包裹记录
  packageRecords: {
    title: 'Sendungsaufzeichnungen',
    filter: {
      all: 'Alle',
      inStock: 'Auf Lager',
      pending: 'Ausstehend',
      outOfStock: 'Ausverkauft'
    },
    table: {
      trackNo: 'Sendungsnummer',
      weight: 'Gewicht(kg)',
      dimensions: 'Abmessungen(cm)',
      status: 'Status',
      channel: 'Kanal',
      country: 'Land',
      createdAt: 'Erstellt am',
      updatedAt: 'Aktualisiert am'
    }
  },

  // 扫描出库
  scanOut: {
    title: 'Ausgangsscan',
    batchExists: 'Ausgangslot existiert bereits',
    batchCreated: 'Batch erfolgreich erstellt',
    createFailed: 'Erstellung des Lots fehlgeschlagen',
    selectChannelPrompt: 'Bitte wählen Sie einen Kanal',
    step1: {
      title: 'Schritt 1: Geben Sie die Ausgangslotnummer ein',
      serialNumber: 'Ausgangsseriennummer',
      createNew: 'Neues Lot erstellen',
      useExisting: 'Bestehendes Lot verwenden'
    },
    step2: {
      title: 'Schritt 2: Wählen Sie den Versandkanal',
      channel: 'Kanal',
      selectChannel: 'Bitte wählen Sie einen Versandkanal'
    },
    step3: {
      title: 'Schritt 3: Ausgangsscan',
      scan: 'Sendung scannen',
      scannedCount: 'Gescannte: {count}',
      totalCount: 'Gesamt: {total}',
      complete: 'Ausgang abschließen',
      noScanned: 'Keine Sendungen gescannt'
    },
    scanSuccess: 'Scan erfolgreich',
    batchAutoLoaded: 'Lotinformationen automatisch geladen',
    batchNotFound: 'Lot nicht gefunden'
  },

  // 出库记录
  outboundRecords: {
    title: 'Ausgangsaufzeichnungen',
    addBatch: 'Neuen Ausgangslot hinzufügen',
    filter: {
      all: 'Alle',
      inProgress: 'In Bearbeitung',
      completed: 'Abgeschlossen'
    },
    table: {
      serialNumber: 'Ausgangsseriennummer',
      channel: 'Kanal',
      expectedQuantity: 'Erwartete Menge',
      actualQuantity: 'Tatsächliche Menge',
      quantity: 'Menge',
      status: 'Status',
      createdAt: 'Erstellt am',
      updatedAt: 'Aktualisiert am',
      action: 'Aktion'
    },
    actions: {
      continue: 'Ausgang fortsetzen',
      completed: 'Abgeschlossen',
      scanOut: 'Ausgang',
      ship: 'Versenden'
    },
    shipSuccess: 'Versand erfolgreich'
  },

  // 通用
  common: {
    logout: 'Abmelden',
    loading: 'Laden...',
    success: 'Operation erfolgreich',
    error: 'Operation fehlgeschlagen',
    confirm: 'Bestätigen',
    cancel: 'Abbrechen',
    back: 'Zurück',
    next: 'Weiter',
    noMoreData: 'Keine weiteren Daten',
    noData: 'Keine Daten',
    search: 'Suchen',
    searchPlaceholder: 'Bitte geben Sie Sendungsnummer, Kanal oder Land ein, um zu suchen',
    welcome: 'Willkommen',
    chinese: 'Chinesisch',
    english: 'Englisch',
    french: 'Französisch',
    german: 'Deutsch',
    lightTheme: 'Hellmodus',
    darkTheme: 'Dunkelmodus',
    userProfile: 'Benutzerprofil',
    settings: 'Einstellungen',
    help: 'Hilfe'
  },

  // 入库批次
  inboundRecords: {
    title: 'Eingangsaufzeichnungen',
    filter: {
      all: 'Alle',
      inProgress: 'In Bearbeitung',
      completed: 'Abgeschlossen'
    },
    table: {
      trackNo: 'Sendungsnummer',
      weight: 'Gewicht(kg)',
      dimensions: 'Abmessungen(cm)',
      status: 'Status',
      channel: 'Kanal',
      country: 'Land',
      createdAt: 'Erstellt am',
      updatedAt: 'Aktualisiert am'
    }
  },

  inboundBatches: {
    title: 'Eingangslots',
    batchDetail: 'Details des Eingangslots',
    batchNo: 'Lotnummer',
    status: 'Status',
    createdAt: 'Erstellt am',
    inboundProgress: 'Eingangsprogression',
    channelProgress: 'Kanalprogression',
    packageRecords: 'Sendungsaufzeichnungen',
    noChannelInfo: 'Keine Kanalinformationen',
    noPackageRecords: 'Keine Sendungsaufzeichnungen',
    inboundProgressText: 'Eingangsprogression: {current}/{total}',
    pendingBatches: 'Ausstehende Lots',
    inProgressBatches: 'Lots in Bearbeitung',
    noPendingBatches: 'Keine ausstehenden Lots',
    noInProgressBatches: 'Keine Lots in Bearbeitung',
    labels: {
      batchNo: 'Lotnummer:',
      status: 'Status:',
      createdAt: 'Erstellt am:',
      inboundProgress: 'Eingangsprogression:'
    }
  },

  // API 错误
  api: {
    error: {
      badRequest: 'Ungültige Anfrage',
      unauthorized: 'Nicht autorisierter Zugriff',
      forbidden: 'Zugriff verboten',
      notFound: 'Ressource nicht gefunden',
      serverError: 'Interner Serverfehler',
      networkError: 'Netzwerkverbindungsfehler',
      requestError: 'Fehler in der Anfragekonfiguration',
      unknownError: 'Unbekannter Fehler'
    }
  },

  // 状态
  status: {
    inStock: 'Auf Lager',
    pending: 'Ausstehend',
    outOfStock: 'Ausverkauft',
    inProgress: 'In Bearbeitung',
    completed: 'Abgeschlossen',
    notInbound: 'Nicht eingegangen',
    unknown: 'Unbekannt'
  }
};