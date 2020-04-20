const express = require('express');
const router = express.Router();

const {
    getBooks
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

module.exports = router;
