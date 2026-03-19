import React, { useContext, useState } from 'react'
import { BsGoogle } from 'react-icons/bs';
import RegularInput from '../components/RegularInput';
import RegularSelectAlt from '../components/RegularSelectAlt';
import Button from '../components/Button';
import client from '../api/client';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import UserContext from '../contexts/UserContext';


export default function Register() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [role, setRole] = useState('officer')
    const [isLoading, setIsLoading] = useState(false)

    const { user, setUser } = useContext(UserContext)
    const navigate = useNavigate()

    const register = async () => {
        if (!email || !password || !confirmPassword || !role) {
            toast.error("Please fill in all fields", {
                position: "top-right",
            });
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match", {
                position: "top-right",
            });
            return;
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters long", {
                position: "top-right",
            });
            return;
        }

        setIsLoading(true);
        try {
            const { data } = await client.post("/users/register", { email, password, role });
            navigate('/');
        } catch (error) {
            toast.error("Registration failed. Please try again.", {
                position: "top-right",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
            <div className='max-w-md w-full space-y-8'>
                <div className='text-center'>
                    <h2 className='text-3xl font-bold text-foreground'>
                        Create your account
                    </h2>
                    <p className='mt-2 text-sm text-muted-foreground'>
                        Join Credit Analytics Dashboard
                    </p>
                </div>

                <div className='bg-card border border-border rounded-xl shadow-sm p-8'>
                    <form className='space-y-6' onSubmit={(e) => { e.preventDefault(); register(); }}>
                        <div className='space-y-4'>
                            <RegularInput
                                type="email"
                                label='Email Address'
                                name='email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder='user@example.com'
                                required
                            />
                            <RegularInput
                                type='password'
                                label='Password'
                                name='password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder='Enter your password'
                                required
                            />
                            <RegularInput
                                type='password'
                                label='Confirm Password'
                                name='confirmPassword'
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder='Confirm your password'
                                required
                            />
                            <RegularSelectAlt
                                label='Role'
                                name='role'
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                required
                                options={[
                                    { value: 'officer', label: 'Loan Officer' },
                                    { value: 'reviewer', label: 'Review Officer' },
                                    { value: 'approver', label: 'Approval Authority' },
                                ]}
                            />
                        </div>

                        <div className='space-y-4'>
                            <Button
                                type="submit"
                                className='w-full'
                                disabled={isLoading}
                                onClick={register}
                            >
                                {isLoading ? 'Creating account...' : 'Create account'}
                            </Button>

                            <div className='text-center'>
                                <span className='text-sm text-muted-foreground'>
                                    Already have an account?{' '}
                                    <Link
                                        to="/"
                                        className='font-medium text-primary hover:text-primary/80 transition-colors'
                                    >
                                        Sign in
                                    </Link>
                                </span>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
