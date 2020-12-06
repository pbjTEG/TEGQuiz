describe('TEG Quiz with TQWhoAmIBranched', function() {
	beforeAll(function() {
		window.quizOptions = {
			formSelector: '#quiz',
			newQuiz     : function(Options) {
				var test = this;
				test.options = {
					questions: [],
					submitQueue : {
						'default testing': function (event) {
							return 'submit default test function';
						},
					},
					errorQueue: {
						'default testing': function(event) {
							return 'error default test function';
						},
					},
					afterAnswer: {
						'default testing': function(event) {
							return 'answer default test function';
						}
					}
				};
				jQuery.extend(true, test.options, Options)

				test.getResults = function() {
					return 'test.getResults()';
				}
			},
			quizOptions : {
				submitQueue: {
					'option testing': function(event) {
						return 'submit option test function';
					},
				}, // end submitQueue
				errorQueue : {
					'option testing': function(event) {
						return 'error option test function';
					},
				}, // end submitQueue
				afterAnswer: {
					'option testing': function(event) {
						return 'answer option test function';
					},
				}, // end submitQueue
			}, // end whoAmIOptions
		};
		window.testForm = new TEGQuiz(window.quizOptions);
	});

	describe('Questions', function() {
		it('should have 9 questions', function() {
			expect(testForm.quiz.options.questions.length).toBe(9);
		}); // end it('should have questions')
	}); // end describe('Questions')

	describe('submitQueue', function() {
		it('should have 4 functions', function() {
			expect(Object.keys(testForm.options.submitQueue).length).toBe(4);
		}); // end it('should have functions')
		it('should have one named "00500_quizHandler"', function() {
			expect(typeof testForm.options.submitQueue['00500_quizHandler']).toBe('function');
			expect(testForm.options.submitQueue['00500_quizHandler']()).toBe(true);
		}); // end it('should have one named "00500_quizHandler"')
		it('should have one named "default testing"', function() {
			expect(typeof testForm.options.submitQueue['default testing']).toBe('function');
			expect(testForm.options.submitQueue['default testing']()).toBe('submit default test function');
		}); // end it('should have one named "default testing"')
		it('should have one named "option testing"', function() {
			expect(typeof testForm.options.submitQueue['option testing']).toBe('function');
			expect(testForm.options.submitQueue['option testing']()).toBe('submit option test function');
		}); // end it('should have one named "option testing"')
		it('should have one named "per-page testing"', function() {
			expect(typeof testForm.options.submitQueue['per-page testing']).toBe('function');
			expect(testForm.options.submitQueue['per-page testing']()).toBe('submit per-page test function');
		}); // end it('should have one named "per-page testing"')
	}); // end describe('submitQueue')

	describe('errorQueue', function() {
		it('should have 4 functions', function() {
			expect(Object.keys(testForm.options.errorQueue).length).toBe(4);
		}); // end it('should have functions')
		it('should have one named "00500_quizErrorHandler"', function() {
			expect(typeof testForm.options.errorQueue['00500_quizErrorHandler']).toBe('function');
			expect(testForm.options.errorQueue['00500_quizErrorHandler']()).toBe(true);
		}); // end it('should have one named "00500_quizErrorHandler"')
		it('should have one named "default testing"', function() {
			expect(typeof testForm.options.errorQueue['default testing']).toBe('function');
			expect(testForm.options.errorQueue['default testing']()).toBe('error default test function');
		}); // end it('should have one named "default testing"')
		it('should have one named "option testing"', function() {
			expect(typeof testForm.options.errorQueue['option testing']).toBe('function');
			expect(testForm.options.errorQueue['option testing']()).toBe('error option test function');
		}); // end it('should have one named "option testing"')
		it('should have one named "per-page testing"', function() {
			expect(typeof testForm.options.errorQueue['per-page testing']).toBe('function');
			expect(testForm.options.errorQueue['per-page testing']()).toBe('error per-page test function');
		}); // end it('should have one named "per-page testing"')
	}); // end describe('errorQueue')

	describe('afterAnswer', function() {
		it('should have 4 functions', function() {
			expect(Object.keys(testForm.options.afterAnswer).length).toBe(4);
		}); // end it('should have functions')
		it('should have one named "default testing"', function() {
			expect(typeof testForm.options.afterAnswer['default testing']).toBe('function');
			expect(testForm.options.afterAnswer['default testing']()).toBe('answer default test function');
		}); // end it('should have one named "default testing"')
		it('should have one named "option testing"', function() {
			expect(typeof testForm.options.afterAnswer['option testing']).toBe('function');
			expect(testForm.options.afterAnswer['option testing']()).toBe('answer option test function');
		}); // end it('should have one named "option testing"')
		it('should have one named "per-page testing"', function() {
			expect(typeof testForm.options.afterAnswer['per-page testing']).toBe('function');
			expect(testForm.options.afterAnswer['per-page testing']()).toBe('answer per-page test function');
		}); // end it('should have one named "per-page testing"')
		it('should have one named "everyTime" which updates the results', function() {
			testForm.options.afterAnswer['everyTime']();
			expect(jQuery(testForm.options.resultSelector).text()).toBe('test.getResults()');
		}); // end it('should have one named "everyTime"')
	}); // end describe('errorQueue')

	describe('getResults()', function() {
		it('should return "test.getResults()"', function() {
			expect(testForm.quiz.getResults()).toBe('test.getResults()');
		}); // end it('should exist')
	}); // end describe('getResults()')
});