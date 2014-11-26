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
    validates_presence [:title, :description, :owner]
    validates_type String, [:title, :description]
    validates_type Integer, [:owner, :capacity, :teamSize]
    validates_unique (:title)
  end
end

class Event < Sequel::Model
  plugin :validation_helpers
  def validate
    super
    validates_presence [:title, :description, :date]
    validates_type String, [:title, :description]
    validates_unique (:title)
  end
end

class Challenge < Sequel::Model
plugin :validation_helpers
  def validate
    super
    validates_presence [:title, :description, :date]
    validates_type String, [:title, :description]
    validates_unique (:title)
  end
end

class ChallengeToken < Sequel::Model
plugin :validation_helpers
  def validate
    super
    validates_presence [:title, :description, :date]
    validates_type String, [:title, :description]
    validates_unique (:title)
  end
end
