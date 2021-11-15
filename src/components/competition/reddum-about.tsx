import { useRouter } from 'next/router';
import * as React from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import {
    isCompetition,
    isCompetitionOver,
} from '../../utilities/competition-helper';
import Loader from '../ui/animated/loader';
import { Button } from '../ui/buttons';

const About = styled.div`
    max-width: ${({ theme }) => theme.layout.desktopWidth};
    margin: 1rem auto 2rem auto;
    /* text-align: center; */
`;

export const AboutReddum = () => {
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
                                <Button
                                    onClick={onContributeClick}
                                    large
                                    color={'darkerBlue'}
                                >
                                    Taka þátt{' '}
                                </Button>
                            ) : (
                                <Loader />
                            )}
                        </>
                    ) : (
                        <>
                            <p>Smelltu á „Skrá“ til að skrá!</p>
                            <Button
                                onClick={() => router.push('/skra')}
                                large
                                color={'darkerBlue'}
                            >
                                Skrá
                            </Button>
                        </>
                    )}
                </>
            ) : (
                <>
                    <p>
                        Reddum málinu vinnustaðakeppni 8. - 15. nóvember 2021.
                    </p>
                    <p>Takk fyrir að Redda málinu!</p>
                    <p>
                        Vinnustaðakeppninni Reddum málinu er nú lokið. Við
                        þökkum frábærar viðtökur, sá ótrúlegi fjöldi raddsýna
                        sem að safnaðist frá allskonar fólki mun nýtast
                        íslenskunni vel og hjálpa henni að vera betur í stakk
                        búinn til að fylgja tækniþróun heimsins.
                    </p>
                    <p>Íslenskan þakkar fyrir ykkar framlag.</p>
                </>
            )}
        </About>
    );
};
