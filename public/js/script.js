document.addEventListener('DOMContentLoaded', function() {
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
        });
    });

});
