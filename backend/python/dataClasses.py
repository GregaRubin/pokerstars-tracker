
#vpip = how many calls/raises preflop
#pfr = how many raises preflop
#wtsd = how many times went to showdown
#w$sd = how many times won at showdown
#agg = (bet + raise) / (bet + raise + call  + fold)
#3bet = how many bet -> raise -> reraise

class Stats:
    def __init__(self):
        self.profit = 0
        self.call = 0
        self.bet = 0
        self.raised = 0
        self.threeBet = 0
        self.fold = 0
        self.sawFlop = 0
        self.showdown = 0
        self.wonShowdown = 0
        self.vpip = 0
        self.pfr = 0
    
    def addOtherStats(self, other):
        self.profit += other.profit
        self.call += other.call
        self.bet += other.bet
        self.raised += other.raised
        self.threeBet += other.threeBet
        self.fold += other.fold
        self.showdown += other.showdown
        self.wonShowdown += other.wonShowdown
        self.vpip += other.vpip
        self.pfr += other.pfr
        
    def toString(self):
        temp = f"Profit: {self.profit}\nCall|bet|raise|fold|3bet: "+ str(self.call) + "|" + str(self.bet) + "|" + str(self.raised) + f"|{self.fold}" + "|" + str(self.threeBet) + f"\nVpip: {self.vpip}\nPfr: {self.pfr}\nShowdown: {self.showdown}\nWon showdown: {self.wonShowdown}"
        return temp
    
    def toJson(self):
        return ""
        

class CashSession(Stats):
    def __init__(self):
        super().__init__()
        self.name = ""      #example: HH20120603 Anius IV
        self.type = ""      #exmaple: No Limit Hold'em
        self.bb = 0
        self.sb = 0
        self.currency = ""  #exmaple: USD
        self.hands = 0
    
    def toString(self):
        temp = f"{self.name}\n{self.type}\n{self.sb} - {self.bb} {self.currency}\nHands: {self.hands}\n"
        temp += super().toString()
        return temp
        
class CashHand(Stats):
    def __init__(self):
        super().__init__()
        #self.position = "" harder to implement, see getNextHand comment
        self.id = 0
        self.date = ""
             
    def toString(self):     
        temp = f"Hand id: {self.id}\nDate: {self.date}" + "\nProfit:" + str(self.profit) +"\nCall|bet|raise|fold|3bet: "+ str(self.call) + "|" + str(self.bet) + "|" + str(self.raised) + f"|{int(self.fold)}" + "|" + str(self.threeBet) + f"\nVpip: {self.vpip}\nPfr: {self.pfr}\nShowdown: {self.showdown}\nWon showdown: {self.wonShowdown}"
        return temp