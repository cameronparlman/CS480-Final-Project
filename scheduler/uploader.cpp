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
//upload to storage video segment files 
int main(int argc, char** argv){
        set<string> files_to_upload;
        
	//read the files contained in local "split" directory 
        DIR *dir;
        struct dirent *ent;
        if ((dir = opendir ("./split/")) != NULL) {
          /* print all the files and directories within directory */
          while ((ent = readdir (dir)) != NULL) {
                string name = ent->d_name;
                 if(name.substr(name.find_last_of('.')+1) == "mp4"){
                    files_to_upload.insert(ent->d_name);
                }
          }
          closedir (dir);
        } else {
          /* could not open directory */
          perror ("");
          return EXIT_FAILURE;
        }

	//upload files 
	set<string>::iterator it;
	for(it = files_to_upload.begin() ; it != files_to_upload.end(); it++){
		cout << *it << endl;
		string fileToCopy = *it;
		//build command to upload files in split directory 
		string command = string("gsutil cp ./split/") + fileToCopy.c_str() + string(" gs://bingcloudfacerec/split/");              
		int j = system(command.c_str());
		//upload to cloud 
		
                
        }
        			
	
	

}
             
