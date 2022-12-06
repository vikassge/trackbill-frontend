import React, {useState,useEffect} from 'react'
import { Form, message } from "antd";
import Input from "antd/lib/input/Input";
import { Link, Navigate,useNavigate } from "react-router-dom";
import '../resources/authentication.css';
import axios from 'axios';
import Spinner from '../components/Spinner';



function Login() {
    const navigate=useNavigate();
    const [loading,setLoading]=useState(false);
    const onFinish=async(values)=>{
        try {
            setLoading(true);
            const response=await axios.post('https://fair-lime-foal-hat.cyclic.app/api/users/login',values)
            console.log(response);
            localStorage.setItem('expense-1', JSON.stringify({ ...response.data, password: "" }));
            setLoading(false)
            message.success('Login Succesfully');
            navigate('/')
            
        } catch (error) {
            setLoading(false);
            message.error('Login Failed') 
        }
    }
    useEffect(()=>{
        if(localStorage.getItem('expense-1')){
            navigate('/');
        }
    },[]); 
    return (

        <div className='register'>
                    {loading && <Spinner />}
            <div className='row justify-content-center align-items-center w-100 h-100'>
           
                <div className='col-md-4'>
                    <Form layout='vertical' onFinish={onFinish}>
                        <h1>TrackBill/Login</h1>
                        <hr/>
                      
                        <Form.Item label='Email' name='email'>
                            <Input />
                        </Form.Item>
                        <Form.Item label='Password' name='password'>
                            <Input type="password" />
                        </Form.Item>
                        <div className='d-flex justify-content-between align-items-center'>
                            <Link to='/register'>Not Registered Yet,Click Here to Registered</Link>
                            <button className='primary' type="submit">LOGIN</button>

                        </div>

                    </Form>


                </div>
                <div className='col-md-5'>
                    <div className='lottie'>
                    <lottie-player src="https://assets6.lottiefiles.com/packages/lf20_06a6pf9i.json"  background="transparent"  speed="1"   loop  autoplay></lottie-player>

                    </div>

            

                </div>

            </div>


        </div>



    )
}

export default Login

