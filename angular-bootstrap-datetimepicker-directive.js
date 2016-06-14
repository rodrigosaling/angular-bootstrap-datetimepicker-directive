'use strict';

angular
  .module('datetimepicker', [])

  .provider('datetimepicker', function () {
    var default_options = {};

    this.setOptions = function (options) {
      default_options = options;
    };

    this.$get = function () {
      return {
        getOptions: function () {
          return default_options;
        }
      };
    };
  })

  .directive('datetimepicker', [
    '$timeout',
    'datetimepicker',
    function ($timeout,
              datetimepicker) {

      var default_options = datetimepicker.getOptions();

      return {
        require : '?ngModel',
        restrict: 'AE',
        scope   : {
          datetimepickerOptions: '@'
        },
        link    : function ($scope, $element, $attrs, ngModelCtrl) {
          var passed_in_options = $scope.$eval($attrs.datetimepickerOptions);
          var options = jQuery.extend({}, default_options, passed_in_options);

          var datePickerElement = $element.parent().hasClass('input-group') ? $element.parent() : $element;

          datePickerElement
            .on('dp.change', function (e) {
              if (ngModelCtrl) {
                $timeout(function () {
                  if (options.inline) {
                    e.target.value = e.date;
                  }
                  ngModelCtrl.$setViewValue($element[0].value);
                  ngModelCtrl.$commitViewValue();
                });
              }
            })
            .datetimepicker(options);

 $scope.$watch(
                function () {
                    return ngModelCtrl.$modelValue;
                }, function (newValue, oldValue) {
                    console.log('in datepicker model value changed...', newValue, oldValue);
                    if (typeof newValue === "undefined") {
                        if (oldValue != null) {
                            $element[0].value = null;
                        }
                    } else {
                        $element[0].value = newValue;
                    }
                   
                    //ngModelCtrl.$viewValue = newValue;
                }, true);

          function setPickerValue() {
            var date = options.defaultDate || null;

            if (ngModelCtrl && ngModelCtrl.$viewValue) {
              date = ngModelCtrl.$viewValue;
            }

            $element
              .data('DateTimePicker')
              .date(date);
          }

          if (ngModelCtrl) {
            ngModelCtrl.$render = function () {
              setPickerValue();
            };
          }

          setPickerValue();
        }
      };
    }
  ]);
