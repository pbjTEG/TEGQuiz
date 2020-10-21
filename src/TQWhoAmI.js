/* TQWhoAmI
 * Turn a form into a fictional identity quiz like "Which Magical House
 * Are You In?" or "What Kind of Vampire Would You Be?"
 *
 * Copyright © 2020, PMG / The Production Management Group, Ltd.
 * Released under the MIT license.
 *
 * The Engage Group <engage@engageyourcause.com>
 */

//TODO add token replacement to category.win strings

function TQWhoAmI(Options) {
	var TQWhoAmI = this;
	// default Options
	TQWhoAmI.options = {
		// keep a pointer to the questions passed form TEGQuiz
		questions : [],
		/* We need to collect the count of answers that match each
		 * category and store the result to show the user.
		 */
		categories: {
			/* 'accumulator key 01' : {
			 *    count: 0,
			 *    win  : 'You are in the category for "Accumulator Key 01!"',
			 * },
			 * 'accumulator key 02' : {
			 *    count: 0,
			 *    win  : '<p>You are in the category for <strong>&ldquo;Accumulator Key 01!&rdquo;</strong>',
			 * },
			 */
		},
		/* TQWhoAmI will first try to use the HTML to determine what answers
		 * are credited to what category. If you're using a CMS you might
		 * not be able to control the value of the radio button or check
		 * box.
		 */
		answers   : {
			/*
			 * 'selector01' : 'accumulator key 01',
			 * 'selector02' : 'accumulator key 02',
			 */
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

		/* To be run after each answer is selected.
		 * See options.afterAnswer in TEGQuiz.js.
		 */
		afterAnswer: {},
	}; // end TQWhoAmI.options
	jQuery.extend(TQWhoAmI.options, Options);

	// NOTE: per-form customization should be passed through the TEGQuiz instance using this object.

	// gather the answers from the HTML and then the answer collection
	if (TQWhoAmI.options.questions.length > 0) {

		// first pull the answers from the HTML, if any
		TQWhoAmI.options.questions
		        .each(function(index) {
			        TQWhoAmI.options.questions
			                .eq(index)
			                .prop('TQW_category',
			                      TQWhoAmI.options.questions.eq(index).val()
			                );
		        });

		// now try the answers collection
		for (var keyName in TQWhoAmI.options.answers) {
			TQWhoAmI.options.questions
			        .filter(keyName)
			        .prop('TQW_category',
			              TQWhoAmI.options.answers[keyName]);
		}

	} else {

		if (console) {
			console.error('TQWhoAmI error: No quiz questions.');
		}
	}

	TQWhoAmI.getResults = function() {

		// wipe any previous results
		for (var catKey in TQWhoAmI.options.categories) {
			TQWhoAmI.options.categories[catKey].count = 0;
		}

		var highest = {
			count: 0,
			win  : '',
		};

		// count the current status
		TQWhoAmI.options.questions
		        .each(function(index) {

			        // if the question has been answered
			        if (TQWhoAmI.options.questions.eq(index).getAny() !== '') {
				        TQWhoAmI.options.categories[TQWhoAmI.options.questions.eq(index).prop('TQW_category')].count += 1;

				        // store the most recent highest score
				        if (TQWhoAmI.options.categories[TQWhoAmI.options.questions.eq(index).prop('TQW_category')].count >
				            highest.count)
				        {
					        highest = TQWhoAmI.options.categories[TQWhoAmI.options.questions.eq(index).prop('TQW_category')];
				        }
			        } // end if selected
		        });

		if (console) {
			console.log('getResults categories');

			for (var key in TQWhoAmI.options.categories) {

				var value = TQWhoAmI.options.categories[key];
				console.log('  ' + key + ' = ' + value);

				for (var key2 in value) {

					var value2 = value[key2];
					console.log('    ' + key2 + ' = ' + value2);
				} // end loop through second level items
			} // end loop through first level items
		} // end if console available
		return highest.win;
	}; // end getResults()

} // end TQWhoAmI()
