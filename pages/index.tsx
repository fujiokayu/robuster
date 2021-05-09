import Link from 'next/link'
import { useUser } from '../utils/auth/useUser'
import WatchLoader from '../components/WatchLoader'
import List from '../components/List'
import Upload from '../components/Upload'
import Invite from '../components/Invite'
import VerifyEmail from '../components/VerifyEmail'
import { getUsers } from '../utils/firestore/getUsers'
import {useState, useEffect, createContext} from 'react'
import Select from 'react-select'

export const uidContext = createContext('')

const Index = () => {
  const { user, logout } = useUser()
  const [options, setOptions] = useState([])
  const [uid, setUid] = useState<string>()
  const [uploaded, setUploaded] = useState(false)

  const onChange = (value) => {
    setUid(value.value)
  }
  const updateList = (isState) => {
    setUploaded(isState)
  }

  // Init ui
  useEffect(() => {
    if (user && user.admin && options.length === 0) {
      setUid(user.id)
      getUsers().then((list) => {
        const items = []
        list.forEach((row) => {
          const newValue = { value: row.uid, label: row.email.toLowerCase() }
          items.push(newValue)
        })
        setOptions(Array.from(new Set(items)))
      })
    }
    else if (user && !uid) {
      setUid(user.id)
    }
  }, [user])

  if (!user) {
    return (
      <div style={{textAlign: 'center'}}>
        <WatchLoader />
        <br/>
        <Link href={'/auth'}>
          <a className="siimple-link">サインイン</a>
        </Link>
      </div>
    )
  }
  if (user.id == "" || (user && !user.verified)){
    return (
      <>
        <p className="siimple-jumbotron-title">Sign in してからご利用ください。</p>
        <p className="siimple-tip siimple-tip--warning siimple-tip--exclamation">
          email に送られた確認コードにアクセスしていない場合もこのページが表示されます。{' '}
          <Link href={'/auth'}>
            <a className="siimple-link">サインイン</a>
          </Link>
        </p>
        <VerifyEmail />
      </>
    )
  }

  return (
    <div>
      <div className="siimple-jumbotron-title">secure storage</div>
      <p className="siimple-btn siimple-btn--success" onClick={() => logout()}>
        サインアウト
      </p>
      {options.length > 0 ? (
          <Select options={options} onChange={(onChange)} placeholder='ファイルを共有するユーザーを選択してください'/>
      ) : (
        <p>ユーザー: {user.email}</p>
      )}
      <uidContext.Provider value={uid}>
        <List updateList={updateList} uploaded={uploaded}/>
        <Upload updateList={updateList}/>
      </uidContext.Provider>
      { user.admin == true &&
        <Invite />
      }
      <div className="siimple-footer" style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center"}}>
        <Link href={'/privacyPolicy'}>
          <a className="siimple-link">privacy policy</a>
        </Link>
      </div>
    </div>
  )
}

export default Index
