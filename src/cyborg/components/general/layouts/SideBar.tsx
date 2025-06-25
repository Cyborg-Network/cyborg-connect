import React, { useEffect, useState } from 'react'
import logo from '../../../../../public/assets/Logo.png'
import profile from '../../../../../public/assets/icons/profile.png'
import { IoMenu } from 'react-icons/io5'
import { BsThreeDots } from 'react-icons/bs'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { ROUTES } from '../../../..'
import { useUi } from '../../../context/UiContext'
import Button from '../buttons/Button'
import { useAuth0 } from '@auth0/auth0-react'

const SideBar = () => {
  const navigate = useNavigate();
  const { sidebarIsActive, setSidebarIsActive } = useUi();
  const { loginWithRedirect, isAuthenticated, logout, user, getAccessTokenSilently } = useAuth0();
  const [userMetadata, setUserMetadata] = useState(null);

  const navigateAndCloseSidebar = url => {
    setSidebarIsActive(false)
    navigate(url)
  }

  useEffect(() => {
    const getUserMetadata = async () => {
      const domain = "dev-2x17egiyhkuudp5t.us.auth0.com";

      try {
        const accessToken = await getAccessTokenSilently({
          authorizationParams: {
            audience: `https://${domain}/api/v2/`,
            scope: "read:current_user",
          },
        });

        const userDetailsByIdUrl = `https://${domain}/api/v2/users/${user.sub}`;

        const metadataResponse = await fetch(userDetailsByIdUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const { user_metadata } = await metadataResponse.json();

        setUserMetadata(user_metadata);
      } catch (e) {
        console.log(e.message);
      }
    };

    getUserMetadata();
  }, [getAccessTokenSilently, user?.sub]);

  const returnSidebarClass = sidebarIsActive ? '' : '-translate-x-full'
  const returnButtonClass = sidebarIsActive
    ? '-translate-x-0'
    : 'translate-x-20'

  return (
    <>
      <div
        className={`w-80 fixed left-0 top-0 flex flex-col bg-cb-gray-600 h-screen justify-between transform ${returnSidebarClass} transition-transform duration-500 z-50`}
      >
        <div>
          <span className="flex items-center justify-between p-4 pr-6">
            <div className="flex gap-4 items-center flex-shrink-0">
              <button></button>
              <Link to={ROUTES.CHOOSE_PATH}>
                <img src={logo} className="h-10S" />
              </Link>
            </div>
            <div
              onClick={() => setSidebarIsActive(!sidebarIsActive)}
              className={`hover:cursor-pointer absolute right-4 transform ${returnButtonClass} transition-transform duration-500 border border-cb-gray-400 flex items-center justify-center size-10 bg-cb-gray-700 rounded-md`}
            >
              <IoMenu size={27} color="gray" />
            </div>
          </span>
          <span className="flex flex-col items-center my-6">
            <Button
              type="button"
              selectable={false}
              variation="primary"
              onClick={() => navigateAndCloseSidebar(ROUTES.DASHBOARD)}
              additionalClasses={'w-5/6'}
            >
              Dashboard
            </Button>
          </span>
        </div>
        <div>
          <span className="text-white">
            <ul className="flex flex-col gap-6 p-10">
              <li>Docs</li>
              <li>Community</li>
              <li>Help</li>
            </ul>
          </span>
          <span className="flex flex-col p-4 bg-cb-gray-700 m-4 rounded-md">
            <div className="flex justify-between items-center pb-6">
              <div className="flex gap-4 justify-between">
                <a>
                  <img src={user ? user.picture : profile} className="h-10S" />
                </a>
                <button className="text-white">{
                  (isAuthenticated && user)
                    ? user.email
                    : "User"
                }</button>
                <BsThreeDots size={40} color={'gray'} />
              </div>
            </div>
            {!isAuthenticated ? (
              <Button
                type="button"
                selectable={false}
                variation="primary"
                onClick={() => loginWithRedirect()}
              >
                Login
              </Button>
            ) : (
              <Button
                type="button"
                selectable={false}
                variation="primary"
                onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
              >
                Logout
              </Button>
            )}
            <p>User Metadata</p>
            {userMetadata ? (
              <pre>{JSON.stringify(userMetadata, null, 2)}</pre>
            ) : (
              "No user metadata defined"
            )}
          </span>
        </div>
      </div>
      {/*Invisible overlay for the sidebar so that clicks beside it can also deactivate it*/}
      <div
        className={`fixed top-0 left-0 w-screen h-screen lg:hidden z-40 ${
          sidebarIsActive ? '' : 'hidden'
        }`}
        onMouseDown={() => setSidebarIsActive(!sidebarIsActive)}
      />
      <Outlet />
    </>
  )
}

export default SideBar
