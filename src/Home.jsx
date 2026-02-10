import React,{useEffect, useState} from 'react';
import Colors from './Colors';
import axios from 'axios';

const Home=()=>{

const [Data,setData]=useState({ //comeback to this
    Company:'',
    Description:'',
})
const [colorsData,setColorsData]=useState([]) //come back to this

    useEffect(()=>{
     axios.get('https://reqres.in/api/unknown',  { headers: { 'x-api-key': 'reqres_bc833d78e78f49b297257c99fa851391'}}) // change the api key here to the nutrition api
        .then(res=>{

            //make the name and description your own fictional company
            let companyName = "Action Movies";
            let CompanyDesc= " We provide action packed movies for kids."

            setData({Company:companyName, Description:CompanyDesc})
            setColorsData(res.data.data)
          

        })
        .catch(err=>{
        console.log(err);
         })
     }, [])
    
    return(

         
        <>
        <h1>{Data.Company}</h1>
        <p>{Data.Description}</p>
        <Colors data = {colorsData}/>

        </>
    )
}

export default Home;