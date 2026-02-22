import { format } from 'date-fns';

export type EventLogItem = {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'warning' | 'danger';
};

export type TelemetryDataPoint = {
  time: string;
  value: number; // -1 to 1 scale, where 0.8 is great and -0.8 is bad
};

export const generateInitialData = (count: number = 20): TelemetryDataPoint[] => {
  const data: TelemetryDataPoint[] = [];
  const now = new Date();
  for (let i = count; i > 0; i--) {
    const time = new Date(now.getTime() - i * 1000);
    data.push({
      time: format(time, 'HH:mm:ss'),
      value: 0.5 + Math.random() * 0.4, // Healthy range
    });
  }
  return data;
};

export const generateNextDataPoint = (prevTime: string, isCritical: boolean): TelemetryDataPoint => {
    // Parse previous time just to increment, or just use current time
    const now = new Date();
    const value = isCritical 
        ? -0.4 - Math.random() * 0.5 // range -0.4 to -0.9
        : 0.4 + Math.random() * 0.5; // range 0.4 to 0.9

    return {
        time: format(now, 'HH:mm:ss'),
        value: Number(value.toFixed(2)),
    };
};
