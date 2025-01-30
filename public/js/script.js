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
     //need to pass the clicked button in parameters 
       
    function bookAction(button) {
        $(button).toggleClass('ramener');
        if ($(button).html() === 'Emprunter') {
            $(button).html('Ramener');
        } else {
            $(button).html('Emprunter');
        } 
        
        
        
     
       
    }

    //links all buttons to the click event
    $('.btnEmprunt').each(function() {var docId=$(this).attr('id');
        $(this).on('click', function() {
            bookAction(this);
            console.log(docId);   
            
        });
    });

});

