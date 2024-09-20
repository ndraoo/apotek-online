import axios from 'axios';
import React, { useContext, useEffect, useState, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../services/authService.js';
import useValidation from '../custom/useValidation.jsx';
import Spinner from '../layout/Spinner.jsx';
import { AuthContext } from '../../context/authContext.js';
import Header from '../layout/buyer/Header.jsx';
import Footer from '../layout/buyer/footer.jsx';
import Swal from 'sweetalert2';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { accessToken } = useContext(AuthContext);

    useEffect(() => {
        if (accessToken) navigate('/');
    }, [accessToken]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors(null);
        setLoading(true);

        if (password !== confirmPassword) {  
            setLoading(false);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Passwords do not match',
                customClass: {
                    confirmButton: 'bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700',
                },
                buttonsStyling: false,
            });
            return;
        }

        const data = { name, email, password, password_confirmation: confirmPassword };

        try {
            const response = await axios.post(`${BASE_URL}/register`, data);
            setLoading(false);
            setName('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            console.log(response)
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: response.data.message,
                customClass: {
                    confirmButton: 'bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700',
                },
                buttonsStyling: false,
            });
            navigate('/login');
        } catch (error) {
            setLoading(false);
            if (error?.response?.status === 422) {
                console.log('Validation Errors:', error.response.data.errors);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: Object.values(error.response.data.errors).join(', '),
                    customClass: {
                        confirmButton: 'bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700',
                    },
                    buttonsStyling: false,
                });
            }
            console.log(error);
        }
    };

    return (
        <Fragment>
            <Header />
            <div className="contain py-16">
                <div className="max-w-lg mx-auto shadow px-6 py-7 rounded overflow-hidden">
                    <h2 className="text-2xl uppercase font-medium mb-1">Create an account</h2>
                    <p className="text-gray-600 mb-6 text-sm">
                        Register for a new customer
                    </p>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <div>
                                <label htmlFor="name" className="text-gray-600 mb-2 block">Name*</label>
                                <input
                                    type="text"
                                    className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    id="name"
                                    required
                                />
                                {useValidation(errors, 'name')}
                            </div>
                            <div>
                                <label htmlFor="email" className="text-gray-600 mb-2 block">Email address*</label>
                                <input
                                    type="email"
                                    className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    id="email"
                                    required
                                />
                                {useValidation(errors, 'email')}
                            </div>
                            <div>
                                <label htmlFor="password" className="text-gray-600 mb-2 block">Password*</label>
                                <input
                                    type="password"
                                    className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    id="password"
                                    required
                                />
                                {useValidation(errors, 'password')}
                            </div>
                            <div>
                                <label htmlFor="confirmPassword" className="text-gray-600 mb-2 block">Confirm Password*</label>
                                <input
                                    type="password"
                                    className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    id="confirmPassword"
                                    required
                                />
                                {useValidation(errors, 'password_confirmation')}
                            </div>
                            {loading ? (
                                <Spinner />
                            ) : (
                                <div className="mt-4">
                                    <button
                                        type="submit"
                                        className="block w-full py-2 text-center text-white bg-primary border border-primary rounded hover:bg-transparent hover:text-primary transition uppercase font-roboto font-medium"
                                    >
                                        Create Account
                                    </button>
                                </div>
                            )}
                        </div>
                    </form>
                    <p className="mt-4 text-center text-gray-600">
                        Already have an account?{' '}
                        <a href="/login" className="text-primary">
                            Login now
                        </a>
                    </p>
                </div>
            </div>
            <Footer />
        </Fragment>
    );
}
