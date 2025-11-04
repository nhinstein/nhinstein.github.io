const BASE_URL = 'https://api.football-data.org/v4/';
const API_KEY = "e3a98f6df6d84c3d891d711c6fee3410";

const ID_LEAGUE = 2024;

const URL_STANDING = `${BASE_URL}competitions/PL/standings`;
const URL_TEAM = `${BASE_URL}teams/`;
const URL_SCHEDULED = `${BASE_URL}competitions/2024/matches?status=SCHEDULED`;
const URL_FINISHED = `${BASE_URL}competitions/2024/matches?status=FINISHED`;
const URL_MATCHES = `${BASE_URL}matches/`;


function status(response) {
    if (response.status !== 200) {
        console.log('Error : ' + response.status);
        // Method reject() akan membuat blok catch terpanggil
        return Promise.reject(new Error(response.statusText));
    } else {
        // Mengubah suatu objek menjadi Promise agar bisa "di-then-kan"
        return Promise.resolve(response);
    }
}

function json(response) {
    // Mengembalikan sebuah Promise berupa objek/array JavaScript
    // yang diubah dari teks JSON. 
    return response.json();
}

function error(error) {
    // Parameter error berasal dari Promise.reject() 
    console.log('Error : ' + error);
}

function showKlasemen(data) {
    document.getElementById("spinner").hidden = true;
    var dataHtml = `
    <div class="card">
    <div class="card-content">
    <h4 class="center">Klasemen Season ${data.season.startDate} - ${data.season.endDate}</h4>
    <div style="overflow-x:auto;">
    <table class="responsive-table">
    <thead>
      <tr>
          <th>Klub</th>
          <th>M</th>
          <th>M</th>
          <th>K</th>
          <th>S</th>
          <th>P</th>
      </tr>
    </thead>

    <tbody>`;
    data.standings.forEach(function (standing) {
        if (standing.type == 'TOTAL') {
            // dataHtml += `<tr class="default-primary-color"><td colspan="6" class="center">${standing.group}</td></tr>`;
            standing.table.forEach(function (table) {
                var crestUrl = table.team.crestUrl.replace(/^http:\/\//i, 'https://');
                dataHtml += `
                <tr>
                    <td>
                    <div class="row valign-wrapper">
                    <div class="col s1">
                    
                <img class="custom_logo" src="${crestUrl}">
                    </div>
                    <div class="col s10">
                    <a href="./tim.html?id=${table.team.id}"><span class="blue-text">
                    ${table.team.name}              </span></a>
                    </div>
                  </div>
                  </td>
                  <td>${table.playedGames}</td>
                  <td>${table.won}</td>
                  <td>${table.lost}</td>
                  <td>${table.draw}</td>
                    <td>${table.points}</td>
                </tr>
              `;

            })
        }
    });
    dataHtml += `
    </tbody>
  </table>
  </div>
  </div>
  </div>`

    document.getElementById("data_standing").innerHTML = dataHtml;

}

function getKlasemen() {
    if ("caches" in window) {
        caches.match(URL_STANDING).then(function (response) {
            if (response) {
                response.json().then(function (data) {
                    showKlasemen(data);
                })
            }
        })
    }

    fetch(URL_STANDING, {

            method: "GET",
            headers: {
                "X-AUTH-TOKEN": API_KEY,
                "Access-Control-Allow-Origin": "*"
            }
        })
        .then(status)
        .then(json)
        .then(function (data) {
            showKlasemen(data);
        }).catch(error);

}

function showTeam(data, is_favorite) {
    var icon = `<i class="material-icons custom">favorite_border</i>`
    if (is_favorite == true) {
        icon = `<i class="material-icons custom pink-text">favorited</i>`
    }
    var crestUrl = data.crestUrl.replace(/^http:\/\//i, 'https://');
    var data_team = JSON.stringify(data)
    document.getElementById("spinner").hidden = true;
    var dataHtml = `
        <div class="card">
        <div class="row float-right"><div class="col ">
        <a onclick='addToFavorite(${data_team})' class="float-right btn-fav">
        ${icon}
        </a></div></div>
        <div class="row mt-1 card-content">
        <div class="col s12 l3">
        <img src="${crestUrl}" class="responsive-img">
        </div>

        <div class="col s12 l9">
        <h3>${data.name}</h3>
        <div class="row">
            <div class="col s12 m5 l3">
                Found
            </div>
            <div class="col s12 m7 l9">
                ${data.founded}
            </div>
        </div>
            <div class="row">
            <div class="col s12 m5 l3">
                    Address
            </div>
            <div class="col s12 m7 l9">
                    ${data.address}
            </div>
            </div>
            <div class="row">
                <div class="col s12 m5 l3">
                    Coach
                </div>
                <div class="col s12 m7 l9" id="coach">
                    
                </div>
            </div>
        </div>`
            dataHtml += `
        </div>
        </div>
        </div>

        <div class="card">
        <div class="row mt-1 card-content">
        <div class="col s12">
        <h4 class="center">Squad</h4>
        <div style="overflow-x:auto;">
        <table class="responsive-table">
        <thead>
        <tr>
            <th>Nama</th>
            <th>Posisi</th>
            <th>Nasionality</th>
        </tr>
        </thead>

        <tbody>`
            data.squad.forEach(function (squad) {
                if (squad.role == 'PLAYER') {
                    dataHtml += `
            <tr>
                <td>${squad.name}</td>
                <td>${squad.position}</td>
                <td>${squad.nationality}</td>
            </tr>
            `;
                } else if (squad.role == 'COACH') {
                    coach = squad.name;
                }
            });
            dataHtml += `
        </tbody>
        </table>
        </div>
        </div>
        </div>
        </div>
        </div>
        </div>`
    document.getElementById("data_tim").innerHTML = dataHtml;
    document.getElementById("coach").innerHTML = coach;

}

function getTeamById(is_favorite) {
    var coach = '';
    var urlParams = new URLSearchParams(window.location.search);
    var idParam = urlParams.get("id");
    if ("caches" in window) {
        caches.match(URL_TEAM + idParam).then(function (response) {
            if (response) {
                response.json().then(function (data) {
                    showTeam(data, is_favorite);
                })
            }
        })
    }
    fetch(URL_TEAM + idParam, {
            method: "GET",
            headers: {
                "X-AUTH-TOKEN": API_KEY,
                "Access-Control-Allow-Origin": "*"
            }
        })
        .then(status)
        .then(json)
        .then(function (data) {
            showTeam(data, is_favorite);
        }).catch(error);
}

function showScheduled(data){
    team_list = [];
    document.getElementById("spinner").hidden = true;
    var dataHtml = `
    <div class="row">`;
    data.matches.slice(0, 15).forEach(function (match) {
        tgl = new Date(match.utcDate);

        parse_date = moment(tgl).format('DD MMMM YYYY, h:mm:ss');;
        dataHtml += `
        <div class="col s12">
        <div class="card">
        <div class="card-content">
        <h6 class="center"> ${parse_date} </h6>
        <div class="row">
        <div class="col s4">
        Away<br>
        <span class="truncate">${match.awayTeam.name}</span>
        </div>
        <div class="col s4 center">
        Score <br>
        -
        </div>
        <div class="col s4 right-align">
        Home<br>
        <span class="truncate">${match.homeTeam.name}</span>
        </div>
    </div>
    </div>
    <div class="card-action right-align">
    <a href="./detail_match.html?id=${match.id}">Lihat Detail</a>
  </div>
    </div>
    </div>`

    });
    dataHtml += `
    </div>`;
    document.getElementById("data_matches").innerHTML = dataHtml;

}

function showFinished(data){
    team_list = [];
    document.getElementById("spinner").hidden = true;
    var dataHtml = `
    <div class="row">`;
    data.matches.slice(-15).reverse().forEach(function (match) {
        tgl = new Date(match.utcDate);

        parse_date = moment(tgl).format('DD MMMM YYYY, h:mm:ss');;
        dataHtml += `
        <div class="col s12">
        <div class="card">
        <div class="card-content">
        <h6 class="center"> ${parse_date} </h6>
        <div class="row">
        <div class="col s4">
        Away<br>
        <span class="truncate">${match.awayTeam.name}</span>
        </div>
        <div class="col s4 center">
        Score <br>
        ${match.score.fullTime.awayTeam} - ${match.score.fullTime.homeTeam}
        </div>
        <div class="col s4 right-align">
        Home<br>
        <span class="truncate">${match.homeTeam.name}</span>
        </div>
    </div>
    </div>

    <div class="card-action right-align">
    <a href="./detail_match.html?id=${match.id}">Lihat Detail</a>
  </div>
    </div>
    </div>`

    });
    dataHtml += `
    </div>`;
    document.getElementById("data_matches_selesai").innerHTML = dataHtml;

}



function getMatches() {
    if ("caches" in window) {
        caches.match(URL_SCHEDULED).then(function (response) {
            if (response) {
                response.json().then(function (data) {
                    showScheduled(data);
                })
            }
        })
    }

    fetch(URL_SCHEDULED, {

            method: "GET",
            headers: {
                "X-AUTH-TOKEN": API_KEY,
                "Access-Control-Allow-Origin": "*"
            }
        })
        .then(status)
        .then(json)
        .then(function (data) {
            showScheduled(data);
        }).catch(error);

    
    if ("caches" in window) {
        caches.match(URL_FINISHED).then(function (response) {
            if (response) {
                response.json().then(function (data) {
                    showFinished(data)
                })
            }
        })
    }


    fetch(URL_FINISHED, {

            method: "GET",
            headers: {
                "X-AUTH-TOKEN": API_KEY
            }
        })
        .then(status)
        .then(json)
        .then(function (data) {
            showFinished(data)
        }).catch(error);

}

function showMatch(data, is_favorite){    
    var icon = `<i class="material-icons custom">favorite_border</i>`
    if (is_favorite == true) {
        icon = `<i class="material-icons custom pink-text">favorited</i>`
    }
    var match = data.match;
    var data_match = JSON.stringify(data);
    document.getElementById("spinner").hidden = true;
    var dataHtml = `
<div class="row">
`;
    tgl = new Date(match.utcDate);

    parse_date = moment(tgl).format('DD MMMM YYYY');
    parse_hour = moment(tgl).format('h:mm:ss');
    dataHtml += `
    <div class="col s12">
    <div class="card">
    <div class="card-content">
    <div class="row float-right"><div class="col ">
    <a onclick='addMatchToFavorite(${data_match})' class="float-right btn-fav">
    ${icon}
    </a></div></div>
    <h6 class="center"> ${parse_date} </h6>
    <h6 class="center"> ${parse_hour} </h6>
    <br>
    <div class="row">
    <div class="col s4">
    Away<br>
    <span class="truncate">${match.awayTeam.name}</span>
    </div>
    <div class="col s4 center">
    Score <br>
    ${match.score.fullTime.awayTeam} - ${match.score.fullTime.homeTeam}
    </div>
    <div class="col s4 right-align">
    Home<br>
    <span class="truncate">${match.homeTeam.name}</span>
    </div>
    </div>
    <br>
    <div class="row">
    <div class="col">
    Stadion<hr>
    ${match.venue}<br><br>
    Wasit<hr>
    <ul>`
    match.referees.forEach(function (wasit) {
        dataHtml += `<li><span>${wasit.name}</span></li>`;
    });

    `</ul></div>
    </div>
</div>
</div>
</div>`

    dataHtml += `
</div>`;
    document.getElementById("data_match").innerHTML = dataHtml;

}

function getMatchById(is_favorite) {
    var urlParams = new URLSearchParams(window.location.search);
    var idParam = urlParams.get("id");
    if ("caches" in window) {
        caches.match(URL_MATCHES + idParam).then(function (response) {
            if (response) {
                response.json().then(function (data) {
                    showMatch(data)
                })
            }
        })
    }
    fetch(URL_MATCHES + idParam, {
            method: "GET",
            headers: {
                "X-AUTH-TOKEN": API_KEY,
                "Access-Control-Allow-Origin": "*"
            }
        })
        .then(status)
        .then(json)
        .then(function (data) {
            showMatch(data, is_favorite);
        }).catch(error);
}
