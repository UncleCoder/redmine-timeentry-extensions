document.observe('dom:loaded', function(){

  var TimeEntrySettings = Class.create(time_entry_settings, {
    
    initialize: function() {
      var t = this;
      this.translator = new Translator(this.i18n_strings);

        Calendar.setup({
          inputField : 'dead_line',
          ifFormat : '%Y-%m-%d',
          button : 'dead_line_trigger',
          onUpdate: function() {
            t.change_frozen_date(t)
          }
        });

      $('dead_line').observe('change', function() {
        t.change_frozen_date(t);
      });

      this.change_frozen_date(this);
    },

    change_frozen_date: function(t) {
      var today = new Date(t.today.replace('-', '/'));
      var date = new Date($('dead_line').value.replace('-', '/'));

      if (date.getTime() >= today.getTime()) {
        t.invalidate_dead_line(t._('frozen_date_in_future'));
      }
      else {
        t.invalidate_dead_line();
      }
    },

    invalidate_dead_line: function(msg) {
      if (Object.isString(msg)) {
        $('dead_line').setStyle({
          'background-color': '#FFE3E3',
          'border': '1px solid #D00'
        });
        $('dead_line').writeAttribute('title', msg)

        $$('label[for="dead_line"]').first().writeAttribute('title', msg);
      }
      else {
        $('dead_line').removeAttribute('style');
        $('dead_line').removeAttribute('title');
      }
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

  new TimeEntrySettings();

});