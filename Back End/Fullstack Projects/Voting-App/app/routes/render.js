module.exports = (req, res, page) => {
    if (req.user) {
        let firstName = req.user.username.split(' ');
        firstName = firstName[0];
        res.render(page, {
            title: "Vin Votes | " + page,
            navbarGreeting: "Hello " + firstName + "!",
            user: req.user,
            welcome: 'Welcome ' + firstName
        });
    } else {
        res.render(page, {
            title: "Vin Votes | " + page,
            navbarGreeting: "Welcome"
        });
    }
};