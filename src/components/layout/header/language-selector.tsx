import * as React from 'react';
import styled from 'styled-components';
import { useTranslation } from '../../../server/i18n';

interface Props {}

const DropdownContent = styled.div`
    font-family: ${(props) => props.theme.fonts.transcript};
    display: none;
    position: absolute;
    flex-direction: row;
    color: black;
    //background: ${({ theme }) => theme.colors.offwhite};
    background: white;
    //border: 2px solid ${({ theme }) => theme.colors.gray};
    box-shadow: 0 0 3px 2px rgb(0 0 0 / 8%);
`;

const Dropdown = styled.div`
    position: relative;
    display: inline-block;
    vertical-align: super;
    cursor: pointer;
    font-size: 1rem;
    color: ${({ theme }) => theme.colors.darkerBlue};
    line-height: normal;
    margin-left: 0.25rem;

    &:hover ${DropdownContent} {
        display: block;
    }
`;

const DropdownSelected = styled.div``;

const DropdownItem = styled.div`
    display: block;
    padding: 0.25rem 1rem;
    cursor: pointer;

    &:hover {
        color: ${({ theme }) => theme.colors.white};
        background-color: ${({ theme }) => theme.colors.darkerBlue};
    }
`;

const languages: { [key: string]: string } = { eng: 'en', isl: 'is' };

enum i18nLanguages {
    English = 'eng',
    Icelandic = 'isl',
}

const LanguageSelector: React.FunctionComponent<Props> = (props: Props) => {
    const { i18n } = useTranslation();
    const [selected, setSelected] = React.useState(languages[i18n.language]);

    /**
     * Updates the current i18n lanugage and displays it as selected
     * @param language the i18n language code to switch to
     */
    const updateLanguage = (language: string) => {
        if (selected === language) return;
        i18n.changeLanguage(language);
        setSelected(languages[language]);
    };

    return (
        <Dropdown>
            <DropdownSelected>{selected}</DropdownSelected>
            <DropdownContent>
                <DropdownItem
                    onClick={() => updateLanguage(i18nLanguages.English)}
                >
                    English
                </DropdownItem>
                <DropdownItem
                    onClick={() => updateLanguage(i18nLanguages.Icelandic)}
                >
                    Íslenska
                </DropdownItem>
            </DropdownContent>
        </Dropdown>
    );
};

export default LanguageSelector;
