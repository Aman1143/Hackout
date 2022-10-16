const bookSearch=()=>{
    let filter=document.getElementById('search').value.toUpperCase();
    let myText=document.querySelectorAll('h5');
    for(let i=0;i<myText.length;i++)
    {
        let ans=myText[i].textContent || myText[i].innerHTML;
        if(ans.toUpperCase().indexOf(filter)>-1)
        {
            ans.style.display="";
        }
        else
        {
            ans.style.display="none";
        }
    }

}