//Autoformat checks that the code is secure and applies automatic formatting if the creator uses the [AUTOFORMAT] tag at the top of the document.
function autoformat(text){
   //If a <script> tag is detected, it's possible your site was hacked. <script> tags are blocked for user protection. You can remove this if you want.
	if((text.toLowerCase()).search("script>")>-1 || (text.toLowerCase()).search("<script")>-1){return "<em><strong>This page appears to be corrupted. Our ninja-bots have blocked it for your safety.</strong></em>";}
	//If text includes [AUTOFORMAT] automatically format the file
	if(text.indexOf("[AUTOFORMAT]")>-1){
		return text
		   .replace(/(?!\[AUTOFORMAT\]\s*<h[r123456])\[AUTOFORMAT\]\s*/,"<p>") //Take care of AUTOFORMAT if next tag is a heading or hr tag
		   .replace(/\[AUTOFORMAT\]\s*/,"") //Take care of AUTOFORMAT
	      .replace(/(?!\n+<h[r123456])\n+(?!\n+<h[r123456])/g,"</p><p>") //Add p tags where there aren't any between empty spaces
	      +"</p>";
	}else{
		return text;
	}
}

//Loading a file to put into the page
function loadPage(fileNumber){

   //If the file hasn't already been loaded and is in the cache
	if(typeof pages[fileNumber]==='undefined'){

      //Add leading zeroes if they've been specified
		if(parseInt(fileNameLeadingZeroLength)==0){
			fileName=fileNumber;
		}else{
			fileName=padZero(fileNumber,fileNameLeadingZeroLength);
		}
		
      //Make an AJAX call for the page
		pages[fileNumber]=new XMLHttpRequest();
		//Take into account the language (for a folder), the filename, and the extension
		pages[fileNumber].open("POST",language+"/"+fileName+"."+fileType,true);
		pages[fileNumber].send();
		
		//Insert the page (or an error message) once the file has loaded (or failed to load)
		pages[fileNumber].onreadystatechange=function(){
			if(pages[fileNumber].readyState==4){
				if(pages[fileNumber].status==200){
					insertPage(fileNumber,autoformat(pages[fileNumber].responseText));
				}else{
					insertPage(fileNumber,"<span style='color:red;'>Page "+fileNumber+" wasn't found (404 Error!</span>");
				}
			}
		}
	}else{//If the file's already been loaded, just throw it in and don't bother to make an AJAX call for it!
		insertPage(fileNumber,autoformat(pages[fileNumber].responseText));
	}
}