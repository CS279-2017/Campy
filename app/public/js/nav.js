let searchplaceholder = "";
$('.searchBar').focus(function(){
	searchplaceholder = $(this).attr('placeholder');
   $(this).removeAttr('placeholder');
});
$('.searchBar').focusout(function(){
	if($(this).val() == ""){
		$(this).attr('placeholder') = searchplaceholder;
	}
});