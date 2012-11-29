module TimeentryExtensions
  module IssuesControllerPatch

    def self.included(base)
      base.send(:include, InstanceMethods)
      base.instance_eval do
        before_filter :te_check_possibility_destroy, :only => [:destroy]
      end
    end

    module InstanceMethods

      def te_check_possibility_destroy
        dead_line       = Date.parse(Setting.plugin_timeentry_extensions['dead_line']) rescue nil
        users_dead_line = Date.parse(Setting.plugin_timeentry_extensions['users_dead_line']) rescue nil

        dead_line = if dead_line and users_dead_line
          if User.current.admin?
            dead_line
          else
            dead_line < users_dead_line ? users_dead_line : dead_line
          end
        elsif dead_line
          dead_line
        elsif users_dead_line
          User.current.admin? ? nil : users_dead_line
        end

        if dead_line and 'destroy' == params[:todo]
          timeentries = TimeEntry.find(:all, :conditions => ['issue_id IN (?)', @issues])
          timeentries.each do |timeentry|
            if timeentry.spent_on <= dead_line
              flash[:error] = l :frozen_time_entries, :scope => [:issues_controller, :destroy]
              i18n_strings = I18n.backend.send(:translations)
              redirect_to @issue.nil? ? issues_url : issue_url(@issue)
              return false
            end
          end
        end
      end

    end
  end
end