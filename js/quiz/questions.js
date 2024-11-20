var questionnaireData = {
    "questions": [
        {
            "index": 0,
            "title": "What is your current level of education?",
            "type": "radio",
            "subquestion": "a",
            "answers": [
                { "0": "High school or equivalent" },
                { "1": "Some college" },
                { "2": "Associate degree" },
                { "3": "Bachelor's degree or higher" }
            ],
            "tooltip": [],
            "next_questions": [ 1 ],
            "attention_required": [],
            "hint": ""
        },
        {
            "index": 1,
            "title": "What is your primary area of interest?",
            "type": "radio",
            "subquestion": "a",
            "answers": [
                { "0": "Fashion Design" },
                { "1": "Fashion Styling" },
                { "2": "Fashion Business" },
                { "3": "Interior Design" }
            ],
            "next_questions": [ 2 ],
            "attention_required": [],
            "hint": ""
        },
        {
            "index": 2,
            "title": "What is your career goal?",
            "type": "radio",
            "subquestion": "a",
            "answers": [
                { "0": "To start my own fashion line and create original designs" },
                { "1": "To become a renowned fashion stylist for editorial and personal clients" },
                { "2": "To manage and grow a successful fashion business or retail brand" },
                { "3": "To design and create innovative interior spaces for residential or commercial clients" }
            ],
            "next_questions": [ 3 ],
            "attention_required": [],
            "hint": ""
        },
        {
            "index": 3,
            "title": "How much time are you willing to dedicate to your education?",
            "type": "radio",
            "subquestion": "a",
            "answers": [
                { "0": "One year or less" },
                { "1": "Two years" },
                { "2": "Four years" }
            ],
            "next_questions": [ 4 ],
            "attention_required": [],
            "hint": ""
        },
        {
            "index": 4,
            "title": "Which learning experience interests you the most?",
            "type": "radio",
            "subquestion": "a",
            "answers": [
                { "0": "Short-term immersive experiences" },
                { "1": "Hands-on vocational training" },
                { "2": "Comprehensive degree programs" },
                { "3": "Advanced specialized studies" }
            ],
            "next_questions": [ 5 ],
            "attention_required": [],
            "hint": ""
        },

    ]
}

var newQuestionnaireData = generateNewQuestionnaireData();

function generateNewQuestionnaireData() {
    var newQuestionnaireData = { "questions": [] };
    var stepCounter = 1;

    for (var i = 0; i < questionnaireData.questions.length; i++) {
        var question = questionnaireData.questions[i];
        var newQuestion = { ...question };

        if (!question.is_subquestion) {
            newQuestion.step = stepCounter;
            stepCounter++;
        } else {
            newQuestion.step = stepCounter-1;
        }

        newQuestionnaireData.questions.push(newQuestion);
    }

    return newQuestionnaireData;
}


var savedData = [];
function saveQuestionData(questionIndex) {
    var question = questionnaireData.questions[questionIndex];
    var questionTitle = question.title;
    var answers = [];

    if (question.type === 'radio' || question.type === 'checkbox') {
        var answerInputs = document.querySelectorAll('input[name="question_' + questionIndex + '"]');
        answerInputs.forEach(function(input, index) {
            if (input.checked) {
                var answerIndex = index;
                var answerText = question.answers[answerIndex];
                answers.push({
                    text: answerText
                });
            }
        });

    } else if (question.type === 'slider') {
        var answerInputs = document.querySelector('input[name="question_' + questionIndex + '"]');
        var answerValue = answerInputs.value;
        answers.push({
            text: answerValue
        });

    } else if (question.type === 'select') {
        var answerSelects = document.querySelectorAll('select[name="question_' + questionIndex + '"]');
        answerSelects.forEach(function(input, index) {
            var answerText = input.value;
            answers.push({
                text: answerText
            });
            localStorage.setItem("userState", answerText);
        });

    } else if (question.type === 'birth') {
        var answerInputs = document.querySelectorAll('input[name="date_' + questionIndex + '"]');
        answerInputs.forEach(function(input, index) {
            var answerIndex = index;
            var answerText = input.value;
            answers.push({
                text: answerText
            });

            localStorage.setItem("userBirth", answerText);
        });

    } else if (question.type === 'contacts') {
        var phoneInput = document.querySelector('input[name="phone_' + questionIndex + '"]');
        var emailInput = document.querySelector('input[name="email_' + questionIndex + '"]');

        var phoneValue = phoneInput.value;
        var emailValue = emailInput.value;

        if (phoneValue.trim() !== '') {
            answers.push({
                phone: phoneValue
            });
        }

        if (emailValue.trim() !== '') {
            answers.push({
                email: emailValue
            });

            localStorage.setItem("userEmail", emailValue);
            localStorage.setItem("userPhone", phoneValue);
        }

    } else if (question.type === 'textarea') {
        var answerTextarea = document.querySelector('textarea[name="question_' + questionIndex + '"]');
        var textareaValue = answerTextarea.value;

        if (textareaValue.trim() !== '') {
            answers.push({
                text: textareaValue
            });
        }

    } else if (question.type === 'number') {
        var answerNumberMin = document.querySelector('input[name="min_' + questionIndex + '"]');
        var answerNumberMax = document.querySelector('input[name="max_' + questionIndex + '"]');

        var numberMinValue = answerNumberMin.value;
        var numberMaxValue = answerNumberMax.value;

        if (numberMinValue.trim() !== '') {
            answers.push({
                min: numberMinValue
            });
        }

        if (numberMaxValue.trim() !== '') {
            answers.push({
                max: numberMaxValue
            });
        }

        var iDontRememberInput = document.querySelector('input[name="remember_' + questionIndex + '"]');
        if (iDontRememberInput.checked) {
            answers.push({
                dontRemember: true
            });
        }
    }

    var existingDataIndex = savedData.findIndex(function(data) {
        return data.questionIndex === questionIndex;
    });

    if (existingDataIndex !== -1) {
        savedData[existingDataIndex].questionTitle = questionTitle;
        savedData[existingDataIndex].answers = answers;
    } else {
        savedData.push({
            questionIndex: questionIndex,
            questionTitle: questionTitle,
            answers: answers
        });
    }

}


function sendDataToServer(data) {
    console.log(data);
    /*
    var url = 'https://example.com/api/submit';
    var requestData = JSON.stringify(data);

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: requestData
    })
    .then(response => response.json())
    .then(data => {
            console.log('Response from the server:', data);
    })
    .catch(error => {
            console.error('Error while sending data to the server:', error);
    })*/
}