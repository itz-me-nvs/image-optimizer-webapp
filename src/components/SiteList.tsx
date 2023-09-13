import { useEffect, useState } from 'react';
import { BASE_URL } from '../constant';
import SiteCard, { siteType } from "./SiteCard";
const SiteList = () => {

    const [siteList, setSiteList] = useState<siteType[]>([])

  const authToken = localStorage.getItem('token')



  const getSiteList = async()=> {
    const result = await fetch(`${BASE_URL}/getSites`, {
  method: "GET",
  headers:{
    "Authorization": `Bearer ${authToken}`
  }
}


    )
    const list = await result.json();

    setSiteList(list['sites'])

}
  useEffect(()=> {
    getSiteList();

  }, [])
      return (

  <div className='mt-2'>

  {
    siteList.map(s=> {
      return (
        <SiteCard displayName={s.displayName} id={s.id} previewUrl={s.previewUrl} key={s.id}/>
      )
    })
  }
  </div>
      )
  }




export default SiteList