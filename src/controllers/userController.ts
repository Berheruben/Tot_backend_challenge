import { Request, Response } from 'express';
import { AppDataSource } from '../dataSource';
import { User } from '../entities/User';
import { validationResult } from 'express-validator';

export const createUser = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email } = req.body;
    const userRepository = AppDataSource.getRepository(User);

    try {
        const existingUser = await userRepository.findOneBy({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = new User(email, name);

        await userRepository.save(user);
        return res.status(201).json(user);
    } catch (error) {
        return res.status(500).json({ message: error });
    }
};

export const getUsers = async (req: Request, res: Response) => {
    const userRepository = AppDataSource.getRepository(User);

    try {
        const users = await userRepository.find();
        return res.status(200).json(users);
    } catch (error:any) {
        return res.status(500).json({ message: error.message });
    }
};

export const getUser = async (req: Request, res: Response) => {
    const { email } = req.params;
    const userRepository = AppDataSource.getRepository(User);

    try {
        const user = await userRepository.findOneBy({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json(user);
    } catch (error:any) {
        return res.status(500).json({ message: error.message });
    }
};
