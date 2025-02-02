$(document).ready(function() {
 
    function bookAction(button) {
            
    //console.log('UserId:', userId);
    let docId=$(button).attr('id');
        
    //console.log('document Id:', docId); 
            
    let toBeReturned = $(button).hasClass('ramener');
    let dispoStatus = toBeReturned ? false : true ;
    let url = toBeReturned ? '/retour': '/emprunt';
           
    //console.log(`URL appelée: ${url}`);
    //console.log(`Statut de disponibilité: ${dispoStatus}`);

    //server request depending on route in url variable /emprunt or /retour
    fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: userId,
                    docId: docId,
                    dispo: dispoStatus
                })
            })
        .then(response => {
            if(response.status=== 400) {
                return response.json().then(data => {
                    throw new Error(data.message);
                })
            }
            else if(response.status === 200){
                    return response.json().then(data=> {
                        alert (data.message)
                    })
            }
            })
            .catch(error =>  alert(error.message));
    
      //updating class and text on button
        $(button).toggleClass('ramener');
        $(button).text(toBeReturned ? 'Emprunter' : 'Ramener');
    //console.log(`Classe du bouton après mise à jour: ${$(button).attr('class')}`);
    //console.log(`Texte du bouton après mise à jour: ${$(button).text()}`);
}
    $('.btnEmprunt').each(function() {
        $(this).on('click', function() {
            bookAction(this);
            //console.log(docId);   
        });
    });
});

