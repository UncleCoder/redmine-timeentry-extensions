require 'redmine'
require File.dirname(__FILE__) + '/lib/time_entry_patch.rb'
require File.dirname(__FILE__) + '/lib/issues_controller_patch.rb'

# Add patch to TimeEntry model
Rails.application.config.after_initialize do
  TimeEntry.send(:include, TimeentryExtensions::TimeEntryPatch)
  IssuesController.send(:include, TimeentryExtensions::IssuesControllerPatch)
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
  author 'Mike Kolganov, Thumbtack Technology'
  description 'Freeze of time entries after certain date'
  version '0.2.0'
  url 'https://github.com/thumbtack-technology/redmine-timeentry-extensions'
  author_url 'mailto:mike.kolganov@gmail.com'
  settings :default => {}, :partial => 'settings/settings'
end
