module IssuesControllerPatch

  def self.included(base)
    base.send(:include, InstanceMethods)
    base.instance_eval do
      before_filter :check_possibility_destroy, :only => [:destroy]
    end
  end

  module InstanceMethods

    def check_possibility_destroy
      dead_line = Setting.plugin_timeentry_extensions['dead_line']
      unless dead_line.nil? or dead_line.empty? or User.current.admin? or 'destroy' != params[:todo]

        begin
          dead_line = Date.parse(dead_line)
        rescue ArgumentError
          return false
        end

        timeentries = TimeEntry.find(:all, :conditions => ['issue_id IN (?)', @issues])
        timeentries.each do |timeentry|
          if timeentry.spent_on <= dead_line
            flash[:error] = l :frozen_time_entries, :scope => [:issues_controller, :destroy]
            i18n_strings = I18n.backend.send(:translations)
            redirect_to @issue.nil? ? issues_url : issue_url(@issue)
          end
        end
      end
    end

  end

end