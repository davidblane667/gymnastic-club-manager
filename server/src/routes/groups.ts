import { Router, Request, Response } from "express";
import Group from "../models/Group.js";
import Child from "../models/Child.js";

const router = Router();

// GET /api/groups - get all groups with children
router.get("/", async (req: Request, res: Response) => {
  try {
    const groups = await Group.find().populate("children").sort({ name: 1 });
    res.json(groups);
  } catch (error) {
    res.status(500).json({ error: "Failed to get groups list" });
  }
});

// GET /api/groups/:id - get group by ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const group = await Group.findById(req.params.id).populate("children");
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }
    res.json(group);
  } catch (error) {
    res.status(500).json({ error: "Failed to get group data" });
  }
});

// POST /api/groups - create group
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, schedule, childrenIds, subscriptionPrice } = req.body;

    const group = new Group({ name, schedule, subscriptionPrice });
    await group.save();

    // Assign children to group
    if (childrenIds && childrenIds.length > 0) {
      await Child.updateMany(
        { _id: { $in: childrenIds } },
        { groupId: group._id }
      );
    }

    const populatedGroup = await Group.findById(group._id).populate("children");
    res.status(201).json(populatedGroup);
  } catch (error) {
    res.status(400).json({ error: "Failed to create group" });
  }
});

// PUT /api/groups/:id - update group
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { name, schedule, childrenIds, subscriptionPrice } = req.body;

    const group = await Group.findByIdAndUpdate(
      req.params.id,
      { name, schedule, subscriptionPrice },
      { new: true, runValidators: true }
    );

    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    // Update children assignments
    if (childrenIds !== undefined) {
      // Remove groupId from children who were in the group
      await Child.updateMany(
        { groupId: group._id },
        { $unset: { groupId: "" } }
      );

      // Assign new children
      if (childrenIds.length > 0) {
        await Child.updateMany(
          { _id: { $in: childrenIds } },
          { groupId: group._id }
        );
      }
    }

    const populatedGroup = await Group.findById(group._id).populate("children");
    res.json(populatedGroup);
  } catch (error) {
    res.status(400).json({ error: "Failed to update group" });
  }
});

// DELETE /api/groups/:id - delete group
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const group = await Group.findByIdAndDelete(req.params.id);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    // Remove groupId from children of this group
    await Child.updateMany({ groupId: group._id }, { $unset: { groupId: "" } });

    res.json({ message: "Group deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete group" });
  }
});

export default router;
