import axios from 'axios'
import React, { Fragment, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCsrfCookie, BASE_URL } from '../../services/authService.js'
import useValidation from '../custom/useValidation.jsx'
import Spinner from '../layout/Spinner.jsx'
import { AuthContext } from '../../context/authContext.js'
import Footer from '../layout/buyer/footer.jsx'
import Header from '../layout/buyer/Header.jsx'
import Swal from 'sweetalert2'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState(null)
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const { accessToken, setAccessToken, setCurrentUser} = useContext(AuthContext)

    useEffect(() => {
        if (accessToken) navigate('/')
    }, [accessToken])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrors(null)
        setLoading(true)
        const data = { email, password}

        try {
            await getCsrfCookie()

            const response = await axios.post(`${BASE_URL}/login`, data)
            if (response.data.error) {
                setLoading(false)
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: response.data.error,
                    customClass: {
                        confirmButton: 'bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700',
                    },
                    buttonsStyling: false,
                })
            } else {
                localStorage.setItem('currentToken', JSON.stringify(response.data.currentToken))
                localStorage.setItem('currentUser', JSON.stringify(response.data.user))
                setAccessToken(response.data.currentToken)
                setCurrentUser(response.data.user)
                setLoading(false)
                setEmail('')
                setPassword('')
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: response.data.status,
                    customClass: {
                        confirmButton: 'bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700',
                    },
                    buttonsStyling: false,
                }).then(() => {
                    navigate(`/${response.data.redirect}`)
                })
            }
        } catch (error) {
            setLoading(false)
            if (error?.response?.status === 422) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: Object.values(error.response.data.errors).join(', '),
                    customClass: {
                        confirmButton: 'bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700',
                    },
                    buttonsStyling: false,
                })
            } else if (error?.response?.status === 401) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Invalid email or password',
                    customClass: {
                        confirmButton: 'bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700',
                    },
                    buttonsStyling: false,
                })
            }
            console.log(error)
        }
    }

    return (
        <Fragment>
            <Header />
            <div className="contain py-16">
                <div className="max-w-lg mx-auto shadow px-6 py-7 rounded overflow-hidden">
                    <h2 className="text-2xl uppercase font-medium mb-1">Login</h2>
                    <p className="text-gray-600 mb-6 text-sm">Welcome back customer</p>
                    <form onSubmit={(e) => handleSubmit(e)}>
                        <div className='space-y-2'>
                            <div className="mb-3">
                                <label htmlFor="exampleInputEmail1" className="text-gray-600 mb-2 block">Email address*</label>
                                <input type="email" 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                                        id="exampleInputEmail1" aria-describedby="emailHelp" />
                                    { useValidation(errors, 'email')}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="exampleInputPassword1" className="text-gray-600 mb-2 block">Password*</label>
                                <input type="password" 
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                                        id="exampleInputPassword1" />
                                    { useValidation(errors, 'password')}
                            </div>
                            { 
                                loading ? 
                                <Spinner />
                                :
                                <div class="mt-4">
                                <button type="submit"
                                    class="block w-full py-2 text-center text-white bg-primary border border-primary rounded hover:bg-transparent hover:text-primary transition uppercase font-roboto font-medium">Login</button>
                                </div>
                            }
                        </div>
                    </form>
                    <p class="mt-4 text-center text-gray-600">No have account? <a href="/register" class="text-primary">Register Now</a></p>
                </div>
            </div>
            <Footer />
        </Fragment>
    )
}
