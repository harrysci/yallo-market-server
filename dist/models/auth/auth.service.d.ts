import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
export declare class AuthService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    testFunc(): Promise<User>;
}
