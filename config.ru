require 'rubygems'
require_relative 'app'
 

#map a directory including a directory listing
map "/js" do
    run Rack::Directory.new("./static/js")
end
 
map "/vendor" do
    run Rack::Directory.new("./static/vendor")
end

map "/css" do
    run Rack::Directory.new("./static/css")
end

run Sinatra::Application 