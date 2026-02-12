type TAttendanceStatus = "present" | "absent" | "sick";

type TChildAttendance = {
  childId: string;
  status: TAttendanceStatus;
};

type TExercise = {
  id: string;
  groupId: string;
  date: string; // "13.12.2024"
  attendance: TChildAttendance[];
};

export type { TExercise, TChildAttendance, TAttendanceStatus };
