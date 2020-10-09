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
		questions: [],

		// CSS class names for displaying answers
		correctClass        : 'correct',
		answeredClass       : 'answered',
		explanationShowClass: 'show',


		// CSS selectors for display elements and navigation
		questionCountSelector   : '.totalQuestions', // element to display number of questions in quiz
		questionAnsweredSelector: '.answeredQuestions', // element to display number of answered questions
		questionCorrectSelector : '.correctQuestions', // element to display number of correctly answered questions
		explanationSelector     : '.explanation', // element to display the selector
		nextButtonSelector      : '.step-next',

		/* If we're in a CMS and need to generate our own
		 * explanation element.
		 */
		explanationObject : [],

		/* Each key value is a CSS selector that identifies an input field
		 * or group of input fields. The associated value is a collection
		 * of strings containing the correct answer and an explanation
		 * to show the user.
		 */
		answers: {
			'selector01': {
				// This is an array so we can have multiple correct answers.
				correctValues: ['Correct Value 01'],
				explanation : 'This is the explanation of Question 01.',
			},
			'selector02': {
				correctValues: ['Correct Value 02'],
				explanation : 'This is the explanation of Question 02.'
			},
		},

		// Are we showing the answer after each question?
		showEachAnswer: true,
		// Show the correct answer after each question
		showAnswer    : function(questionDOMNode) {
			var thisQuestion = jQuery(questionDOMNode)
				.addClass(TQTrivia.options.answeredClass);
			TQTrivia.countAnswers++;

			if (thisQuestion.attr('data-correct') === 'true') {
				TQTrivia.countCorrect++;
				thisQuestion.addClass(TQTrivia.options.correctClass);
				TQTrivia.explanationDisplay.addClass(TQTrivia.options.correctClass);

			} else {
				/* If this field isn't the correct answer then
				 * run a more laborious search to mark the
				 * correct one.
				 */
				TQTrivia.options.questions
				        .filter(function() {
					        // slightly faster without another jQuery call
					        return this.getAttribute('data-group') === thisQuestion.attr('data-group') &&
					               this.getAttribute('data-correct') === 'true';
				        })
				        .addClass(TQTrivia.options.correctClass);
			}

			TQTrivia.questionAnsweredDisplay.text(TQTrivia.countAnswers);
			TQTrivia.questionCorrectDisplay.text(TQTrivia.countCorrect);
			TQTrivia.explanationDisplay
			        .html(TQTrivia.options.answers[thisQuestion.attr('data-group')].explanation)
			        .addClass(TQTrivia.options.explanationShowClass);
		},

		// Hide the explanation to show each new question
		hideAnswer: function() {
			TQTrivia.explanationDisplay
			        .removeClass(TQTrivia.options.explanationShowClass)
			        .html('');
		},

		// To be run at the end of the onSubmit handling process.
		submitQueue: {
			// override the default submit handler for all quiz types
			'00500_quizHandler': function(event) {

				if (console) {
					console.warn('TQWhoAmI.options.submitQueue[\'00500_quizHandler\'] not overridden as expected.');
				} // end if console available
				return true;
			} // end ['005_quizHandler']()
		},

		// To be run if onSubmit fails
		errorQueue: {
			// override the default error handler for all quiz types
			'00500_quizErrorHandler': function() {

				if (console) {
					console.warn('TQWhoAmI.options.errorQueue[\'00500_quizErrorHandler\'] not overridden as expected.');
				} // end if console available
				return true;
			} // end ['00500_quizErrorHandler']()
		}, // end errorQueue
	};
	jQuery.extend(TQTrivia.options, Options);

	// count the questions answered
	TQTrivia.countQuestions = TQTrivia.options.questions.length;
	TQTrivia.countAnswers = 0;
	TQTrivia.countCorrect = 0;

	// display elements
	TQTrivia.questionCountDisplay = jQuery(TQTrivia.options.questionCountSelector).text(TQTrivia.countQuestions);
	TQTrivia.questionAnsweredDisplay = jQuery(TQTrivia.options.questionAnsweredSelector).text(TQTrivia.countAnswers);
	TQTrivia.questionCorrectDisplay = jQuery(TQTrivia.options.questionCorrectSelector).text(TQTrivia.countCorrect);
	TQTrivia.explanationDisplay = jQuery(TQTrivia.options.explanationSelector);

	// set up the question input fields
	for (var answersKey in TQTrivia.options.answers) {
		var thisQuestion = TQTrivia.options.questions.find(answersKey);

		if (TQTrivia.options.answers[answersKey].correctValues.includes(thisQuestion.getAny())) {
			thisQuestion.attr('data-correct', 'true')
			            .attr('data-group', answersKey);
		} // end if this input field has the correct answer
	} //
	TQTrivia.options.answers
	        .forEach(function() {
		        TQTrivia.options.questions
		                .filter(this);
	        });

	// if we're displaying the answer after each question
	if (TQTrivia.options.showEachAnswer) {
		// show the answer and explanation
		TQTrivia.options.questions
		        .change(TQTrivia.options.showAnswer);
		// hide the explanation for each new question
		jQuery(TQTrivia.options.nextButtonSelector)
			.on('click keyup', TQTrivia.options.hideAnswer);
	} // if we're displaying the correct answer
} // end TQTrivia()
