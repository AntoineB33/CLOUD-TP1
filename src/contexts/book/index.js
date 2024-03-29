const { Router } = require("express");
const { client } = require("../../infrastructure/database/database");

const router = Router();

router.get("/", async (req, res) => {
    const books = await client.book.findMany();
    res.status(200).json(books);
});

// Question 1: Ajouter un livre
router.post("/", async (req, res) => {
    try {
        const newBook = await client.book.create({
            data: req.body
        });
        res.status(201).json(newBook);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'ajout du livre" });
    }
});

module.exports = router;