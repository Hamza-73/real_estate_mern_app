import React from 'react'
import {getAuth, GoogleAuthProvider, signInWithPopup} from 'firebase/auth'
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

export default function OAuth() {

    const dispatch = useDispatch();
    const navigate = useNavigate()

    const handleGoogleClick = async ()=>{
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app)

            const result = await signInWithPopup(auth, provider);
            console.log(result)
            console.log('here we are ');
            const response = await fetch('http://localhost:3000/api/auth/google',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name : result.user.displayName,
                        email: result.user.email,
                        photo: result.user.photoURL,
                    }),
            });
            console.log('request ')
            const data = await response.json();
            console.log('data is ',data)
            dispatch(signInSuccess(data))
            if(data.success){
                navigate('/')
            }
        } catch (error) {
            console.log('error signin with google', error);
        }
    }
  return (
    <>
        <button onClick={handleGoogleClick} type='button' className="bg-red-700 text-white p-3 rounded-lg hover:opacity-95">Continue with Google</button>
    </>
  )
}
