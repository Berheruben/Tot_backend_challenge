import { Request, Response } from 'express';
import { AppDataSource } from '../dataSource';
import { Reservation } from '../entities/Reservation';
import { User } from '../entities/User';
import { Between, Repository } from 'typeorm';
import { validationResult } from 'express-validator';
import { isWithinOpeningHours, findAvailableTable } from '../utils/dateUtils';

const TOTAL_TABLES = 5;

export const createReservation = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, date } = req.body;
    const reservationRepository = AppDataSource.getRepository(Reservation);
    const userRepository = AppDataSource.getRepository(User);

    try {
        const user = await userRepository.findOneBy({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        if (!isWithinOpeningHours(new Date(date))) {
            return res.status(400).json({ message: 'Reservation time is outside of opening hours' });
        }

        const existingReservations = await reservationRepository.find({
            where: { date: new Date(date) },
        });

        if (existingReservations.length >= TOTAL_TABLES) {
            return res.status(400).json({ message: 'No tables available' });
        }

        const table = findAvailableTable(existingReservations);
        if (table === -1) {
            return res.status(400).json({ message: 'No tables available' });
        }

        const reservation = new Reservation(new Date(date), user, table);

        await reservationRepository.save(reservation);
        return res.status(201).json(reservation);
    } catch (error) {
        return res.status(500).json({ message: error });
    }
};

export const getReservations = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { startDate, endDate, page = 1, limit = 10 } = req.query;

    if (new Date(startDate as string) >= new Date(endDate as string)) {
        return res.status(400).json({ message: "'startDate' must be before 'endDate'" });
    }

    const reservationRepository = AppDataSource.getRepository(Reservation);

    try {
        const [result, total] = await reservationRepository.findAndCount({
            where: {
                date: Between(new Date(startDate as string), new Date(endDate as string)),
            },
            relations: ['user'],
            take: Number(limit),
            skip: (Number(page) - 1) * Number(limit),
        });

        if (total === 0) {
            return res.status(404).json({ message: 'No reservations found for the given date range' });
        }

        return res.status(200).json({
            data: result,
            total,
            page: Number(page),
            limit: Number(limit),
        });
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }

};

export const updateReservation = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { email, date, table } = req.body;

    const reservationRepository: Repository<Reservation> = AppDataSource.getRepository(Reservation);
    const userRepository: Repository<User> = AppDataSource.getRepository(User);

    try {
        const reservation = await reservationRepository.findOne({ where: { id: Number(id) }, relations: ['user'] });
        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        const user = await userRepository.findOneBy({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        if (!isWithinOpeningHours(new Date(date))) {
            return res.status(400).json({ message: 'Reservation time is outside of opening hours' });
        }

        reservation.date = new Date(date);
        reservation.user = user;
        reservation.table = table;

        await reservationRepository.save(reservation);
        return res.status(200).json(reservation);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};


export const deleteReservation = async (req: Request, res: Response) => {
    const { id } = req.params;
    const reservationRepository = AppDataSource.getRepository(Reservation);

    try {
        const reservation = await reservationRepository.findOneBy({ id: Number(id) });
        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        await reservationRepository.remove(reservation);
        return res.status(200).json({ message: 'Reservation deleted successfully' });
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};
