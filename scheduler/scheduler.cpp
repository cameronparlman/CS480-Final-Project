#include <cstdlib>
#include <iostream>
#include <stdio.h>
#include <vector>
#include <set> 
#include <sstream>
#include <fstream>

#define TESTING 1


using namespace std;
int main(int argc, char** argv){
	//file names 
	string new_files_name = "new.txt";	

	//data containers 
	vector<string> new_paths; //paths of files in from new directory
	set<string> file_names; //file names from new directory, with .mp4 extension
	vector<string> unique_files;//files to download with path to remote "new" directory


	//check cloud storage for new files 
	//pipe cloud storage directory "new" contents to file "new.txt"
	int j  = system("gsutil ls gs://bingcloudfacerec/new > new.txt ");	


	/*READ LINES FROM "new.txt" INTO VECTOR files 
	*/
	string line;
	ifstream new_files(new_files_name.c_str());
	while(getline(new_files, line)){
		new_paths.push_back(line);	
	}

	/*PARSE THE FILES FROM "new"  DIRECTORY 
		add the names to set file_names 
	*/
	for(int i = 0 ; i < new_paths.size(); i++){
		string name = new_paths[i].substr(new_paths[i].find_last_of('/')+1);
		if(name.substr(name.find_last_of('.')+1) == "mp4"){
		cout << " name is a mp4\n";	
			file_names.insert(name);
			//unique_files.insert(new_paths[i]);
		}
		cout << "name " << name << "\n";			
		cout << new_paths[i] << "\n";
	}


	/*DOWNLOAD FILES TO "new" DIRECTORY
	*/
	set<string>::iterator it;
	for(it = file_names.begin(); it != file_names.end(); it++){
		cout << *it;
		string dl_file = "gsutil cp gs://bingcloudfacerec/new/" + *it + " new";
		j = system(dl_file.c_str());	

		//delete files from remote "new" directory
		if( ! TESTING){
			string delete_file = "gsutil rm gs://bingcloudfacerec/new/" + *it;
			j = system(delete_file.c_str());
			file_names.erase(*it);
		}
	}	



	// need to keep track of split video names ... 
	
	//call split video on file names contained in set "file_names"

}














