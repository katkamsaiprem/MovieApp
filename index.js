const URL = "https://movies-app.prakashsakari.repl.co/api/movies";
const getMovies=async(URL)=>{

    try{
        let data = await axios.get(URL);
       
        console.log(data);
    }
    catch(error){
        

    }
}

getMovies(URL);