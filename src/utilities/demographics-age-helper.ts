import { ages } from '../constants/demographics';
import { Demographic } from '../types/user';

export enum AgeGroups {
    CHILDREN = 'kids',
    TEENAGERS = 'teens',
    ADULTS = 'adults',
}

// The string can be either a number or a string like tvitugt
// Our limits are:
// under 11: kids
// 11-15: teens
// 16+: adults
export const getAgeGroupFromString = (age: string) => {
    const parsed = parseInt(age, 10);
    if (!isNaN(parsed)) {
        if (parsed < 11) {
            return AgeGroups.CHILDREN;
        }
        if (parsed < 16) {
            return AgeGroups.TEENAGERS;
        }
    }
    return AgeGroups.ADULTS;
};

export const getAgeGroupFromDemographics = (demo: Demographic) => {
    return getAgeGroupFromString(demo.name);
};
