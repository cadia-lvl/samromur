import { AgeStat, GenderStat } from '../types/competition';
import { TimelineStat } from '../types/stats';

// Dates from Reddum malinu
// export const startTime = new Date(2021, 10, 8, 0, 0, 0, 0);
// export const lastDay = new Date(2021, 10, 15, 0, 0, 0);
// export const endTime = new Date(2021, 10, 16, 0, 0, 0);
// export const signUpStart = new Date(2021, 10, 1, 0, 0, 0);
export const preStartTime = new Date(2021, 10, 2, 0, 0, 0);
export const preLastDay = new Date(2021, 10, 7, 0, 0, 0);
export const preEndTime = new Date(2021, 10, 8, 0, 0, 0);

export const startTime = new Date(2022, 0, 20, 15, 0, 0, 0);
export const lastDay = new Date(2022, 0, 26, 0, 0, 0);
export const endTime = new Date(2022, 0, 27, 0, 0, 0);
export const suspenseTime = new Date(2022, 0, 26, 14, 0, 0);
export const revealTime = new Date(2022, 0, 27, 11, 5, 0);

export const defaultTimeline: TimelineStat[] = [
    { date: '2022-01-20', count: 0 },
    { date: '2022-01-21', count: 0 },
    { date: '2022-01-22', count: 0 },
    { date: '2022-01-23', count: 0 },
    { date: '2022-01-24', count: 0 },
    { date: '2022-01-25', count: 0 },
    { date: '2022-01-26', count: 0 },
];

export const preDefaultTimeline: TimelineStat[] = [
    { date: '2021-11-02', count: 0 },
    { date: '2021-11-03', count: 0 },
    { date: '2021-11-04', count: 0 },
    { date: '2021-11-05', count: 0 },
    { date: '2021-11-06', count: 0 },
    { date: '2021-11-07', count: 0 },
];

export const defaultGenderStats: GenderStat[] = [
    { gender: 'kona', count: 0 },
    { gender: 'karl', count: 0 },
    { gender: 'annad', count: 0 },
];

export const defaultAgeStats: AgeStat[] = [
    { age: '0-9 ára', count: 0 },
    { age: '10-12 ára', count: 0 },
    { age: '13-17 ára', count: 0 },
    { age: '18-19 ára', count: 0 },
    { age: '20-29 ára', count: 0 },
    { age: '30-39 ára', count: 0 },
    { age: '40-49 ára', count: 0 },
    { age: '50-59 ára', count: 0 },
    { age: '60-69 ára', count: 0 },
    { age: '70-79 ára', count: 0 },
    { age: '80-89 ára', count: 0 },
    { age: '90+ ára', count: 0 },
];

export const ASSOCIATION_OF_THE_DYSLEXIC: string =
    '0fe8273c-2492-4508-8716-f9249e891aea';

export enum CompetitionTypes {
    SCHOOL = 'SCHOOL',
    COMPANY = 'COMPANY',
}

export const gk2022timeline = [
    { date: '2022-01-20', count: 24082 },
    { date: '2022-01-21', count: 74613 },
    { date: '2022-01-22', count: 60960 },
    { date: '2022-01-23', count: 94637 },
    { date: '2022-01-24', count: 197682 },
    { date: '2022-01-25', count: 337638 },
    { date: '2022-01-26', count: 487963 },
];

export const gk2022scoreboard = [
    {
        name: 'Smáraskóli',
        size: 'medium',
        users: 914,
        count: 236470,
        rank: 1,
    },
    {
        name: 'Sandgerðisskóli',
        size: 'medium',
        users: 593,
        count: 208535,
        rank: 2,
    },
    {
        name: 'Höfðaskóli',
        size: 'small',
        users: 353,
        count: 153288,
        rank: 3,
    },
    {
        name: 'Öxarfjarðarskóli',
        size: 'small',
        users: 285,
        count: 147189,
        rank: 4,
    },
    {
        name: 'Salaskóli',
        size: 'large',
        users: 703,
        count: 107075,
        rank: 5,
    },
    {
        name: 'Gerðaskóli',
        size: 'medium',
        users: 406,
        count: 89336,
        rank: 6,
    },
    {
        name: 'Lækjarskóli',
        size: 'large',
        users: 348,
        count: 51155,
        rank: 7,
    },
    {
        name: 'Lindaskóli',
        size: 'large',
        users: 269,
        count: 38944,
        rank: 8,
    },
    {
        name: 'Fellaskóli (Reykjavík)',
        size: 'medium',
        users: 150,
        count: 31233,
        rank: 9,
    },
    {
        name: 'Borgaskóli',
        size: 'large',
        users: 154,
        count: 31045,
        rank: 10,
    },
    {
        name: 'Grunnskólinn á Þórshöfn',
        size: 'small',
        users: 145,
        count: 24840,
        rank: 11,
    },
    {
        name: 'Grunnskóli Bolungarvíkur',
        size: 'medium',
        users: 124,
        count: 20720,
        rank: 12,
    },
    {
        name: 'Grenivíkurskóli',
        size: 'small',
        users: 113,
        count: 15312,
        rank: 13,
    },
    {
        name: 'Setbergsskóli',
        size: 'large',
        users: 99,
        count: 11680,
        rank: 14,
    },
    {
        name: 'Grunnskólinn á Blönduósi/Blönduskóli',
        size: 'medium',
        users: 73,
        count: 7050,
        rank: 15,
    },
    {
        name: 'Álfhólsskóli',
        size: 'large',
        users: 75,
        count: 6897,
        rank: 16,
    },
    {
        name: 'Grunnskóli Seltjarnarness',
        size: 'large',
        users: 45,
        count: 6872,
        rank: 17,
    },
    {
        name: 'Grunnskólinn í Hveragerði',
        size: 'medium',
        users: 64,
        count: 6100,
        rank: 18,
    },
    {
        name: 'Hofsstaðaskóli',
        size: 'large',
        users: 47,
        count: 5225,
        rank: 19,
    },
    {
        name: 'Bláskógaskóli - Reykholti',
        size: 'small',
        users: 44,
        count: 5057,
        rank: 20,
    },
    {
        name: 'Síðuskóli',
        size: 'medium',
        users: 63,
        count: 4805,
        rank: 21,
    },
    {
        name: 'Breiðagerðisskóli',
        size: 'medium',
        users: 33,
        count: 4664,
        rank: 22,
    },
    {
        name: 'Brekkuskóli',
        size: 'large',
        users: 37,
        count: 4342,
        rank: 23,
    },
    {
        name: 'Vopnafjarðarskóli',
        size: 'small',
        users: 24,
        count: 3778,
        rank: 24,
    },
    {
        name: 'Njarðvíkurskóli',
        size: 'medium',
        users: 33,
        count: 3218,
        rank: 25,
    },
    {
        name: 'Suðurhlíðarskóli',
        size: 'small',
        users: 26,
        count: 3059,
        rank: 26,
    },
    {
        name: 'Lágafellsskóli',
        size: 'large',
        users: 13,
        count: 2960,
        rank: 27,
    },
    {
        name: 'Grandaskóli',
        size: 'medium',
        users: 4,
        count: 2426,
        rank: 28,
    },
    {
        name: 'Nesskóli',
        size: 'medium',
        users: 11,
        count: 2380,
        rank: 29,
    },
    {
        name: 'Þelamerkurskóli',
        size: 'small',
        users: 20,
        count: 2113,
        rank: 30,
    },
    {
        name: 'Stóru-Vogaskóli',
        size: 'medium',
        users: 27,
        count: 1670,
        rank: 31,
    },
    {
        name: 'Fossvogsskóli',
        size: 'medium',
        users: 22,
        count: 1549,
        rank: 32,
    },
    {
        name: 'Valsárskóli',
        size: 'small',
        users: 8,
        count: 1410,
        rank: 33,
    },
    {
        name: 'Sunnulækjarskóli',
        size: 'large',
        users: 4,
        count: 1342,
        rank: 34,
    },
    {
        name: 'Kársnesskóli',
        size: 'large',
        users: 7,
        count: 1287,
        rank: 35,
    },
    {
        name: 'Grunnskólinn á Hellu',
        size: 'medium',
        users: 6,
        count: 1195,
        rank: 36,
    },
    {
        name: 'Öldutúnsskóli',
        size: 'large',
        users: 44,
        count: 1191,
        rank: 37,
    },
    {
        name: 'Grunnskólinn á Hólmavík',
        size: 'small',
        users: 6,
        count: 1171,
        rank: 38,
    },
    {
        name: 'Myllubakkaskóli',
        size: 'medium',
        users: 20,
        count: 1155,
        rank: 39,
    },
    {
        name: 'Álftanesskóli',
        size: 'large',
        users: 7,
        count: 1127,
        rank: 40,
    },
    {
        name: 'Laugalandsskóli í Holtum',
        size: 'small',
        users: 7,
        count: 1112,
        rank: 41,
    },
    {
        name: 'Grunnskólinn á Eskifirði',
        size: 'medium',
        users: 13,
        count: 1073,
        rank: 42,
    },
    {
        name: 'Grunnskólinn á Raufarhöfn',
        size: 'small',
        users: 16,
        count: 963,
        rank: 43,
    },
    {
        name: 'Grunnskóli Borgarfjarðar',
        size: 'medium',
        users: 8,
        count: 912,
        rank: 44,
    },
    {
        name: 'Hlíðaskóli',
        size: 'large',
        users: 21,
        count: 856,
        rank: 45,
    },
    {
        name: 'Grunnskóli Fjallabyggðar',
        size: 'medium',
        users: 11,
        count: 685,
        rank: 46,
    },
    {
        name: 'Norðlingaskóli',
        size: 'large',
        users: 10,
        count: 685,
        rank: 47,
    },
    {
        name: 'Garðaskóli',
        size: 'large',
        users: 6,
        count: 672,
        rank: 48,
    },
    {
        name: 'Ingunnarskóli',
        size: 'large',
        users: 5,
        count: 671,
        rank: 49,
    },
    {
        name: 'Ölduselsskóli',
        size: 'large',
        users: 8,
        count: 575,
        rank: 50,
    },
    {
        name: 'Engjaskóli',
        size: 'medium',
        users: 2,
        count: 500,
        rank: 51,
    },
    {
        name: 'Glerárskóli',
        size: 'medium',
        users: 7,
        count: 499,
        rank: 52,
    },
    {
        name: 'Heiðarskóli (Reykjanesbæ)',
        size: 'large',
        users: 10,
        count: 459,
        rank: 53,
    },
    {
        name: 'Grunnskóli Grundarfjarðar',
        size: 'small',
        users: 3,
        count: 413,
        rank: 54,
    },
    {
        name: 'Hraunvallaskóli',
        size: 'large',
        users: 5,
        count: 398,
        rank: 55,
    },
    {
        name: 'Breiðholtsskóli',
        size: 'large',
        users: 5,
        count: 345,
        rank: 56,
    },
    {
        name: 'Langholtsskóli',
        size: 'large',
        users: 5,
        count: 314,
        rank: 57,
    },
    {
        name: 'Melaskóli',
        size: 'large',
        users: 5,
        count: 283,
        rank: 58,
    },
    {
        name: 'Víðistaðaskóli',
        size: 'large',
        users: 9,
        count: 224,
        rank: 59,
    },
    {
        name: 'Vogaskóli',
        size: 'medium',
        users: 2,
        count: 220,
        rank: 60,
    },
    {
        name: 'Laugarnesskóli',
        size: 'large',
        users: 6,
        count: 218,
        rank: 61,
    },
    {
        name: 'Kópavogsskóli',
        size: 'medium',
        users: 5,
        count: 215,
        rank: 62,
    },
    {
        name: 'Holtaskóli',
        size: 'large',
        users: 9,
        count: 213,
        rank: 63,
    },
    {
        name: 'Rimaskóli',
        size: 'large',
        users: 2,
        count: 168,
        rank: 64,
    },
    {
        name: 'Borgarhólsskóli',
        size: 'medium',
        users: 6,
        count: 164,
        rank: 65,
    },
    {
        name: 'Laugalækjarskóli',
        size: 'large',
        users: 3,
        count: 130,
        rank: 66,
    },
    {
        name: 'Ártúnsskóli',
        size: 'medium',
        users: 5,
        count: 120,
        rank: 67,
    },
    {
        name: 'Klébergsskóli',
        size: 'medium',
        users: 4,
        count: 119,
        rank: 68,
    },
    {
        name: 'Grundaskóli',
        size: 'large',
        users: 3,
        count: 110,
        rank: 69,
    },
    {
        name: 'Landakotsskóli',
        size: 'medium',
        users: 1,
        count: 109,
        rank: 70,
    },
    {
        name: 'Árskóli',
        size: 'medium',
        users: 4,
        count: 103,
        rank: 71,
    },
    {
        name: 'Barnaskóli Hjallastefnunnar við Hjallabraut',
        size: 'small',
        users: 1,
        count: 101,
        rank: 72,
    },
    {
        name: 'Bláskógaskóli - Laugarvatni',
        size: 'small',
        users: 1,
        count: 100,
        rank: 73,
    },
    {
        name: 'Lundarskóli',
        size: 'large',
        users: 4,
        count: 97,
        rank: 74,
    },
    {
        name: 'Álftamýrarskóli',
        size: 'medium',
        users: 5,
        count: 94,
        rank: 75,
    },
    {
        name: 'Barnaskóli Hjallastefnunnar Reykjavík',
        size: 'small',
        users: 3,
        count: 93,
        rank: 76,
    },
    {
        name: 'Alþjóðaskólinn á Íslandi',
        size: 'small',
        users: 6,
        count: 84,
        rank: 77,
    },
    {
        name: 'NÚ',
        size: 'small',
        users: 3,
        count: 80,
        rank: 78,
    },
    {
        name: 'Háteigsskóli',
        size: 'large',
        users: 4,
        count: 66,
        rank: 79,
    },
    {
        name: 'Grunnskólinn á Ísafirði',
        size: 'medium',
        users: 2,
        count: 66,
        rank: 80,
    },
    {
        name: 'Sjálandsskóli',
        size: 'medium',
        users: 1,
        count: 63,
        rank: 81,
    },
    {
        name: 'Flataskóli',
        size: 'large',
        users: 1,
        count: 52,
        rank: 82,
    },
    {
        name: 'Foldaskóli',
        size: 'large',
        users: 2,
        count: 51,
        rank: 83,
    },
    {
        name: 'Árbæjarskóli',
        size: 'large',
        users: 1,
        count: 50,
        rank: 84,
    },
    {
        name: 'Bíldudalsskóli',
        size: 'small',
        users: 2,
        count: 48,
        rank: 85,
    },
    {
        name: 'Húsaskóli',
        size: 'medium',
        users: 2,
        count: 43,
        rank: 86,
    },
    {
        name: 'Áslandsskóli',
        size: 'large',
        users: 1,
        count: 41,
        rank: 87,
    },
    {
        name: 'Dalvíkurskóli',
        size: 'medium',
        users: 5,
        count: 36,
        rank: 88,
    },
    {
        name: 'Háaleitisskóli (Reykjanesbæ)',
        size: 'medium',
        users: 2,
        count: 35,
        rank: 89,
    },
    {
        name: 'Brekkubæjarskóli',
        size: 'large',
        users: 2,
        count: 30,
        rank: 90,
    },
    {
        name: 'Grunnskóli Fáskrúðsfjarðar',
        size: 'small',
        users: 1,
        count: 30,
        rank: 91,
    },
    {
        name: 'Víkurskóli',
        size: 'medium',
        users: 1,
        count: 28,
        rank: 92,
    },
    {
        name: 'Hvolsskóli',
        size: 'medium',
        users: 1,
        count: 28,
        rank: 93,
    },
    {
        name: 'Grunnskólinn á Tálknafirði',
        size: 'small',
        users: 2,
        count: 24,
        rank: 94,
    },
    {
        name: 'Hagaskóli',
        size: 'large',
        users: 1,
        count: 20,
        rank: 95,
    },
    {
        name: 'Hörðuvallaskóli',
        size: 'large',
        users: 1,
        count: 20,
        rank: 96,
    },
    {
        name: 'Snælandsskóli',
        size: 'large',
        users: 2,
        count: 20,
        rank: 97,
    },
    {
        name: 'Kirkjubæjarskóli',
        size: 'small',
        users: 2,
        count: 20,
        rank: 98,
    },
    {
        name: 'Varmárskóli',
        size: 'large',
        users: 1,
        count: 20,
        rank: 99,
    },
    {
        name: 'Grunnskóli Vestmannaeyja',
        size: 'large',
        users: 2,
        count: 15,
        rank: 100,
    },
    {
        name: 'Akurskóli',
        size: 'large',
        users: 3,
        count: 12,
        rank: 101,
    },
    {
        name: 'Dalskóli',
        size: 'medium',
        users: 2,
        count: 12,
        rank: 102,
    },
    {
        name: 'Barnaskóli Hjallastefnunnar á Vífilsstöðum',
        size: 'small',
        users: 1,
        count: 11,
        rank: 103,
    },
    {
        name: 'Vesturbæjarskóli',
        size: 'medium',
        users: 1,
        count: 11,
        rank: 104,
    },
    {
        name: 'Vallaskóli',
        size: 'large',
        users: 1,
        count: 11,
        rank: 105,
    },
    {
        name: 'Urriðaholtsskóli',
        size: 'small',
        users: 1,
        count: 10,
        rank: 106,
    },
    {
        name: 'Reykjahlíðarskóli',
        size: 'small',
        users: 1,
        count: 10,
        rank: 107,
    },
    {
        name: 'Flúðaskóli',
        size: 'small',
        users: 1,
        count: 10,
        rank: 108,
    },
    {
        name: 'Fellaskóli (Fellabæ)',
        size: 'small',
        users: 1,
        count: 10,
        rank: 109,
    },
    {
        name: 'Seljaskóli',
        size: 'large',
        users: 1,
        count: 10,
        rank: 110,
    },
    {
        name: 'Naustaskóli',
        size: 'medium',
        users: 1,
        count: 7,
        rank: 111,
    },
    {
        name: 'Vatnsendaskóli',
        size: 'large',
        users: 1,
        count: 5,
        rank: 112,
    },
    {
        name: 'Skarðshlíðarskóli',
        size: 'medium',
        users: 1,
        count: 3,
        rank: 113,
    },
    {
        name: 'Arnarskóli',
        size: 'small',
        users: 1,
        count: 2,
        rank: 114,
    },
    {
        name: 'Breiðdals- og Stöðvarfjarðarskóli',
        size: 'small',
        users: 1,
        count: 1,
        rank: 115,
    },
    {
        name: 'Grunnskóli Djúpavogs/Djúpavogsskóli',
        size: 'small',
        users: 1,
        count: 1,
        rank: 116,
    },
    {
        name: 'Oddeyrarskóli',
        size: 'medium',
        users: 1,
        count: 1,
        rank: 117,
    },
    {
        name: 'Grunnskóli Grindavíkur',
        size: 'large',
        users: 1,
        count: 1,
        rank: 118,
    },
    {
        name: 'Auðarskóli',
        size: 'small',
        count: 0,
        users: 0,
        rank: 119,
    },
    {
        name: 'Austurbæjarskóli',
        size: 'large',
        count: 0,
        users: 0,
        rank: 120,
    },
    {
        name: 'Árskógarskóli',
        size: 'small',
        count: 0,
        users: 0,
        rank: 121,
    },
    {
        name: 'Barnaskólinn á Eyrarbakka og Stokkseyri',
        size: 'medium',
        count: 0,
        users: 0,
        rank: 122,
    },
    {
        name: 'Brúarásskóli',
        size: 'small',
        count: 0,
        users: 0,
        rank: 123,
    },
    {
        name: 'Brúarskóli',
        size: 'small',
        count: 0,
        users: 0,
        rank: 124,
    },
    {
        name: 'Flóaskóli',
        size: 'small',
        count: 0,
        users: 0,
        rank: 125,
    },
    {
        name: 'Giljaskóli',
        size: 'medium',
        count: 0,
        users: 0,
        rank: 126,
    },
    {
        name: 'Grunnskóli Borgarfjarðar eystri',
        size: 'small',
        count: 0,
        users: 0,
        rank: 127,
    },
    {
        name: 'Grunnskóli Hornafjarðar',
        size: 'medium',
        count: 0,
        users: 0,
        rank: 128,
    },
    {
        name: 'Grunnskóli Húnaþings vestra',
        size: 'medium',
        count: 0,
        users: 0,
        rank: 129,
    },
    {
        name: 'Grunnskóli Mýrdalshrepps/Víkurskóli',
        size: 'small',
        count: 0,
        users: 0,
        rank: 130,
    },
    {
        name: 'Grunnskóli Reyðarfjarðar',
        size: 'medium',
        count: 0,
        users: 0,
        rank: 131,
    },
    {
        name: 'Grunnskóli Snæfellsbæjar',
        size: 'medium',
        count: 0,
        users: 0,
        rank: 132,
    },
    {
        name: 'Grunnskóli Vesturbyggðar/Patreksskóli',
        size: 'small',
        count: 0,
        users: 0,
        rank: 133,
    },
    {
        name: 'Grunnskóli Önundarfjarðar',
        size: 'small',
        count: 0,
        users: 0,
        rank: 134,
    },
    {
        name: 'Grunnskólinn austan Vatna',
        size: 'small',
        count: 0,
        users: 0,
        rank: 135,
    },
    {
        name: 'Grunnskólinn á Drangsnesi',
        size: 'small',
        count: 0,
        users: 0,
        rank: 136,
    },
    {
        name: 'Grunnskólinn Egilsstöðum og Eiðum/Egilsstaðaskóli',
        size: 'medium',
        count: 0,
        users: 0,
        rank: 137,
    },
    {
        name: 'Grunnskólinn í Borgarnesi',
        size: 'medium',
        count: 0,
        users: 0,
        rank: 138,
    },
    {
        name: 'Grunnskólinn í Hofgarði',
        size: 'small',
        count: 0,
        users: 0,
        rank: 139,
    },
    {
        name: 'Grunnskólinn í Hrísey/Hríseyjarskóli',
        size: 'small',
        count: 0,
        users: 0,
        rank: 140,
    },
    {
        name: 'Grunnskólinn í Stykkishólmi',
        size: 'medium',
        count: 0,
        users: 0,
        rank: 141,
    },
    {
        name: 'Grunnskólinn í Þorlákshöfn',
        size: 'medium',
        count: 0,
        users: 0,
        rank: 142,
    },
    {
        name: 'Grunnskólinn Suðureyri/Suðureyrarskóli',
        size: 'small',
        count: 0,
        users: 0,
        rank: 143,
    },
    {
        name: 'Grunnskólinn Þingeyri',
        size: 'small',
        count: 0,
        users: 0,
        rank: 144,
    },
    {
        name: 'Hamraskóli',
        size: 'medium',
        count: 0,
        users: 0,
        rank: 145,
    },
    {
        name: 'Heiðarskóli (Leirársveit)',
        size: 'small',
        count: 0,
        users: 0,
        rank: 146,
    },
    {
        name: 'Helgafellsskóli',
        size: 'small',
        count: 0,
        users: 0,
        rank: 147,
    },
    {
        name: 'Hlíðarskóli',
        size: 'small',
        count: 0,
        users: 0,
        rank: 148,
    },
    {
        name: 'Hólabrekkuskóli',
        size: 'large',
        count: 0,
        users: 0,
        rank: 149,
    },
    {
        name: 'Hrafnagilsskóli',
        size: 'medium',
        count: 0,
        users: 0,
        rank: 150,
    },
    {
        name: 'Húnavallaskóli',
        size: 'small',
        count: 0,
        users: 0,
        rank: 151,
    },
    {
        name: 'Hvaleyrarskóli',
        size: 'medium',
        count: 0,
        users: 0,
        rank: 152,
    },
    {
        name: 'Hvassaleitisskóli',
        size: 'medium',
        count: 0,
        users: 0,
        rank: 153,
    },
    {
        name: 'Kerhólsskóli',
        size: 'small',
        count: 0,
        users: 0,
        rank: 154,
    },
    {
        name: 'Klettaskóli',
        size: 'small',
        count: 0,
        users: 0,
        rank: 155,
    },
    {
        name: 'Krikaskóli',
        size: 'small',
        count: 0,
        users: 0,
        rank: 156,
    },
    {
        name: 'Laugargerðisskóli',
        size: 'small',
        count: 0,
        users: 0,
        rank: 157,
    },
    {
        name: 'Reykhólaskóli',
        size: 'small',
        count: 0,
        users: 0,
        rank: 158,
    },
    {
        name: 'Réttarholtsskóli',
        size: 'large',
        count: 0,
        users: 0,
        rank: 159,
    },
    {
        name: 'Selásskóli',
        size: 'medium',
        count: 0,
        users: 0,
        rank: 160,
    },
    {
        name: 'Seyðisfjarðarskóli',
        size: 'small',
        count: 0,
        users: 0,
        rank: 161,
    },
    {
        name: 'Skóli Ísaks Jónssonar',
        size: 'small',
        count: 0,
        users: 0,
        rank: 162,
    },
    {
        name: 'Stapaskóli',
        size: 'small',
        count: 0,
        users: 0,
        rank: 163,
    },
    {
        name: 'Stórutjarnaskóli',
        size: 'small',
        count: 0,
        users: 0,
        rank: 164,
    },
    {
        name: 'Súðavíkurskóli',
        size: 'small',
        count: 0,
        users: 0,
        rank: 165,
    },
    {
        name: 'Sæmundarskóli',
        size: 'large',
        count: 0,
        users: 0,
        rank: 166,
    },
    {
        name: 'Tjarnarskóli',
        size: 'small',
        count: 0,
        users: 0,
        rank: 167,
    },
    {
        name: 'Varmahlíðarskóli',
        size: 'small',
        count: 0,
        users: 0,
        rank: 168,
    },
    {
        name: 'Waldorfskólinn Lækjarbotnum',
        size: 'small',
        count: 0,
        users: 0,
        rank: 169,
    },
    {
        name: 'Waldorfskólinn Sólstafir',
        size: 'small',
        count: 0,
        users: 0,
        rank: 170,
    },
    {
        name: 'Þingeyjarskóli',
        size: 'small',
        count: 0,
        users: 0,
        rank: 171,
    },
    {
        name: 'Þjórsárskóli',
        size: 'small',
        count: 0,
        users: 0,
        rank: 172,
    },
];

export const gk2022ageStats = [
    {
        age: '0-9 ára',
        count: 207055,
    },
    {
        age: '10-12 ára',
        count: 336975,
    },
    {
        age: '13-17 ára',
        count: 119364,
    },
    {
        age: '18-19 ára',
        count: 52410,
    },
    {
        age: '20-29 ára',
        count: 25365,
    },
    {
        age: '30-39 ára',
        count: 155572,
    },
    {
        age: '40-49 ára',
        count: 237264,
    },
    {
        age: '50-59 ára',
        count: 0,
    },
    {
        age: '60-69 ára',
        count: 37859,
    },
    {
        age: '70-79 ára',
        count: 3386,
    },
    {
        age: '80-89 ára',
        count: 69,
    },
    {
        age: '90+ ára',
        count: 2296,
    },
];

export const gk2022genderStats = [
    {
        gender: 'kona',
        count: 873228,
    },
    {
        gender: 'karl',
        count: 392570,
    },
    {
        gender: 'annad',
        count: 10585,
    },
];
