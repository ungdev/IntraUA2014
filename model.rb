require 'rubygems'

plugin :validation_helpers

class User < Sequel::Model
   def validate
    super
  end
end

class Tournament < Sequel::Model
  def validate
    super
  end
end

class Event < Sequel::Model
  def validate
    super
    validates_presence [:title, :description, :date]
    validate_type String, [:title, :description]
    validate_type DateTime, :date
    validate_unique (:title)
  end
end

class Challenge < Sequel::Model
  def validate
    super
  end
end

