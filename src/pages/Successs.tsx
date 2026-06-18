import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function Successs() {

  const [params] = useSearchParams();

  const navigate = useNavigate();

  useEffect(() => {

    const token = params.get('token');

    if (token) {

      localStorage.setItem('token', token);
        localStorage.setItem("isAuthenticated", "true");
        navigate("/")
    }

  }, []);

  return <h1>Logging in...</h1>;
}