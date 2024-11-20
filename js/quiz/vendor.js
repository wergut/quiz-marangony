var icoQuestion = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
    '<path fill-rule="evenodd" clip-rule="evenodd" ' +
    'd="M8 0C12.415 0 16 3.585 16 8C16 12.415 12.415 16 8 16C3.585 16 0 12.415 0 8C0 3.585 3.585 0 8 0ZM8 2C11.312 2 14 4.688 14 8C14 11.312 11.312 14 8 14C4.688 14 2 11.312 2 8C2 4.688 4.688 2 8 2ZM7 11.0005C7 11.5516 7.44836 12 7.99951 12C8.55066 12 9 11.5516 9 11.0005C9 10.4493 8.55066 10 7.99951 10C7.44836 10 7 10.4493 7 11.0005ZM7.83518 4.00432C5.64167 4.10264 5 5.72745 5 6.42961C5 6.74146 5 7.33934 5.72046 7.41581C6.39945 7.48831 6.65757 7.05033 6.79233 6.67492C6.88666 6.41372 7.19039 5.69368 8.09952 5.69368C8.75052 5.69368 9.13614 6.06512 9.13614 6.61135C9.13614 7.70382 6.91983 7.70581 6.91983 9.3187C6.91983 9.86493 7.434 10 7.7481 10C7.96683 10 8.32446 9.99305 8.5235 9.61168C8.94748 8.79729 11 8.47451 11 6.46337C11 5.16929 9.78922 3.91692 7.83518 4.00432Z" fill="#B7B7B7"/>\n' +
    '</svg>';


var questionnaireContainer = document.getElementById('questionnaire-container');

newQuestionnaireData.questions.forEach(function(question, index) {
    var answerCount = question.answers.length;
    var questionHtml = document.createElement('div');
    questionHtml.classList.add('step');
    questionHtml.classList.add('step-index-' + index);
    questionHtml.classList.add('step-step-' + question.step);

    questionHtml.style.display = 'none';
    var fieldset = document.createElement('fieldset');
    fieldset.classList.add('inner');

    var legend = document.createElement('legend');
    legend.textContent = question.title;

    var p = document.createElement('p');
    p.textContent = question.hint;

    var answersDiv = document.createElement('div');
    answersDiv.classList.add('quiz-answers');
    answersDiv.classList.add('quiz-answers-type-' + question.type);
    answersDiv.classList.add('quiz-answers-' + answerCount);

    var answerLabel = document.createElement('div');
    answerLabel.classList.add('quiz-answer-label');
    answerLabel.classList.add('answer-btn');


    if (question.type === 'radio') {

        question.answers.forEach(function(answer, i) {
            var radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = 'question_' + index;
            radio.value = answer[i];

            var label = document.createElement('label');
            label.classList.add('quiz-answer-label-text');
            label.textContent = answer[i];

            var answerContainer = document.createElement('div');
            answerContainer.classList.add('quiz-answer-label');
            answerContainer.classList.add('answer-btn');
            answerContainer.appendChild(radio);
            answerContainer.appendChild(label);
            answersDiv.appendChild(answerContainer);
        });

        answerLabel.appendChild(answersDiv);

    } else if (question.type === 'checkbox') {

        question.answers.forEach(function(answer, i) {
            var radio = document.createElement('input');
            radio.type = 'checkbox';
            radio.name = 'question_' + index;
            radio.value = answer[i];

            var label = document.createElement('label');
            label.classList.add('quiz-answer-label-text');
            label.textContent = answer[i];

            var answerContainer = document.createElement('div');
            answerContainer.classList.add('quiz-answer-label');
            answerContainer.classList.add('answer-btn');
            answerContainer.appendChild(radio);
            answerContainer.appendChild(label);
            answersDiv.appendChild(answerContainer);

            if (question.tooltip && Array.isArray(question.tooltip)) {
                var tooltipObject = question.tooltip[i];
                if (tooltipObject) {
                    var tooltipText = Object.values(tooltipObject)[0];
                    tooltipText = createTooltipText(tooltipText, index);
                    var tooltip = createTooltipElement(index);
                    if (answerContainer && tooltipText !== undefined) {
                        answerContainer.appendChild(tooltip);
                        tooltip.appendChild(tooltipText);
                    }
                }
            }
        });

        answerLabel.appendChild(answersDiv);

    } else if (question.type === 'textarea') {

        var textarea = document.createElement('textarea');
        textarea.name = 'question_' + index;
        textarea.cols = '30';
        textarea.rows = '10';
        textarea.placeholder = 'Type something';
        textarea.value = '';

        answerLabel.appendChild(textarea);
        answersDiv.appendChild(answerLabel);

    } else if (question.type === 'slider') {


        var labelList = document.createElement('ul');
        labelList.classList.add('label-for-range');
        question.answers.forEach(function(answer) {
            for (var key in answer) {
                var text = answer[key];
                var li = document.createElement('li');
                li.textContent = text;
                labelList.appendChild(li);
            }
        });

        var sliderDiv = document.createElement('div');
        sliderDiv.id = 'slider_' + index;

        var hiddenInput = document.createElement('input');
        hiddenInput.type = 'hidden';
        hiddenInput.name = 'question_' + index;
        hiddenInput.classList.add('value-for-range_'+ index);

        answerLabel.appendChild(labelList);
        answerLabel.appendChild(sliderDiv);
        answerLabel.appendChild(hiddenInput);

        if (window.innerWidth > 768) {
            answersDiv.appendChild(answerLabel);
        }

        question.answers.forEach(function(answer, i) {
            var radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = 'question_' + index;
            radio.value = answer[i];

            var label = document.createElement('div');
            label.classList.add('quiz-answer-label-text');
            label.textContent = answer[i];

            var answerContainer = document.createElement('div');
            answerContainer.classList.add('quiz-answer-label');
            answerContainer.classList.add('answer-btn');
            answerContainer.classList.add('answer-btn-hidden-pc');
            answerContainer.appendChild(radio);
            answerContainer.appendChild(label);
            if (window.innerWidth < 768) {
                answersDiv.appendChild(answerContainer);
            }
        });

    } else if (question.type === 'select') {

        var select = document.createElement('select');
        select.name = 'question_' + index;
        select.classList.add('select_states');
        select.id = 'state_select';
        select.required = true;

        var defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Select state';
        select.appendChild(defaultOption);

        states.forEach(function(state) {
            var option = document.createElement('option');
            option.value = state;
            option.textContent = state;
            select.appendChild(option);
        });

        var selectContainer = document.createElement('div');
        selectContainer.classList.add('quiz-answer-label');
        selectContainer.classList.add('answer-btn');
        selectContainer.appendChild(select);

        var ContactsUsLink = document.createElement('a');
        ContactsUsLink.classList.add('quiz-link');
        ContactsUsLink.innerText = 'Contact Us';
        ContactsUsLink.setAttribute('href', '#');

        ContactsUsLink.setAttribute('onclick', 'externalStep()');

        answersDiv.appendChild(selectContainer);
        answersDiv.appendChild(ContactsUsLink);


    } else if (question.type === 'birth') {

        var input = document.createElement('input');
        input.type = 'text';
        input.name = 'date_' + index;
        input.placeholder = 'MM/DD/YY';
        input.value = '';
        input.inputmode = 'text';
        input.classList.add('date');

        answerLabel.appendChild(input);
        answersDiv.appendChild(answerLabel);

    } else if (question.type === 'contacts') {

        var emailContainer = document.createElement('div');
        emailContainer.classList.add('quiz-answer-label');
        emailContainer.classList.add('answer-btn');

        var emailInput = document.createElement('input');
        emailInput.type = 'email';
        emailInput.value = '';
        emailInput.name = 'email_' + index;
        emailInput.placeholder = 'Email';
        emailInput.classList.add('email');

        emailContainer.appendChild(emailInput);
        answersDiv.appendChild(emailContainer);

        var phoneContainer = document.createElement('div');
        phoneContainer.classList.add('quiz-answer-label');
        phoneContainer.classList.add('answer-btn');

        var phoneInput = document.createElement('input');
        phoneInput.type = 'tel';
        phoneInput.name = 'phone_' + index;
        phoneInput.placeholder = '+1 (___) ___-__-__';
        phoneInput.classList.add('phone');

        phoneContainer.appendChild(phoneInput);
        answersDiv.appendChild(phoneContainer);

    } else if (question.type === 'number') {

        var topContainerDiv = document.createElement('div');
        topContainerDiv.classList.add('quiz-answer-label');
        topContainerDiv.classList.add('answer-btn');

        var topLabel = document.createElement('p');
        topLabel.textContent = 'Top #';

        var topInput = document.createElement('input');
        topInput.type = 'number';
        topInput.name = 'min_' + index;
        topInput.placeholder = 'minHg';

        topInput.min = '0';
        topInput.max = '300';
        topInput.classList.add('inputmode', 'numeric');

        var topUnitLabel = document.createElement('p');
        topUnitLabel.textContent = '(Systolic)';

        topContainerDiv.appendChild(topLabel);
        topContainerDiv.appendChild(topInput);
        topContainerDiv.appendChild(topUnitLabel);

        answersDiv.appendChild(topContainerDiv);

        var bottomContainerDiv = document.createElement('div');
        bottomContainerDiv.classList.add('quiz-answer-label');
        bottomContainerDiv.classList.add('answer-btn');

        var bottomLabel = document.createElement('p');
        bottomLabel.textContent = 'Bottom #';

        var bottomInput = document.createElement('input');
        bottomInput.type = 'number';
        bottomInput.name = 'max_' + index;
        bottomInput.placeholder = 'mmHg';
        bottomInput.min = '0';
        bottomInput.max = '300';
        bottomInput.classList.add('inputmode', 'numeric');

        var bottomUnitLabel = document.createElement('p');
        bottomUnitLabel.textContent = '(Diastolic)';

        bottomContainerDiv.appendChild(bottomLabel);
        bottomContainerDiv.appendChild(bottomInput);
        bottomContainerDiv.appendChild(bottomUnitLabel);

        answersDiv.appendChild(bottomContainerDiv);

        var rememberContainerDiv = document.createElement('div');
        rememberContainerDiv.classList.add('quiz-answer-label');
        rememberContainerDiv.classList.add('answer-btn');

        var rememberInput = document.createElement('input');
        rememberInput.type = 'radio';
        rememberInput.name = 'remember_' + index;
        rememberInput.id = 'remember';
        rememberInput.value = 'I don`t remember';

        var rememberLabel = document.createElement('div');
        rememberLabel.classList.add('quiz-answer-label-text');
        rememberLabel.textContent = 'I don`t remember';

        rememberContainerDiv.appendChild(rememberInput);
        rememberContainerDiv.appendChild(rememberLabel);

        answersDiv.appendChild(rememberContainerDiv);

    }

    if (question.attention_required && question.attention_required.length > 0) {
        var attentionRequired = question.attention_required[0];

        if (attentionRequired.consent && attentionRequired.consent.value === true) {
            var description = attentionRequired.consent.description || '';
            addConsentCheckboxToQuestion(answersDiv, description);
        }
    }

    fieldset.appendChild(legend);
    fieldset.appendChild(p);
    fieldset.appendChild(answersDiv);
    questionHtml.appendChild(fieldset);
    questionnaireContainer.appendChild(questionHtml);

    if (window.innerWidth > 768) {
        if (question.type === 'slider') {
            activateSlider('slider_' + index, index);
        }
    }
});

function activateSlider(id,index) {
    var slider = document.getElementById(id);
    var input = document.querySelector('.value-for-range_'+ index);
    var labelList = document.querySelectorAll('.label-for-range li');

    var valueLabels = {
        1: "Always",
        2: "More than half the time",
        3: "Sometimes",
        4: "Rarely",
        5: "Never"
    };

    noUiSlider.create(slider, {
        start: 3,
        connect: 'lower',
        range: {
            min: 1,
            max: 5
        },
        step: 1
    });

    slider.noUiSlider.on("update", function(values) {
        let val = parseInt(values[0]);
        input.value = valueLabels[val];
    });
}


function addConsentCheckboxToQuestion(answersDiv, description) {
    var checkboxContainer = document.createElement('div');
    checkboxContainer.classList.add('quiz-answer-label');
    checkboxContainer.classList.add('answer-btn');
    checkboxContainer.classList.add('answer-btn-consert');

    var checkboxInput = document.createElement('input');
    checkboxInput.type = 'checkbox';
    checkboxInput.name = 'attention_required_checkbox';
    checkboxInput.value = "yes";

    var checkboxLabel = document.createElement('label');
    checkboxLabel.classList.add('quiz-answer-label-text');
    checkboxLabel.textContent = description;

    checkboxContainer.appendChild(checkboxInput);
    checkboxContainer.appendChild(checkboxLabel);
    answersDiv.appendChild(checkboxContainer);
}

function createTooltipElement(questionIndex) {
    var tooltip = document.createElement('div');
    tooltip.classList.add('tooltip');
    tooltip.setAttribute('data-question', questionIndex);
    tooltip.innerHTML = icoQuestion;
    return tooltip;
}

function createTooltipText(text, questionIndex) {
    var tooltip = document.createElement('div');
    tooltip.classList.add('tooltip-text');
    tooltip.classList.add('tooltip-text-'+questionIndex);
    tooltip.innerHTML = text;
    return tooltip;
}

function externalStep() {
    var currentQuestion = document.querySelector('.step-index-' + currentStep);
    if (currentQuestion) {
        console.log(currentQuestion);
        var fieldset = currentQuestion.querySelector('fieldset');
        var legend = currentQuestion.querySelector('legend');
        var p = currentQuestion.querySelector('p');
        var pagiContainer = document.querySelector('.pagination-quiz');
        var prevBtn = document.getElementById('prevStep');
        var nextBtn = document.getElementById('nextStep');
        var select = currentQuestion.querySelector('select + span');
        var consert = currentQuestion.querySelector('.answer-btn-consert');
        var contactBtn = currentQuestion.querySelector('.quiz-link');
        var firstAnswer = currentQuestion.querySelector('.quiz-answers-0');

        legend.textContent = 'Sorry...';
        p.textContent = 'Ordering from your state is not available yet. Please enter your mail so we can contact you.';

        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
        select.style.display = 'none';
        consert.style.display = 'none';
        contactBtn.style.display = 'none';
        firstAnswer.remove();

        var newButton = document.createElement('button');
        newButton.id = 'sender';
        newButton.type = 'button';
        newButton.classList.add('btn-green');
        newButton.setAttribute('onclick', 'sendBtnHundler()');
        newButton.textContent = 'Send';
        pagiContainer.appendChild(newButton);

        var emailContainer = document.createElement('div');
        emailContainer.classList.add('quiz-answer-label');
        emailContainer.classList.add('answer-btn');
        emailContainer.classList.add('quiz-external-answers');

        var emailInput = document.createElement('input');
        emailInput.type = 'email';
        emailInput.placeholder = 'Enter your email';
        emailInput.classList.add('quiz-input');
        emailInput.classList.add('quiz-input-email-external');

        fieldset.appendChild(emailContainer);
        emailContainer.appendChild(emailInput);

        $(emailInput).inputmask({
            alias: 'email',
        });

        var inputEvent = new Event('input', { bubbles: true });
        emailInput.dispatchEvent(inputEvent);

    }
}

function sendBtnHundler() {
    var currentQuestion = document.querySelector('.step-index-' + currentStep);
    var externalEmail = document.querySelector('.quiz-input-email-external');
    var externalEmailValue = externalEmail.value;
    savedData = [];
    savedData.push({
        questionIndex: 0,
        questionTitle: 'User sending email',
        email: externalEmailValue
    });

    sendDataToServer(savedData);
    validateCurrentStep(currentQuestion);
}