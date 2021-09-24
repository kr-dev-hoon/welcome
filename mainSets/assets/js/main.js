

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$html = $('html');

	// Breakpoints.
		breakpoints({
			large:   [ '981px',  '1680px' ],
			medium:  [ '737px',  '980px'  ],
			small:   [ '481px',  '736px'  ],
			xsmall:  [ null,     '480px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Touch mode.
		if (browser.mobile) {

			var $wrapper;

			// Create wrapper.
				$body.wrapInner('<div id="wrapper" />');
				$wrapper = $('#wrapper');

				// Hack: iOS vh bug.
					if (browser.os == 'ios')
						$wrapper
							.css('height', '-webkit-fill-available');
							// .css('margin-top', -25)
							// .css('padding-bottom', 25);

				// Pass scroll event to window.
					$wrapper.on('scroll', function() {
						$window.trigger('scroll');
					});

			// Scrolly.
				$window.on('load.hl_scrolly', function() {

					$('.scrolly').scrolly({
						speed: 1500,
						parent: $wrapper,
						pollOnce: true
					});

					$window.off('load.hl_scrolly');

				});

			// Enable touch mode.
				$html.addClass('is-touch');

		}
		else {

			// Scrolly.
				$('.scrolly').scrolly({
					speed: 1500
				});

		}

	// Header.
		var $header = $('#header'),
			$headerTitle = $header.find('header'),
			$headerContainer = $header.find('.container');

		// Make title fixed.
			if (!browser.mobile) {

				$window.on('load.hl_headerTitle', function() {

					// breakpoints.on('>medium', function() {

						$headerTitle
							.css('position', 'fixed')
							.css('height', 'auto')
							.css('top', '50%')
							.css('left', '0')
							.css('width', '100%')
							.css('margin-top', ($headerTitle.outerHeight() / -2));

					// });
					//
					// breakpoints.on('<=medium', function() {
					//
					// 	$headerTitle
					// 		.css('position', '')
					// 		.css('height', '')
					// 		.css('top', '')
					// 		.css('left', '')
					// 		.css('width', '')
					// 		.css('margin-top', '');
					//
					// });

					$window.off('load.hl_headerTitle');

				});

			}

		// Scrollex.
			breakpoints.on('>small', function() {
				$header.scrollex({
					terminate: function() {

						$headerTitle.css('opacity', '1');

					},
					scroll: function(progress) {
						console.log(progress);

						// Fade out title as user scrolls down.
							if (progress > 0.5)
								x = 1 - progress;
							else
								x = progress;

							$headerTitle.css('opacity', Math.max(0, Math.min(1, x * 2)));

					}
				});
			});

			breakpoints.on('<=small', function() {

				$header.unscrollex();

			});

	// Main sections.
		$('.main').each(function() {

			var $this = $(this),
				$primaryImg = $this.find('.image.primary > img'),
				$bg,
				options;

			// No primary image? Bail.
				if ($primaryImg.length == 0)
					return;

			// Create bg and append it to body.
				$bg = $('<div class="main-bg" id="' + $this.attr('id') + '-bg"></div>')
					.css('background-image', (
						'url("assets/css/images/overlay.png"), url("' + $primaryImg.attr('src') + '")'
					))
					.appendTo($body);

			// Scrollex.
				$this.scrollex({
					mode: 'middle',
					delay: 200,
					top: '-10vh',
					bottom: '-10vh',
					init: function() { $bg.removeClass('active'); },
					enter: function() { $bg.addClass('active'); },
					leave: function() { $bg.removeClass('active'); }
				});

		});

	// Menu.
	var $menu = $('#menu'),
		$menuInner;

	$menu.wrapInner('<div class="inner"></div>');
	$menuInner = $menu.children('.inner');
	$menu._locked = false;

	$menu._lock = function() {

		if ($menu._locked)
			return false;

		$menu._locked = true;

		window.setTimeout(function() {
			$menu._locked = false;
		}, 350);

		return true;

	};

	$menu._show = function() {

		if ($menu._lock())
			$body.addClass('is-menu-visible');

	};

	$menu._hide = function() {

		if ($menu._lock())
			$body.removeClass('is-menu-visible');

	};

	$menu._toggle = function() {

		if ($menu._lock())
			$body.toggleClass('is-menu-visible');

	};

	$menuInner
		.on('click', function(event) {
			event.stopPropagation();
		})
		.on('click', 'a', function(event) {

			var href = $(this).attr('href');

			event.preventDefault();
			event.stopPropagation();

			// Hide.
			$menu._hide();

			// Redirect.
			window.setTimeout(function() {
				window.location.href = href;
			}, 250);

		});

	$menu
		.appendTo($body)
		.on('click', function(event) {

			event.stopPropagation();
			event.preventDefault();

			$body.removeClass('is-menu-visible');

		})
		.append('<a class="close" href="#menu">Close</a>');

	$body
		.on('click', 'a[href="#menu"]', function(event) {

			event.stopPropagation();
			event.preventDefault();

			// Toggle.
			$menu._toggle();

		})
		.on('click', function(event) {

			// Hide.
			$menu._hide();

		})
		.on('keydown', function(event) {

			// Hide on escape.
			if (event.keyCode == 27)
				$menu._hide();

		});

})(jQuery);