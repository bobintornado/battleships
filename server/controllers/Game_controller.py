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
  solution = "" #the code

  if "application/json" in request.content_type:
    d = json.loads(request.body.getvalue())
    board = d['board']
    lan = d['language']
    solution = d['solution']
  else:
    board = request.params.get('board')
    lan = request.params.get('language')
    solution = request.params.get('solution')


  #hide ships up
  board = str(board)
  enemyBoard = str.replace(board, 's','-')

  tests = ">>> getMove('" + enemyBoard + "') \n '---B--'"

  response = json.loads(Utility.invoke_verify(solution,lan,tests))

  if "errors" in response:
    #return str(result['errors'])
    return json.dumps({"status":"error","message":"Your bot cannot be compiled.",
                        "errors":str(response['errors'])})
  else:
    newEnemyBoard = response['results'][0]['received']

  #return newEnemyBoard

  if moveValidation(board, enemyBoard, newEnemyBoard) == True :
    
    #following checking is more convenient, needs refactor later
    newBoard = ""
    boardList = list(board)
    index = 0

    # crying. so hard to refactor one
    try:
      index = newEnemyBoard.index("b")
    except Exception, e:
      return json.dumps({"status":"error","message":"Place a bomb!"}) 
    
    #Check Hiting or Missing
    if boardList[index] is 's':
      boardList[index] = 'h' 
    elif boardList[index] is '-':
      boardList[index] = 'm'
    else:
      return json.dumps({"status":"error","message":"Don't waste your bomb! Place it on empty cell only!"}) 
    
    newBoard = "".join(boardList)

    return json.dumps({"newBoard":newBoard,"winningStatus":winningStatus(newBoard)})
  
  else:
    errorMessage = moveValidation(board, enemyBoard, newEnemyBoard)
    return json.dumps({"status":"error", "message":errorMessage})

def winningStatus(board):
  if "s" in board:
    return False
  else:
    return True

def moveValidation(oldBoard,enemyBoard,newEnemyBoard):
  #validation remains undone
  # x = 0
  # #Production needs to be changed to 50
  # size = 3
  # for i in range(size):
  #   if enemyBoard[i] != newEnemyBoard[i]:
  #     x += 1
  # if x != 1:
  #   return "There are invalid number of cell changed!"
  return True





















