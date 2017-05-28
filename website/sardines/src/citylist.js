import React from 'react';

class CityList extends React.Component {

    onOpen() {
	document.getElementById("sidebar").style.display = "block";
	document.getElementById("sidebar-overlay").style.display = "block";
    }
    
    onClose() {
	document.getElementById("sidebar").style.display = "none";
	document.getElementById("sidebar-overlay").style.display = "none";
    }

    onClick(city, cb) {
	this.onClose();

	cb(city);
    }
    
    render() {
        // const cities = this.props.cities.map((city, step) => {
        //     return (
        //         <li key={city.name}>
        //           <button className="city" onClick={() => this.props.onClick(city)}>{city.name}</button>
	// 	  <br /><span className="city-subtext"><b>{city.density}</b> people/km<sup>2</sup></span>
        //         </li>
        //     );
        // });
	const cities = this.props.cities.map((city, step) => {
	    let t = ''
	    if (this.props.current === city.name) {
		t = <i className="fa fa-caret-right w3-margin-right"></i>;
	    }
            return (
                <a href="javascript:void(0)"
		   key={city.name}
		   className="w3-bar-item w3-button"
		   onClick={() => this.onClick(city, this.props.onClick)}>{t}{city.name}
		  <br /><span className="city-subtext"><b>{city.density}</b> people/km<sup>2</sup></span>
		</a>
            );
        });
	
        
        return (
	    <div>
	      <nav className="w3-sidebar w3-bar-block w3-white w3-collapse w3-top sardine-sidebar" id="sidebar">
		{/* Close Button */}
		<div className="w3-container w3-display-container w3-padding-16">
		  <i onClick={() => this.onClose()} className="fa fa-remove w3-hide-large w3-button w3-display-topright"></i>
		</div>
		
		{/* items */}
		<div className="w3-padding-64 w3-large w3-text-grey">
		  {cities}
		</div>
	      </nav>
	      
	      {/* Top menu on small screens */}
	      <header className="w3-bar w3-top w3-hide-large w3-black w3-xlarge">
		<a href="javascript:void(0)" className="w3-bar-item w3-button w3-padding-24 w3-right"
		   onClick={() => this.onOpen()}>
		  <i className="fa fa-bars"></i>
		</a>
	      </header>

	      {/* Overlay effect with sidebar */}
	      <div className="w3-overlay w3-hide-large sardine-sidebar-overlay"
		   title="Close side menu"
		   id="sidebar-overlay"
		   onClick={() => this.onClose()}>
	      </div>
	      
	    </div>
        );
    }
}

export default CityList;
