export interface Goal {
    contributeType: string;
    name: string;
    text: string;
    count: number;
}

export enum WheelColor {
    BLUE = 'BLUE',
    RED = 'RED',
    GREEN = 'GREEN',
    GRAY = 'GRAY',
}

export enum ContributeType {
    LISTEN = 'hlusta',
    SPEAK = 'tala',
    REPEAT = 'herma',
}
