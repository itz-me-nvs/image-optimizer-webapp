import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../App.css';
import { BASE_URL, authDetails } from '../constant';

function Authorize() {
  const location = useLocation();
  const navigate = useNavigate();
  const code = location.search.split('?code=');

  useEffect(() => {
    const requestToken = async () => {
      try {
        const result = await fetch(`${BASE_URL}/getAccessToken?client_id=${authDetails.client_ID}&client_secret=${authDetails.client_secret}&code=${code[1]}`, {
          method: "GET",
        });

        if (result.ok) {
          const token = await result.json();
          localStorage.setItem("token", token.access_token);
          navigate('/');
        } else {
          // Handle error cases here, such as showing an error message to the user
        }
      } catch (error) {
        console.error("Error fetching access token:", error);
        // Handle error cases here, such as showing an error message to the user
      }
    };

    if (code[1]) {
      requestToken();
    }
  }, [code, navigate]);

  return (
    <section className="flex items-center justify-center mx-auto">
      <button
        className="bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => {
          window.location.href = `https://webflow.com/oauth/authorize?response_type=code&client_id=${authDetails.client_ID}&scope=${authDetails.scope}`;
        }}
      >
        Authorize
      </button>
    </section>
  );
}

export default Authorize;
