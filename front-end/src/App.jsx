
import './App.css'
import  Indexscreen from "./component/index";
import Loging from './component/loging';
import Dash from './component/dashboard';
import { useState } from "react";

function App() {
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const [authUser, setAuthUser] = useState({});


  return (
    <>
      {isLoggedIn ? (
        <Dash authUser={authUser} />
      ) : (
        <Loging setisLoggedIn={setisLoggedIn} setAuthUser={setAuthUser} />
      )}
    </>
  )
}

export default App
