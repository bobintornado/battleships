from server.lib.bottle import Bottle, debug,request
import json
from difflib import Differ 
# use the Jinja templating system
from view_helper import JINJA_ENV

import Utility

bottle = Bottle() # create another WSGI application for this controller and resource.
debug(True) #  uncomment for verbose error logging. Do not use in production

@bottle.post('/getNewBoard')
def getNewBoard():
  board = ""
  lan = ""
  solution = ""

  if "text/plain" in request.content_type:
    d = json.loads(request.body.getvalue())
    board = d['board']
    lan = d['language']
    solution = d['solution']
  else:
    board = request.params.get('board')
    lan = request.params.get('language')
    solution = request.params.get('solution')

  #hide ships up
  enemyBoard = str.replace(board, 's','-')

  tests = ">>> getMove('" + enemyBoard + "') \n '---B--'"

  response = json.loads(Utility.invoke_verify(solution,lan,tests))

  if "errors" in response:
    #return str(result['errors'])
    return json.dumps({"status":"error","message":"Your bot cannot be compiled.",
                        "errors":str(response['errors'])})
  else:
    newEnemyBoard = response['results'][0]['received']

    if moveValidation(board,enemyBoard, newEnemyBoard):
      try:
        i = newEnemyBoard.index('B')
      except ValueError:
        return json.dumps({"status":"error","message":"Don't forget to place put a Bomb~"})
      
      newBoard = ""
      boardList = list(board)
      
      if boardList[i] is 's':
        boardList[i] = 'h' 
      elif boardList[i] is '-':
        boardList[i] = 'm'
      else:
        return json.dumps({"status":"error","message":"Don't waste your bomb! Place it on empty cell only!"}) 
      
      newBoard = "".join(boardList)

      return json.dumps({"newBoard":newBoard,"winningStatus":winningStatus(newBoard)})
    else:
      return json.dumps({"status":"error","message":"Your codes failed validation"})

def winningStatus(board):
  if "s" in board:
    return False
  else:
    return True

def moveValidation(oldBoard,enemyBoard,newEnemyBoard):
  #validation remains undone
  return True





















