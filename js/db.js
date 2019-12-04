var dbPromise = idb.open("boladb", 1, function(upgradeDb) {
  if (!upgradeDb.objectStoreNames.contains("team")) {
    var peopleOS = upgradeDb.createObjectStore("team", { keyPath: "id" });
    peopleOS.createIndex("name", "name", { unique: false });
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
    console.log(val);
    var is_favorite = false;
    if(val){
      is_favorite = true;
    }
    getTeamById(is_favorite);
  });
}


function addToFavorite() {
  console.log('masuppp');
  var data = JSON.parse(localStorage["team"]);
  let is_exists = isFavorite();
  console.log(is_exists);
  var urlParams = new URLSearchParams(window.location.search);
  var idParam = urlParams.get("id"); 
  dbPromise.then(function(db) {
    var tx = db.transaction('team', 'readonly');
    var store = tx.objectStore('team');
    var result = store.get(parseInt(idParam));
    return result; 
  }).then(function(val) {
    if(val){
    } else{
      dbPromise.then(function(db) {
        
        var tx = db.transaction('team', 'readwrite');
        var store = tx.objectStore('team');
        var item = {
            name: data.name,
            id: data.id,
            founder: data.founded,
            squad: data.squad,
            created: new Date().getTime()
        };
        store.add(item); //menambahkan key "team"
        return tx.complete;
      }).then(function() {
        console.log('Team berhasil disimpan.');
      }).catch(function() {
        console.log('Team gagal disimpan.')
      })
      
    }
  });
}


// function addToFavorite() {
//   console.log('masuppp');
//   var data = JSON.parse(localStorage["team"]);
//   let is_exists = isFavorite();
//   console.log(is_exists);
  
  
// dbPromise.then(function(db) {
  
//   var tx = db.transaction('team', 'readwrite');
//   // var store = tx.objectStore('team');
//   // var item = {
//   //     name: data.name,
//   //     id: data.id,
//   //     founder: data.founded,
//   //     squad: data.squad,
//   //     created: new Date().getTime()
//   // };
//   // store.add(item); //menambahkan key "team"
//   return tx.complete;
// }).then(function() {
//   console.log('Team berhasil disimpan.');
// }).catch(function() {
//   console.log('Team gagal disimpan.')
// })
// }