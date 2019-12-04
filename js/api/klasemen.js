function status (response) {
    if (response.status !== 200) {
        console.log('Error : ' + response.status);
        // Method reject() akan membuat blok catch terpanggil
        return Promise.reject(new Error(response.statusText));
    } else {
        // Mengubah suatu objek menjadi Promise agar bisa "di-then-kan"
        return Promise.resolve(response);
    }
}
function json (response) {
    // Mengembalikan sebuah Promise berupa objek/array JavaScript
    // yang diubah dari teks JSON. 
    return response.json();
}
function error (error) {
    // Parameter error berasal dari Promise.reject() 
    console.log('Error : ' + error);
}


function getKlasemen() {

    fetch('https://api.football-data.org/v2/competitions/2021/standings',{
        
        method: "GET",
        headers:{
            "X-AUTH-TOKEN": "aa3f2e8a4dda48eea2a4f3f86e1d420f"
        }
    })
        .then(status)
        .then(json)
        .then(function(data) {
            console.log(data);
            document.getElementById("spinner").hidden=true;
            var dataHtml = `
        <div class="card">
        <div class="card-content">
            <h4 class="center">Klasemen Season ${data.season.startDate} - ${data.season.endDate}</h4>
            <div style="overflow-x:auto;">
            <table>
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
            data.standings.forEach(function(standing){
                if(standing.type == 'TOTAL'){
                    // dataHtml += `<tr class="light-blue accent-1"><td colspan="6" class="center">${standing.group}</td></tr>`;
                    standing.table.forEach(function(table){
                        dataHtml += `
                        <tr>
                            <td>
                            <div class="row valign-wrapper">
                            <div class="col s1">
                            
                        <img class="custom_logo" src="${table.team.crestUrl}">
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
        }).catch(error);

}

function getTeamById(is_favorite) {
    var coach = '';
    var urlParams = new URLSearchParams(window.location.search);
    var idParam = urlParams.get("id");     
    fetch('https://api.football-data.org/v2/teams/' +idParam,{
        method: "GET",
        headers:{
            "X-AUTH-TOKEN": "aa3f2e8a4dda48eea2a4f3f86e1d420f"
        }
    })
      .then(status)
      .then(json)
      .then(function(data) {
          var icon = `<i class="material-icons custom">favorite_border</i>`
          if(is_favorite == true){
              icon = `<i class="material-icons custom pink-text">favorited</i>`
          }
          obj = {'id': data.id, 'name': data.name, 'squad': data.squad, 'founded': data.founded};
        localStorage["team"] = JSON.stringify(data);
        document.getElementById("spinner").hidden=true;
        var dataHtml = `
    <div class="card">
    <div class="row float-right"><div class="col ">
    <a onclick="addToFavorite();" class="float-right btn-fav">
    ${icon}
    </a></div></div>
    <div class="row mt-1 card-content">
    <div class="col s12 l3">
        <img src="${data.crestUrl}" class="responsive-img">
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
    <table>
    <thead>
      <tr>
          <th>Nama</th>
          <th>Posisi</th>
          <th>Nasionality</th>
      </tr>
    </thead>

    <tbody>`
    data.squad.forEach(function(squad){
        if(squad.role == 'PLAYER'){
            dataHtml += `
            <tr>
              <td>${squad.name}</td>
              <td>${squad.position}</td>
              <td>${squad.nationality}</td>
            </tr>
            `;
        }
        else if(squad.role == 'COACH'){
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
      });
    }



function getMatches() {

    fetch('https://api.football-data.org/v2/competitions/2021/matches?status=SCHEDULED',{
        
        method: "GET",
        headers:{
            "X-AUTH-TOKEN": "aa3f2e8a4dda48eea2a4f3f86e1d420f"
        }
    })
        .then(status)
        .then(json)
        .then(function(data) {
            team_list = [];
            console.log(data);            
            document.getElementById("spinner").hidden=true;
            var dataHtml = `
            <div class="row">`;
            data.matches.slice(0, 15).forEach(function(match){
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
        }).catch(error);



    fetch('https://api.football-data.org/v2/competitions/2021/matches?status=FINISHED',{
        
        method: "GET",
        headers:{
            "X-AUTH-TOKEN": "aa3f2e8a4dda48eea2a4f3f86e1d420f"
        }
    })
        .then(status)
        .then(json)
        .then(function(data) {
            team_list = [];
            console.log(data);            
            document.getElementById("spinner").hidden=true;
            var dataHtml = `
            <div class="row">`;
            data.matches.slice(-15).reverse().forEach(function(match){
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
        }).catch(error);

}



function getMatchById() {
    var urlParams = new URLSearchParams(window.location.search);
    var idParam = urlParams.get("id");    
    fetch('https://api.football-data.org//v2/matches/' +idParam,{
        method: "GET",
        headers:{
            "X-AUTH-TOKEN": "aa3f2e8a4dda48eea2a4f3f86e1d420f"
        }
    })
      .then(status)
      .then(json)
      .then(function(data) {
        console.log(data);   
        var match = data.match;        
        document.getElementById("spinner").hidden=true;
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
            <div class="row float-right"><div class="col>
            <a href="./index.html" class="float-right">
            <i class="material-icons custom">favorite_border</i>
            </a>
            </div></div>
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
            match.referees.forEach(function(wasit){
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
      });
    }