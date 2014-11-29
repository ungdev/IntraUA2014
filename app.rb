
require 'sinatra'
require 'rubygems'
require 'sequel'
require 'json'
require 'digest'
require 'base64'
require 'rack'
require 'sinatra/cookies'
require 'dotenv'
Dotenv.load

DB = Sequel.connect(ENV['DATABASE_URL'])

require_relative 'model'

disable :raise_errors
disable :show_exceptions


set :public_folder, Proc.new { File.join(root, "static") }
disable :static
set :static_cache_control, [:public_folder, :max_age => 0]

use Rack::Session::Pool, :expire_after => 2592000

helpers do
    def authenticate
        halt 401,  {:errors => "Missing action, please go to /login to authenticate"}.to_json if session[:username].nil? or session[:token].nil?
        @user = User.first(:username=>session[:username])
        
        halt 401,  {:errors => "User not found"}.to_json if @user.nil?
        halt 401,  {:errors => "Wrong token"}.to_json unless @user.token == session[:token] 
    end
    

    
    def find (model, id)
         entity = Object.const_get(model[0...-1].capitalize)[id.to_i]
         halt 404,  {:errors => "#{model[0...-1].capitalize} not found"}.to_json if entity.nil?
         entity
    end
end

set(:methods) {|*verbs|
  condition { 
    verbs.any?{|v| v == request.request_method }
  } 
}

before %r{^[/\w\.-]+(?<!\.html)$}, :methods => ["POST", "PUT"] do
    content_type :json
    @data = JSON.parse request.body.read
end



post "/login" do
    
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
    
    session[:token] = user.token
    session[:username] = user.username
    
     content_type :html
    status 200
end

['tournaments', 'events', 'challenges'].each do |path|
    
  get "/#{path}" do
     entities = Object.const_get(path[0...-1].capitalize).all
      r = {}
      entities.each  do  |e| r[e.id] = e.to_hash end  
    r.to_json
  end
  
  post "/#{path}" do
      authenticate
         @entity = Object.const_get(path[0...-1].capitalize).new(@data)
         if (path == "tournaments") then @entity.owner = @user end
         halt 400, {:errors => @entity.errors}.to_json unless @entity.valid?
         @entity.save
         status 201
  end

  get %r{/#{path}/(?<id>\d+)} do |id|
      find(path, id).to_hash.to_json
  end
  
  put %r{/#{path}/(?<id>\d+)} do |id|
       entity = find(path, id)
       authenticate
       halt 403,  {:errors => "Unauthorized action"}.to_json unless @user.admin or (path == 'tournaments' and entity.owner = @user)
       entity.update(@data) 
       status 204
  end
  
  delete %r{/#{path}/(?<id>\d+)} do |id|
       entity = find(path,id)
       authenticate
       halt 403,  {:errors => "Unauthorized action"}.to_json unless @user.admin or (path == 'tournaments' and entity.owner = @user)
       entity.destroy
       status 204
  end
end

head '/challenge/check/:id' do |id|
   
end

post '/tournaments/:tournament_id/users/:user_id' do |tournament_id, user_id|
       authenticate
       halt 403,  {:errors => "Unauthorized action"}.to_json unless @user.admin or (path == 'tournaments' and entity.owner = @user)
end

get '/partials/login.html' do 
    content_type :html
    send_file File.expand_path('../static/partials/login.html',  __FILE__)
end

get '/partials/admin.*.html' do
    content_type :html
   authenticate
   redirect '/partials/login.html' unless @user.admin
   send_file File.expand_path("../static/partials/admin.#{params[:splat]}.html",  __FILE__)
end

get '/index.html' do
    content_type :html
    if  not @user.nil? and @user.admin 
    send_file File.expand_path('../static/index.admin.html',  __FILE__) 
    else 
    send_file File.expand_path('../static/index.html',  __FILE__) 
    end
end

error JSON::ParserError do
    status 400
    {:errors => "Request body is not a correct JSON" }.to_json
end

error Sequel::Error do
    status 400
    {:errors => "Some parameters are incorrects"}.to_json
end

put '/user/:id' do
end

put '/user/:username' do
end
