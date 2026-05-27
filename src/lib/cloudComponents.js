export const LOGICAL_PHASES = {
  ingestion: {
    id: 'ingestion',
    label: 'Ingestione',
    subtitle: 'La Porta d\'Ingresso',
    description: 'Accetta milioni di dati al secondo da app e sensori, tenendoli in coda senza perderli.',
    icon: 'ArrowDownToLine',
    color: 'from-orange-500 to-amber-500',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/30',
    textColor: 'text-orange-400',
  },
  processing: {
    id: 'processing',
    label: 'Elaborazione',
    subtitle: 'Il Cervello Serverless',
    description: 'Si attiva all\'arrivo del dato, lo pulisce, lo trasforma o interroga un modello AI.',
    icon: 'Cpu',
    color: 'from-violet-500 to-purple-500',
    bgColor: 'bg-violet-500/10',
    borderColor: 'border-violet-500/30',
    textColor: 'text-violet-400',
  },
  storage_nosql: {
    id: 'storage_nosql',
    label: 'Storage NoSQL',
    subtitle: 'Cassaforte Veloce',
    description: 'Memorizza l\'ultimo stato noto per risposte millisecondali a dashboard e app.',
    icon: 'Database',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    textColor: 'text-blue-400',
  },
  storage_object: {
    id: 'storage_object',
    label: 'Storage Oggetti',
    subtitle: 'Il Data Lake',
    description: 'Spazio infinito ed economico per file, log e dataset grezzi.',
    icon: 'HardDrive',
    color: 'from-emerald-500 to-green-500',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    textColor: 'text-emerald-400',
  },
  monitoring: {
    id: 'monitoring',
    label: 'Monitoraggio',
    subtitle: 'L\'Osservatore',
    description: 'Raccoglie log, traccia errori dei processi e invia alert se il flusso dati si interrompe.',
    icon: 'Activity',
    color: 'from-rose-500 to-pink-500',
    bgColor: 'bg-rose-500/10',
    borderColor: 'border-rose-500/30',
    textColor: 'text-rose-400',
  },
};

export const CLOUD_PROVIDERS = {
  aws: {
    id: 'aws',
    label: 'AWS',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/30',
    accentColor: 'bg-orange-500',
  },
  azure: {
    id: 'azure',
    label: 'Azure',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    accentColor: 'bg-blue-500',
  },
  gcp: {
    id: 'gcp',
    label: 'GCP',
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/30',
    accentColor: 'bg-green-500',
  },
};

export const CLOUD_SERVICES = {
  ingestion: {
    aws: [
      { name: 'Kinesis Data Streams', description: 'Servizio di streaming real-time per raccogliere e processare grandi flussi di dati in tempo reale.' },
      { name: 'API Gateway', description: 'Porta d\'ingresso gestita per creare, pubblicare e proteggere API REST e WebSocket.' },
      { name: 'SQS', description: 'Coda di messaggi completamente gestita per il disaccoppiamento dei microservizi.' },
      { name: 'MSK (Kafka)', description: 'Apache Kafka gestito per lo streaming di eventi ad alta disponibilità.' },
    ],
    azure: [
      { name: 'Event Hubs', description: 'Piattaforma di streaming Big Data che può ricevere milioni di eventi al secondo.' },
      { name: 'API Management', description: 'Piattaforma per pubblicare, proteggere e analizzare API a qualsiasi scala.' },
      { name: 'Service Bus', description: 'Broker di messaggi enterprise per l\'integrazione cloud affidabile.' },
    ],
    gcp: [
      { name: 'Cloud Pub/Sub', description: 'Servizio di messaggistica e streaming in tempo reale per pattern event-driven.' },
      { name: 'Apigee', description: 'Piattaforma di gestione API per progettare, proteggere e scalare interfacce API.' },
    ],
  },
  processing: {
    aws: [
      { name: 'Lambda', description: 'Compute serverless che esegue codice in risposta a eventi senza provisioning di server.' },
      { name: 'Step Functions', description: 'Orchestrazione serverless per coordinare componenti distribuiti in workflow.' },
      { name: 'ECS Fargate', description: 'Motore di calcolo serverless per container senza gestione dell\'infrastruttura.' },
    ],
    azure: [
      { name: 'Azure Functions', description: 'Piattaforma di calcolo serverless event-driven per eseguire codice su trigger.' },
      { name: 'Logic Apps', description: 'Automazione e orchestrazione di workflow con connettori pre-costruiti.' },
      { name: 'Container Apps', description: 'Ambiente serverless per container con autoscaling automatico.' },
    ],
    gcp: [
      { name: 'Cloud Functions', description: 'Funzioni serverless event-driven per connettere e estendere servizi cloud.' },
      { name: 'Cloud Run', description: 'Piattaforma serverless per container stateless con autoscaling a zero.' },
      { name: 'Workflows', description: 'Orchestrazione di servizi cloud in flussi di lavoro serverless affidabili.' },
    ],
  },
  storage_nosql: {
    aws: [
      { name: 'DynamoDB', description: 'Database NoSQL key-value con latenze millisecondali a qualsiasi scala.' },
      { name: 'ElastiCache', description: 'Datastore in-memory per caching ultra-rapido con Redis o Memcached.' },
      { name: 'DocumentDB', description: 'Database documentale compatibile MongoDB completamente gestito.' },
    ],
    azure: [
      { name: 'Cosmos DB', description: 'Database NoSQL multi-modello distribuito globalmente con latenze < 10ms.' },
      { name: 'Cache for Redis', description: 'Cache in-memory gestita per prestazioni ultra-rapide.' },
    ],
    gcp: [
      { name: 'Firestore', description: 'Database documentale NoSQL serverless con sync in tempo reale.' },
      { name: 'Cloud Bigtable', description: 'Database NoSQL wide-column per workload analitici e operazionali su larga scala.' },
      { name: 'Memorystore', description: 'Servizio Redis e Memcached gestito per caching in-memory.' },
    ],
  },
  storage_object: {
    aws: [
      { name: 'S3', description: 'Object storage con durabilità 99.999999999% per qualsiasi quantità di dati.' },
      { name: 'S3 Glacier', description: 'Storage di archiviazione a lungo termine con costi ultra-bassi.' },
      { name: 'EFS', description: 'File system elastico serverless per workload basati su file.' },
    ],
    azure: [
      { name: 'Blob Storage', description: 'Object storage massivamente scalabile per dati non strutturati.' },
      { name: 'Data Lake Storage', description: 'Storage ottimizzato per analytics Big Data con namespace gerarchico.' },
      { name: 'Azure Files', description: 'File share cloud accessibili tramite protocollo SMB standard.' },
    ],
    gcp: [
      { name: 'Cloud Storage', description: 'Object storage unificato per dati strutturati e non, con classi di costo automatiche.' },
      { name: 'Filestore', description: 'File storage NFS gestito ad alte prestazioni per applicazioni.' },
    ],
  },
  monitoring: {
    aws: [
      { name: 'CloudWatch', description: 'Servizio di monitoraggio e osservabilità per metriche, log e allarmi.' },
      { name: 'X-Ray', description: 'Tracciamento distribuito per analizzare e debuggare applicazioni distribuite.' },
      { name: 'CloudTrail', description: 'Audit trail per governance, compliance e monitoraggio operativo dell\'account.' },
    ],
    azure: [
      { name: 'Azure Monitor', description: 'Piattaforma di osservabilità completa per metriche, log e tracce distribuite.' },
      { name: 'Application Insights', description: 'APM per monitorare le performance e diagnosticare problemi delle applicazioni.' },
      { name: 'Log Analytics', description: 'Motore di query per analisi avanzate su log e telemetria.' },
    ],
    gcp: [
      { name: 'Cloud Monitoring', description: 'Monitoraggio di metriche, uptime e salute dei servizi GCP e ibridi.' },
      { name: 'Cloud Logging', description: 'Gestione centralizzata dei log per analisi e troubleshooting in tempo reale.' },
      { name: 'Cloud Trace', description: 'Tracciamento distribuito per analizzare la latenza delle applicazioni.' },
    ],
  },
};

export const COHERENCE_RULES = [
  {
    id: 'direct_public_access',
    check: (nodes, connections) => {
      const processingNodes = nodes.filter(n => n.phase === 'processing');
      const ingestionNodes = nodes.filter(n => n.phase === 'ingestion');
      const warnings = [];
      
      processingNodes.forEach(proc => {
        const hasDirectExternalInput = connections.some(c => 
          c.to === proc.id && !ingestionNodes.some(i => i.id === c.from)
        );
        if (hasDirectExternalInput) {
          warnings.push({
            type: 'security',
            severity: 'high',
            message: `Il blocco "${proc.label || 'Elaborazione'}" riceve dati direttamente senza passare per un livello di Ingestione. Aggiungi un API Gateway o Event Hub come buffer.`,
            affectedNodes: [proc.id],
            suggestion: 'Aggiungi un blocco di Ingestione (API Gateway / Event Hubs / Pub/Sub) prima del processamento.',
          });
        }
      });
      return warnings;
    },
  },
  {
    id: 'no_monitoring',
    check: (nodes) => {
      const hasMonitoring = nodes.some(n => n.phase === 'monitoring');
      if (nodes.length >= 3 && !hasMonitoring) {
        return [{
          type: 'best_practice',
          severity: 'medium',
          message: 'L\'architettura non include un componente di Monitoraggio. È consigliabile aggiungere logging e alerting per la produzione.',
          suggestion: 'Aggiungi un blocco di Monitoraggio (CloudWatch / Azure Monitor / Cloud Monitoring).',
        }];
      }
      return [];
    },
  },
  {
    id: 'processing_without_storage',
    check: (nodes, connections) => {
      const processingNodes = nodes.filter(n => n.phase === 'processing');
      const storageNodes = nodes.filter(n => n.phase === 'storage_nosql' || n.phase === 'storage_object');
      const warnings = [];

      processingNodes.forEach(proc => {
        const hasStorageOutput = connections.some(c =>
          c.from === proc.id && storageNodes.some(s => s.id === c.to)
        );
        if (!hasStorageOutput && connections.some(c => c.from === proc.id)) {
          warnings.push({
            type: 'data_flow',
            severity: 'low',
            message: `Il blocco "${proc.label || 'Elaborazione'}" non scrive su nessuno Storage. I dati elaborati potrebbero andare persi.`,
            suggestion: 'Collega l\'output dell\'elaborazione a un blocco Storage (NoSQL o Object).',
          });
        }
      });
      return warnings;
    },
  },
];

export function checkCoherence(nodes, connections) {
  let allWarnings = [];
  COHERENCE_RULES.forEach(rule => {
    const warnings = rule.check(nodes, connections);
    allWarnings = [...allWarnings, ...warnings];
  });
  return allWarnings;
}

export function getDefaultService(phase, provider) {
  const services = CLOUD_SERVICES[phase]?.[provider];
  return services?.[0] || null;
}