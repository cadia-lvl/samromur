import { useRouter } from 'next/router';
import * as React from 'react';
import PrimaryButton from './ui/comp-button-primary';
import { startTime, endTime } from '../../constants/competition';
import { start } from 'repl';
import {
    isCompetition,
    isCompetitionOver,
} from '../../utilities/competition-helper';

// import SecondaryButton from "./ui/comp-button-primary"

const CompetitionButtons: React.FC = () => {
    const router = useRouter();

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
