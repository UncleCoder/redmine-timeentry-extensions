require 'redmine'
require 'dispatcher'
require 'time_entry_patch'

# Add patch to TimeEntry model
Dispatcher.to_prepare :timeentry_extensions do
  TimeEntry.send(:include, TimeEntryPatch)
end

# Attach view to time entry form
class Hooks < Redmine::Hook::ViewListener
  render_on :view_timelog_edit_form_bottom,
             :partial => 'timeentry',
             :layout => false
end

# Register plugin
Redmine::Plugin.register :timeentry_extensions do
  name 'Timeentry Extensions plugin'
  author 'Mike Kolganov, Thumbtack Inc.'
  description 'Freeze of time entries after certain date'
  version '0.1.0'
  #url 'http://example.com/path/to/plugin'
  #author_url 'mailto:mike.kolganov@gmail.com'
  settings :partial => 'settings/timeentry_extensions_settings', :default => {}
end
