"""Main.py is the top level script.

Loads the Bottle framework and mounts controllers.  Also adds a custom error
handler.
"""

# import the Bottle framework
from server.lib import bottle
from server.lib.bottle import Bottle, static_file 
# TODO: name and list your controllers here so their routes become accessible.
from server.controllers import Bot_controller
from server.controllers import Board_controller
from server.controllers import Game_controller

# Enable debugging, which gives us tracebacks
bottle.DEBUG = True
# Run the Bottle wsgi application. We don't need to call run() since our
# application is embedded within an App Engine WSGI application server.
bottle = Bottle()

# Mount a new instance of bottle for each controller and URL prefix.
bottle.mount("/Bot", Bot_controller.bottle)
bottle.mount("/Board", Board_controller.bottle)
bottle.mount("/Game", Game_controller.bottle)

@bottle.route('/')
def server_static(filename="index.html"):
  return static_file(filename, root='./frontend/app/')

@bottle.route('/<filepath:path>')
def server_static(filepath):
  return static_file(filepath, root='./frontend/app/')

@bottle.error(404)
def error_404(error):
  """Return a custom 404 error."""
  return 'Sorry, Nothing at this URL.'