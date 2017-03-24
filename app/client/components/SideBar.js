import React from 'react'
import Slideshow from './Slideshow'
import ReactStars from 'react-stars'
 

require("style-loader!css-loader!../css/sidebar.css");


//Dropdown Menu Component
export default class SideBar extends React.Component {
  constructor(){
    super();
    this.state={
      showSidebar:false,
      site:null,
      image:0,
    }
  }


  showCampsite(campsite){
    let date = this.formatDate(campsite.dateCreated);
    let images = this.getImages(campsite._id);

    let i = 0;
    return(
      <div className="sidebar">
        <div className="sidebar-container">
          <h1>{campsite.name}</h1>
          <p>Added: {date}</p>
          <Slideshow className="campsite-img" slides={images}/>
          <p className='left-align'><b>Description - </b> {campsite.description}</p>
          <p className='left-align'><b>Directions - </b> {campsite.directions}</p>
        </div>
      </div>
    )

  }

  //compile list of image urls
  getImages(id){
    //if no image exists, use http://placehold.it/600x400&text=No-Images
    return([{imageUrl:'http://eurotravel360.com/wp-content/uploads/2013/05/What-to-Consider-When-Choosing-a-Campsite.jpg'},{imageUrl:'http://placehold.it/600x400&text=c2'},{imageUrl:'http://placehold.it/600x400&text=c3'}])
  }

  formatDate(date){
    let year = date.substring(0,4);
    let month = date.substring(5,7);
    let day = date.substring(8,10);
    return(month+"-"+day+"-"+year);
  }


   


  //need to figure out how to do this...
  render(props) {
    if(this.props.selectedSite){
      console.log(this.props.selectedSite);
      return this.showCampsite(this.props.selectedSite);
    }else{
      return(<div></div>);
    }
  }
}