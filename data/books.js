const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

const url = process.env.DB_URL;

const dbName = 'library';
const collName = 'books';

const settings = { useUnifiedTopology: true };

const getBooks = () => {
    const promise = new Promise((resolve, reject) => {
        MongoClient.connect(url, settings, function(err, client){
            if(err){
                reject(err);
            } else {
                console.log(`Successfully connected to database: ${dbName}`);
                const db = client.db(dbName);
                const collection = db.collection(collName);
                collection.find({}).toArray(function(err,docs){
                    if(err){
                        reject(err);
                    } else {
                        console.log("Found the following data:");
                        console.log(docs);
                        resolve(docs);
                        client.close();
                    };
                })
            };
        })

    })
    return promise;
}

// ==========POST=============================================
const invalidBook = (book) => {
    let result;
    if(!book.title){
        result = "A book title is required";
    } else if(!book.author){
        result = "A book author is required.";
    } else if(!book.genre){
        result = "A book genre is require.";
    }
    return result;
};

const addBook = (books) => {
    const promise = new Promise((resolve, reject) => {
        if(!Array.isArray(books)){
            reject({error: "Must submit an array."});
        } else {
            const invalidBooks = books.filter((book) => {
                const check = invalidBook(book);
                if(check){
                    book.invalid = check;
                }
                return book.invalid;
            });
        if(invalidBooks.length > 0){
            reject({
                error: "Some books were invalid",
                data: invalidBooks
            });
        } else {
            MongoClient.connect(url, settings, async function(err,client){
                if(err){
                    reject(err); 
                } else {
                    console.log("Successfully connect to DB.");
                    const db = client.db('library');
                    const collection = db.collection('books');
                    const results = await collection.insertMany(books);
                    resolve(results.ops);
                }
            })
        }
    }
});
    
return promise;
};

// ========DELETE==================
const deleteBook = (id) => {
    const promise = new Promise((resolve, reject) => {
        MongoClient.connect(url, settings, async function(err, client){
            if(err){
                reject(err);
            } else {
                console.log("Successfully connect to DB");
                const db = client.db(dbName);
                const collection = db.collection(collName);
                try{
                    const _id = new ObjectID(id);
                    collection.findOneAndDelete({_id}, function(err,data){
                        if(err){
                            reject(err);
                        } else {
                            if(data.lastErrorObject.n > 0){
                                resolve(data.value);
                            } else {
                                resolve({error: "ID doesn't exist."});
                            }
                        }
                    })
                }catch(err){
                    reject({error: "ID has to be in ObjectID format."});
                }
            }
        })
    })
    return promise;
}


module.exports = {
    getBooks,
    addBook,
    deleteBook
}