$(function() {
	// Force all .row-vbox'es to set to window height
	$(window)
		.on('resize', function() {
			$('.container-vbox').css('height', $(window).height());
		})
		.trigger('resize');
	setTimeout(function() {
		$(window).trigger('resize');
	}, 100);
});
