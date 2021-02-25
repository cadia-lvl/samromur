import * as React from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import { validateSentencePackageName } from '../../../utilities/upload-helper';
import TextInput from '../../ui/input/text-input';
import { MetaDataButton, MetadataContainer } from './upload-metadata';

const Button = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem 2rem;
    background-color: ${({ theme }) => theme.colors.blue};
    color: white;
    cursor: pointer;
    font-weight: 600;

    :active {
        transform: translateY(2px);
    }
`;

interface Props {
    onSubmit: (packageName: string) => void;
}

export const RepeatSentencesMetadata: React.FunctionComponent<Props> = ({
    onSubmit,
}) => {
    const [packageName, setPackageName] = useState('');

    /**
     * Update the packageName in state only if if it follows the rules
     * of validateSentencePackageName (english alphabet, numbers and ._-)
     * @param e
     */
    const onPackageNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPackageName = e.currentTarget.value;
        if (
            validateSentencePackageName(newPackageName) ||
            newPackageName === ''
        ) {
            setPackageName(newPackageName);
        }
    };

    const handleSubmit = () => {
        if (validateSentencePackageName(packageName)) {
            onSubmit(packageName);
            return;
        }
    };

    return (
        <MetadataContainer>
            <TextInput
                label={'Nafn á nýjum hermasetningapakka'}
                onChange={onPackageNameChange}
                type="text"
                value={packageName}
            />
            <Button onClick={handleSubmit}>Senda</Button>
        </MetadataContainer>
    );
};
