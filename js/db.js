var dbPromise = idb.open("boladb", 1, function(upgradeDb) {
  if (!upgradeDb.objectStoreNames.contains("team")) {
    var peopleOS = upgradeDb.createObjectStore("team", { keyPath: "id" });
    peopleOS.createIndex("name", "name", { unique: false });
  }
  if (!upgradeDb.objectStoreNames.contains("match")) {
    var peopleOS = upgradeDb.createObjectStore("match", { keyPath: "id" });
  }
});



var isFavorite = function(){
  var urlParams = new URLSearchParams(window.location.search);
  var idParam = urlParams.get("id"); 
  
  dbPromise.then(function(db) {
    var tx = db.transaction('team', 'readonly');
    var store = tx.objectStore('team');
    var result = store.get(parseInt(idParam));
    return result; 
  }).then(function(val) {
    var is_favorite = false;
    if(val){
      is_favorite = true;
    }
    getTeamById(is_favorite);
  });
}


function addToFavorite(data_team) {  
  var data = data_team;
  var urlParams = new URLSearchParams(window.location.search);
  var idParam = urlParams.get("id"); 
  dbPromise.then(function(db) {
    var tx = db.transaction('team', 'readonly');
    var store = tx.objectStore('team');
    var result = store.get(parseInt(idParam));
    return result; 
  }).then(function(val) {
    if(val){
      dbPromise.then(function(db) {
        var tx = db.transaction('team', 'readwrite');
        var store = tx.objectStore('team');
        store.delete(data.id);
        return tx.complete;
      }).then(function() {
        location.reload();
        M.toast({html: 'Team berhasil dihapus dari daftar favorit', classes: 'rounded'})
        console.log('Item deleted from favorite');
      });
    } else{
      dbPromise.then(function(db) {
        
        var tx = db.transaction('team', 'readwrite');
        var store = tx.objectStore('team');
        var item = {
            name: data.name,
            id: data.id,
            founded: data.founded,
            squad: data.squad,
            crestUrl: data.crestUrl,
            address: data.address,
            created: new Date().getTime()
        };
        store.add(item); //menambahkan key "team"
        return tx.complete;
      }).then(function() {
        location.reload();
        M.toast({html: 'Team berhasil ditambahkan ke daftar favorit', classes: 'rounded'})
        console.log('Team berhasil ditambahkan ke daftar favorit');
      }).catch(function() {
        M.toast({html: 'Team berhasil ditambahkan ke daftar favorit', classes: 'rounded'})
        console.log('Team gagal disimpan ke daftar favorit')
      })
      
    }
  });
}

function elFav(data) {

  document.getElementById("spinner").hidden = true;
  var dataHtml = ``;

  data.forEach(function (team) {
    var data_team = JSON.stringify(team)
    dataHtml += `
    <div class="row">
    <div class="col s12 l3 m4">
      <div class="card">
        <div class="card-image">
          <img src=${team.crestUrl} height="300">
        </div>
        <div class="card-content">
        <h4>${team.name}</h4>
          <p>${team.founded}</p>
        </div>
        <div class="card-action">
          <a href="./tim_fav.html?id=${team.id}">Details</a>
        </div>
      </div>
    </div>
  </div>`
    });

  document.getElementById("data_teamfav").innerHTML = dataHtml;

}

function showTeamFav(){
  dbPromise.then(function(db) {
    var tx = db.transaction('team', 'readonly');
    var store = tx.objectStore('team');
    return store.getAll();
  }).then(function(items) {
    elFav(items);
  });

}


function showFavTeam(){
  var urlParams = new URLSearchParams(window.location.search);
  var idParam = urlParams.get("id"); 
  dbPromise.then(function(db) {
    var tx = db.transaction('team', 'readonly');
    var store = tx.objectStore('team');
    // mengambil primary key berdasarkan isbn
    return store.get(parseInt(idParam)); 
  }).then(function(val) {
    showTeam(val, true)
  });
}

//save match fav


var isMatchFavorite = function(){
  var urlParams = new URLSearchParams(window.location.search);
  var idParam = urlParams.get("id"); 
  
  dbPromise.then(function(db) {
    var tx = db.transaction('match', 'readonly');
    var store = tx.objectStore('match');
    var result = store.get(parseInt(idParam));
    return result; 
  }).then(function(val) {
    var is_favorite = false;
    if(val){
      is_favorite = true;
    }
    getMatchById(is_favorite);
  });
}


function addMatchToFavorite(data_match) {
  
  var data = data_match;
  var urlParams = new URLSearchParams(window.location.search);
  var idParam = urlParams.get("id"); 
  dbPromise.then(function(db) {
    var tx = db.transaction('match', 'readonly');
    var store = tx.objectStore('match');
    var result = store.get(parseInt(idParam));
    return result; 
  }).then(function(val) {
    if(val){
      dbPromise.then(function(db) {
        var tx = db.transaction('match', 'readwrite');
        var store = tx.objectStore('match');
        store.delete(data.id);
        return tx.complete;
      }).then(function() {
        location.reload();
        M.toast({html: 'Match berhasil dihapus dari daftar favorit', classes: 'rounded'})
        console.log('Item deleted from favorite');
      });
    } else{
      dbPromise.then(function(db) {
        
        var tx = db.transaction('match', 'readwrite');
        var store = tx.objectStore('match');
        var item = {
            match: data.match,
            id: data.match.id,
            created: new Date().getTime()
        };
        console.log(data);
        
        store.add(item); //menambahkan key "match"
        return tx.complete;
      }).then(function() {
        location.reload();
        M.toast({html: 'Match berhasil ditambahkan ke daftar favorit', classes: 'rounded'})
        console.log('Match berhasil ditambahkan ke daftar favorit');
      }).catch(function() {
        M.toast({html: 'Match berhasil ditambahkan ke daftar favorit', classes: 'rounded'})
        console.log('Match gagal disimpan ke daftar favorit')
      })
      
    }
  });
}

function elMatchFav(data) {

  document.getElementById("spinner").hidden = true;
  var dataHtml = `
  <div class="row">`;

  data.forEach(function (item) {
    var match = item.match;
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
<a href="./detail_match_fav.html?id=${match.id}">Lihat Detail</a>
</div>
</div>
</div>`
    });   
    dataHtml += `
    </div>`;

  document.getElementById("data_matchfav").innerHTML = dataHtml;

}

function showMatchFav(){
  dbPromise.then(function(db) {
    var tx = db.transaction('match', 'readonly');
    var store = tx.objectStore('match');
    return store.getAll();
  }).then(function(items) {
    elMatchFav(items);
  });

}


function showFavMatch(){
  var urlParams = new URLSearchParams(window.location.search);
  var idParam = urlParams.get("id"); 
  dbPromise.then(function(db) {
    var tx = db.transaction('match', 'readonly');
    var store = tx.objectStore('match');
    // mengambil primary key berdasarkan isbn
    return store.get(parseInt(idParam)); 
  }).then(function(val) {
    showMatch(val, true)
  });
}

