module TimeentryExtensions
  module TimeEntryPatch     
    
    def self.included(base)
      base.send(:include, InstanceMethods)
      base.class_eval do
        attr_accessor :te_override_user_id
        before_create :te_check_overriden_user_id
        before_save   :te_check_overriden_user_id
        
        validate :te_check_possibility
        before_destroy :te_check_possibility

        safe_attributes 'te_override_user_id'
      end
    end
    
    module InstanceMethods
      
      def te_frozen?
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

        return false unless dead_line
        (persisted? ? [spent_on_was, spent_on].min : spent_on) <= dead_line
      end

      def te_check_overriden_user_id
        if User.current.admin?
          overriden_user_id = self.te_override_user_id.to_i
          self.user_id = overriden_user_id if overriden_user_id > 0
        end
      end
      
      def te_check_possibility
        if te_frozen?
          errors.add :spent_on, :freeze
          false
        end
      end
      
    end
  end
end