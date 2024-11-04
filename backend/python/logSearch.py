import re
import os
import time
import io
from dataClasses import *



class LogSearcher:
    def __init__(self, username, logPath = "", lastUpdateDate = 0):
        self.username = username
        self.logPath = logPath
        self.lastUpdateDate = lastUpdateDate
        #os.chdir(logPath)
        #compiling regex for faster search
        self._cashSessionRegex = re.compile(r"(HH\d+ \w+ ([IV]+ )?)- .(\d+\.\d{2})-.(\d+\.\d{2}) - (\w+) (.+).txt")
        self._handRegex = re.compile(r"PokerStars Hand #(\d+).*\[(.*)\]")
        self._blindsRegex = re.compile(username + r": posts (small|big)|\*\*\* HOLE CARDS \*\*\*")
        self._streetRegex = re.compile(username + r": (folds|raises .\d+\.\d{2} to .(\d+\.\d{2})|(calls|bets) .(\d+\.\d{2}))|\(.(\d+\.\d{2})\) returned to " + username + "|\*\*\* (SUMMARY|TURN|RIVER|SHOW DOWN|FLOP) \*\*\*|.+: raises")
        self._summaryRegex = re.compile(username + r" .*\(.(\d+\.\d{2})\)|^\n")

    def getNewCashSessions(self):
        cash = r"HH\d+ \w+ ([IV]+ )?- (.\d+\.\d{2}-.\d+\.\d{2}) - \w+ [\w ']+"
        result = []
        for hh in os.listdir():
            print(hh)
            match = re.search(cash, hh)
            if(match != None):
                seconds = os.path.getmtime(self.logPath + "\\" + hh)
                if(seconds > self.lastUpdateDate):
                    result.append(hh)
        return result
                
    def getCashSession(self, ogName, fileName):
        session = CashSession()
        
        match = self._cashSessionRegex.search(ogName)
        if(match != None):
            session.name = match.group(1)
            session.sb = round(float(match.group(3)), 2)
            session.bb = round(float(match.group(4)), 2)
            session.currency = match.group(5)
            session.type = match.group(6)
            session.username = self.username
        
        file = io.open(fileName, mode="r", encoding="utf-8")

        hand = self.getNextCashHand(file, session)
        if(hand != None):
            session.date = hand.date
            session.addOtherStats(hand)
            session.hands += 1
        
            while(True):
                hand = self.getNextCashHand(file, session)
                if(hand == None): break
                #print(hand.toString())
                session.addOtherStats(hand)
                session.hands += 1

            sum = session.raised + session.call+ session.fold  + session.bet

            if(sum != 0):
                session.profit = round(session.profit, 2)
                session.vpip_percent = round((session.vpip / session.hands), 2)
                session.pfr_percent = round((session.pfr / session.hands), 2)
                session.agg_percent = round(((session.bet + session.raised) / (session.bet + session.raised + session.call + session. fold)), 2)
                session.wtsd_percent = round((session.showdown / session.hands), 2)
                session.wonSD_percent = round((session.wonShowdown / session.showdown), 2)
                session.profit_blinds = round((session.profit / session.bb), 2)
            else: return "error"
        
        file.close()

        #print(session.toString());
        return session
    
    def getNextCashHand(self, file, session): 
        #tracks money to be substracted from hand every new street
        money = 0
        secondBet = False
        hand = CashHand()
        
        #finding start of hand
        while(True):
            line = file.readline()
            if len(line) == 0: return None
            match = self._handRegex.search(line)
            if(match != None):
                hand.id = int(match.group(1))
                hand.date = match.group(2)
                break;
        
        #don't know how to get recognise position yet, fix later
        file.readline()
        
        #small blind / big blind
        while(True):
            line = file.readline()
            match = self._blindsRegex.search(line)
            if(match != None):
                if(match.group(1) == None): break
                elif(match.group(1)[0] == 's'): money = session.sb
                else: money = session.bb
            
        #streets
        while(True):
            line = file.readline()
            #print("___________________________________________________")
            #print("Line: ", line)
            match = self._streetRegex.search(line)

            if(match != None):
                if(match.group(6) != None):
                    char = match.group(6)[3]
                    hand.profit -= money
                    hand.profit = round(hand.profit, 2)
                    #print("NewStreet, subtracted from profit: ", money)
                    if(char == 'M'): break
                    else:
                        money = 0
                        secondBet = False
                        if(char == 'W'): hand.showdown = 1
                        elif(char == 'P'): hand.sawFlop = 1
                
                elif(match.group(5) != None):
                    #print("Returned, subtracted from money: ", match.group(5))
                    money -= float(match.group(5))
                    money = round(money, 2)
                elif(match.group(4) != None):
                    if(match.group(3)[0] == 'c'):
                        #print("Called, money: ", money)
                        hand.call += 1
                        money += float(match.group(4))
                        money = round(money, 2)
                        if (hand.sawFlop == 0): hand.vpip = 1
                    else:
                        #print("Betted, money: ", money)
                        money = round(float(match.group(4)), 2)
                        hand.bet += 1
                elif(match.group(2) != None):
                    hand.raised += 1
                    money = round(float(match.group(2)), 2)
                    if (hand.sawFlop == 0): 
                        hand.pfr = 1
                        hand.vpip = 1
                    if(secondBet):
                        hand.threeBet += 1
                    #print("Raised, money: ", money)
                elif(match.group(1) == None):
                    secondBet = True        
                else:
                    hand.profit -= money
                    hand.profit = round(hand.profit, 2)
                    hand.fold = 1
                    #print("Folded, subtracted from profit: ", money)
                    return hand
            
                                
        #summary
        while(True):
            line = file.readline()
            match = self._summaryRegex.search(line)
            if(match != None):
                if(match.group(1) == None): break
                hand.profit += round(float(match.group(1)),2)
                hand.profit = round(hand.profit, 2)
                if(hand.showdown): hand.wonShowdown = True
        
        return hand
