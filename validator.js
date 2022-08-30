function Validator(options) {
    var formElement = document.querySelector(options.form)
    var formButton = formElement.querySelector(options.formSubmit)

    var ruleSelectors = {}

    if(formElement){
        // Input event listener
        options.rules.forEach( rule => {
            var inputElement = formElement.querySelector(rule.selector)
    
            Array.isArray(ruleSelectors[rule.selector]) 
            ? ruleSelectors[rule.selector].push(rule.test)
            : ruleSelectors[rule.selector] = [rule.test]
    
            if(inputElement){                
                inputElement.onblur = () => validate(inputElement, rule)
                inputElement.oninput = () => errorNotify(inputElement)
            }
        })
    
        // Submit Form
        formElement.onsubmit = e => {
            e.preventDefault()

            var isValid = true
            options.rules.forEach( rule => {
                var inputElement = formElement.querySelector(rule.selector)
                if(!validate(inputElement, rule)) isValid = false
            })

            if(isValid){
                var dataInputs = formElement.querySelectorAll('[name]')
                var dataValues = Array.from(dataInputs).reduce((output, input) => 
                    ({...output, [input.name] : input.value})
                , {})
    
                options.onSubmit(dataValues)
                alert('Bạn đã đăng ký thành công')
            }else{
                options.onSubmit('Có lỗi')
            }
        }
    }

    // Get Parent
    function getParent(element, selector){
        while(element.parentElement){
            if(element.parentElement.matches(selector)){
                return element.parentElement
            }
            element = element.parentElement
        }
    }
    
    // Validate input value
    function validate(element, rule){
        var errorMessage
        for(var ruleSelector of ruleSelectors[rule.selector]){
            errorMessage = ruleSelector(element.value)
            if(errorMessage) break
        }

        errorMessage 
        ? errorNotify(element, errorMessage) 
        : errorNotify(element)

        return !errorMessage
    }

    // Notify error message && disabed button when error occur
    function errorNotify(...param){
        var errorElement = getParent(param[0], options.formGroup).querySelector(options.formMessage)
        if(param.length === 1){
            errorElement.innerText = ''
            getParent(param[0], options.formGroup).classList.remove('invalid')
            formButton.disabled = false
            formButton.classList.remove('disabled')
        }else{
            errorElement.innerText = param[1] 
            formButton.disabled = true
            formButton.classList.add('disabled')
            getParent(param[0], options.formGroup).classList.add('invalid')
        }
    }
}

// Required Check
Validator.isRequired = (selector, message) => ({
    selector : selector,
    test: value => value.trim() ? undefined : message
})

// Email Check
Validator.isEmail = (selector, message) => ({
    selector : selector,
    test: value => 
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value) ? undefined : message
})

// Password Check
Validator.isPassword = (selector, message) => ({
    selector : selector,
    test: value =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z]).{8,32}$/.test(value) ? undefined : message
})

// Password confirmation check
Validator.passwordConfirmation = (selector, confirm, message) => ({
    selector : selector,
    test: value => value === confirm() ? undefined : message
})

export default Validator