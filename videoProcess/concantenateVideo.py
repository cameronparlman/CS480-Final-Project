#import necessary libraries
import os

#create command for command line to concatenate the files that were split as output
cmd = 'ffmpeg -i output-001.AVI -i output-002.AVI -i output-003.AVI -filter_complex "[0:v:0] [1:v:0] [2:v:0] concat=n=3:v=1 [v]" -map "[v]" output_video.AVI'

#Have system issue the call to the ffmpeg command
os.system(cmd);
