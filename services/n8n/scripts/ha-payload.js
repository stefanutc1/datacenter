const inputData = $input.item.json;

const zoneId = inputData.zone || "sector_1"; 
const requestedDurationMinutes = inputData.duration || 15; 
const soilMoisture = inputData.soil_moisture || 45; 

let shouldWater = true;
let actionMessage = "Pornire irigație normală.";

if (soilMoisture > 60) {
    shouldWater = false;
    actionMessage = `Irigație anulată: Solul este suficient de umed (${soilMoisture}%).`;
}

const homeAssistantPayload = {
    entity_id: `switch.irrigation_${zoneId}`,
    duration: shouldWater ? requestedDurationMinutes * 60 : 0 
};

return {
    json: {
        endpoint: shouldWater ? "services/switch/turn_on" : "services/switch/turn_off",
        payload: homeAssistantPayload,
        metadata: {
            zone: zoneId,
            status: shouldWater ? "RUNNING" : "SKIPPED",
            reason: actionMessage,
            timestamp: new Date().toISOString()
        }
    }
};
