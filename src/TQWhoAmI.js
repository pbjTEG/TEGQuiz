/* TQWhoAmI
 * Turn a form into a fictional identity quiz like "Which Magical House Are You In?" or "What Kind of Vampire Would You Be?"
 *
 * Copyright © 2020, PMG / The Production Management Group, Ltd.
 * Released under the MIT license.
 *
 * The Engage Group <engage@engageyourcause.com>
 */

function TQWhoAmI(Options) {
	var TQWhoAmI = this;
	// default Options
	TQWhoAmI.options = {
		// keep a pointer to the questions passed form TEGQuiz
		questions : [],
		/* We need to collect the count of answers that match each
		 * category and store the retult to show the user.
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

		// To be run at the end of hte onSubmit handling process.
		submitQue: {
			// override the default submit handler for all quiz types
			'00500_quizHandler': function(event) {

				if (console) {
					console.warn('005_quizHandler not overridden as expected.');
				} // end if console available
				return true;
			} // end ['005_quizHandler']()
		},
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
		return highest.win;
	}; // end getResults(

} // end TQWhoAmI()
