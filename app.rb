require 'sinatra'
require 'rubygems'

require 'sequel'
require 'json'
require 'dotenv'
Dotenv.load

DB = Sequel.connect(ENV['DATABASE_URL'])

set :show_exceptions, false
set :raise_error, true
['tournaments', 'events', 'challenges'].each do |path|
  get "/#{path}" do
     content_type :json
     DB[path.to_sym].all.to_json
  end

  get %r{/#{path}/(?<id>\d+)} do |id|
     content_type :json
     begin
       DB[path.to_sym].first!(:id=>id.to_i).to_json
     rescue Sequel::NoMatchingRow
       halt 404, {:error => "#{path[0...-1].capitalize} not found" }.to_json 
     end
  end
end




