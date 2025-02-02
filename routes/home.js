const express = require('express');
const mongoose = require('mongoose');
const Document = mongoose.model('Document');
const User = mongoose.model('User');

const router = express.Router();

router.get('/', async (req, res) => {
    
    if (req.query["login_success"] === 'true') {
        res.locals.success = 'Vous êtes maintenant connecté !';
    }

    if (req.query["logout_success"] === 'true') {
        res.locals.success = 'Vous êtes maintenant déconnecté !';
    }
    const user = req.session.user;
    console.log('Session user:', req.session.user);


    try {
        const documents = await Document.find()
            .sort({ record_timestamp: -1 })
            .limit(5)
        ;

        res.render('home', {
            title: 'Medialogue',
            user: user,
            documents });

    } catch (error) {
        console.error(`Error fetching documents: ${error.message}`);
        return res.status(500).send('Une erreur est survenue lors de la récupération des documents!');
    }
});

//user borrows document
router.post('/emprunt', async (req, res)=> {
    try {
        const userId=req.session.userId;
        console.log('session userId:', userId);
        console.log('Request body:', req.body);
        const{docId, dispo}=req.body;
      
        console.log('Document ID:', docId);

        const user = await User.findById(userId); 
        if(!user){
            return res.status(404).json({message:'l\'utilisateur n\'a pu être trouvé'})
        }

        
       const borrowedCount = user.borrowedDocuments ? user.borrowedDocuments.length : 0;
        if (borrowedCount >= 5) {
           return res.status(400).json({ message: "Vous avez atteint le nombre d\'ouvrages autorisé." });
        }
        const result = await User.findOneAndUpdate(
            {_id: userId},
            {
                $addToSet: { borrowedDocuments: docId},
            },
            {new:true}
            );
            await Document.findByIdAndUpdate(docId, { 'fields.dispo': dispo});
            //only added if not already there 
        console.log('Mise a jour: ', result);
        return res.status(200).json({message: `le livre a bien été emprunté `})
        }
    catch (error) {
        console.error(`Une erreur lors de l'ajout du document: ${error.message}`);
        res.status(500).json({message : `Une erreur est survenue lors de l\'emprunt du document`});
    }
});

//request for user returning document
router.post('/retour', async (req, res)=> {
  
    try {
        const userId=req.session.userId;
        console.log('session userId:', userId);
        console.log('Request body:', req.body);
     

        let { docId, dispo } = req.body;
        console.log('Document ID:', docId);
        console.log('le status du livre est:', dispo)
        const result = await User.findOneAndUpdate( 
            {_id: userId},
            {$pull: { borrowedDocuments:docId}},
            {new: true}
        );

        await Document.findByIdAndUpdate(docId, { 'fields.dispo': dispo});
            //only added if not already there 
        console.log('Mise a jour: ', result);
        res.status(200).json({message : `Document retourné par l\'utilisateur`});
        }
    catch (error) {
        console.error(`Une erreur lors de l'ajout du document: ${error.message}`);
        res.status(500).json({message : `Une erreur est survenue lors de l\'emprunt du document`});
    }
});


module.exports = router;