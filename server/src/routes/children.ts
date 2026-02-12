import { Router, Request, Response } from "express";
import Child from "../models/Child.js";

const router = Router();

// GET /api/children - get all children
router.get("/", async (req: Request, res: Response) => {
  try {
    const children = await Child.find().sort({ name: 1 });
    res.json(children);
  } catch (error) {
    res.status(500).json({ error: "Failed to get children list" });
  }
});

// GET /api/children/:id - get child by ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const child = await Child.findById(req.params.id);
    if (!child) {
      return res.status(404).json({ error: "Child not found" });
    }
    res.json(child);
  } catch (error) {
    res.status(500).json({ error: "Failed to get child data" });
  }
});

// POST /api/children - create child
router.post("/", async (req: Request, res: Response) => {
  try {
    const child = new Child(req.body);
    await child.save();
    res.status(201).json(child);
  } catch (error) {
    res.status(400).json({ error: "Failed to create child" });
  }
});

// PUT /api/children/:id - update child
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const child = await Child.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!child) {
      return res.status(404).json({ error: "Child not found" });
    }
    res.json(child);
  } catch (error) {
    res.status(400).json({ error: "Failed to update child" });
  }
});

// DELETE /api/children/:id - delete child
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const child = await Child.findByIdAndDelete(req.params.id);
    if (!child) {
      return res.status(404).json({ error: "Child not found" });
    }
    res.json({ message: "Child deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete child" });
  }
});

export default router;
