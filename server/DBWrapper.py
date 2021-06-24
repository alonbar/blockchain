import json
from typing import List
import os
class DBWrapper:
    def __init__(self) -> None:
        print('create DB Wrapper')
        self._campigns = []
        self.CAMPIGNS_FOLDER = 'campaigns'
        directory = self.CAMPIGNS_FOLDER
        #read all campigns
        if not os.path.exists(self.CAMPIGNS_FOLDER):
            os.makedirs(self.CAMPIGNS_FOLDER)
        for filename in os.listdir(directory):
            if filename.endswith(".json"):
                print(os.path.join(directory, filename))
                f = open(filename,)
                data = json.loads(f.read())
                f.close()
                self._campigns.append(data)
            else:
                continue
        #read all json files of ready campigns
    def addNewCampign(self,campignData) -> bool:
        campignName = campignData['address']
        #if (campignName in self._campigns):
        #    return False
        self._campigns.append(campignData)
        with open(self.CAMPIGNS_FOLDER + '/' +campignName + '.json', 'w') as outfile:
            json.dump(campignData, outfile)
        return True
    def getAllCampigns(self) -> List:
        return self._campigns
