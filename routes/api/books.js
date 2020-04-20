const express = require('express');
const router = express.Router();

const {
    getBooks,
    addBook
} = require('../../data/books');

/* GET users listing. */
router.get('/', async function(req, res, next) {
    try{
        const data = await getBooks();
        res.send(data);
    } catch(err){
        console.log(err);
        res.send(500, 'Internal Server Issue; check logs');
    };
});

// POST 
router.post('/', async function(req, res, next){
    try{
        const data = await addBook(req.body);
        res.send(data);
    } catch(err){
        if(err.error){
            res.status(400).send(err);
        } else{
            console.log(err);
            res.status(500).send('Internal Sever Issue; check logs');
        };
    };
})

module.exports = router;
