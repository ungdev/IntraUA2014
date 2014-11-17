require 'rubygems'
require 'sequel'


class User < Sequel::Model
   plugin :validation_helpers
   def validate
    super
  end
end

class Tournament < Sequel::Model
  plugin :validation_helpers
  def validate
    super
  end
end

class Event < Sequel::Model
  plugin :validation_helpers
  def validate
    super
    validates_presence [:title, :description, :date]
    validates_type String, [:title, :description]
    #validates_type DateTime, :date
    validates_unique (:title)
  end
end

class Challenge < Sequel::Model
plugin :validation_helpers
  def validate
    super
  end
end

