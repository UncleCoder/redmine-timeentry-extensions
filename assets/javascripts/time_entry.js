te_attach_users_selector = function() {
  var label  = $('<label/>').text(te_options.i18n.field_user);
  var select = $('<select/>').attr('disabled', 'disabled');
  $.each(te_options.users, function(id, name){
    select.append(
      $('<option/>').val(id).text(name)
    );
  })
  select.val(te_options.time_entry.time_entry.user_id);
  var lock = $('<img/>')
    .attr('src', '/images/locked.png')
    .css({'vertical-align':'middle', 'cursor':'pointer'})
    .click(function(){
      $(this).parent().find('select')
        .removeAttr('disabled')
        .attr('name', 'time_entry[te_override_user_id]');
      $(this).remove();
    });
  var user_selector = $('<p/>').append(label).append(select)
  te_options.is_frozen || user_selector.append(lock)
  $('#time_entry_issue_id').parent().before(user_selector);
};

$(function() {
  setTimeout(function(){
    $('#time_entry_spent_on').datepicker('destroy');
    if (te_options.is_frozen) {
      $('.edit_time_entry').find('input:visible, select').each(function(){
        $(this).attr('disabled', 'disabled');
      });
    }
    else {
      $('#time_entry_spent_on').datepicker({
        buttonImage: "/images/calendar.png",
        buttonImageOnly: true,
        dateFormat: "yy-mm-dd",
        firstDay: 0,
        showButtonPanel: true,
        showOn: "button",
        beforeShowDay: function(date) {
          var deadline = $.datepicker.parseDate('yy-mm-dd', te_options.dead_line).getTime();
          if (! isNaN(deadline)) {
            return [date.getTime() > deadline];
          }
          return [true];
        }
      });
    }
  }, 10);
  if (te_options.is_admin) {
    te_attach_users_selector();
  }
});