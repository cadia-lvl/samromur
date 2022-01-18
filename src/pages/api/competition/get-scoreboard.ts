import { NextApiRequest, NextApiResponse } from 'next';
import { CompetitionTypes } from '../../../constants/competition';
import { schoolsAsInstitutions } from '../../../constants/schools';
import Database, {
    getDatabaseInstance,
} from '../../../server/database/database';
import { ScoreboardData } from '../../../types/competition';
import { Institution } from '../../../types/institution';

const db: Database = getDatabaseInstance();

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { headers, method } = req;

    if (method != 'GET') {
        res.status(400).send('Invalid method.');
        return;
    }

    try {
        const competitionType = headers.competition_type
            ? (headers.competition_type as string)
            : '';

        if (!(competitionType in CompetitionTypes)) {
            return res.status(500).json('Incorrect competition type.');
        }
        const scores = await db.stats.fetchScoreboard();

        let institutions: Institution[] = [];

        switch (competitionType) {
            case CompetitionTypes.SCHOOL:
                institutions = schoolsAsInstitutions;
                break;
            case CompetitionTypes.COMPANY:
                institutions = await db.competition.getCompanies();
            default:
                break;
        }

        // const companies = await db.competition.getCompanies();
        const sorted = institutions.sort((a, b) =>
            a.name.localeCompare(b.name, 'is-IS')
        );

        sorted.forEach((c) => {
            if (!scores.some((s) => s.name == c.name)) {
                const toAdd: ScoreboardData = {
                    name: c.name,
                    size: c.size,
                    count: 0,
                    users: 0,
                    rank: scores.length + 1,
                };
                scores.push(toAdd);
            }
        });
        return res.status(200).json(scores);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};
