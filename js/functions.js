/* --------------------------- Funciones de Inicio ---------------------------*/

$.ajax('https://search.reservamos.mx/api/v2/places?q=mon', 
{
    dataType: 'json', 
    timeout: 5000, 
    success: function (data,status,xhr) {   // success
        city = "";
        $.each(data, function(index, value){
            
            if(city !== data[index].city_name){
                $('#ajaxBtn').append("<option id='"+index+"' value ='"+data[index].lat+","+data[index].long+","+data[index].city_name+"'>"+data[index].city_name+" - "+data[index].state+"</option>");
                city = data[index].city_name;
            }
        });

    },
    error: function (jqXhr, textStatus, errorMessage) { // error callback 
        $('#data').append('Error: ' + errorMessage);
    }
});


/* --------------------------- Funciones de Proceso ---------------------------*/


  function monthText(month) {

    switch(month) {
          case '01':
            monthTextVal = 'January'
          break;
          case '02':
            monthTextVal = 'February'
          break;
          case '03':
            monthTextVal = 'March'
          break;
          case '04':
            monthTextVal = 'April'
          break;
          case '05':
            monthTextVal = 'May'
          break;
          case '06':
            monthTextVal = 'June'
          break;
          case '07':
            monthTextVal = 'July'
          break;
          case '08':
            monthTextVal = 'August'
          break;
          case '09':
            monthTextVal = 'September'
          break;
          case '10':
            monthTextVal = 'October'
          break;
          case '11':
            monthTextVal = 'November'
          break;
          case '12':
            monthTextVal = 'December'
          break;
        default:

      }

    return monthTextVal;
  }

  function timeDay(time) {

    switch(time) {
          case '00':
            timeDayVal = 'Night'
          break;
          case '03':
            timeDayVal = 'Night'
          break;
          case '06':
            timeDayVal = 'Day'
          break;
          case '09':
            timeDayVal = 'Day'
          break;
          case '12':
            timeDayVal = 'Day'
          break;
          case '15':
            timeDayVal = 'Day'
          break;
          case '18':
            timeDayVal = 'Night'
          break;
          case '21':
            timeDayVal = 'Night'
          break;
        default:

      }

    return timeDayVal;
  }


/* --------------------------- Funcion de Pronóstico ---------------------------*/

$(document).ready(function () {
			
    $('#ajaxBtn').on('change', function(){
        if(this.value !== "-") {
            $('.placeholder').css('display','none');
            $('.content-div').css('display','block');
        }
        else {
            $('.placeholder').css('display','block');
            $('.content-div').css('display','none');
        }
        
        $(".panel-day").html('');
        $(".date-picker").html('');

        cityVal = this.value.split(',');
        console.log(cityVal);
        $.ajax("https://api.openweathermap.org/data/2.5/weather?lat="+cityVal[0]+"&lon="+cityVal[1]+"&units=metric&appid=a5a47c18197737e8eeca634cd6acb581", 
   {
       dataType: 'json', 
       timeout: 5000,     
       success: function (data,status,xhr) {   // success
           $('.city-name').html(cityVal[2]);
           $('.city-temperature').html(String(data.main.temp).slice(0,2)+' °C');
           $('.city-conditions').html(data.weather[0].description);
       },
       error: function (jqXhr, textStatus, errorMessage) { // error callback 
           $('#data').append('Error: ' + errorMessage);
       }
   });

   $.ajax("https://api.openweathermap.org/data/2.5/forecast?lat="+cityVal[0]+"&lon="+cityVal[1]+"&units=metric&appid=a5a47c18197737e8eeca634cd6acb581", 
   {
       dataType: 'json', 
       timeout: 5000,   
       success: function (data,status,xhr) {   // success

            var dateObj = new Date();
            var month = dateObj.getUTCMonth() + 1;
            var day = dateObj.getUTCDate();
            var year = dateObj.getUTCFullYear();
            monthSt = String(month);
            daySt = String(day);
            if (monthSt.length < 2) { monthSt = "0"+ monthSt; } 
            if (daySt.length < 2) { daySt = "0"+ daySt; }            
            newdate = year + "-" + monthSt + "-" + daySt;
            dataLength = data.list.length;
            elseCount = 1; 

            $.each(data.list, function(index, value){
                DataDate = data.list[index].dt_txt;
                DataDate = DataDate.slice(0, 10);

                /*-- No Contar el primer dia -- Inicio --*/

                if(DataDate == newdate) { noCount = 1; } 
                else { 

                    if(elseCount == 1) {
                        noCount = 0; 
                        newdate1 = DataDate
                        numDay = 1;
                        day = String(DataDate).slice(8, 10);
                        month = String(DataDate).slice(5, 7);
                        year = String(DataDate).slice(0, 4);

                        fecha = day+' - '+monthText(month)+' - '+year;
                        fecha1 = day+' - '+monthText(month).slice(0,3);
                        $(".panel-day").append("<div class='day-div day-"+numDay+"'> <div class='header-fecha'><span>"+fecha+"</span></div><div class='date-content'></div></div>"); 
                        $(".date-picker").append("<div class='date-select' onclick='dateSelect("+numDay+")' day='day-"+numDay+"'>"+fecha1+"</div>");
                        elseCount = 0;
                    }
                    
                }

                /*-- No Contar el primer dia -- Fin --*/

                if (noCount == 0) {
                    if(DataDate == newdate1) {

                        conditions = data.list[index].weather[0].main;
                        dayDate = data.list[index].dt_txt;
                        dayDate = dayDate.slice(11, 16);
                        time = data.list[index].dt_txt.slice(11, 13);
                        Temp = String(data.list[index].main.temp).slice(0,2);
                        
                        $('.day-'+numDay+' .date-content').append("<div id='date-"+index+"' class='date-panel'> <div class='day-date'>"+dayDate+"</div><div class='day-conditions'><img src='img/animated/"+conditions+timeDay(time)+".svg'></div><div class='day-temperature'> <div class='label-max-temperature'>Temp</div><div class='data-max-temperature'><span>"+Temp+"</span>°C</div></div></div>");
                    } else {
                        newdate1 = DataDate
                        numDay = numDay + 1;
                        day = String(DataDate).slice(8, 10);
                        month = String(DataDate).slice(5, 7);
                        year = String(DataDate).slice(0, 4);

                        fecha = day+' - '+monthText(month)+' - '+year;
                        fecha1 = day+' - '+monthText(month).slice(0,3);
                        $(".panel-day").append("<div class='day-div day-"+numDay+"'> <div class='header-fecha'><span>"+fecha+"</span></div><div class='date-content'></div></div>");
                        $(".date-picker").append("<div class='date-select' onclick='dateSelect("+numDay+")' day='day-"+numDay+"'>"+fecha1+"</div>");
                    }
                }

        
                });

                $('.day-1').addClass('active');
                $('.date-select[day="day-1"]').addClass('active');

       },
       error: function (jqXhr, textStatus, errorMessage) { // error callback 
           $('#data').append('Error: ' + errorMessage);
       }
   });
});



});

  function dateSelect(a) {
    dayValue = $('.date-select.active').attr('day');
    $(".date-select").removeClass('active');
    $(".day-div").removeClass('active');
  
    $(".date-select[day=day-"+a+"]").addClass('active');
    $(".day-"+a).addClass('active');
  }

