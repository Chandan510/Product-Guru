
import React from "react";

function StatsCard({ color,  heading, message, figures, icon }) {
  

  return (
    <div className="w-full lg:w-1/5 shadow-2xl h-fit rounded-md min-h-14 flex flex-col gap-2  items-start p-4 mb-5 " style={{backgroundColor: color}}>
        <div className="w-full  flex justify-between  " >
          <div className="text-lg font-bold">{heading}</div>
          <div>
            <img src={icon} width={40} />
          </div>
          </div>
        <div className="text-sm font-medium">{message}</div>
        <div className="text-xl font-bold">{(figures/1000).toFixed(2)} k </div>
    </div>
  );
}

export default StatsCard;
