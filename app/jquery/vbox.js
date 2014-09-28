$(function() {
	// Force all .row-vbox'es to set to window height
	$(window)
		.on('resize', function() {
			$('.vbox')
				.css('height', $(window).height() - 20)
				.find('.vbox-fill').each(function() {
					$(this).css('height', $(this).closest('.row-vbox > div').height() - 45);
				});
		})
		.trigger('resize');
	setTimeout(function() {
		$(window).trigger('resize');
	}, 100);
});
