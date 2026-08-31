export interface IrrigationInput {
  zone?: string;
  duration?: number;
  soil_moisture?: number;
}

export interface HomeAssistantPayload {
  entity_id: string;
  duration: number;
}

export interface IrrigationOutput {
  endpoint: 'services/switch/turn_on' | 'services/switch/turn_off';
  payload: HomeAssistantPayload;
  metadata: {
    zone: string;
    status: 'RUNNING' | 'SKIPPED';
    reason: string;
    timestamp: string;
  };
}

export function generateIrrigationPayload(input: IrrigationInput): IrrigationOutput {
  const zoneId = input.zone || 'sector_1';
  const requestedDurationMinutes = input.duration || 15;
  const soilMoisture = input.soil_moisture || 45;

  let shouldWater = true;
  let actionMessage = 'Pornire irigație normală.';

  if (soilMoisture > 60) {
    shouldWater = false;
    actionMessage = `Irigație anulată: Solul este suficient de umed (${soilMoisture}%).`;
  }

  const payload: HomeAssistantPayload = {
    entity_id: `switch.irrigation_${zoneId}`,
    duration: shouldWater ? requestedDurationMinutes * 60 : 0
  };

  return {
    endpoint: shouldWater ? 'services/switch/turn_on' : 'services/switch/turn_off',
    payload,
    metadata: {
      zone: zoneId,
      status: shouldWater ? 'RUNNING' : 'SKIPPED',
      reason: actionMessage,
      timestamp: new Date().toISOString()
    }
  };
}
