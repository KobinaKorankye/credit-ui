import React, { useContext, useState } from 'react'
// import { auth, googleProvider } from '../firebaseConfig';
import { BsGoogle } from 'react-icons/bs';
import RegularInput from '../components/RegularInput';
import client from '../api/client';
import RegularSelect from '../components/RegularSelect';
import RegularSelectAlt from '../components/RegularSelectAlt';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import UserContext from '../contexts/UserContext';

// const signInWithGoogle = async () => {
//     try {
//         const result = await auth.signInWithPopup(googleProvider);
//         const token = await result.user.getIdToken();
//         // Send this token to your backend
//     } catch (error) {
//         console.error(error);
//     }
// };

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('officer')

    const { user, setUser } = useContext(UserContext)

    const navigate = useNavigate()

    const register = async () => {
        try {
            const { data } = await client.post("/users/register", { email, password, role });
            alert(JSON.stringify(data))
            console.log(data);
        } catch (error) {
            toast.error("Failed", {
                position: "top-left",
            });
            console.log(error);
        }
    };

    const login = async () => {
        try {
            const { data } = await client.post("/users/login", { email, password });
            setUser(data)
            // navigate('/dashboard')
            console.log(data);
        } catch (error) {
            toast.error("Failed", {
                position: "top-left",
            });
            console.log(error);
        }
    };

    return (
        <div className='flex w-screen h-screen justify-center items-center'>
            {/* <div onClick={signInWithGoogle} className='flex gap-3'>
                <div><BsGoogle /></div>
                <div>Login</div>
            </div> */}

            {/* <div className='flex flex-col gap-3 w-64'>
                <RegularInput label={'Email'} value={email} onChange={(e) => { setEmail(e.target.value) }} placeholder={'user@example.com'} />
                <RegularInput type={'password'} label={'Password'} value={password} onChange={(e) => { setPassword(e.target.value) }} placeholder={'*******'} />
                <RegularSelectAlt label={'Role'} value={role} onChange={(e) => { setRole(e.target.value) }} options={[
                    { value: 'officer', label: 'Loan officer' },
                    { value: 'reviewer', label: 'Review officer' },
                    { value: 'approver', label: 'Approval authority' },
                ]} />
                <div onClick={register} className='flex cursor-pointer rounded hover:scale-105 duration-300 bg-surface-light text-white py-2 mt-8 justify-center w-full'>
                    Register
                </div>
            </div> */}
            <div className='flex flex-col gap-3 w-64'>
                <RegularInput type="email" label={'Email'} value={email} onChange={(e) => { setEmail(e.target.value) }} placeholder={'user@example.com'} />
                <RegularInput type={'password'} label={'Password'} value={password} onChange={(e) => { setPassword(e.target.value) }} placeholder={'*******'} />
                <div onClick={login} className='flex cursor-pointer rounded hover:scale-105 duration-300 bg-surface-light text-white py-2 mt-8 justify-center w-full'>
                    Login
                </div>
            </div>
        </div>
    )
}
