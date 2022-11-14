 const URLS = {
    cattags:"https://cataas.com/api/tags",
    typrequest:"https://cataas.com/cat/",
}
 const HTMLSELECTORS = {
    id:{
        tags:"tags",
        pictures:"pictures",
    },
    class:{
        picture:"picture",
    },
    selector:{},
 }
 const STRINGS = {
    firstSelectOption:"Pick a tag",
 }

 let timer
 let deleteFirstPictureDelay

async function getTags(url){
    const response = await fetch(url);
    const tags = await response.json();
    return tags;
}

function createTagList(tagList){
    document.getElementById(HTMLSELECTORS.id.tags).innerHTML = `
    <select onchange="loadByTag(this.value)">
        <option>${STRINGS.firstSelectOption}</option>
        ${tagList.map(tag=>{
            return `<option>${tag}</option>`
        }).join("")}
    </select>
    `;
}

async function loadByTag(tag){
    if(tag != STRINGS.firstSelectOption){
        const response = await fetch(`https://cataas.com/api/cats?tags=${tag}`);
        const data = await response.json();
        console.log(data.length)
        displayPicture(data.map(e=> e=e._id));
    }
}

function displayPicture(pictures){
    let currentPosition = 0;
    clearInterval(timer);
    clearTimeout(deleteFirstPictureDelay);
    if(pictures.length>1){
        document.getElementById(HTMLSELECTORS.id.pictures).innerHTML= `
            <div class="picture" style="background-image: url('${URLS.typrequest+pictures[0]}')"></div>
            <div class="picture" style="background-image: url('${URLS.typrequest+pictures[1]}')"></div>
         `;
        currentPosition+=2;
        if(pictures.length==2) currentPosition=0;
        timer = setInterval(nextPicture, 3000);
    }else{
        document.getElementById(HTMLSELECTORS.id.pictures).innerHTML= `
            <div class="picture" style="background-image: url('${URLS.typrequest+pictures[0]}')"></div>
            <div class="picture"></div>
        `;
    }


    function nextPicture(){
        document.getElementById(HTMLSELECTORS.id.pictures).insertAdjacentHTML(
            "beforeend",
            `<div class="picture" style="background-image: url('${URLS.typrequest+pictures[currentPosition]}');"></div>`);
            deleteFirstPictureDelay = setTimeout(()=>document.querySelector("."+HTMLSELECTORS.class.picture).remove(),1000);
            if(currentPosition+1>=pictures.length){
                currentPosition = 0;
            }else{
                currentPosition++;
            }
    }
}



async function start(){
    const tags = await getTags(URLS.cattags);
    createTagList(tags);
}

start()
