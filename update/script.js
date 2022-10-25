$("#addflawbutt").click(function(){
	if ($("#addflaw").val()){
		$("#flaws").append("<li><span class='val'>"+$("#addflaw").val()+"</span><span class ='del'>X</span></li>")
		$("#flawslist").append("<input name='flaws[]' type ='text' value="+$("#addflaw").val()+" hidden>")
		$("#addflaw").val("")
	}
});
$('body').on('click', '.del', function () {
	var val = $(this).siblings(".val").text()
	$("#flawslist").find("input[value='"+val+"']").remove();
	$(this).parent().remove();
})
$('body').on('click', '.delcurr', function () {
	var val = $(this).siblings(".valcurr").text()
	$("#delflaws").append("<input name='delflaws[]' type ='text' value='"+val+"' hidden>")
	$(this).parent().remove();
})
$('body').on('click', '.filedelbutt', function () {
	var val = $(this).parent().siblings(".iden").text()
	$("#delfiles").append("<input name='delfiles[]' type ='text' value='"+val+"' hidden>")
	$(this).parent().parent().remove();
})
var x = function(x){
	for (var i = 0; i < x.length; i++) {
		if (!isNaN(x[i])){
			return true
		}
	}
}
$("#form1").submit(function(e) {
	$("#ownername").css("border", "");
	$("#ownerid").css("border", "");
	if (!$("#ownername").val()){
		$("#ownername").css("border", "solid red 5px");
			e.preventDefault()
			window.scrollTo(0,0)
	}
	if (isNaN($("#ownerid").val())){
		$("#ownerid").css("border", "solid red 5px");
			e.preventDefault()
			window.scrollTo(0,0) 
	}

	
if (!$("#ownername").val()|| isNaN($("#ownerid").val())) {
	
}
else if (!window.confirm("هل انت متأكد انك تريد تعديل المخطط ؟")){
			e.preventDefault()
	}
})