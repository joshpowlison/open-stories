//Starting variables
noHash=true;
var pages=new Array();

//The first things to happen; activated once a page loads
function start(){
   
	//Load the total number of pages as specified in totalPages.js
	totalPageNumber=new XMLHttpRequest();
	totalPageNumber.open("GET","total-pages.txt",false); //Yes, that is a synchronous AJAX call. We can use a better solution, but the file's only a few bytes.
	totalPageNumber.send();
	totalPages=totalPageNumber.responseText;
	
	//Add in the page divs that the pages will be put into
	pageIdDivs="";
	for(i=1;i<=totalPages;i++){
		pageIdDivs+="<div id='page-"+i+"'></div>";
	}
	document.getElementsByTagName("MAIN")[0].insertAdjacentHTML("afterbegin",pageIdDivs);

	//Make call variables for commonly called elements
	h=document.getElementsByTagName("nav")[0];
	f=document.getElementById("footer");
	m=document.getElementsByTagName("main")[0];
	header=document.getElementsByTagName("header")[0];
	
	//Affect the design of elements
	document.getElementById("storyButton").innerHTML=document.title;
	document.getElementById("totalPages").innerHTML=totalPages;
	var sheet=window.document.styleSheets[0];
	//Add story color into CSS
	sheet.insertRule('#primary,#goToTag,#goToCurrentPage{background-color:#'+storyColor+'}',sheet.cssRules.length);
	//Add max page width into CSS
	sheet.insertRule('main>div{max-width:'+pageMaxWidth+'}',sheet.cssRules.length);

	//Make magic happen! Set the first page:

	//Set the position of the header menus; they need to hide BEHIND the main header
	setDropdownTop();
	faqSetup();

	storyButton=document.getElementById("storyButton");
	profileButton=document.getElementById("profileButton");
	
	//Add Event Listeners
	profileButton.onclick=function(){dropdownToggle("profile");};
	document.getElementById("notification").onclick=function(){notificationClose();};
	
	//If request for help section is made:
	if(window.location.href.indexOf("help=")!==-1){
		helpSection=Number(window.location.href.split("#")[0].substr(window.location.href.indexOf("help=")+5,window.location.href.split("#")[0].length));
		if(profileLoaded){
			helpSection--;
		}
		//Make sure helpSection is an actual number before continuing
		if(helpSection){
			dropdownToggle("help");
			document.getElementsByClassName("faqQuestion")[helpSection].className="dd";
		}
	}
	
	/////CHANGE PAGE NUMBER/////
	
	pageNumbers=document.getElementById("pageNumbers");
	pageNumberTag=document.getElementById("pageNumber");
	
	//Page number event listeners
	//Mouse
	document.getElementById("pageNumbers").addEventListener("mousedown",function(event){goToPage(event);});
	//Touch
	document.getElementById("pageNumbers").addEventListener("touchstart",function(event){goToPage(event);});
	
	document.getElementById("primary").insertAdjacentHTML("beforebegin","<nav id='pageChange'><div></div><hr><div></div></nav><div id='goToTag'></div><div id='goToCurrentPage'>"+pageNumber+"</div>");
	goToTag=document.getElementById("goToTag");
	goToCurrentPage=document.getElementById("goToCurrentPage");
	
	/////OTHER/////
	loadingPrevious=document.getElementById("loadingPrevious");
	loadingNext=document.getElementById("loadingNext");
	
	//If a hash is set, go to it!
	//Unless you just logged in (justEntered); then you want to go to your bookmark
	if(location.hash){
		hashValue=(location.hash).replace("#","");
		if(!isNaN(hashValue)){
			noHash=false;
			pageNumber=parseFloat(hashValue);
			
			if(pageNumber>totalPages){
				pageNumber=totalPages;
			}else if(pageNumber<1){
				pageNumber=0;
			}
		}else if(isNaN(hashValue)){
			if(hashValue=="footer"){
				pageNumber="footer";
			}else{
				notificationOpen("The link tried to take you to a nonexistant page "+'"'+(location.hash).replace("#","")+'"'+", so we took you to the last page instead.");
				pageNumber=totalPages;
			}
		}
	}else{
		pageNumber=totalPages;
	}
	
	//Keep track of movement so that if the reader is confused how to go back, I can help them.
	movingFromStart=true;
	pageNumberStart=pageNumber;

	changePage(pageNumber);
}

//Sets up the questions in the help section
function faqSetup(){
	for(i=0;i<document.getElementsByClassName("faqQuestion").length;i++){
		document.getElementsByClassName("faqQuestion")[i].dataset.active=false;
		document.getElementsByClassName("faqQuestion")[i].tabIndex=0;
		document.getElementsByClassName("faqQuestion")[i].onclick=function(){
			faqQuestionToggle();
		};
	}
}

//Toggles an FAQ's answer display
function faqQuestionToggle(){
	if(document.activeElement.dataset.active=="false"){
		document.activeElement.dataset.active="true";
	}else{
		document.activeElement.dataset.active="false";
	}
}

/////DROPDOWNS/////
//Drop/raise a dropdown
function dropdownToggle(){
	
	//Get the dropdown, and make sure it moves smoothly
	thisButton=document.getElementById("profileButton");
	thisDropdown=document.getElementById("profileDropdown");
	thisDropdown.style.transition="transform 1s";

   //If a button and its dropdown are active, deactivate them
	if(thisButton.dataset.active=="true"){
		thisButton.dataset.active="false";
		thisDropdown.style.transform="translate(0px,"+(-thisDropdown.getBoundingClientRect().height+h.getBoundingClientRect().bottom)+"px)";
		//Don't let the user tab-select any buttons in the dropdown if it's up
		thisDropdown.style.pointerEvents="none";
		document.body.style.overflow="auto";
	}else{//If they're both inactive, activate them
		thisButton.dataset.active="true";
		thisDropdown.style.transform="translate(0px,"+(h.getBoundingClientRect().bottom)+"px)";
		thisDropdown.style.pointerEvents="initial";
		//Don't let the user scroll the main site if the dropdown's down
		document.body.style.overflow="hidden";
	}
}

//When the window's resized, resize the dropdown's height to match
window.addEventListener('resize',function(){resizeDropdowns();},true);

function resizeDropdowns(){
	document.getElementById("profileDropdown").style.transition="none";
	document.getElementById("profileDropdown").style.maxHeight=innerHeight-h.getBoundingClientRect().bottom+"px";
	
	if(document.getElementById("profileButton").dataset.active=="false"){
		document.getElementById("profileDropdown").style.transform="translate(0px,"+(-document.getElementById("profileDropdown").getBoundingClientRect().height+h.getBoundingClientRect().bottom)+"px)";
	}
}

//Keep dropdowns hidden behind the header (don't let them peek below when they're supposed to be hidden)
function setDropdownTop(){
	document.getElementById("profileDropdown").style.transform="translate(0px,"+(-document.getElementById("profileDropdown").getBoundingClientRect().height+h.getBoundingClientRect().bottom)+"px)";
	resizeDropdowns();
}

/////NOTIFICATIONS/////
//Open a notification
function notificationOpen(text){
	n=document.getElementById("notification");
	//If the notification is down, a timeout for pushing it back up was set. We don't want it messing with the new notification though, so we'll cancel the timeout if the notification is down.
	if(n.className=="notiDown"){
		window.clearTimeout(notificationAutoClose);
	}else{
		n.className="notiDown";
	}
	
	n.innerHTML="<p>"+text+"</p>";
	
	notificationAutoClose=window.setTimeout(
		function(){
			notificationClose();
		},text.length*100+20000);
}

//Close/hide a notification
function notificationClose(){
	n=document.getElementById("notification");
	n.className="notiUp";
	if(n.className=="notiDown"){
		window.clearTimeout(notificationAutoClose);
	}
}

//Pads a filename with zeroes (for when loading a file)
function padZero(pZ1,pZ2){
	var size="0000000"+pZ1;
	return size.substr(size.length-pZ2);
}

//Set up the website divs in the page container. Each part of the story goes into or REPLACES a div
function pageDivs(){
	pageIdDivs="";
	for(i=1;i<=totalPages;i++){
		pageIdDivs+="<div id='"+i+"'></div>";
	}
	document.getElementById("page").innerHTML=pageIdDivs;
}

//Allows the footer to hide and show
footerRefresh=true;
function updateFooter(){
	//If the footer is hidden or refreshing is locked
	if(f.className!=="" || !footerRefresh){
		return;
	}
	f.className="";
}

//Allows the user to change the page
/*****
 * Add changing the page number with accessibility; requires either just pressing the space key or pressing and holding
 * Use the arrow keys to choose a page, then state out the page number to the user
*/

function goToPage(thisEvent){
	movingFromStart=false;
	
	//Set variables
	//0 is not a valid position
	recordedPositions=totalPages-1;

   //Keep track of mouse/touch positions
	goToBarMouseMove=function(event){choosePage(event);};
	goToBarMouseUp=function(){pageGet();};
	
	goToBarTouchMove=function(event){
		choosePage(event);
		event.preventDefault();
	};
	
	if(thisEvent.type=="mousedown"){
		beginPosition=thisEvent.clientX;
	}else if(thisEvent.type=="touchstart"){
		beginPosition=thisEvent.touches[0].clientX;
	}
	
	//Hide header elements
	storyButton.style.opacity=0;
	storyButton.style.transform="translateY(3.2rem)";
	storyButton.style.pointerEvents="none";
	profileButton.style.opacity=0;
	profileButton.style.transform="translateY(3.2rem)";
	profileButton.style.pointerEvents="none";
	pageNumbers.style.opacity=0;
	pageNumbers.style.transform="translateY(3.2rem)";
	pageNumbers.style.pointerEvents="none";
	
	//Close dropdowns?

	//Add this beside the main navigation in the HTML (it will appear on top with CSS)
	document.getElementById("pageChange").style.transform="translateY(0rem)";
	
	//Event Listeners
	//Mouse
	document.getElementsByTagName("BODY")[0].addEventListener("mousemove",goToBarMouseMove);
	document.getElementsByTagName("BODY")[0].addEventListener("mouseup",goToBarMouseUp);
	//Touch
	document.getElementsByTagName("BODY")[0].addEventListener("touchmove",goToBarTouchMove);
	document.getElementsByTagName("BODY")[0].addEventListener("touchend",goToBarMouseUp);

   //Don't allow the user to activate any buttons on the page or scroll it
	document.getElementsByTagName("BODY")[0].style.cursor="pointer";
	document.getElementsByTagName("BODY")[0].className="noSelect";

	//Set the position of the "current page" tag
	changeBarWidth=document.getElementById("pageChange").getBoundingClientRect().width;
	changeBarLeft=document.getElementById("pageChange").getBoundingClientRect().left;
	
	numberPercentage=(pageNumber-1)/(totalPages-1);
	if(isNaN(numberPercentage)){
		numberPercentage=0;
	}
	
	//Allow current page number to come down smoothly
	goToCurrentPage.style.transition="";
	goToCurrentPage.innerHTML=pageNumber;
	goToCurrentPage.style.transform="translate("+String(Math.round((numberPercentage)*changeBarWidth)-document.getElementById("goToCurrentPage").getBoundingClientRect().width/2+changeBarLeft)+"px,0.4rem)";
	
	//Set the "go to" tag over the "current page" tag
	goToTag.innerHTML=pageNumber;
	//Move tag to cursor, but stick to nearby pages

	goToTag.style.transform="translate("+String(Math.round((numberPercentage)*changeBarWidth)-goToTag.getBoundingClientRect().width/2+changeBarLeft)+"px,0.4rem)";
}

//Tracks cursor/touch movements
function choosePage(thisEvent){

   //Get the position and size of the bar
	changeBarWidth=document.getElementById("pageChange").getBoundingClientRect().width;
	changeBarLeft=document.getElementById("pageChange").getBoundingClientRect().left;
	goToTag=document.getElementById("goToTag");
	
	//Make sure the cursor was purposefully moved slightly; require a little bit of motion
		
	//If on a touchscreen, track the first touch
	if(thisEvent.type=="touchmove"){
		thisEvent=thisEvent.touches[0];
	}
	
	if(Math.abs(thisEvent.clientX-beginPosition)>window.innerWidth*.05){
		beginPosition=-1000;
		//So that it doesn't jerk on mobile
		goToTag.style.transition="none";
		goToCurrentPage.style.transition="none";
	}else{
		return;
	}
	
	//Check if holding farther than the edge; if so, go to footer instead
	//Make sure there's a footer to go to, otherwise skip this step
	if(f.textContent.replace(/\s*/,"")!=="" && thisEvent.clientX>changeBarWidth+changeBarLeft*1.6){
		newPageNumber=totalPages+1;
		goToTag.innerHTML="+";
	}else{//If within the bounds
		
		//make newPageNumber a percentage of the width of the screen compared to where the cursor is
		newPageNumber=(thisEvent.clientX-changeBarLeft)/changeBarWidth;
		
		//update newPageNumber to a page number based on percentage placement
		newPageNumber=Math.round(newPageNumber*recordedPositions);
		
		//newPageNumber could be 0 or 1 less than the total; so add 1
		newPageNumber++;
		
		//If newPageNumber is less than 1 or greater than totalPages, set newPageNumber back within the boundaries
		if(newPageNumber<1){
			newPageNumber=1;
		}else if(newPageNumber>totalPages){
			newPageNumber=totalPages;
		}
	
		goToTag.innerHTML=newPageNumber;
	
	}
	
	
	//Move tag to cursor, but stick to nearby pages
	numberPercentage=(newPageNumber-1)/(totalPages-1);
	if(isNaN(numberPercentage)){
		numberPercentage=0;
	}
	
	//Get the position this way:
	//Width of parent*percentage of of total pages the page you're going to is
	//Subtract half of the element's width so it centers
	
	//If going to a page
	if(newPageNumber<=totalPages){
	   goToTag.style.transform="translate("+String(document.getElementById("pageChange").getBoundingClientRect().width*((newPageNumber-1)/(totalPages-1))-goToTag.getBoundingClientRect().width/2+changeBarLeft)+"px,0.4rem)";
	}else{//If going to the footer, move a little over from the far edge
      goToTag.style.transform="translate("+String(document.getElementById("pageChange").getBoundingClientRect().width-goToTag.getBoundingClientRect().width/2+changeBarLeft*1.4)+"px,0.4rem)";
	}
	
}

//On cursor release/touch up, change the page to what is displayed (or show a message if the user didn't know how to change pages correctly)
function pageGet(){
	
	//So that it doesn't jerk on mobile
	goToTag.style.transition="";
	
	//Remove Event Listeners
	//Mousenone
	document.getElementsByTagName("BODY")[0].removeEventListener("mousemove",goToBarMouseMove);
	document.getElementsByTagName("BODY")[0].removeEventListener("mouseup",goToBarMouseUp);
	
	//Touch
	document.getElementsByTagName("BODY")[0].removeEventListener("touchmove",goToBarTouchMove);
	document.getElementsByTagName("BODY")[0].removeEventListener("touchend",goToBarMouseUp);
	
	document.getElementsByTagName("BODY")[0].style.cursor="";
	document.getElementsByTagName("BODY")[0].className="";
	
	//Get bar width
	changeBarWidth=document.getElementById("pageChange").getBoundingClientRect().width;
	
	//Unhide elements
	storyButton.style.opacity="";
	storyButton.style.transform="";
	storyButton.style.pointerEvents="";
	profileButton.style.opacity="";
	profileButton.style.transform="";
	profileButton.style.pointerEvents="";
	pageNumbers.style.opacity="";
	pageNumbers.style.transform="";
	pageNumbers.style.pointerEvents="";
	
	//Get percentage position of cursor; and use that to get the page number.
	newPageNumber=document.getElementById("goToTag").innerHTML;
	
	//Let the current page icon jump over
	goToCurrentPage.innerHTML=newPageNumber;
	goToCurrentPage.style.transform="translate("+String(Math.round((numberPercentage)*changeBarWidth)-document.getElementById("goToCurrentPage").getBoundingClientRect().width/2+changeBarLeft)+"px,0.4rem)";
	goToCurrentPage.style.transform=document.getElementById("goToCurrentPage").style.transform.replace("0.4rem","-3.2rem");
	
	//Page Number nav remove
	document.getElementById("pageChange").style.transform="";
	//For the icons, keep the values for translateX the same, but change translateY's .4rem to -3.2rem
	goToTag.style.transform=document.getElementById("goToTag").style.transform.replace("0.4rem","-3.2rem");
	
	//Change page
	if(beginPosition==-1000){
		if(Number(newPageNumber)<=totalPages){
			changePage(Number(newPageNumber));
		}else{
			changePage("footer");
		}
	}else{//The user didn't properly change pages; they either barely moved the cursor/their finger or just clicked the button. Tell them how to properly change pages.
		notificationOpen("Click and hold the page number, then drag across the screen and release to change pages!");
	}
}

//Pulses a button so the user focuses on it
function buttonFocus(input){
	input.style.animation="none";
	setTimeout(function(){input.style.animation="buttonFocus .5s cubic-bezier(.05,.2,.77,1.3) 0s 3";},100);
}

//Update the page number in the top-right corner
function pageNumberUpdate(pageNumberShow){
	history.replaceState({},"",(window.location.href).split("#")[0]+"#"+pageNumberShow);
	pageNumberTag.innerHTML=pageNumberShow;
	
	//If we haven't just loaded the page, set the bookmark (that way visiting a page with a link won't cause the reader to lose their previous spot)
	if(noHash){
		bookmark();
	}
	
	//Help the user with a notification if it looks like they're trying to get back to the beginning of the story
	if(movingFromStart && pageNumberShow<pageNumberStart-2){
		notificationOpen("To go to any page, just click the page number, hold, and drag left!");
		buttonFocus(pageNumbers);
		movingFromStart=false;
	}
}

/////FUNCTIONS NOT IN USE/////

//A function not currently in use that allows the user to hide the header
function hideHeader(){
	if(header.className=="headerH"){
		header.removeAttribute("class");
	}else{
		header.className="headerH";
	}
}

//A function not currently in use that allows the user to change the reading colors
totalReadingColors=2;

function toggleReadingColors(){
	var readingColorSet=Number(m.className.slice(-1));
	if(!readingColorSet){
		readingColorSet=1;
	}
	
	readingColorSet++;
	if(readingColorSet>totalReadingColors){
		readingColorSet=1;
	}
	
	setReadingColors(readingColorSet);
}

function setReadingColors(newColorPalette){
	m.className="readingColors"+newColorPalette;
	document.getElementById("hideHeaderButton").className=document.getElementById("hideHeaderButton").className.split(" ")[0]+" readingColors"+newColorPalette;
	
	var readingColorButton=newColorPalette+1;
	if(readingColorButton>totalReadingColors){
		readingColorButton=1;
	}
	
	document.getElementById("readingColorsButton").className="readingColors"+readingColorButton;
}

//A function not currently in use that allows the user's spot to be saved. Set up with cookies.
function bookmark(bookmarkThisPage){

}

/////LOADING PAGES/////
function loadPage(fileNumber){
	if(typeof pages[fileNumber]==='undefined'){
		if(parseInt(fileNameLeadingZeroLength)==0){
			fileName=fileNumber;
		}else{
			fileName=padZero(fileNumber,fileNameLeadingZeroLength);
		}
		
		switch(fileExtension){
			//Text
			case "html":case "php":
				pages[fileNumber]=new XMLHttpRequest();
				pages[fileNumber].open("GET",language+"/"+fileName+"."+fileExtension,true);
				pages[fileNumber].send();
				
				pages[fileNumber].onreadystatechange=function(){
					if(pages[fileNumber].readyState==4){
						if(pages[fileNumber].status==200){
							pages[fileNumber]=autoformat(pages[fileNumber].responseText);
							insertPage(fileNumber,pages[fileNumber]);
						}else{
							pages[fileNumber]=null;
							insertPage(fileNumber,"<span style='color:red;'>Page "+fileNumber+" wasn't found (404 Error)!");
						}
					}
				}
				break;
			//Image
			case "jpeg":case "jpg":case "png":
				pages[fileNumber]=new Image();
				pages[fileNumber].src=language+"/"+fileNumber+"."+fileExtension;
				pages[fileNumber].alt="Part "+fileNumber;
				pages[fileNumber].onload=function(){
					insertPage(fileNumber,"<img src='"+pages[fileNumber].src+"' alt='"+pages[fileNumber].alt+"'>");
				}
				break;
			//Audio
			case "mp3":
				pages[fileNumber]=new Audio();
				pages[fileNumber].src=language+"/"+fileNumber+"."+fileExtension;
				pages[fileNumber].onload=function(){
					insertPage(fileNumber,"<audio controls><source src='"+pages[fileNumber].src+"' type='audio/mpeg' preload='auto'>Your browser doesn't support audio on this site. Sorry. :(</audio>");
				}
				break;
			//Video
			case "mp4":
				pages[fileNumber]=new Video();
				pages[fileNumber].src=language+"/"+fileNumber+"."+fileExtension;
				pages[fileNumber].onload=function(){
					insertPage(fileNumber,"<video controls><source src='"+pages[fileNumber].src+"' type='video/mp4'>Your browser doesn't support video on this site. Sorry. :(</video>");
				}
				break;
		}
		
	}
}

//Autoformat
function autoformat(textInput){
	if((textInput.toLowerCase()).search("script>")>-1 || (textInput.toLowerCase()).search("<script")>-1){return "<em><strong>This page appears to be corrupted. Our ninja-bots have blocked it for your safety.</strong></em>";}
	//If text includes [AUTOFORMAT] automatically format the file
	if(textInput.indexOf("[AUTOFORMAT]")>-1){
		return textInput
		   .replace(/(?!\[AUTOFORMAT\]\s*<h[r123456])\[AUTOFORMAT\]\s*/,"<p>") //Take care of AUTOFORMAT if next tag is a heading or hr tag
		   .replace(/\[AUTOFORMAT\]\s*/,"") //Take care of AUTOFORMAT
	      .replace(/(?!\n+<h[r123456])\n+(?!\n+<h[r123456])/g,"</p><p>") //Add p tags where there aren't any between empty spaces
	      //.replace(/(?!\n+<h[r123456])\n+/g,"<p>") //Add opening p tags where there aren't any following a special tag
	      //.replace(/(?!h[r123456]\n+)\n+/g,"</p>") //Add closing p tags where there aren't any before a special tag
	      +"</p>";
	}else{
		return textInput;
	}
}
