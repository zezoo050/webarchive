$("#form1").submit(function(e) {
	$("#username").css("border", "");
	$("#password").css("border", "");
	if (!$("#username").val()){
		$("#username").css("border", "solid red 5px");
			e.preventDefault()
	}
	if (!$("#password").val()){
		$("#password").css("border", "solid red 5px");
			e.preventDefault()
	}
})