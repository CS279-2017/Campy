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
      ratings:null,
      image:0,
      voted:false
    }
    this.key = 0;
    this.handleRating = this.handleRating.bind(this);
    this.getRating = this.getRating.bind(this);
  }

  handleRating(rate){
    console.log(rate);
    if(this.props.selectedSite){
      let data = {
        rating:rate,
        campsiteid: this.props.selectedSite._id,
      }
      let self = this;
      let success = function(){
        self.getRating();
      }
      let error = function(xhr){
        console.log(xhr);
        self.getRating();
      }
      $.ajax({
        type: "POST",
        url: "/v1/rate",
        data: data,
        success:success,
        error:error
      });
    }
  }
  getkey(){
    this.key++;
    return this.key;
  }

  getRating(){
    console.log("Getting rating for:" + this.props.selectedSite._id);
    let data  = {campsiteid: this.props.selectedSite._id};
    let self = this;
    let success = function(data){
      self.setState({ratings:data.rating});
      self.setState({voted:data.voted});
    }
    let error = function(){
      console.log("Couldn't retrieve rating information");
    }
    $.ajax({
        type: "GET",
        url: "/v1/rate",
        data: data,
        success:success,
        error:error
      });
  }
  
  showCampsite(campsite){
    let date = this.formatDate(campsite.dateCreated);
    let images = this.getImages(campsite.images);

    let rateArray = this.state.ratings ? this.state.ratings : campsite.rating;

    let total = 0;
    let length = rateArray.length;
    for(let i = 0; i < length; i++) {
        total += rateArray[i];
    }
    var avgrating = total / length;
    return(
      <div className="sidebar">
        <div className="sidebar-container">
          <div className="site-title">
            <h1>{campsite.name}</h1>
          </div>
          <div className="added-date">
            <p className="center">Added on: {date} By: {campsite.creator.charAt(0).toUpperCase() + campsite.creator.slice(1)}</p>
          </div>
          <div>
            <div className="campsite-rater row">
            <ReactStars
              count={5}
              onChange={this.handleRating}
              size={48}
              value={avgrating}
              color2={'#f39a22'} />
              </div>
          </div>
          <div>
            <p className="ratings">({Number((avgrating).toFixed(1))})</p>
            <p className="num-ratings">{length} votes</p>
            <div className="clear"></div>
          </div>
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
      return this.showCampsite(this.props.selectedSite);
    }else{
      return(<div></div>);
    }
  }
}