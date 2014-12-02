require 'sinatra'
require 'rubygems'
require 'sequel'
require 'json'
require 'digest'
require 'base64'
require 'rack'
require 'sinatra/cookies'
require 'sinatra/json'
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
        halt 401, {'Content-Type' => 'application/json'}, {:errors => "Not logged in"}.to_json if session[:username].nil? or session[:token].nil?

        @user = User.first(:username=>session[:username])

        halt 401, {'Content-Type' => 'application/json'}, {:errors => "User not found"}.to_json if @user.nil?
        halt 401,  {'Content-Type' => 'application/json'}, {:errors => "Wrong token"}.to_json unless @user.token == session[:token]
    end

    def authenticate!
        authenticate
        halt 403,  {:errors => "Unauthorized action"}.to_json unless @user.admin
    end

    def authenticate?
        if not session[:username].nil? then @user = User.first(:username=>session[:username])  else return false end
        return (not @user.nil? and @user.token == session[:token])
    end

    def find (model, id)
        entity = Object.const_get(model[0...-1].capitalize)[id.to_i]
        halt 404,  {'Content-Type' => 'application/json'}, {:errors => "#{model[0...-1].capitalize} not found"}.to_json if entity.nil?
        entity
    end
end

set(:methods) {|*verbs|
    condition {
        verbs.any?{|v| v == request.request_method }
        }
    }

post "/login" do
    data = JSON.parse request.body.read
    username = data["username"]
    password = data["password"]

    halt 400, {'Content-Type' => 'application/json'}, {:errors => "Missing parameters"}.to_json if data.nil? or username.nil? or password.nil?

    user = User.first :username=>username

    halt 401, {'Content-Type' => 'application/json'}, {:errors => "User not found"}.to_json  if user.nil?

    salt = user.salt
    salted = password + '{' + salt + '}'
    digest = Digest::SHA512.digest(salted)
    for i in (1...5000) do
        digest = Digest::SHA512.digest(digest + salted)
    end
    encodedPassword = Base64.strict_encode64(digest)

    halt 401,  {'Content-Type' => 'application/json'}, {:errors => "Wrong password"}.to_json  unless user.password == encodedPassword

    token = SecureRandom.hex
    user.token = token
    user.last_login = Time.now.getutc
    user.save

    session[:token] = user.token
    session[:username] = user.username

    status 200
end

post "/logout" do
    authenticate
    session.clear
    status 200
end

get "/tournaments" do
    content_type :json
    Tournament.to_hash(:id).to_json
end

post "/tournaments" do
    authenticate
    tournament = Tournament.new JSON.parse request.body.read
    tournament.owner = @user
    halt 400, {'Content-Type' => 'application/json'}, {:errors => tournament.errors}.to_json unless tournament.valid?
    tournament.save
    status 201
end

get  '/user' do
    authenticate
    content_type :json
    @user.to_hash.to_json
end

get  '/users' do
    authenticate!
    User.to_hash(:id).to_json
end

get  '/user/:id' do |id|
    authenticate!
    user = User.with_pk!(id)
    content_type :json
end

put '/user/:id' do |id|
    user = User.with_pk!(id)
    authenticate!
    user.update JSON.parse request.body.read
    status 204
end

put '/user/:username' do |username|
    user = User[:username=>username]
    authenticate!
    entity.update JSON.parse request.body.read
    status 204
end


get "/tournaments/:id" do |id|
    content_type :json
    Tournament.with_pk!(id).to_hash.to_json
end

put "/tournaments/:id" do |id|
    tournament = Tournament.with_pk!(id)
    authenticate
    halt 403, {'Content-Type' => 'application/json'}, {:errors => "Unauthorized action"}.to_json unless @user.admin or tournament.owner == @user
    tournament.update JSON.parse request.body.read
    status 204
end

patch '/tournaments/:tournament_id/suscribe' do |id|
    authenticate
    tournament = Tournament.with_pk!(id)
    data = request.body.read
    tournament.data_teams = data
    tournament.save
    status 204
end

patch '/tournaments/:tournament_id/users/:user_id' do |tournament_id, user_id|
    authenticate
    tournament = Tournament.with_pk!(tournament_id)
    halt 403,  {'Content-Type' => 'application/json'}, {:errors => "Unauthorized action"}.to_json unless @user.admin or tournament.owner = @user
    tournament.add_user User.with_pk!(user_id)
    tournament.save
    status 204
end


delete "/tournaments/:id" do |id|
    tournament = Tournament.with_pk!(id)
    authenticate
    halt 403, {'Content-Type' => 'application/json'}, {:errors => "Unauthorized action"}.to_json unless @user.admin or tournament.owner == @user
    tournament.destroy
    status 204
end

get "/events" do
    content_type :json
    Event.to_hash(:id).to_json
end

post "/events" do
    authenticate!
    event = Event.new JSON.parse request.body.read
    halt 400, {'Content-Type' => 'application/json'},{:errors => event.errors}.to_json unless event.valid?
    event.save
    status 201
end

get "/events/:id" do |id|
    content_type :json
    Event.with_pk!(id).to_hash.to_json
end

put "/events/:id" do |id|
    event = Event.with_pk!(id)
    authenticate!
    event.update JSON.parse request.body.read
    status 204
end

delete "/events/:id" do |id|
    event = Event.with_pk!(id)
    authenticate!
    event.destroy
    status 204
end

get "/challenges" do
    content_type :json
    Challenge.to_hash(:id).to_json
end

post "/challenges" do
    content_type :json
    authenticate!
    challenge = Challenge.new JSON.parse request.body.read
    halt 400, {:errors => challenge.errors}.to_json unless challenge.valid?
    challenge.save
    status 201
    challenge.to_hash.to_json
end

get "/challenges/:id" do |id|
    content_type :json
    Challenge.with_pk!(id).to_hash.to_json
end

get "/challenges/:id/tokens" do |id|
    content_type :json
    Challenge.with_pk!(id).challenge_tokens_dataset.to_hash(:value).to_json
end

put "/challenges/:id" do |id|
    challenge = Challenge.with_pk!(id)
    authenticate!
    challenge.update JSON.parse request.body.read
    status 204
end

patch '/challenges/:id' do |id|
    challenge = Challenge.with_pk!(id)
    halt 404, {'Content-Type' => 'application/json'},{:errors => "Challenge not found"}.to_json if challenge.nil?
    challenge.add_challenge_token JSON.parse request.body.read
    halt 400, {'Content-Type' => 'application/json'},{:errors => @entity.errors}.to_json unless challenge.valid?
    challenge.save
    status 200
end

delete "/challenges/:name" do |name|
    challenge = Challenge.where(:name=> name)
    authenticate!
    halt 403, {'Content-Type' => 'application/json'}, {:errors => "Unauthorized action"}.to_json unless @user.admin

    tokens = challenge.challenge_tokens_dataset.each do |token|
        token.destroy
    end
    challenge.destroy
    status 204
end

delete '/challenges/:id/check/:token' do |id,token|
    authenticate
    challenge = Challenge.with_pk!(id)
    halt 404, {'Content-Type' => 'application/json'}, {:errors => "Challenge not found"}.to_json if challenge.nil?
    token = ChallengeToken.where(:name=>token, :challenge=>challenge).first
    halt 404, {'Content-Type' => 'application/json'},{:errors => "Token not found"}.to_json if token.nil?
    halt 400, {'Content-Type' => 'application/json'}, {:errors => "Token not found"}.to_json unless token.deleter.nil?
    @user.point += token.value
    @user.save
    token.deleted_at = Time.now.getutc
    token.deleter = @user
    token.save

    content_type :json
    token.to_hash.to_json
end



get '/login.html' do
    content_type :html
    send_file File.expand_path('../static/login.html',  __FILE__)
end

get '/partials/admin.:page.html' do |page|
    content_type :html
    authenticate
    redirect '/login.html' unless @user.admin
    send_file File.expand_path("../static/partials/admin.#{page}.html",  __FILE__)
end

get '/partials/:page.html' do |page|
send_file File.expand_path("../static/partials/#{page}.html",  __FILE__)
end

get '/index.html' do
    content_type :html
    authenticate?
    redirect '/login.html' if not authenticate?
    if @user.admin
        send_file File.expand_path('../static/index.admin.html',  __FILE__)
    else
        send_file File.expand_path('../static/index.html',  __FILE__)
    end
end

get '/' do
    redirect '/index.html'
end

error JSON::ParserError do
    status 400
    content_type :json
    {:errors => "Request body is not a correct JSON" }.to_json
end

error Sequel::NoMatchingRow do
    status 404
    content_type :json
    {:errors => "Resource not found"}.to_json
end

error Sequel::Error do
    status 400
    content_type :json
    {:errors => env['sinatra.error']}.to_json
end
