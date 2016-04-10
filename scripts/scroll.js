//May be useful for specific forms
function startFormUnique(){}

//Puts a page of the story into the webpage
function insertPage(fileNumber,fileContents){

	/////General Requests/////
	loadStorySpecificAttempts=0;
		if(typeof loadPage=='function'){
			console.log("loadPage available");
		}else{
			loadStorySpecificAttempts++;
			console.log("Waiting for other script file with loadPage to load.");
			if(loadStorySpecificAttempts<100){
				setInterval(function(fileNumber,fileContents){
					insertPage(fileNumber,fileContents);
				},100);
			}else{
				notificationOpen("Failed to load needed files; try refreshing the page.");
			}
			return;
		}

   //We don't want the added pages to mess with the user's reading position; so we'll track a page and scroll opposite the "push" the added pages will give. If the page pushes us down 50 pixels, we'll scroll up 50 pixels and the user won't notice much if any of a push.
	scrollAnchor=pageNumber;
	
	var curBox=document.getElementById("page-"+parseInt(scrollAnchor)).getBoundingClientRect().top;

   //Put the loaded page into the document
	document.getElementById("page-"+(fileNumber)).innerHTML=fileContents;

   //If we just changed pages, then start the loop to keep track of scrolling and motion
	if(fileNumber==pageNumber){
		for(ii=0;ii<10;ii++){qInt();}

   //Keeps position relatively close when a new page is added
		var curBoxS=h.getBoundingClientRect();
		window.scrollBy(0,-curBoxS.bottom);
		if(intervalRunning==false){
			goInt=setInterval(qInt,500);
			intervalRunning=true;
		}
	}
	
	//See if should notify the user that the previous or next page is loading (just before or after the currently loaded content, not in a pop-up notification)
	if(fileNumber<pageNumber){
		loadingPrevious.className="";
	}else if(fileNumber>pageNumber || fileNumber==totalPages){
		loadingNext.className="";
	}
	
	//If this is our starting page, we want to stick to it until enough surrounding content is loaded for us to move freely
	if(startingAt){
		if(startingAt=="footer"){
			scrollTo(f);
		}else{
			scrollTo(document.getElementById("page-"+pageNumber));
		}
		
	}else{
		//Get the top of the current page relative to the screen from before we added a page. Now scrollIntoView this page, and scroll back up by the amount given.
		document.getElementById("page-"+parseInt(scrollAnchor)).scrollIntoView();
		window.scrollBy(0,-curBox);
	}

   //If we've loaded the last page, display the footer as well
	if(fileNumber==totalPages){
		f.className="";
		updateFooter();
	}

   //See if we can load/have pages to load before or after the current page
	if(fileNumber<pageNumber){
		canLoadPrevious=true;
	}else if(fileNumber>pageNumber){
		canLoadNext=true;
	}
}

//Set up the website divs in the page container. Each part of the story goes into a numbered div.
function pageDivs(){
   //Create the divs
	pageIdDivs="";
	for(i=1;i<=totalPages;i++){
		pageIdDivs+="<div id='page-"+i+"'></div>";
	}
	//Insert the divs
	document.getElementById("page").innerHTML=pageIdDivs;
}

//Move to another page
function changePage(x){
	
	startingAt="page"; //Will pull you back to this page as you are loading
	//Give wiggle room
	document.getElementsByTagName("MAIN")[0].style.padding=window.innerHeight+"px 0 "+window.innerHeight+"px 0";
	
	//Hides loading divs
	loadingPrevious.className="";
	loadingNext.className="";

	//Safety guard from NaN-ers. Basically, if the website tries to load a nonexistent page
	if(isNaN(x) && x!=="footer"){
		x=totalPages;
	}else if(x>=totalPages){//If you're trying to go to a page further than the last page, don't
		x=totalPages;
	}else if(x=="footer"){//We can go to the footer if that's what's being asked
		x=totalPages;
		startingAt="footer";
		m.style.opacity=0;
	}else
	//If the user's trying to go to a page before the first page, go to the first page
	if(x<1){
		x=1;
	}
	
	//If the page is already loaded and available, then just go to it!
	//But it's possible the divs haven't been set up yet, in which case this needs to loop around
	if(document.getElementById("page-"+x) && document.getElementById("page-"+x).innerHTML!=="" && document.getElementById("page-"+totalPages).getBoundingClientRect().bottom-document.getElementById("page-"+x).getBoundingClientRect().top>=window.innerHeight){
		if(startingAt=="footer"){
			m.style.padding="0";
			scrollTo(f);
			console.log("9");
			startingAt=false;
			m.style.opacity=1;
			return;
		}else{
			scrollTo(document.getElementById("page-"+x));
			return;
		}
	}
	
	pageNumber=x;
	pageNumberUpdate(pageNumber);

	//Set up the divs
	pageDivs();

	//Setting container opacity to 0 lets it fade in once page is in proper placement (so the user doesn't see it jerking around)
	//document.getElementById("container").style.opacity="0";
	//document.getElementById("container").style.opacity=0;
	f.className="h";

   //Now that we've successfully set up a page change, let's load our first page! We know we can load surrounding pages because we're just getting started (and if we can't, that will be taken care of soon)
	loadPage(pageNumber);
	canLoadPrevious=true;
	canLoadNext=true;
}

//Scroll to an element, but take the header into account
function scrollTo(element){
	element.scrollIntoView();
	window.scrollBy(0,-h.getBoundingClientRect().bottom);
}

//An interval that keeps track of user position and loads previous and next pages before the user reaches them for a seamless experience
function qInt(){

   //If the current page hasn't been loaded yet, don't run the interval
	if(document.getElementById("page-"+pageNumber).innerHTML===""){
		return;
	}

   //Load the next pages before the previous
	var nextToLoad=pageNumber+1;
	while(canLoadNext && nextToLoad<=totalPages && document.getElementById("page-"+(nextToLoad-1)).getBoundingClientRect().top<window.innerHeight){
		if(document.getElementById("page-"+nextToLoad).innerHTML===""){
			loadPage(nextToLoad);
			canLoadNext=false;
			console.log("Loading:",nextToLoad);
			setTimeout(loadingShow(loadingNext,nextToLoad),2000);
		}
		nextToLoad++;
	}

   //Load the previous pages
	var prevToLoad=pageNumber-1;
	while(canLoadPrevious && prevToLoad>0 && document.getElementById("page-"+(prevToLoad+1)).getBoundingClientRect().bottom>h.getBoundingClientRect().bottom){
		if(document.getElementById("page-"+prevToLoad).innerHTML==""){
			loadPage(prevToLoad);
			canLoadPrevious=false;
			setTimeout(loadingShow(loadingPrevious,prevToLoad),2000);
		}
		prevToLoad--;
	}
	
	//If the reader could still use some wiggle-room behind and ahead of them, don't continue
	if((nextToLoad<=totalPages && document.getElementById("page-"+(nextToLoad-1)).getBoundingClientRect().top<window.innerHeight) || (prevToLoad>0 && document.getElementById("page-"+prevToLoad).getBoundingClientRect().bottom>h.getBoundingClientRect().bottom)){
		return;
	}

   //If the user's starting at this page (just loaded the website or changed pages with the page button), then stick to their starting page (or stick based off it so that if they started scrolling already they aren't slingshotted elsewhere)
	if(startingAt){
		scrollTo(document.getElementById("page-"+pageNumber));
		if(startingAt=="footer"){
			if(f.className!=="h" && f.innerHTML!==""){
				scrollTo(f);
			}
		}
	}
	
	//If being having problems, move both "while" statements below into the "if(canLoadNext && canLoadPrevious)" deal. Put it at the top of the block.
	
	//Check where are on the page; change page number accordingly
	//Only allow changing the page number once initial page loading has finished!
	if(startingAt==false){
   	while(pageNumber<totalPages && document.getElementById("page-"+(pageNumber+1)).innerHTML!=="" && document.getElementById("page-"+(pageNumber+1)).getBoundingClientRect().top<=h.getBoundingClientRect().bottom+(window.innerHeight*.15)){
   		pageNumber++;
   		pageNumberUpdate(pageNumber);
   	}
   
   	while(pageNumber>1 && document.getElementById("page-"+(pageNumber-1)).innerHTML!=="" && document.getElementById("page-"+(pageNumber-1)).getBoundingClientRect().bottom>h.getBoundingClientRect().bottom+(window.innerHeight*.15)){
   		pageNumber--;
   		pageNumberUpdate(pageNumber);
   	}
	}

   //If we haven't loaded all of the pages (we can still load previous pages because there are previous pages to load; we can still load next pages because there are future pages to load)
	if(canLoadNext && canLoadPrevious){
		document.getElementsByTagName("MAIN")[0].style.padding="0";
			
		//If we're starting at a page, make sure the user sticks to it until loaded
		if(startingAt){
			if(startingAt=="footer" && f.className!=="h" && f.innerHTML!==""){
				scrollTo(f);
			}else{
				scrollTo(document.getElementById("page-"+(pageNumber)));
				//NOT WORKING
				//If the element is actually not positioned quite right, do a quick check and make a quick fix
				//////window.scrollBy(0,-document.getElementById("page-"+(pageNumber)).getBoundingClientRect().top);
			}
		}
			
		//We're at the end; we'll show the loaded pages, quit sticking to the starting page, and recognize that page changes should be bookmarked now because the reader is actually changing pages themselves
		m.style.opacity=1;
		startingAt=false;
		noHash=true;
	}
}

//Updates the page number displayed in the top-right
function pageNumberUpdate(pageNumberShow){
   //replaceState so that if the user tries to go back, they'll go to a previous webpage and not a previous story page
	history.replaceState({},"",(window.location.href).split("#")[0]+"#"+pageNumberShow);

	pageNumberTag.innerHTML=pageNumberShow;
	
   //If we didn't just load the webpage, update the bookmark (this allows the user to check out a page from a link without losing their spot in the story)
	if(noHash){
		bookmark(pageNumberShow);
	}
	
	//Tell the user how to change pages with the Page Number button if it looks like they're trying to get back to the beginning of the story by scrolling up (poor user)
	if(movingFromStart && pageNumberShow<pageNumberStart-2){
		notificationOpen("To go to any page, just click the page number, hold, and drag left!");
		buttonFocus(pageNumbers);
		movingFromStart=false;
	}
}