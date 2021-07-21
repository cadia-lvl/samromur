import styled from 'styled-components';

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

export const PlaySpeak: React.FC = () => (
    <Shortcut>
        <KeyContainer>
            <Key>Spacebar</Key>
        </KeyContainer>
        Taka upp/Spila upptöku
    </Shortcut>
);

export const PlayListen: React.FC = () => (
    <Shortcut>
        <KeyContainer>
            <Key>Spacebar</Key>
        </KeyContainer>
        Spila upptöku
    </Shortcut>
);

export const Skip: React.FC = () => (
    <Shortcut>
        <KeyContainer>
            <Key>s</Key>
        </KeyContainer>
        Sleppa upptöku
    </Shortcut>
);
export const Back: React.FC = () => (
    <Shortcut>
        <KeyContainer>
            <Key>{'◄'}</Key>
        </KeyContainer>
        Fara til baka í fyrri setningu / upptöku
    </Shortcut>
);
export const Forwards: React.FC = () => (
    <Shortcut>
        <KeyContainer>
            <Key>{'►'}</Key>
        </KeyContainer>
        Farðu í næstu setningu / upptöku
    </Shortcut>
);
export const Rerecord: React.FC = () => (
    <Shortcut>
        <KeyContainer>
            <Key>x</Key>
        </KeyContainer>
        Endurtaka upptöku
    </Shortcut>
);
export const Delete: React.FC = () => (
    <Shortcut>
        <KeyContainer>
            <Key>Del</Key>
        </KeyContainer>
        Fjarlægja upptöku
    </Shortcut>
);
export const Submit: React.FC = () => (
    <Shortcut>
        <KeyContainer>
            <Key>{'Enter'}</Key>
        </KeyContainer>
        Senda inn
    </Shortcut>
);

export const VoteYes: React.FC = () => (
    <Shortcut>
        <KeyContainer>
            <Key>q</Key>
        </KeyContainer>
        Dæma upptöku góða
    </Shortcut>
);

export const VoteNo: React.FC = () => (
    <Shortcut>
        <KeyContainer>
            <Key>e</Key>
        </KeyContainer>
        Dæma upptöku slæma
    </Shortcut>
);

export const VoteUnsure: React.FC = () => (
    <Shortcut>
        <KeyContainer>
            <Key>r</Key>
        </KeyContainer>
        Merkja upptöku sem óljósa
    </Shortcut>
);

export const PlayRepeat: React.FC = () => (
    <Shortcut>
        <KeyContainer>
            <Key>a</Key>
        </KeyContainer>
        Spila hermda setningu
    </Shortcut>
);
