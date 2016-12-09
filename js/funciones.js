//var api_url='http://www.avilaturismo.com/api.php';
//var api_url='./server/api.php';
var api_url='http://www.hoopale.com/AGENDACULTURAL/api.php';
//var kml_url='http://www.avilaturismo.com/app/resources/avila.kml';
//var extern_url='http://www.avilaturismo.com/app/';
//var extern_url='./server/resources/';
var local_url='./resources/json/';

//var DATOS, DIRECTION, GEOLOCATION;
var CONTENEDOR;

var intersticial=true;
var publi_banner_top=false;

var daysNamesMini=new Array('L','M','M','J','V','S','D');
var monthNames=new Array('Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre');
var diasMes=new Array('31','','31','30','31','30','31','31','30','31','30','31');

Date.prototype.getWeek = function() {
    var onejan = new Date(this.getFullYear(), 0, 1);
    return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
}

var current_date=new Date(); 
var current_week=current_date.getWeek();
var current_day_of_month=current_date.getDate();
var current_month=current_date.getMonth();
var current_year=current_date.getFullYear();

var viewport_width=$(window).outerWidth();
var viewport_height=$(window).outerHeight();
var screen_width=screen.width;
var screen_height=screen.height;

var imgsize="small";

if(viewport_width>=758)
	imgsize="big";

var publi_url='http://hoopale.com/publicidad/loader.php?day='+current_day_of_month+'&month='+current_month+'&imgsize='+imgsize;

$(window).load(function() {
	$('#cortina').hide('fade', function() {
	
		$('#contenedor').show();
		
	}, 380);
});
		
function onBodyLoad()
{		
	document.addEventListener("deviceready", onDeviceReady, false);
	
	var alto_minimo=$(window).outerHeight()-parseInt($(".contenedor").css("padding-bottom"))-parseInt($(".contenedor").css("padding-top"))-$(".contenedor_ads").outerHeight(true);
	
	$(".contenedor").css("min-height", alto_minimo+"px");
	
	if(typeof device!="undefined")
	{
		if(device.platform!='android' && device.platform!='Android') 
		{
			$(".contenedor_ads").css("padding-top","15px");
		}
	}
	
	/*
	if(publi_banner_top)
		$("#iframe_ads").attr('src', publi_url);
	else
		$(".contenedor_ads").html('<img src="./images/logos/AVturismo.png" alt="Ávila" />');
	*/
	
}

function onDeviceReady()
{					
	document.addEventListener("offline", onOffline, false);
	document.addEventListener("online", onOnline, false);	
	
	if(typeof device!="undefined")
	{
	
		console.log("WINDOW "+window);
		console.log("DEVICE "+device);
	
		if(device.platform!='android' && device.platform!='Android') 
		{
			window.plugin.statusbarOverlay.hide();
		}
	}

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

function get_total_days(mes, anio) {
	var total=28;
	//Empiezan los meses en 0
	if( mes == 1 )
    {    
        if( (anio % 4 == 0) && (anio % 100 != 0) || (anio % 400 == 0) )
            total=29;
        else
            total=28;    
    }    
	else
		total=diasMes[mes];	
	
	return total;
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

function show_image(imagen) {
	$("#cortina2").show('fade', function() {
		$(".cupon_02").html("<img src='"+imagen+"' alt='imagen' />");
		$(".cupon_02").show();
	});
}
function hide_image() {
	$(".cupon_02").hide();
	$("#cortina2").hide();
}

function format_date(fecha) {
	var fecha_split=fecha.split("-");
	var fecha_formateada=fecha_split[0]+" de "+monthNames[parseInt(fecha_split[1],10)-1]+" de "+fecha_split[2];
	
	return fecha_formateada;	
}
function format_date2(fecha) {
	var fecha_split=fecha.split("-");
	var fecha_formateada=fecha_split[0]+"/"+addZero(parseInt(fecha_split[1],10)+1)+"/"+fecha_split[2];
	
	return fecha_formateada;	
}

function addZero(number) {
		
	if(parseInt(number,10)<10) 
	{
		number="0"+number;
	}
	
	return number;
}

function get_date_to_api(fecha) {

	var fecha_split=fecha.split("-");
	var fecha_to_api=fecha_split[0]+"-"+addZero(parseInt(fecha_split[1],10)+1)+"-"+fecha_split[2];
	
	return fecha_to_api;
}

function get_program(container) {
		
	/*Navidad 2016*/
	var totalPaginas=23;
	var fiestas_title="NAVIDAD 2016";
	var carpetaPrograma="ProgramaNavidad2016";
	
	//Histórico
	var array_url=new Array();
	array_url.push({nombre:"Muestra Teatro 2016",url:"http://www.hoopale.com/AGENDACULTURAL/programaPDF/ProgramaTeatro2016.pdf"});
	array_url.push({nombre:"Fiestas Octubre 2016",url:"http://www.hoopale.com/AGENDACULTURAL/programaPDF/ProgramaOctubre2016.pdf"});
	array_url.push({nombre:"Verano 2016",url:"http://www.hoopale.com/AGENDACULTURAL/programaPDF/verano2016.pdf"});
	array_url.push({nombre:"San Segundo 2016",url:"http://www.hoopale.com/AGENDACULTURAL/programaPDF/programaSanSegundo2016.pdf"});
	array_url.push({nombre:"Carnavales 2015",url:"http://www.hoopale.com/AGENDACULTURAL/programaPDF/programaCarnaval2016.pdf"});
	array_url.push({nombre:"Navidad 2015",url:"http://www.hoopale.com/AGENDACULTURAL/programaPDF/programaNavidad2015.pdf"});
	array_url.push({nombre:"Muestra de Teatro 2015",url:"http://www.hoopale.com/AGENDACULTURAL/programaPDF/folleto-muestra-teatro-2015.pdf"});
	array_url.push({nombre:"Fiestas Octubre 2015",url:"http://www.hoopale.com/AGENDACULTURAL/programaPDF/FiestasOctubre2015.pdf"});	

	//Actual
	var url="http://www.hoopale.com/AGENDACULTURAL/programaPDF/ProgramaNavidad2016.pdf";
	
	var cadena="";
	
	cadena+="<p></p>";
				
	cadena+="<div class='swip_me'>Desliza el dedo sobre las páginas para ver el programa completo</div>";
			
	//cadena+="<div class='swiper-container contenedor_programa' style='height:"+(viewport_height-$("#menu").outerHeight())+"px'>";
	cadena+="<div class='swiper-container contenedor_programa' >";		
		cadena+="<div class='swiper-wrapper programa_imagenes' id='swiper_container'>";				
		//SLIDER
		for(pagina=1;pagina<=totalPaginas;pagina++)
		{
			cadena+='<div class="swiper-slide">'+
						'<img src="./resources/images/'+carpetaPrograma+"/"+pagina+'.jpg" />'+
					'</div>';
		}	
		cadena+="</div>";
	cadena+="</div>";
	
	cadena+='<br><div class="boton_02" onclick="window.open(\''+url+'\', \'_system\', \'location=yes\'); "><i class="fa fa-book fa-fw fa-lg"></i> DESCARGAR PROGRAMA ACTUAL</div><br>';
	
	/*cadena+="<div class='contenedor_program' style='height:"+(viewport_height-$("#menu").outerHeight())+"px'><iframe src='https://docs.google.com/viewer?url="+url+"&embedded=true' class='iframe_program' id='programa' ></iframe></div>";*/
	
	cadena+="<div class='titulo_historico'><p>- HISTÓRICO -</p></div>";
	cadena+="<p style='text-align:center'><br>Desde aquí puedes descargar los últimos programas.</p>";
	$.each(array_url, function(index, u) {
		cadena+='<br><div class="boton_02" onclick="window.open(\''+u.url+'\', \'_system\', \'location=yes\'); "><i class="fa fa-book fa-fw fa-lg"></i> '+u.nombre+'</div>';
	});
	
	$("#fiestas_title").html(fiestas_title);
	
	$("#"+container).html(cadena);
	
	var swiper = new Swiper('.swiper-container', {
					paginationClickable: false,
					slidesPerView: 1,
					spaceBetween: 5,
					loop:false,
					centeredSlides: true,
					speed: 500
				});
				
	$.ajax({
		url: api_url,
		data: { date: "", o: "get_active_program" },
		type: 'POST',
		dataType: 'json',
		crossDomain: true, 
		success: function(data) {
					cadena='<div class="boton_01" onclick="window.open('+data.url_program+', \'_system\', \'location=yes\'); ">Ver programa</div>';
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
	
}

function get_services(container) {
	
	$.getJSON(local_url+'services_list.json', function (data) 
		{  		
				cadena='<ul class="lista_servicios">'+
							'<li><div class="titulo_seccion">SERVICIOS</div>'+
								'<ul>';
				
					$.each(data.result.items, function(index, d) {   
						cadena+='<li>'+
									'<div class="e_titulo">'+d.nombre+'</div>';
						if(d.tlf!="")
						{
							cadena+='<div class="e_tlf">'+
										'<i class="fa fa-phone fa-fw"> </i> '+d.tlf+
									'</div>';
						}	
						if(d.direccion!="")		
						{						
							cadena+='<div class="e_lugar">'+
										'<i class="fa fa-map-marker fa-fw"> </i> '+d.direccion+
									'</div>';
						}
						cadena+='</li>';
					});
					
				cadena+='</ul>'+
					'</li>'+
				'</ul>';

				$("#"+container).html(cadena);			
		});		
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
								cadena+='<li onclick="go_to_page(\'evento\',\''+d.id+'&date='+date+'\')">'+
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
							cadena+='<div class="e_imagen" style="background-image:url('+d.imagenDestacada+')" onclick="show_image(\''+d.imagenDestacada+'\')" > </div>';
						}
						
						cadena+= '<div class="e_titulo_02">'+d.titulo+'</div>'+
								'<div class="e_hora_02"><i class="fa fa-calendar fa-fw fa-lg"> </i> '+campo_fecha+'</div>';
								
						if(d.hora!="")
						{
							cadena+= '<div class="e_hora_02"><i class="fa fa-clock-o fa-fw fa-lg"> </i> '+d.hora+'</div>';
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
								
						var titulo_compartir=(d.titulo).replace(/["']/g, "");
						var lugar_compartir=(d.lugar).replace(/["']/g, "");
						var texto_compartir="Te interesa este evento de la Agenda Cultural de Ávila? "+titulo_compartir+" - FECHA: "+campo_fecha+" - LUGAR: "+lugar_compartir+" - (*) Descarga la aplicación ·Agenda Cultural Ayto. Ávila· desde Google Play para Android o desde App Store para Iphone e infórmate de todos los eventos culturales de la ciudad."
						//var descripcion_compartir=(d.descripcion).replace(/["']/g, "·");
						//texto_compartir=texto_compartir+"<br><br>"+descripcion_compartir;
								
						if(d.imagenDestacada!="")
						{
							cadena+='<div class="boton_01" id="compartir" onclick="window.plugins.socialsharing.share(\''+texto_compartir+'\', \''+titulo_compartir+'\', \''+d.imagenDestacada+'\', null)" ><i class="fa fa-share-alt fa-fw fa-lg"> </i> COMPARTIR ESTE EVENTO</div>';
							
							/*
							cadena+='<div class="boton_01" id="compartir en facebook" onclick="window.plugins.socialsharing.shareViaFacebook(\'Te interesa este evento de la Agenda Cultural de Ávila? '+texto_compartir+'\', \''+d.imagenDestacada+'\', null)" ><i class="fa fa-facebook fa-fw fa-lg"> </i> Facebook</div>';
							
							cadena+='<div class="boton_01" id="compartir en twitter" onclick="window.plugins.socialsharing.shareViaTwitter(\'Te interesa este evento de la Agenda Cultural de Ávila? '+texto_compartir+'\', \''+d.imagenDestacada+'\', null)" ><i class="fa fa-twitter fa-fw fa-lg"> </i> Twitter</div>';
							
							cadena+='<div class="boton_01" id="compartir en whatsapp" onclick="window.plugins.socialsharing.shareViaWhatsApp(\'Te interesa este evento de la Agenda Cultural de Ávila? '+texto_compartir+'\', \''+d.imagenDestacada+'\', null)" ><i class="fa fa-whatsapp fa-fw fa-lg"> </i> Whatsapp</div>';
							*/
						}
						else
						{
							cadena+='<div class="boton_01" id="compartir" onclick="window.plugins.socialsharing.share(\'Te interesa este evento de la Agenda Cultural de Ávila? '+texto_compartir+'\', \''+titulo_compartir+'\', null, null)" ><i class="fa fa-share-alt fa-fw fa-lg"> </i> COMPARTIR ESTE EVENTO</div>';
							
							/*
							cadena+='<div class="boton_01" id="compartir en facebook" onclick="window.plugins.socialsharing.shareViaFacebook(\'Te interesa este evento de la Agenda Cultural de Ávila? '+texto_compartir+'\', null, null)" ><i class="fa fa-facebook fa-fw fa-lg"> </i> Facebook</div>';
							
							cadena+='<div class="boton_01" id="compartir en twitter" onclick="window.plugins.socialsharing.shareViaTwitter(\'Te interesa este evento de la Agenda Cultural de Ávila? '+texto_compartir+'\', null, null)" ><i class="fa fa-twitter fa-fw fa-lg"> </i> Twitter</div>';
							
							cadena+='<div class="boton_01" id="compartir en whatsapp" onclick="window.plugins.socialsharing.shareViaWhatsApp(\'Te interesa este evento de la Agenda Cultural de Ávila? '+texto_compartir+'\', null, null)" ><i class="fa fa-whatsapp fa-fw fa-lg"> </i> Whatsapp</div>';
							*/
						}	

						cadena+='<br>';
											
						$("#"+container).html(cadena);
						
						break;		
						
				
			case "place":
				
						var cadena="";
						
						var d=data.result;
												
						if(d.imagenDestacada!="")
						{
							cadena+='<div class="e_imagen" style="background-image:url('+d.imagenDestacada+')" onclick="show_image(\''+d.imagenDestacada+'\')" > </div>';
						}
						
						cadena+='<div class="e_titulo_02">'+d.nombre+'</div>';
						
						if(d.tlf)
							cadena+='<div class="e_tlf_03"><span><i class="fa fa-phone fa-fw fa-lg"> </i> TELÉFONO</span><br>'+d.tlf+'</div>';
							
						if(d.web)
							cadena+='<div class="e_web_03"><span><i class="fa fa-globe fa-fw fa-lg"> </i> WEB</span><br>'+d.web+'</div>';
							
						if(d.horario)
							cadena+='<div class="e_horario_03"><span><i class="fa fa-clock-o fa-fw fa-lg"> </i> HORARIO</span><br>'+d.horario+'</div>';
													
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
									cadena+='<i class="fa fa-clock-o fa-fw"> </i> '+d.hora;
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
							
							enlace_punto="<p style='font-size:1.2em;padding:2px;'><a href='punto.html?id="+d.id+"' >"+d.nombre+"</a></p>";
									
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
						
						cadena='<div style="clear:both"> </div>';	
							
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

	$("#"+container).toggle("blind");
	$("body,html").animate({scrollTop:$(".boton_01").offset().top},500);
	
	if (navigator.geolocation)
	{
		options = {
		  enableHighAccuracy: true,
		  timeout: 10000,
		  maximumAge: 20000
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
									
			}
			else
			{
				$("#"+container).html("<p>Sin localización</p>");			
			}
			
		}, function() {
			
				draw_map_point(direccion, geolocalizacion, container);
							
		}, options);
		
	}
	else
	{	
		$("#"+container).html("<p>Sin localización</p>");			
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