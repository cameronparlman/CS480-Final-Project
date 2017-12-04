all: compile

compile: scheduler.cpp
	g++ scheduler.cpp -o  driver
	g++ splitter.cpp -o splitter -std=c++0x
	g++ uploader.cpp -o uploader -std=c++0x
run:

clean:
	rm -f new/*
	rm -f driver splitter uploader
	rm -f split/*
	
