function TEGQuiz(Options) {
	var TEGQuiz = this;
	// default Options
	TEGQuiz.options = {
		// CSS selector for the form
		formSelector: 'form',

		// know window size categories in case we want to do something special
		isMobile         : (window.innerWidth < 700),
		isTablet         : (window.innerWidth > 699 && window.innerWidth < 1030),
		isDesktop        : (window.innerWidth > 1029),

		/* questions and answers can be defined in the HTML or populated directly. If
		 * they are populated directly then additional custom code must be added to
		 * render them on the page.
		 */
		questionSelecctor    : 'input[type="checkbox"], input[type="number"], input[type="radio"], input[type="range"], input[type="tel"], input[type="text"], select',
		questionExcludeSelector : "#firstName, #lastName, #email", // don't include these fields in the list of questions
		quesitonBlockSelector : 'div.question'
		questions : {},
		answerAttribute : 'data-answer',
		answers : {},

		/* Add collections of custom functions to run after a question is
		 * asked and after a question is answered. Functions will be fired
		 * in alphabetical order by key name.
		 */
		afterAnswer      : {},
		afterQuestion    : {},

		// question navigation
		nextQuestion     : function() {
			jQuery(TEGQuiz.options.questionBlockSelector)
				.removeClass('current')
				.nextSibling(TEGQuiz.options.questionBlockSelector).addClass('current');

			// allow for client or form specific function
			if (TEGQuiz.afterQuestion !== null) {
				TEGQuiz.afterQuestion(jQuery(this));
			}
		},
		previousQuestion     : function() {
			jQuery(TEGQuiz.options.questionBlockSelector)
				.removeClass('current')
				.previousSibling(TEGQuiz.options.questionBlockSelector).addClass('current');

			// allow for client or form specific function
			if (TEGQuiz.afterQuestion !== null) {
				TEGQuiz.afterQuestion(jQuery(this));
			}
		},

		// front end validation
		useParsley            : window.hasOwnProperty('Parsley'),
		// exclude some fields from getting data-parsley-required attribute
		excludeParsley        : [],

		// define device window sizes for adaptive styles and behavior
		windowSizes    : {
			mobileMax : 600,
			tabletMin : 599,
			tabletMax : 961,
			desktopMin: 968,
			tallMin   : 820
		},

		// fake the pagination
		currentPageNumber     : 1, // if > 0, set up fake pagination
		/* Target page after form submits.
		 * Engaging Networks forms make API calls to validate
		 * the form when it submits and halts the submission
		 * if problems are found. We need to let that happen
		 * so the EN native validation can fire and post
		 * errors to the page.
		 */
		newPageNumber         : 0,
		lastPageNumber        : 3, // set by the length of the list of pages
		pageBlock             : jQuery('<div/>'),
		pageStartSelector     : '.step', // start of a fake page
		pageExcludeSelector   : '.step-exclude', // don't include in fake page structure
		pageItemClass         : 'step-item',
		pageItemParentSelector: '', // find the parent element of the start of the page
		pageIDPrefix          : 'step',

		// generating breadcrumb navigation
		breadcrumbs          : jQuery('<div class="row"></div>'), // if not empty, create breadcrumbs
		/* Any HTML element in a breadcrumbItem* object will
		 * be filled with the HTML content of the item
		 * defined by pageStartSelector. With the default
		 * settings for example:
		 *
		 * <h1 class='.step'>Donation Info<span class="desktopView">rmation</span></h1>
		 *
		 * will generate the breadcrumb
		 *
		 * <div class="col title">Donation Info<span class="desktopView">rmation</span></h1>
		 *
		 *
		 * If the item defined by pageStartSelector has the
		 * attribute data-breadcrumb, then the value of that
		 * attribute will be rendered in the breadcrumb item.
		 * With the default settings for example:
		 *
		 * <h1 class='.step' data-breadcrumb="Donation Info">Donation Information</h1>
		 *
		 * will generate the breadcrumb
		 *
		 * <div class="col title">Donation Info</h1>
		 */
		// @formatter:off
		breadcrumbItemMobile : jQuery('<div class="row"></div>')
			.append('<div class="col-2 previous">&nbsp;</div>')
			.append('<div class="col title" />')
			.append('<div class="col-2 next">&nbsp;</div>'),
		// @formatter:on
		breadcrumbItemTablet : jQuery('<div class="col title"></div>'),
		breadcrumbItemDesktop: jQuery('<div class="col title"></div>'),

		// page button navigation
		pageButtons     : jQuery('<div class="step-nav row"/>'),
		pageButtonColumn: jQuery('<div class="col-12 col-md-6" />'),
		backButton      : jQuery('<button class="step-back">Back</button>'),
		continueButton  : jQuery('<button class="step-next">Continue</button>'),

		/* Some customizations might need to re-render each
		 * time the page appears. This object allows a custom
		 * installation to define those callbacks.
		 */
		pageCallbacks: {
			'1': {
				beforeShow: function(pageNumber, pageObject) {
					/* take some action before the page
					 * appears and/or skip to the next page
					 * by returning false
					 */

					if (console) {
						console.log('beforeLoad default\n' +
						            'pageNumber = ' + pageNumber + '\n' +
						            'pageObject = ' + jQuery(pageObject).class + '\n');
					}
					return true;
				},
				beforeHide: function(pageNumber, pageObject) {
					/* take some action before the page
					 * disappears and/or prevent the user
					 * from leaving the page by returning false
					 */

					if (console) {
						console.log('beforeHide default\n' +
						            'pageNumber = ' + pageNumber + '\n' +
						            'pageObject = ' + jQuery(pageObject).prop('nodeName') + '\n' +
						            '   ID      = ' + jQuery(pageObject).attr('id') + '\n' +
						            '   class      = ' + jQuery(pageObject).attr('class') + '\n');
					}
					return true;
				},
			},
		},

		// allow code that runs after all of this
		afterLoad: function() {
			return false;
		}

	}; // end TEGQuiz.options
   // override with options from new EngageENDonationForm() statement
	jQuery.extend(TEGQuiz.options, Options);

	// Parse query string arguments
	TEGQuiz.args = {};
	window.location.search.slice(1).split('&').forEach(function(arg) {

		if (arg) {
			var nv = arg.split('=');

			if (nv[1]) {
				TEGQuiz.args[decodeURIComponent(nv[0])] = decodeURIComponent(nv[1].replace(/</g, ''));
			}
		}
	});

	// allow form specific overrides
	if (typeof TEGCustom !== 'undefined') {
		jQuery.extend(TEGQuiz.options, TEGCustom);
	}

	// get the form and hide it
	TEGQuiz.form = jQuery(TEGQuiz.options.formSelector).hide();

	// collect questions
	jQuery(document).ready(function(){

	}); // end jQuery(document).ready

} // end TEGQuiz constructor

// generic code
jQuery(document).ready(function() {
	// Only run this code on the rendered page
	/*if ( !/data\/1/.test(window.location.pathname) ) {
	 return;
	 }*/

	// make local reference to global configuration
	// expand configuration by settings in form content
	var TEG       = window.TEG,
	    TEGCustom = window.TEGCustom || {};
	jQuery.extend(TEG, TEGCustom);

	// make submit buttons show answer
	jQuery(TEG.submitAnswerQuery)
		.click(function(event) {
			event.preventDefault();
			event.stopImmediatePropagation();
			var answerList = jQuery(this).siblings('ul.answerList');

			answerList.addClass('answerShown');
			TEG.showCorrect(answerList.find('li'));
			TEG.showAnswer(jQuery(this));

			// allow for client or form specific function
			if (TEG.afterAnswer !== null) {
				TEG.afterAnswer(jQuery(this));
			}
		});

	// make answers highlight themselves on click
	jQuery(TEG.answerItemQuery)
		.click(function(event) {
			event.preventDefault();
			var thisAnswer = jQuery(this),
			    answerList = thisAnswer.parent();

			/* only show the selection if the answer
			 * isn't shown
			 */
			if (!answerList.hasClass('answerShown')) {

				// different behavior for multi-select
				if (answerList.hasClass('multi')) {
					// multi
					thisAnswer.toggleClass('selected');

				} else {
					// single
					jQuery(TEG.answerItemQuery).removeClass('selected');
					thisAnswer.addClass('selected');
				}
			}
		});

	// set up pagination
	jQuery(TEG.questionQuery)
		.parent()
		.each(function(index, object) {

			if (index === 0) {
				jQuery(this).addClass('current');
			}
		});

	// show the results and donation link
	jQuery(TEG.endQuizQuery)
		.click(TEG.showFinal);

	jQuery(TEG.nextQuery)
		.on('click keydown', function(event) {
			// change fake pages
			event.preventDefault();
			event.stopImmediatePropagation();
			setTimeout(function() {
				// Don't leave this step if it has errors
				if (jQuery('.en__component.en__component--copyblock.current').find(".en__field__error").length === 0) {
					TEG.nextQuestion();
				}
			}, 50);
		});
}); // end jQuery(document).ready