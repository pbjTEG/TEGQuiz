/* TQTrivia
 * Turn a form into a trivia quiz.
 *
 * Copyright © 2020, PMG / The Production Management Group, Ltd.
 * Released under the MIT license.
 *
 * The Engage Group <engage@engageyourcause.com>
 */

function TQTrivia(Options) {
	var TQTrivia = this;
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
}; // end TQTrivia()
