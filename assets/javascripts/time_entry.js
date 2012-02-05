document.observe('dom:loaded', function(){
  
  var TimeEntryFormControl = Class.create(time_entry_options, {
    
    initialize: function() {
      if(this.frozen_time_entry) {
        this.lock_timeentry_form();
      }
      else if(this.frozed_deadline) {
        this.lock_js_calendar(this.frozed_deadline);
      }
      
    },
    
    lock_js_calendar: function(date) {
      var deadline = new Date(date).getTime();
      if (! isNaN(deadline)) {
        Calendar.setup({
          inputField : 'time_entry_spent_on',
          ifFormat : '%Y-%m-%d',
          button : 'time_entry_spent_on_trigger',
          disableFunc: function(a) {
            return a.getTime() <= deadline;
          }
        });
      }
    },
    
    lock_timeentry_form: function() {
      $$('#content form').first().select('select, input').each(function(element){
        element.disabled = true;
      });
      $$('#content form').first().select('.calendar-trigger').each(function(element){
        element.onclick = null;
      });
    }
    
  })
  
  new TimeEntryFormControl();
  
});