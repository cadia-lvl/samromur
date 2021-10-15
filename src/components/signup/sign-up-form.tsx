import { value } from 'popmotion';
import * as React from 'react';
import { ChangeEvent, useState } from 'react';
import { addCompany, companyExists } from '../../services/competition-api';
import validateEmail from '../../utilities/validate-email';

interface Size {
    size: string;
    text: string;
}

const sizes: Size[] = [
    { size: 'tiny', text: '1-10' },
    { size: 'small', text: '11-50' },
    { size: 'medium', text: '51-100' },
    { size: 'large', text: '100+' },
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
    const onSizeChanged = (event: ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        const newSize = sizes.find((e) => e.size == value);
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

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label htmlFor="company">Company</label>
                <br />
                <input
                    type="text"
                    name="company"
                    onChange={onCompanyChanged}
                ></input>
                <br />
                <label htmlFor="size">Size</label>
                <br />
                <select onChange={onSizeChanged} value={size.size}>
                    {sizes.map((e) => {
                        return (
                            <option value={e.size} key={e.size}>
                                {e.text}
                            </option>
                        );
                    })}
                </select>
                <br />
                <label htmlFor="contact">Contact person:</label>
                <br />
                <input
                    type="text"
                    name="contact"
                    onChange={onContactChanged}
                ></input>
                <br />
                <label htmlFor="email">Email</label>
                <br />
                <input
                    type="text"
                    name="email"
                    onChange={onEmailChanged}
                ></input>
                <br />
                <input type="submit" value="Skrá" />
            </form>
            {error && <div>ERROR: {error}</div>}
            {success && (
                <div>Company {company} has successfully been registered.</div>
            )}
        </div>
    );
};

export default SignUpForm;
