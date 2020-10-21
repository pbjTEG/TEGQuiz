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
	TQTrivia.options = {
		// the questions found by TEGQuiz
		questions: [],

		// CSS class names for displaying answers
		correctClass        : 'correct', // class name to mark a correct answer
		answeredClass       : 'answered', // class name to mark a selected answer
		/* This is a class name to add to the explanation and navigation
		 * of a specific question to reveal them when an answer
		 * is selected.
		 */
		explanationShowClass: 'show',

		// CSS selectors for display elements and navigation
		questionCountSelector    : '.totalQuestions', // selector for element to display number of questions in quiz
		questionAnsweredSelector : '.answeredQuestions', // selector for element to display number of answered questions
		questionViewedSelector   : '.viewedQuestions', // selector for element to display number of answered questions
		questionCorrectSelector  : '.correctQuestions', // selector for element to display number of correctly answered questions
		questionContainerSelector: '.step-item', // selector for a parent element of a question to identify the explanation and navigation for that specific question
		explanationSelector      : '.explanation', // selector for the object that will contain the explanations and navigation buttons
		nextButtonSelector       : '.step-next', // selector for the navigation buttons

		/* Each key in the answers collection is a CSS selector which
		 * uniquely identifies
		 */
		answers: {
			'[name="radioGroup01"]': ['Correct Value 01'],
			'[name="radioGroup02"]': ['Correct Value 02'],
		}, // end answers collection

		// Show the correct answer after each question
		showAnswer: function(event) {
			var thisQuestion = jQuery(event.currentTarget);

			// disable all the input fields in this question group
			TQTrivia.options.questions
			        .filter('[data-group="' +
			                thisQuestion.attr('data-group') +
			                '"]')
			        .attr('disabled', 'disabled');

			/* Mark (all of) the correct answer(s). There's got
			 * to be a better way to do this.
			 */
			jQuery('label').filter(function(index, DOMObject) {
				               var isCorrect = false,
				                   thisLabel = DOMObject;
				               TQTrivia.options.questions
				                       .filter('[data-group="' +
				                               thisQuestion.attr('data-group') +
				                               '"]')
				                       .filter(function(index, DOMObject) {
					                       return TQTrivia.options.answers[DOMObject.getAttribute('data-correct')]
						                       .includes(DOMObject.getAttribute('value'));
				                       })
				                       .each(function(index, DOMObject) {

					                       if (DOMObject.getAttribute('id') === thisLabel.getAttribute('for')) {
						                       isCorrect = true;
					                       }
				                       });
				               return isCorrect;
			               })
			               .addClass(TQTrivia.options.correctClass);

			// increase the count of answered questions
			TQTrivia.countAnswers++;

			TQTrivia.questionAnsweredDisplay.text(TQTrivia.countAnswers);
			TQTrivia.questionCorrectDisplay.text(TQTrivia.countCorrect);
			thisQuestion.closest('.step-item')
			            .find(TQTrivia.options.nextButtonSelector)
			            .addClass(TQTrivia.options.explanationShowClass);
			thisQuestion.closest('.step-item')
			            .find(TQTrivia.options.explanationSelector)
			            .addClass(TQTrivia.options.explanationShowClass);
		}, // end showAnswer()

		// To be run at the end of the onSubmit handling process.
		submitQueue: {
			// override the default submit handler for all quiz types
			'00500_quizHandler': function(event) {

				if (console) {
					console.warn('TQWhoAmI.options.submitQueue[\'00500_quizHandler\'] not overridden as expected.');
				} // end if console available
				return true;
			} // end ['005_quizHandler']()
		}, // end submitQueue

		// To be run if onSubmit fails
		errorQueue: {
			// override the default error handler for all quiz types
			'00500_quizErrorHandler': function() {

				if (console) {
					console.warn('TQWhoAmI.options.errorQueue[\'00500_quizErrorHandler\'] not overridden as expected.');
				} // end if console available
				return true;
			} // end ['00500_quizErrorHandler']()
		}, // end errorQueue collection

		/* To be run after each answer is selected.
		 * See options.afterAnswer in TEGQuiz.js.
		 */
		afterAnswer: {
			// run after every question
			'*': function(event) {
				TQTrivia.options.showAnswer(event);
				return true;
			} // end everyTime()
		},

		// collection of quiz result messages
		results: {
			100:
				'<h3>Perfect Score!</h3><p>You got everything right. ' +
				'That&rsquo;s <span class="correctQuestions"></span> ' +
				'out of <span class="totalQuestions"></span>.</p>',
			90 :
				'<h3>Excellent!</h3><p>You got most questions right. ' +
				'That&rsquo;s <span class="correctQuestions"></span> ' +
				'out of <span class="totalQuestions"></span>.</p>',
			50 :
				'<h3>Were you even paying attention?</h3><p>You got most questions wrong. ' +
				'That&rsquo;s only <span class="correctQuestions"></span> ' +
				'out of <span class="totalQuestions"></span>.</p>',
		} // end results collection
	}; // end options
	jQuery.extend(TQTrivia.options, Options);

	// count the questions
	TQTrivia.countViewed = 0;
	TQTrivia.countAnswers = 0;
	TQTrivia.countCorrect = 0;

	/* Count the questions by radio button group, checkboxes in a fieldset,
	 * then by single fields. Mark each set as a group for easy retrieval.
	 */
	TQTrivia.countQuestions = 0;
	TQTrivia.options.questions
	        .each(function(index) {
		        var thisField = jQuery(this);

		        // count each question only once
		        if (!thisField.prop('counted')) {

			        // group some form fields into one questin for counting and retrieval
			        switch (thisField.fieldType()) {
				        case 'radio':
					        // count radio button groups as one question
					        thisField =
						        TQTrivia.options.questions
						                .filter('[name="' +
						                        thisField.attr('name') +
						                        '"]');
					        break;

				        case 'checkbox':
					        /* Check for a fieldset and count all the
					         * checkboxes inside it as one multiple-
					         * choice question.
					         */
					        thisField = thisField.closest('fieldset')
					                             .find('[type="checkbox"]');
					        break;
			        } // end switch on field type

			        thisField.attr('data-group', 'qGrp' + index)
			                 .prop('counted', true);
			        TQTrivia.countQuestions++;
		        } // end if field already counted
	        }) // end questions.each()
	        .removeProp('counted'); // remove the counted property now that we're done

	/* Mark correct answers or easy retrieval 'cuz
	 * for loops are slow.
	 */
	for (var answerKey in TQTrivia.options.answers)
	{
		TQTrivia.options.questions
		        .filter(answerKey)
		        .attr('data-correct', answerKey);
	} // end loop through answers

	// display elements
	TQTrivia.questionCountDisplay = jQuery(TQTrivia.options.questionCountSelector).text(TQTrivia.countQuestions);
	TQTrivia.questionViewedDisplay = jQuery(TQTrivia.options.questionViewedSelector).text(TQTrivia.countAnswers + 1);
	TQTrivia.questionAnsweredDisplay = jQuery(TQTrivia.options.questionAnsweredSelector).text(TQTrivia.countAnswers);
	TQTrivia.questionCorrectDisplay = jQuery(TQTrivia.options.questionCorrectSelector).text(TQTrivia.countCorrect);

	// calculate quiz results
	TQTrivia.getResults = function() {
		// start from the beginning
		TQTrivia.countCorrect = 0;

		var returnString = '';

		for (var answerKey in TQTrivia.options.answers) {
			/* You must supply an override for getResults()
			 * if you want to allow other input types.
			 */
			var thisQuestion = TQTrivia.options.questions
			                           .filter(answerKey)
			                           .filter(':checked, select');

			if (
				thisQuestion.getAny() !== '' &&
				TQTrivia.options.answers[answerKey].includes(thisQuestion.getAny())
			)
			{
				TQTrivia.countCorrect++;
			}
		} // end loop through answers

		for (var resultsKey in TQTrivia.options.results) {

			if (TQTrivia.countCorrect / TQTrivia.countQuestions * 100 <= resultsKey) {
				returnString = TQTrivia.options.results[resultsKey];
				break;
			} // end if the results are in this percentile
		} // end loop through results

		// fill in the blanks in the results string, if any
		returnObject = jQuery(returnString);
		returnObject
			.find(TQTrivia.options.questionCountSelector)
			.text(TQTrivia.countQuestions);
		returnObject
			.find(TQTrivia.options.questionViewedSelector)
			.text(TQTrivia.countAnswers + 1);
		returnObject
			.find(TQTrivia.options.questionAnsweredSelector)
			.text(TQTrivia.countAnswers);
		returnObject
			.find(TQTrivia.options.questionCorrectSelector)
			.text(TQTrivia.countCorrect);

		return returnObject.wrapAll('<div />').parent().html();
	}; // end getResults()
} // end TQTrivia()
