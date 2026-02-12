import { Router, Request, Response } from "express";
import Exercise from "../models/Exercise.js";

const router = Router();

// GET /api/exercises - get all exercises
router.get("/", async (req: Request, res: Response) => {
  try {
    const { groupId, month, year } = req.query;

    const filter: Record<string, unknown> = {};

    if (groupId) {
      filter.groupId = groupId;
    }

    let exercises = await Exercise.find(filter).sort({ date: 1 });

    // Filter by month and year
    if (month && year) {
      exercises = exercises.filter((e) => {
        const [, m, y] = e.date.split(".").map(Number);
        return m === Number(month) && y === Number(year);
      });
    }

    res.json(exercises);
  } catch (error) {
    res.status(500).json({ error: "Failed to get exercises list" });
  }
});

// GET /api/exercises/:id - get exercise by ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const exercise = await Exercise.findById(req.params.id);
    if (!exercise) {
      return res.status(404).json({ error: "Exercise not found" });
    }
    res.json(exercise);
  } catch (error) {
    res.status(500).json({ error: "Failed to get exercise data" });
  }
});

// POST /api/exercises - create exercise
router.post("/", async (req: Request, res: Response) => {
  try {
    const exercise = new Exercise(req.body);
    await exercise.save();
    res.status(201).json(exercise);
  } catch (error) {
    res.status(400).json({ error: "Failed to create exercise" });
  }
});

// PUT /api/exercises/:id - update exercise
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const exercise = await Exercise.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!exercise) {
      return res.status(404).json({ error: "Exercise not found" });
    }
    res.json(exercise);
  } catch (error) {
    res.status(400).json({ error: "Failed to update exercise" });
  }
});

// DELETE /api/exercises/:id - delete exercise
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const exercise = await Exercise.findByIdAndDelete(req.params.id);
    if (!exercise) {
      return res.status(404).json({ error: "Exercise not found" });
    }
    res.json({ message: "Exercise deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete exercise" });
  }
});

// GET /api/exercises/stats/:childId - child attendance stats
router.get("/stats/:childId", async (req: Request, res: Response) => {
  try {
    const { childId } = req.params;
    const { groupId, month, year } = req.query;

    if (!groupId || !month || !year) {
      return res
        .status(400)
        .json({ error: "groupId, month, and year are required" });
    }

    let exercises = await Exercise.find({ groupId });

    // Filter by month and year
    exercises = exercises.filter((e) => {
      const [, m, y] = e.date.split(".").map(Number);
      return m === Number(month) && y === Number(year);
    });

    const totalExercises = exercises.length;
    let present = 0;
    let absent = 0;
    let sick = 0;

    exercises.forEach((e) => {
      const attendance = e.attendance.find(
        (a) => a.childId.toString() === childId
      );
      if (attendance) {
        if (attendance.status === "present") present++;
        else if (attendance.status === "absent") absent++;
        else if (attendance.status === "sick") sick++;
      }
    });

    res.json({
      childId,
      totalExercises,
      present,
      absent,
      sick,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to get stats" });
  }
});

export default router;
