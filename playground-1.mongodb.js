{Document.find()
    .sort({ record_timestamp: -1 })  
    .limit(1)
    .then((document) => {
      console.log(document[0].fields.titre_avec_lien_vers_le_catalogue); 
    })
    .catch((error) => {
      console.log(`Error fetching document: ${error.message}`);
    });
  }