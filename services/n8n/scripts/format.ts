export interface ServiceHealthInput {
  name?: string;
  status: 'UP' | 'DOWN';
}

export interface ServiceHealthOutput {
  statusText: string;
  serviceName: string;
  timestamp: string;
}

export function formatServiceHealth(input: ServiceHealthInput): ServiceHealthOutput {
  return {
    statusText: input.status === 'UP' ? 'The service is working' : 'The service is not working',
    serviceName: input.name || 'Unknown',
    timestamp: new Date().toISOString()
  };
}
