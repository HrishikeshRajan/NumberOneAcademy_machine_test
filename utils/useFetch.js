const useFetch = async (axios, method, url) => {
    try {
        const response = await axios({method, url});
        const body = await response.data;
        return [body,null]
    } catch (error) {
        console.log(error)
            if(error instanceof Error){
                return [null,error.message]
         }        
    }
}

exports.useFetch = useFetch