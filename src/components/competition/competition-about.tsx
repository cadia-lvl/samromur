import { useRouter } from 'next/router';
import * as React from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import {
    isCompetition,
    isCompetitionOver,
} from '../../utilities/competition-helper';
import Loader from '../ui/animated/loader';
import { CompetitionOverText } from './competition-over-text';
import PrimaryButton from './ui/comp-button-primary';

const About = styled.div`
    max-width: ${({ theme }) => theme.layout.desktopWidth};
    margin: 1rem auto 2rem auto;
    text-align: center;
`;

export const AboutCompetition = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const onContributeClick = () => {
        setLoading(true);
        router.push('/tala');
    };

    return (
        <About>
            {!isCompetitionOver() ? (
                <>
                    <p>Reddum málinu vinnustaðakeppni 8. - 15. nóvember.</p>
                    <p>
                        Allir geta tekið þátt í að „redda málinu“ en við hvetjum
                        vinnustaði til þess að fylkja liði og skrá sig í
                        keppnina.
                    </p>
                    <p>
                        Keppt verður í þremur flokkum, eftir stærð vinnustaða og
                        viðurkenning verður veitt fyrir þrjú efstu sætin í
                        hverjum flokki.
                    </p>

                    {isCompetition() ? (
                        <>
                            <p>Smelltu á „Taka þátt“ til að redda málinu!</p>
                            {!loading ? (
                                <PrimaryButton onClick={onContributeClick}>
                                    Taka þátt{' '}
                                </PrimaryButton>
                            ) : (
                                <Loader fill={'white'} />
                            )}
                        </>
                    ) : (
                        <>
                            <p>Smelltu á „Skrá“ til að skrá!</p>
                            <PrimaryButton onClick={() => router.push('/skra')}>
                                Skrá
                            </PrimaryButton>
                        </>
                    )}
                </>
            ) : (
                <CompetitionOverText />
            )}
        </About>
    );
};
