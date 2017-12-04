# import the necessary packages
from imutils.video import VideoStream
from imutils.video import FPS
import face_recognition
import numpy as np
import argparse
import imutils
import time
import cv2
import multiprocessing

label = ""
# initialize the list of class labels MobileNet SSD was trained to
# detect, then generate a set of bounding box colors for each class
CLASSES = ["background", "aeroplane", "bicycle", "bird", "boat",
	"bottle", "bus", "car", "cat", "chair", "cow", "diningtable",
	"dog", "horse", "motorbike", "person", "pottedplant", "sheep",
	"sofa", "train", "tvmonitor"]

COLORS = np.random.uniform(0, 255, size=(len(CLASSES), 3))
counter = 0
(h,w) = (0,0)
output = None
# load our serialized model from disk
net = cv2.dnn.readNetFromCaffe("MobileNetSSD_deploy.prototxt.txt", "MobileNetSSD_deploy.caffemodel");
 
vs = VideoStream(0).start();
time.sleep(2.0)

# loop over the frames from the video stream
while True:
	print(multiprocessing.cpu_count());
	frame = vs.read()

	# grab the frame dimensions and convert it to a blob
	(h, w) = frame.shape[:2]	

	if output is None:
		output = cv2.VideoWriter('output.AVI', cv2.VideoWriter_fourcc(*'MJPG'), 10.0, (w,h), True)	
	
# grab the frame from the threaded video stream and resize it
	# to have a maximum width of 400 pixels
	if counter%5 == 0:	
	 
		blob = cv2.dnn.blobFromImage(cv2.resize(frame, (300, 300)),
			0.007843, (300, 300), 127.5)

		# pass the blob through the network and obtain the detections and
		# predictions
		net.setInput(blob)
		detections = net.forward()
		# loop over the detections
		for i in np.arange(0, detections.shape[2]):
			# extract the confidence (i.e., probability) associated with
			# the prediction
			confidence = detections[0, 0, i, 2]

			# filter out weak detections by ensuring the `confidence` is
			# greater than the minimum confidence
			if confidence > .4:
				# extract the index of the class label from the
				# `detections`, then compute the (x, y)-coordinates of
				# the bounding box for the object
				idx = int(detections[0, 0, i, 1])
				box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
				(startX, startY, endX, endY) = box.astype("int")
	 
				# draw the prediction on the frame
				label = "{}: {:.2f}%".format(CLASSES[idx],
					confidence * 100)
				detectionFrame = cv2.rectangle(frame, (startX, startY), (endX, endY),
					COLORS[idx], 2)
				y = startY - 15 if startY - 15 > 15 else startY + 15
				cv2.putText(frame, label, (startX, y),
					cv2.FONT_HERSHEY_SIMPLEX, 0.5, COLORS[idx], 2)
		
		frame = cv2.resize(frame, (w,h),interpolation = cv2.INTER_CUBIC)

		output.write(frame)		
		# show the output frame
		cv2.imshow("Frame", frame)
		key = cv2.waitKey(1) & 0xFF
	 
		# if the `q` key was pressed, break from the loop
		if key == ord("q"):
			break
	 
	counter+=1
 
# do a bit of cleanup
cv2.destroyAllWindows()
vs.stop()
