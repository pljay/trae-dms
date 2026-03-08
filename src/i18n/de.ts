export default {
  // Allgemeine Konfiguration
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
    search: {
      title: 'Suche',
      placeholder: 'Bitte geben Sie einen Suchbegriff ein',
      error: 'Suche fehlgeschlagen, bitte versuchen Sie es erneut',
      success: 'Suche erfolgreich',
      noResults: 'Keine passenden Ergebnisse gefunden'
    },
    placeholder: {
      trackNo: 'Bitte geben Sie die Sendungsnummer ein',
      batchNo: 'Bitte geben Sie die Losnummer ein',
    },
    welcome: 'Willkommen',
    chinese: 'Chinesisch',
    english: 'Englisch',
    french: 'Französisch',
    german: 'Deutsch',
    lightTheme: 'Helles Theme',
    darkTheme: 'Dunkles Theme',
    userProfile: 'Benutzerprofil',
    settings: 'Einstellungen',
    help: 'Hilfe'
  },

  // Statuskonfiguration
  status: {
    // Paketstatus
    package: {
      inStock: 'Verfügbar',
      pending: 'Ausstehend',
      pendingIntercept: 'Abfangen ausstehend',
      intercepted: 'Abgefangen',
      outOfStock: 'Nicht verfügbar',
      unknown: 'Unbekannt'
    },
    // Eingangslosstatus
    inboundBatch: {
      pending: 'Eingang ausstehend',
      inProgress: 'Eingang läuft',
      completed: 'Eingang abgeschlossen',
      outboundInProgress: 'Ausgang läuft',
      outboundCompleted: 'Ausgang abgeschlossen',
      unknown: 'Unbekannt'
    },
    // Ausgangslosstatus
    outboundBatch: {
      inProgress: 'Ausgang läuft',
      completed: 'Ausgang abgeschlossen'
    }
  },

  // API-Fehlerkonfiguration
  api: {
    error: {
      badRequest: 'Ungültige Anfrage',
      unauthorized: 'Nicht autorisiert',
      forbidden: 'Zugriff verweigert',
      notFound: 'Nicht gefunden',
      serverError: 'Serverfehler',
      networkError: 'Netzwerkfehler',
      requestError: 'Anfragefehler',
      unknownError: 'Unbekannter Fehler'
    }
  },

  // Scankonfiguration
  scan: {
    title: 'Scannen',
    barcode: 'Sendungsnummer',
    pointCamera: 'Platzieren Sie den QR-Code/Barcode im Rahmen, um automatisch zu scannen',
    help: 'Unterstützt QR-Codes und Barcodes',
    lightOn: 'Taschenlampe einschalten',
    lightOff: 'Taschenlampe ausschalten',
    album: 'Aus Album auswählen',
    manualInput: 'Manuelle Eingabe',
    enterCode: 'Bitte geben Sie den Code ein',
    scanSuccess: 'Scannen erfolgreich',
    scanFailed: 'Scannen fehlgeschlagen',
    camera: 'Sendungsnummer scannen',
    errorReason: 'Scan-Fehlursache',
    unknownError: 'Unbekannter Fehler',
    cameraPermissionDenied: 'Kameraberechtigung verweigert',
    flashlightError: 'Taschenlampenoperation fehlgeschlagen',
    albumNotSupported: 'Album-Scan nicht unterstützt',
    scanTimeout: 'Scan-Timeout, bitte versuchen Sie es erneut',
    cameraStarted: 'Kamera gestartet',
    cameraNotSupported: 'Browser unterstützt keine Kamera',
    cameraNotFound: 'Keine Kamera gefunden',
    cameraInUse: 'Kamera wird bereits verwendet',
    message: {
      scanFailed: 'Scannen fehlgeschlagen, bitte versuchen Sie es erneut',
      scanSuccess: 'Scannen erfolgreich',
      notForecast: 'Paket nicht prognostiziert',
      duplicateInbound: 'Bereits verfügbar, doppelter Eingang',
      intercept: 'Abfangen ausstehend, muss abgefangen werden',
      duplicateIntercepted: 'Bereits abgefangen, doppeltes Abfangen',
      duplicateOutbound: 'Bereits nicht verfügbar, doppelter Ausgang',
      notInbound: 'Paket nicht eingegeben, kann nicht ausgegeben werden',
      channelErrorOutbound: 'Kanalfehler, kann nicht ausgegeben werden',
      notInBatch: 'Paket nicht in aktueller Charge',
      invalidParams: 'Ungültige Parameter',
      invalidStatus: 'Ungültiger Status'
    }
  },

  // Sprach-Einstellungen
  voiceSetting: {
    title: 'Spracheinstellungen',
    volume: 'Lautstärke',
    pitch: 'Tonhöhe',
    rate: 'Geschwindigkeit',
    voice: 'Stimme',
    defaultVoice: 'Standardstimme',
    test: 'Sprachtest',
    testText: 'Dies ist eine Sprachtestnachricht',
    testFailed: 'Sprachtest fehlgeschlagen'
  },

  // Ansichtsdateikonfiguration

  // LoginView.vue
  loginView: {
    title: 'Lager',
    subtitle: 'Willkommen im Lagersystem',
    username: 'Benutzername',
    password: 'Passwort',
    remember: 'Anmeldedaten speichern',
    submit: 'Anmelden',
    required: 'Bitte geben Sie {field} ein',
    loginSuccess: 'Anmeldung erfolgreich',
    loginFailed: 'Anmeldung fehlgeschlagen, bitte überprüfen Sie Benutzername und Passwort'
  },

  // HomeView.vue
  homeView: {
    title: 'Lager',
    modules: {
      inboundOperate: 'Eingang scannen',
      inboundOperateDesc: 'Scannen Sie die Sendungsnummer für den Eingangsvorgang',
      packageList: 'Paketliste',
      packageListDesc: 'Zeigen Sie alle Paketdetails an',
      outboundOperate: 'Ausgang scannen',
      outboundOperateDesc: 'Scannen Sie die Sendungsnummer für den Ausgangsvorgang',
      outboundList: 'Ausgangsaufzeichnungen',
      outboundListDesc: 'Verwalten Sie alle Ausgangslose',
      inboundList: 'Eingangslose',
      inboundListDesc: 'Verwalten Sie alle Eingangslose'
    },
    stats: {
      title: 'Statistiken',
      inbound: 'En attente d\'entrée',
      inStock: 'Verfügbar',
      pendingIntercept: 'Abfangen ausstehend',
      holding: 'Zurückgehalten'
    }
  },

  // PackageListView.vue
  packageListView: {
    title: 'Paketliste',
    filter: {
      all: 'Alle',
      inStock: 'Verfügbar',
      pending: 'Ausstehend',
      pendingIntercept: 'Abfangen ausstehend',
      intercepted: 'Abgefangen',
      outOfStock: 'Nicht verfügbar',
      hold: 'Zurückgehalten'
    },
    table: {
      trackNo: 'Sendungsnummer',
      weight: 'Gewicht(kg)',
      dimensions: 'Maße(cm)',
      status: 'Status',
      channel: 'Kanal',
      country: 'Land',
      createdAt: 'Erstellt am',
      updatedAt: 'Aktualisiert am'
    }
  },

  // InboundBatchListView.vue
  inboundBatchListView: {
    title: 'Eingangslisten',
    filter: {
      all: 'Alle',
      inProgress: 'Läuft',
      completed: 'Abgeschlossen'
    },
    table: {
      trackNo: 'Sendungsnummer',
      weight: 'Gewicht(kg)',
      dimensions: 'Maße(cm)',
      status: 'Status',
      channel: 'Kanal',
      country: 'Land',
      createdAt: 'Erstellt am',
      updatedAt: 'Aktualisiert am'
    },
    batchDetail: 'Eingangsdetails',
    batchNo: 'Losnummer',
    status: 'Status',
    createdAt: 'Erstellt am',
    inboundProgress: 'Eingangsfortschritt',
    outboundProgress: 'Ausgangsfortschritt',
    channelProgress: 'Kanalfortschritt',
    packageRecords: 'Paketaufzeichnungen',
    noChannelInfo: 'Keine Kanalinformation',
    noPackageRecords: 'Keine Paketaufzeichnungen',
    inboundProgressText: 'Eingangsfortschritt: {current}/{total}',
    pendingBatches: 'Ausstehende Lose',
    inProgressBatches: 'Läufende Lose',
    completedBatches: 'Abgeschlossene Lose',
    outboundInProgressBatches: 'Läufende Ausgangslose',
    outboundCompletedBatches: 'Abgeschlossene Ausgangslose',
    noPendingBatches: 'Keine ausstehenden Lose',
    noInProgressBatches: 'Keine laufenden Lose',
    noCompletedBatches: 'Keine abgeschlossenen Lose',
    noOutboundInProgressBatches: 'Keine laufenden Ausgangslose',
    noOutboundCompletedBatches: 'Keine abgeschlossenen Ausgangslose',
    labels: {
      batchNo: 'Losnummer:',
      status: 'Status:',
      createdAt: 'Erstellt am:',
      inboundProgress: 'Eingangsfortschritt:'
    }
  },

  // InboundBatchDetailView.vue
  inboundBatchDetailView: {
    title: 'Eingangsdetails',
    batchInfo: 'Losinformation',
    packageRecords: 'Paketaufzeichnungen',
    batchNo: 'Losnummer',
    status: 'Status',
    createdAt: 'Erstellt am',
    inboundProgress: 'Eingangsfortschritt',
    channelProgress: 'Kanalfortschritt',
    noPackageRecords: 'Keine Paketaufzeichnungen',
    noChannelInfo: 'Keine Kanalinformation',
    trackNo: 'Sendungsnummer',
    scanSuccess: 'Scannen erfolgreich',
    scanFailed: 'Scannen fehlgeschlagen',
    labels: {
      batchNo: 'Losnummer:',
      status: 'Status:',
      createdAt: 'Erstellt am:',
      inboundProgress: 'Eingangsfortschritt:'
    },
  },

  // InboundOperateView.vue
  inboundOperateView: {
    title: 'Eingangsoperation',
    batchInfo: 'Losinformation',
    scan: 'Eingang scannen',
    batchNo: 'Losnummer',
    trackNo: 'Sendungsnummer',
    status: 'Status',
    channel:'Kannel',
    quantity: 'Menge',
    weight: 'Gewicht(kg)',
    dimensions: 'Maße(cm)',
    manualInput: 'Manuelle Eingabe der Sendungsnummer',
    scannedCount: 'Gescanned: {count}',
    scanSuccess: 'Scannen erfolgreich',
    scanFailed: 'Scannen fehlgeschlagen',
    notInBatch: 'Sendungsnummer nicht im Los, Eingang verboten',
    notForecast: 'Nicht prognostiziertes Paket, direktes Abfangen',
    alreadyInStock: 'Bereits verfügbar, doppelter Eingang',
    pendingIntercept: 'Abfangen',
    alreadyIntercepted: 'Doppeltes Abfangen',
    invalidParams: 'Ungültige Parameter',
    invalidStatus: 'Status {status}, Eingang verboten'
  },

  // OutboundBatchListView.vue
  outboundBatchListView: {
    title: 'Ausgangslisten',
    addBatch: 'Ausgangslos hinzufügen',
    filter: {
      all: 'Alle',
      inProgress: 'Läuft',
      completed: 'Abgeschlossen'
    },
    table: {
      serialNumber: 'Seriennummer',
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

  // OutboundOperateView.vue
  outboundOperateView: {
    title: 'Ausgangsoperation',
    batchInfo: 'Losinformation',
    scan: 'Ausgang scannen',
    serialNumber: 'Seriennummer',
    channel: 'Kanal',
    quantity: 'Menge',
    scannedCount: 'Gescanned: {count}',
    scanSuccess: 'Scannen erfolgreich',
    scanFailed: 'Scannen fehlgeschlagen',
    alreadyOutStock: 'Bereits nicht verfügbar, doppelter Ausgang',
    notInOutStock: 'Nicht verfügbar, Ausgang verboten',
    channelErrorOutStock: 'Kanalfehler, Ausgang verboten',
    invalidParams: 'Ungültige Parameter',
    invalidStatus: 'Status {status}, Ausgang verboten'
  },

  // OutboundOperateDetailView.vue
  outboundOperateDetailView: {
    title: 'Ausgangsoperation',
    batchInfo: 'Losinformation',
    serialNumber: 'Ausgangsseriennummer',
    channel: 'Kanal',
    quantity: 'Menge',
    scannedCount: 'Gescanned',
    complete: 'Versenden',
    confirmComplate: 'Möchten Sie wirklich versenden?',
    batchNotFound: 'Los nicht gefunden',
    confirmManualInput: 'Möchten Sie wirklich manuell den Ausgang eingeben?',
    sacn: {
      scanSuccess: 'Scannen erfolgreich',
      scanFailed: 'Scannen fehlgeschlagen',
      alreadyOutStock: 'Bereits nicht verfügbar, doppelter Ausgang',
      notInOutStock: 'Nicht verfügbar, Ausgang verboten',
      channelErrorOutStock: 'Kanalfehler, Ausgang verboten',
      invalidParams: 'Ungültige Parameter',
      invalidStatus: 'Status {status}, Ausgang verboten'
    }

  },

  // OutboundOperateListView.vue
  outboundOperateListView: {
    title: 'Ausgangsoperationsliste',
    list: {
      serialNumber: 'Ausgangsseriennummer',
      channel: 'Kanal',
      actualQuantity: 'Tatsächliche Menge',
      status: 'Status',
      createdAt: 'Erstellt am',
      updatedAt: 'Aktualisiert am',
      action: 'Aktion'
    },
    action: {
      add: 'Ausgangsbatches hinzufügen',
      continue: 'Ausgang fortsetzen',
      completed: 'Abgeschlossen',
      scanOut: 'Ausgang',
      complate: 'Versenden'
    },
    confirmComplate: 'Möchten Sie wirklich versenden?',
    form: {
      title: 'Ausgangsbatches hinzufügen',
      step1: {
        title: 'Schritt 1: Geben Sie die Ausgangsbatchnummer ein',
        serialNumber: 'Bitte geben Sie die Ausgangsbatchnummer ein'
      },
      step2: {
        title: 'Schritt 2: Wählen Sie den Kanal',
        selectChannel: 'Bitte wählen Sie den Kanal'
      }
    },
    filter: {
      all: 'Alle',
      inProgress: 'Läuft',
      completed: 'Abgeschlossen'
    }
  },

  // ScanView.vue
  scanView: {
    title: 'Scannen',
    scanBarcode: 'Barcode scannen',
    manualInput: 'Manuelle Eingabe',
    pleaseInputBarcode: 'Bitte geben Sie den Barcode ein',
    cameraScan: 'Kamerascanner',
    confirm: 'Bestätigen',
    cancel: 'Abbrechen',
    cameraInitFailed: 'Kamerainitialisierung fehlgeschlagen',
    cameraInUse: 'Kamera wird bereits verwendet',
    cameraStarted: 'Kamera gestartet',
    cameraPermissionDenied: 'Kameraberechtigung verweigert',
    cameraNotFound: 'Keine Kamera gefunden',
    cameraNotSupported: 'Browser unterstützt keine Kamera'
  },

  // VoiceSettingView.vue
  voiceSettingView: {
    title: 'Spracheinstellungen',
    volume: 'Lautstärke',
    pitch: 'Tonhöhe',
    rate: 'Geschwindigkeit',
    test: 'Sprachtest',
    testText: 'Dies ist eine Sprachtestnachricht',
    testFailed: 'Sprachtest fehlgeschlagen'
  }
};