import { describe, it, expect, vi, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useGroupStore } from "../group";
import type { TGroup } from "~/types/group.types";

vi.mock("~/api/groups", () => ({
  groupsApi: {
    getAll: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

import { groupsApi } from "~/api/groups";

const mockGroup: TGroup = {
  groupId: "g1",
  name: "Beginners",
  schedule: [{ dayOfWeek: 1, startTime: "09:00", endTime: "10:00" }],
  children: [
    { id: "c1", name: "Alice", healthCertificate: true, isPriority: false },
  ],
  subscriptionPrice: 5000,
};

const mockGroup2: TGroup = {
  groupId: "g2",
  name: "Advanced",
  schedule: [{ dayOfWeek: 3, startTime: "11:00", endTime: "12:00" }],
  children: [],
  subscriptionPrice: 7000,
};

describe("Group Store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it("GET_GROUP_LIST — calls groupsApi.getAll, sets groupList", async () => {
    vi.mocked(groupsApi.getAll).mockResolvedValue([mockGroup, mockGroup2]);

    const store = useGroupStore();
    await store.GET_GROUP_LIST();

    expect(groupsApi.getAll).toHaveBeenCalled();
    expect(store.groupList).toEqual([mockGroup, mockGroup2]);
  });

  it("ADD_GROUP — calls groupsApi.create with childrenIds, pushes to list", async () => {
    vi.mocked(groupsApi.create).mockResolvedValue(mockGroup);

    const store = useGroupStore();
    const result = await store.ADD_GROUP({
      name: "Beginners",
      schedule: [{ dayOfWeek: 1, startTime: "09:00", endTime: "10:00" }],
      children: [
        { id: "c1", name: "Alice", healthCertificate: true, isPriority: false },
      ],
      subscriptionPrice: 5000,
    });

    expect(groupsApi.create).toHaveBeenCalledWith({
      name: "Beginners",
      schedule: [{ dayOfWeek: 1, startTime: "09:00", endTime: "10:00" }],
      childrenIds: ["c1"],
      subscriptionPrice: 5000,
    });
    expect(result).toEqual(mockGroup);
    expect(store.groupList).toHaveLength(1);
  });

  it("UPDATE_GROUP — calls groupsApi.update, replaces item in list", async () => {
    const updated = { ...mockGroup, name: "Beginners Updated" };
    vi.mocked(groupsApi.update).mockResolvedValue(updated);

    const store = useGroupStore();
    store.groupList = [mockGroup, mockGroup2];

    await store.UPDATE_GROUP(updated);

    expect(groupsApi.update).toHaveBeenCalledWith("g1", {
      name: "Beginners Updated",
      schedule: mockGroup.schedule,
      childrenIds: ["c1"],
      subscriptionPrice: 5000,
    });
    expect(store.groupList[0].name).toBe("Beginners Updated");
  });

  it("DELETE_GROUP — calls groupsApi.delete, removes from list", async () => {
    vi.mocked(groupsApi.delete).mockResolvedValue({ message: "deleted" });

    const store = useGroupStore();
    store.groupList = [mockGroup, mockGroup2];

    await store.DELETE_GROUP("g1");

    expect(groupsApi.delete).toHaveBeenCalledWith("g1");
    expect(store.groupList).toHaveLength(1);
    expect(store.groupList[0].groupId).toBe("g2");
  });
});
