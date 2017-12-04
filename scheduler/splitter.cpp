#include <cstdlib>
#include <iostream>
#include <stdio.h>
#include <vector>
#include <set>
#include <sstream>
#include <fstream>
#include <dirent.h>
#include <string>

using namespace std;
//read local "new" directory for files 
int main(int argc, char** argv){
	set<string> files_to_split;
	
	//read in the new files 
	DIR *dir;
	struct dirent *ent;
	if ((dir = opendir ("./new/")) != NULL) {
	  /* print all the files and directories within directory */
	  while ((ent = readdir (dir)) != NULL) {
		string name = ent->d_name;
		 if(name.substr(name.find_last_of('.')+1) == "mp4"){
		    files_to_split.insert(ent->d_name);
		}
	  }
	  closedir (dir);
	} else {
	  /* could not open directory */
	  perror ("");
	  return EXIT_FAILURE;
	}
	

	/* "SEGMENT VIDEO IN 3" AND ADD NUMBER EXTENTION TO VIDEO SEGMENTS 
			
	*/
        set<string>::iterator it;
	int splits = 3;
        for(it = files_to_split.begin() ; it != files_to_split.end(); it++){
                cout << *it << endl;
		string fileToCopy = *it;
		size_t pos = fileToCopy.find('.');
		string file_name = fileToCopy.substr(0,pos);
		for(int i = 0 ; i < splits; i++){
			//build command to copy to split directory 
			string fileSeg = file_name + "_" + to_string(i) + ".mp4";
			string command = string("cp new/") + fileToCopy.c_str() + " split/"+fileSeg.c_str();
			int j = system(command.c_str());
			//upload to cloud 
	
		}
    
        }


}
