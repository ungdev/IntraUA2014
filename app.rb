require 'sinatra'
require 'rubygems'
require 'sequel'
require 'json'
require 'digest'
require 'base64'

require 'dotenv'
Dotenv.load

DB = Sequel.connect(ENV['DATABASE_URL'])

require_relative 'model'

disable :raise_errors
disable :show_exceptions

helpers do
    def authenticate(adminRequired)
        halt 400,  {:errors => "Missing parameters"}.to_json if @data["username"].nil? or @data["token"].nil?
        
        @username = @data["username"]
        
        user = User.first(:username=>@data["username"])
        
        halt 401,  {:errors => "User not found"}.to_json if user.nil?
        halt 401,  {:errors => "Wrong token"}.to_json unless user.token == @data["token"]
        halt 403,  {:errors => "Unauthorized action"}.to_json unless adminRequired == false or (adminRequired == true and user.admin == true)
        
        @data.delete "username"
        @data.delete "token"
    end
    
    def find (model, id)
         entity = Object.const_get(model[0...-1].capitalize)[id.to_i]
         halt 404,  {:errors => "#{model.capitalize} not found"}.to_json if entity.nil?
         entity
    end
end

before do
    content_type :json
    if request.body.size > 0 then @data = JSON.parse request.body.read end
end

post "/auth" do
    
    halt 400, {:errors => "Missing parameters"}.to_json if @data.nil? or @data["username"].nil? or @data["password"].nil?
    
    user = User.first(:username=>@data["username"])
    
    halt 401, {:errors => "User not found"}.to_json  if user.nil?
    
    password = @data["password"]
    salt = user.salt
    salted = password + '{' + salt + '}'
    digest = Digest::SHA512.digest(salted)
    for i in (1...5000) do
      digest = Digest::SHA512.digest(digest + salted)
    end
    encodedPassword = Base64.strict_encode64(digest)
    
    halt 401,  {:errors => "Wrong password"}.to_json  unless user.password == encodedPassword
    
    token = SecureRandom.hex
    user.token = token
    user.last_login = Time.now.getutc
    user.save
    
    {:token => user[:token], :admin => user[:admin]}.to_json
end

['tournaments', 'events', 'challenges'].each do |path|
    
  get "/#{path}" do
     DB[path.to_sym].all.to_json
  end
  
  post "/#{path}" do
         authenticate(path == "tournaments")
         @entity = Object.const_get(path[0...-1].capitalize).new(@data)
         if (path == "tournaments") then @entity.owner = User.first(:username=>@username).id end
         halt 400, {:errors => @entity.errors}.to_json unless @entity.valid?
         @entity.save
         status 201
  end

  get %r{/#{path}/(?<id>\d+)} do |id|
      find(path, id).to_hash.to_json
  end
  
  put %r{/#{path}/(?<id>\d+)} do |id|
       authenticate(path == "tournaments")
       entity = find(path, id)
       
       begin
       entity.update(@data)
       rescue
       halt 400, {:errors => "No changes have been made"}
       end
        
       
       status 204
  end
  
  delete %r{/#{path}/(?<id>\d+)} do |id|
       authenticate(path == "tournaments")
       find(path,id).destroy
       status 204
  end
end

error JSON::ParserError do
    status 400
    {:errors => "Request body is not a correct JSON" }.to_json
end

