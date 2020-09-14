function TEGQuiz.trivia(Options) {
	var TEGQuiz = this;
	// default Options
	TEGQuiz.options = {
		// Parsed command line arguments
		//args               : Object.create(null), // for future expansion
		// know window size categories in case we want to do something special
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
			countCorrect: 0,
			countAsked: 0,
			displayCorrectSelector: '#correctSoFar',
			displayAskedSelector: '#askedSoFar',
			accumulators : {}
		},

		showCorrect      : function(ansrJQObj) {
			/* play some animation to show the correct answer
			 *
			 * ansrJQObj should be a jQuery object containing
			 * the answers only one of which should have class
			 * "correct"
			 */
			var correctAnswer = ansrJQObj.filter('.correct'),
			    nextButton    = ansrJQObj.parents('.en__component--copyblock')
			                             .find('button.next');
			TEG.countQuestions++;

			if (correctAnswer.hasClass('selected')) {
				TEG.countCorrect++;
			}

			jQuery(TEG.numCorrectQuery).text(TEG.countCorrect);
			jQuery(TEG.numQuestionsQuery).text(TEG.countQuestions);

			ansrJQObj
				.removeClass('selected');
			correctAnswer
				.addClass('show', 300);
			nextButton
				.toggleClass('flash', 300)
				.toggleClass('flash', 300)
				.toggleClass('flash', 300)
				.toggleClass('flash', 300);
		},
		showAnswer       : function(jQObject) {
			jQObject.prop('disabled', true)
			        .parents('.question')
			        .siblings('.answer')
			        .find('p:not(.donate), .en__submit:not(.donate), button:not(.donate), span:not(.donate)')
			        .toggle();
		},
	};
};

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