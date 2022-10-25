$("#addflawbutt").click(function(){
	if ($("#addflaw").val()){
		$("#flaws").append("<li><span class='val'>"+$("#addflaw").val()+"</span><span class ='del'>X</span></li>")
		$("#flawslist").append("<input name='flaws[]' type ='text' value="+$("#addflaw").val()+" hidden>")
		$("#addflaw").val("")
	}
})
$('body').on('click', '.del', function () {
	var val = $(this).siblings(".val").text()
	$("#flawslist").find("input[value='"+val+"']").remove();
	$(this).parent().remove();
});
$("#form1").submit(function(e){
	$("#archnum").css("border", "");
	$("#piecenum").css("border", "");
	$("#ownername").css("border", "");
	$("#ownerid").css("border", "");
	if (isNaN($("#archnum").val())){
		$("#archnum").css("border", "solid red 5px");
			e.preventDefault()
	}
	if (isNaN($("#piecenum").val())){
		$("#piecenum").css("border", "solid red 5px");
			e.preventDefault()
	}
	if (!$("#ownername").val()){
		$("#ownername").css("border", "solid red 5px");
			e.preventDefault()
	}
	if (isNaN($("#ownerid").val())){
		$("#ownerid").css("border", "solid red 5px");
			e.preventDefault()
	}
	if (!$("#archnum").val()){
		$("#archnum").css("border", "solid red 5px");
			e.preventDefault()
	}
	if (!$("#piecenum").val()){
		$("#piecenum").css("border", "solid red 5px");
			e.preventDefault()
	}
	if (!$("#ownerid").val()){
		$("#ownerid").css("border", "solid red 5px");
			e.preventDefault()
	}
})