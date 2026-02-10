import React from 'react';

const Colors= ({data})=>{
    return(
        <>
        {
            data && data.map((d)=>{

                return(
                    <div className="card" key={d.id} style={{background:d.color}}>. 
                    <div className="container">
                        <h4><b>{d.name}</b></h4> 
                        <p >{d.color}</p>
                        </div>
                        </div>
                )
            })
            }
        </>
    )
}

export default Colors; // COME BACK TO EDIT THIS COLORS CLASS