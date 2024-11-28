var questionnaireData = {
    "questions": [
        {
            "index": 0,
            "title": "What is your current level of education?",
            "type": "radio",
            "subquestion": "a",
            "answers": [
                { "0": "Currently in high school" },
                { "1": "High school or equivalent" },
                { "2": "Some college" },
                { "3": "Associate degree" },
                { "4": "Bachelor's degree or higher" }
            ],
            "tooltip": [
                { "0": "It’s never too early to start exploring your passion! We have programs tailored to help young talents like you get started on the right path." },
                { "1": "Starting early is the best way to build a strong foundation! We have programs designed to get you industry-ready in no time." },
                { "2": "You’re on the right track! We can help you take the next step and turn your passion into a professional career." },
                { "3": "Great work! Now it’s time to specialize and gain the skills needed to excel in the fashion and design industry." },
                { "4": "You’re already ahead! Our advanced programs can help you further refine your skills and gain the industry connections needed for success." },
            ],
            "next_questions": [ 1 ],
            "attention_required": [],
            "image" : [
                {
                    "src" = "",
                    "alt" = "",

                }
            ],
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
            "tooltip": [
                { "0": "Great choice! Did you know that some of the most iconic fashion houses started with designers who honed their skills just like you are about to?" },
                { "1": "Excellent! Fashion styling is becoming a multi-billion-dollar industry, and the demand for creative stylists is only growing. You’re on the right path!" },
                { "2": "Smart move! The global fashion business market is expected to grow exponentially—this is your chance to shape the future of fashion management." },
                { "3": "Fantastic choice! Miami’s interior design scene is booming, offering endless opportunities for creative minds like yours to shine." },
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
            "tooltip": [
                { "0": "Ambitious and inspiring! Many successful designers started just like you, turning their ideas into globally recognized brands." },
                { "1": "Amazing! Did you know that top fashion stylists often start with editorial shoots and celebrity styling, and their careers take off from there?" },
                { "2": "Perfect fit! With the right skills, you could be managing the next big fashion label or retail empire." },
                { "3": "Love that goal! Interior design is a field where creativity meets impact—your designs could transform spaces and lives." },
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
            "tooltip": [
                { "0": "Fast and focused—just like the industry! Our short-term programs are designed to get you career-ready in no time." },
                { "1": "A solid commitment! You’ll gain practical experience and deep knowledge that will set you up for long-term success." },
                { "2": "Perfect choice for building a comprehensive foundation in fashion and design—this will prepare you for any path you choose!" }
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
            "tooltip": [
                { "0": "Exciting choice! Short-term programs offer you the chance to dive deep into the world of fashion and design, all while building valuable skills quickly." },
                { "1": "Hands-on experience is key! This option will give you real-world practice, so you can develop your skills while learning directly from industry professionals." },
                { "2": "Great decision! A comprehensive degree will give you the academic and practical foundation needed to excel in any career path you choose." },
                { "3": "Fantastic! Specializing in your field allows you to master your craft and stand out as an expert in the industry." },
            ],
            "next_questions": [ 5 ],
            "attention_required": [],
            "hint": ""
        },
        {
            "index": 5,
            "title": "Contact information",
            "type": "form",
            "subquestion": "a",
            "answers": [
            ],
            "next_questions": [ 6 ],
            "attention_required": [],
            "hint": ""
        },
        {
            "index": 6,
            "title": "Congratulations!\n" +
                "Based on your answers, we’ve found the perfect program for you at Istituto Marangoni Miami.",
            "type": "final",
            "subquestion": "a",
            "answers": [
            ],
            "next_questions": [ 7 ],
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
    } else if (question.type === 'form') {
        var formInputs = document.querySelectorAll('.step.step-index-' + questionIndex + ' .form-inputs input, .step.step-index-' + questionIndex + ' .form-inputs textarea');

        formInputs.forEach(function(input) {
            var inputName = input.name;
            var inputValue = input.value.trim();

            if (inputValue) {
                answers.push({
                    name: inputName,
                    value: inputValue
                });

                localStorage.setItem(inputName, inputValue);
            }
        });

        var contactRadio = document.querySelectorAll('.step.step-index-' + questionIndex + ' .form-contact input[type="radio"]:checked');
        contactRadio.forEach(function(radio) {
            var radioValue = radio.value;
            answers.push({
                contactMethod: radioValue
            });

            localStorage.setItem("preferredContact", radioValue);
        });
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