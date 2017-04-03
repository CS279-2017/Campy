import React from 'react'
import Tags from '../data/Tags.js'


//Dropdown Menu Component
export default class TagDropdown extends React.Component {
  constructor(){
    super();
    this.state={
      visible: false,
      tags:Tags.tags(),
    }
  }

  selectTag(name){
    let selectedTags = [];
    for(let i = 0; i < this.state.tags.length; i += 1) {
        if(this.state.tags[i]["name"] === name) {
            this.state.tags[i]["active"] = !this.state.tags[i]["active"];
        }
        if(this.state.tags[i]["active"]) {
          selectedTags.push(this.state.tags[i]["name"]);
        }
    }
    this.forceUpdate();
    this.props.self.removeMarkersWithoutTags(selectedTags);
  }

  render() {
    if(!this.state.visible){
      return(
        <div className="nav-dropdown nav-dropdown-up">
          <img className="nav-dropdown-arrow" id="nav-dropdown-arrow" onClick={() =>this.setState({visible: true})} src="/img/dropdowndismiss.png"></img>
        </div>
      )
    }else{
      return(
        <div className="nav-dropdown nav-dropdown-down">
            {this.state.tags.map((tag)=>{
                if(tag.active){
                  return <a className="btn btn-lg filter-tag filter-tag-active" key={tag.name} onClick={() => this.selectTag(tag.name)}>{tag.name}</a>
                }else{
                  return <a className="btn btn-lg filter-tag" key={tag.name} onClick={() => this.selectTag(tag.name)}>{tag.name}</a>
                }
            })}
          <img className="nav-dropdown-arrow" id="nav-dropdown-arrow" onClick={() =>this.setState({visible: false})} src="/img/dropdowndismiss.png"></img>
        </div>
      )
    }
  }
}