type TLesson = {
  groupId: string;
  groupName: string;
  startTime: string;
  endTime: string;
  childrenCount: number;
};

type TProps = {
  title: string;
  lessons: TLesson[];
  showGroupLink?: boolean;
};

export type { TProps, TLesson };
