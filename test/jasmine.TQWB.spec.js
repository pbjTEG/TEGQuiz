describe('TEG Quiz with TQWhoAmIBranched', function() {
	beforeAll(function() {
		window.quizOptions = {
			newQuiz          : TQWhoAmIBranched,
			quizOptions      : {
				categories : {
					'category01': {
						count: 0,
						win  : 'You are in Category 1!',
					},
					'category02': {
						count: 0,
						win  : 'You are in Category 2!',
					},
					'category03': {
						count: 0,
						win  : 'You are in Category 3!',
					},
					'category04': {
						count: 0,
						win  : 'You are in Category 4!',
					},
				}, // end categories
				answers    : {
					'#radio211': 'category01',
					'#radio212': 'category02',
					'#radio213': 'category03',
					'#radio214': 'category04',
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
				}, // end errorQueue
				afterAnswer: {
					'[name="radio414"]': function(event) {
						return true;
					},
				}, // end afterAnswer
			}, // end whoAmIOptions
		};
		window.testForm = new TEGQuiz(window.quizOptions);
	});

	describe('Questions', function() {
		it('should have questions', function() {
			expect(testForm.quiz.options.questions.length).toBe(56);
		}); // end it('should have questions')
		it('should have categories', function() {
			var categoryList = {
				'none': 0,
			};
			testForm.quiz.options.questions
			        .each(function(index, HTMLObject) {
				        var thisCategory = testForm.quiz.options.questions.eq(index).prop('TQWB_category') || 'none';

				        // If the category is already in the list. . .
				        if (categoryList.hasOwnProperty(thisCategory)) {
					        // . . .increment it.
					        categoryList[thisCategory] += 1;

				        } else {
					        // Otherwise, add it.
					        categoryList[thisCategory] = 1;
				        } // end if category exists in the list
			        });
			expect(Object.keys(categoryList).length).toBe(9);
			expect(categoryList.black).toBe(1);
			expect(categoryList.category01).toBe(12);
			expect(categoryList.category02).toBe(12);
			expect(categoryList.category03).toBe(12);
			expect(categoryList.category04).toBe(12);
			expect(categoryList.none).toBe(4);
			expect(categoryList.red).toBe(1);
			expect(categoryList.white).toBe(1);
			expect(categoryList.yellow).toBe(1);
		}); // end it('should have categories')
	}); // end describe('Questions')

	describe('Categories', function() {
		it('should have categories', function() {
			expect(Object.keys(testForm.quiz.options.categories).length).toBe(4);
		}); // end it('should have categories')
	}); // end describe('Categories')

	describe('Answers', function() {
		it('should have answers', function() {
			expect(Object.keys(testForm.quiz.options.answers).length).toBe(4);
		}); // end it('should have answers')
	}); // end describe('Answers')

	describe('Branches', function() {
		it('should have branches', function() {
			expect(Object.keys(testForm.quiz.options.branches).length).toBe(12);
		}); // end it('should have branches')
	}); // end describe('Branches')

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
		it('should have one with CSS selector key \'[name="radio414"]\'', function() {
			expect(typeof testForm.options.afterAnswer['[name="radio414"]']).toBe('function');
			expect(testForm.options.afterAnswer['[name="radio414"]']()).toBe(true);
		}); // end it('should have functions')
		it('should have one with CSS selector key \'everyTime\'', function() {
			expect(typeof testForm.options.afterAnswer['everyTime']).toBe('function');
			expect(testForm.options.afterAnswer['everyTime']()).toBe(true);
		}); // end it('should have functions')
		it('should have one with CSS selector key \'*\'', function() {
			expect(typeof testForm.options.afterAnswer['*']).toBe('function');
			expect(testForm.options.afterAnswer['*'](new Event('testing'))).toBe(true);
		}); // end it('should have functions')
	}); // end describe('errorQueue')

	describe('getResults()', function() {
		it('should be category 2', function() {
			expect(testForm.quiz.getResults()).toBe('You are in Category 2!');
		}); // end it('should be category 2')
	}); // end describe('getResults()')
});