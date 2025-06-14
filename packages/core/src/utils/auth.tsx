import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../temp_models/User.js';
import { AuthenticationError } from '../../../../src/types/error.tsx';

/**
 * Authentication and authorization module for the API.
 * Handles user registration, login, and session management.
 */

// JWT payload type
interface JWTPayload {
    sub: string;
    exp: number;
    iat: number;
}

// Database types
interface DBQuery<T> {
    filter: (condition: boolean) => DBQuery<T>;
    first: () => Promise<T | null>;
}

interface DB {
    query: <T>(entityName: string) => DBQuery<T>;
    add: (entity: unknown) => Promise<void>;
    commit: () => Promise<void>;
    rollback: () => Promise<void>;
    refresh: (entity: unknown) => Promise<void>;
}

interface AuthManager {
    registerUser(username: string, email: string, password: string): Promise<User>;
    loginUser(username: string, password: string): Promise<string>;
    verifyToken(token: string): Promise<JWTPayload>;
}

class AuthManagerImpl implements AuthManager {
    db: DB;
    secretKey: string;
    tokenExpireMinutes: number;

    constructor(db: DB, secretKey: string, tokenExpireMinutes: number = 60) {
        this.db = db;
        this.secretKey = secretKey;
        this.tokenExpireMinutes = tokenExpireMinutes;
    }

    async registerUser(username: string, email: string, password: string): Promise<User> {
        // Check if user already exists
        const existingUser = await this.db.query<User>('users')
            .filter(true) // This should be replaced with actual filter condition
            .first();

        if (existingUser) {
            // Using 409 Conflict status code, and a specific error code for user exists
            throw new AuthenticationError('User already exists', 409, undefined, undefined, 'USER_EXISTS');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = new User();
        user.username = username;
        user.email = email;
        user.hashedPassword = hashedPassword;

        await this.db.add(user);
        await this.db.commit();
        return user;
    }

    async loginUser(username: string, password: string): Promise<string> {
        const user = await this.db.query<User>('users')
            .filter(true) // This should be replaced with actual filter condition
            .first();

        if (!user || !user.hashedPassword || !(await bcrypt.compare(password, user.hashedPassword))) {
            throw new AuthenticationError('Invalid credentials', 401);
        }

        const payload = {
            sub: user.id,
            exp: Math.floor(Date.now() / 1000) + (this.tokenExpireMinutes * 60),
            iat: Math.floor(Date.now() / 1000)
        };

        return jwt.sign(payload, this.secretKey);
    }

    async verifyToken(token: string): Promise<JWTPayload> {
        try {
            const decoded = jwt.verify(token, this.secretKey) as JWTPayload;
            return decoded;
        } catch (error) {
            throw new AuthenticationError('Invalid token', 401);
        }
    }
}

export { AuthManagerImpl };
