$("#form1").submit(function(e) {
	if (!window.confirm("هل انت متاكد انك تريد حذف الكخطط ؟ ")){
			e.preventDefault()
	}
})