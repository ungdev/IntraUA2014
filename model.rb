require 'rubygems'
require 'sequel'

class Sequel::Model
    plugin :schema
    plugin :validation_helpers
    plugin :auto_validations, :not_null=>:presence
    def to_json (arg)
        @values.to_json
    end
    
    def to_s
        @values.to_json
    end
end
class User < Sequel::Model
   one_to_many :owned_tournaments, :class=>:Tournament, :key=>:owner_id
  many_to_many :tournaments
    
    def encode (salt, password)
        salted = password + '{' + salt + '}'
        digest = Digest::SHA512.digest(salted)
        for i in (1...5000) do
            digest = Digest::SHA512.digest(digest + salted)
        end
        encodedPassword = Base64.strict_encode64(digest)
    end
end

class Tournament < Sequel::Model
    many_to_one :owner, :class=>:User, :key=>:owner_id
  many_to_many :users
end

class Event < Sequel::Model
end

class Challenge < Sequel::Model
  one_to_many :challenge_tokens, :key=>:challenge_id
end

class ChallengeToken < Sequel::Model
  many_to_one :challenge, :key=>:challenge_id
  many_to_one :deleter, :class=>:User, :key=>:deleter_id
end
