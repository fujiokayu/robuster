import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { getAuth, onIdTokenChanged, signOut } from 'firebase/auth'
import { firebaseApp } from '../firebase/initFirebase'
import {
  removeUserCookie,
  setUserCookie,
  getUserFromCookie,
} from './userCookies'
import { mapUserData } from './mapUserData'

interface typeUser {
  id: string,
  email: string,
  token: string,
  verified: boolean,
  admin: boolean
}

const auth = getAuth(firebaseApp)

const useUser = () => {
  const [user, setUser] = useState<typeUser | null>(null)
  const router = useRouter()

  const logout = async () => {
    return signOut(auth)
      .then(() => {
        // Sign-out successful.
        router.push('/auth')
      })
      .catch((e) => {
        console.error(e)
      })
  }

  useEffect(() => {
    // Firebase updates the id token every hour, this
    // makes sure the react state and the cookie are
    // both kept up to date
    const cancelAuthListener = onIdTokenChanged(auth, async (user) => {
        if ( user ) {
          const userData = await mapUserData( user )
          setUserCookie( userData )
          setUser( userData )
        } else {
          removeUserCookie()
          // ユーザーが存在しないときは空の typeUser を設定するように修正
          setUser({
            id: "",
            email: "",
            token: "",
            verified: false,
            admin: false         
          })
        }
      } )

    const userFromCookie = getUserFromCookie()
    if ( !userFromCookie ) {
      router.push( '/' )
      return
    }
    setUser( userFromCookie )

    return () => {
      cancelAuthListener()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [] )

  return { user, logout }
}

export { useUser }
