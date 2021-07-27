'''server/app.py - main api app declaration'''
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS, cross_origin
from flask_socketio import SocketIO, join_room
import os

'''Main wrapper for app creation'''
app = Flask(__name__, static_folder='./build')
socketio = SocketIO(app, cors_allowed_origins='*')
CORS(app)

# Active users list
activeUsers = []

##
# Sockets
##

@socketio.on('join')
def handleJoin(user):
  activeUsers.append({'username': user["username"], 'sid': request.sid, 'emoji': user["emoji"]})
  join_room(request.sid)
  socketio.emit('update', activeUsers, broadcast=True)

@socketio.on('send')
def handleTransfer(data):
  socketio.emit('update', activeUsers, broadcast=True)

@socketio.on('upload')
def handleTransfer(data):
  socketio.emit('download', data, room=data["receiver"])

@socketio.on('high')
def handleHigh(data):
  socketio.emit('five', data, room=data["sender"])

@socketio.on('disconnect')
def handleDisc():
  for key in activeUsers:
    sid = key["sid"]
    if (sid == request.sid) : activeUsers.pop(activeUsers.index(key))
  socketio.emit('update', activeUsers, broadcast=True)



##
# API routes
##

##
# View route
##
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def index(path):
  '''Return index.html for all non-api routes'''
  #pylint: disable=unused-argument
  return send_from_directory(app.static_folder, 'index.html')
##
# Run App
##
socketio.run(app)