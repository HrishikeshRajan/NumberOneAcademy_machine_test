(async () =>{


    const URL = 'http://localhost:4000/list'
    const getElementById = (id) => document.getElementById(id)
    const getByQuery = (name) => document.querySelector(name)

    //variables
    const startButton = getElementById('start')
    const stopButton = getElementById('stop')
    const tBody = getByQuery('tbody')
    const gap = 30000
    let loading = false;
    let timer;

    //Utils
     function placeholder(parent, colSpan, text){
            parent.innerHTML = ''
            const row = document.createElement('tr');
            const cell = document.createElement('td');
            cell.colSpan = colSpan;
            cell.textContent = text;
            row.appendChild(cell);
            parent.appendChild(row);
         }
    
    function fetchData (url) {
            return fetch(url)
        }

    
    function generateTableData (obj) {
            loading = false
            tBody.innerHTML = '';
            if(obj && obj.urls && obj.urls.length){
                obj.urls.forEach((pdf) => {
                    const row = document.createElement('tr');
      
        
                    const headerCell = document.createElement('td');
                    headerCell.className = 'header'
                    headerCell.textContent = pdf.header;
                    row.appendChild(headerCell);
        
                    const dateCell = document.createElement('td');
                    dateCell.className = 'date'
                    dateCell.textContent = pdf.date.match(/\|\s(\d{2}-\d{2}-\d{4})/)[1];;
                    row.appendChild(dateCell);
        
                    const linkCell = document.createElement('td');
                    const link = document.createElement('a');
                    link.href = pdf.url;
                    link.target = '_blank';
                    link.className = 'link';
                    link.textContent = 'View';
                    linkCell.appendChild(link);
                    row.appendChild(linkCell);
        
                    tBody.appendChild(row);
                });
             }
        }
    


    placeholder(tBody, 3,' results not found')


    startButton.addEventListener('click', async (e) => {
     tBody.innerHTML = ''
     startButton.classList.add('hide')
     stopButton.classList.remove('hide')
  
    loading = true

     if (timer) {
        clearInterval(timer); 
    }

        
   try {
 
    if (loading) placeholder(tBody, 3, 'Looking for notifications...' )
    

     const response = await  fetchData(URL)
     let obj = await response.json()
     generateTableData(obj)
    

    timer =  setInterval(async () => {
        const response = await  fetchData(URL)
        let obj = await response.json()
         generateTableData(obj)
    }, gap);


   } catch (error) {
    
    console.log(error.message)
   }
   finally {
    loading = false
   }
    })

    stopButton.addEventListener('click', async () =>{

    stopButton.classList.add('hide')
    startButton.classList.remove('hide')
    clearInterval(timer);
    loading = false
    placeholder( tBody, 3,'results not found')
    console.log('timer canceled');
    } )
 
})()