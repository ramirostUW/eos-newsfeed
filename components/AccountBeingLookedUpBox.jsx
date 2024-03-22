import React from "react";

const AccountBeingLookedUpBox = () => {
    return (
        <div className='bg-white shadow-lg rounded-lg p-8 mb-8'>
            <h3 className='text-xl mb-8 font-semibold pb-4'>
                Your account's permissions are being checked.
            </h3>
            <p className='pb-4'>
                Please wait for a moment.
            </p>
        </div>
    )
}

export default AccountBeingLookedUpBox;