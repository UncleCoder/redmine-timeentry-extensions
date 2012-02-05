require 'redmine'
require 'dispatcher'
require 'time_entry_patch'

Dispatcher.to_prepare :timeentry_extensions do
  TimeEntry.send(:include, TimeEntryPatch)
end

Redmine::Plugin.register :timeentry_extensions do
  name 'Redmine Timeentry Extensions plugin'
  author 'Mike Kolganov, Thumbtack Inc.'
  description 'Timeentry extensions'
  version '0.0.1'
  #url 'http://example.com/path/to/plugin'
  #author_url 'http://example.com/about'
  settings :partial => 'settings/timeentry_extensions_settings'
end
