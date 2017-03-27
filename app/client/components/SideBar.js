import React from 'react'
import Slideshow from './Slideshow'
import ReactStars from 'react-stars'
import StarRating from 'react-star-rating';


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
    this.handleRating = this.handleRating.bind(this);
  }

  handleRating(event, rate){
    if(this.state.site){
      let data = {
        rate:rate.rating,
        id:this.state.site._id
      }
      let self = this;
      let success = function(){
        console.log("change rating");
      }
      $.ajax({
        type: "POST",
        url: "/v1/ratesite",
        data: data,
        success:success,
      });
    }
  }

  showCampsite(campsite){
    console.log(campsite);
    let date = this.formatDate(campsite.dateCreated);
    let images = this.getImages(campsite.images);

    let i = 0;
    return(
      <div className="sidebar">
        <div className="sidebar-container">
          <div className="site-title">
            <h1>{campsite.name}</h1>
          </div>
          <div className="campsite-rater">
                <StarRating name="airbnb-rating" editing={true} rating={campsite.rating} onRatingClick={this.handleRating} ratingAmount={5} />
          </div>
          <p>Added: {date}</p>
          <Slideshow className="campsite-img" slides={images}/>
          <div className="sidebar-info-container">
          <p className='sidebar-info left-align'><b>Description - </b> {campsite.description}</p>
          {campsite.directions ? <p className='sidebar-info left-align'><b>Special Directions - </b> {campsite.directions}</p> : null}
          
          </div>
          <p className='sidebar-info'><b>Campfire - </b> {campsite.fire ? "Allowed" : "Not Allowed"}</p>
          <p className='sidebar-info left-align'><b>Tags - </b>{campsite.tags.map(function(tag, i){if(i+1 == campsite.tags.length){return tag;}else{return tag+", ";}})}</p>

        </div>
      </div>
    )

  }

  //compile list of image urls
  getImages(images){
    if(!images || images.length == 0){
      return([{imageUrl:'http://placehold.it/600x400&text=No Images'}]);
    }else{
      let ret = [];
      images.forEach(function(imName){
        ret.push({imageUrl:"https://s3.amazonaws.com/campyapp1/" + imName});
      });
      return ret;
    }
    //if no image exists, use http://placehold.it/600x400&text=No-Images
    //return([{imageUrl:'http://eurotravel360.com/wp-content/uploads/2013/05/What-to-Consider-When-Choosing-a-Campsite.jpg'},{imageUrl:'http://placehold.it/600x400&text=c2'},{imageUrl:'http://placehold.it/600x400&text=c3'}])
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