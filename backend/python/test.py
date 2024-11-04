from logSearch import *
import re
import time

name = "HH20210319 Bobone IV - $0.01-$0.02 - USD No Limit Hold'em.txt"
searcher = LogSearcher("VirtuousHope", "E:\masterclass\HandHistory\VirtuousHope")
hh = searcher.getNewCashSessions();


stats = Stats()
hands = 0

t1 = time.time()

for h in hh:
    ses = searcher.getCashSession(h)
    print(ses.toString(), "\n")
    stats.addOtherStats(ses)
    hands += ses.hands
t2 = time.time()

print("Hands: ", hands)
print(stats.toString())
 
    

"""
def pr(x):
    for i in range(7):
        print(x.group(i))

regex = r"u: (folds|raises .\d+\.\d{2} to .(\d+\.\d{2})|(calls|bets) .(\d+\.\d{2}))|\(.(\d+\.\d{2})\) returned to u|\*\*\* (SUMMARY|TURN|RIVER|SHOW DOWN|FLOP) \*\*\*|.+: raises"
t1= "u: folds"
t2 = "u: raises $2.12 to $3.11"
t3 = "u: bets $0.99"
t4 = "u: calls $2.12"
t5 = "($1.11) returned to u"
t6 = "*** FLOP ***"
t7 = "*** SUMMARY ***"
t8 = "random: raises"
x = re.search(regex, t1)
pr(x)
print("-----------------------------------")
x = re.search(regex, t2)
pr(x)
print("-----------------------------------")
x = re.search(regex, t3)
pr(x)
print("-----------------------------------")
x = re.search(regex, t4)
pr(x)
print("-----------------------------------")
x = re.search(regex, t5)
pr(x)
print("-----------------------------------")
x = re.search(regex, t6)
pr(x)
print("-----------------------------------")
x = re.search(regex, t7)
pr(x)
print("-----------------------------------")
x = re.search(regex, t8)
pr(x)
print("-----------------------------------")

"""
