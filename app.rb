require 'sinatra'
require 'rubygems'
require 'sequel'
require 'json'

require 'dotenv'
Dotenv.load
require 'digest'
DB = Sequel.connect(ENV['DATABASE_URL'])

require_relative 'model'

disable :raise_errors
disable :show_exceptions

post "/auth" do
    
    loginInformation = JSON.parse request.body.read
    
    halt 400, {:errors => "Missing parameters"}.to_json if loginInformation["username"].nil? or loginInformation["password"].nil?
    
    user = DB[:users].first(:username=>loginInformation["username"])
    
    halt 403, {:errors => "User not found" }.to_json  if (user.nil?)
    
    password = loginInformation[:password]
    salt = user[:salt]
    salted = password + '{' + salt + '}'
    digest = Digest::SHA512.digest(salted)
    for i in (1...5000) do
      digest = Digest::SHA512.digest(digest + salted)
    end
    encodedPassword = Base64.encode64(digest)
    
    halt 403,  {:errors => "Wrong password"}.to_json  unless user[:password] == encodedPassword
    
    token = SecureRandom.hex
    user[:token]= token
    user.save_changes
    
    content_type :json
    {:token => user[:token], :admin => user[:admin]}.to_json
    
end

['tournaments', 'events', 'challenges'].each do |path|
  get "/#{path}" do
     content_type :json
     DB[path.to_sym].all.to_json
  end
  
  post "/#{path}" do
  content_type :json
         @entity = Object.const_get(path[0...-1].capitalize).new(JSON.parse request.body.read)
         halt 400, {:errors => @entity.errors}.to_json unless @entity.valid?
         @entity.save
         status 201
  end

  get %r{/#{path}/(?<id>\d+)} do |id|
     content_type :json
     DB[path.to_sym].where(:id=>id.to_i).first!.to_json
  end
  
  put %r{/#{path}/(?<id>\d+)} do |id|
     content_type :json
       DB[path.to_sym].first!(:id=>id.to_i).update (JSON.parse request.body.read)
       status 204
  end
  
  delete %r{/#{path}/(?<id>\d+)} do |id|
       halt 404 unless DB[path.to_sym].where(:id=>id.to_i).delete > 0
       status 204
  end
end

error JSON::ParserError do
    raise 400, "Request body is not a correct JSON"
end

error Sequel::NoMatchingRow do
    raise 404
end

error 404 do
   {:errors => "Resource not found" }.to_json
end



