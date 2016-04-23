//For moving to another page
function changePage(x){
	//Hide the page that's currently showing
	if(document.getElementsByClassName("showPage").length>0){
		document.getElementsByClassName("showPage")[0].removeAttribute("class");
	}
	
	//Head to the footer if that's what the user wanted
	if(x>totalPages || x=="footer"){
		x=totalPages;
		//Update the classname of the chosen page so it shows
		document.getElementById("footer").className="showPage";
	}else{
		//Update the classname of the chosen page so it shows
		document.getElementById("page-"+x).className="showPage";
	}
	
	//Set the page number
	pageNumber=x;
	
	//If the page hasn't been loaded before, load it now
	if(document.getElementById("page-"+pageNumber).innerHTML==""){
		loadPage(pageNumber);
	}
	
	//Preload the next page/footer and previous page if they aren't already loaded and they exist
	//Next page
	if(pageNumber<totalPages && document.getElementById("page-"+(pageNumber+1)).innerHTML==""){
		loadPage(pageNumber+1);
	}
	
	//Previous page
	if(pageNumber>1 && document.getElementById("page-"+(pageNumber-1)).innerHTML==""){
		loadPage(pageNumber-1);
	}
	
	//Footer
	if(pageNumber==totalPages && document.getElementById("footer").innerHTML==""){
		updateFooter();
	}
	
	//Update the page number and update the user's bookmark
	pageNumberUpdate(pageNumber);
	
	//Scroll to the beginning of the page
	window.scrollTo(0,0);
}

//For inserting a loaded page
function insertPage(fileNumber,fileContents){
	document.getElementById("page-"+(fileNumber)).innerHTML=fileContents;
}

//Turning the pages
function turnPage(thisEvent){
	//If a dropdown is down, don't allow page turning
	if(profileButton.dataset.active=="true" || storyButton.dataset.active=="true"){
		return;
	}

	//Check where clicked/tapped and change pages based on that
	if(thisEvent.clientX<window.innerWidth*.25){
		//Previous page
		
		//If checking out the footer, go to last page
		if(f.className){
			changePage(totalPages);
			return;
		}
		
		//Check that CAN go to previous page
		if(pageNumber>1){
			changePage(pageNumber-1);
		}else{
			notificationOpen("You're already on the first page!");
		}
		
	}else{
		//Next page
		
		//Check that CAN go to a next page
		if(pageNumber<totalPages || (!f.className && f.textContent.replace(/\s*/,"")!=="")){
			changePage(pageNumber+1);
		}else{
			notificationOpen("You're already at the end of the story!");
		}
	}
}

//Setting up page turning
function setUpTurnPage(){
	if(setUpAttempts>=100){
		notificationOpen("Failed to load correctly; try refreshing the page!");
	}
	
	//Make sure m (the main element) exists
	if(typeof m=="undefined"){
		window.setTimeout(setUpTurnPage,100);
	}else{
		m.onclick=function(event){turnPage(event)};
	}
	
	setUpAttempts++;
}

setUpAttempts=0;
setUpTurnPage();