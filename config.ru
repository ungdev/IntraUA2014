require 'rubygems'
require './app'

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

map "/img" do
    run Rack::Directory.new("./static/img")
end

map "/swf" do
    run Rack::Directory.new("./static/swf")
end

use Rack::Static, :urls => ["/crossdomain.xml"]

run Sinatra::Application
