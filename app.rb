class Settings < Settingslogic
  source "#{Rails.root}/config/application.yml"
  namespace Rails.env
  load!
end

require 'sinatra'
require 'sequel'

post '/auth' do

end

get '/tournaments' do

end

post '/tournaments' do
 
end

get '/tournaments/:id' do 

end

put '/tournaments/:id' do 

end

delete '/tournaments/:id' do 

end

get '/events' do

end

post '/events' do
 
end

get '/events/:id' do 

end

put '/events/:id' do 

end

delete '/events/:id' do 

end

get '/challenges' do

end

post '/challenges' do
 
end

get '/challenges/:id' do 

end

put '/challenges/:id' do 

end

delete '/challenges/:id' do 

end
