import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import SwiperCore from 'swiper';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import ListingItem from '../components/ListingItem'
SwiperCore.use([Navigation]);

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  console.log('offer are ', offerListings)

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/listing/get?offer=true&limit=4', {
          method: 'GET',
        });
        const data = await response.json();
        setOfferListings(data.listings);
      } catch (error) {
        console.log('error', error);
      }
    };
    fetchOfferListings();

    const fetchRentListings = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/listing/get?type=rent&limit=4', {
          method: 'GET',
        });
        const data = await response.json();
        setRentListings(data.listings);
      } catch (error) {
        console.log('error', error);
      }
    };
    fetchRentListings();

    const fetchSaleListings = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/listing/get?type=sale&limit=4', {
          method: 'GET',
        });
        const data = await response.json();
        setSaleListings(data.listings);
      } catch (error) {
        console.log('error', error);
      }
    };
    fetchSaleListings();
  }, []);

  return (
    <div className="">
      {/* TOP */}
      <div className="flex flex-col gap-6 py-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
          Find your next <span className="text-slate-500">perfect</span> <br />
          place with ease
        </h1>
        <div className="text-gray-400 text-xs sm:text-sm">
          Hamza Estate will help you find your home fast, easy and comfortable. <br />
          Our expert support are always available.
        </div>
        <Link to="/search" className="text-xs sm:text-sm text-blue-800 font-bold hover:underline">
          Let's start now...
        </Link>
      </div>

      {/* Swiper */}
      <Swiper navigation={true}>
        {offerListings && offerListings.length > 0 && offerListings.map((listing) => (
          <SwiperSlide key={listing._id}>
            <div style={{ background: `url(${listing.imageUrls[0] ? listing.imageUrls[0]  :"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJLhFr4M0daPFki9CP8_ZYTLxDV9VJi51lig&s"}) center no-repeat`, backgroundSize: 'cover' }} className="h-[500px]">
              <div className="p-4 text-white">{listing.title}</div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>


        {/* listings result for offer rent sale */}

        <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {
          offerListings && offerListings.length>0 && (
            <div className="">
              <div className="my-3">
                <h2 className='text-2xl font-semibold text-slate-600'>Recent Offers</h2>
                <Link to="/search?offer=true" className='text-sm text-blue-800 hover:underline'>Show more offer</Link>
              </div>
              <div className="flex flex-wrap gap-4">
                {
                  offerListings.map((listing)=>{
                    return <ListingItem key={listing._id} listing={listing} />
                  })
                }
              </div>
            </div>
          )
        }
        {
          rentListings && rentListings.length>0 && (
            <div className="">
              <div className="my-3">
                <h2 className='text-2xl font-semibold text-slate-600'>Recent places for rent</h2>
                <Link to="/search?type=rent" className='text-sm text-blue-800 hover:underline'>Show more places for rent</Link>
              </div>
              <div className="flex flex-wrap gap-4">
                {
                  rentListings.map((listing)=>{
                    return <ListingItem key={listing._id} listing={listing} />
                  })
                }
              </div>
            </div>
          )
        }
        {
          saleListings && saleListings.length>0 && (
            <div className="">
              <div className="my-3">
                <h2 className='text-2xl font-semibold text-slate-600'>Recent Places for Sale</h2>
                <Link to="/search?type=sale" className='text-sm text-blue-800 hover:underline'>Show more places for sale</Link>
              </div>
              <div className="flex flex-wrap gap-4">
                {
                  saleListings.map((listing)=>{
                    return <ListingItem key={listing._id} listing={listing} />
                  })
                }
              </div>
            </div>
          )
        }
        </div>

    </div>
  );
}
