import React from 'react'



//Dropdown Menu Component
export default class TagDropdown extends React.Component {
  constructor(){
    super();
    this.state={
      visible: false,
      tags:[{name:"$", active:false},
            {name:"$$", active:false},
            {name:"$$$", active:false},
            {name:"Easy Hike", active:false},
            {name:"Medium Hike", active:false},
            {name:"Hard Hike", active:false},
            {name:"No Hike", active:false},
            {name:"Wheelchair-Accessible", active:false},
            {name:"Pet-Friendly", active:false},
            {name:"Family-Friendly", active:false},
            {name:"Water", active:false},
            {name:"Bathrooms", active:false},
            {name:"RVs", active:false},
            {name:"Grill", active:false},
            {name:"Hammocks", active:false}
      ]
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
          <div className="row">
            {this.state.tags.map((tag)=>{
                if(tag.active){
                  return <a className="btn btn-lg filter-tag filter-tag-active" key={tag.name} onClick={() => this.selectTag(tag.name)}>{tag.name}</a>
                }else{
                  return <a className="btn btn-lg filter-tag" key={tag.name} onClick={() => this.selectTag(tag.name)}>{tag.name}</a>
                }
            })}
          </div>
          <img className="nav-dropdown-arrow" id="nav-dropdown-arrow" onClick={() =>this.setState({visible: false})} src="/img/dropdowndismiss.png"></img>
        </div>
      )
    }
  }
}