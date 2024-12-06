function validateCurrentStep(currentStep) {
    if (
        checkFieldsFilled(currentStep) &&
        checkFieldsValid(currentStep) &&
        checkAttentionRequired(currentStep) &&
        validateRadioButtons(currentStep)
    ) {
        return true;
    } else {
        //console.log('Validation failed');
        return false;
    }
}


function checkFieldsFilled(currentStep) {
    var inputs = currentStep.querySelectorAll('input, textarea, select');
    var allFilled = true;

    for (var i = 0; i < inputs.length; i++) {
        var input = inputs[i];
        if (input.type === 'radio' || input.type === 'checkbox') {
            var radios = currentStep.querySelectorAll(`input[name="${input.name}"]`);
            var isChecked = Array.from(radios).some(radio => radio.checked);
            if (!isChecked) {
                allFilled = false;
                input.classList.add('error');
            } else {
                input.classList.remove('error');
            }
        } else if (!input.value.trim()) {
            allFilled = false;
            input.classList.add('error');
        } else {
            input.classList.remove('error');
        }
    }

    return allFilled;
}


function checkFieldsValid(currentStep) {
    var inputs = currentStep.querySelectorAll('input, textarea, select');
    var isValid = true;

    for (var i = 0; i < inputs.length; i++) {
        var input = inputs[i];

        if (input.type === 'radio' || input.type === 'checkbox') {
            continue; // Для этих полей проверка уже выполнена в `checkFieldsFilled`
        }

        if (input.classList.contains('phone') && !validatePhone(input.inputmask.unmaskedvalue())) {
            isValid = false;
            console.log('Invalid phone: ' + input.value);
            input.classList.add('error');
        } else if (input.classList.contains('email') && !validateEmail(input.value)) {
            isValid = false;
            console.log('Invalid email: ' + input.value);
            input.classList.add('error');
        } else if (input.type === 'text' && input.value.length < 2) {
            isValid = false;
            console.log('Invalid text field: ' + input.value);
            input.classList.add('error');
        } else {
            input.classList.remove('error');
            input.classList.add('success');
        }
    }

    return isValid;
}

function validateRadioButtons(currentStep) {
    var radioGroups = {};
    var radios = currentStep.querySelectorAll('input[type="radio"]');
    radios.forEach(radio => {
        if (!radioGroups[radio.name]) {
            radioGroups[radio.name] = [];
        }
        radioGroups[radio.name].push(radio);
    });

    return Object.keys(radioGroups).every(group => {
        return radioGroups[group].some(radio => radio.checked);
    });
}




function hidePreloader() {
    var preloader = document.getElementById('preloader');
    preloader.classList.add('hide');
}

function formatPhoneNumber(phoneNumber) {
    var formattedNumber = phoneNumber.replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, "+1 ($1) $2-$3-$4");
    return formattedNumber;
}

function validatePhone(phone) {
    /* format: +1 (XXX) XXX-XX-XX */
    var phonePattern = /^\+1 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
    return phonePattern.test(formatPhoneNumber(phone));
}

function validateEmail(email) {
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

function validateDate(date) {
    var datePattern = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(20)\d{2}$/;
    return datePattern.test(date);
}

function checkAttentionRequired(currentQuestion) {

    var inputs = currentQuestion.querySelectorAll('input[name="attention_required_checkbox"]');

    if (inputs.length > 0) {
        var isAnyChecked = Array.from(inputs).some(function(checkbox) {
            return checkbox.checked;
        });

        if (isAnyChecked) {
            console.log("Some attention_required_checkbox are checked.");
            inputs.forEach(function(checkbox) {
                checkbox.classList.remove('error');
                checkbox.classList.add('success');
            });
            return true;
        } else {
            console.log("Attention required but not checked.");
            inputs.forEach(function(checkbox) {
                checkbox.classList.remove('success');
                checkbox.classList.add('error');
            });
            return false;
        }
    } else {
        return true;
    }

}


$(document).ready(function() {
    $('.date').inputmask('99/99/9999', {
        inputmode: 'numeric',
        onBeforeValidate: function (value, opts) {
            // return validatePhone(value);
        },
        onInvalid: function (event, value, validations) {
            event.target.classList.add('error');
            event.target.classList.remove('success');
        },
        onValid: function (event) {
            event.target.classList.remove('error');
            event.target.classList.add('success');
        }
    });

    $('.phone').inputmask('+1 (999) 999-99-99');
    $('.email').inputmask({
        alias: 'email',
    });
});