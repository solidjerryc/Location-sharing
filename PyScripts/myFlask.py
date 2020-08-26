# -*- coding: utf-8 -*-
from flask import Flask
from flask import request
from dbConnection import DbConnection
import urllib.parse

url='postgresql://jerry:Gis@2020@101.133.215.172/nnu_spatial_db'
app = Flask(__name__,static_folder='/')

@app.route('/api', methods=['POST', 'GET'])
def uploadData():
    '''
    Create the API to receive the data from client and return the locations of the all client back
    '''
    #print(request.method)
    reqData=dict([urllib.parse.unquote(i).split('=') for i in request.query_string.decode().split('&')])
    print(reqData)
    try:
        user=reqData['user']
    except:
        user='Nobody'
    try:
        lat=reqData['lat']
        lon=reqData['lon']
        sessionid=reqData['sessionid']
    except:
        lon, lat, sessionid='','',''
    #print(user, [lon, lat], sessionid)
    
    db=DbConnection(url)
    dt=db.updateUserLocation(user, [lon, lat], sessionid)
    del(db)
    return str(dt)

# @app.route('/logout', methods=['POST', 'GET'])
# def logOut():
#     reqData=dict([i.split('=') for i in request.query_string.decode().split('&')])
#     try:
#         user=reqData['user']
#     except:
#         return
#     try:
#         sessionid=reqData['sessionid']
#     except:
#         return
#     db=DbConnection(url)
#     dt=db.userLogOut(user, sessionid)

if __name__ == "__main__":
    app.run()