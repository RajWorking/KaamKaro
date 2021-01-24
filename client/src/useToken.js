import { useState } from 'react';

const useToken = () => {
  function saveToken(token) {
    localStorage.setItem('token', JSON.stringify(token));
    setToken(token)
  }
  function getToken() {
    const token = JSON.parse(localStorage.getItem('token'));
    return token;
  }

  const [token, setToken] = useState(getToken());

  return {
    setToken: saveToken,
    token,
  };
};

export default useToken;
