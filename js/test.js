var map = L.map('map').setView([46.159370, -1.150816], 13);    //création de la carte et du fond de la carte
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {      
   maxZoom: 19,
   attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

const infos=document.getElementById("infos");      //liste contenant les infos supplémentaires des éléments cliqués


/////////////   GEOLOCALISATION   ////////////////
const boutonGeolocalisation=document.getElementById("boutonGeolocaliser");
var lat;
var lon;
function success(pos) {   //fonction qui récupère les coordonnées de l'utilisateur 
   var crd = pos.coords;
  
   lat=crd.latitude;
   lon=crd.longitude;
};
navigator.geolocation.getCurrentPosition(success);
  
boutonGeolocalisation.addEventListener('click',geoloca);
var distanceEntrePoints=500;
var layerPosition=L.layerGroup();
  
function geoloca(){       //fonction qui place la carte au centre du point de coordonnées de l'utilisateur et ajoute les points des vélos et bus dans un rayon de 500m
   map.setView([lat, lon], 16);
   var position= L.marker([lat, lon], {icon:iconeVelo}).addTo(map);
   var latLngPosition= position.getLatLng();
   position.bindPopup("Votre position");
   layerVelo.eachLayer(function (layer){   //ajout des points vélos
      if(latLngPosition.distanceTo(layer.getLatLng())<distanceEntrePoints){
        layer.addTo(layerPosition);
      };
   });
   layerBus.eachLayer(function (layer){    //ajout des points bus
      if(latLngPosition.distanceTo(layer.getLatLng())<distanceEntrePoints){
        layer.addTo(layerPosition);
        };
   });
   layerPosition.addTo(map);
};



/////////////////////   VELO   ////////////////
const boutonVelo=document.getElementById('boutonVelo');     //bouton pour afficher ou non les vélos
boutonVelo.addEventListener('click',getVelo);
const iconeVelo= L.icon({     //met en place l'icône des vélos
   iconUrl:'images/leaf-green-test.png',
   shadow:'images/leaf-shadow.png',
   iconSize:     [38, 95], 
   shadowSize:   [50, 64]
  
});
  
var listeVelo;
var layerVelo=L.layerGroup();
//récupération des données de l'API dans une variable
const promesseRecupVelo= axios.get('https://api.agglo-larochelle.fr/production/opendata/api/records/1.0/search/dataset=yelo___disponibilite_des_velos_en_libre_service&rows=126&facet=station_nom&facet=velos_disponibles&facet=accroches_libres&facet=nombre_emplacements&facet=station_latitude&facet=station_longitude');
promesseRecupVelo.then(reponseaAjax=> {
   const donneesRecues=reponseaAjax.data;
   listeVelo=donneesRecues.records;
     
   listeVelo.forEach(element => {   //fonction qui à chaque élément de la liste des vélos lui ajoute un marqueur correspondant à ses coordonnées 
      var point= element.fields;
      var marqueur= L.marker([point.station_latitude,point.station_longitude]).addTo(layerVelo).on('click',clickMarqueurVelo);
      marqueur.bindPopup(point.station_nom);    //affiche un popup lorsqu'on clique sur le marqueur
    
      function clickMarqueurVelo(){   //fonction qui ajoute les informations supplémentaires (nombre d'accroches libres et vélos disponibles) à la liste infos
        while(infos.firstChild){
          infos.removeChild(infos.firstChild);    //enlève tout contenu de la liste où les infos s'ajoutent
        }
        var liNom = document.createElement("li");   //création du futur li contenant une info
        liNom.textContent=element.fields.station_nom;    //ajout du nom de la station
        infos.appendChild(liNom);
        console.log(liNom);
        var liAccroche = document.createElement("li");
        liAccroche.textContent="accroches libres : "+point.accroches_libres;  //ajout du nombres d'accroches libres
        infos.appendChild(liAccroche);
        console.log(liAccroche);
        var liVeloDispo = document.createElement("li");
        liVeloDispo.textContent="vélos disponibles : "+point.velos_disponibles; //ajout du nombres de vélos disponibles
        infos.appendChild(liVeloDispo);
        console.log(liVeloDispo);
      };
   });
});
  
var indexVelo=0;
function getVelo(){   //fonction de test qui en fonction de la valeur de indexVelo, affiche ou enlève tous les marqueurs vélos
   if(indexVelo==0){
   layerVelo.addTo(map);
   indexVelo=1;
   } else {
      layerVelo.remove();
      indexVelo=0;
   };
};


   //////////////   BUS    /////////////
const boutonBus = document.getElementById('boutonBus');        //bouton pour afficher ou non les bus
boutonBus.addEventListener('click',getBus);
    
var listeBus;
var layerBus=L.layerGroup();
//récupération des données de l'API dans une variable
const promesseRecupBus= axios.get('https://api.agglo-larochelle.fr/production/opendata/api/records/1.0/search/dataset=transport_yelo___gtfs_stop_des_bus&rows=1517&facet=stop_id&facet=stop_name&facet=stop_lat&facet=stop_lon');
promesseRecupBus.then(reponseaAjax=> {
const donneesRecues=reponseaAjax.data;
listeBus=donneesRecues.records;
    
listeBus.forEach(element => {    //fonction qui à chaque élément de la liste des bus lui ajoute un marqueur correspondant à ses coordonnées
   var point= element.fields;
   var marqueur= L.marker([point.stop_lat,point.stop_lon]).addTo(layerBus).on('click',clickMarqueurBus);
   marqueur.bindPopup(point.stop_name);      //affiche un popup lorsqu'on clique sur le marqueur
    
   function clickMarqueurBus(){     //fonction qui ajoute les informations supplémentaires (nombre d'accroches libres et vélos disponibles) à la liste infos
      while(infos.firstChild){
         infos.removeChild(infos.firstChild);      //enlève tout contenu de la liste où les infos s'ajoutent
      };
      var liNom = document.createElement("li");    //création du futur li contenant une info
      liNom.textContent=point.stop_name;           //ajout du nom de la station
      infos.appendChild(liNom);
      console.log(liNom);
      };
   });
});

var indexBus=0;
function getBus(){          //fonction de test qui en fonction de la valeur de indexBus, affiche ou enlève tous les marqueurs bus
   if(indexBus==0){
      layerBus.addTo(map);
      indexBus=1;
   } else {
      layerBus.remove();
      indexBus=0;
   };
};



//////////////   TRAIN    /////////////
const auth={                                          //token d'authentification pour se connecter à l'api
   username: "8ab24740-7316-4584-8865-5478ceca7e53",
   password:""
};
const boutonGare = document.getElementById('boutonGare');      //bouton pour afficher ou non les gares
boutonGare.addEventListener('click',getGare);
 
var listeGare;
var layerGare= L.layerGroup();
//récupération des données de l'API dans une variable
const promesseRecupGare=axios.get('https://ressources.data.sncf.com/api/records/1.0/search/?dataset=referentiel-gares-voyageurs&q=&rows=3213&sort=gare_alias_libelle_noncontraint&facet=departement_libellemin&facet=segmentdrg_libelle&facet=gare_agencegc_libelle&facet=gare_regionsncf_libelle&facet=gare_ug_libelle&facet=commune_libellemin&facet=gare_alias_libelle_noncontraint');
promesseRecupGare.then(reponseaAjax=> {
   const donneesRecues=reponseaAjax.data;
   listeGare=donneesRecues.records;
   console.log(listeGare);
 
   listeGare.forEach(element => {      //fonction qui à chaque élément de la liste des gares de La Rochelle lui ajoute un marqueur correspondant à ses coordonnées
      var point = element.fields;
      if(point.commune_libellemin=="Rochelle"){    //test si la gare est à La Rochelle
         var marqueur = L.marker([point.latitude_entreeprincipale_wgs84,point.longitude_entreeprincipale_wgs84]).addTo(layerGare).on('click',clickMarqueurGare);
      marqueur.bindPopup(point.gare_alias_libelle_noncontraint);        //nom de la gare
 
      function clickMarqueurGare(){
         while(infos.firstChild){
            infos.removeChild(infos.firstChild);      //enlève tout contenu de la liste où les infos s'ajoutent
         };
         var liNom=document.createElement("li");
         liNom.textContent=point.gare_alias_libelle_noncontraint;
         infos.appendChild(liNom);
         if(point.uic_code=="0087485003"){
            //récupération des données de l'API d'une gare dans une variable
            const promesseRecupGare1=axios.get('https://api.sncf.com/v1/coverage/sncf/stop_areas/stop_area%3ASNCF%3A87485003/departures?count=10&',{auth});
            promesseRecupGare1.then(reponseaAjaxGare1=> {
               const donneesRecuesGare1=reponseaAjaxGare1.data;
               const listeTrainG1=donneesRecuesGare1.departures;
               console.log(listeTrainG1);
 
               listeTrainG1.forEach(element => {         //pour chaque train, ajoute sa destination est l'heure de départ dans la liste des informations
                  var li = document.createElement("li");
                  var dateEntiere = element.stop_date_time.departure_date_time;
                  var date=dateEntiere.slice(-6,-4)+":"+dateEntiere.slice(-4,-2);
                  li.textContent=element.display_informations.direction+" -- "+date;
                  li.classList.add("ligneTrain",element.links[2].id);         //ajout de l'id de route du train pour avoir le trajet
                  infos.appendChild(li);
               });
 
               var listeTrainAffiche=document.querySelectorAll("li.ligneTrain");    //selection de tous les trains affichés dans la liste
               listeTrainAffiche.forEach(element =>{     //pour chaque train on leur assigne une fonction
                  element.addEventListener("click",parcoursTrain);
                  var layerTrajet= L.layerGroup();
                  function parcoursTrain(){     //fonction qui récupère la route du train sélectionné, affiche toutes les gares où il passe et relie les gares
                     var urlVide= "https://api.sncf.com/v1/coverage/sncf/routes//departures?count=80&";
                     var urlComplete=urlVide.slice(0,45) + element.classList[1] + urlVide.slice(45);
                     const promesseRecupTrajet=axios.get(urlComplete,{auth});    //récupération API de la route du train
                     promesseRecupTrajet.then(reponseaAjax=> {
                        console.log(reponseaAjax);
                        const donneesRecuesTrajet=reponseaAjax.data;
                        const listeTrajet=donneesRecuesTrajet.departures;
                        console.log(listeTrajet);
                        layerTrajet.clearLayers();
                        var terminus= element.textContent.slice(0,-9);    
                        var testTerminus="";
                        let i=0;
                        while(terminus!=testTerminus){   //ajoute les gares desservies tant que la gare destination n'est pas atteinte
                           var heure= listeTrajet[i].stop_date_time.departure_date_time.slice(-6,-4)+":"+listeTrajet[i].stop_date_time.departure_date_time.slice(-4,-2);   //heure d'arrivée en gare
                           //création du marqueur d'une gare et lui ajoute un popup pour le nom de la gare et l'heure d'arrivée en gare
                           var marqueurTrajet= L.marker([listeTrajet[i].stop_point.coord.lat,listeTrajet[i].stop_point.coord.lon]).bindPopup(listeTrajet[i].stop_point.label+" -- "+heure).addTo(layerTrajet);
                           testTerminus=listeTrajet[i].stop_point.label;
                           i++;
                        };
                        for(let i=0;i<layerTrajet.getLayers().length-1;i++){     //relie toutes les gares une par une
                           var marqueur1= layerTrajet.getLayers()[i];      //prend un point
                           var marqueur2= layerTrajet.getLayers()[i+1];    //prend le point suivant
                           var ligne=L.polygon([[marqueur1._latlng.lat,marqueur1._latlng.lng],[marqueur2._latlng.lat,marqueur2._latlng.lng]]).addTo(map);    //relie les deux points
                        };
                     });
                     layerTrajet.addTo(map);
                  };
               });
            });
 
         } else {
            //récupération des données de l'API d'une gare dans une variable
            const promesseRecupGare2=axios.get('https://api.sncf.com/v1/coverage/sncf/stop_areas/stop_area%3ASNCF%3A87437798/departures?count=10&',{auth});
            promesseRecupGare2.then(reponseaAjaxGare2=> {
               const donneesRecuesGare2=reponseaAjaxGare2.data;
               const listeTrainG2=donneesRecuesGare2.departures;
               console.log(listeTrainG2);
 
               listeTrainG2.forEach(element => {            //pour chaque train, ajoute sa destination est l'heure de départ dans la liste des informations
                  var li = document.createElement("li");
                  var dateEntiere = element.stop_date_time.departure_date_time;
                  var date=dateEntiere.slice(-6,-4)+":"+dateEntiere.slice(-4,-2);
                  li.textContent=element.display_informations.direction+" -- "+date;
                  li.classList.add("ligneTrain",element.links[2].id,);           //ajout de l'id de route du train pour avoir le trajet
                  infos.appendChild(li);
               });
           
               var listeTrainAffiche=document.querySelectorAll("li.ligneTrain");       //selection de tous les trains affichés dans la liste
               listeTrainAffiche.forEach(element =>{              //pour chaque train on leur assigne une fonction
                  element.addEventListener("click",parcoursTrain);
                  var layerTrajet= L.layerGroup();
                  function parcoursTrain(){           //fonction qui récupère la route du train sélectionné, affiche toutes les gares où il passe et relie les gares
                     var urlVide= "https://api.sncf.com/v1/coverage/sncf/routes//departures?count=80&";
                     var urlComplete=urlVide.slice(0,45) + element.classList[1] + urlVide.slice(45);
                     const promesseRecupTrajet=axios.get(urlComplete,{auth});       //récupération API de la route du train
                     promesseRecupTrajet.then(reponseaAjax=> {
                        const donneesRecuesTrajet=reponseaAjax.data;
                        const listeTrajet=donneesRecuesTrajet.departures;
                        console.log(listeTrajet);
                        layerTrajet.clearLayers();
                        var terminus= element.textContent.slice(0,-9);
                        var testTerminus="";
                        let i=0;
                        while(terminus!=testTerminus){         //ajoute les gares desservies tant que la gare destination n'est pas atteinte
                           var heure= listeTrajet[i].stop_date_time.departure_date_time.slice(-6,-4)+":"+listeTrajet[i].stop_date_time.departure_date_time.slice(-4,-2);         //heure d'arrivée en gare
                           //création du marqueur d'une gare et lui ajoute un popup pour le nom de la gare et l'heure d'arrivée en gare
                           var marqueurTrajet= L.marker([listeTrajet[i].stop_point.coord.lat,listeTrajet[i].stop_point.coord.lon]).bindPopup(listeTrajet[i].stop_point.label+" -- "+heure).addTo(layerTrajet);
                           testTerminus=listeTrajet[i].stop_point.label;
                           i++;
                        };
                        indexTrajet=1;
                        for(let i=0;i<layerTrajet.getLayers().length-1;i++){        //relie toutes les gares une par une
                           var marqueur1= layerTrajet.getLayers()[i];      //prend un point
                           var marqueur2= layerTrajet.getLayers()[i+1];    //prend le point suivant
                           var ligne=L.polygon([[marqueur1._latlng.lat,marqueur1._latlng.lng],[marqueur2._latlng.lat,marqueur2._latlng.lng]]).addTo(map);    //relie les deux points
                        };
                     });
                     layerTrajet.addTo(map);
                  };
               });
            });
         };
      };
      };
   });
 
});
 
var indexGare=0;
function getGare(){     //fonction de test qui en fonction de la valeur de indexGare, affiche ou enlève tous les marqueurs de gare
   if(indexGare==0){
     layerGare.addTo(map);
     indexGare=1;
   } else {
       layerGare.remove();
       indexGare=0;
   };
};