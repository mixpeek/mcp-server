import os
import sys


# Ensure project root (containing server.py) is on import path
ROOT = os.path.dirname(os.path.dirname(__file__))
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)


