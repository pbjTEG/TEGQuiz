describe('TEG Quiz with TQWhoAmIBranched', function() {
	beforeAll(function() {
		window.quizOptions = {
			formSelector: '#triviaQuiz',
			newQuiz     : TQTrivia,
			quizOptions : {
				answers    : {
					'[name="favoriteColor"]' : ['blue'],
					'[name="favoriteNumber"]': ['11', '111'],
					'#select01'              : ['2'],
				}, // end answers
				submitQueue: {
					'99999_test': function(event) {
						return true;
					},
				}, // end submitQueue
				errorQueue : {
					'99999_test': function(event) {
						return true;
					},
				}, // end submitQueue
				afterAnswer: {
					'[name="favoriteColor"]': function(event) {
						return true;
					},
				}, // end submitQueue
				results    : {
					100: '<p><span class="viewedQuestions">¿?</span>' +
					     '<span class="totalQuestions">¿?</span>' +
					     '<span class="answeredQuestions">¿?</span>' +
					     '<span class="correctQuestions">¿?</span></p>',
					5  : '<p>results for 5%</p>',
				}
			}, // end whoAmIOptions
		};
		window.testForm = new TEGQuiz(window.quizOptions);
	});

	describe('Questions', function() {
		it('should have questions', function() {
			expect(testForm.quiz.options.questions.length).toBe(9);
		}); // end it('should have questions')
	}); // end describe('Questions')

	describe('Answers', function() {
		it('should have answers', function() {
			expect(Object.keys(testForm.quiz.options.answers).length).toBe(3);
		}); // end it('should have answers')
	}); // end describe('Answers')

	describe('submitQueue', function() {
		it('should have functions', function() {
			expect(Object.keys(testForm.options.submitQueue).length).toBe(2);
		}); // end it('should have functions')
		it('should have one named "99999_test"', function() {
			expect(typeof testForm.options.submitQueue['99999_test']).toBe('function');
			expect(testForm.options.submitQueue['99999_test']()).toBe(true);
		}); // end it('should have functions')
		it('should have one named "00500_quizHandler"', function() {
			expect(typeof testForm.options.submitQueue['00500_quizHandler']).toBe('function');
			expect(testForm.options.submitQueue['00500_quizHandler']()).toBe(true);
		}); // end it('should have functions')
	}); // end describe('submitQueue')

	describe('errorQueue', function() {
		it('should have functions', function() {
			expect(Object.keys(testForm.options.errorQueue).length).toBe(2);
		}); // end it('should have functions')
		it('should have one named "99999_test"', function() {
			expect(typeof testForm.options.errorQueue['99999_test']).toBe('function');
			expect(testForm.options.errorQueue['99999_test']()).toBe(true);
		}); // end it('should have functions')
		it('should have one named "00500_quizErrorHandler"', function() {
			expect(typeof testForm.options.errorQueue['00500_quizErrorHandler']).toBe('function');
			expect(testForm.options.errorQueue['00500_quizErrorHandler']()).toBe(true);
		}); // end it('should have functions')
	}); // end describe('errorQueue')

	describe('afterAnswer', function() {
		it('should have functions', function() {
			expect(Object.keys(testForm.options.afterAnswer).length).toBe(3);
		}); // end it('should have functions')
		it('should have one with CSS selector key \'[name="favoriteColor"]\'', function() {
			expect(typeof testForm.options.afterAnswer['[name="favoriteColor"]']).toBe('function');
			expect(testForm.options.afterAnswer['[name="favoriteColor"]']()).toBe(true);
		}); // end it('should have functions')
		it('should have one with CSS selector key \'everyTime\'', function() {
			expect(typeof testForm.options.afterAnswer['everyTime']).toBe('function');
			expect(testForm.options.afterAnswer['everyTime']()).toBe(true);
		}); // end it('should have functions')
	}); // end describe('errorQueue')

	describe('results', function() {
		it('should have entries', function() {
			expect(Object.keys(testForm.quiz.options.results).length).toBe(4);
		}); // end it('should have functions')
		it('should have one for 100%', function() {
			expect(testForm.quiz.options.results[100]).toBe('<p><span class="viewedQuestions">¿?</span>' +
					     '<span class="totalQuestions">¿?</span>' +
					     '<span class="answeredQuestions">¿?</span>' +
					     '<span class="correctQuestions">¿?</span></p>');
		}); // end it('should have one for 100')
		it('should have one for 90%', function() {
			expect(testForm.quiz.options.results[90]).toBe('<div><h3>Excellent!</h3><p>You got most questions right. ' +
			                                               'That&rsquo;s <span class="correctQuestions"></span> ' +
			                                               'out of <span class="totalQuestions"></span>.</p></div>');
		}); // end it('should have one for 90')
		it('should have one for 50%', function() {
			expect(testForm.quiz.options.results[50]).toBe('<div><h3>Were you even paying attention?</h3><p>You got most questions wrong. ' +
			                                               'That&rsquo;s only <span class="correctQuestions"></span> ' +
			                                               'out of <span class="totalQuestions"></span>.</p></div>');
		}); // end it('should have one for 5')
		it('should have one for 5%', function() {
			expect(testForm.quiz.options.results[5]).toBe('<p>results for 5%</p>');
		}); // end it('should have one for 5')
	}); // end describe('errorQueue')

	describe('getResults()', function() {
		it('should be 100%', function() {
			jQuery('#radio103').click();
			jQuery('#radio203').click();
			jQuery('#select01').setAny('2');
			expect(testForm.quiz.getResults()).toBe('<p><span class="viewedQuestions">0</span>' +
					     '<span class="totalQuestions">3</span>' +
					     '<span class="answeredQuestions">3</span>' +
					     '<span class="correctQuestions">3</span></p>');
		}); // end it('should be category 2')
	}); // end describe('getResults()')
});