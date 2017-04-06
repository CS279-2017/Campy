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
      voted:false,
      reviewSelected:false,
      reviewed:false,
      reviews:[],
      reviewBody:"",
      rating:0,
    }
    this.siteCheckid = null;
    this.handleChange = this.handleChange.bind(this);
    this.key = 0;
    this.handleRating = this.handleRating.bind(this);
    this.getRating = this.getRating.bind(this);
    this.generateReviewHtml = this.generateReviewHtml.bind(this);
  }

  handleRating(rate){
    if(this.props.selectedSite){
      this.setState({rating:rate})
      // let data = {
      //   rating:rate,
      //   campsiteid: this.props.selectedSite._id,
      // }
      // let self = this;
      // let success = function(){
      //   self.getRating();
      // }
      // let error = function(xhr){
      //   console.log(xhr);
      //   self.getRating();
      // }
      // $.ajax({
      //   type: "POST",
      //   url: "/v1/rate",
      //   data: data,
      //   success:success,
      //   error:error
      // });
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

        <ul className="nav nav-pills">
          <li className="pill active"><a>Campsite</a></li>
          <li className="pill" onClick={()=>{this.setState({reviewSelected:true}); this.getReviews(this.props.selectedSite._id);}}><a>Reviews</a></li>
        </ul>

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
              size={48}
              value={avgrating}
              color2={'#f39a22'}
              edit={false} />
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

  sortReviews(reviews){
    let sortRevs = reviews;

    function compare(a,b) {
      if (a.dateCreated < b.dateCreated)
        return -1;
      if (a.dateCreated > b.dateCreated)
        return 1;
      return 0;
    }

    reviews.sort(compare);
    return sortRevs;
  }

  showReviews(campsite){
    //get reviews for campsite via ajax
    let reviews = this.state.reviews;
    //sort reviews so they appear in order of helpfulness.
    reviews = this.sortReviews(reviews);
    //check if user's written a review or not. Eventually will support editing review (maybe)

    return(
      <div className="sidebar">
        <div className="sidebar-container">
          <ul className="nav nav-pills">
            <li className="pill" onClick={()=>{this.setState({reviewSelected:false}); this.getRating()}}><a>Campsite</a></li>
            <li className="pill active"><a>Reviews</a></li>
            {this.state.reviewed?
              <p className='top-message sidebar-info center'><b>Thank you for reviewing {campsite.name}!</b></p>
              :
              <div>
              <p className='.top-message sidebar-info center'><b>Write a Review for {campsite.name}</b></p>
                <ReactStars
                count={5}
                onChange={this.handleRating}
                size={24}
                value={this.state.rating}
                color2={'#f39a22'}
                half={false}
                />

                <textarea className="review-body" name="reviewBody" value={this.state.reviewBody} onChange={this.handleChange} placeholder="Required"></textarea>
                <input type="button" name="submitreview" className="center login review-submit" onClick={()=>{this.postReview()}} value="Submit"/>
              </div>
            }
            {(this.state.reviews.length==0)?
              <p className='sidebar-info center'><b>No Reviews. Be the first!</b></p>
              :
              <div className="review-container">
              {this.state.reviews.map(item => {
                return(
                  <div key={"review"+item._id}>
                    <ReactStars
                          count={5}
                          size={24}
                          value={item.rating}
                          color2={'#f39a22'}
                        edit={false} />
                    <p>By: {item.creator.charAt(0).toUpperCase() + item.creator.slice(1)} on {this.formatDate(item.dateCreated)}</p>
                    <p>{item.reviewBody}</p>
                  </div>
                  );
              })}
              </div>
            }
          </ul>
        </div>
      </div>
      )
  }

  generateReviewHtml(review){
    
  }

  handleChange(event) {
    const target = event.target;
    const name = target.name;
    const value = target.value;
    this.setState({
      [name]: value
    });
  }
  //returns all reviews for a campsite
  getReviews(campsite_id){
    console.log("Getting reviews for:" + this.props.selectedSite._id);
    let data  = {campsiteid: campsite_id};
    
    let self = this;
    let success = function(data){
      self.setState({reviewed:data.userReviewed, reviews:data.reviews});
    }
    
    let error = function(){
      console.log("Couldn't retrieve review information");
    }

    $.ajax({
        type: "GET",
        url: "/v1/reviews",
        data: data,
        success:success,
        error:error
      });
  }

  postReview(){
    let s = this.state;
    let data  = {
      rating: s.rating,
      campsite: this.props.selectedSite._id, // campsite_id, subject to change
      reviewBody: s.reviewBody
    };


    let self = this;
    let success = function(data){
      console.log("success");
      self.getReviews(self.props.selectedSite._id);
    }
    
    let error = function(){
      console.log("Couldn't post review information");
    }

    $.ajax({
        type: "POST",
        url: "/v1/review",
        data: data,
        success:success,
        error:error
    });
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

  checkSiteChange(site){
    if(site._id != this.siteCheckid){
      this.siteCheckid = site._id;
      this.setState({reviewSelected:false});

    }
  }

  //need to figure out how to do this...
  render(props) {
    if(this.props.selectedSite){
      this.checkSiteChange(this.props.selectedSite);
      if(this.state.reviewSelected){
        return this.showReviews(this.props.selectedSite);
      }else{
        return this.showCampsite(this.props.selectedSite);
      }
    }else{
      return(<div></div>);
    }
  }
}