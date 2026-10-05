import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface AnimalRecord {
    movement_level: string;
    temperature: number;
    animal_id: string;
    farm_id: string;
    detected_condition: string;
    health_status: string;
    timestamp: bigint;
    cough_count: bigint;
    species: string;
    location: string;
    heart_rate: bigint;
}
export interface Alert {
    animal_id: string;
    alert_id: string;
    message: string;
    timestamp: bigint;
    severity: string;
}
export interface backendInterface {
    clearOldRecords(keepCount: bigint): Promise<void>;
    getAlerts(): Promise<Array<Alert>>;
    getRecords(): Promise<Array<AnimalRecord>>;
    getStats(): Promise<{
        totalAlerts: bigint;
        totalRecords: bigint;
    }>;
    submitAlert(alert: Alert): Promise<void>;
    submitRecord(record: AnimalRecord): Promise<void>;
}
