import sys
from logSearch import LogSearcher
import json

n = len(sys.argv)
if n != 4:
    sys.stdout.write("error")
    sys.exit(0)

username = sys.argv[1]
og_name = sys.argv[2]
filePath = sys.argv[3]

searcher = LogSearcher(username)
session = searcher.getCashSession(og_name, filePath)
if(session == "error"):
    sys.stdout.write("error")
    sys.exit(0)
jsonStr = json.dumps(session.__dict__) 

sys.stdout.write(jsonStr)
sys.exit(0)
