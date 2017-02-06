// modules/Home.js
import React from 'react'
import { Link } from 'react-router'

export default React.createClass({
  render() {
  	return(
  		<div class="fade" tabindex="-1" role="dialog">
		  <div class="modal-dialog" role="document">
		    <div class="modal-content">
		      <div class="modal-header">
		        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
		        <h4 class="modal-title">Modal title</h4>
		      </div>
		      <div class="modal-body">
		        <p>One fine body&hellip;</p>
		      </div>
		      <div class="modal-footer">
		        <a to="/" class="btn btn-default">Close</a>
		        <a to="/login" class="btn btn-default">Close</a>
		      </div>
		    </div>
		  </div>
		</div>
  	)
  }
})