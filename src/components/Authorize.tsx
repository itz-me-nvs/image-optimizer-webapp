import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../App.css';
import { BASE_URL, authDetails } from '../constant';

function Authorize() {

  const location = useLocation();
  const navigate = useNavigate()
  console.log(localStorage.getItem('token'));


      const code = location.search.split('?code=');
      console.log(code);



      useEffect(() => {
          if(code[1]){
              console.log(code[1], 'ruebgueb');

              const requestToken = async()=>{
                  const result = await fetch(`${BASE_URL}/getAccessToken?client_id=${authDetails.client_ID}&client_secret=${authDetails.client_secret}&code=${code[1]}`, {
                    method: "GET",
                  })

                  const token = await result.json();
                  console.log(token);

                  localStorage.setItem("token", token['access_token'])
                  navigate('/')

                    }

              requestToken();
          }
      }, [code])

  return (
    <section className="bg-gray-900">
    {
      <a href={`https://webflow.com/oauth/authorize?response_type=code&client_id=${authDetails.client_ID}&scope=${authDetails.scope}
      `}

      >
        Authorize
      </a>
    }

  </section>
  )
}

export default Authorize
