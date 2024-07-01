import { Router } from 'express';
import { createUser, getUser, getUsers } from '../controllers/userController';
import { body, param } from 'express-validator';

const router = Router();

router.post(
    '/users',
    [
        body('name').isString().notEmpty().withMessage('Name is required and must be a string'),
        body('email').isEmail().withMessage('Invalid email format'),
    ],
    createUser
);
router.get('/users', getUsers);

router.get(
    '/users/:email',
    [
        param('email').isEmail().withMessage('Invalid email format'),
    ],
    getUser
);

export default router;
