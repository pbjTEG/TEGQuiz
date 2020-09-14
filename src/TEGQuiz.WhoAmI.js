function TEGQuiz.whoAmI(Options) {
	var TEGQuiz.whoAmI = this;
	// default Options
	TEGQuiz.uiz.options = {
		// Parsed command line arguments
		//args               : Object.create(null), // for future expansion
		// know window size caTEGQuiz.ries in case we want to do something special
		isMobile         : (window.innerWidth < 700),
		isTablet         : (window.innerWidth > 699 && window.innerWidth < 1030),
		isDesktop        : (window.innerWidth > 1029),

		// HTML objects
		questionSelecctor    : 'div.question',
		submitAnswerSelector : 'button.submitAnswer',
		nextSelector        : 'button.next',
		endQuizSelector     : 'button#endQuiz',
		answerItemSelector  : 'ul.answerList li',

		// answer accumulator(s)
		answers : {
			countAsked: 0,
			displayAskedSelector: '#askedSoFar',
			accumulators : {}
		},

		// navigate questions
		nextQuestion     : function() {
			jQuery('.en__component.en__component--copyblock.current')
				.removeClass('current')
				.nextSibling('.en__component.en__component--copyblock').addClass('current');

			// allow for client or form specific function
			if (TEGQuiz.afterQuestion !== null) {
				TEGQuiz.afterQuestion(jQuery(this));
			}
		},
		previousQuestion     : function() {
			jQuery('.en__component.en__component--copyblock.current')
				.removeClass('current')
				.previousSibling('.en__component.en__component--copyblock').addClass('current');

			// allow for client or form specific function
			if (TEGQuiz.afterQuestion !== null) {
				TEGQuiz.afterQuestion(jQuery(this));
			}
		},
		/* show the final submit button */
		showFinal        : function() {
			jQuery('.answer')
				.last()
				.parents('.en__component.en__component--copyblock')
				.addClass('last')
				.find('p:not(.donate), .en__submit:not(.donate), button:not(.donate), span:not(.donate), br:not(.donate)')
				.toggle();
			jQuery('.donate')
				.toggle();
			TEGQuiz.setVertical(
				jQuery('.answer')
					.last()
					.find('.verticalCenter')
			);
		}
	};

	// Parse URL args
	/*window.location.search.slice(1).split("&").forEach(function(arg) {

	 if (arg) {
	 var nv = arg.split("=");

	 if (nv[1]) {
	 TEGQuiz.args[decodeURIComponent(nv[0])] = decodeURIComponent(nv[1].replace(/</g, ""));
	 }
	 }
	 });*/

	jQuery(document).ready(function(){
		TEGQuiz.fireCallBacks = function(event, functionCollection) {

			if (console) {
				console.log('fireCallBacks\n' +
				            'event.currentTarget.id = ' + event.currentTarget.id + '\n');
			}

			// loop through the callbacks sorted alphabetically by key
			var keys = Object.keys(functionCollection).sort();
			for (var counter = 0; counter < keys.length; counter++) {
				var thisKey = keys[counter];

				// if property exists and is a function
				if (functionCollection.hasOwnProperty(thisKey) &&
				    typeof functionCollection[thisKey] === 'function')
				{

					if (console) {
						console.log('fireCallBacks Loop\n' +
						            'thisKey = ' + thisKey + '\n');
					}
					// then call it with the current event object
					functionCollection[thisKey](event);
				} // end if property exists
			} // end loop through sorted object keys
		}; // end fireAfterDonationCallbacks()
	}); // end jQuery(document).ready
} // end if we're looking at Page Builder

// client site-wide custom code
jQuery(document).ready(function() {

	// add selector to question parent element
	jQuery(TEGQuiz.questionQuery)
		.parent()
		.addClass('table');
	// shift email address into first question section
	jQuery(TEGQuiz.questionQuery)
		.first()
		.find('.verticalCenter')
		.append(jQuery('.en__component.en__component--formblock').first().find('> *'));
	// shift real submit button into last answer section
	jQuery('div.answer .verticalCenter')
		.last()
		.append(jQuery('div.en__submit').addClass('hidden'));
	jQuery('div.en__submit button').addClass('hidden');

	// on desktop view, vertically center the content
	if (TEGQuiz.isDesktop) {
		/* allow styles to arrive and render so
		 * vertical centering calculates
		 * properly
		 */
		setTimeout(TEGQuiz.setVertical, 1000, jQuery('.verticalCenter'));
		// do the first one since it's already visible
		TEGQuiz.setVertical(jQuery('div.question:first').parent().find('.verticalCenter'));
	}

	// set up share links
	jQuery('.icon-facebook')
		.attr('href', jQuery('.en__share__button.en__share__button--simple.en__share__button--facebook').attr('href'));
	jQuery('.icon-twitter')
		.attr('href', jQuery('.en__share__button.en__share__button--simple.en__share__button--twitter').attr('href'));
	jQuery('.icon-email')
		.attr('data-clipboard-text', window.location.href);
	/*var clipboard = new Clipboard('.icon-email');
	 clipboard.on('success', function() {
	 jQuery('#copySuccess')
	 .show()
	 .delay(1000)
	 .fadeOut(1000);
	 });*/
	// swap hidden state of real submit button
	jQuery('div.en__submit').addClass('donate');
	jQuery('div.en__submit button').addClass('donate');
}); // end jQuery(document).ready

// generic code
jQuery(document).ready(function() {
	// Only run this code on the rendered page
	/*if ( !/data\/1/.test(window.location.pathname) ) {
	 return;
	 }*/

	// make local reference to global configuration
	// expand configuration by settings in form content
	var TEGQuiz.      = window.TEGQuiz.
	    TEGQuiz.ustom = window.TEGQuiz.ustom || {};
	jQuery.extend(TEGQuiz. TEGQuiz.ustom);

	// make submit buttons show answer
	jQuery(TEGQuiz.submitAnswerQuery)
		.click(function(event) {
			event.preventDefault();
			event.stopImmediatePropagation();
			var answerList = jQuery(this).siblings('ul.answerList');

			answerList.addClass('answerShown');
			TEGQuiz.showCorrect(answerList.find('li'));
			TEGQuiz.showAnswer(jQuery(this));

			// allow for client or form specific function
			if (TEGQuiz.afterAnswer !== null) {
				TEGQuiz.afterAnswer(jQuery(this));
			}
		});

	// make answers highlight themselves on click
	jQuery(TEGQuiz.answerItemQuery)
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
					jQuery(TEGQuiz.answerItemQuery).removeClass('selected');
					thisAnswer.addClass('selected');
				}
			}
		});

	// set up pagination
	jQuery(TEGQuiz.questionQuery)
		.parent()
		.each(function(index, object) {

			if (index === 0) {
				jQuery(this).addClass('current');
			}
		});

	// show the results and donation link
	jQuery(TEGQuiz.endQuizQuery)
		.click(TEGQuiz.showFinal);

	jQuery(TEGQuiz.nextQuery)
		.on('click keydown', function(event) {
			// change fake pages
			event.preventDefault();
			event.stopImmediatePropagation();
			setTimeout(function() {
				// Don't leave this step if it has errors
				if (jQuery('.en__component.en__component--copyblock.current').find(".en__field__error").length === 0) {
					TEGQuiz.nextQuestion();
				}
			}, 50);
		});
}); // end jQuery(document).ready