export interface VoltageReading {
      timestamp: string;
      voltage: string;
}
    
export interface Transformer {
      assetId: number;
      name: string;
      region: string;
      health: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Critical';
      lastTenVoltgageReadings: VoltageReading[];
}
    