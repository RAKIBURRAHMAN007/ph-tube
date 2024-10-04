function getTimeString(time) {
    //get Hour and rest seconds
    const hour = parseInt(time / 3600);
    let remainingSecond = time % 3600;
    const minute = parseInt(remainingSecond / 60);
    remainingSecond = remainingSecond % 60;
    return `${hour} hour  ${minute} minute ${remainingSecond} second ago`;
};

const removeActiveclass = ()=>{
    const buttons=document.getElementsByClassName('category-btn');
    for(let btn of buttons){
        btn.classList.remove('active')
    }
}

// fetch load show cetagory button
//load data
const loadCategory = ()=>{
    fetch('https://openapi.programming-hero.com/api/phero-tube/categories')
       .then(res => res.json())
       .then(data => displayCategory(data.categories))
       .catch((error)=> console.log(error));
       


};
//load video
const loadVideos = (serchText= "")=>{
    fetch(`https://openapi.programming-hero.com/api/phero-tube/videos?title=${serchText}`)
       .then(res => res.json())
       .then(data => displayVideos(data.videos))
       .catch((error)=> console.log(error));
       


};

const loadCategoryVideos = (id) => {
    fetch(`https://openapi.programming-hero.com/api/phero-tube/category/${id}`)
       .then(res => res.json())
       .then(data =>{
        removeActiveclass();
        const activeBtn=document.getElementById(`btn-${id}`);
        activeBtn.classList.add('active');
        displayVideos(data.category)


       } )
       .catch((error)=> console.log(error));
     
    


}
//display data
const displayCategory = (categories)=>{
    const categorieContainer=document.getElementById('categories');
    for(const iteam of categories){
        console.log(iteam)
        const buttonConatiner=document.createElement('div');
        buttonConatiner.innerHTML=`
          <button id='btn-${iteam.category_id}' onclick="loadCategoryVideos(${iteam.category_id})" class="btn category-btn">${ iteam.category}</button>

        `;
        categorieContainer.append(buttonConatiner);
    }

    

};
const loadDetails= async (videoId)=>{
    const uri=`https://openapi.programming-hero.com/api/phero-tube/video/${videoId}`
    const res =await fetch(uri);
    const data=await res.json();
    displayDetails(data.video);




}
const displayDetails=(video)=>{
    const deatilsContainer=document.getElementById('modal-content');
    deatilsContainer.innerHTML=`
       <img src="${video.thumbnail}" />
       <p>${video.description}</p>
    
    `;
    document.getElementById('showModalData').click();


}

//display video
const  displayVideos = (videos) =>{
    const videoConatiner=document.getElementById('videos');
    videoConatiner.innerHTML="";
    if(videos.length ==0){
        videoConatiner.classList.remove('grid');
        videoConatiner.innerHTML=`
          <div class="min-h-[300px] flex flex-col gap-5 justify-center items-center">
             <img src="assets/icon.png" />
             <h2 class="font-bold text-xl">No Content Here In This Category</h2>
          </div>
        
        `;
        return;
    }
    else{
        videoConatiner.classList.add('grid');
    }
    for(const video of videos){
        const card=document.createElement('div');
        card.classList='card card-compact   ';
        card.innerHTML=`
            <figure class="h-[200px] relative ">
             <img class="h-full w-full bg-cover"
             src=${video.thumbnail}
             alt="Shoes" />
             ${video.others.posted_date?.length == 0 ? "" : `<span class="absolute right-2 bottom-2 bg-black rounded p-1 text-white text-[8px]">${getTimeString(video.others.posted_date)}</span>`}
            </figure>
            <div class="px-0 py-2 flex gap-2">
               <div>
                 <img class="w-10 h-10 rounded-full bg-cover" src="${video.authors[0].profile_picture}" />
               </div>
               <div class="">
                  <h2 class="font-bold">${video.title}</h2>
                  <div class="flex items-center gap-2 ">
                     <p>${video.authors[0].profile_name}</p>
                    
                     ${video.authors[0].verified == true ? ' <img class="w-5" src="https://img.icons8.com/?size=96&id=98A4yZTt9abw&format=png" />' : '' }
                  </div>
                  
                  
                  <p><button onclick="loadDetails('${video.video_id}')" class="btn btn-error btn-sm">Deatils</button></p>
               </div>
                
            </div>
            </div>

        `;
        videoConatiner.append(card);

    }

}
document.getElementById('serch-input').addEventListener("keyup",(e)=>{
    loadVideos(e.target.value)

})
document.getElementById('sort-button').addEventListener('click',function(){
    loadVideos()
})
loadCategory();
loadVideos()
