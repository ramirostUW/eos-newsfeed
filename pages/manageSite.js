import React, { useEffect, useState } from "react";
import { AddAuthorPane, ManageContentPane, 
    AddAdminPane, NotLoggedInBox, AccountBeingLookedUpBox } from "../components";
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react';
import Link from 'next/link';

export default function AdminDash() {

    const { instance, accounts } = useMsal();

    const [pageAdmin, setPageAdmin] = useState();
    const [loadedAdminInfo, setLoadedAdminInfo] = useState(false);

    function fetchAdminData() {
        const email = accounts[0].username;
        fetch('/api/grabAdminInfo?email=' + encodeURIComponent(email))
            .then((res) => res.json())
            .then((data) => {
                setPageAdmin(data[0]);
                setLoadedAdminInfo(true);
            })
    }

    useEffect(() => {
        if (!(accounts[0] == null)) {
            fetchAdminData();
        }
    }, [accounts])

    return (
        <div className="container mx-auto px-10 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="col-span-1 lg:col-span-8">
                    <AuthenticatedTemplate>
                        {(!(pageAdmin) && !loadedAdminInfo) && <AccountBeingLookedUpBox />}
                        {pageAdmin && <div>
                            <ManageContentPane />
                            <AddAuthorPane />
                            <AddAdminPane />
                        </div>}
                        {(!(pageAdmin) && loadedAdminInfo) && <AccountNotAuthorizedBox />}
                    </AuthenticatedTemplate>

                    <UnauthenticatedTemplate>
                        <NotLoggedInBox />
                    </UnauthenticatedTemplate>
                </div>
            </div>
        </div>
    );

}

const AccountNotAuthorizedBox = () => {
    return (
      <div className='bg-white shadow-lg rounded-lg p-8 mb-8'>
        <h3 className='text-xl mb-8 font-semibold pb-4'>
          You are not currently authorized as an Admin.
        </h3>
        <p className='pb-4'>
          You may be logged on the wrong Microsoft account. Go to the
          <Link href={`/eosLogin`} className='text-blue-500'> login page </Link>
          to check which account you are currently logged in to.
        </p>
      </div>
    )
  }

