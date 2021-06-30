import React from "react";
import { Navbar, NavbarBrand, Button } from "reactstrap";

function Hero({user}) {
  return (
    <>
      <div>
        <Navbar color="light" light expand="md" style={{ padding: "1rem", justifyContent:"space-around" }}>
          <NavbarBrand href="/">ESISHARE</NavbarBrand>
          <Button outline>Github</Button>
        </Navbar>
        <div className="hero" style={{textAlign:"center", margin:"6rem 12rem", justifyContent:"center", display:"flex", flexDirection:"column"}}>
            <h2 className="hero_main" style={{fontSize:"4rem", fontWeight:"200"}}>Welcome user <b>#{user ? user.username : "ghost"}</b> { user ? user.emoji : "🤩"}</h2>
            <p className="hero_sub" style={{marginBottom:"2rem"}}>The simplest way to share big ideas around the world, and discover new creative work while you are at it.</p>
            <div className="hero_cta" style={{display:"flex", flexDirection:"column", justifyContent:"center", width:"13rem", alignSelf:"center", borderRadius:"1rem"}}>
                <Button outline color="success" className="hero_cta--btn" style={{width:"4rem", height:"4rem", borderRadius:"50%", margin:"0 auto"}}>+</Button>
                <b className="hero_cta--main">Add your file</b>
                <span className="hero_cta--sub">Up to 20GB</span>
            </div>
        </div>
      </div>
    </>
  );
}

export default Hero;
