export interface Task {
  id: number;
  title: string;
  notes: string;
  completed: boolean;
  reminderSet: boolean;
  reminderDate: Date;
  dateCreated: Date;
  userId: number;
}

export interface TaskForCreate {
  title: string;
  notes?: string;
  reminderSet?: boolean;
  reminderDate?: Date;
  userId: number;
}

export interface TaskReminderForCreate {
  reminderDate: Date;
}
