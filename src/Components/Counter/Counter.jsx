import React from 'react';
import './Counter.css';
import CountUp from 'react-countup';

export default function Counter({text, count}) {
  return (
<div className="counter-outer-container" >
  {/* style={{backgroundImage: "url('assets/house.png')"}} */}
<div className="counter-title">
    {text.replace(/_/g, " ")}
</div>
<CountUp start={0} end={count} duration={1} prefix={(text === 'income' || text === 'Rent_per_Month')? '$':''} className="counter-count"/>
{/* prefix="$ " suffix=" left" */}
</div>  
)
}
