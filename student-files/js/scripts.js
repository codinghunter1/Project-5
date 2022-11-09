//Work by Brad Hunt, completed 9th Nov 2022
window.onload = event => {
    const gallery = document.querySelector('#gallery');
    const modalDiv = document.createElement('div');
    const search = document.getElementsByClassName("search-input");
    const errorDiv = document.createElement('div');
    const users = 30;
    function fetchData(url){ //fetch function with handed url from call function
        return fetch(url) //return value 
            .then(checkStatus) //check for 200 ok 
            .then(response => response.json()) //create right format
            .then(data => (userMap(data), popup(data.results))) //call two functions with formed data
            .catch(err => console.log(Error('There was a problem'))) //error message
    }
    async function checkStatus(response){
        if(response.ok){ //200 status report = ok 
            return Promise.resolve(response); //resolve 
        } else {
            return Promise.reject(new Error(response.statusText)); //reject error
        }
    }
    function userMap(data, search){ //function map of people. data found from fetch. search user input sreach field
        searchFilter(data); //call function to check search input feild
        while (gallery.firstChild) gallery.removeChild(gallery.firstChild); //while there is childern nodes of gallery remove all
        data.results.forEach(function(info, i){ //loop through data groups of people 
            if(!!search && (info.name.first+info.name.last).toLowerCase().includes(search.toLowerCase()) || !search){ //if there is a seach check to see if ith name is included in search, or no search input
                let htmlLimitedData = ` 
                    <div class="card" id = "${i}-card">
                        <div class="card-img-container">
                            <img class="card-img" src="${info.picture.large}" alt="profile picture">
                        </div>
                        <div class="card-info-container">
                            <h3 id = "name" class = "card-name cap">${info.name.first} ${info.name.last}</h3>
                            <p class="card-text">${info.email}</p>
                            <p class="card-text cap">${info.location.city}, ${info.location.state}</p>
                        </div>
                    </div>
                `; 
                gallery.insertAdjacentHTML('beforeend', htmlLimitedData); //add person info to gallery child nodes
            }
        });
        if(!gallery.firstChild){ //no matches from search input
            let html = ` 
                <div class="card">
                    <div class="card-info-container">
                        <h3 id = 'name' class = "card-name cap">No results found from search</h3>
                    </div>
                </div>
            `;
            errorDiv.innerHTML = html;
            gallery.insertAdjacentElement('afterbegin', errorDiv); //display error message
        }
    }
    fetchData(`https://randomuser.me/api/?nat=us&results=${users}`); //fetch data api times the value of users (12)
    function popup(data){ //event listerner for clicking on person card
        for(let i = 0; i < users; i++){ //loop through all people cards showing
            document.getElementById(`${i}-card`).addEventListener("click", event => {
                generatePopup(i, data); //call function to display popup of selected
            });
        }
    }
    function generatePopup(i, info){ 
        let htmlExtenedData = ` 
            <div class="modal" id = "${i}-modal" style="display: block">
                <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                <div class="modal-info-container">
                    <img class="modal-img" src="${info[i].picture.large}" alt="profile picture">
                    <h3 id="name" class="modal-name cap">${info[i].name.first} ${info[i].name.last}</h3>
                    <p class="modal-text">${info[i].email}</p>
                    <p class="modal-text cap">${info[i].location.city}</p>
                    <hr>
                    <p class="modal-text">${info[i].phone}</p>
                    <p class="modal-text">${info[i].location.street.number} ${info[i].location.street.name}., ${info[i].location.city}, OR ${info[i].location.postcode}</p>
                    <p class="modal-text">Birthday: ${(info[i].dob.date).split('T')[0]}</p>
                </div>
            </div>
            <div class="modal-btn-container" id = "${i}-modal-btn-container" style="display: block">
                    <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                    <button type="button" id="modal-next" class="modal-next btn">Next</button>
            </div>
        `;
        modalDiv.className = "modal-container";
        modalDiv.innerHTML = htmlExtenedData;
        gallery.insertAdjacentElement('afterend', modalDiv); //display html form created as a sibling to gallery by afterend
        if(i == 0){ //first person card meaning no pre Btn needed
            document.getElementById('modal-prev').style.display = "none";
        } else if (i == users - 1){ //last person meaning no next Btn needed
            document.getElementById("modal-next").style.display = "none";
        }
        closePopup(i);
        changePopup(i, info);
    }
    function closePopup(i){ //function for closing popup when close x is selected
        document.getElementsByClassName("modal-close-btn")[0].addEventListener("click", event => {
            modalDiv.remove(); //remove html element
        });
    } 
    function changePopup(i, info){ //move between people cards by next and prev
        document.getElementById('modal-prev').addEventListener("click", event => {
            modalDiv.remove();
            generatePopup(i - 1, info); //decrease index
        });
        document.getElementById('modal-next').addEventListener("click", event => {
            modalDiv.remove();
            generatePopup(i + 1, info); //increase index
        });
    }
    function searchFilter(data){ //collect data entered into search input feild
        search[0].addEventListener("change", event => {
            userMap(data, event.target.value); //call function with same data and user input value
        })
    }
}
