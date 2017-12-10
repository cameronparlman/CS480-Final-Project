#Create necessary imports
import subprocess
import os
import sys
import math

#Function to get the duration of the video file by calling ffprobe
def getLength(filename):
  result = subprocess.Popen(['ffprobe', filename],
    stdout = subprocess.PIPE, stderr = subprocess.STDOUT)
  return [x for x in result.stdout.readlines() if bytes("Duration", "utf-8") in x]

#Call function to get the length of the 
videoInfo = getLength(sys.argv[1]);

#get the duration a decode the file information
firstVideoInfo = videoInfo[0].decode("utf-8");

#Split the duration and convert to seconds
duration = firstVideoInfo[12:23].split(":");
totalSeconds = (int(duration[0])/3600) + (int(duration[1])/60) + float(duration[2]);
seconds = str(int(math.ceil(totalSeconds/3)));

#make the command line call 
cmd = './splitVideoScript.sh ' + sys.argv[1] + ' %s' % seconds;

#call the command on the command line
os.system(cmd);
