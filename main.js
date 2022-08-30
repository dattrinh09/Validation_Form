import Validator from "./validator.js";

Validator({
    form: '#form-1',
    formGroup: '.form-group',
    formMessage: '.form-message',
    formSubmit: '.form-submit',
    rules: [
        Validator.isRequired('#fullname', 'Vui lòng nhập trường này'),
        Validator.isRequired('#email', 'Vui lòng nhập trường này'),
        Validator.isRequired('#password', 'Vui lòng nhập trường này'),
        Validator.isRequired('#password_confirmation', 'Vui lòng nhập trường này'),
        Validator.isEmail('#email', 'Email không chính xác'),
        Validator.isPassword('#password', 'Password phải có 8-32 kí tự, ít nhất 1 chữ hoa và 1 chữ thường'),
        Validator.passwordConfirmation('#password_confirmation', function() {
           return document.querySelector('#form-1 #password').value
        }, 'Mật khẩu nhập lại không chính xác')
    ],
    onSubmit: function (data){
        console.log(data)
    }
})