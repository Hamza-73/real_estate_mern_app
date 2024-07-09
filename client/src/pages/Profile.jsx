import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase'
import { updateUserFailure, updateUserStart, updateUserSuccess } from '../redux/user/userSlice';
import axios from 'axios'

export default function Profile() {

  const dispatch = useDispatch();

  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector(state => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0)
  const [fileError, setFileError] = useState(false)
  const [formData, setFormData] = useState({
    username: "", email: "", password: "", avatar: ""
  });
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // console.log(formData)
  // console.log(filePerc)
  // console.log(fileError)
  console.log('cuurent user is ', currentUser._id)

  useEffect(() => {
    if (file) {
      handleFileUpload(file)
    }
  }, [file])

  const handleFileUpload = async (file) => {
    try {
      console.log("it is starting")
      const storage = getStorage(app)
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName)
      const uploadTask = uploadBytesResumable(storageRef, file)
      console.log("initialization complete")

      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setFilePerc(Math.round(progress))
        },
        (err) => {
          setFileError(true)
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloaaURL) => {
            setFormData({ ...formData, avatar: downloaaURL })
          })
        })
    } catch (error) {
      console.log("error in uploading file", error)
    }
  }

  //firebase storage
  //allow read;
  // allow write: if
  // request.resource.size <= 2 * 1024 * 1024 
  // && request.resource.contentType.matches('image/.*')


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Only include fields that have changed
    const updatedFields = {};
    for (const [key, value] of Object.entries(formData)) {
      if (value !== '' && value !== currentUser[key]) {
        updatedFields[key] = value;
      }
    }

    console.log("Fields to update:", updatedFields);

    try {
      dispatch(updateUserStart());
      const res = await fetch(`http://localhost:3000/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify(updatedFields),
      });
      const data = await res.json();
      console.log("Response Data:", data);

      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data.user));
      setUpdateSuccess(true)
    } catch (error) {
      console.log("Error in updating:", error);
      dispatch(updateUserFailure(error.message));
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className="text-center semi-bold text-3xl my-7">Profile</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>

        <input type="file" ref={fileRef} hidden accept='image/*' onChange={e => {
          setFile(e.target.files[0])
        }} />
        <img onClick={() => fileRef.current.click()} src={formData?.avatar || currentUser.avatar} alt="Profile" className='w-24 h-24 rounded-full object-cover cursor-pointer self-center mt-2' />
        <p className='text-center'>
          {
            fileError ? (
              <span className='text-red-700'>
                Error in Uploading Image. (image must be less than 2mb) Try Again!
              </span>
            ) : (
              filePerc > 0 && filePerc < 100 ? (
                <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
              ) :
                filePerc === 100 ? (
                  <span className="text-green-700">File Uploaded!</span>
                )
                  : ""
            )
          }
        </p>
        <input name="username" type="text" placeholder='username' defaultValue={currentUser.username} className='border p-3 rounded-lg outline-none' id='username' onChange={handleChange} />
        <input name="email" type="email" placeholder='email' defaultValue={currentUser.email} className='border p-3 rounded-lg outline-none' id='email' onChange={handleChange} />
        <input name="password" type="password" placeholder='password' className='border p-3 rounded-lg outline-none' id='password' onChange={handleChange} />
        <button disabled={loading} className="rounded-lg bg-slate-700 p-3 text-white hover:opacity-95 uppercase">{loading ? "Loading.." : "Update"}</button>
      </form>
      <div className='flex justify-between mt-5'>
        <div className="text-red-700 cursor-pointer">Delete Account</div>
        <div className="text-green-700 cursor-pointer">Sign Out</div>
      </div>
      <p className='text-red-700 mt-2'>
        {error ? error : ""}
      </p>
      <p className='text-green-700 mt-2'>
        {updateSuccess ? "Updated Successfully!" : ""}
      </p>
    </div>
  )
}
