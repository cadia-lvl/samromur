import * as React from 'react';
import styled from 'styled-components';

import {
    ages,
    dialects,
    genders,
    nativeLanguages,
} from '../../../constants/demographics';
import { Demographic } from '../../../types/user';

import DropdownButton from '../../ui/input/dropdown';
import TextInput from '../../ui/input/text-input';

const MetadataContainer = styled.div`
    display: grid;
    gap: 1rem;
    grid-template-columns: 1fr 1fr;
    ${({ theme }) => theme.media.small} {
        grid-template-columns: 1fr;
    }
`;

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

    grid-column: 1 / 3;

    ${({ theme }) => theme.media.small} {
        grid-column: 1;
    }
`;

interface Props {
    labels: string[];
    onSubmit: (age: string, dialect: string, gender: string, nativeLanguage: string, label: string) => void;
}

interface State {
    age: Demographic;
    dialect: Demographic;
    gender: Demographic;
    createNewLabel: boolean;
    nativeLanguage: Demographic;
    newLabel: string;
    selectedLabel: string;
}

export default class UploadMetadata extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            age: {
                id: '',
                name: '',

            },
            dialect: {
                id: '',
                name: '',
            },
            gender: {
                id: '',
                name: ''
            },
            nativeLanguage: {
                id: '',
                name: '',
            },
            createNewLabel: false,
            newLabel: '',
            selectedLabel: ''
        }
    }

    onLabelSelect = (value: string) => {
        this.setState({
            createNewLabel: value == 'Búa til nýjan' ? true : false,
            selectedLabel: value
        });

    }

    onLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newLabel = e.currentTarget.value;
        this.setState({ newLabel });
    }

    onAgeSelect = (value: string) => {
        const age = ages.find((val: Demographic) => val.name == value) as Demographic;
        this.setState({ age });
    }

    onDialectSelect = (value: string) => {
        const dialect = dialects.find((val: Demographic) => val.name == value) as Demographic;
        this.setState({ dialect });
    }

    onGenderSelect = (value: string) => {
        const gender = genders.find((val: Demographic) => val.name == value) as Demographic;
        this.setState({ gender });
    }

    onNativeLanguageSelect = (value: string) => {
        const nativeLanguage = nativeLanguages.find((val: Demographic) => val.name == value) as Demographic;
        this.setState({ nativeLanguage });
    }

    onSubmit = () => {
        const { age, dialect, gender, nativeLanguage, newLabel, selectedLabel } = this.state;
        const label = !!newLabel ? newLabel : selectedLabel;

        this.props.onSubmit(
            age.id,
            dialect.id,
            gender.id,
            nativeLanguage.id == '' ? 'islenska' : nativeLanguage.id,
            label
        );
    }

    render() {
        const { labels } = this.props;
        const {
            age,
            dialect,
            gender,
            createNewLabel,
            nativeLanguage,
            newLabel,
            selectedLabel
        } = this.state;
        return (
            <MetadataContainer>
                <DropdownButton
                    content={labels}
                    label={'Yfirferðarflokkur'}
                    onSelect={this.onLabelSelect}
                    selected={selectedLabel}
                />
                <div>
                    {
                        createNewLabel && (
                            <TextInput
                                label={'Nafn á nýjum flokk'}
                                onChange={this.onLabelChange}
                                type="text"
                                value={newLabel}
                            />
                        )
                    }
                </div>
                {
                    !(!selectedLabel) && (
                        <React.Fragment>
                            <DropdownButton
                                content={ages.map((age: Demographic) => age.name)}
                                label={'Aldur'}
                                onSelect={this.onAgeSelect}
                                selected={age ? age.name : ''}
                            />
                            <DropdownButton
                                content={genders.map((gender: Demographic) => gender.name)}
                                label={'Kyn'}
                                onSelect={this.onGenderSelect}
                                selected={gender ? gender.name : ''}
                            />
                            <DropdownButton
                                content={nativeLanguages.map((language: Demographic) => language.name)}
                                label={'Móðurmál'}
                                onSelect={this.onNativeLanguageSelect}
                                selected={nativeLanguage.name || 'Íslenska'}
                            />
                            <DropdownButton
                                content={dialects.map((dialect: Demographic) => dialect.name)}
                                label={'Framburður'}
                                onSelect={this.onDialectSelect}
                                selected={dialect ? dialect.name : ''}
                            />
                            <Button onClick={this.onSubmit}>Senda</Button>
                        </React.Fragment>
                    )
                }
            </MetadataContainer>
        );
    }
}