//quick & dirty theme switcher, written to potentially work as a bookmarklet
(function($){
	$.themeswitcher = function(){
		if( $('[data-'+ $.mobile.ns +'-url=themeswitcher]').length ){ return; }
		var 
			themes = ['light','dark', 'palim'],
			currentPage = $.mobile.activePage,
			menuPage = $( '<div data-'+ $.mobile.ns +'url="themeswitcher" data-'+ $.mobile.ns +'role=\'dialog\' data-'+ $.mobile.ns +'theme=\'a\'>' +
						'<div data-'+ $.mobile.ns +'role=\'header\' data-'+ $.mobile.ns +'theme=\'b\'>' +
							'<div class=\'ui-title\'>Switch Theme:</div>'+
						'</div>'+
						'<div data-'+ $.mobile.ns +'role=\'content\' data-'+ $.mobile.ns +'theme=\'c\'><ul data-'+ $.mobile.ns +'role=\'listview\' data-'+ $.mobile.ns +'inset=\'true\'></ul></div>'+
					'</div>' )
					.appendTo( $.mobile.pageContainer ),
			menu = menuPage.find('ul');	
		
		//menu items	
		$.each(themes, function( i ){
			$('<li><a href="#" data-'+ $.mobile.ns +'rel="back">' + themes[ i ].charAt(0).toUpperCase() + themes[ i ].substr(1) + '</a></li>')
				.bind("vclick", function(){
					$(currentPage).attr('data-theme', String.fromCharCode(i+97));
					$(currentPage).children('div').attr('data-theme', String.fromCharCode(i+97));
					
					
					$(currentPage).trigger("pageshow"); 
					menuPage.dialog( "close" );
					return false;
				})
				.appendTo(menu);
		});	
		
		

		//create page, listview
		menuPage.page();

	};	
})(jQuery);
