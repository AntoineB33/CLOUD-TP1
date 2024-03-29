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

// Question 2: Récupérer une liste de livres
router.get("/", async (req, res) => {
    try {
        const books = await client.book.findMany();
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des livres" });
    }
});

// Question 3: Récupérer les informations d'un livre en particulier
router.get("/:id", async (req, res) => {
    try {
        const book = await client.book.findUnique({
            where: {
                id: parseInt(req.params.id)
            }
        });
        if (!book) {
            res.status(404).json({ message: "Livre non trouvé" });
        } else {
            res.status(200).json(book);
        }
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération du livre" });
    }
});

// Question 4: Supprimer un livre
router.delete("/:id", async (req, res) => {
    try {
        await client.book.delete({
            where: {
                id: parseInt(req.params.id)
            }
        });
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression du livre" });
    }
});

// Question 5: Modifier un livre
router.put("/:id", async (req, res) => {
    try {
        const updatedBook = await client.book.update({
            where: {
                id: parseInt(req.params.id)
            },
            data: req.body
        });
        res.status(200).json(updatedBook);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la modification du livre" });
    }
});

module.exports = router;