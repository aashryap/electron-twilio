import {useEffect, useState} from "react";

export const NetworkQualitySign = ({})=>{

  const [signal,setSignal] = useState(1);

  useEffect(()=>{
    const i = setInterval(()=>{
      setSignal(Math.floor(Math.random() * 3)+1);
    },5000);
    return ()=>{ clearInterval(i); };
  },[]);

  return <div className="flex items-end">
    <div className={`w-1 mr-1 ${signal>1?"bg-green-500":"bg-red-500"} h-2`}/>
    <div className={`w-1 mr-1 ${signal>=2?"bg-green-500":"bg-gray-300"} h-3`}/>
    <div className={`w-1 mr-1 ${signal===3?"bg-green-500":"bg-gray-300"} h-4`}/>
  </div>
}