function init(){
    window._preview = {};
    _preview.serieslist = makeSeriesList();
    _preview.previewbox = makePreviewBox();
    _preview.styles = document.createElement("style"),
    _preview.hovered = null;

    _preview.styles.innerHTML = ".hiddenPreviewBox{display:none;}\n"
				+ ".shownPreviewBox{display:inline;background-color:white;position:fixed;top:0px;float:right;width:50%;height:100%;scroll:auto;font-size:28px;}\n"
				+ "#series-image{width:35%;float:right;}\n"
				+ "#series-title{font-family:Times,serif;text-align:center;font-size:.8em;width:60%;float:left;}\n"
				+ "#series-description{font-family:Times,serif;text-align:left;padding-left:4px;font-size:0.5em;width:60%;float:left;}\n";
    document.body.appendChild(_preview.styles);
}

function makeSeriesList(){
    //creates and returns an array of objects
    //link is the link element
    //img an image html element to be filled later after xhr request
    //pDescription a p html element to be filled later after xhr request
    k=[];
    for(i = 0,j = document.getElementsByTagName("a"); i < j.length; i++)
	if(j[i].title == "Series Info"){
	    j[i].onmouseover = function (){ _preview.hovered = this; showPreview(this); };
	    j[i].onmouseout = function (){ _preview.hovered = null; hidePreview(this); };
	    k.push({
		       "index": i,
		       "link":j[i],
		       "img":document.createElement("img"),
		       "description":"",
		       "title":""
		   });
	}
    return k;
}

function makePreviewBox(){
    //gets preview box if it is already created, create it if not and then return the element
    var box = document.getElementById("preview-box") || document.createElement("div");
    var tmpHtml;

    if(box.id == ""){
	box.id = "preview-box";
	box.setAttribute("class","hiddenPreviewBox");
	document.body.appendChild(box);
    }
    
    return box;    
}

function loadSeriesInfo(link){
    //check that the series' info hasn't been loaded yet
    var xhr = new XMLHttpRequest(),
        elmt,
        descriptionRe = new RegExp('<div class="sContent" style="text-align:justify">.*','i'),
        imgRe = new RegExp("http://www.mangaupdates.com/image/i[0-9]*\.[a-z]{3,4}","i");	

    for(i = 0; i < _preview.serieslist.length; i++)
	if(_preview.serieslist[i].link.href == link.href){
	    if(_preview.serieslist[i].title != ""){
		elmt = _preview.serieslist[i];
		return elmt;
	    }
	    else{
	        elmt = _preview.serieslist[i];
		elmt.title = link.innerHTML;
		break;
	    }
	}

    xhr.onreadystatechange = function (){
	if(xhr.readyState == 4 && xhr.status == 200){
	    elmt.description = descriptionRe.exec(xhr.responseText)[0].replace('<div class="sContent" style="text-align:justify">','') || "";
	    if(imgRe.exec(xhr.responseText) != null){
		elmt.img.setAttribute("src" ,  imgRe.exec(xhr.responseText)[0]);
		if(_preview.hovered != null && link.href == _preview.hovered.href)
		    showPreview(link);
	    }
	}
    };
    xhr.open("GET", link.href,true);
    xhr.send(null);
    return elmt;
}

function showPreview(link){
    seriesElmt = loadSeriesInfo(link);
    box = document.getElementById("preview-box");
    box.innerHTML = "<p id=\"series-title\"><b>Title:</b> "
		    + seriesElmt.title
	            + "</p><p id=\"series-description\"><b>Description:</b> "
	            + seriesElmt.description
		    + "</p><img id=\"series-image\" src=\""
	            + seriesElmt.img.src
	            + "\"/>";
    box.setAttribute("class","shownPreviewBox");
}

function hidePreview(){
    box = document.getElementById("preview-box");
    box.setAttribute("class","hiddenPreviewBox");
}

init();//initiate the script