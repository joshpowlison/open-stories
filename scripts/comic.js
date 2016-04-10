function loadPage(fileNumber){

if(typeof pages[fileNumber]==='undefined'){

	if(parseInt(fileNameLeadingZeroLength)==0){
		fileName=fileNumber;
	}else{
		fileName=padZero(fileNumber,fileNameLeadingZeroLength);
	}

	pages[fileNumber]=new Image();
	pages[fileNumber].src=language+"/"+fileNumber+"."+fileType;
	pages[fileNumber].alt="Page "+fileNumber;
	pages[fileNumber].onload=function(){
   			insertPage(fileNumber,"<img src='"+pages[fileNumber].src+"' alt='"+pages[fileNumber].alt+"'>");
   		}
   }else{
		insertPage(fileNumber,"<img src='"+pages[fileNumber].src+"' alt='"+pages[fileNumber].alt+"'>");
	}
}