setTimeout(hidePreloader, 0.2);

if (typeof $.fn.select2 === 'function') {
    var selectorx = $('.select_states').select2();
} else {
    console.log("select2 is not available");
}


var steps = document.querySelectorAll('.step');
var nextButton = document.getElementById('nextStep');
var prevButton = document.getElementById('prevStep');
var prevButtonMobile = document.getElementById('prevBtnMobile');

var currentStepElement = document.querySelector('.current-step');
var totalStepElement = document.querySelector('.total-step');
var currentStep = 0;
var uniqueSortedSteps = [];

/* testing work*/
var branches = [];
var branchesIndex = 0;

////////////////////////////RBS///////////////////////////////
let queue_questions = [];
////////////////////////////RBS///////////////////////////////

toggleButtonVisibility(currentStep);
showStep(currentStep);

var filteredQuestions = questionnaireData.questions.filter(function (question) {
    return !('is_subquestion' in question);
});

var numberOfQuestionsWithoutSubquestion = filteredQuestions.length;
totalStepElement.textContent = numberOfQuestionsWithoutSubquestion;

document.addEventListener('DOMContentLoaded', function () {
    nextButton.addEventListener('click', nextStepHandler);
    prevButton.addEventListener('click', prevStepHandler);
    prevButtonMobile.addEventListener('click', prevStepHandler);
});

function prevStepHandler() {

    console.log('prev step click', 'currentStep = ', currentStep);

    if (currentStep > 0) {
        newQuestionnaireData.questions[currentStep].answered = false;
        hideStep(currentStep);
        var prevStep = newQuestionnaireData.questions[currentStep].prev_question;
        if (prevStep === undefined) {
            currentStep--;
        } else {
            currentStep = prevStep;
        }
        if (steps[currentStep]) {
            showStep(currentStep);
            updatePagination(currentStep);
            updateStepInfo();
            toggleButtonVisibility(currentStep);
            branchesIndex--;
        } else {
            console.log('Element at currentStep ' + currentStep + ' does not exist.');
        }
        updateQuestionQueueForPrevStep();

        updateNextButtonState();
    }
}

function nextStepHandler() {

    console.log('next step click', 'currentStep = ', currentStep);

    if (currentStep < steps.length - 1) {

        if (currentStep == 5 ){
            displayProgramsList();
        }
        if (currentStep == 6) {
            document.getElementById('prevStep').style.display = 'none';
            document.getElementById('nextStep').style.display = 'none';

            submitQuizData();

        }

        if (!validateCurrentStep(steps[currentStep])) {
            return
        }

        newQuestionnaireData.questions[currentStep].answered = true;
        lastStep = currentStep;
        hideStep(currentStep);
        saveQuestionData(currentStep);

        if ((newQuestionnaireData.questions[currentStep].parent_question) || (newQuestionnaireData.questions[currentStep].multiply)) {

            var selectedAnswers = getSeletcedAnswerMulti(steps[currentStep]);
            var nextSteps = getNextStepMulti(selectedAnswers); // is true

            ////////////////////////////RBS///////////////////////////////
            if (!queue_questions.length) {
                let selectedQuestionsIdx = getSelectedQuestionsIdx(currentStep, selectedAnswers);
                generateQuestionQueue(selectedQuestionsIdx)
            }
            ////////////////////////////RBS///////////////////////////////

            if (branchesIndex <= queue_questions.length && selectedAnswers?.length) {

                ////////////////////////////RBS///////////////////////////////

                if (selectedAnswers[0] === 0 && queue_questions[branchesIndex - 1]?.next) {
                    let currentQuestionIdx = queue_questions[branchesIndex - 1]['index']
                    let nextQuestionIdx = queue_questions[branchesIndex - 1]['next']['index']

                    updateQuestionQueueForNextStep(currentQuestionIdx, nextQuestionIdx)

                    currentStep = queue_questions[branchesIndex]['index'];
                    branchesIndex++;
                } else {
                    if (queue_questions[branchesIndex]) {
                        currentStep = queue_questions[branchesIndex]['index'];
                        branchesIndex++;
                    } else {
                        currentStep = 51;
                    }
                }

                showStep(currentStep);
                updateStepInfo();
                toggleButtonVisibility(currentStep);
                window.newQuestionnaireData = newQuestionnaireData;

                ////////////////////////////RBS///////////////////////////////

            } else {
                currentStep = 51;
                showStep(currentStep);
                updateStepInfo();
                toggleButtonVisibility(currentStep);
            }

        } else {
            var selectedAnswer = getSelectedAnswer(steps[currentStep]);
            getNextStep(selectedAnswer);
            showStep(currentStep);
            updatePagination(currentStep);
            updateStepInfo();
            toggleButtonVisibility(currentStep);
        }

        newQuestionnaireData.questions[currentStep].prev_question = lastStep;
        window.newQuestionnaireData = newQuestionnaireData;
        window.questionnaireData = questionnaireData;


        updateNextButtonState();
    }

}

////////////////////////////RBS///////////////////////////////

/*brahches with subquestion*/
function generateQuestionQueue(selectedQuestionsIdx) {
    let result = []
    if (selectedQuestionsIdx.length) {
        selectedQuestionsIdx.sort().forEach((idx => {
            let current_question = questionnaireData.questions.find(el => el.index === idx)
        result.push(
            {
                index: idx,
                next: current_question.next_questions.length > 1
                    ? {index: current_question.next_questions.sort()[0]}
                    : null
            })
    }))
    }
    queue_questions = result
}

function updateQuestionQueueForNextStep(currentQuestionIdx, nextQuestionIdx) {
    let next_question = questionnaireData.questions.find(el => el.index === nextQuestionIdx)
    let new_value = {
        index: nextQuestionIdx,
        next: next_question.next_questions.length > 1
            ? {index: next_question.next_questions[0]}
            : null
    }
    queue_questions.splice(queue_questions.findIndex(el => el.index === currentQuestionIdx) + 1, 0, new_value);
}

function updateQuestionQueueForPrevStep() {
    if (branchesIndex > 0) {
        let current_question = queue_questions[branchesIndex - 1]
        if (current_question?.next) {
            if (queue_questions[branchesIndex]) {
                queue_questions.splice(branchesIndex, 1)
            }
        }
    } else {
        clearQuestionQueue()
    }
}

function clearQuestionQueue() {
    queue_questions = []
    branchesIndex = 0
}

function getSelectedQuestionsIdx(currentStep, selectedAnswers) {
    let parent_question = questionnaireData.questions.find(el => el.index === currentStep)
    let nextQuestionsIndexes = []
    if (selectedAnswers.length) {
        selectedAnswers.forEach(el => {
            let question_index = parent_question['next_questions'][el]
            if (!nextQuestionsIndexes.some(idx => idx === question_index)) {
            nextQuestionsIndexes.push(question_index)
        }
    })
    }
    return nextQuestionsIndexes
}

////////////////////////////RBS///////////////////////////////

function getNextStepMulti(selectedAnswers) {
    const question = questionnaireData.questions[currentStep];
    const nextAnswers = question.next_questions;

    if (nextAnswers && nextAnswers?.length && selectedAnswers?.length) {
        const nextSteps = selectedAnswers.reduce((steps, selectedAnswer) => {
            const answerNextSteps = nextAnswers[selectedAnswer];
        if (Array.isArray(answerNextSteps)) {
            return [...steps, ...answerNextSteps];
        } else if (typeof answerNextSteps === 'number') {
            return [...steps, answerNextSteps];
        }
        return steps;
    }, []);

        return  [...new Set(nextSteps)].sort((a, b) => a - b);
    } else {
        return [];
    }
}

function getAnswerForQuestion(question) {
    var selectedAnswer = null;
    var inputs = document.querySelectorAll('input[name="question_' + question.index + '"]:checked');
    if (inputs.length === 0) {
        return null;
    }
    if (question.type === 'checkbox') {
        selectedAnswer = [];
        inputs.forEach(function (input) {
            selectedAnswer.push(Number(input.value));
        });
    } else if (question.type === 'select') {
        selectedAnswer = Number(inputs[0].value);
    } else {
        selectedAnswer = Number(inputs[0].getAttribute('data-answer-index'));
    }
    return selectedAnswer;
}

function getNextStep(selectedAnswer) {
    var question = questionnaireData.questions[currentStep];
    var nextSteps = question.next_questions;
    var parentQuestion = question.parent_question;

    if (parentQuestion !== undefined) {
        currentStep = parentQuestion;
        return;
    }

    if (Array.isArray(selectedAnswer)) {
        var uniqueNextSteps = nextSteps.filter(step => selectedAnswer.includes(step));
        if (uniqueNextSteps.length > 0) {
            currentStep = uniqueNextSteps[0];
        } else {
            currentStep++;
        }
    } else if (nextSteps !== undefined && nextSteps.length > 0) {
        currentStep = nextSteps[0];
    } else {
        currentStep++;
    }
}

function updateStepInfo() {
    var currentQuestion = newQuestionnaireData.questions[currentStep];
    var subquestionEl = document.getElementById('subquestion');

    if (currentQuestion && currentQuestion.is_subquestion === true) {
        //subquestionEl.innerText = 'Question ' + currentQuestion.subquestion;
    } else {
        //subquestionEl.innerText = '';
    }
    currentStepElement.textContent = currentQuestion.step;
}

function getSelectedAnswer(step) {
    var selectedAnswer = null;
    var inputs = step.querySelectorAll('input[type="radio"], input[type="checkbox"]');
    if (inputs.length === 0) {
        return null;
    }
    inputs.forEach(function (input, index) {
        if (input.checked) {
            selectedAnswer = index;
        }
    });
    return selectedAnswer;
}

function getSelectedAnswerMulti(step) {
    var selectedAnswers = [];
    var inputs = step.querySelectorAll('input[type="radio"], input[type="checkbox"]');
    if (inputs.length === 0) {
        return null;
    }

    inputs.forEach(function (input, index) {
        if (input.type === "radio") {
            input.addEventListener('click', function () {
                if (input.dataset.checked === "true") {
                    input.checked = false;
                    input.dataset.checked = "false";
                } else {
                    input.dataset.checked = "true";
                    inputs.forEach(function (otherInput) {
                        if (otherInput !== input && otherInput.type === "radio") {
                            otherInput.dataset.checked = "false";
                        }
                    });
                }
            });
        }

        if (input.checked) {
            selectedAnswers.push(index);
        }
    });

    return selectedAnswers;
}

function hideStep(stepIndex) {
    steps[stepIndex].style.display = 'none';
}

function showStep(stepIndex) {
    steps[stepIndex].style.display = 'block';
}

function toggleButtonVisibility(currentStep) {
    if (currentStep === 0) {
        prevButton.style.display = 'none';
    } else {
        prevButton.style.display = 'block';
    }
}

function getUniqueSortedSteps(selectedAnswers) {
    const nextAnswers = questionnaireData.questions[currentStep].next_questions;
    const nextSteps = selectedAnswers.reduce((steps, selectedAnswer) => {
        const answerNextSteps = nextAnswers[selectedAnswer];
    if (Array.isArray(answerNextSteps)) {
        return [...steps, ...answerNextSteps];
    } else if (typeof answerNextSteps === 'number') {
        return [...steps, answerNextSteps];
    }
    return steps;
}, []);

    const uniqueSortedSteps = [...new Set(nextSteps)].sort();
    return uniqueSortedSteps;
}

var answerBtns = document.querySelectorAll('.quiz-answers-type-slider .answer-btn');
answerBtns.forEach(function (btn, index) {
    if (index > 0) {
        btn.addEventListener('click', function () {
            var currentStep = this.closest('.step');
            var allAnswerBtns = currentStep.querySelectorAll('.quiz-answers-type-slider .answer-btn');

            allAnswerBtns.forEach(function (btn) {
                btn.classList.remove('active');
                btn.querySelector('input').checked = false;
            });

            this.classList.add('active');
            this.querySelector('input').checked = true;


            btn.querySelector('input').dispatchEvent(new Event('input'));
            btn.querySelector('input').dispatchEvent(new Event('change'));
            updateNextButtonState();
        });
    }
});

var answerBtns = document.querySelectorAll('.quiz-answers-type-radio .answer-btn');
answerBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
        var currentStep = this.closest('.step');
        var allAnswerBtns = currentStep.querySelectorAll('.quiz-answers-type-radio .answer-btn');

        allAnswerBtns.forEach(function (btn) {
            btn.classList.remove('active');
            btn.querySelector('input').checked = false;

            btn.querySelector('input').dispatchEvent(new Event('input'));
            btn.querySelector('input').dispatchEvent(new Event('change'));
        });

        this.classList.add('active');
        this.querySelector('input').checked = true;

        this.querySelector('input').dispatchEvent(new Event('input'));
        this.querySelector('input').dispatchEvent(new Event('change'));

        updateNextButtonState();
    });
});

var answerBtns = document.querySelectorAll('.quiz-answers-type-checkbox .answer-btn');
answerBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
        var currentStep = this.closest('.step');

        if (this.querySelector('input').checked) {
            this.querySelector('input').checked = false;
            this.querySelector('input').dispatchEvent(new Event('input'));
            this.querySelector('input').dispatchEvent(new Event('change'));
            this.classList.remove('active');
        } else {
            this.querySelector('input').checked = true;
            this.classList.add('active');

            this.querySelector('input').dispatchEvent(new Event('input'));
            this.querySelector('input').dispatchEvent(new Event('change'));
        }
    });
});

var answerBtns = document.querySelectorAll('.quiz-answers-type-number .answer-btn');
answerBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
        var currentStep = this.closest('.step');

        if (this.querySelector('input').checked) {
            this.querySelector('input').checked = false;
            this.classList.remove('active');
        } else {
            this.querySelector('input').checked = true;
            this.classList.add('active');
        }
        this.querySelector('input').dispatchEvent(new Event('input'));
        this.querySelector('input').dispatchEvent(new Event('change'));
        updateNextButtonState();
    });
});

var answerBtnsConsert = document.querySelectorAll('.answer-btn-consert');
answerBtnsConsert.forEach(function (btn) {
    btn.addEventListener('click', function () {
        var checkbox = this.querySelector('input[type="checkbox"]');

        if (checkbox.checked) {
            checkbox.checked = false;
            this.classList.remove('active');
        } else {
            checkbox.checked = true;
            this.classList.add('active');
            checkbox.classList.remove('error');
        }
        updateNextButtonState();
    });
});

var tooltipButtons = document.querySelectorAll('.tooltip-btn');
tooltipButtons.forEach(function (button) {
    event.stopPropagation();
    button.addEventListener('click', function () {
        var questionIndex = button.getAttribute('data-question');
        var tooltipText = document.querySelector('.tooltip-text-' + questionIndex);

        if (tooltipText.style.display === 'block') {
            tooltipText.style.display = 'none';
        } else {
            tooltipText.style.display = 'block';
        }
    });
});

$('#state_select').on("select2:select", function(e) {
    var selectedState = e.params.data.text;
    var currentQuestion = steps[currentStep];
    var isAttention = checkAttentionRequired(currentQuestion);
    var isActualState = checkStateInActualStates(selectedState);
    updateNextButtonState();
    if (isActualState && isAttention) {}
});

function checkStateInActualStates(selectedState) {
    return ActualStates.includes(selectedState);
}


window.onload = function () {
    updateNextButtonState();

    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            //console.log('input event triggered');
            updateNextButtonState();
        });
        input.addEventListener('change', function() {
            //console.log('change event triggered');
            updateNextButtonState();
        });
        input.addEventListener('keyup', function() {
            //console.log('change event triggered');
            updateNextButtonState();
        });
    });

    var answerBtns = document.querySelectorAll('.quiz-answers-type-radio .answer-btn', '.quiz-answers-type-number .answer-btn');
    answerBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            updateNextButtonState();
            handleRadioClick(this);
        });
    });
};

function handleRadioClick(selectedRadioBtn) {
    var currentStep = selectedRadioBtn.closest('.step');
    var allAnswerBtns = currentStep.querySelectorAll('.quiz-answers-type-radio .answer-btn');

    allAnswerBtns.forEach(function (btn) {
        btn.classList.remove('active');
        btn.querySelector('input').checked = false;
    });

    selectedRadioBtn.classList.add('active');
    selectedRadioBtn.querySelector('input').checked = true;

    selectedRadioBtn.querySelector('input').dispatchEvent(new Event('input'));
    selectedRadioBtn.querySelector('input').dispatchEvent(new Event('change'));
    selectedRadioBtn.querySelector('input').dispatchEvent(new Event('keyup'));
}

function updateNextButtonState() {
    const nextButton = document.getElementById('nextStep');
    const fieldsFilled = validateCurrentStep(steps[currentStep]);
    const selectElement = steps[currentStep].querySelector('select');
    const remember = steps[currentStep].querySelector('#remember');

    const numberStep = steps[currentStep].querySelector('quiz-answers-type-number');

    if (numberStep) {
        const numInput1 = numberStep.querySelector('.topnumber');
        const numInput2 = numberStep.querySelector('.bottomnumber');

        if (numInput1.value !== '' && numInput12.value !== '') {
            nextButton.removeAttribute('disabled');
        } else {
            nextButton.setAttribute('disabled', 'disabled');
        }
    }

    if (remember) {
        if (remember.checked) {
            nextButton.removeAttribute('disabled');
        } else {
            nextButton.setAttribute('disabled', 'disabled');
        }
    }

    if (selectElement) {
        const selectedValue = selectElement.value;
        const isSelectValid = selectedValue !== '';
        const isButtonEnabled = isSelectValid && fieldsFilled;
        if (isButtonEnabled) {
            nextButton.removeAttribute('disabled');
        } else {
            nextButton.setAttribute('disabled', 'disabled');
        }
    } else {
        if (fieldsFilled) {
            nextButton.removeAttribute('disabled');
        } else {
            nextButton.setAttribute('disabled', 'disabled');
        }
    }

}


function updatePagination(currentStep) {
    const steps = document.querySelectorAll('.pagination-step');
    steps.forEach((step, index) => {
        step.classList.remove('step-current', 'step-checked');
        if (index < currentStep+1) {
            step.classList.add('step-checked');
        } else if (index === currentStep+1) {
            step.classList.add('step-current');
        }
    });
}



/*
const programsMapping = {
    "0": { // Question 1: What is your current level of education?
        "0": [ // Currently in high school
            "Fashion Summer Camp",
            "My Portfolio Experience | Fashion Design and Illustration",
            "My Portfolio Experience | Fashion Styling and Business",
            "My Atelier Experience",
            "Associate of Applied Science in Fashion Design",
            "Associate of Applied Science in Fashion Styling",
            "Associate of Applied Science in Fashion Business",
            "Associate of Applied Science in Kitchen and Bath Design",
            "Bachelor of Fine Arts in Fashion Design",
            "Bachelor of Fine Arts in Fashion Styling",
            "Bachelor of Science in Fashion Business",
            "Bachelor of Fine Arts in Interior Design",
            "One-Year Vocational Program in Fashion Design",
            "One-Year Vocational Program in Fashion Styling",
            "One-Year Vocational Program in Fashion Business",
            "One-Year Vocational Program in Interior Design"
        ],
        "1": [ // High school or equivalent
            "One-Year Vocational Program in Fashion Design",
            "One-Year Vocational Program in Fashion Styling",
            "One-Year Vocational Program in Fashion Business",
            "One-Year Vocational Program in Interior Design",
            "My Portfolio Experience | Fashion Design and Illustration",
            "My Portfolio Experience | Fashion Styling and Business"
        ],
        "2": [ // Some college
            "Associate of Applied Science in Fashion Design",
            "Associate of Applied Science in Fashion Styling",
            "Associate of Applied Science in Fashion Business",
            "Associate of Applied Science in Kitchen and Bath Design",
            "Bachelor of Fine Arts in Fashion Design",
            "Bachelor of Fine Arts in Fashion Styling",
            "Bachelor of Science in Fashion Business",
            "Bachelor of Fine Arts in Interior Design",
            "One-Year Vocational Program in Fashion Design",
            "One-Year Vocational Program in Fashion Styling",
            "One-Year Vocational Program in Fashion Business",
            "One-Year Vocational Program in Interior Design"
        ],
        "3": [ // Associate degree
            "Bachelor of Fine Arts in Fashion Design",
            "Bachelor of Fine Arts in Fashion Styling",
            "Bachelor of Science in Fashion Business",
            "Bachelor of Fine Arts in Interior Design",
            "One-Year Vocational Program in Fashion Design",
            "One-Year Vocational Program in Fashion Styling",
            "One-Year Vocational Program in Fashion Business",
            "One-Year Vocational Program in Interior Design"
        ],
        "4": [ // Bachelor's degree or higher
            "Master of Arts in Fashion Luxury and Brand Management",
            "Master of Arts in Fashion Design",
            "Master of Fine Arts in Interior Design",
            "Master of Arts in Digital Communications and Social Media Strategy",
            "One-Year Vocational Program in Fashion Design",
            "One-Year Vocational Program in Fashion Styling",
            "One-Year Vocational Program in Fashion Business",
            "One-Year Vocational Program in Interior Design"
        ]
    },
    "1": { // Question 2: What is your primary area of interest?
        "0": [ // Fashion Design
            "Associate of Applied Science in Fashion Design",
            "Bachelor of Fine Arts in Fashion Design",
            "One-Year Vocational Program in Fashion Design",
            "Master of Arts in Fashion Design"
        ],
        "1": [ // Fashion Styling
            "Associate of Applied Science in Fashion Styling",
            "Bachelor of Fine Arts in Fashion Styling",
            "One-Year Vocational Program in Fashion Styling",
            "My Portfolio Experience | Fashion Styling and Business"
        ],
        "2": [ // Fashion Business
            "Associate of Applied Science in Fashion Business",
            "Bachelor of Science in Fashion Business",
            "One-Year Vocational Program in Fashion Business",
            "Master of Arts in Digital Communications and Social Media Strategy",
            "Master of Arts in Fashion Luxury and Brand Management"
        ],
        "3": [ // Interior Design
            "Associate of Applied Science in Kitchen and Bath Design",
            "Bachelor of Fine Arts in Interior Design",
            "One-Year Vocational Program in Interior Design",
            "Master of Fine Arts in Interior Design"
        ]
    },
    "2": { // Question 3: What is your career goal?
        "0": [ // To start my own fashion line and create original designs
            "My Atelier Experience",
            "My Portfolio Experience | Fashion Design and Illustration",
            "Associate of Applied Science in Fashion Design",
            "Bachelor of Fine Arts in Fashion Design",
            "Master of Arts in Fashion Design"
        ],
        "1": [ // To become a renowned fashion stylist
            "My Atelier Experience",
            "My Portfolio Experience | Fashion Styling and Business",
            "Associate of Applied Science in Fashion Styling",
            "Bachelor of Fine Arts in Fashion Styling"
        ],
        "2": [ // To manage and grow a fashion business
            "Associate of Applied Science in Fashion Business",
            "Bachelor of Science in Fashion Business",
            "Master of Arts in Digital Communications and Social Media Strategy",
            "Master of Arts in Fashion Luxury and Brand Management"
        ],
        "3": [ // To design and create interior spaces
            "Associate of Applied Science in Kitchen and Bath Design",
            "Bachelor of Fine Arts in Interior Design",
            "Master of Fine Arts in Interior Design"
        ]
    },
    "3": { // Question 4: How much time are you willing to dedicate to your education?
        "0": [ // One year or less
            "My Atelier Experience",
            "My Portfolio Experience | Fashion Design and Illustration",
            "My Portfolio Experience | Fashion Styling and Business",
            "Fashion Summer Camp",
            "One-Year Vocational Program in Fashion Design",
            "One-Year Vocational Program in Fashion Styling",
            "One-Year Vocational Program in Fashion Business",
            "One-Year Vocational Program in Interior Design"
        ],
        "1": [ // Two years
            "Associate of Applied Science in Fashion Design",
            "Associate of Applied Science in Fashion Styling",
            "Associate of Applied Science in Fashion Business",
            "Associate of Applied Science in Kitchen and Bath Design",
            "One-Year Vocational Program in Fashion Design",
            "One-Year Vocational Program in Fashion Styling",
            "One-Year Vocational Program in Fashion Business",
            "One-Year Vocational Program in Interior Design"
        ],
        "2": [ // Four years
            "Bachelor of Fine Arts in Fashion Design",
            "Bachelor of Fine Arts in Fashion Styling",
            "Bachelor of Science in Fashion Business",
            "Bachelor of Fine Arts in Interior Design",
            "Master of Arts in Fashion Luxury and Brand Management",
            "Master of Arts in Digital Communications and Social Media Strategy",
            "Master of Arts in Fashion Design",
            "Master of Fine Arts in Interior Design"
        ]
    },
    "4": { // Question 5: Which learning experience interests you the most?
        "0": [ // Short-term immersive experiences
            "Fashion Summer Camp",
            "My Portfolio Experience | Fashion Design and Illustration",
            "My Portfolio Experience | Fashion Styling and Business",
            "My Atelier Experience"
        ],
        "1": [ // Hands-on vocational training
            "One-Year Vocational Program in Fashion Design",
            "One-Year Vocational Program in Fashion Styling",
            "One-Year Vocational Program in Fashion Business",
            "One-Year Vocational Program in Interior Design"
        ],
        "2": [ // Comprehensive degree programs
            "Associate of Applied Science in Fashion Design",
            "Associate of Applied Science in Fashion Styling",
            "Associate of Applied Science in Fashion Business",
            "Associate of Applied Science in Kitchen and Bath Design",
            "Bachelor of Fine Arts in Fashion Design",
            "Bachelor of Fine Arts in Fashion Styling",
            "Bachelor of Science in Fashion Business",
            "Bachelor of Fine Arts in Interior Design"
        ],
        "3": [ // Advanced specialized studies
            "Master of Arts in Fashion Luxury and Brand Management",
            "Master of Arts in Digital Communications and Social Media Strategy",
            "Master of Arts in Fashion Design",
            "Master of Fine Arts in Interior Design"
        ]
    }
};
*/

const programsMapping = {
    "0": { // Question 1: What is your current level of education?
        "0": [
            { name: "Fashion Summer Camp", link: "https://example.com/fashion-summer-camp" },
            { name: "My Portfolio Experience | Fashion Design and Illustration", link: "https://example.com/portfolio-design" },
            { name: "My Portfolio Experience | Fashion Styling and Business", link: "https://example.com/portfolio-styling" },
            { name: "My Atelier Experience", link: "https://example.com/atelier-experience" },
            { name: "Associate of Applied Science in Fashion Design", link: "https://example.com/aas-fashion-design" },
            { name: "Associate of Applied Science in Fashion Styling", link: "https://example.com/aas-fashion-styling" },
            { name: "Associate of Applied Science in Fashion Business", link: "https://example.com/aas-fashion-business" },
            { name: "Associate of Applied Science in Kitchen and Bath Design", link: "https://example.com/aas-kitchen-bath" },
            { name: "Bachelor of Fine Arts in Fashion Design", link: "https://example.com/bfa-fashion-design" },
            { name: "Bachelor of Fine Arts in Fashion Styling", link: "https://example.com/bfa-fashion-styling" },
            { name: "Bachelor of Science in Fashion Business", link: "https://example.com/bs-fashion-business" },
            { name: "Bachelor of Fine Arts in Interior Design", link: "https://example.com/bfa-interior-design" },
            { name: "One-Year Vocational Program in Fashion Design", link: "https://example.com/one-year-fashion-design" },
            { name: "One-Year Vocational Program in Fashion Styling", link: "https://example.com/one-year-fashion-styling" },
            { name: "One-Year Vocational Program in Fashion Business", link: "https://example.com/one-year-fashion-business" },
            { name: "One-Year Vocational Program in Interior Design", link: "https://example.com/one-year-interior-design" }
        ],
        "1": [
            { name: "One-Year Vocational Program in Fashion Design", link: "https://example.com/one-year-fashion-design" },
            { name: "One-Year Vocational Program in Fashion Styling", link: "https://example.com/one-year-fashion-styling" },
            { name: "One-Year Vocational Program in Fashion Business", link: "https://example.com/one-year-fashion-business" },
            { name: "One-Year Vocational Program in Interior Design", link: "https://example.com/one-year-interior-design" },
            { name: "My Portfolio Experience | Fashion Design and Illustration", link: "https://example.com/portfolio-design" },
            { name: "My Portfolio Experience | Fashion Styling and Business", link: "https://example.com/portfolio-styling" }
        ],
        "2": [
            { name: "Associate of Applied Science in Fashion Design", link: "https://example.com/aas-fashion-design" },
            { name: "Associate of Applied Science in Fashion Styling", link: "https://example.com/aas-fashion-styling" },
            { name: "Associate of Applied Science in Fashion Business", link: "https://example.com/aas-fashion-business" },
            { name: "Associate of Applied Science in Kitchen and Bath Design", link: "https://example.com/aas-kitchen-bath" },
            { name: "Bachelor of Fine Arts in Fashion Design", link: "https://example.com/bfa-fashion-design" },
            { name: "Bachelor of Fine Arts in Fashion Styling", link: "https://example.com/bfa-fashion-styling" },
            { name: "Bachelor of Science in Fashion Business", link: "https://example.com/bs-fashion-business" },
            { name: "Bachelor of Fine Arts in Interior Design", link: "https://example.com/bfa-interior-design" },
            { name: "One-Year Vocational Program in Fashion Design", link: "https://example.com/one-year-fashion-design" },
            { name: "One-Year Vocational Program in Fashion Styling", link: "https://example.com/one-year-fashion-styling" },
            { name: "One-Year Vocational Program in Fashion Business", link: "https://example.com/one-year-fashion-business" },
            { name: "One-Year Vocational Program in Interior Design", link: "https://example.com/one-year-interior-design" }
        ],
        "3": [
            { name: "Bachelor of Fine Arts in Fashion Design", link: "https://example.com/bfa-fashion-design" },
            { name: "Bachelor of Fine Arts in Fashion Styling", link: "https://example.com/bfa-fashion-styling" },
            { name: "Bachelor of Science in Fashion Business", link: "https://example.com/bs-fashion-business" },
            { name: "Bachelor of Fine Arts in Interior Design", link: "https://example.com/bfa-interior-design" },
            { name: "One-Year Vocational Program in Fashion Design", link: "https://example.com/one-year-fashion-design" },
            { name: "One-Year Vocational Program in Fashion Styling", link: "https://example.com/one-year-fashion-styling" },
            { name: "One-Year Vocational Program in Fashion Business", link: "https://example.com/one-year-fashion-business" },
            { name: "One-Year Vocational Program in Interior Design", link: "https://example.com/one-year-interior-design" }
        ],
        "4": [
            { name: "Master of Arts in Fashion Luxury and Brand Management", link: "https://example.com/ma-fashion-luxury" },
            { name: "Master of Arts in Fashion Design", link: "https://example.com/ma-fashion-design" },
            { name: "Master of Fine Arts in Interior Design", link: "https://example.com/mfa-interior-design" },
            { name: "Master of Arts in Digital Communications and Social Media Strategy", link: "https://example.com/ma-digital-communications" },
            { name: "One-Year Vocational Program in Fashion Design", link: "https://example.com/one-year-fashion-design" },
            { name: "One-Year Vocational Program in Fashion Styling", link: "https://example.com/one-year-fashion-styling" },
            { name: "One-Year Vocational Program in Fashion Business", link: "https://example.com/one-year-fashion-business" },
            { name: "One-Year Vocational Program in Interior Design", link: "https://example.com/one-year-interior-design" }
        ]
    },
    "1": { // Question 2: What is your primary area of interest?
        "0": [
            { name: "One-Year Vocational Program in Fashion Design", link: "https://example.com/one-year-fashion-design" },
            { name: "My Atelier Experience", link: "https://example.com/atelier-experience" },
            { name: "My Portfolio Experience | Fashion Design and Illustration", link: "https://example.com/portfolio-design" },
            { name: "Associate of Applied Science in Fashion Design", link: "https://example.com/aas-fashion-design" },
            { name: "Bachelor of Fine Arts in Fashion Design", link: "https://example.com/bfa-fashion-design" },
            { name: "Master of Arts in Fashion Design", link: "https://example.com/ma-fashion-design" }
        ],
        "1": [
            { name: "One-Year Vocational Program in Fashion Styling", link: "https://example.com/one-year-fashion-styling" },
            { name: "My Atelier Experience", link: "https://example.com/atelier-experience" },
            { name: "My Portfolio Experience | Fashion Styling and Business", link: "https://example.com/portfolio-styling" },
            { name: "Associate of Applied Science in Fashion Styling", link: "https://example.com/aas-fashion-styling" },
            { name: "Bachelor of Fine Arts in Fashion Styling", link: "https://example.com/bfa-fashion-styling" }
        ],
        "2": [
            { name: "One-Year Vocational Program in Fashion Business", link: "https://example.com/one-year-fashion-business" },
            { name: "Associate of Applied Science in Fashion Business", link: "https://example.com/aas-fashion-business" },
            { name: "Bachelor of Science in Fashion Business", link: "https://example.com/bs-fashion-business" },
            { name: "Master of Arts in Digital Communications and Social Media Strategy", link: "https://example.com/ma-digital-communications" },
            { name: "Master of Arts in Fashion Luxury and Brand Management", link: "https://example.com/ma-fashion-luxury" }
        ],
        "3": [
            { name: "One-Year Vocational Program in Interior Design", link: "https://example.com/one-year-interior-design" },
            { name: "Associate of Applied Science in Kitchen and Bath Design", link: "https://example.com/aas-kitchen-bath" },
            { name: "Bachelor of Fine Arts in Interior Design", link: "https://example.com/bfa-interior-design" },
            { name: "Master of Fine Arts in Interior Design", link: "https://example.com/mfa-interior-design" }
        ]
    },
    "2": { // Question 3: What is your career goal?
        "0": [
            { name: "One-Year Vocational Program in Fashion Design", link: "https://example.com/one-year-fashion-design" },
            { name: "My Atelier Experience", link: "https://example.com/atelier-experience" },
            { name: "My Portfolio Experience | Fashion Design and Illustration", link: "https://example.com/portfolio-design" },
            { name: "Associate of Applied Science in Fashion Design", link: "https://example.com/aas-fashion-design" },
            { name: "Bachelor of Fine Arts in Fashion Design", link: "https://example.com/bfa-fashion-design" },
            { name: "Master of Arts in Fashion Design", link: "https://example.com/ma-fashion-design" }
        ],
        "1": [
            { name: "One-Year Vocational Program in Fashion Styling", link: "https://example.com/one-year-fashion-styling" },
            { name: "My Atelier Experience", link: "https://example.com/atelier-experience" },
            { name: "My Portfolio Experience | Fashion Styling and Business", link: "https://example.com/portfolio-styling" },
            { name: "Associate of Applied Science in Fashion Styling", link: "https://example.com/aas-fashion-styling" },
            { name: "Bachelor of Fine Arts in Fashion Styling", link: "https://example.com/bfa-fashion-styling" }
        ],
        "2": [
            { name: "One-Year Vocational Program in Fashion Business", link: "https://example.com/one-year-fashion-business" },
            { name: "Associate of Applied Science in Fashion Business", link: "https://example.com/aas-fashion-business" },
            { name: "Bachelor of Science in Fashion Business", link: "https://example.com/bs-fashion-business" },
            { name: "Master of Arts in Digital Communications and Social Media Strategy", link: "https://example.com/ma-digital-communications" },
            { name: "Master of Arts in Fashion Luxury and Brand Management", link: "https://example.com/ma-fashion-luxury" }
        ],
        "3": [
            { name: "One-Year Vocational Program in Interior Design", link: "https://example.com/one-year-interior-design" },
            { name: "Associate of Applied Science in Kitchen and Bath Design", link: "https://example.com/aas-kitchen-bath" },
            { name: "Bachelor of Fine Arts in Interior Design", link: "https://example.com/bfa-interior-design" },
            { name: "Master of Fine Arts in Interior Design", link: "https://example.com/mfa-interior-design" }
        ]
    },
    "3": { // Question 4: How much time are you willing to dedicate to your education?
        "0": [
            { name: "My Atelier Experience", link: "https://example.com/atelier-experience" },
            { name: "My Portfolio Experience | Fashion Design and Illustration", link: "https://example.com/portfolio-design" },
            { name: "My Portfolio Experience | Fashion Styling and Business", link: "https://example.com/portfolio-styling" },
            { name: "Fashion Summer Camp", link: "https://example.com/fashion-summer-camp" },
            { name: "One-Year Vocational Program in Fashion Design", link: "https://example.com/one-year-fashion-design" },
            { name: "One-Year Vocational Program in Fashion Styling", link: "https://example.com/one-year-fashion-styling" },
            { name: "One-Year Vocational Program in Fashion Business", link: "https://example.com/one-year-fashion-business" },
            { name: "One-Year Vocational Program in Interior Design", link: "https://example.com/one-year-interior-design" }
        ],
        "1": [
            { name: "Associate of Applied Science in Fashion Design", link: "https://example.com/aas-fashion-design" },
            { name: "Associate of Applied Science in Fashion Styling", link: "https://example.com/aas-fashion-styling" },
            { name: "Associate of Applied Science in Fashion Business", link: "https://example.com/aas-fashion-business" },
            { name: "Associate of Applied Science in Kitchen and Bath Design", link: "https://example.com/aas-kitchen-bath" },
            { name: "One-Year Vocational Program in Fashion Design", link: "https://example.com/one-year-fashion-design" },
            { name: "One-Year Vocational Program in Fashion Styling", link: "https://example.com/one-year-fashion-styling" },
            { name: "One-Year Vocational Program in Fashion Business", link: "https://example.com/one-year-fashion-business" },
            { name: "One-Year Vocational Program in Interior Design", link: "https://example.com/one-year-interior-design" }
        ],
        "2": [
            { name: "Bachelor of Fine Arts in Fashion Design", link: "https://example.com/bfa-fashion-design" },
            { name: "Bachelor of Fine Arts in Fashion Styling", link: "https://example.com/bfa-fashion-styling" },
            { name: "Bachelor of Science in Fashion Business", link: "https://example.com/bs-fashion-business" },
            { name: "Bachelor of Fine Arts in Interior Design", link: "https://example.com/bfa-interior-design" },
            { name: "Master of Arts in Fashion Luxury and Brand Management", link: "https://example.com/ma-fashion-luxury" },
            { name: "Master of Arts in Digital Communications and Social Media Strategy", link: "https://example.com/ma-digital-communications" },
            { name: "Master of Arts in Fashion Design", link: "https://example.com/ma-fashion-design" },
            { name: "Master of Fine Arts in Interior Design", link: "https://example.com/mfa-interior-design" }
        ]
    },
    "4": { // Question 5: Which learning experience interests you the most?
        "0": [
            { name: "Fashion Summer Camp", link: "https://example.com/fashion-summer-camp" },
            { name: "My Portfolio Experience | Fashion Design and Illustration", link: "https://example.com/portfolio-design" },
            { name: "My Portfolio Experience | Fashion Styling and Business", link: "https://example.com/portfolio-styling" },
            { name: "My Atelier Experience", link: "https://example.com/atelier-experience" }
        ],
        "1": [
            { name: "One-Year Vocational Program in Fashion Design", link: "https://example.com/one-year-fashion-design" },
            { name: "One-Year Vocational Program in Fashion Styling", link: "https://example.com/one-year-fashion-styling" },
            { name: "One-Year Vocational Program in Fashion Business", link: "https://example.com/one-year-fashion-business" },
            { name: "One-Year Vocational Program in Interior Design", link: "https://example.com/one-year-interior-design" }
        ],
        "2": [
            { name: "Associate of Applied Science in Fashion Design", link: "https://example.com/aas-fashion-design" },
            { name: "Associate of Applied Science in Fashion Styling", link: "https://example.com/aas-fashion-styling" },
            { name: "Associate of Applied Science in Fashion Business", link: "https://example.com/aas-fashion-business" },
            { name: "Associate of Applied Science in Kitchen and Bath Design", link: "https://example.com/aas-kitchen-bath" },
            { name: "Bachelor of Fine Arts in Fashion Design", link: "https://example.com/bfa-fashion-design" },
            { name: "Bachelor of Fine Arts in Fashion Styling", link: "https://example.com/bfa-fashion-styling" },
            { name: "Bachelor of Science in Fashion Business", link: "https://example.com/bs-fashion-business" },
            { name: "Bachelor of Fine Arts in Interior Design", link: "https://example.com/bfa-interior-design" }
        ],
        "3": [
            { name: "Master of Arts in Fashion Luxury and Brand Management", link: "https://example.com/ma-fashion-luxury" },
            { name: "Master of Arts in Digital Communications and Social Media Strategy", link: "https://example.com/ma-digital-communications" },
            { name: "Master of Arts in Fashion Design", link: "https://example.com/ma-fashion-design" },
            { name: "Master of Fine Arts in Interior Design", link: "https://example.com/mfa-interior-design" }
        ]
    }
};

function getIntersectingPrograms() {
    let intersectingPrograms = null;

    savedData.forEach(data => {
        const questionIndex = data.questionIndex;
        const answers = data.answers;
        let currentPrograms = [];

        answers.forEach(answer => {
            const answerIndex = Object.keys(answer.text)[0];
            const relatedPrograms = programsMapping[questionIndex]?.[answerIndex];

            if (relatedPrograms) {
                currentPrograms = [...new Set([...currentPrograms, ...relatedPrograms])];
            }
        });

        if (intersectingPrograms === null) {
            intersectingPrograms = currentPrograms;
        } else {
            intersectingPrograms = intersectingPrograms.filter(program =>
                currentPrograms.some(p => p.name === program.name)
            );
        }
    });

    return intersectingPrograms || [];
}

function displayProgramsList() {
    const programs = getIntersectingPrograms();

    const programsListContainer = document.getElementById('programs-list-container');
    programsListContainer.innerHTML = '';

    if (programs.length > 0) {
        const ul = document.createElement('ul');
        programs.forEach(program => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.textContent = program.name;
            a.href = program.link;
            a.target = "_blank";
            li.appendChild(a);
            ul.appendChild(li);
        });
        programsListContainer.appendChild(ul);
    } else {
        programsListContainer.textContent = 'No matching programs found.';
    }
}

function submitQuizData() {
    const formData = new FormData();
    formData.append('savedData', JSON.stringify(savedData));
    formData.append('programs', JSON.stringify(window.programs));


    fetch('quiz.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            displayResults(data);
        })
        .catch(error => {
            console.error('Ошибка:', error);
        });
}