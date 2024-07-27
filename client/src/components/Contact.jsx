import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

export default function Contact({ listing }) {
    const [landlord, setLandLord] = useState(null);
    const [message, setMessage] = useState('')

    useEffect(() => {
        const fetchLandLord = async () => {
            try {
                const res = await fetch(`http://localhost:3000/api/user/${listing.userRef}`, {
                    method: 'GET',
                    credentials: "include"
                });
                const data = await res.json();
                setLandLord(data);
            } catch (error) {
                console.log('error in gettin landlord', error)
            }
        }
        fetchLandLord();
    }, [listing.userRef])

    return (
        <>
            {
                landlord && (
                    <div className='flex flex-col gap-2'>
                        <p>Contact <span className='font-semibold'>{landlord?.rest?.username}</span> for <span className='font-semibold'>{listing.name.toLowerCase()}</span> </p>
                        <textarea name="message" id="message"
                            rows={2} value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder='Message' className='border border-gray-300 rounded-md p-2 w-full resize-none'
                        >
                        </textarea>
                        <Link className='text-white text-center uppercase bg-slate-700 p-3 rounded-lg hover:opacity-95' to={`mailto:${listing.email}?subject=Regarding  ${listing.name}&body=${message}`}>Send Message</Link>
                    </div>
                )
            }
        </>
    )
}
