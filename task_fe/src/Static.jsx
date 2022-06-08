import { createContext, useState } from 'react';
export const url = "https://thanhkhan.anhtester.com/task_be/public/api/";
export const UserContext = createContext();
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const checkSetUser = (data) => {
    if (data?._token) {
      setKey(data?._token);
    }
    setUser(data)
  }
  return (<UserContext.Provider value={{ get: user, set: checkSetUser }}>{children}</UserContext.Provider>)
}
function setCookie(cname, cvalue = '', exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

export const setKey = (value) => setCookie('key', value, 3600);

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

export const key = () => getCookie('key');

