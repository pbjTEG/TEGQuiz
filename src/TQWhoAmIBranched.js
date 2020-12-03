/* TQWhoAmIBranched
 * Turn a form into a fictional identity quiz like "Which Magical House
 * Are You In?" or "What Kind of Vampire Would You Be?" Additionally,
 * add the capacity for branching question flows such that the
 * answer to a quiz question determines which questions will follow.
 *
 * Copyright © 2020, PMG / The Production Management Group, Ltd.
 * Released under the MIT license.
 *
 * The Engage Group <engage@engageyourcause.com>
 */

function TQWhoAmIBranched(Options) {
	var TQWB = this;
	// default Options
	TQWB.options = {
		// keep a pointer to the questions passed form TEGQuiz
		questions : [],
		/* We need to collect the count of answers that match each
		 * category and store the result to show the user.
		 */
		categories: {
			/* 'category01' : {
			 *    count: 0,
			 *    win  : '<p>You are in the category for <strong>&ldquo;Category 1!&rdquo;</strong></p>',
			 * },
			 * 'category02' : {
			 *    count: 0,
			 *    win  : '<p>You are in the category for <strong>&ldquo;Category 2!&rdquo;</strong>',
			 * },
			 */
		},
		/* TQWB will first try to use the HTML to determine what answers
		 * are credited to what category. If you're using a CMS you might
		 * not be able to control the value of the radio button or check
		 * box.
		 */
		answers   : {
			/*
			 * 'any.selector01' : 'category01',
			 * 'any.selector02' : 'category02',
			 */
		},
		// Keep a list of branch IDs and selectors for finding them.
		branches  : {
			/*
			 * 'branch01':'fieldset[data-branch="branch01"]',
			 * 'branch02':'fieldset[data-branch="branch02"]',
			 */
		},

		// To be run at the end of the onSubmit handling process.
		submitQueue: {
			// override the default submit handler for all quiz types
			'00500_quizHandler': function(event) {

				if (console) {
					console.warn('TQWB.options.submitQueue[\'00500_quizHandler\'] not overridden as expected.');
				} // end if console available
				return true;
			} // end ['005_quizHandler']()
		},

		// To be run if onSubmit fails
		errorQueue: {
			// override the default error handler for all quiz types
			'00500_quizErrorHandler': function() {

				if (console) {
					console.warn('TQWB.options.errorQueue[\'00500_quizErrorHandler\'] not overridden as expected.');
				} // end if console available
				return true;
			} // end ['00500_quizErrorHandler']()
		}, // end errorQueue

		/* To be run after each answer is selected.
		 * See options.afterAnswer in TEGQuiz.js.
		 */
		afterAnswer: {
			// check branch visibility after each answer
			'*': function(event) {
				var theQuestion = jQuery(event.target);

				// check the branches
				if (typeof theQuestion.attr('data-branch') === 'string' &&
				    theQuestion.getAny() !== '')
				{
					/* Show the branch while hiding all sibling elements
					 * of the same type. These should be the other
					 * branches.
					 */
					var theBranch = jQuery(theQuestion.attr('data-branch'));
					theBranch
						.show()
						.siblings(theBranch[0].nodeName)
						.hide();
				}
				return true;
			}
		},
	}; // end TQWB.options
	// extend the options with a deep copy
	jQuery.extend(true, TQWB.options, Options);

	// NOTE: per-form customization should be passed through the TEGQuiz instance using this object.

	// gather the answers from the HTML and then the answer collection
	if (TQWB.options.questions.length > 0) {

		// first pull the answers from the HTML, if any
		TQWB.options.questions
		    .each(function(index) {
			    TQWB.options.questions
			        .eq(index)
			        .prop('TQWB_category',
			              TQWB.options.questions.eq(index).val()
			        );

			    // while we're at it, set up the branch handler
			    if (TQWB.options.questions.eq(index).attr('data-branch')) {
				    TQWB.options.branches[TQWB.options.questions.eq(index).attr('id')] = TQWB.options.questions.eq(index).attr('data-branch');
			    } // end if this question has a data-branch attribute
		    });

		// now try the answers collection
		for (var keyName in TQWB.options.answers) {
			TQWB.options.questions
			    .filter(keyName)
			    .prop('TQWB_category',
			          TQWB.options.answers[keyName]);
		} // end loop through answer collection

	} else {

		if (console) {
			console.error('TQWhoAmIBranched error: No quiz questions.');
		}
	}

	TQWB.getResults = function() {

		// wipe any previous results
		for (var catKey in TQWB.options.categories) {
			TQWB.options.categories[catKey].count = 0;
		}

		var highest = {
			count: 0,
			win  : '',
		};

		// count the current status
		TQWB.options.questions
		    .each(function(index) {

			    // if the question has been answered
			    if (TQWB.options.questions.eq(index).getAny() !== '' &&
			        TQWB.options.categories.hasOwnProperty(TQWB.options.questions.eq(index).prop('TQWB_category')))
			    {
				    TQWB.options.categories[TQWB.options.questions.eq(index).prop('TQWB_category')].count += 1;

				    // store the most recent highest score
				    if (TQWB.options.categories[TQWB.options.questions.eq(index).prop('TQWB_category')].count >
				        highest.count)
				    {
					    highest = TQWB.options.categories[TQWB.options.questions.eq(index).prop('TQWB_category')];
				    }
			    } // end if selected
		    });
		return highest.win;
	}; // end getResults()

} // end TQWhoAmI()
