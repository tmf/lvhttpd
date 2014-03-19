var bdpchart;
var timer;
var chart_param_measure = {
      chart: {
        renderTo: 'bdpchart',
        defaultSeriesType: 'line',
        
      },
      title: {
        text: 'Breakdown Probability Curve'
      },
      xAxis: {
          min: 0,
          max: 180,
		  
        title: {
          text: 'Energy (uJ)'
        }
      },
      yAxis: {
        title: {
          text: 'BDP (%)'
        },
        min: 0,
        max: 1,
        plotLines: [{
          value: 0,
          width: 1,
          color: '#808080'
        }]
      },
      tooltip: {
        crosshairs: true,
        shared: true
      },
      plotOptions: {
        line: {
          marker: {
            radius: 0,
            lineColor: '#666666',
            lineWidth: 1
          }
        }
      },
	  legend: {
	  	enabled: false
	  },
      series: []
    };
	var chart_param_analyze= {
      chart: {
        renderTo: 'bdpchart',
        defaultSeriesType: 'line',
        
      },
      title: {
        text: 'Breakdown Probability Curve'
      },
      xAxis: {
          min: 0,
          max: 180,
		  
        title: {
          text: 'Energy (uJ)'
        }
      },
      yAxis: {
        title: {
          text: 'BDP (%)'
        },
        min: 0,
        max: 1,
        plotLines: [{
          value: 0,
          width: 1,
          color: '#808080'
        }]
      },
      tooltip: {
        crosshairs: true,
        shared: true,
		valueDecimals: 2,
		
      },
      plotOptions: {
        line: {
          marker: {
            radius: 0,
            lineColor: '#666666',
            lineWidth: 1
          }
        }
      },
	  legend: {
	  	enabled: false
	  },
      series: []
    };
$(document).ready(function(){
	$(document).on("pagecreate", "#results" , function(){
		clearTimeout(timer);
		bdpchart = new Highcharts.Chart(chart_param_analyze);
		
			$.each(results, function(index, value){
				$('<input type="checkbox" name="checkbox-'+index+'" id="checkbox-'+index+'" class="custom" /><label for="checkbox-'+index+'">'+value+'</label>').appendTo('.content-secondary fieldset');
				
			});
			
			$('.content-secondary label[for]').bind('vclick', function(e){
				
				if($(this).siblings('input[type=checkbox]').is(':checked')){
					//console.log('unload: ' +$(this).find('label').text());
					var id = $(this).attr('for').split('-');
					id = parseInt(id[1]);
					bdpchart.series[id].remove(true);
				}else{
					
					//console.log('load: ' +$(this).find('label').text());
					load_bdp($(this).text());
				}
				e.stopPropagation();
			});
	
	});
  $(document).on("pagecreate", "#measurement" , function(){
    
    bdpchart = new Highcharts.Chart(chart_param_measure);
	
	load_bdp();
	
	$('#measure').click(function(){
		var that=this;
		if(!$(this).hasClass('measuring')){
										
			$.ajax({
			  url: "/measurement",
			  type: "POST",
			  contentType: "application/json",
			  
			   
			  data: { "json" : JSON.stringify({"measure": true} ) },
			  complete: function(){
			  	$(that).addClass('measuring');
				$(that).removeClass('idle');
				timer=setInterval('update_bdp()', 333);
			  }
		  }
		  );
										
		}else{
										
			$.ajax({
											
			  url: "/measurement",
			  type: "POST",
			   contentType: "application/json",
			  
			  data: { "json" : JSON.stringify({"measure": false} ) },
			  complete: function(){
			  	$(that).removeClass('measuring');
				$(that).addClass('idle');
				clearTimeout(timer);
			  }
		  }
		  );
										
		}
									
	});
	
	
	
	
  });

});

function update_bdp(){
	$.getJSON('/measurement/bdp', function(data){
									
			var newdata= [];
		var concentration = new Number(data.concentration);
		$.each(data.bdp, function(i, el) {
												           
			newdata.push([
			el.E,
			el.BDP
			]);
		});
		//var newname =  data.diameter + ' nm / ' + concentration.toExponential(1) + ' pbg';
		//$(chart.series[0].legendItem.element).children('tspan').text(newname);
		bdpchart.series[0].setData(newdata);
	});
}
							
function load_bdp(dl){
	var datalog = (typeof dl == 'undefined') ? '' : '/' + dl;
	var controlpoint =  (typeof dl == 'undefined') ? 'measurement' : 'results';
	$.getJSON('/'+controlpoint+'/bdp'+datalog, function(data){
		
		var concentration = new Number(data.concentration);
		var diameter = new Number(data.diameter);
		var series = {
			id: 'series',
			name: (datalog=='') ? 'BDP' : diameter.toFixed(0) + ' nm / ' + concentration.toExponential(1) + ' pbg',
			data: []
		}
		
		
									
		$.each(data.bdp, function(i, el) {
												           
			series.data.push([
			el.E,
			el.BDP
			]);
		});
		bdpchart.addSeries(series, true);
									
	});
								
}


