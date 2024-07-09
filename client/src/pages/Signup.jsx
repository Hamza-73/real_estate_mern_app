import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import OAuth from '../components/OAuth';

export default function Signup() {

  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    username: "", emai: "", password: ""
  });

  const [loading , setLoading] = useState(false);
  const [error , setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e)=>{
    e.preventDefault();
    try {
      setLoading(true);
      const reponse = await fetch(`http://localhost:3000/api/auth/signup`,{
        method:"POST",
        headers:{
          'Content-Type' : 'Application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await reponse.json();
      console.log(data)
      if(data.success){
        navigate('/signin')
      }
      setError(data.message)
      setLoading(false);
    } catch (error) {
      setError(error.message)
      setLoading(false);
      console.log(`error in signing up ${error}`)
    }
  }

  return (
    <>
      <div className='p-3 max-w-lg mx-auto'>
        <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
        <form className='flex flex-col gap-4' onSubmit={handleSubmit} >
          <input type="text" name="username" id="username" placeholder='Username' className='border p-3 rounded-lg outline-none' onChange={handleChange} required />
          <input type="email" name="email" id="email" placeholder='Email' className='border p-3 rounded-lg outline-none' onChange={handleChange} required />
          <input type="password" name="password" id="password" placeholder='Password' className='border p-3 rounded-lg outline-none' onChange={handleChange} required />
          <button disabled={loading} className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">{loading? "Loading..." : "Sign In"}</button>
          <OAuth/>
        </form>
        <div className='flex gap-2 mt-5'>
          <p>Have an account?</p>
          <Link to="/signin">
            <span className="text-blue-700">Sign in</span>
          </Link>
        </div>
        <p className='text-red-500 my-7'>{error}</p>
      </div>
    </>
  )
}
