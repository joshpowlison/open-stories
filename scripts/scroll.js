//Put a page into its div
function insertPage(fileNumber,fileContents){
	//Get the current position compared to the current page
	var curBox=document.getElementById("page-"+pageNumber).getBoundingClientRect().top;
	
	//Add the page
	document.getElementById("page-"+fileNumber).innerHTML=fileContents;
	document.getElementById("page-"+fileNumber).className="showPage";
	
	//Go back to the page we were reading before, and scroll by the distance we were from it before.
	document.getElementById("page-"+pageNumber).scrollIntoView();
	window.scrollBy(0,-curBox);
}

//Load and insert page. If already loaded, display it.
function getPage(pageInput){
	if(document.getElementById("page-"+pageInput).innerHTML==""){
		loadPage(pageInput);
	}else{
		document.getElementById("page-"+pageInput).className="showPage";
	}
	
	//Add the footer if we're loading the last page
	if(pageInput==totalPages){
		updateFooter();
		f.className="showPage";
	}
}

//For moving to another page
function changePage(x){
	
	//Determine where trying to go; set pageNumber based on
	if(x=="footer"){
		pageNumber=totalPages;
		startingAt="footer";
	}else{
		pageNumber=x;
		startingAt="page";
	}
	
	pageNumberUpdate(pageNumber);
	
	//If the page is already here, then just go to it!
	if(document.getElementById("page-"+pageNumber).hasAttribute("class")){
		if(startingAt=="footer"){
			scrollTo(f);
		}else{
			scrollTo(document.getElementById("page-"+pageNumber));
		}
		return;
	}

	//If the page isn't loaded, hide all of the currently visible pages and re-center
	for(i=document.getElementsByClassName("showPage").length;i>0;i--){
		document.getElementsByClassName("showPage")[i-1].removeAttribute("class");
	}

	//Then load the existent page
	getPage(pageNumber);
}

//Scroll to any page while taking the header into consideration
function scrollTo(element){
	element.scrollIntoView();
	window.scrollBy(0,-h.getBoundingClientRect().bottom);
}

//A function that runs on an interval and checks 1) if more pages need to be loaded and 2) the current page number
function positionCheckInterval(){

	//If the current page hasn't loaded, don't bother loading any others.
	if(!document.getElementById("page-"+pageNumber).hasAttribute("class")){
		return;
	}
	
	//Take you back to your starting page if you're still loading
	if(startingAt){
		if(startingAt=="footer"){
			scrollTo(f);
		}else{
			scrollTo(document.getElementById("page-"+pageNumber));
		}
	}

	//Load the next page if needed
	var nextToLoad=pageNumber+1;
	while(nextToLoad<=totalPages && document.getElementById("page-"+(nextToLoad-1)).hasAttribute("class") && document.getElementById("page-"+(nextToLoad-1)).getBoundingClientRect().top<window.innerHeight){
		if(!document.getElementById("page-"+nextToLoad).hasAttribute("class")){
			getPage(nextToLoad);
		}
		nextToLoad++;
	}

	//Load the previous page if needed
	var prevToLoad=pageNumber-1;
	while(prevToLoad>0 && document.getElementById("page-"+(prevToLoad+1)).hasAttribute("class") && document.getElementById("page-"+(prevToLoad+1)).getBoundingClientRect().bottom>h.getBoundingClientRect().bottom){
		if(!document.getElementById("page-"+prevToLoad).hasAttribute("class")){
			getPage(prevToLoad);
		}
		prevToLoad--;
	}

	//What's this for?
	if((nextToLoad<=totalPages && document.getElementById("page-"+(nextToLoad-1)).getBoundingClientRect().top<window.innerHeight) || (prevToLoad>0 && document.getElementById("page-"+prevToLoad).getBoundingClientRect().bottom>h.getBoundingClientRect().bottom)){
		return;
	}

	startingAt=false;

	//Change the page number
	while(pageNumber<totalPages && document.getElementById("page-"+(pageNumber+1)).hasAttribute("class") && document.getElementById("page-"+(pageNumber+1)).getBoundingClientRect().top<=h.getBoundingClientRect().bottom+(window.innerHeight*.15)){
		pageNumber++;
		pageNumberUpdate(pageNumber);
		/*if(document.getElementById("page-"+(pageNumber+10)) && document.getElementById("page-"+(pageNumber+0)).hasAttribute("class")){
			document.getElementById("page-"+(pageNumber+10)).removeAttribute("class");
		}*/
	}
	
	while(pageNumber>1 && document.getElementById("page-"+(pageNumber-1)).hasAttribute("class") && document.getElementById("page-"+(pageNumber-1)).getBoundingClientRect().bottom>h.getBoundingClientRect().bottom+(window.innerHeight*.15)){
		pageNumber--;
		pageNumberUpdate(pageNumber);
	}
}

//Start interval
goInt=setInterval(positionCheckInterval,500);