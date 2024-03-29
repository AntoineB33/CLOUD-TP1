const { Router } = require("express");
const { client } = require("../../infrastructure/database/database");

const router = Router();

router.get("/", async (req, res) => {
    const books = await client.book.findMany();
    res.status(200).json(books);
});

//npm install --global yarn
//npm install -g prisma
//yarn add prisma -D

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


// Question 6: Gestion des auteurs d'un livre

// Ajouter un auteur à un livre
router.post("/:bookId/authors", async (req, res) => {
    try {
        const { authorId } = req.body;
        const bookId = parseInt(req.params.bookId);

        // Vérifier si le livre existe
        const book = await client.book.findUnique({
            where: { id: bookId },
            include: { authors: true }
        });
        if (!book) {
            return res.status(404).json({ message: "Livre non trouvé" });
        }

        // Vérifier si l'auteur existe
        const author = await client.author.findUnique({ where: { id: authorId } });
        if (!author) {
            return res.status(404).json({ message: "Auteur non trouvé" });
        }

        // Ajouter l'auteur au livre
        const updatedBook = await client.book.update({
            where: { id: bookId },
            data: { authors: { connect: { id: authorId } } },
            include: { authors: true }
        });

        res.status(200).json(updatedBook);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'ajout de l'auteur au livre" });
    }
});

// Enlever un auteur d'un livre
router.delete("/:bookId/authors/:authorId", async (req, res) => {
    try {
        const bookId = parseInt(req.params.bookId);
        const authorId = parseInt(req.params.authorId);

        // Vérifier si le livre existe
        const book = await client.book.findUnique({
            where: { id: bookId },
            include: { authors: true }
        });
        if (!book) {
            return res.status(404).json({ message: "Livre non trouvé" });
        }

        // Enlever l'auteur du livre
        const updatedBook = await client.book.update({
            where: { id: bookId },
            data: { authors: { disconnect: { id: authorId } } },
            include: { authors: true }
        });

        res.status(200).json(updatedBook);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression de l'auteur du livre" });
    }
});

// Récupérer les auteurs d'un livre
router.get("/:bookId/authors", async (req, res) => {
    try {
        const bookId = parseInt(req.params.bookId);

        // Vérifier si le livre existe
        const book = await client.book.findUnique({
            where: { id: bookId },
            include: { authors: true }
        });
        if (!book) {
            return res.status(404).json({ message: "Livre non trouvé" });
        }

        res.status(200).json(book.authors);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des auteurs du livre" });
    }
});


//http://localhost:your_port_number_here/pagination

// Question 7: Pagination des livres
router.get("/pagination", async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;
        const books = await client.book.findMany({
            skip: offset,
            take: limit
        });
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la pagination des livres" });
    }
});

module.exports = router;