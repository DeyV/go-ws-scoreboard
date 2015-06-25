'use strict';



$( window ).load(function() { 

	$( "#trescSub" ).click(function() { 

	    $( ".result" ).load(  "http://" + location.host + "/set?v=" + $('#tresc').val() );
 
	});

	$( "#kolorSub" ).click(function() {
	    $( ".result" ).load(  "http://" + location.host + "/css?v=" + $('#kolor').val() );	 
	});



	$( "#urlSub" ).click(function() {
	    $( ".result" ).load(  "http://" + location.host + "/img?v=" + $('#url').val() ); 
	});


})