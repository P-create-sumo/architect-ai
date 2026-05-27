// Monthly cost estimates (USD) per service — approximate, based on typical small/medium workload
// Sources: AWS/Azure/GCP public pricing pages (pay-as-you-go, medium usage)

export const SERVICE_COSTS = {
  // ── AWS ──
  aws_route53:        { min: 1,    max: 10,   label: 'DNS hosted zone + queries' },
  aws_waf:            { min: 10,   max: 50,   label: 'Web ACL + rules' },
  aws_api_gateway:    { min: 5,    max: 80,   label: 'API calls (~1M req/mo)' },
  aws_lambda:         { min: 0,    max: 30,   label: 'Serverless compute (free tier incl.)' },
  aws_vpc_endpoint:   { min: 7,    max: 20,   label: 'VPC Endpoint/ora' },
  aws_cloudwatch:     { min: 5,    max: 30,   label: 'Logs + metriche' },
  aws_textract:       { min: 15,   max: 100,  label: '~1000 pagine/mo' },
  aws_rekognition:    { min: 10,   max: 60,   label: '~10k immagini/mo' },
  aws_bedrock:        { min: 20,   max: 200,  label: 'LLM calls (dipende dal modello)' },
  aws_bedrock_kb:     { min: 10,   max: 80,   label: 'Knowledge Base + sync' },
  aws_s3:             { min: 2,    max: 25,   label: '100GB storage + transfer' },
  aws_dynamodb:       { min: 2,    max: 50,   label: 'On-demand reads/writes' },
  aws_kinesis:        { min: 15,   max: 90,   label: 'Data stream shard + PUT' },
  aws_sqs:            { min: 0,    max: 20,   label: '~1M messaggi/mo' },
  aws_sns:            { min: 1,    max: 15,   label: 'Notifiche pub/sub' },
  aws_ecs:            { min: 20,   max: 150,  label: 'Container Fargate' },
  aws_eks:            { min: 70,   max: 250,  label: 'Cluster K8s managed' },
  aws_rds:            { min: 25,   max: 200,  label: 'db.t3.medium Multi-AZ' },
  aws_elasticache:    { min: 20,   max: 100,  label: 'cache.t3.micro Redis' },
  aws_cloudfront:     { min: 1,    max: 30,   label: 'CDN transfer + req' },
  aws_cognito:        { min: 0,    max: 25,   label: 'MAU free tier incl.' },
  aws_secrets_manager:{ min: 2,    max: 15,   label: 'Per secret/mo' },
  aws_step_functions: { min: 0,    max: 20,   label: 'State transitions' },
  aws_glue:           { min: 10,   max: 80,   label: 'ETL DPU-hours' },
  aws_opensearch:     { min: 20,   max: 120,  label: 't3.small.search cluster' },

  // ── AZURE ──
  az_api_management:  { min: 10,   max: 100,  label: 'Developer tier' },
  az_functions:       { min: 0,    max: 25,   label: 'Consumption plan' },
  az_event_hubs:      { min: 10,   max: 60,   label: 'Basic tier, 1 TU' },
  az_cosmos_db:       { min: 25,   max: 150,  label: '400 RU/s provisioned' },
  az_blob_storage:    { min: 2,    max: 30,   label: '100GB LRS' },
  az_monitor:         { min: 5,    max: 40,   label: 'Log Analytics workspace' },
  az_openai:          { min: 20,   max: 200,  label: 'GPT-4o API calls' },
  az_service_bus:     { min: 5,    max: 30,   label: 'Standard tier' },
  az_aks:             { min: 70,   max: 300,  label: 'Managed K8s cluster' },

  // ── GCP ──
  gcp_pubsub:         { min: 0,    max: 30,   label: '10GB messaggi/mo' },
  gcp_functions:      { min: 0,    max: 20,   label: 'Invocazioni free tier incl.' },
  gcp_firestore:      { min: 0,    max: 25,   label: 'Reads/writes/storage' },
  gcp_storage:        { min: 2,    max: 25,   label: '100GB Standard' },
  gcp_bigquery:       { min: 0,    max: 50,   label: '1TB query/mo (free 10GB)' },
  gcp_apigee:         { min: 30,   max: 150,  label: 'Eval/Pay-as-you-go' },
  gcp_vertex_ai:      { min: 20,   max: 200,  label: 'Training + prediction' },
  gcp_run:            { min: 0,    max: 20,   label: 'vCPU-sec free tier incl.' },
  gcp_monitoring:     { min: 0,    max: 15,   label: 'Metrics oltre free tier' },
};

export function estimateCosts(nodes) {
  const byProvider = {};

  for (const node of nodes) {
    const cost = SERVICE_COSTS[node.serviceId];
    if (!cost) continue;
    // Use midpoint as "typical" estimate
    const typical = Math.round((cost.min + cost.max) / 2);

    // Determine provider from serviceId prefix
    const provider = node.serviceId.startsWith('aws_') ? 'aws'
                   : node.serviceId.startsWith('az_') ? 'azure'
                   : node.serviceId.startsWith('gcp_') ? 'gcp'
                   : 'other';

    if (!byProvider[provider]) {
      byProvider[provider] = { total: 0, items: [] };
    }
    byProvider[provider].total += typical;
    byProvider[provider].items.push({
      serviceId: node.serviceId,
      typical,
      min: cost.min,
      max: cost.max,
      label: cost.label,
    });
  }

  return byProvider;
}