
/*
* Product card
* */

$(document).ready(function(){

    $('.attributes-product .attribute').on('click', function() {
        var card = $(this).parents('.product-card'),
            price = $(this).find('input').attr('data-price'),
            count = card.find('.placeholder').attr('data-value'),
            priceTotal = card.find('.price');

        $(priceTotal).text( parseInt(count) + parseInt(price) );
        card.find('.attribute.active').removeClass('active');
        $(this).addClass('active');
        $(this).find('input').addClass('active');
    });


    $('.select li').on('click', function() {
        var card = $(this).parents('.product-card'),
            price = card.find('.attribute.active').find('input').attr('data-price'),
            count = card.find('.placeholder').attr('data-value'),
            priceTotal = card.find('.price');
        $(priceTotal).text( parseInt(count) + parseInt(price) );
    });


    $('.select').on('click','.placeholder',function(){
        var parent = $(this).closest('.select');
        if ( ! parent.hasClass('is-open')){
            parent.addClass('is-open');
            $('.select.is-open').not(parent).removeClass('is-open');
        }else{
            parent.removeClass('is-open');
        }
    }).on('click','ul>li',function(){
        var parent = $(this).closest('.select');
        var container = $(this).closest('.product-card');
        parent.removeClass('is-open').find('.placeholder').text( $(this).find('input').val() );
        parent.find('.placeholder').attr( 'data-value', $(this).find('input').attr('data-price') );
        container.find('.price').text($(this).find('input').attr('data-price'));
    });


    $('.js-open-form').on('click', function(e) {
        e.preventDefault();
        var card = $(this).parents('.product-card'),
            priceTotal = card.find('.price').text(),
            text = '';
        text = "Price = " + priceTotal + "$ size = " + card.find('.attribute.active input').val() + " count = " + card.find('.placeholder').text();
        console.log(text);
        $.fancybox.open({
            src: '#popup7',
            type: 'inline'
        });
        $('#popup7').find('[name="detail"]').val(text);

    });


})

/*
* forms
*/

$(document).ready(function(){

    $('.js-send').on( 'submit', function(event){
        event.preventDefault();
        var button = $(this).find('button');
        $.ajax({
            url: 'https://chubsrx.com/mail.php',
            type: 'post',
            data: $(this).serializeArray(),
            dataType: 'json',
            cors: true,
            beforeSend: function() {
                //$(this).find('button').val('Sending').addClass('sending');
            },
            complete: function() {
                //$(this).find('button').val('Success').addClass('complete');
            },
            success: function(json) {
                window.json = json;
                //$(this).find('button').val('Success').addClass('success');
                if (json.status == 'success') {

                    if ( parent.jQuery.fancybox.getInstance() ) {
                        parent.jQuery.fancybox.getInstance().close();
                    }
                    if (button.attr('data-href')) {
                        $.fancybox.open({
                            src: button.attr('data-href'),
                            type: 'inline'
                        });
                    }
                } else {
                    $(this).find('.msg-error').text(json.msg);
                }

            },
            error: function(xhr, ajaxOptions, thrownError) {
                $(this).find('button').text('Send');
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });

        return false;
    });

})

/*
* Quiz
* */


$(document).ready(function(){
    var lengthSteps =  $('.step').length,
        i = 1;
    while (i < lengthSteps) {
        $('.pagination').append('<li></li>');
        i++
    }

    let $elements = $('.pagination li');
    $elements.click((e) => {
        let $current = $(e.target);
        let currentStep = $current.index('li') + parseInt(1);
        if ($current.hasClass('active')) {
            $('.step').hide();
            $('.step-'+currentStep).show();
        }
    });


    $('.btn-quiz-next').on( 'click', function(event){

        event.preventDefault();
        var currentStep = $(this).attr('data-step');
        var newStep = parseInt(currentStep) + parseInt(1);
        var point = currentStep - 1;
        if (!currentStep) {
            currentStep = 1;
        }


        if ( $('.step-'+ currentStep).find('select').length>0 ) {
            console.log('select detected');
            if ($('.step-'+ currentStep).find('select').val().length > 1 ) {
                $('.step').hide();
                $('.pagination li:eq('+point+')').addClass('active');
                $('.step-'+newStep).show();
                $(this).attr('data-step', newStep);
                $('.step-'+ currentStep).find('select').removeClass('error');
            } else {
                console.log('empty is select');
                $('.step-'+ currentStep).find('select').addClass('error');
            }
        }


        if ( $('.step-'+ currentStep).find('input[type="text"]').length>0 ) {
            console.log('input[type="text"] detected');

            window.count = $('.step-'+ currentStep).find('input[type="text"]').not(function() {
                return this.value;
            }).length;
            if ( window.count < 1 ) {
                $('.step').hide();
                $('.pagination li:eq('+point+')').addClass('active');
                $('.step-'+newStep).show();
                $(this).attr('data-step', newStep);

                if (currentStep == 8) {
                    $('.btn-quiz-next').hide();
                    $('.submit-quiz').show();
                }
            } else {
                console.log(' input text is empry');
                $('.step-'+ currentStep).find('input[type="text"]').addClass('error');
            }

        }

        if ( $('.step-'+ currentStep).find('input[type="radio"]').length>0 ) {
            console.log('input[type="radio"] detected');

            if ( $('.step-'+ currentStep).find("input[type='radio']:checked").length < 1 ) {
                console.log(' input radio is empry');
                $('.step-'+ currentStep).find("input[type='radio']").addClass('error');
            } else {
                $('.step').hide();
                $('.pagination li:eq('+point+')').addClass('active');
                $('.step-'+newStep).show();
                $(this).attr('data-step', newStep);
            }
        }

    })


    $('.answer-btn').on('click', function() {
        var step = $(this).parents('.step');
        step.find('.answer-btn').removeClass('active');
        $(this).addClass('active');
        $(this).find('input').prop('checked', true);
    });

    $('.submit-quiz').on('click', function() {
        var currentStep = $('.btn-quiz-next').attr('data-step');
        var point = currentStep - 1;
        var newStep = currentStep + 1;
        window.count = $('.step-'+ currentStep).find('input[type="text"]').not(function() {
            return this.value;
        }).length;
        if ( window.count < 1 ) {
            $('input[name="name"]').removeClass('error');
            $('input[name="phone"]').removeClass('error');
            $('input[name="email"]').removeClass('error');


            $('.step').hide();
            $('.pagination li:eq('+point+')').addClass('active');
            $('.step-'+newStep).show();
            $(this).attr('data-step', newStep);
            if (currentStep == 9) {
                $('.submit-quiz').hide();
                $('.link-main-page').show();
                $('.step-10').show();

            }
        } else {
        console.log(' input text is empry');

            if($('input[name="name"]').val().length==0){
                $('input[name="name"]').addClass('error');
            } else {
                $('input[name="name"]').removeClass('error');
            }
            if($('input[name="phone"]').val().length==0){
                $('input[name="phone"]').addClass('error');
            } else {
                $('input[name="phone"]').removeClass('error');
            }
            if($('input[name="email"]').val().length==0){
                $('input[name="email"]').addClass('error');
            } else {
                $('input[name="email"]').removeClass('error');
            }

        }

    });


})


