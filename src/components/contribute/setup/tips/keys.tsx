import styled from 'styled-components';

const Key = styled.div`
    font-size: 0.75rem;
    display: inline-block;
    padding: 0 0.25rem;
    box-shadow: 0 0 2px 1px gray;
    border-radius: 5px;
    margin: 5px;
`;

const Shortcut = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.5rem;
`;

export const Play: React.FC = () => (
    <Shortcut>
        <Key>space</Key>
        Taka upp/Spila
    </Shortcut>
);

export const Skip: React.FC = () => (
    <Shortcut>
        <Key>s</Key>
        Sleppa
    </Shortcut>
);
export const Back: React.FC = () => (
    <Shortcut>
        <Key>{'◄'}</Key>
        Afturábak
    </Shortcut>
);
export const Forwards: React.FC = () => (
    <Shortcut>
        <Key>{'►'}</Key>
        Áfram
    </Shortcut>
);
export const Rerecord: React.FC = () => (
    <Shortcut>
        <Key>x</Key>
        Endurtaka
    </Shortcut>
);
export const Delete: React.FC = () => (
    <Shortcut>
        <Key>Del</Key>
        Fjarlægja
    </Shortcut>
);
export const Submit: React.FC = () => (
    <Shortcut>
        <Key>{'Enter'}</Key>
        Senda
    </Shortcut>
);

export const VoteYes: React.FC = () => (
    <Shortcut>
        <Key>q</Key>
        Samþykkja
    </Shortcut>
);

export const VoteNo: React.FC = () => (
    <Shortcut>
        <Key>e</Key>
        Hafna
    </Shortcut>
);

export const VoteUnsure: React.FC = () => (
    <Shortcut>
        <Key>r</Key>
        Óviss
    </Shortcut>
);

export const PlayRepeat: React.FC = () => (
    <Shortcut>
        <Key>a</Key>
        Spila herma setningu
    </Shortcut>
);
