import { useRouter } from 'next/router';
import * as React from 'react';
import PrimaryButton from './ui/comp-button-primary';
import { startTime, endTime } from '../../constants/competition';
import { start } from 'repl';

// import SecondaryButton from "./ui/comp-button-primary"

const CompetitionButtons: React.FC = () => {
    const router = useRouter();

    const isCompetition = (): boolean => {
        const now = new Date();
        return now > startTime && now < endTime;
    };

    const isCompetitionOver = (): boolean => {
        const now = new Date();
        return now.getTime() > endTime.getTime();
    };

    return (
        <>
            {isCompetition() && (
                <PrimaryButton onClick={() => router.push('/tala')}>
                    Taka þátt
                </PrimaryButton>
            )}
            {!isCompetitionOver() && !isCompetition() && (
                <PrimaryButton onClick={() => router.push('/skra')}>
                    Skrá
                </PrimaryButton>
            )}
        </>
    );
};

export default CompetitionButtons;
