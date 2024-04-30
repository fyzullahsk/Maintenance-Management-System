import React, { useState, useEffect } from 'react';
import './LandingPage.css';
import { useNavigate } from 'react-router-dom';
// import LandingNav from '../Components/LandingNav/LandingNav';
export default function LandingPage() {
  const navigate = useNavigate()
  const slides = [
    {
      id: 1,
      imageUrl: 'assets/1.png',
      title:'Welcome to',
      text:'maintenance management system'
      // title: 'Streamline Your Operations',
      // text: 'Efficient service management at your fingertips',
    },
    {
      id: 2,
      imageUrl: 'assets/2.png',
      title:'Welcome to',
      text:'maintenance management system'
      // title: 'Preventive Maintenance Made Easy',
      // text: 'Proactive solutions for optimal performance',
    },
    {
      id: 3,
      imageUrl: 'assets/3.png',
      title:'Welcome to',
      text:'maintenance management system'
      // title: 'Centralized Asset Management',
      // text: 'Gain complete visibility into your assets',
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((currentSlide + 1) % slides.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [currentSlide, slides.length]);

  return (
    <>
    {/* <LandingNav/> */}
    <div className="slider">
      <div className="menu" >
        <div onClick={()=>navigate('/register')}>Register</div>
        <div onClick={()=>navigate('/login')}>Login</div>
      </div>
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`slide ${index === currentSlide ? 'activeimage' : 'hide'}`}
        >
          <div
            className="image-container"
            style={{ backgroundImage: `url(${slide.imageUrl})` }}
          ></div>
          <div className="greeting-message">
            <span className="greet-title">{slide.title}</span>
            <span className="greet-message">{slide.text}</span>
          </div>
        </div>
      ))}
    </div>
    </>
  );
}
