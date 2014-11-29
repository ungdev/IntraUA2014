require 'rubygems'
require 'sequel'


class User < Sequel::Model
   one_to_many :owned_tournaments, :class=>:Tournament, :key=>:owner_id
   
  many_to_many :tournaments
   plugin :validation_helpers
   def validate
    super
    validates_type Integer, :point
  end
end

class Tournament < Sequel::Model
  many_to_one :owner, :class=>:User, :key=>:owner_id
  many_to_many :users
    
  plugin :validation_helpers
  def validate
    super
    validates_presence [:title, :description, :owner]
    validates_type String, [:title, :description]
    validates_type Integer, [:capacity, :teamSize]
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
  one_to_many :challenges_tokens, :key=>:challenge
  def validate
    super
    validates_presence [:title, :description, :date]
    validates_type String, [:title, :description]
    validates_unique (:title)
  end
end

class ChallengeToken < Sequel::Model
  plugin :validation_helpers
  many_to_one :challenge, :key=>:challenge_id
  def validate
    super
    validates_presence [:value, :challenge_id]
    validates_type Integer, [:position, :challenge_id]
    validate_type String, :value
  end
end
