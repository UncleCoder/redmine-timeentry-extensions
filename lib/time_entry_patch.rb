module TimeEntryPatch     
  
  def self.included(base)
    base.send(:include, InstanceMethods)
    base.class_eval do
      validate_on_update :check_possibility_update
      validate_on_create :check_possibility_create
      before_destroy :check_possibility_destroy
    end
  end
  
  module InstanceMethods
    
    def check_possibility_create 
      dead_line = Setting.plugin_timeentry_extensions['dead_line']
      unless dead_line.nil? or dead_line.empty? or User.current.admin?
        begin
          dead_line = Date.parse(dead_line)
        rescue ArgumentError
          return false
        end
        
        if self.spent_on <= dead_line
          errors.add :spent_on, :freeze
        end
      end
    end
    
    def check_possibility_update
      dead_line = Setting.plugin_timeentry_extensions['dead_line']
      unless dead_line.nil? or dead_line.empty? or User.current.admin?
        begin
          dead_line = Date.parse(dead_line)
        rescue ArgumentError
          return false
        end
        
        time_entry = TimeEntry.find(self.id)
        if time_entry.spent_on <= dead_line
          errors.add :spent_on, :freeze
        elsif self.spent_on <= dead_line
          errors.add :spent_on, :freeze
        end
      end
    end
    
    def check_possibility_destroy
      dead_line = Setting.plugin_timeentry_extensions['dead_line']
      unless dead_line.nil? or dead_line.empty? or User.current.admin?
        begin
          dead_line = Date.parse(dead_line)
        rescue ArgumentError
          return false
        end
        
        time_entry = TimeEntry.find(self.id)
        if time_entry.spent_on <= dead_line
          errors.add :spent_on, :freeze
          return false
        end
      end
    end
    
  end
  
end