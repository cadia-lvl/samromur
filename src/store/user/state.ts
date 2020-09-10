import { Demographics, UserClient, UserConsents } from '../../types/user';

export interface UserState {
    client: UserClient;
    demographics: Demographics;
    userAgent: string;
    consents: UserConsents;
}