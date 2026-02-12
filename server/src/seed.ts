import mongoose from "mongoose";
import dotenv from "dotenv";
import Child from "./models/Child.js";
import Group from "./models/Group.js";
import Exercise from "./models/Exercise.js";
import User from "./models/User.js";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/yasna";

const childrenData = [
  { name: "Smith Emma Jane", dateOfBirth: "23.08.2016", parent: "Smith Laura Jane", address: "12 Oak Street", phoneNumber: 5551234567, healthCertificate: false, note: "" },
  { name: "Johnson Olivia Grace", dateOfBirth: "03.02.2017", parent: "Johnson Sarah Marie", address: "45 Maple Avenue", phoneNumber: 5552345678, healthCertificate: true, note: "test" },
  { name: "Williams Sophia Rose", dateOfBirth: "15.05.2015", parent: "Williams Maria Anne", address: "78 Pine Road", phoneNumber: 5553456789, healthCertificate: true, note: "" },
  { name: "Brown Isabella Claire", dateOfBirth: "12.11.2016", parent: "Brown Jennifer Lynn", address: "23 Elm Court", phoneNumber: 5554567890, healthCertificate: true, note: "Citrus allergy" },
  { name: "Jones Mia Elizabeth", dateOfBirth: "07.09.2017", parent: "Jones Patricia Ann", address: "67 Cedar Lane", phoneNumber: 5555678901, healthCertificate: false, note: "" },
  { name: "Davis Charlotte May", dateOfBirth: "20.03.2015", parent: "Davis Robert James", address: "12 Birch Drive", phoneNumber: 5556789012, healthCertificate: true, note: "" },
  { name: "Miller Amelia Faith", dateOfBirth: "18.07.2016", parent: "Miller Anna Marie", address: "89 Willow Way", phoneNumber: 5557890123, healthCertificate: true, note: "Wears glasses" },
  { name: "Wilson Ava Nicole", dateOfBirth: "05.01.2017", parent: "Wilson Tamara Lee", address: "30 Spruce Street", phoneNumber: 5558901234, healthCertificate: false, note: "" },
  { name: "Moore Harper Lynn", dateOfBirth: "30.04.2015", parent: "Moore Elena Kay", address: "15 Aspen Court", phoneNumber: 5559012345, healthCertificate: true, note: "" },
  { name: "Taylor Evelyn Ruth", dateOfBirth: "22.12.2016", parent: "Taylor Irene Paula", address: "78 Poplar Lane", phoneNumber: 5550123456, healthCertificate: true, note: "Takes dance classes" },
  { name: "Anderson Abigail Hope", dateOfBirth: "14.06.2017", parent: "Anderson Natalie Dawn", address: "45 Juniper Road", phoneNumber: 5551234568, healthCertificate: false, note: "" },
  { name: "Thomas Emily Jean", dateOfBirth: "08.10.2015", parent: "Thomas Andrew Neil", address: "33 Hazel Avenue", phoneNumber: 5552345679, healthCertificate: true, note: "" },
  { name: "Jackson Ella Mae", dateOfBirth: "25.02.2016", parent: "Jackson Diana Cole", address: "56 Linden Street", phoneNumber: 5553456780, healthCertificate: true, note: "Enjoys drawing" },
  { name: "White Scarlett Anne", dateOfBirth: "17.08.2017", parent: "White Linda Rose", address: "22 Ivy Court", phoneNumber: 5554567891, healthCertificate: false, note: "" },
  { name: "Harris Aria Grace", dateOfBirth: "11.05.2015", parent: "Harris Marina Claire", address: "91 Laurel Drive", phoneNumber: 5555678902, healthCertificate: true, note: "" },
  { name: "Martin Victoria Faye", dateOfBirth: "03.09.2016", parent: "Martin Oliver James", address: "14 Park Avenue", phoneNumber: 5556789013, healthCertificate: true, note: "Plays sports" },
  { name: "Garcia Lily Kate", dateOfBirth: "28.11.2017", parent: "Garcia Elena Rose", address: "67 South Road", phoneNumber: 5557890124, healthCertificate: false, note: "" },
  { name: "Martinez Chloe Dawn", dateOfBirth: "19.07.2015", parent: "Martinez Ivan Neil", address: "38 River Street", phoneNumber: 5558901235, healthCertificate: true, note: "" },
  { name: "Robinson Zoe Beth", dateOfBirth: "06.03.2016", parent: "Robinson Julia Marie", address: "50 Green Lane", phoneNumber: 5559012346, healthCertificate: true, note: "Plays guitar" },
  { name: "Clark Penelope Joy", dateOfBirth: "21.10.2017", parent: "Clark Svetlana Ann", address: "105 Central Avenue", phoneNumber: 5550123457, healthCertificate: true, note: "" },
];

const groupsData = [
  {
    name: "Beginners",
    schedule: [
      { dayOfWeek: 2, startTime: "09:00", endTime: "09:45" },
      { dayOfWeek: 4, startTime: "09:00", endTime: "09:45" },
      { dayOfWeek: 5, startTime: "10:45", endTime: "11:45" },
    ],
    childrenIndices: [0, 2, 3, 8, 11, 14, 17],
  },
  {
    name: "Intermediate",
    schedule: [
      { dayOfWeek: 2, startTime: "10:45", endTime: "11:45" },
      { dayOfWeek: 3, startTime: "10:45", endTime: "11:45" },
      { dayOfWeek: 5, startTime: "12:00", endTime: "13:00" },
    ],
    childrenIndices: [1, 4, 5, 9, 12, 15, 18],
  },
  {
    name: "Advanced",
    schedule: [
      { dayOfWeek: 2, startTime: "12:30", endTime: "13:30" },
      { dayOfWeek: 3, startTime: "14:00", endTime: "15:00" },
      { dayOfWeek: 4, startTime: "10:00", endTime: "11:00" },
      { dayOfWeek: 5, startTime: "12:30", endTime: "13:30" },
      { dayOfWeek: 6, startTime: "11:15", endTime: "12:15" },
    ],
    childrenIndices: [6, 7, 10, 13, 16, 19],
  },
];

type TStatus = "present" | "absent" | "sick";

function generateAttendance(childIds: mongoose.Types.ObjectId[]): { childId: mongoose.Types.ObjectId; status: TStatus }[] {
  const statuses: TStatus[] = ["present", "absent", "sick"];
  return childIds.map((childId) => ({
    childId,
    status: statuses[Math.floor(Math.random() * 10) < 7 ? 0 : Math.floor(Math.random() * 3)] as TStatus,
  }));
}

function generateExercisesForMonth(
  groupId: mongoose.Types.ObjectId,
  childIds: mongoose.Types.ObjectId[],
  month: number,
  year: number,
  scheduleDays: number[]
): { groupId: mongoose.Types.ObjectId; date: string; attendance: { childId: mongoose.Types.ObjectId; status: TStatus }[] }[] {
  const exercises: { groupId: mongoose.Types.ObjectId; date: string; attendance: { childId: mongoose.Types.ObjectId; status: TStatus }[] }[] = [];
  const daysInMonth = new Date(year, month, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    const dayOfWeek = date.getDay() === 0 ? 7 : date.getDay(); // 1-7 (Mon-Sun)

    if (scheduleDays.includes(dayOfWeek)) {
      const dateStr = `${String(day).padStart(2, "0")}.${String(month).padStart(2, "0")}.${year}`;
      exercises.push({
        groupId,
        date: dateStr,
        attendance: generateAttendance(childIds),
      });
    }
  }

  return exercises;
}

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear database
    await Child.deleteMany({});
    await Group.deleteMany({});
    await Exercise.deleteMany({});
    await User.deleteMany({});
    console.log("Database cleared");

    // Create users
    await User.create({
      username: "admin",
      password: "admin",
      role: "admin",
    });
    await User.create({
      username: "test",
      password: "test",
      role: "user",
    });
    console.log("Created users: admin/admin (role: admin), test/test (role: user)");

    // Create children
    const children = await Child.insertMany(childrenData);
    console.log(`Created ${children.length} children`);

    // Create groups and assign children
    const groups = [];
    for (const groupData of groupsData) {
      const group = await Group.create({
        name: groupData.name,
        schedule: groupData.schedule,
      });

      // Assign children to group
      const childIds = groupData.childrenIndices.map((i) => children[i]._id);
      await Child.updateMany(
        { _id: { $in: childIds } },
        { groupId: group._id }
      );

      groups.push({ group, childIds, scheduleDays: groupData.schedule.map((s) => s.dayOfWeek) });
    }
    console.log(`Created ${groups.length} groups`);

    // Create exercises for November and December 2025
    const allExercises: { groupId: mongoose.Types.ObjectId; date: string; attendance: { childId: mongoose.Types.ObjectId; status: TStatus }[] }[] = [];

    for (const { group, childIds, scheduleDays } of groups) {
      // November 2025
      allExercises.push(...generateExercisesForMonth(group._id as mongoose.Types.ObjectId, childIds as mongoose.Types.ObjectId[], 11, 2025, scheduleDays));
      // December 2025
      allExercises.push(...generateExercisesForMonth(group._id as mongoose.Types.ObjectId, childIds as mongoose.Types.ObjectId[], 12, 2025, scheduleDays));
    }

    await Exercise.insertMany(allExercises);
    console.log(`Created ${allExercises.length} exercises`);

    console.log("Seed completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
}

seed();
