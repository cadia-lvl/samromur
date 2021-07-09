import { ContributeType, Goal } from '../types/contribute';

/**
 * This file contains the different contribution packages.
 * Note that the name and text should contain the keys for
 * translations found in the
 * public/static/locale/current_language/contribute.json file
 */

export const speakGoals: Goal[] = [
    {
        contributeType: ContributeType.SPEAK,
        name: 'package-select.speak.small',
        text: 'package-select.speak.text',
        count: 10,
    },
    {
        contributeType: ContributeType.SPEAK,
        name: 'package-select.speak.medium',
        text: 'package-select.speak.text',
        count: 20,
    },
    {
        contributeType: ContributeType.SPEAK,
        name: 'package-select.speak.large',
        text: 'package-select.speak.text',
        count: 50,
    },
];

export const listenGoals: Goal[] = [
    {
        contributeType: ContributeType.LISTEN,
        name: 'package-select.listen.small',
        text: 'package-select.listen.text',
        count: 10,
    },
    {
        contributeType: ContributeType.LISTEN,
        name: 'package-select.listen.medium',
        text: 'package-select.listen.text',
        count: 20,
    },
    {
        contributeType: ContributeType.LISTEN,
        name: 'package-select.listen.large',
        text: 'package-select.listen.text',
        count: 50,
    },
];

export const repeatGoals: Goal[] = [
    {
        contributeType: ContributeType.REPEAT,
        name: 'package-select.repeat.small',
        text: 'package-select.repeat.text',
        count: 10,
    },
    {
        contributeType: ContributeType.REPEAT,
        name: 'package-select.repeat.medium',
        text: 'package-select.repeat.text',
        count: 20,
    },
    {
        contributeType: ContributeType.REPEAT,
        name: 'package-select.repeat.large',
        text: 'package-select.repeat.text',
        count: 50,
    },
];
