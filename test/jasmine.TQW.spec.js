describe('TEG Quiz with TQWhoAmIBranche', function() {
	beforeAll(function() {
		window.quizOptions = {
			newQuiz    : TQWhoAmI,
			quizOptions: {
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
					'#checkbox205': 'category01',
					'#checkbox206': 'category02',
					'#checkbox207': 'category03',
					'#checkbox208': 'category04',
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
			}, // end whoAmIOptions
		};
		window.testForm = new TEGQuiz(window.quizOptions);
	});

	describe('Questions', function() {
		it('should have questions', function() {
			expect(testForm.quiz.options.questions.length).toBe(13);
		}); // end it('should have questions')
		it('should have categories', function() {
			var categoryList = {
				'none': 0,
			};
			testForm.quiz.options.questions
			        .each(function(index, HTMLObject) {
				        var thisCategory = testForm.quiz.options.questions.eq(index).prop('TQW_category') || 'none';

				        // If the category is already in the list. . .
				        if (categoryList.hasOwnProperty(thisCategory)) {
					        // . . .increment it.
					        categoryList[thisCategory] += 1;

				        } else {
					        // Otherwise, add it.
					        categoryList[thisCategory] = 1;
				        } // end if category exists in the list
			        });
			expect(Object.keys(categoryList).length).toBe(5);
			expect(categoryList.category01).toBe(3);
			expect(categoryList.category02).toBe(3);
			expect(categoryList.category03).toBe(4);
			expect(categoryList.category04).toBe(3);
			expect(categoryList.none).toBe(0);
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

	describe('submitQueue', function() {
		it('should have functions', function() {
			expect(Object.keys(testForm.quiz.options.submitQueue).length).toBe(1);
		}); // end it('should have functions')
		it('should have one named "99999_test"', function() {
			expect(typeof testForm.quiz.options.submitQueue['99999_test']).toBe('function');
			expect(testForm.quiz.options.submitQueue['99999_test']()).toBe(true);
		}); // end it('should have functions')
	}); // end describe('submitQueue')

	describe('errorQueue', function() {
		it('should have functions', function() {
			expect(Object.keys(testForm.quiz.options.errorQueue).length).toBe(1);
		}); // end it('should have functions')
		it('should have one named "99999_test"', function() {
			expect(typeof testForm.quiz.options.errorQueue['99999_test']).toBe('function');
			expect(testForm.quiz.options.errorQueue['99999_test']()).toBe(true);
		}); // end it('should have functions')
	}); // end describe('errorQueue')

	describe('afterAnswer', function() {
		it('should have functions', function() {
			expect(Object.keys(testForm.options.afterAnswer).length).toBe(2);
		}); // end it('should have functions')
		it('should have one with CSS selector key \'[name="favoriteColor"]\'', function() {
			expect(typeof testForm.options.afterAnswer['[name="favoriteColor"]']).toBe('function');
			expect(testForm.options.afterAnswer['[name="favoriteColor"]']()).toBe(true);
		}); // end it('should have functions')
	}); // end describe('errorQueue')

	describe('getResults()', function() {
		it('should be category 3', function() {
			expect(testForm.quiz.getResults()).toBe('You are in Category 3!');
		}); // end it('should be category 2')
	}); // end describe('getResults()')
});