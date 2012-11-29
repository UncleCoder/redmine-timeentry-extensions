te_checkInput = function(input) {
  var today = new Date(te_settings.today.replace('-', '/'));
  var date = new Date(input.val().replace('-', '/'));

  if (date.getTime() >= today.getTime()) {
    input.addClass('error');
    input.attr('title', te_settings.i18n.frozen_date_in_future);
  }
  else {
    input.removeClass('error');
  }
};

window.datepickerOptions = window.datepickerOptions || {};
window.datepickerOptions.onSelect = function() {
  te_checkInput($(this));
};

$(function() {
  te_checkInput($('#users_dead_line'));
  te_checkInput($('#dead_line'));
});
