import styled from 'styled-components';
import { useTranslation } from '../../../../server/i18n';

const Shortcut = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0.25rem;
`;

const KeyContainer = styled.div`
    width: 20%;
`;

const Key = styled.div`
    display: inline-block;
    padding: 0 0.5rem;
    box-shadow: 0 0 2px 1px gray;
    border-radius: 5px;
    margin: 5px;
`;

interface Props {
    shortcut: string;
    explanation: string;
}

const KeyboardShortcut: React.FunctionComponent<Props> = ({
    shortcut,
    explanation,
}) => {
    const { t } = useTranslation('keyboard');

    return (
        <Shortcut>
            <KeyContainer>
                <Key>{shortcut}</Key>
            </KeyContainer>
            {t(explanation)}
        </Shortcut>
    );
};

export const PlaySpeak: React.FC = () => (
    <KeyboardShortcut shortcut={'Spacebar'} explanation={'play-speak'} />
);

export const PlayListen: React.FC = () => (
    <KeyboardShortcut shortcut={'Spacebar'} explanation={'play-listen'} />
);

export const Skip: React.FC = () => (
    <KeyboardShortcut shortcut={'s'} explanation={'skip'} />
);
export const Back: React.FC = () => (
    <KeyboardShortcut shortcut={'◄'} explanation={'back'} />
);
export const Forwards: React.FC = () => (
    <KeyboardShortcut shortcut={'►'} explanation={'forward'} />
);
export const Rerecord: React.FC = () => (
    <KeyboardShortcut shortcut={'x'} explanation={'re-record'} />
);
export const Delete: React.FC = () => (
    <KeyboardShortcut shortcut={'Del'} explanation={'delete'} />
);
export const Submit: React.FC = () => (
    <KeyboardShortcut shortcut={'Enter'} explanation={'submit'} />
);

export const VoteYes: React.FC = () => (
    <KeyboardShortcut shortcut={'q'} explanation={'vote-yes'} />
);

export const VoteNo: React.FC = () => (
    <KeyboardShortcut shortcut={'e'} explanation={'vote-no'} />
);

export const VoteUnsure: React.FC = () => (
    <KeyboardShortcut shortcut={'r'} explanation={'vote-unsure'} />
);

export const PlayRepeat: React.FC = () => (
    <KeyboardShortcut shortcut={'a'} explanation={'play-repeat'} />
);
