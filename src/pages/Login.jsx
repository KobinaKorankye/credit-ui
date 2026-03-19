import React, { useContext, useState } from 'react'
import { BsGoogle } from 'react-icons/bs';
import RegularInput from '../components/RegularInput';
import Button from '../components/Button';
import client from '../api/client';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import UserContext from '../contexts/UserContext';


export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const { user, setUser } = useContext(UserContext)
    const navigate = useNavigate()

    const login = async () => {
        if (!email || !password) {
            toast.error("Please fill in all fields", {
                position: "top-right",
            });
            return;
        }

        setIsLoading(true);
        try {
            const { data } = await client.post("/users/login", { email, password });
            localStorage.setItem('credit-ui-user', JSON.stringify(data));
            setUser(data)
            navigate('/dashboard')
        } catch (error) {
            toast.error("Login failed. Please check your credentials.", {
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
                        Sign in to your account
                    </h2>
                    <p className='mt-2 text-sm text-muted-foreground'>
                        Welcome back to Credit Analytics Dashboard
                    </p>
                </div>

                <div className='bg-card border border-border rounded-xl shadow-sm p-8'>
                    <form className='space-y-6' onSubmit={(e) => { e.preventDefault(); login(); }}>
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
                        </div>

                        <div className='space-y-4'>
                            <Button
                                type="submit"
                                className='w-full'
                                disabled={isLoading}
                                onClick={login}
                            >
                                {isLoading ? 'Signing in...' : 'Sign in'}
                            </Button>

                            <div className='text-center'>
                                <span className='text-sm text-muted-foreground'>
                                    Don't have an account?{' '}
                                    <Link
                                        to="/register"
                                        className='font-medium text-primary hover:text-primary/80 transition-colors'
                                    >
                                        Sign up
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
