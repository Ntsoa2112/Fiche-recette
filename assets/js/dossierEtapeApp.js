function getval(sel) {
   //alert(sel.value);
   getLstEtape(sel.value);
   getLsApplication(sel.value);
   getLsApplicationTab(sel.value);
   getLsTestTab(sel.value);
   getStat(sel.value);
   getTypeTestApp(sel.value);
   getLsTestTabAttente(sel.value);
   getLsFonctionnalite(sel.value);
}

function getValFonctionnalite(sel){
	getLsFonctionnalite(sel.value);
}

function onLoadDossierApp(){
	getLsDossier();
	getTypeTestApp("a");
	getLsApplicationTab("a");
}

function onLoadDossierTest(){
	getLsDossier();
	getLsTestTab("a");
}

function onLoadDossierStat(){
	getLsDossier();
	getStat("a");
	getLsTestTabAttente("a");
}

function onLoadDemande(){
	getLsDemandeApp("",""); //**************************************************************//
	getLsDemandeNewApp();
}

function getLstEtape(idDossier)
{
	$.ajax({
	type: "GET",
	url: "/getLsEtape?idDossier="+idDossier,
	success: function(msg){
		$("#etapeDash").html(msg);
		$("#etape").html(msg);
	},
	 error: function (error) {
		  alert('error; ' +error);
	  }
	});
}

function getLsDossier()
{
  $.ajax({
	type: "GET",
	url: "/getLsDossier",
	success: function(msg){
	  $("#dossierDash").html(msg);
	  $("#dossierNum").html(msg);
	},
	error: function (error) {
	  alert('error; ' +error);
	}
  });
}

function getLsApplication(idDossier)
{
  $.ajax({
	type: "GET",
	url: "/getLsApplication?idDossier="+idDossier,
	success: function(msg){
	  $("#applicationDash").html(msg);
	  $("#application").html(msg);
	},
	error: function (error) {
	  alert('error; ' +error);
	}
  });
}

function getLsFonctionnalite(idApplication) //Liste fonctionnalite
{
  $.ajax({
	type: "GET",
	url: "/getLsFonctionnalite?idApplication="+idApplication,
	success: function(msg){
	  $("#fonctionnalite").html(msg);
	},
	error: function (error) {
	  alert('error; ' +error);
	}
  });
}

function getLsApplicationTab(idDossier)
{
  $.ajax({
	type: "GET",
	url: "/getLsApplicationTab?idDossier="+idDossier,
	success: function(msg){
	  $("#applicationList").html(msg);
	},
	error: function (error) {
	  alert('error; ' +error);
	}
  });
}

function getLsTestTab(idDossier)
{
	//alert(idDossier);
  $.ajax({
	type: "GET",
	url: "/getLsTestTab?idDossier="+idDossier,
	success: function(msg){
		//var contentHtml = jsonRet.html;
	  $("#testList").html(msg);
	},
	error: function (error) {
	  alert('error; ' +error);
	}
  });
}
 //get statistique
function getStat(idDossier)
{
  $.ajax({
	type: "GET",
	url: "/getStat?idDossier="+idDossier,
	success: function(msg){
	  $("#stat").html(msg);
	},
	error: function (error) {
	  alert('error; ' +error);
	}
  });
}

//get type test application
function getTypeTestApp(idDossier)
{
  $.ajax({
	type: "GET",
	url: "/getTypeTestApp?idDossier="+idDossier,
	success: function(msg){
	  $("#typeTestApp").html(msg);
	},
	error: function (error) {
	  alert('error; ' +error);
	}
  });
}

function getLsTestTabAttente(idDossier)
{
  $.ajax({
	type: "GET",
	url: "/getLsTestTabAttente?idDossier="+idDossier,
	success: function(msg){
	  $("#testListAttente").html(msg);
	},
	error: function (error) {
	  alert('error; ' +error);
	}
  });
}
//ADD "RONNY" LISTE DEMANDE APPLICATION
function getLsDemandeApp(dossier,personne_demande)
{
  $.ajax({
    type: "GET",
    url: "/getLsDemandeApp?id_dossier="+dossier+"&id_personne_demande="+personne_demande,
    success: function(msg){
      $("#List_Application_Demande").html(msg);
    },
    error: function (error) {
      alert('error; ' +error);
    }
  });
}
function getLsDemandeNewApp()
{
  $.ajax({
    type: "GET",
    url: "/getLsDemandeNewApp",
    success: function(msg){
      $("#List_Nouvelle_Application_Demande").html(msg);
    },
    error: function (error) {
      alert('error; ' +error);
    }
  });
}
//FIN CHANGE ("RONNY")


