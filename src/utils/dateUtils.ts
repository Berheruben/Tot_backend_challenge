import { Reservation } from '../entities/Reservation';

const OPENING_HOUR = 19;
const CLOSING_HOUR = 24;

export const isWithinOpeningHours = (date: Date): boolean => {
    const hour = date.getHours();
    return hour >= OPENING_HOUR && hour < CLOSING_HOUR;
};

export const findAvailableTable = (reservations: Reservation[]): number => {
    const occupiedTables = reservations.map((reservation) => reservation.table);
    return Array.from({ length: 5 }, (_, i) => i + 1).find((table) => !occupiedTables.includes(table)) ?? -1;
};
