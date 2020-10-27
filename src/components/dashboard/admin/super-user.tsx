import * as React from 'react';
import styled from 'styled-components';

import * as adminApi from '../../../services/admin-api';

import TextInput from '../../ui/input/text';

const SuperUserContainer = styled.div`
    padding: 1rem;
    display: flex;
    flex-direction: column;
`;

interface ButtonProps {
    done: boolean;
    success: boolean;
}

const Button = styled.div<ButtonProps>`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem 2rem;
    background-color: ${({ done, success, theme }) => {
        if (done) {
            return success ? theme.colors.green : theme.colors.red
        } else {
            return theme.colors.blue;
        }
    }};
    color: white;
    cursor: pointer;
    font-weight: 600;

    :active {
        transform: translateY(2px);
    }
`;

interface SuperUserProps {

}

interface State {
    done: boolean;
    success: boolean;
    userEmail: string;
}

type Props = SuperUserProps;

class SuperUser extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            done: false,
            success: false,
            userEmail: '',
        }
    }

    onEmailChange = (userEmail: string) => {
        this.setState({ userEmail });
    }

    onSubmit = () => {
        const { userEmail } = this.state;
        adminApi.makeSuperUser(userEmail).then(() => {
            this.setState({
                done: true,
                success: true,
            });
        }).catch((error) => {
            console.error(error);
            this.setState({
                done: true,
                success: false,
            })
        })
    }

    render() {
        const { done, success } = this.state;
        return (
            <SuperUserContainer>
                <TextInput
                    label='Búa til ofurnotanda'
                    onChange={this.onEmailChange}
                    placeholder='tölvupóstfang'
                    type='text'
                />
                <Button
                    done={done}
                    onClick={this.onSubmit}
                    success={success}
                >
                    {(done && success) ? 'Breyting tókst' : (done && !success) ? 'Mistókst' : 'Staðfesta'}
                </Button>
            </SuperUserContainer>
        )
    }
}

export default SuperUser;