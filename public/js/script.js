/*document.addEventListener('DOMContentLoaded', function() {
    //need to pass the clicked button in parameters
    function bookAction(button) {
        button.classList.toggle('ramener');
        if (button.innerHTML === 'Emprunter') {
            button.innerHTML = 'Ramener';
        } else {
            button.innerHTML = 'Emprunter';
        }
    }

    const btnsEmprunt = document.querySelectorAll('.btnEmprunt');
    btnsEmprunt.forEach(function(button) {
        button.addEventListener('click', function() {
            bookAction(button);
            var titre=document.querySelector('.ramener').value;
        });
    });
*/


$(document).ready(function() {
    var bookTab=[];
     //need to pass the clicked button in parameters 
        if (typeof jQuery !== 'undefined') {
          console.log("jQuery est chargé et fonctionne correctement.");
        } else {
          console.error("jQuery n'est pas chargé.");
        }
    //with the help of copilot!
        function escapeSelector(selector) {
          return selector.replace(/([ #;?%&,.+*~\':"!^$[\]()=>|\/@])/g, '\\$1');
        }
    
    function bookAction(button) {
        console.log("bookAction a été appelé");
        let docId=$(button).closest('tr').attr('id');
        //console.log(docId); 
        let ligne=$(`#${docId}`);
        let auteur=ligne.find('td.auteur-cell').text();
        //console.log(auteur);
        let titre=ligne.find('td.titre-cell').text(); 
        
        $(button).toggleClass('ramener');
        if ($(button).html() === 'Emprunter') {
            $(button).html('Ramener'); 
      
        bookTab.push({
            id: docId,
            titre: titre,
            auteur: auteur,
        })
        } else {
            $(button).html('Emprunter');
            bookTab.pop({
                id: docId,
                titre: titre,
                auteur: auteur,
            })
        } 
        //console.log(titre);
        //each book that is clicked and red (like meaning borrowed) is pushed into the tab
       console.log(bookTab);
    }

    //links all buttons to the click event
    $('.btnEmprunt').each(function() {
        $(this).on('click', function() {
            bookAction(this);
            //console.log(docId);   
        });
    });
});

