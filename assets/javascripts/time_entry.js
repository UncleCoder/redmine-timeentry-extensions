document.observe('dom:loaded', function(){
  
  var TimeEntryFormControl = Class.create(time_entry_options, {
    
    initialize: function() {
      this.translator = new Translator(this.i18n_strings);
      if (this.is_admin) {
        this.attach_users_selector();
      }
      else {
        if(this.frozen_time_entry) {
          this.lock_timeentry_form();
        }
        else if(this.frozed_deadline) {
          this.lock_js_calendar(this.frozed_deadline);
        } 
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
    },
    
    attach_users_selector: function() {
      var label = new Element('label', {'for': 'override_user_id'})
        .update(this._('field_user'));
      var select = new Element('select', {name: 'time_entry[override_user_id]'});
      new Hash(this.users).each(function(pair){
        var user_id = parseInt(pair.first(), 10);
        var user_name = pair.last();
        var option = new Element('option', {value: user_id})
          .update(user_name);
        select.insert(option);
      });
      select.value = this.time_entry.user_id;
      var user_field = new Element('p')
        .insert(label)
        .insert(select);
        
      $$('#content div.box').first().insert({
        top: user_field
      });
    },
    
    /**
     * Wrapper for Translator.get() method
     * Translate i18n ID to string for current language
     *
     * @param  key      i18n ID
     * @param  get_back Get back i18n ID if translation not exists
     * 
     * @return Translated string for current language
     */
    _: function(key, get_back) {
      return this.translator.get(key, get_back);
    }
    
  });
  
  /**
   * Translator
   */
  var Translator = Class.create({
    /**
     * Constructor.
     * Initialize translator
     *
     * @param  i18n strings class object
     *
     * @return void
     */
    initialize: function(i18n_strings) {
      this.i18n_strings = new Hash(i18n_strings);
    },

    /**
     * Translate string using IssueHotButtonsSettings locale strings store
     *
     * @param  key i18n identifier
     * @param  get_back Get back i18n ID if translation not exists
     *
     * @return Translated string or input key if translation not found
     */
    get: function(key, get_back) {
      get_back = get_back === false ? false : true;
      if (Object.isArray(key)) key = key.join('_');
      return this.i18n_strings.get(key) || (get_back ? key : false);
    }
  });
  
  new TimeEntryFormControl();
  
});