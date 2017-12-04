import subprocess
import os

def getLength(filename):
  result = subprocess.Popen(['ffprobe', filename],
    stdout = subprocess.PIPE, stderr = subprocess.STDOUT)
  return [x for x in result.stdout.readlines() if bytes("Duration", "utf-8") in x]

videoInfo = getLength("output.AVI"); 
firstVideoInfo = videoInfo[0].decode("utf-8");
duration = firstVideoInfo[12:23].split(":");
totalSeconds = (int(duration[0])/3600) + (int(duration[1])/60) + float(duration[2]);
seconds = str(int(totalSeconds/3));

cmd = './splitVideoScript.sh output.AVI %s' % seconds;
os.system(cmd);
