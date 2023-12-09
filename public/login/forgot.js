document.addEventListener('submit',callBackend);
async function  callBackend(){
    try{
        const email=document.getElementById('email').value;
        const val=await axios.post('http://3.88.226.21/password/forgotpassword',{email:email});
        

    }
    catch(err){
        console.log(err);
    }
    
}