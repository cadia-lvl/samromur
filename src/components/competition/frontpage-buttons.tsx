import { useRouter } from 'next/router';
import * as React from 'react';
import PrimaryButton from './ui/comp-button-primary';
import { startTime, endTime } from '../../constants/competition';
import { start } from 'repl';
import {
    isCompetition,
    isCompetitionOver,
} from '../../utilities/competition-helper';
import { useState } from 'react';
import Loader from '../ui/animated/loader';

// import SecondaryButton from "./ui/comp-button-primary"

const CompetitionButtons: React.FC = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const onContribute = () => {
        setLoading(true);
        router.push('/tala');
    };

    return (
        <>
            {isCompetition() && !loading && (
                <PrimaryButton onClick={onContribute}>Taka þátt</PrimaryButton>
            )}
            {loading && <Loader fill={'white'} />}
            {!isCompetitionOver() && !isCompetition() && (
                <PrimaryButton onClick={() => router.push('/skra')}>
                    Skrá
                </PrimaryButton>
            )}
            {isCompetitionOver() && (
                <PrimaryButton onClick={() => router.push('/keppni')}>
                    Stigatafla
                </PrimaryButton>
            )}
        </>
    );
};

export default CompetitionButtons;
