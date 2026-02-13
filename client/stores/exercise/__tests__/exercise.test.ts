import { describe, it, expect, vi, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useExerciseStore } from "../exercise";
import type { TExercise } from "~/types/exercise.types";

vi.mock("~/api/exercises", () => ({
  exercisesApi: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

import { exercisesApi } from "~/api/exercises";

const mockExercise: TExercise = {
  id: "e1",
  groupId: "g1",
  date: "10.01.2025",
  attendance: [
    { childId: "c1", status: "present" },
    { childId: "c2", status: "absent" },
  ],
};

const mockExercise2: TExercise = {
  id: "e2",
  groupId: "g1",
  date: "12.01.2025",
  attendance: [
    { childId: "c1", status: "sick" },
    { childId: "c2", status: "present" },
  ],
};

describe("Exercise Store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it("GET_EXERCISE_LIST — calls exercisesApi.getAll, sets exerciseList", async () => {
    vi.mocked(exercisesApi.getAll).mockResolvedValue([
      mockExercise,
      mockExercise2,
    ]);

    const store = useExerciseStore();
    await store.GET_EXERCISE_LIST();

    expect(exercisesApi.getAll).toHaveBeenCalled();
    expect(store.exerciseList).toEqual([mockExercise, mockExercise2]);
  });

  it("ADD_EXERCISE — calls exercisesApi.create, pushes to list", async () => {
    vi.mocked(exercisesApi.create).mockResolvedValue(mockExercise);

    const store = useExerciseStore();
    const result = await store.ADD_EXERCISE({
      groupId: "g1",
      date: "10.01.2025",
      attendance: [
        { childId: "c1", status: "present" },
        { childId: "c2", status: "absent" },
      ],
    });

    expect(exercisesApi.create).toHaveBeenCalledWith({
      groupId: "g1",
      date: "10.01.2025",
      attendance: [
        { childId: "c1", status: "present" },
        { childId: "c2", status: "absent" },
      ],
    });
    expect(result).toEqual(mockExercise);
    expect(store.exerciseList).toHaveLength(1);
  });

  it("UPDATE_EXERCISE — calls exercisesApi.update, replaces item in list", async () => {
    const updated = { ...mockExercise, date: "11.01.2025" };
    vi.mocked(exercisesApi.update).mockResolvedValue(updated);

    const store = useExerciseStore();
    store.exerciseList = [mockExercise, mockExercise2];

    await store.UPDATE_EXERCISE(updated);

    expect(exercisesApi.update).toHaveBeenCalledWith("e1", updated);
    expect(store.exerciseList[0].date).toBe("11.01.2025");
    expect(store.exerciseList).toHaveLength(2);
  });

  it("DELETE_EXERCISE — calls exercisesApi.delete, removes from list", async () => {
    vi.mocked(exercisesApi.delete).mockResolvedValue({ message: "deleted" });

    const store = useExerciseStore();
    store.exerciseList = [mockExercise, mockExercise2];

    await store.DELETE_EXERCISE("e1");

    expect(exercisesApi.delete).toHaveBeenCalledWith("e1");
    expect(store.exerciseList).toHaveLength(1);
    expect(store.exerciseList[0].id).toBe("e2");
  });

  it("getChildAttendanceStats — calculates price correctly (present+absent pay, sick free, priority bonus)", () => {
    const store = useExerciseStore();

    // 4 exercises in Jan 2025 for group g1
    store.exerciseList = [
      {
        id: "e1",
        groupId: "g1",
        date: "05.01.2025",
        attendance: [
          { childId: "c1", status: "present" },
          { childId: "c2", status: "present" },
        ],
      },
      {
        id: "e2",
        groupId: "g1",
        date: "10.01.2025",
        attendance: [
          { childId: "c1", status: "absent" },
          { childId: "c2", status: "sick" },
        ],
      },
      {
        id: "e3",
        groupId: "g1",
        date: "15.01.2025",
        attendance: [
          { childId: "c1", status: "sick" },
          { childId: "c2", status: "present" },
        ],
      },
      {
        id: "e4",
        groupId: "g1",
        date: "20.01.2025",
        attendance: [
          { childId: "c1", status: "present" },
          { childId: "c2", status: "absent" },
        ],
      },
    ];

    // c1: present=2, absent=1, sick=1 → paid=3, price = round(3 * 8000/4) = 6000
    const statsC1 = store.getChildAttendanceStats("c1", "g1", 1, 2025, 8000, false);
    expect(statsC1.present).toBe(2);
    expect(statsC1.absent).toBe(1);
    expect(statsC1.sick).toBe(1);
    expect(statsC1.totalExercises).toBe(4);
    expect(statsC1.finalPrice).toBe(6000);

    // c2: present=2, absent=1, sick=1 → paid=3, price = round(3 * 8000/4) = 6000, + priority 1000 = 7000
    const statsC2 = store.getChildAttendanceStats("c2", "g1", 1, 2025, 8000, true);
    expect(statsC2.present).toBe(2);
    expect(statsC2.absent).toBe(1);
    expect(statsC2.sick).toBe(1);
    expect(statsC2.finalPrice).toBe(7000);
  });
});
