
const base_url = "https://api.football-data.org/v2/";
const head_request = {
    'X-Auth-Token': '7c3bee11925c47d4a1bc46ada4a95580',
    'Content-Type': 'application/x-www-form-urlencoded'
}

function status(response) {
    if (response.status !== 200) {
        console.log("Error : " + response.status);
        return Promise.reject(new Error(response.statusText));
    } else {
        return Promise.resolve(response);
    }
}

function json(response) {
    return response.json();
}

function error(error) {
    console.log("Error : " + error);
}

function putListedTeams(data){
    putTeams(data, false)
}

function putSavedTeams(data){
    putTeams(data, true)
}

function putTeams(data, savedList) {
    let html = `<ul class="collection">`;
    data.teams.forEach(function (team) {
        let clubImage = team.crestUrl;
        if (clubImage !== null) {
            clubImage = team.crestUrl.replace(/^http:\/\//i, 'https://');
        }
        html += `
        <li id="${team.tla}" class="collection-item avatar">
            <img src="${clubImage}" style="max-width:30px alt="" class="circle">
                <span class="title">
                    <a href="./team.html?id=${team.id}">
                        ${team.name}
                    </a>
                </span>
                <p>
                    ${team.shortName} (${team.area.name})
                </p>
            `;
        if (savedList) {
            html += `<a class="secondary-content" id="del"><i class="material-icons">delete</i></a>`;
        }
        html += `</li>`;
    });
    html += `</li></ul>`;
    document.getElementById("teams").innerHTML = html;
    if (savedList) {
        data.teams.forEach(function (team) {
            const del = document.getElementById("del");
            del.onclick = function () {
                destroyById(team.id).then(function(team) {
                    console.log(team)
                    console.log(`Menghapus tim ${team.name} dari daftar favorit`);
                    M.toast({html: `Menghapus ${team.shortName}`, classes: 'rounded'});
                    document.getElementById(team.tla).remove();
                });

            };
        });
    }
}

function putMatches(data) {
    let html = `<ul class="collection">`;
    data.matches.forEach(function (match) {
        html += `
            <li class="collection-item">            
                <span class="title">
                    <a href="./team.html?id=${match.homeTeam.id}">
                        ${match.homeTeam.name}
                    </a> vs 
                    <a href="./team.html?id=${match.awayTeam.id}">
                        ${match.awayTeam.name}
                    </a>
                </span>
                <p>
                    ${match.group}<br>
                    ${match.utcDate.substring(0,10)}
                </p>
            </li>
            `;
    });
    html += `</ul>`;
    document.getElementById("matches").innerHTML = html;
}


function putDetailedTeam(team) {
    let clubImage = team.crestUrl;
    if (clubImage !== null) {
        clubImage = team.crestUrl.replace(/^http:\/\//i, 'https://');
    }

    var html = `
            <div class="card">
              <div class="card-image waves-effect waves-block waves-light">
                <img src="${clubImage}" />
              </div>
              <div class="card-content">
                <span class="card-title">${team.shortName}</span>
                <table>
                    <tbody>
                        <tr>
                            <td>Akronim:</td>
                            <td>${team.tla}</td>
                        </tr>
                        <tr>
                            <td>No Kontak:</td>
                            <td>${team.phone}</td>
                        </tr>
                        <tr>
                            <td>Situs:</td>
                            <td>${team.website}</td>
                        </tr>                 
                        <tr>
                            <td>Surel:</td>
                            <td>${team.email}</td>
                        </tr>                                                       
                        <tr>
                            <td>Thn Berdiri:</td>
                            <td>${team.founded}</td>
                        </tr>
                        <tr>
                            <td>Warna club:</td>
                            <td>${team.clubColors}</td>
                        </tr>                        
                        <tr>
                            <td>Markas:</td>
                            <td>${team.venue}</td>
                        </tr>                        
                    </tbody>
                </table>
              </div>
            </div>
    `;
    document.getElementById("body-content").innerHTML = html;
}

function getData(item, url) {
    let putHtml;
    if (item == "Teams") {
        putHtml = putListedTeams
    } else if (item == "Matches") {
        putHtml = putMatches
    }
    if ("caches" in window) {
        caches.match(url).then(function (response) {
            if (response) {
                response.json().then(putHtml);
            } else {
                fetch(url, {headers: head_request})
                    .then(status)
                    .then(json)
                    .then(putHtml)
                    .catch(error);
            }
        });
    }

}

function getTeams() {
    getData("Teams", base_url + "competitions/CL/teams/")
}

function getMatches() {
    getData("Matches", base_url + "competitions/CL/matches?status=SCHEDULED")
}

function getTeamById() {
    return new Promise(function (resolve, reject) {
        const urlParams = new URLSearchParams(window.location.search);
        const url = base_url + "teams/" + urlParams.get("id")

        if ("caches" in window) {
            caches.match(url).then(function (response) {
                if (response) {
                    response.json().then(function (team) {
                        putDetailedTeam(team)
                        resolve(team);
                    });
                } else {
                    fetch(url, {headers: head_request})
                        .then(status)
                        .then(json)
                        .then(function (team) {
                            putDetailedTeam(team)
                            resolve(team);
                        });
                }
            });
        }
    });
}

function getSavedTeams() {
    getAll().then(putSavedTeams);
}

function getSavedTeamById() {
    var urlParams = new URLSearchParams(window.location.search);
    var idParam = urlParams.get("id");
    getById(idParam)
        .then(putDetailedTeam)
}