angular.module('app.controllers', [])
  
.controller('loginCtrl', function($scope, usuarioService, $state, $ionicPopup, sharedConn) {
  console.log("Bienvenido a la Plataforma");
  $scope.usuarioLogin={};


  var XMPP_DOMAIN  = 'ajustadoati.com/Mobil';     // Domain we are going to be connected to.
  var xmpp_user    = 'admin';     // xmpp user name
  var xmpp_pass    = 'admin';
  
 
//sharedConn.login(xmpp_user,XMPP_DOMAIN,xmpp_pass);  //Debuggin purpose

  $scope.loginUsuario = function (newUsuarioForm) {
     console.debug("login user");
     var user = $scope.usuarioLogin.user.toLowerCase();
     var password = $scope.usuarioLogin.password.toLowerCase();

         //uuu
          sharedConn.login(user,XMPP_DOMAIN,password);
           
      /*usuarioService.getUserByUserAndLogin($scope.usuarioLogin)
        .success(function (data) {

            console.log('Saved User '+data.status);
            $scope.usuarioLogin={};
            if(!(data.status != null && data.status != undefined)){
             console.log('User exist '+data.user);
               //Calling the login function in sharedConn  
            
              //$state.go("tabsController.solicitudes");
              
            }else{
              var alertPopup = $ionicPopup.alert({
                title: 'Usuario o password incorrectos',
                template: 'Por favor intenta de nuevo!'
              });
            }
            
            

        }).
        error(function(error) {
            $scope.status = 'Unable to get user: ' + error.message;
        });*/
  }
 


})

.controller('usuarioEmailCtrl', function($scope, usuarioService, $state, $ionicPopup) {
  console.log("UsuarioEmail Ctrl");
  $scope.usuarioEmail={};
 

  $scope.findUserEmail = function () {
   
   var user = $scope.usuarioEmail.user.toLowerCase();
   var mail = $scope.usuarioEmail.mail.toLowerCase();   
   console.info("search user"+user);
   console.info("search email"+mail);  
    console.debug("search user");    
    usuarioService.getUserByUserAndEmail(user,mail)
      .success(function (data) {

          console.log('Saved User !');
          
          
          if(!(data.status != null && data.status != undefined)){
           console.log('User exist '+data.user);
             //Calling the login function in sharedConn  
          
            console.log("user:"+user);
            $state.go('recuperar', {user});
            
          }else{
            var alertPopup = $ionicPopup.alert({
              title: 'Usuario o correo incorrecto',
              template: 'Por favor intenta de nuevo!'
            });
          }
      }).
      error(function(error) {
          $scope.status = 'Unable to get user: ' + error.message;
      });
  }
 


})

.controller('recuperarCtrl', function($scope, usuarioService, $state, $ionicPopup, $stateParams) {
  console.log("recuperarCtrl");
  $scope.usuario={};
  //$scope.usuario = ;
  console.log("usuario: "+$stateParams.user);

  $scope.recuperarUsuario = function () {
     
     var password = $scope.usuario.password.toLowerCase();
     var password2 = $scope.usuario.password2.toLowerCase();

         //uuu
      
      if (password == password2){
        $scope.usuario.user = $stateParams.user;
        $scope.usuario.password = password;
        usuarioService.setPasswordForUser($scope.usuario)
              .success(function () {
                  console.log('Saved User.');
                  var alertPopup = $ionicPopup.alert({
                    title: 'Password creado satisfactoriamente !',
                    template: 'Gracias.'
                  });
                  $state.go("login");
              }).
              error(function(error) {
                  $scope.status = 'Unable to change password: ' + error.message;
              });
      
      }else {
        var alertPopup = $ionicPopup.alert({
          title: 'Password no coincide !',
          template: 'Por favor intenta de nuevo!'
        });
      }
  }
 


})
   
.controller('registroCtrl', function($scope) {

})
   
.controller('registroVendedorCtrl', function($scope, $state, categoriaService, proveedorService, $cordovaGeolocation, MapService) {
	console.log("registroVendedorCtrl");
	$scope.proveedor={};
  $scope.categorias=[];
  $scope.categoriasSelected=[];
  $scope.proveedor.usuario={};
  $scope.proveedor.categorias=[];

 
      //cargando mapa desde el service
      MapService.createByCurrentLocation(function (marker) {
                console.log("Llamando al service");
                marker.options.labelContent = 'Usted esta aqu&iacute;';
                $scope.proveedor.usuario.latitud=marker.latitude;
                $scope.proveedor.usuario.longitud=marker.longitude;
                //$scope.map.markers.push(marker);
                //refresh(marker
                var latLng = new google.maps.LatLng($scope.proveedor.usuario.latitud, $scope.proveedor.usuario.longitud);
 
          var mapOptions = {
            center: latLng,
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            disableDefaultUI: true
          };
       
          $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
          google.maps.event.addListenerOnce($scope.map, 'idle', function(){
       
                var marker = new google.maps.Marker({
                  map: $scope.map,
                  animation: google.maps.Animation.DROP,
                  position: latLng
              });      
             
              var infoWindow = new google.maps.InfoWindow({
                  content: "Here I am!"
              });
             
            google.maps.event.addListener(marker, 'click', function () {
                infoWindow.open($scope.map, marker);
            });
          });
     });
  //$scope.data = [{id: 1, value: "Item 1"}, {id: 2, value: "Item 2"}, {id: 3, value: "Item 3"}];

  $scope.onValueChanged = function(value){
    console.log(value);
    var cats=value.split("-");  
    if(cats.length>0){
      
      for(var i=0;i<cats.length;i++){
        console.log("categoria:"+cats[i]);
        for(var j=0; j<$scope.categorias.length;j++){
                    var categoria=[];
                    
                    //categoria.selected=false;
                    categoria.id=j;
                    categoria.nombre=$scope.categorias[j].nombre;
                    categoria.descripcion=$scope.categorias[j].descripcion;
                    
                    if(categoria.nombre===cats[i]){
                      console.log("Se agrega la categoria:"+categoria.nombre);
                      $scope.categoriasSelected.push(categoria);
                    }
               }
      }
    }

  }

  getCategorias();

   function getCategorias() {
    console.log("Ctrl. getting categorias")
        categoriaService.getCategorias()
            .success(function (categorias) {
                for(var i=0; i<categorias.length;i++){
                    var categoria=[];
                    
                    categoria.selected=false;
                    categoria.id=i;
                    categoria.nombre=categorias[i].nombre;
                    categoria.descripcion=categorias[i].descripcion;
                    $scope.categorias.push(categoria);
                
               }
                $scope.data = categorias;
            })
            .error(function (error) {
                $scope.status = 'Unable to load customer data: ' + error.message;
            });
    }


	$scope.crearVendedor = function (newVendedorForm) {
                console.log("guardando proveedor !!"+ $scope.proveedor);
                console.log("nombre: "+$scope.proveedor.usuario.nombre);
                console.log("email: "+$scope.proveedor.usuario.email);
               // console.log("lat: "+$scope.usuario.latitud);
                //console.log("long: "+$scope.usuario.longitud);
                console.log("user: "+$scope.proveedor.usuario.user);
                console.log("pass: "+$scope.proveedor.usuario.password);
                console.log("twitter:"+$scope.proveedor.usuario.twitter);
                console.log("twitter:"+$scope.proveedor.usuario.telefono);


               //$scope.proveedor.usuario.latitud=2.992929;
               //$scope.proveedor.usuario.longitud=55.992929;

               for(var i=0; i<$scope.categoriasSelected.length;i++){
                console.log("categorias:"+$scope.categoriasSelected[i].nombre);
                var categoria={};
                //categoria.id=$scope.selection[i];
                categoria.nombre=$scope.categoriasSelected[i].nombre;
                categoria.descripcion=$scope.categoriasSelected[i].descripcion;
                $scope.proveedor.categorias.push(categoria);
              }
              for(var i=0; i<$scope.proveedor.categorias.length;i++){
                console.log("categoriasrazon:"+$scope.proveedor.categorias[i].nombre);
                
              }
               
        		proveedorService.saveProveedor($scope.proveedor)
	            .success(function () {
	                console.log('Saved Proveedor.');
	                $scope.proveedor={};
                  $scope.categoriasSelected=[];
	                $state.go("login");
	                //$scope.customers.push(cust);

	            }).
	            error(function(error) {
	                $scope.status = 'Unable to insert proveedor: ' + error.message;
	            });
      }
})

   
.controller('registroUsuarioCtrl', function($scope, usuarioService, $state, MapService, categoriaService, proveedorService, $ionicPlatform, $ionicPopup, criptomonedaService) {
	console.log("registroUsuarioCtrl");
	$scope.usuario={};
  $scope.proveedor={};
  $scope.categorias=[];
  $scope.categoriasSelected=[];
  $scope.proveedor.usuario={};
  $scope.proveedor.categorias=[];
  $scope.categoriaSelected={};


  $scope.onValueChanged = function(value){
    console.log(value);
    var cats=value.split("-");  
    if(cats.length>0){
      
      for(var i=0;i<cats.length;i++){
        console.log("categoria:"+cats[i]);
        for(var j=0; j<$scope.categorias.length;j++){
            var categoria=[];
            
            //categoria.selected=false;
            categoria.id=j;
            categoria.nombre=$scope.categorias[j].nombre;
            categoria.descripcion=$scope.categorias[j].descripcion;
            
            if(categoria.nombre===cats[i]){
              console.log("Se agrega la categoria:"+categoria.nombre);
              $scope.categoriasSelected.push(categoria);
            }
        }
      }
    }

  }

 

  getCategorias();

   function getCategorias() {
    console.log("Ctrl. getting categorias nuevas")
        categoriaService.getCategorias()
            .success(function (categorias) {
                for(var i=0; i<categorias.length;i++){
                    var categoria=[];                    
                    categoria.selected=false;
                    categoria.id=i;
                    categoria.nombre=categorias[i].nombre;
                    categoria.descripcion=categorias[i].descripcion;
                    $scope.categorias.push(categoria);                
               }
                $scope.data = categorias;
            })
            .error(function (error) {
                $scope.status = 'Unable to load customer data: ' + error.message;
            });
    }
 
    //cargando mapa desde el service
  
    MapService.createByCurrentLocation(function (marker) {
      console.log("Llamando al service");
      marker.options.labelContent = 'Usted esta aqu&iacute;';
      $scope.usuario.latitud=marker.latitude;
      $scope.usuario.longitud=marker.longitude;
      //$scope.map.markers.push(marker);
      //refresh(marker
      var latLng = new google.maps.LatLng($scope.usuario.latitud, $scope.usuario.longitud);

      var mapOptions = {
        center: latLng,
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true
      };
   
      $scope.map = new google.maps.Map(document.getElementById("maper"), mapOptions);
      google.maps.event.addListenerOnce($scope.map, 'idle', function(){
          var icon = {
              url: "img/icon_green.png", // url
              scaledSize: new google.maps.Size(30, 30), // scaled size
              origin: new google.maps.Point(0,0), // origin
              anchor: new google.maps.Point(0, 0) // anchor
          };
          var marker = new google.maps.Marker({
              map: $scope.map,
              animation: google.maps.Animation.DROP,
              position: latLng,
              icon:icon
          });      
         
          var infoWindow = new google.maps.InfoWindow({
              content: "Usted esta aqu&iacute;"
          });
         
        google.maps.event.addListener(marker, 'click', function () {
            infoWindow.open($scope.map, marker);
        });
      });
   });
              
    $scope.validarPassword = function(){
      console.info("validando password");
       if($scope.usuario.password != $scope.usuario.password2){
        var alertPopup = $ionicPopup.alert({
                  title: 'El password no es igual !',
                  template: 'Password incorrecto '
                });
      }
    }

        //si es un usuario vendedor o usuario normal
    $scope.crearUsuario = function (newUsuarioForm) {
    
      //valores por defecto para los demas campos
      $scope.usuario.nombre=$scope.usuario.user;
      //$scope.usuario.telefono=$scope.usuario.telefono;
      $scope.usuario.twitter=$scope.usuario.user;
      
      if($scope.categoriasSelected.length > 0){
       for(var i=0; i<$scope.categoriasSelected.length;i++){
  
          var categoria={};
          //categoria.id=$scope.selection[i];
          categoria.nombre=$scope.categoriasSelected[i].nombre;
          categoria.descripcion=$scope.categoriasSelected[i].descripcion;
          $scope.proveedor.categorias.push(categoria);
        }
        $scope.proveedor.usuario=$scope.usuario;
        proveedorService.saveProveedor($scope.proveedor)
          .success(function () {
              console.log('Saved Proveedor.');
              $scope.proveedor={};
              $scope.categoriasSelected=[];
               if($scope.usuario.criptomoneda){
                 console.info("creando criptomoneda");
                
                var x = new Date();
                //se agrega el tiempo para que sea una cuenta unica para futuro
                var address = "HAXASIMSUSNIAU76878bsdjsjd"+x.getTime();

                var criptomoneda = {
                    "criptomoneda": {
                    "tipo": "Ethereum",
                    "nombre": "Ether",
                    "descripcion": "criptomoneda",
                    "address": address
                  },
                  "usuario": $scope.usuario.user
                }
                
                criptomonedaService.saveCriptomoneda(criptomoneda).success(function () {
                  console.info("se ha agregado criptomoneda al usuario");
                });
              }
              var alertPopup = $ionicPopup.alert({
                  title: 'Usuario creado !',
                  template: 'Gracias por darte de alta.'
                });

              $state.go("login");
          }).
          error(function(error) {
               var alertPopup = $ionicPopup.alert({
                  title: 'El usuario no se ha creado !',
                  template: 'Completa los campos y espera que se cargue la ubicaci&oacute;n'
                });
              $scope.status = 'Unable to insert proveedor: ' + error.message;
          });
        }else{
     
      		usuarioService.saveUsuario($scope.usuario)
            .success(function () {
              console.log('Saved Usuario.');
              if($scope.usuario.criptomoneda){
                 console.info("creando criptomoneda");
                var x = new Date();
                //se agrega el tiempo para que sea una cuenta unica para futuro
                var address = "HAXASIMSUSNIAU76878bsdjsjd"+x.getTime();

                var criptomoneda = {
                    "criptomoneda": {
                    "tipo": "Ethereum",
                    "nombre": "Ether",
                    "descripcion": "criptomoneda",
                    "address": address
                  },
                  "usuario": $scope.usuario
                }
                
                criptomonedaService.saveCriptomoneda(criptomoneda).success(function () {
                  console.info("se ha agregado criptomoneda al usuario");
                })
              }
              $scope.usuario={};

              var alertPopup = $ionicPopup.alert({
                title: 'Usuario creado !',
                template: 'Gracias por darte de alta.'
              });
              
              $state.go("login");

            }).
            error(function(error) {
              var alertPopup = $ionicPopup.alert({
                  title: 'El usuario no se ha creado !',
                  template: 'Completa los campos y espera que se cargue la ubicaci&oacute;n'
                });
                $scope.status = 'Unable to insert usuario: ' + error.message;
            });
        }
    }

})
   
.controller('buscarCtrl', function($scope, $state, usuarioService, $ionicPopup, $rootScope, Peticiones, categoriaService  ) {
  console.log("BuscarCtrl");
  $scope.categorias=[];
  $scope.categoriaSelected={};
  $scope.stations=[{"station_num":1, "station_name":"test1"},{"station_num":2, "station_name":"test2"}];
  $scope.consulta={};
  $scope.consulta.producto={};
  $scope.consulta.usuario={};
  $scope.consulta.categoria={nombre:"KO", descripcion:"KO"};
  $scope.categoriasSelected=[];
 
  $scope.selectUpdated = function(selected) {
      console.log('Updated'+selected);
      $scope.categoriaSelected=$scope.categorias[selected];
      console.log($scope.categoriaSelected.nombre);
      $scope.consulta.categoria=$scope.categoriaSelected;
  };

   $scope.onValueChanged = function(value){
    console.log(value); 
    var cats=value.split("-");  
    if(cats.length>0){
      if(cats.length>1){
          var alertPopup = $ionicPopup.alert({
                title: 'Excede la cantidad de categor&iacute;as',
                template: 'Por favor seleccione solo 1 categor&iacute;a!'
              });
      }else{
        for(var i=0;i<cats.length;i++){
          console.log("categoria:"+cats[i]);
          for(var j=0; j<$scope.categorias.length;j++){
                      var categoria=[];
                      
                      //categoria.selected=false;
                      categoria.id=j;
                      categoria.nombre=$scope.categorias[j].nombre;
                      categoria.descripcion=$scope.categorias[j].descripcion;
                      
                      if(categoria.nombre===cats[i]){
                        console.log("Se agrega la categoria:"+categoria.nombre);
                        $scope.categoriasSelected.push(categoria);
                      }
                 }
        }
      }
    }

  }
  //se cargan las categorias
  getCategorias();

 

   function getCategorias() {
    console.log("Ctrl. getting categorias")
      categoriaService.getCategorias()
          .success(function (categorias) {
        for(var i=0; i<categorias.length;i++){
            var categoria=[];
            
            categoria.selected=false;
            categoria.id=i;
            categoria.nombre=categorias[i].nombre;
            categoria.descripcion=categorias[i].descripcion;
            $scope.categorias.push(categoria);
        
        }
        $scope.data = categorias;
      })
      .error(function (error) {
          $scope.status = 'Unable to load customer data: ' + error.message;
      });
    }


    $scope.buscar = function (newSearchForm) {
      console.log("realizando busqueda"+$scope.consulta.categoria.nombre); 
      if($scope.consulta.categoria.nombre == "KO"){
        var alertPopup = $ionicPopup.alert({
          title: 'Categor&iacute;a vacia',
          template: 'Por favor seleccione categor&iacute;a!'
        });
        
      }else{
        var consulta=$scope.consulta;
        console.log("rprod"+consulta); 
        console.log("cat"+consulta.categoria.nombre);
        $state.go('resultado', {consulta});
      }
    }


  
})
.controller('resultadoCtrl', function($scope, $state, $stateParams, sharedConn, usuarioService, consultaService, proveedorService, MapService, ChatDetails){
    console.log('resultadoCtrl');
    $scope.consulta={};
    
    $scope.consulta.producto=$stateParams.consulta.producto;
    $scope.consulta.usuario={};
    $scope.consulta.categoria=$stateParams.consulta.categoria;
    $scope.map={};
    $scope.markers=[];
    $scope.proveedores=[];

    var ws = new WebSocket('wss://ajustadoati.com:8443/ajustadoatiWS/openfire');
    
    ws.onopen = function () {
        console.log('open');
        
        //this.send('hello');         // transmit "hello" after connecting
    };
    ws.onmessage = function (event) {
        console.log("receiving"+event.data);
        var obj = JSON.parse(event.data);
        console.log("receiving from: "+obj.user);
        console.log("message: "+obj.message);
        //var user=$scope.getUser(obj.user);        
        //console.log("obteniendo usuario: "+user.nombre);
        //$scope.addLocation(obj.latitud, obj.longitud); // will be "hello"
        $scope.setMensajeProveedor(obj, obj.message);
        //this.close();
    };
    ws.onerror = function () {
        console.log('error occurred!');
    };
    ws.onclose = function (event) {
        console.log('close code=' + event.code);
    };
    //se debe borrar el elemento cuando lo consigue
     //metodo que agrega el mensaje en el objeto proveedor cuando responde
    $scope.setMensajeProveedor=function(usuario, mensaje){
        var resultado = [];
        console.log("size markers: "+$scope.markers.length);
        for (var i=0;i<$scope.markers.length;i++) {
          console.debug("agregando mensaje a proveedor: "+usuario.user);
          console.log("proveedor: "+$scope.markers[i].usuario);
          if (usuario.user == $scope.markers[i].usuario) {
              console.log("proveedor encontrado: "+$scope.markers[i].usuario);
              resultado = $scope.markers[i];
              resultado.mensaje=mensaje;
              //almacena su id para borrar;
              console.log("proveedor con mensaje nuevo: "+resultado.mensaje);
              $scope.markers[i].mensaje=mensaje;
              $scope.markers[i].setMap(null);
              $scope.addLocationResponder(usuario.latitud, usuario.longitud, resultado);
              return;

          }
        }        
        return resultado;
    }

    //pasar datos del usuario que busca, si es anonimo o usuario registrado
    if(sharedConn.getConnectObj()!=null){
      $scope.userActual=sharedConn.getConnectObj().jid.split("@")[0];
      console.log("consultando usuario: "+$scope.userActual);
      usuarioService.getUserByUser($scope.userActual)
                        .success(function (data) {
          console.log("nombre:"+data.nombre);
          $scope.consulta.usuario = data;
      }).error(function(error) {
          $scope.status = 'Unable to get user: ' + error.message;
      }); 
    }else{
      var x = new Date();
      $scope.consulta.usuario.nombre="anonimo"+x.getTime();
      $scope.consulta.usuario.email="anonimo@anonimo";
      $scope.consulta.usuario.user="anonimo";
      $scope.consulta.usuario.password="anonimo";
      $scope.consulta.usuario.telefono="04838383";
    }

    $scope.addLocationResponder= function(latitud, longitud, data){
      var resultado;
      var icon = {
          url: "img/icon_response.png", // url
          scaledSize: new google.maps.Size(30, 30), // scaled size
          origin: new google.maps.Point(0,0), // origin
          anchor: new google.maps.Point(0, 0) // anchor
      };
     
      console.log("****************** agregando egistro:*************"+data.usuario);
      MapService.createByCoords(latitud, longitud, data, function (marker) {
           
          var contentString = '<div>'+
            '<label style="color: white;"><b>'+marker.nombre+'</b></label>'+
            '<div class="spacer" style="height: 5px;"></div>'+
              '<div><p style="color: white;font-size: x-small;">'+marker.mensaje+'</p></div>'+
              '<div class="row">'+
                '<a href="https://api.whatsapp.com/send?phone='+marker.telefono+'&text=Hola%20desde%20ajustadoati"><img src="img/icon_message.png" width="25" height="25"/></a>'+
              '</div></div></div>';
        if($scope.userActual==""){
          var contentString = '<div>'+
            '<label style="color: white;font-size: x-small;"><b>'+marker.nombre+'</b></label>'+
            '<div class="spacer" style="height: 5px;"></div>'+
              '<div><p style="color: white;">'+marker.mensaje+'</p></div>'+
              '<div class="row">'+
                '<a href="https://api.whatsapp.com/send?phone='+marker.telefono+'&text=Hola%20desde%20ajustadoati"><img src="img/icon_message.png" width="25" height="25"/></a>'+
              '</div></div></div>';

        }
        var latLng = new google.maps.LatLng(marker.latitude, marker.longitude);
        console.log("listeners");
        var mark = new google.maps.Marker({
            map: $scope.map,
            icon: icon,
            animation: google.maps.Animation.DROP,
            position: latLng,
             mensaje:marker.mensaje,
            nombre:marker.nombre,
            telefono:marker.telefono,
            usuario:marker.usuario,
        });     
               
        $scope.markers.push(mark);
        console.log("size: "+$scope.markers.length);
        var infoWindow = new google.maps.InfoWindow({
            content: contentString
        });
       
        google.maps.event.addListener(mark, 'click', function () {

            infoWindow.open($scope.map, mark);
        });
        resultado = mark;
            
      });
          
           // $scope.map.markers.push(marker);
            //refresh(marker);
          return resultado;
        }

    //metodo para agregar ubicacion de proveedores
    $scope.addLocation= function(latitud, longitud, data){
      var resultado;
      console.debug("****************** agregando registro:*************"+data.usuario);
      MapService.createByCoords(latitud, longitud, data, function (marker) {           
        var contentString = '<div>'+
                '<label style="color: white;"><b>'+marker.nombre+'</b></label>'+
                '<div class="spacer" style="height: 10px;"></div>'+
                  '<div><label style="color: white;">M&oacute;vil</label></div>'+
                  '<div class="row">'+
                    '<div class = "col-30" ><label style="color: white;"><b>'+marker.telefono+'</b></label></div>'+
                    '<div class = "col-20" ></div>'+
                    '<div class = "col-50"><a href="https://api.whatsapp.com/send?phone='+marker.telefono+'&text=Hola%20desde%20ajustadoati"><img src="img/icon_message.png" width="25" height="25"/></a><img src="img/icon_phone.png" width="25" height="25"></div>'+
                  '</div></div></div>';
        var latLng = new google.maps.LatLng(marker.latitude, marker.longitude);               
        
        var icon = {
            url: "img/icon_orange.png", // url
            scaledSize: new google.maps.Size(30, 30), // scaled size
            origin: new google.maps.Point(0,0), // origin
            anchor: new google.maps.Point(0, 0) // anchor
        };
        var mark = new google.maps.Marker({
          map: $scope.map,
          icon: icon,
          animation: google.maps.Animation.DROP,
          position: latLng,
           mensaje:marker.mensaje,
          nombre:marker.nombre,
          telefono:marker.telefono,
          usuario:marker.usuario,
        });                 
        $scope.markers.push(mark);
        
        
        var infoWindow = new google.maps.InfoWindow({
          content: contentString
        });           
        google.maps.event.addListenerOnce($scope.map, 'idle', function(){
            jQuery('.gm-style-iw').prev('div').remove();
        }); 
        google.maps.event.addListener(mark, 'click', function () {
          infoWindow.open($scope.map, mark);
        });
        resultado = mark;        
      });      
       // $scope.map.markers.push(marker);
        //refresh(marker);
      return resultado;
    }

    //realizar busqueda
    $scope.buscar = function () {
      
     
      var categoria={};
      categoria.id=$scope.consulta.categoria.id;
      categoria.nombre=$scope.consulta.categoria.nombre;
      categoria.descripcion=$scope.consulta.categoria.descripcion;
      $scope.consulta.categoria=categoria;
      
      $scope.consulta.producto.descripcion=$scope.consulta.producto.nombre;
      $scope.consulta.producto.id=0;
      var resp="";
      var men="";
      men=$scope.consulta.producto.nombre;
      //se obtienen los proveedores de la categoria
      proveedorService.getProveedoresByCategoria($scope.consulta.categoria.nombre)
        .success(function (data) {
        console.log('Consultando proveedores.'+$scope.consulta.categoria.nombre);
        $scope.proveedores=data;

      }).error(function(error) {
        $scope.status = 'Unable to get proveedores: ' + error.message;
      }); 
      consultaService.saveConsulta($scope.consulta)
        .success(function (data) {
            console.log('Saved Consulta.'+data);
            console.log('response:'+data.id);
            $scope.consultaId=data.id;
            $scope.latitud = $scope.consulta.usuario.latitud;
            $scope.longitud = $scope.consulta.usuario.longitud;            
            $scope.categoriasSelected=[];
      }).
        error(function(error) {
            $scope.status = 'Unable to insert consulta: ' + error.message;
      }).finally(function(data){          
          console.log("size"+$scope.proveedores.length);
          for(var i=0; i<$scope.proveedores.length; i++){
            console.log("proveedor: "+$scope.proveedores[i].usuario.user);              
            var usuario = {
                mensaje:"Sin mensaje",
                nombre:$scope.proveedores[i].usuario.nombre,
                telefono:$scope.proveedores[i].usuario.telefono,
                usuario:$scope.proveedores[i].usuario.user,
                id: 0         
            };
            $scope.addLocation($scope.proveedores[i].usuario.latitud, $scope.proveedores[i].usuario.longitud, usuario)
            if($scope.userActual != $scope.proveedores[i].usuario.user){
              if($scope.proveedores.length==(i+1)){
                console.log("fin de ciclo");
                  resp=resp+$scope.proveedores[i].usuario.user;
              }else{
                console.log("sigue el ciclo");
                  resp=resp+$scope.proveedores[i].usuario.user+"&&";
              }
            }else {
              console.log("usuario que envia la consulta");
            }                
          }
          console.log("resp"+resp);
          console.log("data a proveedores");
          //$scope.sendData();
          var msg = '{"id":'+$scope.consultaId+', "mensaje":"' + men + '", "users":"'+resp+'","latitud":"'+$scope.latitud+'","longitud":"'+$scope.longitud+'"}';
          console.log("msj:"+msg);
          ws.send(msg);                      
      });
    }

    //Se carga ubicacion
    MapService.createByCurrentLocation(function (marker) {
        marker.options.labelContent = 'Usted esta aqu&iacute;';
        $scope.consulta.usuario.latitud=marker.latitude;
        $scope.consulta.usuario.longitud=marker.longitude;                
        //refresh(marker
        var latLng = new google.maps.LatLng($scope.consulta.usuario.latitud, $scope.consulta.usuario.longitud);
        var mapOptions = {
          center: latLng,
          zoom: 10,
          noClear: true,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          disableDefaultUI: true
        };     
        $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
        var icon = {
            url: "img/icon_green.png", // url
            scaledSize: new google.maps.Size(30, 30), // scaled size
            origin: new google.maps.Point(0,0), // origin
            anchor: new google.maps.Point(0, 0) // anchor
        };
        google.maps.event.addListenerOnce($scope.map, 'idle', function(){
            jQuery('.gm-style-iw').prev('div').remove();
        }); 
        google.maps.event.addListenerOnce($scope.map, 'idle', function(){           
                var mark = new google.maps.Marker({
                  map: $scope.map,
                  icon: icon,
                  animation: google.maps.Animation.DROP,
                  position: latLng,
                  mensaje:"mensaje",
                  nombre:"usuario-ajustado",
                  telefono:"555-555",
                  usuario:"usuario-ajustado",
                });      
                $scope.markers.push(mark);
             console.log("size: "+$scope.markers.length);
             
             var contentString = '<div id="content">'+
                '<div id="siteNotice">'+
                '</div>'+
                '<h3 id="firstHeading">Proveedor</h3>'+
                '<div id="bodyContent">'+
                '<p><b>Nombre:</b> ' +mark.nombre+
                '<br><b>Tel&eacute;fono:</b> '+mark.telefono+
                '<br><b>Usuario:</b>  '+ mark.usuario+
                '<br><b>Mensaje:</b>  '+mark.mensaje+
                '</div>'+
                '</div>';
              var infoWindow = new google.maps.InfoWindow({
                  content:"Usted esta aqu&iacute; !"
              });
             
            google.maps.event.addListener(mark, 'click', function () {
                infoWindow.open($scope.map, mark);
            });
        });
        //hace la busqueda
        $scope.buscar();
          
     });
})

.controller('busquedaCtrl', function($scope, categoriaService, consultaService, $cordovaGeolocation, MapService, sharedConn, $stateParams, ChatDetails, $ionicPopup, proveedorService, usuarioService) {
  console.log("busquedaCtrl");
  $scope.categorias=[];
  $scope.categoriasSelected=[];
  $scope.latitud="";
  $scope.longitud="";
  $scope.consulta={};
  $scope.consulta.producto={};
  $scope.consulta.usuario={};
  $scope.proveedores=[];
  $scope.map={};
  $scope.markers=[];
  $scope.mensaje=$stateParams.mensaje;
  $scope.consultaId="";
  $scope.userActual="";
  $scope.consulta.categoria={nombre:"KO", descripcion:"KO"};
  $scope.categoriasSelected=[];
 
  $scope.selectUpdated = function(selected) {
    $scope.categoriaSelected=$scope.categorias[selected];
    $scope.consulta.categoria=$scope.categoriaSelected;
  };

  if(sharedConn.getConnectObj()!=null){
    $scope.userActual=sharedConn.getConnectObj().jid.split("@")[0];
    console.log("consultando usuario: "+$scope.userActual);
    usuarioService.getUserByUser($scope.userActual)
                      .success(function (data) {
        $scope.consulta.usuario = data;
    }).error(function(error) {
        $scope.status = 'Unable to get user: ' + error.message;
    }); 
  }else{
    var x = new Date();
    $scope.consulta.usuario.nombre="anonimo"+x.getTime();;
    $scope.consulta.usuario.email="anonimo@anonimo";
    $scope.consulta.usuario.user="anonimo";
    $scope.consulta.usuario.password="anonimo";
    $scope.consulta.usuario.telefono="04838383";
  }

  $scope.borrar = function(){
    $scope.consulta.producto.nombre="";
    $scope.consulta.producto.descripcion="";
    if($scope.markers.length > 0){
      for (var i=0;i<$scope.markers.length;i++) {
        
        if($scope.markers[i].nombre != 'local'){
          $scope.markers[i].setMap(null);
        }
      }
     $scope.markers=[];
    }
  };

  var ws = new WebSocket('wss://ajustadoati.com:8443/ajustadoatiWS/openfire');

  ws.onopen = function () {
    console.log('open');
  };

  ws.onmessage = function (event) {
    console.log(event.data);   
    console.log("receiving"+event.data);
    var obj = JSON.parse(event.data);

    console.log("receiving from: "+obj.user);
    console.log("message: "+obj.message);
    //var user=$scope.getUser(obj.user);
    
    //console.log("obteniendo usuario: "+user.nombre);
    //$scope.addLocation(obj.latitud, obj.longitud); // will be "hello"
    $scope.setMensajeProveedor(obj, obj.message);
    //this.close();
  };

  ws.onerror = function () {
    console.log('error occurred!');
  };

  ws.onclose = function (event) {
    console.log('close code=' + event.code);
  };
    //se debe borrar el elemento cuando lo consigue
     //metodo que agrega el mensaje en el objeto proveedor cuando responde
  $scope.setMensajeProveedor=function(usuario, mensaje){
    var resultado = [];
    console.log("size markers: "+$scope.markers.length);
    for (var i=0;i<$scope.markers.length;i++) {
      console.log("agregando mensaje a proveedor: "+usuario.user);
      console.log("proveedor: "+$scope.markers[i].usuario);
      if (usuario.user == $scope.markers[i].usuario) {
        console.log("proveedor encontrado: "+$scope.markers[i].usuario);
        resultado = $scope.markers[i];
        resultado.mensaje=mensaje;
        //almacena su id para borrar;
        console.log("proveedor con mensaje nuevo: "+resultado.mensaje);
        $scope.markers[i].mensaje=mensaje;
        $scope.markers[i].setMap(null);
        $scope.addLocationResponder(usuario.latitud, usuario.longitud, resultado);
        return;

      }
    }
    return resultado;
  }
  //add location for providers
  $scope.addLocation= function(latitud, longitud, data){
    var resultado;
    console.log("****************** agregando registro:*************"+data.usuario);
    MapService.createByCoords(latitud, longitud, data, function (marker) {
      var contentString = '<div>'+
            '<label style="color: white;"><b>'+marker.nombre+'</b></label>'+
            '<div class="spacer" style="height: 10px;"></div>'+
              '<div><label style="color: white;">M&oacute;vil</label></div>'+
              '<div class="row">'+
                '<div class = "col-30" ><label style="color: white;"><b>'+marker.telefono+'</b></label></div>'+
                '<div class = "col-20" ></div>'+
                '<div class = "col-50"><a href="https://api.whatsapp.com/send?phone='+marker.telefono+'&text=Hola%20desde%20ajustadoati"><img src="img/icon_message.png" width="25" height="25"/></a><img src="img/icon_phone.png" width="25" height="25"></div>'+
              '</div></div></div>';
      var icon = {
        url: "img/icon_orange.png", // url
        scaledSize: new google.maps.Size(30, 30), // scaled size
        origin: new google.maps.Point(0,0), // origin
        anchor: new google.maps.Point(0, 0) // anchor
      };
      var latLng = new google.maps.LatLng(marker.latitude, marker.longitude);
      console.log("listeners");
      var mark = new google.maps.Marker({
        map: $scope.map,
        icon:icon,
        animation: google.maps.Animation.DROP,
        position: latLng,
         mensaje:marker.mensaje,
        nombre:marker.nombre,
        telefono:marker.telefono,
        usuario:marker.usuario,
      });      
           
      $scope.markers.push(mark);
      console.log("size: "+$scope.markers.length);
      var infoWindow = new google.maps.InfoWindow({
          content: contentString
      });
     
      google.maps.event.addListener(mark, 'click', function () {
        infoWindow.open($scope.map, mark);
      });
      resultado = mark;
        
    });
     // $scope.map.markers.push(marker);
      //refresh(marker);
    return resultado;
  }
  //add location for provider that have answered 
  $scope.addLocationResponder= function(latitud, longitud, data){
    var resultado;
    var icon = {
      url: "img/icon_response.png", // url
      scaledSize: new google.maps.Size(30, 30), // scaled size
      origin: new google.maps.Point(0,0), // origin
      anchor: new google.maps.Point(0, 0) // anchor
    };
    var shape = {
      coords: [1, 1, 1, 20, 18, 20, 18, 1],
      type: 'poly'
    };
    console.log("****************** agregando egistro:*************"+data.usuario);
    MapService.createByCoords(latitud, longitud, data, function (marker) {
     
      var contentString = '<div>'+
            '<label style="color: white;"><b>'+marker.nombre+'</b></label>'+
            '<div class="spacer" style="height: 5px;"></div>'+
              '<div><p style="color: white;font-size: x-small;">'+marker.mensaje+'</p></div>'+
              '<div class="row">'+
                '<a href="https://api.whatsapp.com/send?phone='+marker.telefono+'&text=Hola%20desde%20ajustadoati"><img src="img/icon_message.png" width="25" height="25"/></a>'+
              '</div></div></div>';
      if($scope.userActual==""){
        var contentString = '<div>'+
            '<label style="color: white;"><b>'+marker.nombre+'</b></label>'+
            '<div class="spacer" style="height: 5px;"></div>'+
              '<div><p style="color: white;font-size: x-small;">'+marker.mensaje+'</p></div>'+
              '<div class="row">'+
                '<a href="https://api.whatsapp.com/send?phone='+marker.telefono+'&text=Hola%20desde%20ajustadoati"><img src="img/icon_message.png" width="25" height="25"/></a>'+
              '</div></div></div>';

      }
      var latLng = new google.maps.LatLng(marker.latitude, marker.longitude);
      console.log("listeners");
      var mark = new google.maps.Marker({
        map: $scope.map,
        icon: icon,
        shape: shape,
        animation: google.maps.Animation.DROP,
        position: latLng,
         mensaje:marker.mensaje,
        nombre:marker.nombre,
        telefono:marker.telefono,
        usuario:marker.usuario,
      });      
      $scope.markers.push(mark);
      console.log("size: "+$scope.markers.length);
      var infoWindow = new google.maps.InfoWindow({
          content: contentString
      });
      google.maps.event.addListener(mark, 'click', function () {
          infoWindow.open($scope.map, mark);
      });
      resultado = mark;
      
    });
    return resultado;
  }

  $scope.addLocationRequest= function(latitud, longitud, data){
    var resultado;
    var image = {
      url: 'img/location_resp.png',
      size: new google.maps.Size(20, 32),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(0, 32)
    };
  
    var shape = {
      coords: [1, 1, 1, 20, 18, 20, 18, 1],
      type: 'poly'
    };
    console.log("****************** agregando registro:*************"+data.usuario);
    MapService.createByCoords(latitud, longitud, data, function (marker) {
     
      var contentString = '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<h3 id="firstHeading">' +data.nombre+'</h3>'+
      '<div id="bodyContent">'+
      '<br><b>Tel&eacute;fono:</b> '+marker.telefono+
      '<br><b>Usuario:</b>  '+ marker.usuario+
      '<br><b>Mensaje:</b> <a href="#/homeVendedor/detalleChat">  '+marker.mensaje+
      '</a></div>'+
      '</div>';
      var latLng = new google.maps.LatLng(marker.latitude, marker.longitude);
      console.log("listeners");
        var mark = new google.maps.Marker({
        map: $scope.map,
        icon: image,
        shape: shape,
        animation: google.maps.Animation.DROP,
        position: latLng,
         mensaje:marker.mensaje,
        nombre:marker.nombre,
        telefono:marker.telefono,
        usuario:marker.usuario,
      });      
       
      $scope.markers.push(mark);
      console.log("size: "+$scope.markers.length);
      var infoWindow = new google.maps.InfoWindow({
        content: contentString
      });
     
      google.maps.event.addListener(mark, 'click', function () {
        infoWindow.open($scope.map, mark);
      });
      resultado = mark;
      
    });
    
    $scope.mensaje = "";
    return resultado;
  }

     

  MapService.createByCurrentLocation(function (marker) {
    console.log("Llamando al service test");
    marker.options.labelContent = 'Usted esta aqu&iacute;';
    $scope.consulta.usuario.latitud=marker.latitude;
    $scope.consulta.usuario.longitud=marker.longitude;
    //refresh(marker
    var latLng = new google.maps.LatLng($scope.consulta.usuario.latitud, $scope.consulta.usuario.longitud);

    var mapOptions = {
      center: latLng,
      zoom: 11,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true
    };

     var icon = {
      url: "img/icon_green.png", // url
      scaledSize: new google.maps.Size(30, 30), // scaled size
      origin: new google.maps.Point(0,0), // origin
      anchor: new google.maps.Point(0, 0) // anchor
    };
           
    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
    google.maps.event.addListenerOnce($scope.map, 'idle', function(){
    var mark = new google.maps.Marker({
      map: $scope.map,
      icon: icon,
      animation: google.maps.Animation.DROP,
      position: latLng,
      mensaje:"mensaje",
      nombre:"local",
      telefono:"555-555",
      usuario:"usuario-ajustado",
    });      
      $scope.markers.push(mark);
      console.log("size: "+$scope.markers.length);
       var contentString = '<div id="content">'+
          '<div id="siteNotice">'+
          '</div>'+
          '<h3 id="firstHeading">Proveedor</h3>'+
          '<div id="bodyContent">'+
          '<p><b>Nombre:</b> ' +mark.nombre+
          '<br><b>Tel&eacute;fono:</b> '+mark.telefono+
          '<br><b>Usuario:</b>  '+ mark.usuario+
          '<br><b>Mensaje:</b>  '+mark.mensaje+
          '</div>'+
          '</div>';
      var infoWindow = new google.maps.InfoWindow({
          content:"Usted esta aqu&iacute; !"
      });
       
      google.maps.event.addListener(mark, 'click', function () {
          infoWindow.open($scope.map, mark);
      });
    });
    if($scope.mensaje != "" && $scope.mensaje != null){
      var data = {
        nombre: "Cliente",
        telefono:"5555",
        mensaje:$scope.mensaje.text,
        usuario:$scope.mensaje.user
      };
      ChatDetailsObj.setTo($scope.mensaje.user+"@ajustadoati.com");
      //$scope.addLocationRequest($scope.mensaje.latitud, $scope.mensaje.longitud, data);
    }
  });

  //load categories
  getCategorias();
  function getCategorias() {
    console.log("Ctrl. getting categorias")
    categoriaService.getCategorias()
      .success(function (categorias) {
        for(var i=0; i<categorias.length;i++){
          var categoria=[];
          
          categoria.selected=false;
          categoria.id=i;
          categoria.nombre=categorias[i].nombre;
          categoria.descripcion=categorias[i].descripcion;
          $scope.categorias.push(categoria);
        }
        $scope.data = categorias;
      })
      .error(function (error) {
        $scope.status = 'Unable to load customer data: ' + error.message;
      });
  }
  //method to search products
  $scope.buscar = function (newSearchForm) {
    console.log("realizando busqueda"+$scope.consulta.categoria.nombre);
    if($scope.consulta.categoria.nombre == "KO"){
      var alertPopup = $ionicPopup.alert({
        title: 'Categor&iacute;a vacia',
        template: 'Por favor seleccione categor&iacute;a!'
      }); 
    }
    $scope.consulta.producto.descripcion=$scope.consulta.producto.nombre;
    $scope.consulta.producto.id=0;
    var categoria={};
    categoria.id=$scope.consulta.categoria.id;
    categoria.nombre=$scope.consulta.categoria.nombre;
    categoria.descripcion=$scope.consulta.categoria.descripcion;
    $scope.consulta.categoria=categoria;
    var resp="";
    var men="";
    men=$scope.consulta.producto.nombre;
    //se obtienen los proveedores de la categoria
    proveedorService.getProveedoresByCategoria($scope.consulta.categoria.nombre)
    .success(function (data) {
      console.log('Consultando proveedores.'+$scope.consulta.categoria);
      $scope.proveedores=data;

    }).error(function(error) {
        $scope.status = 'Unable to get proveedores: ' + error.message;
    }); 
    consultaService.saveConsulta($scope.consulta)
    .success(function (data) {
      console.log('Saved Consulta.'+data);
      console.log('response:'+data.id);
      $scope.consultaId=data.id;
      $scope.latitud = $scope.consulta.usuario.latitud;
      $scope.longitud = $scope.consulta.usuario.longitud;
      
      $scope.categoriasSelected=[];

    }).
    error(function(error) {
        $scope.status = 'Unable to insert consulta: ' + error.message;
    }).finally(function(data){
      console.log("size"+$scope.proveedores.length);
      for(var i=0; i<$scope.proveedores.length; i++){
        console.log("proveedor: "+$scope.userActual);
        
        var usuario = {
          mensaje:"Sin mensaje",
          nombre:$scope.proveedores[i].usuario.nombre,
          telefono:$scope.proveedores[i].usuario.telefono,
          usuario:$scope.proveedores[i].usuario.user,
          id: 0         
        };

        
        if($scope.userActual != $scope.proveedores[i].usuario.user){
          $scope.addLocation($scope.proveedores[i].usuario.latitud, $scope.proveedores[i].usuario.longitud, usuario);
          if($scope.proveedores.length==(i+1)){
            console.log("fin de ciclo");
              resp=resp+$scope.proveedores[i].usuario.user;
          }else{
            console.log("sigue el ciclo");
              resp=resp+$scope.proveedores[i].usuario.user+"&&";
          }
        }else {
          console.log("usuario que envia la consulta");
        }
      }
      console.log("resp"+resp);
      console.log("data a proveedores");
      var msg = '{"id":'+$scope.consultaId+', "mensaje":"' + men + '", "users":"'+resp+'","latitud":"'+$scope.latitud+'","longitud":"'+$scope.longitud+'"}';
      console.log("msj:"+msg);
      ws.send(msg);     
    });
  }
})

.controller('peticionDetalleCtrl', function($scope, categoriaService, consultaService, $cordovaGeolocation, MapService, $stateParams, sharedConn, $ionicScrollDelegate, $ionicPopup, $state) {
  console.log("peticionCtrl"+$stateParams.peticion.latitud);
  $scope.categorias=[];
  $scope.categoriasSelected=[];
  $scope.latitud="";
  $scope.longitud="";
  $scope.consulta={};
  $scope.consulta.producto={};
  $scope.consulta.usuario={};
  $scope.consulta.categoria={};
  $scope.proveedores=[];
  $scope.map={};
  $scope.markers=[];
  $scope.peticion=$stateParams.peticion;
  $scope.response="";

  var latLng = new google.maps.LatLng($scope.peticion.latitud,  $scope.peticion.longitud);
 
  var mapOptions = {
    center: latLng,
    zoom: 13,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    disableDefaultUI: true
  };
  $scope.map = new google.maps.Map(document.getElementById("mapRequest"), mapOptions);


  $scope.addLocation= function(latitud, longitud){
    var resultado;

    var icon = {
      url: "img/icon_orange.png", // url
      scaledSize: new google.maps.Size(30, 30), // scaled size
      origin: new google.maps.Point(0,0), // origin
      anchor: new google.maps.Point(0, 0) // anchor
    };
  
    var shape = {
      coords: [1, 1, 1, 20, 18, 20, 18, 1],
      type: 'poly'
    };
    var data = {
       nombre: "Cliente",
      telefono:"5555",
      mensaje:$scope.peticion.text,
      usuario:$scope.peticion.user
    };
    
    MapService.createByCoords(latitud, longitud, data, function (marker) {
      console.log("PeticionCtrl-- en el createcoords"+marker.latitude);
       var contentString = '<div id="content">'+
        '<div id="siteNotice">'+
        '<h5 style="color: white;">Ubicaci&oacute;n cliente</h5>'+
        '</div>'+
        '<div id="bodyContent">'+
        '</div>'+
        '</div>';
        var latLng = new google.maps.LatLng(marker.latitude, marker.longitude);

        var mapOptions = {
          center: latLng,
          zoom: 13,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          disableDefaultUI: true
        };
        //$scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
      //var latLng = new google.maps.LatLng(marker.latitude, marker.longitude);

     
      
         console.log("listeners");
           var mark = new google.maps.Marker({
              map: $scope.map,
              icon: icon,
              shape: shape,
              animation: google.maps.Animation.DROP,
              position: latLng,
               mensaje:marker.mensaje,
              nombre:marker.nombre,
              telefono:marker.telefono,
              usuario:marker.usuario,
          }); 
              
         
         $scope.markers.push(mark);
         console.log("size: "+$scope.markers.length);
          var infoWindow = new google.maps.InfoWindow({
              content: contentString
          });
         
          google.maps.event.addListener(mark, 'click', function () {

              infoWindow.open($scope.map, mark);
          });
          resultado = mark;
      
    });
    
     // $scope.map.markers.push(marker);
      //refresh(marker);
    return resultado;
  }

        
        $scope.addLocation($scope.peticion.latitud, $scope.peticion.longitud);

        $scope.addLocationResponder= function(latitud, longitud, data){
          var resultado;
          var image = {
            url: 'img/location_resp.png',
            size: new google.maps.Size(20, 32),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(0, 32)
          };
        
          var shape = {
            coords: [1, 1, 1, 20, 18, 20, 18, 1],
            type: 'poly'
          };
          console.log("****************** agregando egistro:*************"+data.usuario);
          MapService.createByCoords(latitud, longitud, data, function (marker) {
           
             var contentString = '<div id="content">'+
              '<div id="siteNotice">'+
              '</div>'+
              '<h1 id="firstHeading" class="firstHeading">' +data.nombre+'</h1>'+
              '<div id="bodyContent">'+
              '<br><b>Tel&eacute;fono:</b> '+marker.telefono+
              '<br><b>Usuario:</b>  '+ marker.usuario+
              '<br><b>Mensaje:</b> <a href="#/homeVendedor/requests/'+marker.usuario+'">  '+marker.mensaje+
              '</a></div>'+
              '</div>';
            var latLng = new google.maps.LatLng(marker.latitude, marker.longitude);

           
            
               console.log("listeners");
                  var mark = new google.maps.Marker({
                    map: $scope.map,
                    icon: image,
                    shape: shape,
                    animation: google.maps.Animation.DROP,
                    position: latLng,
                     mensaje:marker.mensaje,
                    nombre:marker.nombre,
                    telefono:marker.telefono,
                    usuario:marker.usuario,
                });      
               
               $scope.markers.push(mark);
               console.log("size: "+$scope.markers.length);
                var infoWindow = new google.maps.InfoWindow({
                    content: contentString
                });
               
                google.maps.event.addListener(mark, 'click', function () {

                    infoWindow.open($scope.map, mark);
                });
                resultado = mark;
            
          });
          
           // $scope.map.markers.push(marker);
            //refresh(marker);
          return resultado;
        }

     
     //metodo para responder a las petciones
    $scope.sendMsg=function(to,body){
      var to_jid  = Strophe.getBareJidFromJid(to);
      console.log("sending message"+to_jid);
      var timestamp = new Date().getTime();
      var reqChannelsItems = $msg({id:timestamp, to:to_jid , type: 'chat' })
                     .c("body").t(body);
      $scope.response="";
      console.log(reqChannelsItems);
      sharedConn.getConnectObj().send(reqChannelsItems.tree());
      /*var alertPopup = $ionicPopup.alert({
          title: 'Mensaje Enviado',
          template: 'Se ha enviado mensaje a Usuario. Gracias por responder!'
      });*/
      //$state.go('tabsController.favoritos');
    };
  
  

    $scope.showSendMessage = function() {
      
      $scope.sendMsg($scope.peticion.user+"@ajustadoati.com/Mobil",$scope.peticion.code+"---"+$scope.response);  

        var d = new Date();
        d = d.toLocaleTimeString().replace(/:\d+ /, ' ');

        /*$scope.messages.push({
          userId: $scope.myId,
          text: $scope.response,
          time: d
        });

        delete $scope.data.message;*/
        $ionicScrollDelegate.scrollBottom(true);

    };
    
})
   
.controller('resultadoBusquedaCtrl', function($scope) {

})
   
.controller('solicitudesCtrl', function($scope) {

})
   
.controller('favoritosCtrl', function($scope, Chats, ChatDetails, $state, usuarioService, $ionicPopup, $rootScope) {
  console.log('Favoritos ');
   $scope.add_jid = "";
  $scope.chats = Chats.allRoster();
  $scope.add = function(add_jid){
    //Chats.addNewRosterContact(add_jid);
    console.log('Buscando usuario '+add_jid);
    usuarioService.getUserByUser(add_jid)
        .success(function (data) {
            if(!(data.status != null && data.status != undefined)){
             console.log('User exist '+data.telefono);
               $scope.add_jid = "";
               $state.go('tabsController.detalleFavoritos', {user:data});
              
            }else{
              $scope.add_jid = "";
              var alertPopup = $ionicPopup.alert({
                title: 'Usuario no existe !',
                template: 'Por favor intenta de nuevo!'
              });
            }
        }).
        error(function(error) {
            $scope.status = 'Unable to get user: ' + error.message;
        });
  };



  $scope.favoriteDetails=function(to_id){ 
    usuarioService.getUserByUser(to_id)
        .success(function (data) {
            if(!(data.status != null && data.status != undefined)){
             console.log('User exist '+data.telefono);
               $scope.add_jid = "";
               $state.go('tabsController.infoFavorito', {user:data});
              
            }else{
              $scope.add_jid = "";
              var alertPopup = $ionicPopup.alert({
                title: 'No existe informaci&oacute;n !',
                template: 'Por favor intenta de nuevo!'
              });
            }
        }).
        error(function(error) {
            $scope.status = 'Unable to get user: ' + error.message;
        });
    };

})

.controller('peticionCtrl', function($scope, $state, usuarioService, $ionicPopup, $rootScope, Peticiones) {
  console.log('Peticion Ctrl');
  
  $scope.peticiones = Peticiones.getAll();

  $scope.peticionDetalle=function(code){
    console.log("peticion id:"+code);
    var peticion = Peticiones.getPeticion(code);
    console.log("peticion id:"+peticion.code);
    console.log("peticion id:"+peticion.latitud);
    console.log("peticion id:"+peticion.longitud);
    console.log("peticion id:"+peticion.text);
    console.log("peticion id:"+peticion.user);
    $state.go('tabsController.peticionDetalle', {peticion});
  }
  
  $scope.add = function(add_jid){
    //Chats.addNewRosterContact(add_jid);
    console.log('Buscando usuario '+add_jid);
    usuarioService.getUserByUser(add_jid)
        .success(function (data) {
            if(!(data.status != null && data.status != undefined)){
             console.log('User exist '+data.telefono);
               $scope.add_jid = "";
               $state.go('tabsController.detalleFavoritos', {user:data});
              
            }else{
              $scope.add_jid = "";
              var alertPopup = $ionicPopup.alert({
                title: 'Usuario no existe !',
                template: 'Por favor intenta de nuevo!'
              });
            }
        }).
        error(function(error) {
            $scope.status = 'Unable to get user: ' + error.message;
        });
  };


  $scope.removePeticion=function(peticion){
    console.log("removing request");
    PeticionObj.removePeticion(peticion);
  }

  $scope.chatDetails=function(to_id){ 

    ChatDetailsObj.setTo(to_id+"@ajustadoati.com");
    $state.go('tabsController.favoritosChat', {}, {location: "replace", reload: true});
    };

  


})
.controller('detalleFavoritosCtrl', function($scope, $stateParams, Chats, usuarioService, sharedConn) {
  console.log("cargando detalle favoritos"+$stateParams.user.user);
  $scope.usuario=$stateParams.user;
  $scope.user = sharedConn.getConnectObj().jid.split("@")[0];
  $scope.addContact = function(){
    console.log("agregando usuario"+$scope.usuario.user);
    usuarioService.addContactToUser($scope.usuario.user, $scope.user)
        .success(function (data) {
            if(data.status != null && data.status != undefined && data.status == "OK"){
             Chats.addNewRosterContact($scope.usuario.user);
              
            }else{
              var alertPopup = $ionicPopup.alert({
                title: 'No se puede agregar contacto !',
                template: 'Por favor intenta de nuevo!'
              });
            }
        })
    
  };
  
})
   
.controller('mensajesCtrl', function($scope, $state, $ionicPopup, $timeout) {


  $scope.createMessage= function(){

    $state.go('tabsController.mensajeNuevo', {}, {location: "replace", reload: true});
  }
  $scope.addMessage = function() {
 
     $ionicPopup.show({
       title: 'Need to get something off your chest?',
       template: '<input type="password" ng-model="data.wifi"><br/><input type="password" ng-model="data.wifi2">'
     }).then(function(res) {
        $scope.messages.$add({
          "message": res
        });
     });
  };
})

.controller('mensajeNuevoCtrl', function($scope, $state, $ionicPopup, $timeout, categoriaService, Chats, sharedConn, $ionicScrollDelegate) {

  $scope.contactos=[];
  $scope.contactosSelected=[];
  $scope.data = Chats.getAllRoster();
  $scope.messages = [];
  $scope.myId = sharedConn.getConnectObj().jid;
  var isIOS = ionic.Platform.isIOS(); 


  $scope.onValueChanged = function(value){
    console.log(value); 
    var cats=value.split("-");  
    if(cats.length>0){
      
      for(var i=0;i<cats.length;i++){
        console.log("contacto:"+cats[i]);
        $scope.contactosSelected.push(cats[i]);
        
      }
    }

  }

  //getContactos();

  function getContactos() {
    console.log("getting contacts"+$scope.roster);
    for(var i=0; i<$scope.roster.length;i++){
        var contacto=[];
        
        contacto.selected=false;
        contacto.id=i;
        contacto.name=$scope.roster[i].name;
        contacto.descripcion=$scope.roster[i].jid;
        $scope.contactos.push(contacto);
    
    }
    $scope.data = $scope.contactos;

  }
  $scope.sendMsg=function(to,body){
    var to_jid  = Strophe.getBareJidFromJid(to);
    console.log("sending message"+to_jid);
    var timestamp = new Date().getTime();
    var reqChannelsItems = $msg({id:timestamp, to:to_jid , type: 'chat' })
                   .c("body").t(body);
    console.log(reqChannelsItems);
    sharedConn.getConnectObj().send(reqChannelsItems.tree()); 
  };
 
  $scope.showSendMessage = function() {

    console.log("sending message"+$scope.contactosSelected.length);

    for(var i=0; i<$scope.contactosSelected.length;i++){
        var contacto=$scope.contactosSelected[i]+"@ajustadoati.com";
        console.log("contact to send: "+contacto);
         $scope.sendMsg(contacto,$scope.data.message);  
    }
    
   

      var d = new Date();
      d = d.toLocaleTimeString().replace(/:\d+ /, ' ');

      $scope.messages.push({
        userId: $scope.myId,
        text: $scope.data.message,
        time: d
      });
      $scope.contactosSelected=[];
      delete $scope.data.message;
      //$ionicScrollDelegate.scrollBottom(true);

  };
   

  $scope.addMessage = function() {
 
     $ionicPopup.show({
       title: 'Need to get something off your chest?',
       template: '<input type="password" ng-model="data.wifi"><br/><input type="password" ng-model="data.wifi2">'
     }).then(function(res) {
        $scope.messages.$add({
          "message": res
        });
     });
  };

  $scope.messageRecieve=function(msg){  
  
    //  var to = msg.getAttribute('to');
    var from = msg.getAttribute('from').split;
    var type = msg.getAttribute('type');
    var elems = msg.getElementsByTagName('body');
    
    var d = new Date();
      d = d.toLocaleTimeString().replace(/:\d+ /, ' ');

    if (type == "chat" && elems.length > 0) {
      
      var body = elems[0];
      var textMsg = Strophe.getText(body);
      
      
      $scope.messages.push({
        userId: from,
        text: textMsg,
        time: d
      });
      
      $ionicScrollDelegate.scrollBottom(true);
      $scope.$apply();
      
      console.log($scope.messages);
      console.log('Message recieved from ' + from + ': ' + textMsg);
    }
    
  }
  
  
   $scope.$on('msgRecievedBroadcast2', function(event, data) {
    console.log("recibiendo mensaje broadcast");
    $scope.messageRecieve(data);
    })


  $scope.inputUp = function() {
    if (isIOS) $scope.data.keyboardHeight = 216;
    $timeout(function() {
      $ionicScrollDelegate.scrollBottom(true);
    }, 300);

  };

  $scope.inputDown = function() {
    if (isIOS) $scope.data.keyboardHeight = 0;
    $ionicScrollDelegate.resize();
  };

  $scope.closeKeyboard = function() {
    // cordova.plugins.Keyboard.close();
  };
})

.controller('productosCtrl', function($scope) {

})
      
.controller('perfilCtrl', function($scope) {

})
   
.controller('solicitudCtrl', function($scope) {

})
   
.controller('solicitudes2Ctrl', function($scope) {

})
   
.controller('ubicacionUsuarioCtrl', function($scope) {

})
      
.controller('perfilUsuarioCtrl', function($scope) {

})
   
.controller('detalleResultadoCtrl', function($scope) {

})

.controller('tabsCtrl', function($scope, $ionicScrollDelegate, $rootScope, Chats, ChatDetails, $state, Peticiones) {
  console.log("iniciando tabsCtrl");
  $scope.messages=[];
  $scope.messageRecieve=function(msg){  
    //  var to = msg.getAttribute('to');
    var from = msg.getAttribute('from');
    var type = msg.getAttribute('type');
    var elems = msg.getElementsByTagName('body');
    
    var d = new Date();
      d = d.toLocaleTimeString().replace(/:\d+ /, ' ');

    if (type == "chat" && elems.length > 0) {
      
      var body = elems[0];
      var textMsg = Strophe.getText(body);
      
      var message={
          userId: from,
          text: textMsg,
          time: d
        };
      $scope.messages.push(message);
      Chats.addMessage(message);
      $ionicScrollDelegate.scrollBottom(true);
      $scope.$apply();
      
      console.log($scope.messages);
      console.log('Message recieved from ' + from + ': ' + textMsg);
      var to_id = from.split("@")[0];
      ChatDetailsObj.setTo(to_id+"@ajustadoati.com");
      $state.go('tabsController.detalleChat', {}, {location: "replace", reload: true});
    }
    
  }

   $scope.messageRecieveFromAdmin=function(msg){  
      //  var to = msg.getAttribute('to');
      var from = msg.getAttribute('from');
      var type = msg.getAttribute('type');
      var elems = msg.getElementsByTagName('body');
      var textMessage = Strophe.getText(elems[0]);
      console.log("admin received:"+msg);
      console.log("type received:"+type);
      var all = textMessage.split("---");
      var text = all[0];
      var latitud = all[1];
      var longitud = all[2];
      console.log("msg received:"+textMessage);
      var d = new Date();
        d = d.toLocaleTimeString().replace(/:\d+ /, ' ');

      //if (type == "chat" && elems.length > 0) {
        
        var body = elems[0];
        var textMsg = Strophe.getText(body);
        
        var message={
            userId: from,
            text: textMsg,
            time: d
          };

        var peticion={
            user:from.split("@")[0],
            text: text,
            latitud:latitud,
            longitud:longitud,
            time: d
          };
        //$scope.messages.push(message);
        //Chats.addMessage(message);
        $ionicScrollDelegate.scrollBottom(true);
        //$scope.$apply();
        
        console.log($scope.messages);
        console.log('Message recieved from ' + from + ': ' + textMsg);
        var to_id = from.split("@")[0];
        ChatDetailsObj.setTo(to_id+"@ajustadoati.com");
        //Peticiones.add(peticion);
        $state.go('tabsController.peticion', {}, {reload: true,inherit: false, notify: true});
    //}
    
  }
  
  
   $rootScope.$on('msgRecievedBroadcast', function(event, data) {
    console.log('Message recieved from ');
    $scope.messageRecieve(data);
    })

   $rootScope.$on('msgRecievedBroadcastAdmin', function(event, data) {
    console.log('Message recieved from admin');
    $scope.messageRecieveFromAdmin(data);
    })

})

.controller('comercianteCtrl', function($scope, $state, usuarioService, $stateParams, ChatDetails) {
  console.log("Comerciante Ctrl");

  $scope.usuario={};

  usuarioService.getUserByUser($stateParams.user)
                      .success(function (data) {
        console.log("nombre:"+data.nombre);
        $scope.usuario = data;
  });

  $scope.chatDetails=function(to_id){ 
    ChatDetailsObj.setTo(to_id+"@ajustadoati.com");
    $state.go('tabsController.detalleChat', {}, {location: "replace", reload: true});
    };


})
.controller('detalleChatCtrl', function($scope, $timeout, $ionicScrollDelegate,sharedConn,ChatDetails, $rootScope) {

  $scope.hideTime = true;
  $scope.data = {};
  $scope.myId = sharedConn.getConnectObj().jid;
  $scope.messages = [];
  $scope.to_id=ChatDetails.getTo();

  var isIOS = ionic.Platform.isIOS(); 
  
    $scope.sendMsg=function(to,body){
    var to_jid  = Strophe.getBareJidFromJid(to);
    console.log("sending message"+to_jid);
    var timestamp = new Date().getTime();
    var reqChannelsItems = $msg({id:timestamp, to:to_jid , type: 'chat' })
                   .c("body").t(body);
    console.log(reqChannelsItems);
    sharedConn.getConnectObj().send(reqChannelsItems.tree()); 
  };
  
  

  $scope.showSendMessage = function() {
    
  $scope.sendMsg($scope.to_id,$scope.data.message);  

    var d = new Date();
    d = d.toLocaleTimeString().replace(/:\d+ /, ' ');

    $scope.messages.push({
      userId: $scope.myId,
      text: $scope.data.message,
      time: d
    });

    delete $scope.data.message;
    $ionicScrollDelegate.scrollBottom(true);

  };
  
  
  $scope.messageRecieve=function(msg){  
  
  //  var to = msg.getAttribute('to');
  var from = msg.getAttribute('from');
  var type = msg.getAttribute('type');
  var elems = msg.getElementsByTagName('body');
  
  var d = new Date();
    d = d.toLocaleTimeString().replace(/:\d+ /, ' ');

  if (type == "chat" && elems.length > 0) {
    
    var body = elems[0];
    var textMsg = Strophe.getText(body);
    
    
    $scope.messages.push({
      userId: from,
      text: textMsg,
      time: d
    });
    
    $ionicScrollDelegate.scrollBottom(true);
    $scope.$apply();
    
    console.log($scope.messages);
    console.log('Message recieved from ' + from + ': ' + textMsg);
  }
    
  }
  
  
   $rootScope.$on('msgRecievedBroadcast2', function(event, data) {
    console.log('Message recieved from ');
    $scope.messageRecieve(data);
    })


  $scope.inputUp = function() {
    if (isIOS) $scope.data.keyboardHeight = 216;
    $timeout(function() {
      $ionicScrollDelegate.scrollBottom(true);
    }, 300);

  };

  $scope.inputDown = function() {
    if (isIOS) $scope.data.keyboardHeight = 0;
    $ionicScrollDelegate.resize();
  };

  $scope.closeKeyboard = function() {
    // cordova.plugins.Keyboard.close();
  };




})
.controller('infoFavoritoCtrl', function($scope, $stateParams, Chats, usuarioService, sharedConn, $state) {
  console.log("cargando info favorito"+$stateParams.user.user);
  $scope.usuario=$stateParams.user;
  $scope.user = sharedConn.getConnectObj().jid.split("@")[0];
  $scope.logout=function(){
    console.log("T");
    sharedConn.logout();
    $state.go('login', {}, {location: "replace", reload: true});
  };

   $scope.chatDetails=function(to_id){ 
    console.log("user: "+to_id);
    ChatDetailsObj.setTo(to_id+"@ajustadoati.com");
    $state.go('tabsController.favoritosChat', {}, {location: "replace", reload: true});
  };
})
.controller('settingsCtrl', function($scope,$state,sharedConn, usuarioService, $window, $ionicHistory, Peticiones) {
  $scope.user=sharedConn.getConnectObj().jid.split("@")[0];
  $scope.usuario={};

   usuarioService.getUserByUser($scope.user)
                      .success(function (data) {
        console.log("nombre:"+data.nombre);
        $scope.usuario = data;
  });
  $scope.logout=function(){
    console.log("T");
    sharedConn.logout();
    Peticiones.deleteAll();
    //$window.localStorage.clear();
    //$ionicHistory.clearCache();
    //$ionicHistory.clearHistory();
    $state.go('login', {}, {location: "replace", reload: true});
  };


});
 