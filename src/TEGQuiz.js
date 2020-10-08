/* TEGQuiz
 * Turn a form into an identity or trivia quiz.
 *
 * Copyright © 2020, PMG / The Production Management Group, Ltd.
 * Released under the MIT license.
 *
 * The Engage Group <engage@engageyourcause.com>
 */
function TEGQuiz(Options) {
	var TEGQuiz = this;
	// constants

	// default Options
	TEGQuiz.options = {
		// CSS selector for the form
		formSelector: 'form',

		/* Collect information about the quiz questions so
		 * we can track answers and count them.
		 */
		questionSelector       : 'input[type="checkbox"], input[type="number"], ' +
		                         'input[type="radio"], input[type="range"], select', // collect the HTML elements which match this selector
		questionExcludeSelector: '#firstName, #lastName, #email', // don't include the fields which match this selector

		/* If answerLabelSelector is set, the library will attempt
		 * to add the value of answerHighlightClass as a CSS class
		 * name to the field label when the input field changes.
		 */
		answerHighlightClass: 'selected',

		/* Add collections of custom functions to run after a question is
		 * answered. These will be run as onClick event handlers.
		 */
		afterAnswer: {
			// runs after every question
			everyTime: function(event) {
				// update the results
				TEGQuiz.form
				       .find(TEGQuiz.options.resultSelector)
				       .html(TEGQuiz.quiz.getResults());
				return true;
			},
			/* Example Function for a Specific Question
			 *
			 * The key value for each entry must match the ID of the
			 * answer label for which it is to run. The function
			 * will receive the event that fired the onClick
			 * handler.
			 * 'questionID': function(event) {
			 *
			 *    if (console) {
			 *      console.log('afterAnswer.questionID\n' +
			 *                  'this = ' + this + '\n' +
			 *                  'event = ' + event + '\n');
			 *    }
			 * },
			 */
		},

		// find the submit button
		submitSelector: 'input[type="submit"]',

		// fake pages
		usePagination    : typeof TEGFakePages === 'function',
		paginationOptions: {}, // use defaults unless overwritten by configuration

		// trivia quiz
		useTrivia    : typeof TQTrivia === 'function',
		triviaOptions: {}, // use defaults unless overwritten by configuration

		//  identity quiz
		useWhoAmI    : typeof TQWhoAmI === 'function',
		whoAmIOptions: {}, // use defaults unless overwritten by configuration

		// quiz restuls
		resultsBeforeSubmit: true, // show the quiz results before submitting form
		resultSelector     : '.results', // CSS selector for result value to pass to the confirmation page

		// allow code that runs after all of this
		afterLoad: function(Options) {

			if (console) {
				console.log('TEGQuiz.afterLoad\n' +
				            'Options = ' + Options + '\n');
			}
			return false;
		},

		/* Allow customization of the onSubmit handler.
		 * Each entry in this collection will be called in alphabetical
		 * order by key name.
		 */
		submitQueue: {
			// TQTrivia and TQWhoAmI will insert their handlers here.
			'00500_quizHandler': function(event) {

				if (console) {
					console.warn('005_quizHandler not overridden as expected.');
				} // end if console available
				return true;
			} // end ['005_quizHandler']()
		}, // end submitQueue

		/* Allow customization of error handling.
		 * See submitQueue above.
		 */
		errorQueue: {
			// TQTrivia, and TQWhoAmI will insert their handlers here.
			'00500_quizErrorHandler': function(event) {

				if (console) {
					console.warn('00500_quizErrorHandler not overridden as expected.');
				} // end if console available
				return true;
			} // end ['005_quizHandler']()
		}, // end errorQueue

	}; // end TEGQuiz.options
	// override with options from new TEGQuiz() statement
	jQuery.extend(TEGQuiz.options, Options);

	// allow form specific overrides
	if (typeof TEGCustomQuiz !== 'undefined') {
		jQuery.extend(TEGQuiz.options, TEGCustomQuiz);
	}

	// Parse query string arguments
	TEGQuiz.args = {};
	window.location.search.slice(1).split('&').forEach(function(arg) {

		if (arg) {
			var nv = arg.split('=');

			if (nv[1]) {
				TEGQuiz.args[decodeURIComponent(nv[0])] = decodeURIComponent(nv[1].replace(/</g, ''));
			}
		}
	}); // end query string processing

	// get the form and hide it
	TEGQuiz.form = jQuery(TEGQuiz.options.formSelector).hide();

	// if we're holding to show results before submitting. . .
	if (TEGQuiz.options.resultsBeforeSubmit) {
		// . . .then encourage the user to submit the form so we can capture data.
		jQuery(window).on('beforeunload', function() {
			return 'ignored value';
		}); // end window.onBeforeUnload()
	} // end if we're showing results before submitting

	// run the event handlers for the questions
	TEGQuiz.runAfterAnswer = function(event) {

		/* Some CMS systems make it hard to highlight selected answers with CSS.
		 * Add some code to allow easy style attribution.
		 */
		if (TEGQuiz.options.answerHighlightClass !== '') {

			var thisField = jQuery(this),
			    thisLabel = TEGQuiz.form
			                       .find('[for="' + thisField.attr('id') + '"]');

			switch (thisField.fieldType()) {

				case 'radio':
					// remove the highlight style from all radio buttons in this group
					TEGQuiz.form
					       .find('[name="' +
					             thisField.attr('name') +
					             '"]')
					       .each(function(index, DOMObject) {
						       TEGQuiz.form
						              .find('[for="' + DOMObject.id + '"]')
						              .removeClass(TEGQuiz.options.answerHighlightClass);
					       });

					if (thisField.is(':checked')) {
						thisLabel.addClass(TEGQuiz.options.answerHighlightClass);
					}
					break;

				case 'checkbox':
					thisLabel.toggleClass(TEGQuiz.options.answerHighlightClass, thisField.is(':checked'));
					break;

				default:
					thisLabel.toggleClass(TEGQuiz.options.answerHighlightClass, thisField.val() !== '');
			} // end switch .fieldType()
		} // end if we're highlighting answers

		// function to run for every answer
		TEGQuiz.options.afterAnswer.everyTime(event);

		// if there's a custom function for this particular answer, run it
		if (event.hasOwnProperty('targetElement') &&
		    event.targetElement.hasOwnProperty('id') &&
		    TEGQuiz.options.afterAnswer[event.targetElement.id])
		{
			// fire the question specific answer event handler
			if (TEGQuiz.options.afterAnswer[event.targetElement.id]) {
				TEGQuiz.options.afterAnswer[event.targetElement.id](event);
			} // end if there's a question specific event handler
		} // end if event.targetElement.id exists
	}; // end runAfterAnswer()

	// run the error handlers for the form
	TEGQuiz.errorHandler = function() {
		// loop through the event handlers sorted alphabetically by key
		var eqKeys = Object.keys(TEGQuiz.options.errorQueue).sort();

		for (var counter = 0; counter < eqKeys.length; counter++) {
			var thisKey = eqKeys[counter];

			// If property exists and is a function
			if (TEGQuiz.options.errorQueue.hasOwnProperty(thisKey) &&
			    typeof TEGQuiz.options.errorQueue[thisKey] === 'function')
			{

				// log it
				if (console) {
					console.log('TEGQuiz.errorHandler Loop\n' +
					            'thisKey = ' + thisKey + '\n');
				}
				// And finally call it.
				TEGQuiz.options.errorQueue[thisKey](event);
			} // end if property exists
		} // end loop through sorted object keys
	}; // end errorHandler()

	// run the submit handlers for the form
	TEGQuiz.submitHandler = function(event) {
		var safeToGo = true;

		// loop through the event handlers sorted alphabetically by key
		var sqKeys = Object.keys(TEGQuiz.options.submitQueue).sort();
		for (var counter = 0; counter < sqKeys.length; counter++) {
			var thisKey = sqKeys[counter];

			// If property exists and is a function
			if (TEGQuiz.options.submitQueue.hasOwnProperty(thisKey) &&
			    typeof TEGQuiz.options.submitQueue[thisKey] === 'function')
			{

				// log it
				if (console) {
					console.log('TEGQuiz.submitHandler Loop\n' +
					            'thisKey = ' + thisKey + '\n');
				}
				/* And finally call it.
				 * If any handlers return false then all will be false.
				 */
				safeToGo = safeToGo && TEGQuiz.options.submitQueue[thisKey](event);
			} // end if property exists
		} // end loop through sorted object keys

		// if all returned true
		if (safeToGo) {

			// If we're holding to show results before submitting. . .
			if (TEGQuiz.options.resultsBeforeSubmit) {
				//. . .then we don't need to hold the form anymore.
				jQuery(window).off('beforeunload');
			}

		} else {
			// otherwise, halt propagation.
			event.preventDefault();
			event.stopImmediatePropagation();

			// We do rather a lot of Engaging Networks customizations.
			// If this is on EN, the errorHandler will be attached to window.enOnError
			if (typeof window.EngagingNetworks === 'undefined') {
				TEGQuiz.errorHandler(event);
			}
		}
		return safeToGo;
	}; // end submitHandler()

	// there really needs to be a form element for this to work at all
	if (TEGQuiz.form.length > 0) {
		// collect questions
		jQuery(document)
			.ready(function() {
				/* A quiz form should include only fixed-value fields such as
				 * radio buttons, checkboxes, and select lists. But we need
				 * room for future expansion and for per-client or per-form
				 * customization.
				 *
				 * While we're in there, let's make sure there are unique
				 * "id" attributes.
				 */
				TEGQuiz.questions =
					TEGQuiz.form
					       .find(TEGQuiz.options.questionSelector)
					       .filter(function() {
						       return !jQuery(this).is(TEGQuiz.options.questionExcludeSelector);
					       })
					       .change(TEGQuiz.runAfterAnswer);

				// return the number of answered questions
				TEGQuiz.getAnswerCount = function() {
					var numberAnswered = 0;

					// clear the counted marker before counting the answered questions
					TEGQuiz.questions
					       .removeAttr('data-answerCounted')
					       .each(function(index) {

						       // if this item has not already been counted (since radio buttons and checkboxes might be counted as groups)
						       if (TEGQuiz.questions.eq(index).attr('data-answerCounted') !== 'undefined') {

							       // count by field type
							       switch (TEGQuiz.questions.eq(index).fieldType()) {

								       case 'radio':
									       // check if any of this radio button group are checked
									       if (
										       TEGQuiz.questions
										              .find('[name="' +
										                    TEGQuiz.questions.eq(index) +
										                    '"]:checked')
									       )
									       {
										       numberAnswered++;
									       }
									       TEGQuiz.questions
									              .find('[name="' + TEGQuiz.questions.eq(index) + '"]')
									              .attr('data-answerCounted', 'true');
									       break;

								       case 'checkbox':
									       // check if the checkbox is part of a fieldset
									       var thisFieldset = TEGQuiz.questions.eq(index).closest('fieldset');

									       /* If the checkbox is part of a fieldset, count all
									        * checkboxes in the fieldset as a group.
									        */
									       if (thisFieldset.length > 0) {

										       // if any of the checkboxes are checked
										       if (thisFieldset.find('[type="checkbox"]:checked').length > 0) {
											       numberAnswered++;
										       } // end if any checkboxes in the
										       thisFieldset.find('[type="checkbox"]')
										                   .attr('data-answerCounted', 'true');

									       } else {
										       TEGQuiz.questions.eq(index)
										              .attr('data-answerCounted', 'true');
									       }
									       break;

								       default:
									       numberAnswered++;
									       TEGQuiz.questions.eq(index)
									              .attr('data-answerCounted', 'true');
							       } // end switch .fieldType()
						       } // end if already counted
					       }); // end each()
				}; // end getAnswerCount()

				TEGQuiz.submitButton = TEGQuiz.form.find(TEGQuiz.options.submitSelector);

				// swaddle the submit button
				TEGQuiz.submmitted = false;

				// Initialize the quiz with the configured quiz type.
				TEGQuiz.quiz = {
					getResults: function() {

						if (console) {
							console.warn('WARNING: TEGQuiz.quiz.getResults not overridden.');
						} // end if console available
					}
				}; // end default TEGQuiz.quiz

				// if trivia quiz
				if (TEGQuiz.options.useTrivia) {
					TEGQuiz.quiz = new TQTrivia(
						jQuery.extend(TEGQuiz.options.triviaOptions,
						              {questions: TEGQuiz.questions})
					);

				} else {

					// if identity quiz
					if (TEGQuiz.options.useWhoAmI) {
						TEGQuiz.quiz = new TQWhoAmI(
							jQuery.extend(TEGQuiz.options.whoAmIOptions,
							              {questions: TEGQuiz.questions})
						);
					} // end if identity type
				} // end if trivia type
				jQuery.extend(TEGQuiz.options.submitQueue, TEGQuiz.quiz.options.submitQueue);
				jQuery.extend(TEGQuiz.options.errorQueue, TEGQuiz.quiz.options.errorQueue);

				// set up pagination
				if (TEGQuiz.options.usePagination) {
					TEGQuiz.pages = new TEGFakePages(TEGQuiz.options.paginationOptions);
					jQuery.extend(TEGQuiz.options.submitQueue, TEGQuiz.pages.options.submitQueue);
					jQuery.extend(TEGQuiz.options.errorQueue, {
						// override the default submit handler for all quiz types
						'99999_pageErrorHandler': function() {

							// if we're watching for errors
							if (TEGQuiz.pages.options.errorSelector !== '') {
								// try to go to the first page with visible errors
								TEGQuiz.pages.errorPage();
							}
						}, // end ['99999_pageErrorHandler']()
					});
				} // end if pagination is available

				// run the afterLoad stuff
				TEGQuiz.options.afterLoad(TEGQuiz.options);

				// We do rather a lot of Engaging Networks customizations.
				if (typeof window.EngagingNetworks === 'object') {
					// if we're in EN, attach to their events
					window.enOnSubmit = TEGQuiz.submitHandler;
					window.enOnError = TEGQuiz.errorHandler;

				} else {
					TEGQuiz.form
					       .submit(TEGQuiz.submitHandler);
				}

				// we're done, show the form
				TEGQuiz.form.show();
			}); // end jQuery(document).ready

	} else {

		// no form found, log a warning
		if (console) {
			console.warn('TEGQuiz: No form found.');
		} // end if console available
	} // end if form found
} // end TEGQuiz constructor
