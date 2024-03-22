import React, { useState, useRef } from "react";
import Link from 'next/link';

const NotLoggedInBox = () => {
    return (
        <div className='bg-white shadow-lg rounded-lg p-8 mb-8'>
            <h3 className='text-xl mb-8 font-semibold pb-4'>
                You are not currently logged in.
            </h3>
            <p className='pb-4'>
                Please <Link href={`/eosLogin`} className='text-blue-500'>log in</Link> to continue.
            </p>
        </div>
    )
}

export default NotLoggedInBox;