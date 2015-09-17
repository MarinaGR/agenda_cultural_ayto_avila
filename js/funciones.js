//var api_url='http://www.avilaturismo.com/api.php';
var api_url='./server/api.php';
var api_url='http://www.hoopale.com/AGENDACULTURAL_PRUEBAS/api.php';
var kml_url='http://www.avilaturismo.com/app/resources/avila.kml';
//var extern_url='http://www.avilaturismo.com/app/';
var extern_url='./server/resources/';
var local_url='./resources/json/';

//var DATOS, DIRECTION, GEOLOCATION;
var CONTENEDOR;

var categ_list=new Object();

var intersticial=true;
var publi_banner_top=false;

var daysNamesMini=new Array('Do','Lu','Ma','Mi','Ju','Vi','Sa');
var monthNames=new Array('Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre');

Date.prototype.getWeek = function() {
    var onejan = new Date(this.getFullYear(), 0, 1);
    return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
}

var current_date=new Date(); 
var current_week=current_date.getWeek();
var current_day_of_month=current_date.getDate();
var current_month=current_date.getMonth();
var current_year=current_date.getFullYear();

/*PROBLEMAS EN IPHONE??
var fecha_split=current_date.toString().split("-");
current_day_of_month=parseInt(fecha_split[2]); 
current_month=parseInt(fecha_split[1]); 
current_year=parseInt(fecha_split[0]);*/

var viewport_width=$(window).outerWidth();
var viewport_height=$(window).outerHeight();
var screen_width=screen.width;
var screen_height=screen.height;

var imgsize="small";

if(viewport_width>=758)
	imgsize="big";

var publi_url='http://sercofradeavila.com/ciudadreal/server/publicidad/loader.php?day='+current_day_of_month+'&month='+current_month+'&imgsize='+imgsize;

function onBodyLoad()
{		
	document.addEventListener("deviceready", onDeviceReady, false);
	
	var alto_minimo=$(window).outerHeight()-parseInt($(".contenedor").css("padding-bottom"))-parseInt($(".contenedor").css("padding-top"))-$(".contenedor_ads").outerHeight(true);
	console.log(alto_minimo);
	
	$(".contenedor").css("min-height", alto_minimo+"px");
	
	if(publi_banner_top)
		$("#iframe_ads").attr('src', publi_url);
	else
		$(".contenedor_ads").html('<img src="./images/logos/aytoAv.png" alt="Ayuntamiento de Ávila" />');  
	
	//Cargamos las categorias en local storage
	categ_list=JSON.parse(getLocalStorage("categ_list"));		
	if(categ_list==null)
	{		
		$.getJSON(local_url+'category_list.json', function (data) 
		{
			categ_list=new Object();	
			$.each(data.result.items, function(index, d) 
			{   		
				categ_list[d.id]=new Array();
			
				categ_list[d.id].push(
					{
						es:d.es,
						en:d.en
					}
				);	
			});				
			setLocalStorage("categ_list", JSON.stringify(categ_list));  
		});		
	}
	
}

function onDeviceReady()
{					
	document.addEventListener("offline", onOffline, false);
	document.addEventListener("online", onOnline, false);

	document.addEventListener("backbutton", onBackKeyDown, false);
	document.addEventListener("menubutton", onMenuKeyDown, false);
	 
}    
function onBackKeyDown()
{
	if(window.location.href.search(new RegExp("index.html$")) != -1 || window.location.href.search(new RegExp("main_menu.html$")) != -1) 
	{		
		navigator.app.exitApp();
		return false;
	}
	window.history.back();
}
function onMenuKeyDown()
{
	window.location.href='menu.html';
}
function onOutKeyDown()
{
	navigator.app.exitApp();
	return false;
}
function onOnline()
{
	/*var networkState = navigator.connection.type;

    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.CELL]     = 'Cell generic connection';
    states[Connection.NONE]     = 'No network connection';

    alert('Conexión: ' + states[networkState]);*/

}
function onOffline()
{
	//$(".contenedor").prepend("Necesita conexión a internet para poder ver correctamente todos los contenidos de la aplicación");
}

function detect_system_device() 
{
	if(device.platform!='android' && device.platform!='Android') 
	{
		
	}
	else
	{
		
	}
}

function show_offer(imagen) {
	$("#cortina2").show('fade', function() {
		$(".cupon_02").html("<img src='"+imagen+"' alt='oferta' />");
		$(".cupon_02").show();
	});
}
function hide_offer() {
	$(".cupon_02").hide();
	$("#cortina2").hide();
}

function format_date(fecha) {
	var fecha_split=fecha.split("-");
	var fecha_formateada=fecha_split[0]+" de "+monthNames[parseInt(fecha_split[1])-1]+" de "+fecha_split[2];
	
	return fecha_formateada;	
}
function format_date2(fecha) {
	var fecha_split=fecha.split("-");
	var fecha_formateada=fecha_split[0]+"/"+addZero(parseInt(fecha_split[1])+1)+"/"+fecha_split[2];
	
	return fecha_formateada;	
}

function addZero(number) {
	if(number<10) 
	{
		number="0"+number;
	}
	return number;
}

function get_date_to_api(date) {
	var fecha_split=date.split("-");
	var fecha_to_api=fecha_split[0]+"-"+addZero(parseInt(fecha_split[1])+1)+"-"+fecha_split[2];
	
	return fecha_to_api;
}

function get_program(container) {
	$.ajax({
		url: api_url,
		data: { date: "", o: "get_active_program" },
		type: 'POST',
		dataType: 'json',
		crossDomain: true, 
		success: function(data) {
					var cadena='<div class="boton_01" onclick="window.open('+data.url_program+', \'_system\', \'location=yes\'); ">Ver programa</div>';
					$("#"+container).append(cadena);
				},
		error: function(jqXHR, textStatus, errorThrown){
					//alert('Error: '+textStatus+" - "+errorThrown);	
					if(jqXHR.status == 404) {
						//$("#"+container).html("No hay informaci&oacute;n");
					}
					else
					{
						//$("#"+container).html("Necesita conexi&oacute;n a internet para acceder a esta secci&oacute;n.");
					}
				},
		async:false,
	});
	
	var url="http://www.avila.es/images/Documentos%20PDF%20para%20descargar/CULTURA%20Y%20EVENTOS/AvilaFiestas2015.pdf";
	
	var cadena='<br><div class="boton_02" onclick="window.open(\''+url+'\', \'_system\', \'location=yes\'); "><i class="fa fa-book fa-fw fa-lg"></i> DESCARGAR PROGRAMA</div>';
	cadena+="<div class='contenedor_program' style='height:"+(viewport_height-$("#menu").outerHeight())+"px'><iframe src='https://docs.google.com/viewer?url="+url+"&embedded=true' class='iframe_program' id='programa' ></iframe></div>";
		
	$("#"+container).append(cadena);
		
	/*setTimeout(function() {
		
		$("#programa").attr("src","https://docs.google.com/viewer?url="+url+"&embedded=true");
		
	}, 500);*/
	
}

function get_data_api(date, identificador, operation, container) {
	
	if(date!="")
		date=get_date_to_api(date);
	
	$.ajax({
	 // url: extern_url+"json/"+identificador+".json",
	  url: api_url,
	  data: { p: [['date', date], ['id', identificador]], o: operation },
	  type: 'POST',
	  dataType: 'json',
	  crossDomain: true, 
	  success: f_success,
	  error: f_error,
	  async:false,
	});
		
	
	function f_success(data) {
		if(data.length==0) {
			$("#"+container).html("No hay informaci&oacute;n.");
			return;
		}
		
		switch(operation)
		{
			case "events": 
						var cadena="";
						
						if(data.status=="KO")
						{
							cadena='<ul class="lista_eventos_01">'+
										'<li>'+
											'<div class="e_fecha">'+format_date(date)+'</div>'+
											'<p>- '+data.error+' -</p>'+
										'</li>'+
									'</ul>';											
						}
						else
						{
				
							cadena='<ul class="lista_eventos_01">'+
										'<li>'+
											'<div class="e_fecha">'+format_date(date)+'</div>'+
											'<ul class="fecha_evento">';
							
							$.each(data.result, function(index, d) {   
								cadena+='<li onclick="go_to_page(\'evento\',\''+d.id+'\')">'+
											'<div class="e_titulo">'+d.titulo+'</div>';
								if(d.hora!="")
								{
									cadena+='<div class="e_hora">'+
												'<i class="fa fa-clock-o fa-fw"> </i> '+d.hora+
											'</div>';
								}
											
								cadena+='<div class="e_lugar">'+
												'<i class="fa fa-map-marker fa-fw"> </i> '+d.lugar+
											'</div>'+
										'</li>';
							});
								
							cadena+='</ul>'+
								'</li>'+
							'</ul>';
						
						}
							
						$("#"+container).html(cadena);
						
						break;
						
			case "event": 
						var cadena="";
						
						var d=data.result;
						
						var fecha_ini=d.fecha_ini;
						var fecha_fin=d.fecha_fin;
						var campo_fecha;
						if(fecha_ini==fecha_fin)
						{
							campo_fecha=fecha_ini;
						}
						else
						{
							campo_fecha=fecha_ini+" a "+fecha_fin;
						}
						
						if(d.imagenDestacada!="")
						{
							cadena+='<div class="e_imagen" style="background-image:url('+d.imagenDestacada+')"> </div>';
						}
						
						cadena+= '<div class="e_titulo_02">'+d.titulo+'</div>'+
								'<div class="e_hora_02"><i class="fa fa-calendar fa-fw fa-lg"> </i> '+campo_fecha+'</div>';
								
						if(d.hora!="")
						{
							cadena+= '<div class="e_hora_02"><i class="fa fa-clock-o fa-fw fa-lg"> </i> '+d.hora+'h.</div>';
						}
						
						cadena+='<div class="e_lugar_02">'+
									'<i class="fa fa-map-marker fa-fw fa-lg"> </i> '+d.lugar+
								'</div>';
								
						if(d.precio!="")
						{
							cadena+='<div class="e_precio_02"><i class="fa fa-ticket fa-fw fa-lg"> </i> '+d.precio+'</div>';
						}
						
						cadena+='<div class="boton_01" onclick="load_geolocate_map(\''+d.lugar+'\',\''+d.geolocalizacion+'\',\'location_map\');">'+
								'<i class="fa fa-location-arrow fa-fw fa-lg"> </i> ¿Cómo llegar?</div>'+
								
								'<div class="e_geolocation_map" id="location_map"> </div>'+
								
								'<div class="e_descripcion">'+d.descripcion+'</div>';

						$("#"+container).html(cadena);
						
						break;		
						
				
				case "place":
				
						var cadena="";
						
						var d=data.result;
												
						if(d.imagenDestacada!="")
						{
							cadena+='<div class="e_imagen" style="background-image:url('+d.imagenDestacada+')"> </div>';
						}
						
						cadena+='<div class="e_titulo_02">'+d.nombre+'</div>';
						
						if(d.tlf)
							cadena+='<div class="e_tlf_03"><span><i class="fa fa-phone fa-fw fa-lg"> </i> TELÉFONO</span><br>'+d.tlf+'</div>';
							
						if(d.web)
							cadena+='<div class="e_web_03"><span><i class="fa fa-globe fa-fw fa-lg"> </i> WEB</span><br>'+d.web+'</div>';
							
						if(d.horario)
							cadena+='<div class="e_horario_03"><span><i class="fa fa-clock-o fa-fw fa-lg"> </i> HORARIO</span><br>'+d.horario+'h.</div>';
													
						if(d.entrada)
							cadena+='<div class="e_precio_03"><span><i class="fa fa-ticket fa-fw fa-lg"> </i> ENTRADA</span><br>'+d.entrada+'</div>';
						
						cadena+='<div class="e_lugar_03">'+
									'<span><i class="fa fa-map-marker fa-fw fa-lg"> </i> DIRECCIÓN</span><br>'+d.lugar+
								'</div>';
								
						cadena+='<div class="boton_01" onclick="load_geolocate_map(\''+d.lugar+'\',\''+d.geolocalizacion+'\',\'location_map\');">'+
								'<i class="fa fa-location-arrow fa-fw fa-lg"> </i> ¿Cómo llegar?</div>'+								
								'<div class="e_geolocation_map" id="location_map"> </div>'+								
								'<div class="e_descripcion">'+d.descripcion+'</div>';
								
						$("#"+container).html(cadena);
						
						break;
						 
				case "events_slide":
						var cadena="";
						
						if(data.status=="KO")
						{
							cadena='<div class="swiper-slide">'+
										'- '+data.error+' -'+
									'</div>';	
						}
						else
						{				
							$.each(data.result, function(index, d) {   						
						
								cadena+='<div class="swiper-slide" onclick="go_to_page(\'evento\','+d.id+')">'+
											'<div class="e_titulo">'+d.titulo+'</div>'+
											'<div class="e_data">';
								if(d.hora!="")
								{
									cadena+='<i class="fa fa-clock-o fa-fw"> </i> '+d.hora+'h. ';
								}
								
								cadena+='<i class="fa fa-map-marker fa-fw"> </i> '+d.lugar+
											'</div>'+
										'</div>';									
							});
						}
							
						$("#"+container).html(cadena);
					
						break;	
					
			case "map_places":
						//Center Avila position
						var lat1 = 40.653663;
					  	var lon1 = -4.693832;
					  	var latlong = lat1+","+lon1;
						
						//GMAP3
						var myLocation=new google.maps.LatLng(lat1, lon1);	
						var todos_puntos=new Array();
				
						var resultados=0;
						var enlace_punto="";
						$.each(data.result, function(i, d) {
							
							enlace_punto="<p><a href='punto.html?id="+d.id+"' >"+d.nombre+"</a></p>";
									
							var coord=d.geolocalizacion.split(/[(,)]/);
							var lat=coord[0];
							var lon=coord[1]; 			
							todos_puntos.push(
								{
									latLng:new Array(lat, lon),
									data: enlace_punto,
									options:{
									  icon: "./images/general/gen_map.png"
									},
									events:
									{
							          click:function(marker, event, context)
											{
												var map = $(this).gmap3("get"),
													infowindow = $(this).gmap3({get:{name:"infowindow"}});
												if (infowindow)
												{
													infowindow.open(map, marker);
													infowindow.setContent(context.data);
												} 
												else {
													$(this).gmap3({
														infowindow:{
															anchor:marker, 
															options:{content: context.data}
														}
													});
												}
											}
							        }
								}
							);	
										
						});						

						if(resultados==0)
						{
							$("#"+container).html("<p>- No hay resultados -</p>"); 
						}	
						
						$("#"+container).gmap3({
							  map:{
								options:{
								  center: myLocation,
								  zoom: 14,
								  mapTypeId: google.maps.MapTypeId.ROADMAP
								}
							  },
							  marker:{
								values: todos_puntos,
								events:{ // events trigged by markers 
									click: function(marker, event, context)
											{
												var map = $(this).gmap3("get"),
													infowindow = $(this).gmap3({get:{name:"infowindow"}});
												if (infowindow)
												{
													infowindow.open(map, marker);
													infowindow.setContent(context.data);
												} 
												else {
													$(this).gmap3({
														infowindow:{
															anchor:marker, 
															options:{content: context.data}
														}
													});
												}
											}
								},
								callback: function() {
									 $("#geoloc_map_text_02").html("");
								}
							  }
							});

						
						break;
						
			case "offers":
						var cadena="";
						
						if(data.status=="KO")
						{
							cadena='<p>- '+data.error+' -</p>';	
						}
						else
						{				
							$.each(data.result, function(index, d) {   						
						
								cadena+='<div class="cupon_01" onclick="show_offer(\''+d.imagenDestacada+'\')" style="background:url('+d.imagenDestacada+') no-repeat center; ">'+
											'<div class="cupon_info">'+
												'<div class="e_titulo">'+d.titulo_oferta+'</div>'+
												'<div class="e_data">'+d.nombre_establecimiento;
												
								if(d.fecha_validez)
								{
									cadena+='<br><i class="fa fa-calendar fa-fw"> </i> '+d.fecha_validez;
								}
								if(d.fecha_validez)
								{
									cadena+='<br><i class="fa fa-map-marker fa-fw"> </i> '+d.direccion;
								}									
													
								cadena+='</div>'+
											'</div>'+
										'</div>';									
							});
						}
							
						$("#"+container).html(cadena);
					
						break;	
	
		}
		
		$("a").on("click", function(e) {
			
			var url = $(this).attr('href');
			var containsHttp = new RegExp('http\\b'); 

			if(containsHttp.test(url)) { 
				e.preventDefault(); 
				window.open(url, "_system", "location=yes"); // For iOS
				//navigator.app.loadUrl(url, {openExternal: true}); //For Android
			}
		});	
	
	}
	
	function f_error(jqXHR, textStatus, errorThrown){
		//alert('Error: '+textStatus+" - "+errorThrown);	
		if(jqXHR.status == 404) {
			$("#"+container).html("No hay informaci&oacute;n");
		}
		else
		{
			$("#"+container).html("Necesita conexi&oacute;n a internet para acceder a esta secci&oacute;n.");
		}
	}
}

function load_geolocate_map(direccion, geolocalizacion, container) {
	
	if (navigator.geolocation)
	{
		options = {
		  enableHighAccuracy: true,
		  timeout: 15000,
		  maximumAge: 30000
		};
		
		navigator.geolocation.getCurrentPosition(function(position){
	
			if(geolocalizacion!="")
			{
				geolocalizacion=geolocalizacion.split(/[(,)]/);
				var geo_lat=geolocalizacion[0];
				var geo_lon=geolocalizacion[1];
	
				setTimeout(function() {
	
					$("#"+container).gmap3({
						  getroute:
						  {
							  options:
							  {
									origin:new google.maps.LatLng(position.coords.latitude,position.coords.longitude),
									destination:new google.maps.LatLng(geo_lat, geo_lon),
									travelMode: google.maps.DirectionsTravelMode.DRIVING
							  },		
						  
							  callback: function(results)
							  			{
										      if (!results) return;
										      $(this).gmap3({
										        map:{
										          options:{
										            center: [geo_lat, geo_lon]
										          }
										        },
										        directionsrenderer:{
										          options:{
										            directions:results
										          } 
										        }
										      });							  
										}
						  }
					});
					
				}, 500);
				
				$("#"+container).toggle("blind");
									
			}
			else
			{
				$("#"+container).html("<p>Sin localización</p>");			
			}
			
			$("body,html").animate({scrollTop:$(".boton_01").offset().top},500);
			
		}, function() {
			
				draw_map_point(direccion, geolocalizacion, container);
							
		}, options);
		
	}
	else
	{	
		$("#datos_geo_position").html("<p class='data_route'>"+TEXTOS[44]+"</p>");	
		$("#cargando").hide();
	}
	
}

function draw_map_point(direccion, geolocalizacion, container) {
	
	geolocalizacion=geolocalizacion.split(/[(,)]/);
	var geo_lat=geolocalizacion[0];
	var geo_lon=geolocalizacion[1];
	var my_zoom=16;
	
	setTimeout(function() {
		
		$("#"+container).gmap3({
			address:direccion,
			map:{
					options:{
						mapTypeId: google.maps.MapTypeId.ROADMAP,
						center:[geo_lat, geo_lon],
						zoom:my_zoom
					}
				},
			marker:{
					values:[{latLng:[geo_lat, geo_lon], data:direccion}],
					events:{
							  click: function(marker, event, context){
									var map = $(this).gmap3("get"),
									  	infowindow = $(this).gmap3({get:{name:"infowindow"}});
									if (infowindow){
										  infowindow.open(map, marker);
										  infowindow.setContent(context.data);
									} else {
										  $(this).gmap3({
												infowindow:{
													  anchor:marker, 
													  options:{content: context.data}
												}
										  });
									}
							  }
						}
				}
		});
		
		$("#"+container).toggle("blind");
		$("body,html").animate({scrollTop:$(".boton_01").offset().top},500);
		
	}, 500);
		
}

function show_localstorage_data(type, container, params) {

	if(params)
	{
		for(var i=0;i<params.length;i++)
		{
			if(params[i][0]=="id")
			{
				var id=params[i][1];
			}
		}
	}
	
	switch(type)
	{
		case "cat_list": 			
					var cadena="";
					
					if(getLocalStorage("categ_list")==null || typeof JSON.parse(getLocalStorage("categ_list"))=="undefined")					
					{
						$("#"+container).html("<p>"+TEXTOS[9]+"</p>");
					}					
					else
					{
						cadena+="<h3>"+TEXTOS[40]+"</h3>";
						cadena+='<select id="my_location_select" class="ov_select_01" onchange="go_to_page(\'my_location\',$(\'#my_location_select\').val());">';
						cadena+='<option value="">'+TEXTOS[39]+'</option>';
						
						$.each(JSON.parse(getLocalStorage("categ_list")), function(index, data) {
						
							$.each(data, function(i, d) {			

								switch(getLocalStorage("current_language"))
								{
									default:
									case "es":  var informacion=d.es;	
												break;
												
									case "en":  var informacion=d.en;	
												break;
								}
								
								if(id==index)
									cadena+='<option value="'+index+'" selected>'+informacion+'</option>';		
								else			
									cadena+='<option value="'+index+'">'+informacion+'</option>';
								
							});
						});
						
						cadena+='</select>';
						
						cadena+='<div class="ov_clear_floats_01">&nbsp;</div>';
						
						$("#"+container).html(cadena);
					}				
					break;

	}
}

function ajax_recover_extern_data(operation, container, params) {

	$.ajax({
		  url: api_url,
		  data: { o: operation, p:params },
		  type: 'POST',
		  dataType: 'json',
		  crossDomain: true, 
		  success: f_e_success,
		  error: f_e_error,
		  async:false,
	});
		
	if(params)
	{
		for(var i=0;i<params.length;i++)
		{
			if(params[i][0]=="id")
			{
				var filter_id=params[i][1];
			}
		}
	}

	function f_e_success(data) {
	
		if(data.length==0) {
			
			$("#"+container).html("<div id='ov_zone_15' class='ov_zone_15'><br>"+TEXTOS[7]+"</div>");
			return;
		}
		
		switch(operation)
		{
			case "blog": 			
							break;
					
			case "events": 
						var cadena="";
				
						cadena='<ul class="lista_eventos_01">'+
									'<li>'+
										'<div class="e_fecha">'+d.fecha+'</div>'+
										'<ul class="fecha_evento">';
						
						$.each(data.result, function(index, d) {   
							cadena='<li onclick="go_to_page(\'evento\',\''+d.identificador+'\')">'+
										'<div class="e_titulo">'+d.titulo+'</div>'+
										'<div class="e_hora">'+
											'<i class="fa fa-clock-o fa-fw"> </i> '+d.hora+
										'</div>'+
										'<div class="e_lugar">'+
											'<i class="fa fa-map-marker fa-fw"> </i> '+d.lugar+
										'</div>'+
									'</li>';
						});
							
						cadena+='</ul>'+
							'</li>'+
						'</ul>';
						
						$("#"+container).html(cadena);
						
						break;
						
			case "event": 
						var cadena="";
						
						var d=data.result;
						
						var fecha_ini=d.fecha_ini;
						var fecha_fin=d.fecha_fin;
						var campo_fecha;
						if(fecha_ini==fecha_fin)
						{
							campo_fecha=fecha_ini;
						}
						else
						{
							campo_fecha=fecha_ini+" a "+fecha_fin;
						}
						
						cadena= '<div class="e_imagen" style="background-image:url('+d.imagenDestacada+')"> </div>'+
								'<div class="e_titulo_02">'+d.titulo+'</div>'+
								'<div class="e_hora_02"><i class="fa fa-calendar fa-fw fa-lg"> </i> '+campo_fecha+'</div>'+
								'<div class="e_hora_02"><i class="fa fa-clock-o fa-fw fa-lg"> </i> '+d.hora+' h.</div>'+
								'<div class="e_lugar_02">'+
									'<i class="fa fa-map-marker fa-fw fa-lg"> </i> '+d.lugar+
								'</div>'+
								'<div class="e_precio_02"><i class="fa fa-ticket fa-fw fa-lg"> </i> '+d.precio+'</div>'+
								'<div class="boton_01" onclick="load_geolocate_map(\''+d.lugar+'\',\''+d.geolocalizacion+'\',\'location_map\');">'+
								'<i class="fa fa-location-arrow fa-fw fa-lg"> </i> ¿Cómo llegar?</div>'+
								
								'<div class="e_geolocation_map" id="location_map"> </div>'+
								
								'<div class="e_descripcion">'+d.descripcion+'</div>';

						$("#"+container).html(cadena);
						
						break;		
					
		}
		
		$("a").on("click", function(e) {
			var url = $(this).attr('href');
			var containsHttp = new RegExp('http\\b'); 
			var containsHttps = new RegExp('https\\b'); 

			if(containsHttp.test(url)) { 
				e.preventDefault(); 
				window.open(url, "_system", "location=yes"); // For iOS
				//navigator.app.loadUrl(url, {openExternal: true}); //For Android
			}
			else if(containsHttps.test(url)) { 
				e.preventDefault(); 
				window.open(url, "_system", "location=yes"); // For iOS
				//navigator.app.loadUrl(url, {openExternal: true}); //For Android
			}
		});	
	
	}
	function f_e_error(jqXHR, textStatus, errorThrown) {
		//alert('Error: "+textStatus+"  "+errorThrown);	
		
		$("#"+container).html("<div id='ov_zone_15' class='ov_zone_15'><br>"+TEXTOS[10]+"</div>");
	}
	
}


function show_geoloc(redraw)
{
	if (navigator.geolocation)
	{
		//navigator.geolocation.watchPosition(draw_geoloc, error_geoloc_02, options);
		
		options = {
		  enableHighAccuracy: true,
		  timeout: 15000,
		  maximumAge: 30000
		};
		
		$("#cargando").show('fade', function() {
			if(redraw)
				navigator.geolocation.getCurrentPosition(draw_geoloc_02,error_geoloc_02,options);
			else
				navigator.geolocation.getCurrentPosition(draw_geoloc,error_geoloc_02,options);
			
		});
	}
	else
	{	
		$("#datos_geo_position").html("<p class='data_route'>"+TEXTOS[44]+"</p>");	
		$("#cargando").hide();
	}
}

function error_geoloc_02(error)
{
	if(error.code == 1) {
		$("#datos_geo_position").html("<p class='data_route'>La geolocalizaci&oacute;n ha fallado. Acceso denegado.</p>");	
	} 
	else if( error.code == 2) {
		$("#datos_geo_position").html("<p class='data_route'>La geolocalizaci&oacute;n ha fallado. Posición no disponible.</p>");	
	}
	else {
		$("#datos_geo_position").html("<p class='data_route'>La geolocalizaci&oacute;n ha fallado.</p>");	
	}
	$("#cargando").hide();
}

function error_geoloc(error)
{
	$("#geoloc_map_text").html("<p>"+TEXTOS[19]+"</p>");
}

function get_current_pos_user(data, filter_id, filter_name, container, is_mun, is_serv)
{
	DATOS=data;
	FILTRO=filter_id;
	NOMBRE_FILTRO=filter_name;
	CONTENEDOR=container;
	ES_MUNICIPIO=is_mun;
	ES_SERVICIO=is_serv;
	
	if (navigator.geolocation)
	{		
		navigator.geolocation.getCurrentPosition(return_current_points,return_all_points,{enableHighAccuracy:true, maximumAge:30000, timeout:10000});
				
		$("#"+container).append("<div class='ov_zone_15'><p>"+TEXTOS[4]+"</p></div>");
		
	}
	else
	{
		return_all_points();
	}
}

//Para obtener las coordenadas dando una direccion
function getLocation(address) {
	var geocoder = new google.maps.Geocoder();
	geocoder.geocode({ 'address': address }, function (results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			var latitude = results[0].geometry.location.lat();
			var longitude = results[0].geometry.location.lng();
			var latlon="("+latitude+","+longitude+")";
			return latlon;
		} else {
			return false;
		}
	});
}

function return_current_points(position)
{
	//User position
	var lat1 = position.coords.latitude;
  	var lon1 = position.coords.longitude;
  	var latlong = lat1+","+lon1;
	
	var cadena="";
	
	if(typeof FILTRO=="undefined")
		q="";
	
	var q = FILTRO,
			regex = new RegExp(q, "i");
	
	cadena+="<div class='ov_zone_15'><h3>"+NOMBRE_FILTRO+"</h3><p>"+TEXTOS[42]+" "+RADIO_DESDE_USER+" "+TEXTOS[24]+"</p></div>";
	
	var near_points=new Array();
	var resultados=0;
	$.each(DATOS.result.items, function(index, d) {   

		if(ES_SERVICIO)
		{
			//Point position				
			d.geolocalizacion=getLocation(d.direccion);
			//Habría que esperar al callback de la función, mejor añadir estos datos en el fichero json de servicios
		}
		
		//Point position
		var geolocalizacion=d.geolocalizacion.split(/[(,)]/);
		var lat2=parseFloat(geolocalizacion[1]);
		var lon2=parseFloat(geolocalizacion[2]);
		
		
		//SI NO HAY FILTRO
		if(typeof q=="undefined" || q=="")
		{
			var radio=RADIO_DESDE_USER;
			var radioTierra=6371; //km

			var dLat = (lat2-lat1).toRad();
			var dLon = (lon2-lon1).toRad();

			var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
					Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) *
					Math.sin(dLon/2) * Math.sin(dLon/2);
			var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
			var di = radioTierra * c;

			if(di<=radio)
				near_points.push(d);
		
		}
		else
		{
			if(!ES_MUNICIPIO)
			{
				$.each(d.categoria, function(i, cat) {
					if(cat.id.search(regex) != -1) 
					{							
							var radio=RADIO_DESDE_USER;
							var radioTierra=6371; //km
	
							var dLat = (lat2-lat1).toRad();
							var dLon = (lon2-lon1).toRad();
							
							var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
									Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) *
									Math.sin(dLon/2) * Math.sin(dLon/2);
							var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
							var di = radioTierra * c;
							
							if(di<=radio)
								near_points.push(d);
						
					}
				});
			}
			else
			{
				if(d.id.search(regex) != -1) 
				{							
						var radio=RADIO_DESDE_USER;
						var radioTierra=6371; //km

						var dLat = (lat2-lat1).toRad();
						var dLon = (lon2-lon1).toRad();
						
						var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
								Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) *
								Math.sin(dLon/2) * Math.sin(dLon/2);
						var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
						var di = radioTierra * c;
						
						if(di<=radio)
							near_points.push(d);
					
				}
			}
		}
		
		
	});
	
	resultados=near_points.length;
	
	if(!ES_MUNICIPIO)
		near_points.sort(SortByLangName);
	else
		near_points.sort(SortByName);
	
	$.each(near_points, function(i, near_d) {

			if(!ES_MUNICIPIO)
			{
				if(ES_SERVICIO)
				{
					cadena+='<div onclick="window.location.href=\'../'+getLocalStorage('current_language')+'/filter_by_municipio.html?id='+near_d.municipio+'&tab=services\'" >';
				}
				else
				{
					cadena+='<div onclick="window.location.href=\'../'+getLocalStorage('current_language')+'/points.html?id='+near_d.id+'\'" >';
				}
				switch(getLocalStorage("current_language"))
				{
					default:
					case "es":  var informacion=near_d.es.nombre;	
								break;
								
					case "en":  var informacion=near_d.en.nombre;	
								break;
				}
			}
			else
			{
				cadena+='<div onclick="window.location.href=\'../'+getLocalStorage('current_language')+'/filter_by_municipio.html?id='+near_d.id+'\'" >';
				var informacion=near_d.nombre;
			}

			cadena+='<div id="ov_box_13_1_f" class="ov_box_13" style="background-image:url(../..'+near_d.imagen+');" ><img src="../../styles/images/icons/right_arrow.png" alt="menu" class="ov_image_14"/></div>';
			
			cadena+='<div id="ov_box_14_1_f" class="ov_box_14"><div id="ov_text_24_1_f" class="ov_text_24">'+informacion+'</div></div>';
		
			cadena+='</div>';
	});
	
	if(resultados==0)
	{
		cadena+="<p>"+TEXTOS[5]+"</p>";
	}
	
	cadena+='<div class="ov_clear_floats_01">&nbsp;</div>';
	
	$("#"+CONTENEDOR).html(cadena);
			

}
function return_all_points()
{
	var q = FILTRO,
			regex = new RegExp(q, "i");

		var cadena="";
		cadena+="<div class='ov_zone_15'><p>"+TEXTOS[3]+"<br>"+TEXTOS[1]+"</p><h3>"+NOMBRE_FILTRO+"</h3></div>";
		
		var filter_points=new Array();
		var resultados=0;
	
		$.each(DATOS.result.items, function(index, d) {   
			
			var coord=d.geolocalizacion.split(",");
			var lat1=parseFloat(coord[0]);
			var lon1=parseFloat(coord[1]);
			
			if(q=="")
			{
				if($.inArray(d, filter_points)==-1)
						filter_points.push(d);			
			}
			else
			{
				$.each(d.categoria, function(i, cat) {
					if(cat.id.search(regex) != -1) 
					{							
						if($.inArray(d, filter_points)==-1)
							filter_points.push(d);			
					}
				});
			}
			
		});

		
		resultados=filter_points.length;
		
		$.each(filter_points, function(i, fd) {
						
			cadena+='<div onclick="window.location.href=\'../'+getLocalStorage('current_language')+'/points.html?id='+fd.id+'\'" >';

				cadena+='<div id="ov_box_13_1_f" class="ov_box_13" style="background-image:url(../..'+fd.imagen+');" ><img src="../../styles/images/icons/right_arrow.png" alt="menu" class="ov_image_14"/></div>';
				
				switch(getLocalStorage("current_language"))
				{
					default:
					case "es":  var informacion=fd.es;	
								break;
								
					case "en":  var informacion=fd.en;	
								break;
				}
		
				cadena+='<div id="ov_box_14_1_f" class="ov_box_14"><div id="ov_text_24_1_f" class="ov_text_24">'+informacion.nombre+'</div></div>';
			
			cadena+='</div>';
		});
		
		if(resultados==0)
		{
			cadena+="<p>"+TEXTOS[0]+"</p>";
		}
		
		cadena+='<div class="ov_clear_floats_01">&nbsp;</div>';
		
		$("#"+CONTENEDOR).html(cadena);
				
}

function go_to_page(name, id) {
	
	//Cargar una de cada X veces la página con un anuncio a pantalla completa, en esa página hay una X para cerrar el anuncio, si el usuario no lo cierra, este desaparece automáticamente a los 15 segundos  -> if(intersticial)
	
	if(id)
		window.location.href='./'+name+'.html?id='+id;
	else
		window.location.href='./'+name+'.html';
}

function get_var_url(variable){

	var tipo=typeof variable;
	var direccion=location.href;
	var posicion=direccion.indexOf("?");
	
	posicion=direccion.indexOf(variable,posicion) + variable.length; 
	
	if (direccion.charAt(posicion)== "=")
	{ 
        var fin=direccion.indexOf("&",posicion); 
        if(fin==-1)
        	fin=direccion.length;
        	
        return direccion.substring(posicion+1, fin); 
    } 
	else
		return false;
	
}

function setLocalStorage(keyinput,valinput) 
{
	if(typeof(window.localStorage) != 'undefined') { 
		window.localStorage.setItem(keyinput,valinput); 
	} 
	else { 
		alert("no localStorage"); 
	}
}
function getLocalStorage(keyoutput)
{
	if(typeof(window.localStorage) != 'undefined') { 
		return window.localStorage.getItem(keyoutput); 
	} 
	else { 
		alert("no localStorage"); 
	}
}
function setSessionStorage(keyinput,valinput)
{
	if(typeof(window.sessionStorage) != 'undefined') { 
		window.sessionStorage.setItem(keyinput,valinput); 
	} 
	else { 
		alert("no sessionStorage"); 
	}
}
function getSessionStorage(keyoutput)
{
	if(typeof(window.sessionStorage) != 'undefined') { 
		return window.sessionStorage.getItem(keyoutput); 
	} 
	else { 
		alert("no sessionStorage"); 
	}
}