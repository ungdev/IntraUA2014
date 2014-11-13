/* jshint strict: true, undef: true, browser: true, jquery: true */
/* global moment */

(function () {
    'use strict';
    // Date
    $('.date').datetimepicker({
        defaultDate: moment('12/12/2014', 'DD/MM/YYYY'),
        language: 'fr',
        maxDate: moment('14/12/2014', 'DD/MM/YYYY'),
        minDate: moment('12/12/2014', 'DD/MM/YYYY'),
        minuteStepping: 5,
        useSeconds: false,
        useStrict: true
    });
}());