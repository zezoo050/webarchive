$("#form1").submit(function(e) {
	$("#search").css("border", "");
	if (!$("#search").val()){
		$("#search").css("border", "solid red 5px");
			e.preventDefault()
	}
})