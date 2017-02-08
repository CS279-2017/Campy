import React from 'react'



//Dropdown Menu Component
export default class TagDropdown extends React.Component {
  constructor(){
    super();
    this.state={
      visible: false
    }
  }
  render() {
    if(!this.state.visible){
      return(
        <div className="nav-dropdown nav-dropdown-up">
          <img className="nav-dropdown-arrow" id="nav-dropdown-arrow" onClick={() =>this.setState({visible: true})} src="/img/dropdownarrow.png"></img>
        </div>
      )
    }else{
      return(
        <div className="nav-dropdown nav-dropdown-down">
          <div className="row">
            <a className="btn btn-lg filter-tag">Tag</a>
            <a className="btn btn-lg filter-tag">Tag</a>
            <a className="btn btn-lg filter-tag">Tag</a>
            <a className="btn btn-lg filter-tag">$</a>
            <a className="btn btn-lg filter-tag">$$</a>
            <a className="btn btn-lg filter-tag">$$$</a>
            <a className="btn btn-lg filter-tag">Tag</a>
            <a className="btn btn-lg filter-tag">Tag</a>
            <a className="btn btn-lg filter-tag">Tag</a>
            <a className="btn btn-lg filter-tag">Tag</a>
            <a className="btn btn-lg filter-tag">Tag</a>
            <a className="btn btn-lg filter-tag">Tag</a>
            <a className="btn btn-lg filter-tag">Tag</a>
            <a className="btn btn-lg filter-tag">Tag</a>
            <a className="btn btn-lg filter-tag">Tag</a>
            <a className="btn btn-lg filter-tag">Tag</a>
            <a className="btn btn-lg filter-tag">Tag</a>
            <a className="btn btn-lg filter-tag">Tag</a>
            <a className="btn btn-lg filter-tag">Tag</a>
            <a className="btn btn-lg filter-tag">Tag</a>
            <a className="btn btn-lg filter-tag">Tag</a>
            <a className="btn btn-lg filter-tag">Tag</a>
            <a className="btn btn-lg filter-tag">Tag</a>
            <a className="btn btn-lg filter-tag">TagDaddy</a>
            <a className="btn btn-lg filter-tag">Tag</a>
            <a className="btn btn-lg filter-tag">TagDaddy</a>
            <a className="btn btn-lg filter-tag">Tag</a>
            <a className="btn btn-lg filter-tag">TagDaddy</a>
            <a className="btn btn-lg filter-tag">Tag</a>
            <a className="btn btn-lg filter-tag">TagDaddy</a>
            <a className="btn btn-lg filter-tag">Tag</a>
            <a className="btn btn-lg filter-tag">TagDaddy</a>
            <a className="btn btn-lg filter-tag">Tag</a>
            <a className="btn btn-lg filter-tag">TagDaddy</a>
            <a className="btn btn-lg filter-tag">Tag</a>


          </div>
          <img className="nav-dropdown-arrow" id="nav-dropdown-arrow" onClick={() =>this.setState({visible: false})} src="/img/dropdowndismiss.png"></img>
        </div>
      )
    }
  }
}