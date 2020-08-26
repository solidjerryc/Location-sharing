# -*- coding: utf-8 -*-
from sqlalchemy import create_engine
import datetime

'''
The session id is always 1 right now. This parameter is for the extension in the future
'''
class DbConnection:
    '''
    -- DDL of the database
    create table locations(
        session int,
        name varchar(40) primary key,
        geom geometry(point, 4326),
        lasttime timestamp 
    );
    '''
    def __init__(self, url):
        engine=create_engine(url)
        self.conn=engine.connect()

    def getAll(self):
        '''
        get all data from datavase
        '''
        fetchQuery=self.conn.execute('select * from locations;')
        for data in fetchQuery.fetchall():
            print(data)

    def __del__(self):
        if not self.conn.closed:
            self.conn.close()
            #print("closed")
    def getAllLocations(self, sessionid):
        '''
        Get all data and return the String
        '''
        fetchQuery=self.conn.execute(f'select name, ST_x(geom), ST_y(geom),  to_char(lasttime, \'YYYY-MM-DD HH24:MI:SS\') from locations where session={sessionid};')
        out= [data for data in fetchQuery.fetchall()]
        return out

    def userLogOut(self, userName, sessionid):
        '''
        When user log out, delete it from database. But somehow it doesn't work. 
        So if the user log out, wait 1 minutes to expire the data.
        '''
        self.conn.execute(f"delete from locations where sessionid={sessionid} and name='{userName}';")

    def updateUserLocation(self, user, location, sessionid):
        self.conn.execute(f"delete from locations where '{str(datetime.datetime.utcnow())}'-lasttime>'00:01:00';")
        dt=self.getAllLocations(sessionid)
        for i in dt:
            if user==i[0]:#update locations set geom='SRID=4326;Point(13 47)', lasttime='2020-03-25 10:58:49.760282' where name='Jerry'; 
                self.conn.execute(f"update locations set geom='SRID=4326;Point({location[0]} {location[1]})', lasttime='{str(datetime.datetime.utcnow())}' where name='{user}' and session={sessionid}; ")
                return self.getAllLocations(sessionid)
        self.conn.execute(f"insert into locations values({sessionid}, '{user}', 'SRID=4326;Point({location[0]} {location[1]})', '{str(datetime.datetime.utcnow())}');")
        return self.getAllLocations(sessionid)
        ## TODO insert into locations values(1, 'Jerry', 'SRID=4326;Point(13 47)', '2020-03-05 21:30:20');
        
if __name__=="__main__":
    '''
    Test code
    '''
    url='postgresql://jerry:Gis@2020@101.133.215.172/nnu_spatial_db'
    db=DbConnection(url)
    db.getAllLocations(1)
    db.updateUserLocation('Jerry', [13, 48], 1)
    d=db.updateUserLocation('Tom', [13, 48], 1)
    print(d)