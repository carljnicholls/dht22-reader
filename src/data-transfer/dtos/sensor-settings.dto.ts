export interface SensorSettingsDto {
    pin: number;
    url: string;
    topic: string;
    interval: number | undefined;
}