export default toggleDropdown

var menuDown = false;
function toggleDropdown(){
	menuDown = !menuDown;
	if(menuDown){
		menuUp();
	}else{
		menuDown();
	}
}