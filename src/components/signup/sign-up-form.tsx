import { value } from 'popmotion';
import * as React from 'react';
import { ChangeEvent, useState } from 'react';
import styled from 'styled-components';
import { addCompany, companyExists } from '../../services/competition-api';
import validateEmail from '../../utilities/validate-email';
import * as colors from '../competition/ui/colors';
import SecondaryButton from '../competition/ui/comp-button-secondary';
import DropdownButton from '../competition/ui/dropdown';
import { TextInputWithLabel } from '../ui/input/input';
import TextInput from '../competition/ui/text-input';
import { useRouter } from 'next/router';
import { isCompetition } from '../../utilities/competition-helper';

const SignUpFormContainer = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    /* width: 100%; */
    /* width: 40rem; */
`;

const StyledForm = styled.form`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 40rem;
    margin: 0 5rem;
    gap: 2rem;

    ${({ theme }) => theme.media.small} {
        width: 100%;
        /* grid-template-columns: 1fr; */
    }
`;

const ErrorContainer = styled.div`
    color: red;
    padding: 0.5rem;
`;

const SuccessContainer = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    max-width: 30rem;
    min-width: 20rem;
    margin: 0 5rem;
    color: ${colors.blue3};
`;

interface Size {
    size: string;
    text: string;
}

const sizes: Size[] = [
    { size: 'small', text: 'færri en 70' },
    { size: 'medium', text: '70-300' },
    { size: 'large', text: 'meira en 300' },
];

enum FormError {
    INVALID_EMAIL = 'INVALID_EMAIL',
    COMPANY_EXISTS = 'COMPANY_EXISTS',
    EMPTY_CONTACT = 'EMPTY_CONTACT',
    EMPTY_COMPANY = 'EMPTY_COMPANY',
    INVALID_SIZE = 'INVALID_SIZE',
}

const SignUpForm: React.FunctionComponent = () => {
    const [company, setCompany] = useState('');
    const [size, setSize] = useState<Size>(sizes[0]);
    const [contact, setContact] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState<FormError | undefined>(undefined);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setError(undefined);
        const valid = await validateForm();
        if (valid) {
            const success = await addCompany(
                company,
                size.size,
                contact,
                email
            );

            if (!success) {
                // Set some error and return
                return;
            }
            setSuccess(success);
        }
        console.log(valid);
        console.log(company, size, contact, email);
    };

    const onCompanyChanged = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setCompany(value);
    };

    const onSizeChanged = (s: string) => {
        // const value = event.target.value;
        const newSize = sizes.find((e) => e.text == s);
        if (newSize) {
            setSize(newSize);
        }
    };
    const onContactChanged = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setContact(value);
    };
    const onEmailChanged = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setEmail(value);
    };

    const validateForm = async () => {
        // Validate Company
        if (company == '' || company == undefined) {
            setError(FormError.EMPTY_COMPANY);
            return false;
        }
        const exists = await companyExists(company);

        if (exists) {
            setError(FormError.COMPANY_EXISTS);
            return false;
        }

        // Double check that size is in sizes
        if (!sizes.some((s) => s.size == size.size)) {
            setError(FormError.INVALID_SIZE);
            return false;
        }

        // Check contact person
        if (contact == '' || contact == undefined) {
            setError(FormError.EMPTY_CONTACT);
            return false;
        }

        // Check email
        if (!validateEmail(email)) {
            setError(FormError.INVALID_EMAIL);
            return false;
        }

        return true;
    };

    const toFriendlyError = (error: FormError) => {
        switch (error) {
            case FormError.COMPANY_EXISTS:
                return 'Þessi vinnustaður er búinn að skrá sig.';
            case FormError.EMPTY_COMPANY:
                return 'Þú þarft að bæta við vinnustað.';
            case FormError.EMPTY_CONTACT:
                return 'Vinsamlega sláðu inn tengilið.';
            case FormError.INVALID_EMAIL:
                return 'Tölvupóstfang vantar eða er ógilt.';
            case FormError.INVALID_SIZE:
                return 'Ógild vinnustaðastærð';
            default:
                return 'Óþekkt villa.';
        }
    };

    return (
        <SignUpFormContainer>
            {!success && (
                <StyledForm onSubmit={handleSubmit}>
                    <TextInput
                        label={'Vinnustaður'}
                        onChange={onCompanyChanged}
                        placeholder={''}
                    />
                    {/* <br />
                <input
                    type="text"
                    name="company"
                    onChange={onCompanyChanged}
                ></input> */}
                    {/* <br /> */}
                    {/* <label htmlFor="size">Size</label>
                <br /> */}
                    <DropdownButton
                        content={sizes.map((s: Size) => s.text)}
                        label={'Fjöldi starfsmanna'}
                        onSelect={onSizeChanged}
                        selected={size.text}
                    />
                    {/* <br /> */}
                    {/* <label htmlFor="contact">Contact person:</label>
                <br />
                <input
                    type="text"
                    name="contact"
                    onChange={onContactChanged}
                ></input>
                <br /> */}
                    <TextInput
                        label={'Tengiliður'}
                        onChange={onContactChanged}
                        placeholder={''}
                    />
                    <TextInput
                        label={'Tölvupósti'}
                        onChange={onEmailChanged}
                        placeholder={''}
                    />
                    <SecondaryButton type="submit" value="Skrá">
                        Skrá
                    </SecondaryButton>
                </StyledForm>
            )}
            {error && (
                <ErrorContainer>Villa: {toFriendlyError(error)}</ErrorContainer>
            )}
            {success && isCompetition() && (
                <SuccessContainer>
                    <p>
                        {company} hefur verið skráður til leiks. Smelltu á "taka
                        þátt" til að byrja að keppa!
                    </p>
                    <SecondaryButton onClick={() => router.push('/tala')}>
                        Taka þátt
                    </SecondaryButton>
                </SuccessContainer>
            )}
            {success && !isCompetition() && (
                <SuccessContainer>
                    <p>
                        {company} hefur verið skráður til leiks. Smelltu á
                        "Keppni" sjá núverandi skráða vinnustaði!
                    </p>
                    <SecondaryButton onClick={() => router.push('/keppni')}>
                        Keppni
                    </SecondaryButton>
                </SuccessContainer>
            )}
        </SignUpFormContainer>
    );
};

export default SignUpForm;
