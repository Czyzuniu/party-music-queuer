window.addEventListener('load', () => {

    const passwordField = document.querySelector('input[name=password]')
    const repeatPasswordField = document.querySelector('input[name=rePassword]')
    const partyName = document.querySelector('input[name=partyName]')
    const partyNameLabel = document.querySelector('.partyNameLabel')
    const createPartyButton = window.createParty
    const privacyOptions = window.privacyOptions

        document.querySelector( "form" )
        .addEventListener( "invalid", function( event ) {
            event.preventDefault();
        }, true );

    $("#privacyOptions").on('change', function() {
        let selectedValue = $(this).val();
        
        if (selectedValue == "PASSWORD_JOIN") {
            $( "#passwordContainer" ).show("fast")
        } else {
            $( "#passwordContainer" ).hide("fast")
        }

    });


    passwordField.addEventListener('input',() => {
        if (passwordReg(passwordField.value)) {
            makeFieldValid(passwordField)
            validatePassword(passwordField, repeatPasswordField)
        }  else {
            makeFieldInvalid(passwordField)
        }

    })


    repeatPasswordField.addEventListener('keyup',() => {
        validatePassword(passwordField, repeatPasswordField)
    })

    repeatPasswordField.addEventListener('blur',() => {
        validatePassword(passwordField, repeatPasswordField)
    })


    partyName.addEventListener('input', () => {
        if (partyName.value.length > 2) {
            makeFieldValid(partyName)
        } else {
            makeFieldInvalid(partyName)
        }
    })




    function validatePassword(password,rePassword) {
        if (password.value && rePassword.value) {
            if (password.value === rePassword.value) {
                makeFieldValid(rePassword)
                rePassword.setCustomValidity('')
            } else {
                makeFieldInvalid(rePassword)
                rePassword.setCustomValidity('not matching')
            }
        }

        if (!rePassword.value && !password.value) {
            rePassword.classList.remove('valid')
        }



    }


    function passwordReg(pass) {
        let reg = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
        return reg.test(pass)
    }

    function makeFieldValid(field) {
        field.classList.remove('invalid')
        field.classList.add('valid')
    }

    function makeFieldInvalid(field) {
        field.classList.remove('valid')
        field.classList.add('invalid')
    }

})
