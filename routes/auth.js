const express = require('express');
const {UserDbService} = require("../services/user_db_service");
const {SecurityService} = require("../services/security_service");

const router = express.Router();

router.get('/register', (req, res) => {
    res.render('auth/register', {title: 'Inscription'});
});

router.post('/register', async (req, res) => {
    const userDbService = new UserDbService();
    const { password, repeat_password: repeatPassword, email, firstname, lastname } = req.body;

    if (!email || !firstname || !lastname || !password || !repeatPassword) {
        return res.render('auth/register', {
            title: 'Inscription',
            error: 'Tous les champs sont obligatoires.',
            formData: { firstname, lastname, email }
        });
    }

    if (
        password.length < 8 ||
        !/[a-z]/.test(password) ||
        !/[A-Z]/.test(password) ||
        !/[0-9]/.test(password) ||
        !/[@$!%*?&]/.test(password)
    ) {
        return res.render('auth/register', {
            title: 'Inscription',
            error: 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.',
            formData: { firstname, lastname, email }
        });
    }

    if (password !== repeatPassword) {
        return res.render('auth/register', {
            title: 'Inscription',
            error: 'Les mots de passe ne correspondent pas.',
            formData: { firstname, lastname, email }
        });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.render('auth/register', {
            title: 'Inscription',
            error: 'L\'adresse email n\'est pas valide.',
            formData: { firstname, lastname, email }
        });
    }

    try {
        const creation = await userDbService.createUser({
            firstname: firstname,
            lastname: lastname,
            email: email,
            password: SecurityService.hashPassword(password),
            roles: ["ROLE_USER"]
        });

        if (creation.status === 201) {
            return res.redirect('/auth/login?registration_success=true');
        } else {
            console.log(creation.message)
            let message = creation.message;

            if (message.includes("duplicate key error")) {
                message = "L'adresse email est déjà utilisée.";
            }

            return res.render('auth/register', {
                title: 'Inscription',
                error: message,
                formData: { firstname, lastname, email }
            });
        }
    } catch (error) {
        return res.render('auth/register', {
            title: 'Inscription',
            error: 'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.',
            formData: { firstname, lastname, email }
        });
    }
});

router.get('/login', (req, res) => {

    if (req.query["registration_success"] === 'true') {
        res.locals.success = 'Votre inscription a réussi ! Vous pouvez maintenant vous connecter.';
    }

    res.render('auth/login', { title: 'Connexion' });
});

router.post('/login', async (req, res) => { 
    const userDbService = new UserDbService(); 
    const { email, password } = req.body; 
    
    if (!email ||!password) { 
        return res.render('auth/login', { 
            title: 'Connexion', 
            error: 'Tous les champs sont obligatoires.' 
        }); 
    } 
    
    try { 
        const user = await userDbService.getUserByEmail(email); 
            if (user === null || user === undefined ||!SecurityService.comparePasswords(password, user["password"])) { 
                return res.render('auth/login', { 
                    title: 'Connexion', 
                    error: 'L\'adresse email ou le mot de passe est incorrect.' 
                }); 
            } 
            req.session.user = user; 
            req.session.userId = user._id; 
            res.locals.userId = user._id;
             res.redirect('/documents?login_success=true'); 
             console.log(req.session.userId);   
             console.log(req.session.user);  
        } 
    catch (error) { 
        console.error(error); 
        return res.render('auth/login', { 
            title: 'Connexion', 
            error: 'Une erreur est survenue lors de la connexion. Veuillez réessayer.' 
        }); 
    } 
}); 

router.get('/logout', (req, res) => { 
    req.session.destroy(() => { 
        res.redirect('/?logout_success=true'); 
    }); 
}); 
module.exports = router;