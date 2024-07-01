import { Router } from 'express';
import { createReservation, deleteReservation, getReservations, updateReservation } from '../controllers/reservationController';
import { body, param, query } from 'express-validator';

const router = Router();

router.post(
    '/reservations',
    [
        body('email').isEmail().withMessage('Invalid email format'),
        body('date').isISO8601().toDate().withMessage('Date must be in ISO8601 format'),
    ],
    createReservation
);

router.get(
    '/reservations',
    [
        query('startDate').isISO8601().withMessage('Start date must be in ISO8601 format'),
        query('endDate').isISO8601().withMessage('End date must be in ISO8601 format'),
        query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
        query('limit').optional().isInt({ min: 1 }).withMessage('Limit must be a positive integer'),
    ],
    getReservations
);

router.put(
    '/reservations/:id',
    [
        param('id').isInt().withMessage('ID must be an integer'),
        body('email').isEmail().withMessage('Invalid email format'),
        body('date').isISO8601().toDate().withMessage('Date must be in ISO8601 format'),
        body('table').isInt({ min: 1, max: 5 }).withMessage('Table must be an integer between 1 and 5'),
    ],
    updateReservation
);

router.delete(
    '/reservations/:id',
    [
        param('id').isInt().withMessage('ID must be an integer'),
    ],
    deleteReservation
);

export default router;
