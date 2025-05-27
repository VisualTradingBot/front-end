//import { useState } from "react";
import "./App.scss";
import "./reusable_style.scss";
import { Button } from "./reusable.jsx";

export default function App() {
  return (
    <>
      <Header />
      <LandingMain />
    </>
  );
}

function Header() {
  return (
    <header>
      <div className="nav-left">
        <svg
          className="logo"
          width="36"
          height="36"
          viewBox="0 0 36 36"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M17.9986 5.53472L35.5997 0.349121L30.464 18.0001L35.5997 35.6012L17.9986 30.4655L0.347656 35.6012L5.53325 18.0001L0.347656 0.349121L17.9986 5.53472Z"
            fill="black"
          />
        </svg>
        <h1>VTB</h1>
      </div>
      <div className="nav-right">
        <ul className="nav">
          <li>Services</li>
          <li>About Us</li>
          <li>Contact</li>
        </ul>
        <Button classes="request">Request quote</Button>
      </div>
    </header>
  );
}

function LandingMain() {
  return (
    <div className="landing">
      <div className="landing_1">
        <h1>Welcome to Our Service</h1>
        <p>Your satisfaction is our priority.</p>
        <Button classes="explore">Explore Services</Button>
      </div>
      <div className="landing_2">
        <img
          src="https://www.shutterstock.com/shutterstock/photos/2447402373/display_1500/stock-vector-poor-or-poverty-with-empty-wallet-financial-problem-trouble-to-pay-loan-bankruptcy-or-2447402373.jpg"
          alt="poor_shutterstock"
        />
      </div>
    </div>
  );
}
