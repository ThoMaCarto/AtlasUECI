
var attribUECI ='Fond de carte © <a href="http://osm.org/copyright">Contributeurs OpenStreetMap</a><br>Données © <a href="http://urgenceeau.com/urgence-eau-cote-divoire-ueci/">Urgence Eaux Côte d\'Ivoire</a> | Cartographie © <a href="http://www.ladyss.com/thomas-maillard">T.Maillard</a> et Firmain Kouakou N\'guessan '


// création d'une couche en grisaille
var toner = L.tileLayer('https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
     attribution: attribUECI ,
	  opacity:0.9,
	  	     
     });
// Ajouter la couche à la carte		
	map.addLayer(toner);	

   
//échelle
L.control.scale({imperial:false,maxWidth: 200,updateWhenIdle:false}).addTo(map);


//flèche du nord
var north = L.control({position: "topleft"});
	north.onAdd = function(map) {
		var div = L.DomUtil.create("div", );
			div.innerHTML = urlNorthArray;
		return div;
		}
north.addTo(map);

// création d'un contrôle des couches pour modifier les couches affichées
var fond ={ "Noir et blanc": toner};
var controlLayers=L.control.layers(null,null,{collapsed : false}).addTo(map)


//Titre et légende de la carte
var maptitle = L.control({position:"bottomright",},);
maptitle.onAdd = function (map){
var div = L.DomUtil.create("div", "legendin");
div.innerHTML ='<details title="cliquer sur la flèche pour afficher la légende"><summary><strong>Niveau de vulnérabilité des localités</strong></summary><table class="info-legend"><thead><tr ><th></th><th>Milieu rural</th><th>Milieu urbain</th></tr</thead><tbody><tr></tr><tr><td style="background-color:Red;height:10px;width:30px;opacity:.8;border:1px solid Red;"></td><td>Vulnérabilité forte</td><td> Non raccordée au réseau</td></tr><tr></tr><tr><td style="background-color:Orange;height:10px;width:30px;opacity:.8;border:1px solid Orange;"></td><td>Vulnérabilité moyenne</td><td>Partiellement raccordée</td></tr><tr></tr><tr><td style="background-color:yellow;height:10px;width:30px;opacity:.8;border:1px solid yellow;"></td><td>Vulnérabilité faible</td><td>Majoritairement raccordée</td></tr></tbody></table></details>';
return div;
}
maptitle.addTo(map);

////Paramétrage de la charte graphique des éléments cartographiés


        
//Couleur en fonction de la vulnérabilité
function getColorVuln(vulnerabilit) {
          switch (vulnerabilit) {
            case 'Vulnérabilité faible':
              return  'yellow';
            case 'Vulnérabilité moyenne':
              return 'orange';
            case 'Vulnérabilité forte':
              return 'red';
            case 'Majoritairement':
            	return 'yellow';
            case 'Partiellement':
            	return 'orange';
     		default:
              return 'DarkSlateGray ';
          }
        };


  
//var iconclusters = L.markerClusterGroup({maxClusterRadius:45,
//singleMarkerMode:true,
//zoomToBoundsOnClick:true,
//spiderfyOnMaxZoom:true,
//});

//Custom radius and icon create function
		var iconclusters = L.markerClusterGroup({
			maxClusterRadius: 45,
			
			iconCreateFunction: function (cluster) {
				var markers = cluster.getAllChildMarkers();
				var n = markers.length;
				var e =n/2 +4;
				
				
				
				return L.divIcon({ html: n, className: 'mycluster', iconSize: L.point(e, e) });
			},
			//Disable all of the defaults:
			singleMarkerMode: true,
			zoomToBoundsOnClick: true,
			spiderfyOnMaxZoom:true,
			//spiderfyOnMaxZoom: false, showCoverageOnHover: false, zoomToBoundsOnClick: false
		});

$.getJSON(urlpointdeau,function(data){
	var geoJsonLayer = L.geoJson (data,{
		onEachFeature:function (feature,layer) {
		
		//pointToLayer:function(feature,latlng){
			//var marker = new L.circleMarker(latlng,{radius: 5,fillOpacity: 1, color: 'black', fillColor: 'white' ,weight: 1,fillOpacity: 0.8,});
		
		}
		 
	});
	// Add geoJsonLayer to markercluster group
  
  iconclusters.addLayer(geoJsonLayer);
  iconclusters.addTo(map);
  // Add the markercluster group to the map
	//map.addLayer(mClusters);
	controlLayers.addOverlay(iconclusters, "Points d'eau diagnostiqués");
}); 
  
 
 

// création d’une couche geoJson qui appelle le fichier « localites.geojson »
$.getJSON(urllocalites,function(data2)
{
	var vulnLocalites= L.geoJson(data2,{style: function(feature){return { color : getColorVuln(feature.properties.vulnerabil), weight : 1, fillColor : getColorVuln(feature.properties.vulnerabil), fillOpacity : .5 };},
	onEachFeature : function(feature, layer ) {layer.bindPopup('<b><u>Nom de la localité</u></b><br>' + feature.properties.a_quartier +'<br>Niveau de Vulnérabilité : '+ feature.properties.vulnerabil+
	 '<br><strong> Diagnostic détaillé : </strong> <a href="articles/' + articlespath + feature.properties.lien +'" style="text-transform: capitalize;">'+ feature.properties.a_quartier +'</a>')}
});
vulnLocalites.addTo(map);
controlLayers.addOverlay(vulnLocalites, "Niveau de Vulnérabilité");
});

       
	
